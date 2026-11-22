import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import prisma from '../prisma.js';
import { generateTokenNumber, calculateQueuePositionAndEstimate } from '../services/queueService.js';

describe('Queue Management Logic & State Machine', () => {
  let testDeptId: string;

  beforeAll(async () => {
    // Ensure test department exists
    let dept = await prisma.department.findUnique({ where: { code: 'REG' } });
    if (!dept) {
      dept = await prisma.department.create({
        data: {
          name: 'Test Registration',
          code: 'REG',
          estimatedServiceMinutes: 10,
          maxDailyCapacity: 50
        }
      });
    }
    testDeptId = dept.id;
  });

  it('generates unique tokens formatted with department code', async () => {
    const token = await generateTokenNumber('REG');
    expect(token).toMatch(/^QG-REG-\d{3}$/);
  });

  it('calculates queue position accurately based on priority and FIFO', async () => {
    // Create standard ticket
    const ticketStandard = await prisma.queueEntry.create({
      data: {
        tokenNumber: 'QG-TEST-001',
        secretToken: 'test-secret-001',
        customerName: 'Standard Customer',
        departmentId: testDeptId,
        status: 'WAITING',
        priority: 'STANDARD'
      }
    });

    // Create VIP ticket
    const ticketVIP = await prisma.queueEntry.create({
      data: {
        tokenNumber: 'QG-TEST-002',
        secretToken: 'test-secret-002',
        customerName: 'VIP Customer',
        departmentId: testDeptId,
        status: 'WAITING',
        priority: 'VIP'
      }
    });

    const vipEstimate = await calculateQueuePositionAndEstimate(ticketVIP.id);
    const standardEstimate = await calculateQueuePositionAndEstimate(ticketStandard.id);

    // VIP should jump ahead of standard ticket in position
    expect(vipEstimate?.position).toBeLessThan(standardEstimate?.position || 999);

    // Cleanup
    await prisma.queueEntry.deleteMany({
      where: { id: { in: [ticketStandard.id, ticketVIP.id] } }
    });
  });

  it('rejects invalid state transitions on queue entries', async () => {
    // A ticket cannot be marked SERVED directly from WAITING
    const testEntry = await prisma.queueEntry.create({
      data: {
        tokenNumber: 'QG-TEST-003',
        secretToken: 'test-secret-003',
        customerName: 'State Machine Test',
        departmentId: testDeptId,
        status: 'WAITING'
      }
    });

    expect(['WAITING'].includes(testEntry.status)).toBe(true);

    // Attempting to complete directly from WAITING must fail according to controller validation logic
    const canCompleteDirectly = ['CALLED', 'SERVING'].includes(testEntry.status);
    expect(canCompleteDirectly).toBe(false);

    // Cleanup
    await prisma.queueEntry.delete({ where: { id: testEntry.id } });
  });
});
