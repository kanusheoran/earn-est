import { Request, Response } from 'express';
import { z } from 'zod';
import crypto from 'crypto';
import prisma from '../prisma.js';
import { generateTokenNumber, calculateQueuePositionAndEstimate } from '../services/queueService.js';
import { emitQueueUpdate, emitTicketNotification } from '../socket.js';

const joinQueueSchema = z.object({
  departmentId: z.string().min(1, 'Department ID is required'),
  customerName: z.string().min(2, 'Name must be at least 2 characters'),
  customerPhone: z.string().optional(),
  customerEmail: z.string().email().optional().or(z.literal('')),
  priority: z.enum(['STANDARD', 'SENIOR_ACCESSIBLE', 'URGENT', 'VIP']).default('STANDARD'),
  notes: z.string().optional()
});

export async function getDepartments(req: Request, res: Response) {
  try {
    const departments = await prisma.department.findMany({
      where: { isActive: true },
      include: {
        counters: {
          where: { isActive: true }
        },
        _count: {
          select: {
            queueEntries: {
              where: { status: 'WAITING' }
            }
          }
        }
      },
      orderBy: { name: 'asc' }
    });

    const enriched = await Promise.all(
      departments.map(async (dept) => {
        // Find current serving token
        const serving = await prisma.queueEntry.findFirst({
          where: {
            departmentId: dept.id,
            status: { in: ['CALLED', 'SERVING'] }
          },
          orderBy: { calledAt: 'desc' },
          select: { tokenNumber: true, counter: { select: { counterNumber: true } } }
        });

        return {
          id: dept.id,
          name: dept.name,
          code: dept.code,
          description: dept.description,
          isActive: dept.isActive,
          estimatedServiceMinutes: dept.estimatedServiceMinutes,
          maxDailyCapacity: dept.maxDailyCapacity,
          openingTime: dept.openingTime,
          closingTime: dept.closingTime,
          activeCountersCount: dept.counters.filter(c => !c.isPaused).length,
          waitingCount: dept._count.queueEntries,
          currentServingToken: serving ? serving.tokenNumber : null,
          currentServingCounter: serving?.counter ? serving.counter.counterNumber : null
        };
      })
    );

    return res.json(enriched);
  } catch (error) {
    console.error('Error fetching departments:', error);
    return res.status(500).json({ error: 'Failed to retrieve departments' });
  }
}

export async function getDepartmentQueueStatus(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const department = await prisma.department.findUnique({
      where: { id },
      include: {
        counters: true
      }
    });

    if (!department) {
      return res.status(404).json({ error: 'Department not found' });
    }

    const waitingCount = await prisma.queueEntry.count({
      where: { departmentId: id, status: 'WAITING' }
    });

    const currentlyServing = await prisma.queueEntry.findMany({
      where: {
        departmentId: id,
        status: { in: ['CALLED', 'SERVING'] }
      },
      include: { counter: true },
      orderBy: { calledAt: 'desc' }
    });

    return res.json({
      department: {
        id: department.id,
        name: department.name,
        code: department.code,
        estimatedServiceMinutes: department.estimatedServiceMinutes
      },
      waitingCount,
      currentlyServing: currentlyServing.map(s => ({
        tokenNumber: s.tokenNumber,
        status: s.status,
        counterNumber: s.counter?.counterNumber || 'Counter'
      }))
    });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to get queue status' });
  }
}

export async function joinQueue(req: Request, res: Response) {
  try {
    const parse = joinQueueSchema.safeParse(req.body);
    if (!parse.success) {
      return res.status(400).json({ error: 'Invalid input', details: parse.error.issues });
    }

    const { departmentId, customerName, customerPhone, customerEmail, priority, notes } = parse.data;

    // Validate department exists and is active
    const department = await prisma.department.findUnique({
      where: { id: departmentId }
    });

    if (!department || !department.isActive) {
      return res.status(400).json({ error: 'The selected service department is currently inactive or not available.' });
    }

    // Check daily capacity limit
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const countToday = await prisma.queueEntry.count({
      where: {
        departmentId,
        joinedAt: { gte: todayStart }
      }
    });

    if (countToday >= department.maxDailyCapacity) {
      return res.status(429).json({ 
        error: `Daily capacity reached (${department.maxDailyCapacity} tickets). Please join during next opening hours.` 
      });
    }

    // Generate unique token number and secret tracking token
    const tokenNumber = await generateTokenNumber(department.code);
    const secretToken = crypto.randomBytes(24).toString('hex');

    // Create entry in database with event
    const newEntry = await prisma.$transaction(async (tx) => {
      const entry = await tx.queueEntry.create({
        data: {
          tokenNumber,
          secretToken,
          customerName,
          customerPhone: customerPhone || null,
          customerEmail: customerEmail || null,
          departmentId,
          priority,
          notes: notes || null,
          status: 'WAITING'
        },
        include: { department: true }
      });

      await tx.queueEvent.create({
        data: {
          queueEntryId: entry.id,
          toStatus: 'WAITING',
          note: `Customer joined queue as ${priority} priority`
        }
      });

      await tx.notification.create({
        data: {
          queueEntryId: entry.id,
          title: 'Ticket Generated',
          message: `Your token ${tokenNumber} has been generated. You are now in the queue.`
        }
      });

      return entry;
    });

    // Calculate position and estimate
    const positionData = await calculateQueuePositionAndEstimate(newEntry.id);

    // Emit live update
    emitQueueUpdate(departmentId, {
      type: 'CUSTOMER_JOINED',
      tokenNumber,
      departmentId
    });

    return res.status(201).json({
      message: 'Successfully joined the queue',
      entry: {
        id: newEntry.id,
        tokenNumber: newEntry.tokenNumber,
        secretToken: newEntry.secretToken,
        customerName: newEntry.customerName,
        departmentName: department.name,
        departmentCode: department.code,
        joinedAt: newEntry.joinedAt,
        status: newEntry.status,
        priority: newEntry.priority
      },
      tracking: positionData
    });
  } catch (error: any) {
    console.error('Error joining queue:', error);
    return res.status(500).json({ error: error.message || 'Failed to join the queue.' });
  }
}

