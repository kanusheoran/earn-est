import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import prisma from '../prisma.js';
import { emitQueueUpdate } from '../socket.js';

export async function getAnalytics(req: Request, res: Response) {
  try {
    const { departmentId, dateFrom, dateTo } = req.query;

    const whereClause: any = {};
    if (departmentId && departmentId !== 'ALL') {
      whereClause.departmentId = departmentId as string;
    }

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    if (dateFrom && dateTo) {
      whereClause.joinedAt = {
        gte: new Date(dateFrom as string),
        lte: new Date(dateTo as string)
      };
    }

    // 1. Total served today
    const servedTodayCount = await prisma.queueEntry.count({
      where: {
        ...whereClause,
        status: 'SERVED',
        completedAt: { gte: todayStart, lte: todayEnd }
      }
    });

    // 2. Active queues (WAITING, CALLED, SERVING)
    const activeEntriesCount = await prisma.queueEntry.count({
      where: {
        ...whereClause,
        status: { in: ['WAITING', 'CALLED', 'SERVING'] }
      }
    });

    // 3. Average Wait Duration & Average Service Duration
    const completedRecords = await prisma.queueEntry.findMany({
      where: {
        ...whereClause,
        status: 'SERVED',
        waitDurationSeconds: { not: null },
        serviceDurationSeconds: { not: null }
      },
      select: {
        waitDurationSeconds: true,
        serviceDurationSeconds: true,
        joinedAt: true,
        department: { select: { name: true, code: true } }
      }
    });

    let avgWaitMinutes = 0;
    let avgServiceMinutes = 0;
    if (completedRecords.length > 0) {
      const totalWait = completedRecords.reduce((a, b) => a + (b.waitDurationSeconds || 0), 0);
      const totalService = completedRecords.reduce((a, b) => a + (b.serviceDurationSeconds || 0), 0);
      avgWaitMinutes = Math.round((totalWait / completedRecords.length) / 60);
      avgServiceMinutes = Math.round((totalService / completedRecords.length) / 60);
    }

    // 4. Queue Abandonment Rate (Cancelled or Skipped / Total)
    const totalEntries = await prisma.queueEntry.count({ where: whereClause });
    const abandonedCount = await prisma.queueEntry.count({
      where: {
        ...whereClause,
        status: { in: ['CANCELLED', 'SKIPPED'] }
      }
    });

    const abandonmentRate = totalEntries > 0 ? Number(((abandonedCount / totalEntries) * 100).toFixed(1)) : 0;

    // 5. Volume by Department
    const allDepartments = await prisma.department.findMany({
      include: {
        _count: {
          select: { queueEntries: true }
        }
      }
    });

    const departmentVolumes = await Promise.all(
      allDepartments.map(async (d) => {
        const served = await prisma.queueEntry.count({
          where: { departmentId: d.id, status: 'SERVED' }
        });
        const waiting = await prisma.queueEntry.count({
          where: { departmentId: d.id, status: 'WAITING' }
        });
        const abandoned = await prisma.queueEntry.count({
          where: { departmentId: d.id, status: { in: ['CANCELLED', 'SKIPPED'] } }
        });

        return {
          departmentName: d.name,
          code: d.code,
          served,
          waiting,
          abandoned,
          total: d._count.queueEntries
        };
      })
    );

    // 6. Hourly traffic distribution today (from 8am to 6pm)
    const hourlyTraffic: { hour: string; count: number }[] = [];
    for (let h = 8; h <= 18; h++) {
      const hStart = new Date(todayStart);
      hStart.setHours(h, 0, 0, 0);
      const hEnd = new Date(todayStart);
      hEnd.setHours(h, 59, 59, 999);

      const count = await prisma.queueEntry.count({
        where: {
          ...whereClause,
          joinedAt: { gte: hStart, lte: hEnd }
        }
      });

      hourlyTraffic.push({
        hour: `${h.toString().padStart(2, '0')}:00`,
        count
      });
    }

    // 7. Recent System Activity
    const recentEvents = await prisma.queueEvent.findMany({
      take: 12,
      orderBy: { createdAt: 'desc' },
      include: {
        queueEntry: {
          select: { tokenNumber: true, customerName: true, department: { select: { code: true } } }
        },
        triggeredBy: {
          select: { name: true, role: true }
        }
      }
    });

    return res.json({
      summary: {
        servedTodayCount,
        activeEntriesCount,
        avgWaitMinutes,
        avgServiceMinutes,
        abandonmentRate,
        totalEntries
      },
      departmentVolumes,
      hourlyTraffic,
      recentEvents
    });
  } catch (error) {
    console.error('Analytics error:', error);
    return res.status(500).json({ error: 'Failed to compute analytics' });
  }
}

