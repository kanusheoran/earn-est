import { Request, Response } from 'express';
import prisma from '../prisma.js';

export async function getLiveDisplayData(req: Request, res: Response) {
  try {
    // Current serving or called tokens across all counters
    const activeCalls = await prisma.queueEntry.findMany({
      where: {
        status: { in: ['CALLED', 'SERVING'] }
      },
      include: {
        counter: true,
        department: true
      },
      orderBy: { calledAt: 'desc' },
      take: 8
    });

    // Recent 10 served tokens
    const recentServed = await prisma.queueEntry.findMany({
      where: {
        status: 'SERVED'
      },
      include: {
        counter: true,
        department: true
      },
      orderBy: { completedAt: 'desc' },
      take: 6
    });

    // Summary count by department
    const departments = await prisma.department.findMany({
      where: { isActive: true },
      include: {
        _count: {
          select: {
            queueEntries: {
              where: { status: 'WAITING' }
            }
          }
        }
      }
    });

    return res.json({
      activeCalls: activeCalls.map(c => ({
        id: c.id,
        tokenNumber: c.tokenNumber,
        status: c.status,
        customerName: c.customerName,
        counterNumber: c.counter?.counterNumber || 'Counter',
        departmentName: c.department.name,
        departmentCode: c.department.code,
        calledAt: c.calledAt
      })),
      recentServed: recentServed.map(s => ({
        tokenNumber: s.tokenNumber,
        counterNumber: s.counter?.counterNumber || 'Counter',
        departmentCode: s.department.code
      })),
      departments: departments.map(d => ({
        name: d.name,
        code: d.code,
        waitingCount: d._count.queueEntries
      })),
      timestamp: new Date()
    });
  } catch (error) {
    console.error('Display data error:', error);
    return res.status(500).json({ error: 'Failed to fetch display data' });
  }
}
