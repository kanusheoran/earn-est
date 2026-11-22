export type Role = 'CUSTOMER' | 'STAFF' | 'ADMIN';

export type QueueStatus = 'WAITING' | 'CALLED' | 'SERVING' | 'SERVED' | 'SKIPPED' | 'CANCELLED';

export type PriorityLevel = 'STANDARD' | 'SENIOR_ACCESSIBLE' | 'URGENT' | 'VIP';

export interface Department {
  id: string;
  name: string;
  code: string;
  description?: string;
  isActive: boolean;
  estimatedServiceMinutes: number;
  maxDailyCapacity: number;
  openingTime: string;
  closingTime: string;
  waitingCount?: number;
  activeCountersCount?: number;
  currentServingToken?: string | null;
  currentServingCounter?: string | null;
}

export interface ServiceCounter {
  id: string;
  counterNumber: string;
  departmentId: string;
  isActive: boolean;
  isPaused: boolean;
  department?: Department;
  staffAssignments?: Array<{
    user: { id: string; name: string; email: string };
  }>;
}

export interface QueueEntry {
  id: string;
  tokenNumber: string;
  secretToken: string;
  customerName: string;
  customerPhone?: string;
  customerEmail?: string;
  departmentId: string;
  department?: Department;
  counterId?: string;
  counter?: ServiceCounter;
  counterNumber?: string;
  status: QueueStatus;
  priority: PriorityLevel;
  joinedAt: string;
  calledAt?: string;
  serviceStartedAt?: string;
  completedAt?: string;
  cancelledAt?: string;
  waitDurationSeconds?: number;
  serviceDurationSeconds?: number;
  notes?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  assignedCounters?: Array<{
    counter: ServiceCounter;
  }>;
}

export interface TrackingData {
  position: number;
  customersAhead: number;
  estimatedMinutes: number;
  status: QueueStatus;
  activeCounters: number;
}
