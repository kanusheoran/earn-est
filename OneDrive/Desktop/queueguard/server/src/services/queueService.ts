import prisma from '../prisma.js';

/**
 * Calculates current queue position and estimated waiting time.
 * Position = number of active waiting entries created before or with higher priority
 * Waiting time = position * average service duration (or department configured duration)
 */
export async function calculateQueuePositionAndEstimate(queueEntryId: string) {
  const entry = await prisma.queueEntry.findUnique({
    where: { id: queueEntryId },
    include: { department: true }
  });

  if (!entry) return null;

  if (entry.status !== 'WAITING') {
    return {
      position: 0,
      estimatedMinutes: 0,
      status: entry.status
    };
  }

  // Weight priority: VIP = 4, URGENT = 3, SENIOR_ACCESSIBLE = 2, STANDARD = 1
  const priorityWeight: Record<string, number> = {
    VIP: 4,
    URGENT: 3,
    SENIOR_ACCESSIBLE: 2,
    STANDARD: 1
  };

  const currentPriorityScore = priorityWeight[entry.priority] || 1;

  // Find all WAITING customers in the same department
  const waitingEntries = await prisma.queueEntry.findMany({
    where: {
      departmentId: entry.departmentId,
      status: 'WAITING'
    },
    orderBy: {
      joinedAt: 'asc'
    }
  });

  // Calculate position: entry with higher priority goes before; if same priority, earlier joinedAt goes first
  let position = 0;
  for (const item of waitingEntries) {
    if (item.id === entry.id) {
      break;
    }

    const itemScore = priorityWeight[item.priority] || 1;
    if (itemScore > currentPriorityScore) {
      position++;
    } else if (itemScore === currentPriorityScore) {
      if (new Date(item.joinedAt) <= new Date(entry.joinedAt)) {
        position++;
      }
    }
  }

  // Position is count of customers ahead + 1
  // Calculate average service time from recently served entries in this department (last 20)
  const recentCompleted = await prisma.queueEntry.findMany({
    where: {
      departmentId: entry.departmentId,
      status: 'SERVED',
      serviceDurationSeconds: { not: null }
    },
    take: 20,
    orderBy: { completedAt: 'desc' },
    select: { serviceDurationSeconds: true }
  });

  let avgMinutes = entry.department.estimatedServiceMinutes || 10;
  if (recentCompleted.length >= 3) {
    const totalSec = recentCompleted.reduce((acc, curr) => acc + (curr.serviceDurationSeconds || 0), 0);
    const avgSec = totalSec / recentCompleted.length;
    avgMinutes = Math.max(2, Math.round(avgSec / 60)); // minimum 2 minutes
  }

  // Check how many active counters are serving in this department
  const activeCountersCount = await prisma.serviceCounter.count({
    where: {
      departmentId: entry.departmentId,
      isActive: true,
      isPaused: false
    }
  });

  const divisor = Math.max(1, activeCountersCount);
  const estimatedMinutes = Math.max(1, Math.round((position * avgMinutes) / divisor));

  return {
    position: position + 1, // 1-indexed (1 means you are next)
    customersAhead: position,
    estimatedMinutes,
    status: entry.status,
    activeCounters: divisor
  };
}

/**
 * Generates an incremented human-readable token number, e.g., "QG-REG-042"
 */
export async function generateTokenNumber(departmentCode: string): Promise<string> {
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const countToday = await prisma.queueEntry.count({
    where: {
      department: { code: departmentCode },
      joinedAt: { gte: todayStart }
    }
  });

  const nextSeq = String(countToday + 1).padStart(3, '0');
  return `QG-${departmentCode.toUpperCase()}-${nextSeq}`;
}
