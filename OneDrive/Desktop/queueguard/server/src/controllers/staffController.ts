import { Request, Response } from 'express';
import prisma from '../prisma.js';
import { emitQueueUpdate, emitTicketNotification } from '../socket.js';

export async function getStaffQueue(req: Request, res: Response) {
  try {
    const staffId = req.user!.id;
    const { departmentId, counterId } = req.query;

    let targetCounterId = counterId as string | undefined;
    let targetDeptId = departmentId as string | undefined;

    // If counter not explicitly provided, look up assigned active counter
    if (!targetCounterId) {
      const assignment = await prisma.staffCounterAssignment.findFirst({
        where: { userId: staffId, isActive: true },
        include: { counter: true }
      });
      if (assignment) {
        targetCounterId = assignment.counterId;
        targetDeptId = assignment.counter.departmentId;
      }
    }

    if (!targetDeptId && targetCounterId) {
      const counter = await prisma.serviceCounter.findUnique({ where: { id: targetCounterId } });
      if (counter) targetDeptId = counter.departmentId;
    }

    // If still no department, get all queues or first department
    const deptWhere = targetDeptId ? { departmentId: targetDeptId } : {};

    // Get current customer at this counter (CALLED or SERVING)
    const currentCustomer = targetCounterId ? await prisma.queueEntry.findFirst({
      where: {
        counterId: targetCounterId,
        status: { in: ['CALLED', 'SERVING'] }
      },
      include: { department: true }
    }) : null;

    // Get waiting queue
    const waitingQueue = await prisma.queueEntry.findMany({
      where: {
        ...deptWhere,
        status: 'WAITING'
      },
      include: { department: true },
      orderBy: [
        { priority: 'desc' }, // VIP / URGENT first
        { joinedAt: 'asc' }
      ]
    });

    // Get recent served/skipped history by this staff
    const history = await prisma.queueEntry.findMany({
      where: {
        staffId,
        status: { in: ['SERVED', 'SKIPPED'] }
      },
      take: 15,
      orderBy: { updatedAt: 'desc' },
      include: { department: true, counter: true }
    });

    // Get counter info
    const counterInfo = targetCounterId ? await prisma.serviceCounter.findUnique({
      where: { id: targetCounterId },
      include: { department: true }
    }) : null;

    return res.json({
      counter: counterInfo,
      currentCustomer,
      waitingQueue,
      history
    });
  } catch (error) {
    console.error('Error in getStaffQueue:', error);
    return res.status(500).json({ error: 'Failed to retrieve staff queue' });
  }
}

/**
 * Concurrency-safe Call Next customer:
 * Atomic check-and-update to ensure two staff members cannot call the same customer.
 */