export async function getQueueByToken(req: Request, res: Response) {
  try {
    const { token } = req.params; // Can be secretToken or tokenNumber

    const entry = await prisma.queueEntry.findFirst({
      where: {
        OR: [
          { secretToken: token },
          { tokenNumber: token.toUpperCase() }
        ]
      },
      include: {
        department: true,
        counter: true,
        notifications: {
          orderBy: { sentAt: 'desc' },
          take: 5
        }
      }
    });

    if (!entry) {
      return res.status(404).json({ error: 'Queue ticket not found.' });
    }

    const estimate = await calculateQueuePositionAndEstimate(entry.id);

    // Find currently serving in the department
    const currentlyServing = await prisma.queueEntry.findFirst({
      where: {
        departmentId: entry.departmentId,
        status: { in: ['CALLED', 'SERVING'] }
      },
      orderBy: { calledAt: 'desc' },
      select: { tokenNumber: true, counter: { select: { counterNumber: true } } }
    });

    return res.json({
      entry: {
        id: entry.id,
        tokenNumber: entry.tokenNumber,
        secretToken: entry.secretToken,
        customerName: entry.customerName,
        status: entry.status,
        priority: entry.priority,
        joinedAt: entry.joinedAt,
        calledAt: entry.calledAt,
        serviceStartedAt: entry.serviceStartedAt,
        completedAt: entry.completedAt,
        counterNumber: entry.counter?.counterNumber || null,
        department: {
          id: entry.department.id,
          name: entry.department.name,
          code: entry.department.code
        }
      },
      tracking: estimate,
      currentServingToken: currentlyServing ? currentlyServing.tokenNumber : null,
      currentServingCounter: currentlyServing?.counter ? currentlyServing.counter.counterNumber : null,
      notifications: entry.notifications
    });
  } catch (error) {
    console.error('Error fetching ticket status:', error);
    return res.status(500).json({ error: 'Failed to retrieve ticket status.' });
  }
}

export async function cancelQueueEntry(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { secretToken } = req.body;

    const entry = await prisma.queueEntry.findUnique({
      where: { id }
    });

    if (!entry) {
      return res.status(404).json({ error: 'Queue entry not found' });
    }

    // Customer cancellation requires matching secretToken; admin or staff can also cancel
    if (secretToken && entry.secretToken !== secretToken && req.user?.role !== 'ADMIN' && req.user?.role !== 'STAFF') {
      return res.status(403).json({ error: 'Unauthorized to cancel this ticket' });
    }

    if (['SERVED', 'CANCELLED'].includes(entry.status)) {
      return res.status(400).json({ error: `Ticket is already ${entry.status.toLowerCase()}` });
    }

    const updated = await prisma.$transaction(async (tx) => {
      const q = await tx.queueEntry.update({
        where: { id },
        data: {
          status: 'CANCELLED',
          cancelledAt: new Date()
        }
      });

      await tx.queueEvent.create({
        data: {
          queueEntryId: id,
          fromStatus: entry.status,
          toStatus: 'CANCELLED',
          note: req.user ? `Cancelled by staff/admin ${req.user.name}` : 'Cancelled by customer'
        }
      });

      return q;
    });

    emitQueueUpdate(entry.departmentId, {
      type: 'TICKET_CANCELLED',
      tokenNumber: entry.tokenNumber
    });

    return res.json({ message: 'Queue ticket successfully cancelled', entry: updated });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to cancel queue ticket' });
  }
}