// Manage Departments
export async function createDepartment(req: Request, res: Response) {
  try {
    const { name, code, description, estimatedServiceMinutes, maxDailyCapacity, openingTime, closingTime } = req.body;
    if (!name || !code) return res.status(400).json({ error: 'Name and Code are required' });

    const dept = await prisma.department.create({
      data: {
        name,
        code: code.toUpperCase().trim(),
        description,
        estimatedServiceMinutes: Number(estimatedServiceMinutes) || 10,
        maxDailyCapacity: Number(maxDailyCapacity) || 200,
        openingTime: openingTime || '08:00',
        closingTime: closingTime || '18:00'
      }
    });

    emitQueueUpdate(dept.id, { type: 'DEPARTMENT_CREATED' });
    return res.status(201).json(dept);
  } catch (error: any) {
    return res.status(400).json({ error: error.message || 'Department code might already exist' });
  }
}

export async function updateDepartment(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { name, description, estimatedServiceMinutes, maxDailyCapacity, isActive, openingTime, closingTime } = req.body;

    const dept = await prisma.department.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(description !== undefined && { description }),
        ...(estimatedServiceMinutes && { estimatedServiceMinutes: Number(estimatedServiceMinutes) }),
        ...(maxDailyCapacity && { maxDailyCapacity: Number(maxDailyCapacity) }),
        ...(isActive !== undefined && { isActive }),
        ...(openingTime && { openingTime }),
        ...(closingTime && { closingTime })
      }
    });

    emitQueueUpdate(dept.id, { type: 'DEPARTMENT_UPDATED' });
    return res.json(dept);
  } catch (error: any) {
    return res.status(500).json({ error: 'Failed to update department' });
  }
}

// Manage Service Counters
export async function getCounters(req: Request, res: Response) {
  try {
    const counters = await prisma.serviceCounter.findMany({
      include: {
        department: true,
        staffAssignments: {
          where: { isActive: true },
          include: { user: { select: { id: true, name: true, email: true } } }
        }
      },
      orderBy: { counterNumber: 'asc' }
    });
    return res.json(counters);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch counters' });
  }
}

export async function createCounter(req: Request, res: Response) {
  try {
    const { counterNumber, departmentId } = req.body;
    if (!counterNumber || !departmentId) {
      return res.status(400).json({ error: 'counterNumber and departmentId are required' });
    }

    const counter = await prisma.serviceCounter.create({
      data: {
        counterNumber,
        departmentId
      },
      include: { department: true }
    });

    emitQueueUpdate(departmentId, { type: 'COUNTER_CREATED' });
    return res.status(201).json(counter);
  } catch (error: any) {
    return res.status(500).json({ error: 'Failed to create counter' });
  }
}

export async function updateCounter(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { counterNumber, isActive, isPaused, departmentId } = req.body;

    const counter = await prisma.serviceCounter.update({
      where: { id },
      data: {
        ...(counterNumber && { counterNumber }),
        ...(isActive !== undefined && { isActive }),
        ...(isPaused !== undefined && { isPaused }),
        ...(departmentId && { departmentId })
      },
      include: { department: true }
    });

    emitQueueUpdate(counter.departmentId, { type: 'COUNTER_UPDATED' });
    return res.json(counter);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to update counter' });
  }
}

// Manage Staff Accounts & Counter Assignments
export async function getStaffList(req: Request, res: Response) {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        assignedCounters: {
          where: { isActive: true },
          include: {
            counter: {
              include: { department: true }
            }
          }
        }
      },
      orderBy: { name: 'asc' }
    });
    return res.json(users);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch staff list' });
  }
}

export async function createStaff(req: Request, res: Response) {
  try {
    const { name, email, password, role, counterId } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email and password are required' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        role: role || 'STAFF'
      }
    });

    if (counterId) {
      await prisma.staffCounterAssignment.create({
        data: {
          userId: user.id,
          counterId
        }
      });
    }

    return res.status(201).json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    });
  } catch (error: any) {
    return res.status(400).json({ error: 'Email already exists or invalid data' });
  }
}

export async function assignStaffToCounter(req: Request, res: Response) {
  try {
    const { userId, counterId } = req.body;
    if (!userId || !counterId) {
      return res.status(400).json({ error: 'userId and counterId are required' });
    }

    // Set other assignments inactive
    await prisma.staffCounterAssignment.updateMany({
      where: { userId },
      data: { isActive: false }
    });

    // Upsert assignment
    const assignment = await prisma.staffCounterAssignment.upsert({
      where: {
        userId_counterId: {
          userId,
          counterId
        }
      },
      update: { isActive: true },
      create: {
        userId,
        counterId,
        isActive: true
      },
      include: { user: true, counter: true }
    });

    return res.json({ message: 'Staff successfully assigned to counter', assignment });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to assign staff to counter' });
  }
}