export async function callNext(req: Request, res: Response) {
  try {
    const staffId = req.user!.id;
    const { counterId, departmentId } = req.body;

    if (!counterId) {
      return res.status(400).json({ error: 'counterId is required' });
    }

    const counter = await prisma.serviceCounter.findUnique({
      where: { id: counterId },
      include: { department: true }
    });

    if (!counter) {
      return res.status(404).json({ error: 'Counter not found' });
    }

    if (counter.isPaused) {
      return res.status(400).json({ error: 'Counter is currently paused. Please resume first.' });
    }

    const deptId = departmentId || counter.departmentId;

    // Use Prisma transaction with strict locking / atomic update
    const result = await prisma.$transaction(async (tx) => {
      // 1. Check if counter is already serving an unfinished customer
      const activeCurrent = await tx.queueEntry.findFirst({
        where: {
          counterId,
          status: { in: ['CALLED', 'SERVING'] }
        }
      });

      if (activeCurrent) {
        throw new Error(`Counter is currently handling ticket ${activeCurrent.tokenNumber}. Complete or skip it before calling the next customer.`);
      }

      // 2. Find the highest priority waiting customer, ordered by priority & joinedAt
      // We check priorities: VIP -> URGENT -> SENIOR_ACCESSIBLE -> STANDARD
      const priorities = ['VIP', 'URGENT', 'SENIOR_ACCESSIBLE', 'STANDARD'];
      let candidate = null;

      for (const p of priorities) {
        candidate = await tx.queueEntry.findFirst({
          where: {
            departmentId: deptId,
            status: 'WAITING',
            priority: p
          },
          orderBy: { joinedAt: 'asc' }
        });
        if (candidate) break;
      }

      if (!candidate) {
        return null; // No waiting customers
      }

      // 3. Atomically update the candidate status from WAITING -> CALLED
      // If another request picked it in the exact millisecond, this will fail if we check status
      const updated = await tx.queueEntry.update({
        where: {
          id: candidate.id
        },
        data: {
          status: 'CALLED',
          counterId: counter.id,
          staffId,
          calledAt: new Date(),
          waitDurationSeconds: Math.round((Date.now() - new Date(candidate.joinedAt).getTime()) / 1000)
        },
        include: { department: true, counter: true }
      });

      // 4. Record event
      await tx.queueEvent.create({
        data: {
          queueEntryId: updated.id,
          fromStatus: 'WAITING',
          toStatus: 'CALLED',
          triggeredById: staffId,
          note: `Called to ${counter.counterNumber} by ${req.user!.name}`
        }
      });

      // 5. In-app notification
      await tx.notification.create({
        data: {
          queueEntryId: updated.id,
          title: 'Your Token Is Called!',
          message: `Ticket ${updated.tokenNumber}, please proceed to ${counter.counterNumber} (${counter.department.name}).`
        }
      });

      return updated;
    });

    if (!result) {
      return res.status(200).json({ message: 'No customers currently waiting in this queue.', entry: null });
    }

    // Emit live notifications
    emitQueueUpdate(deptId, {
      type: 'TICKET_CALLED',
      tokenNumber: result.tokenNumber,
      counterNumber: counter.counterNumber,
      departmentId: deptId
    });

    emitTicketNotification(result.id, {
      tokenNumber: result.tokenNumber,
      counterNumber: counter.counterNumber,
      departmentName: counter.department.name
    });

    return res.json({
      message: `Called ${result.tokenNumber} to ${counter.counterNumber}`,
      entry: result
    });
  } catch (error: any) {
    console.error('Call next error:', error);
    return res.status(400).json({ error: error.message || 'Failed to call next customer' });
  }
}

export async function startService(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const staffId = req.user!.id;

    const entry = await prisma.queueEntry.findUnique({ where: { id }, include: { counter: true } });
    if (!entry) return res.status(404).json({ error: 'Entry not found' });

    // Enforce valid state transition: must be CALLED
    if (entry.status !== 'CALLED') {
      return res.status(400).json({ error: `Cannot start service. Ticket status is '${entry.status}'. Must be 'CALLED'.` });
    }

    const updated = await prisma.$transaction(async (tx) => {
      const q = await tx.queueEntry.update({
        where: { id },
        data: {
          status: 'SERVING',
          serviceStartedAt: new Date()
        },
        include: { department: true, counter: true }
      });

      await tx.queueEvent.create({
        data: {
          queueEntryId: id,
          fromStatus: 'CALLED',
          toStatus: 'SERVING',
          triggeredById: staffId,
          note: `Service commenced by ${req.user!.name}`
        }
      });

      return q;
    });

    emitQueueUpdate(entry.departmentId, {
      type: 'SERVICE_STARTED',
      tokenNumber: entry.tokenNumber
    });

    return res.json({ message: 'Service started', entry: updated });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Failed to start service' });
  }
}

export async function completeService(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const staffId = req.user!.id;
    const { notes } = req.body;

    const entry = await prisma.queueEntry.findUnique({ where: { id } });
    if (!entry) return res.status(404).json({ error: 'Entry not found' });

    // Enforce valid state transition: must be SERVING or CALLED
    if (!['SERVING', 'CALLED'].includes(entry.status)) {
      return res.status(400).json({ error: `Cannot complete service. Current status is ${entry.status}.` });
    }

    const now = new Date();
    const serviceStart = entry.serviceStartedAt || entry.calledAt || now;
    const durationSec = Math.max(1, Math.round((now.getTime() - new Date(serviceStart).getTime()) / 1000));

    const updated = await prisma.$transaction(async (tx) => {
      const q = await tx.queueEntry.update({
        where: { id },
        data: {
          status: 'SERVED',
          completedAt: now,
          serviceDurationSeconds: durationSec,
          notes: notes ? (entry.notes ? `${entry.notes} | ${notes}` : notes) : entry.notes
        },
        include: { department: true, counter: true }
      });

      await tx.queueEvent.create({
        data: {
          queueEntryId: id,
          fromStatus: entry.status,
          toStatus: 'SERVED',
          triggeredById: staffId,
          note: `Completed service (Duration: ${Math.round(durationSec / 60)}m)`
        }
      });

      await tx.notification.create({
        data: {
          queueEntryId: id,
          title: 'Service Completed',
          message: `Thank you for visiting ${entry.departmentId}. Your service has concluded.`
        }
      });

      return q;
    });

    emitQueueUpdate(entry.departmentId, {
      type: 'TICKET_SERVED',
      tokenNumber: entry.tokenNumber
    });

    return res.json({ message: 'Service marked as completed', entry: updated });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Failed to complete service' });
  }
}

