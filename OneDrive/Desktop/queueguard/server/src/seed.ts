import bcrypt from 'bcryptjs';
import prisma from './prisma.js';

async function seed() {
  console.log('🌱 Starting QueueGuard database seed...');

  // Clean old records
  await prisma.notification.deleteMany();
  await prisma.queueEvent.deleteMany();
  await prisma.queueEntry.deleteMany();
  await prisma.staffCounterAssignment.deleteMany();
  await prisma.serviceCounter.deleteMany();
  await prisma.department.deleteMany();
  await prisma.user.deleteMany();

  // 1. Create Default Users (Admin & Staff)
  const passwordHash = await bcrypt.hash('admin123', 10);
  const staffPasswordHash = await bcrypt.hash('staff123', 10);

  const admin = await prisma.user.create({
    data: {
      name: 'System Administrator',
      email: 'admin@queueguard.io',
      passwordHash,
      role: 'ADMIN'
    }
  });

  const staff1 = await prisma.user.create({
    data: {
      name: 'Sarah Connor',
      email: 'sarah@queueguard.io',
      passwordHash: staffPasswordHash,
      role: 'STAFF'
    }
  });

  const staff2 = await prisma.user.create({
    data: {
      name: 'James Rodriguez',
      email: 'james@queueguard.io',
      passwordHash: staffPasswordHash,
      role: 'STAFF'
    }
  });

  console.log('✅ Created users: admin@queueguard.io and staff accounts');

  // 2. Create Departments
  const deptRegistration = await prisma.department.create({
    data: {
      name: 'Student & Customer Registration',
      code: 'REG',
      description: 'Account enrollment, identity validation, and general onboarding.',
      estimatedServiceMinutes: 8,
      maxDailyCapacity: 250,
      openingTime: '08:30',
      closingTime: '17:30'
    }
  });

  const deptFinancial = await prisma.department.create({
    data: {
      name: 'Billing & Financial Services',
      code: 'FIN',
      description: 'Tuition fees, cashier payments, invoice queries, and refunds.',
      estimatedServiceMinutes: 12,
      maxDailyCapacity: 180,
      openingTime: '09:00',
      closingTime: '16:30'
    }
  });

  const deptAdvisory = await prisma.department.create({
    data: {
      name: 'Academic Advisory & Counseling',
      code: 'ADV',
      description: 'Degree planning, course changes, and special accommodations.',
      estimatedServiceMinutes: 15,
      maxDailyCapacity: 100,
      openingTime: '09:00',
      closingTime: '17:00'
    }
  });

  const deptSupport = await prisma.department.create({
    data: {
      name: 'Technical Support & Badging',
      code: 'TEC',
      description: 'Student cards, campus access, portal passwords, and IT queries.',
      estimatedServiceMinutes: 6,
      maxDailyCapacity: 300,
      openingTime: '08:00',
      closingTime: '18:00'
    }
  });

  console.log('✅ Created 4 core departments');

  // 3. Create Service Counters
  const counter1 = await prisma.serviceCounter.create({
    data: {
      counterNumber: 'Counter 01',
      departmentId: deptRegistration.id
    }
  });

  const counter2 = await prisma.serviceCounter.create({
    data: {
      counterNumber: 'Counter 02',
      departmentId: deptRegistration.id
    }
  });

  const counter3 = await prisma.serviceCounter.create({
    data: {
      counterNumber: 'Window A',
      departmentId: deptFinancial.id
    }
  });

  const counter4 = await prisma.serviceCounter.create({
    data: {
      counterNumber: 'Station 101',
      departmentId: deptSupport.id
    }
  });

  // 4. Assign Staff to Counters
  await prisma.staffCounterAssignment.create({
    data: {
      userId: staff1.id,
      counterId: counter1.id,
      isActive: true
    }
  });

  await prisma.staffCounterAssignment.create({
    data: {
      userId: staff2.id,
      counterId: counter3.id,
      isActive: true
    }
  });

  console.log('✅ Service counters & staff assignments established');

  // 5. Seed realistic Queue entries with historical service events for live analytics
  const now = new Date();
  
  // Previously served entries for statistics
  for (let i = 1; i <= 14; i++) {
    const pastTime = new Date(now.getTime() - (15 - i) * 20 * 60 * 1000);
    const completedTime = new Date(pastTime.getTime() + 8 * 60 * 1000);

    await prisma.queueEntry.create({
      data: {
        tokenNumber: `QG-REG-${String(i).padStart(3, '0')}`,
        secretToken: `secret-historical-reg-${i}`,
        customerName: `Student ${i}`,
        departmentId: deptRegistration.id,
        status: 'SERVED',
        priority: 'STANDARD',
        counterId: counter1.id,
        staffId: staff1.id,
        joinedAt: pastTime,
        calledAt: pastTime,
        serviceStartedAt: pastTime,
        completedAt: completedTime,
        waitDurationSeconds: 180 + (i * 15),
        serviceDurationSeconds: 480 + (i * 20)
      }
    });
  }

  // Active / Waiting entries
  const activeEntries = [
    { name: 'Alice Walker', dept: deptRegistration.id, priority: 'VIP', status: 'SERVING', token: 'QG-REG-015', counter: counter1.id },
    { name: 'Michael Chang', dept: deptRegistration.id, priority: 'URGENT', status: 'WAITING', token: 'QG-REG-016' },
    { name: 'Elena Rostova', dept: deptRegistration.id, priority: 'STANDARD', status: 'WAITING', token: 'QG-REG-017' },
    { name: 'David Kim', dept: deptRegistration.id, priority: 'STANDARD', status: 'WAITING', token: 'QG-REG-018' },
    { name: 'Sophia Martinez', dept: deptFinancial.id, priority: 'STANDARD', status: 'CALLED', token: 'QG-FIN-001', counter: counter3.id },
    { name: 'Marcus Johnson', dept: deptFinancial.id, priority: 'SENIOR_ACCESSIBLE', status: 'WAITING', token: 'QG-FIN-002' },
    { name: 'Liam Davies', dept: deptSupport.id, priority: 'STANDARD', status: 'WAITING', token: 'QG-TEC-001' }
  ];

  for (const entry of activeEntries) {
    const q = await prisma.queueEntry.create({
      data: {
        tokenNumber: entry.token,
        secretToken: `secret-${entry.token.toLowerCase()}`,
        customerName: entry.name,
        departmentId: entry.dept,
        status: entry.status,
        priority: entry.priority,
        counterId: entry.counter || null,
        staffId: entry.counter ? staff1.id : null,
        calledAt: entry.status !== 'WAITING' ? new Date() : null,
        serviceStartedAt: entry.status === 'SERVING' ? new Date() : null
      }
    });

    await prisma.queueEvent.create({
      data: {
        queueEntryId: q.id,
        toStatus: entry.status,
        note: `Initial setup: ${entry.status}`
      }
    });
  }

  console.log('✅ Seed complete with live mock data & test tickets!');
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