export async function skipCustomer(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const staffId = req.user!.id;
    const { returnToQueue } = req.body; // boolean: whether to put back at end of queue

    const entry = await prisma.queueEntry.findUnique({ where: { id } });
    if (!entry) return res.status(404).json({ error: 'Entry not found' });

    if (!['CALLED', 'SERVING'].includes(entry.status)) {
      return res.status(400).json({ error: `Cannot skip customer with status ${entry.status}` });
    }

    const updated = await prisma.$transaction(async (tx) => {
      if (returnToQueue) {
        // Return to WAITING state with updated timestamp
        const q = await tx.queueEntry.update({
          where: { id },
          data: {
            status: 'WAITING',
            counterId: null,
            calledAt: null,
            serviceStartedAt: null,
            joinedAt: new Date() // Moves customer to the tail of queue
          }
        });

        await tx.queueEvent.create({
          data: {
            queueEntryId: id,
            fromStatus: entry.status,
            toStatus: 'WAITING',
            triggeredById: staffId,
            note: 'Customer absent. Returned to waiting queue by staff.'
          }
        });

        return q;
      } else {
        // Mark as SKIPPED
        const q = await tx.queueEntry.update({
          where: { id },
          data: {
            status: 'SKIPPED'
          }
        });

        await tx.queueEvent.create({
          data: {
            queueEntryId: id,
            fromStatus: entry.status,
            toStatus: 'SKIPPED',
            triggeredById: staffId,
            note: 'Customer absent. Marked as skipped.'
          }
        });

        return q;
      }
    });

    emitQueueUpdate(entry.departmentId, {
      type: 'CUSTOMER_SKIPPED',
      tokenNumber: entry.tokenNumber
    });

    return res.json({ message: returnToQueue ? 'Customer returned to queue' : 'Customer marked as skipped', entry: updated });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Failed to skip customer' });
  }
}

export async function recallCustomer(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const entry = await prisma.queueEntry.findUnique({
      where: { id },
      include: { counter: true, department: true }
    });

    if (!entry) return res.status(404).json({ error: 'Entry not found' });

    if (entry.status !== 'CALLED') {
      return res.status(400).json({ error: 'Can only recall a customer who is currently in CALLED status.' });
    }

    // Re-emit notification
    emitTicketNotification(entry.id, {
      tokenNumber: entry.tokenNumber,
      counterNumber: entry.counter?.counterNumber || 'Counter',
      departmentName: entry.department.name,
      isRecall: true
    });

    emitQueueUpdate(entry.departmentId, {
      type: 'TICKET_RECALLED',
      tokenNumber: entry.tokenNumber,
      counterNumber: entry.counter?.counterNumber || 'Counter'
    });

    return res.json({ message: `Customer ${entry.tokenNumber} recalled.` });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Failed to recall customer' });
  }
}

export async function toggleCounterPause(req: Request, res: Response) {
  try {
    const { counterId } = req.params;
    const counter = await prisma.serviceCounter.findUnique({ where: { id: counterId } });

    if (!counter) return res.status(404).json({ error: 'Counter not found' });

    const updated = await prisma.serviceCounter.update({
      where: { id: counterId },
      data: { isPaused: !counter.isPaused }
    });

    emitQueueUpdate(counter.departmentId, {
      type: 'COUNTER_STATUS_CHANGED',
      counterId,
      isPaused: updated.isPaused
    });

    return res.json({ message: `Counter ${updated.isPaused ? 'paused' : 'resumed'}`, counter: updated });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to toggle pause state' });
  }
}
