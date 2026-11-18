export type UserRole = 'student' | 'coordinator' | 'enterprise';

export type StudentTier = 'Bronze' | 'Silver' | 'Gold' | 'Platinum';

export type ApplicationStatus = 
  | 'Applied' 
  | 'Under Review' 
  | 'Shortlisted' 
  | 'Selected' 
  | 'Rejected' 
  | 'In Progress' 
  | 'Completed' 
  | 'Withdrawn';

export type OpportunityStatus = 
  | 'Pending Approval' 
  | 'Published' 
  | 'Closed' 
  | 'Draft' 
  | 'Rejected';

export type PaymentVerificationStatus = 
  | 'Pending' 
  | 'Submitted for Verification' 
  | 'Verified' 
  | 'Rejected';

export type WorkArrangement = 'Remote' | 'On-Campus' | 'Hybrid';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatarUrl?: string;
}

export interface StudentProfile extends User {
  studentId: string;
  department: string;
  degree: string;
  semester: number;
  cgpa: number;
  tier: StudentTier;
  monthlyHoursWorked: number;
  monthlyHourLimit: number;
  totalEarnings: number;
  verifiedEarnings: number;
  pendingEarnings: number;
  skills: string[];
  bio: string;
  portfolioUrl?: string;
  resumeFileName?: string;
  completedTrainingIds: string[];
  activeProjectsCount: number;
}

export interface Organization {
  id: string;
  name: string;
  logo: string;
  description: string;
  industry: string;
  website: string;
  contactEmail: string;
  contactPerson: string;
  isVerified: boolean;
  activeOpportunitiesCount: number;
}

export interface Opportunity {
  id: string;
  title: string;
  organizationId: string;
  organizationName: string;
  organizationLogo: string;
  category: string;
  description: string;
  deliverables: string[];
  responsibilities: string[];
  requiredSkills: string[];
  compensation: number;
  compensationType: 'Fixed' | 'Hourly' | 'Milestone';
  estimatedHours: number;
  workArrangement: WorkArrangement;
  deadline: string;
  startDate: string;
  durationWeeks: number;
  minimumCgpa: number;
  requiredTier?: StudentTier;
  requiredTrainingId?: string;
  studentsRequired: number;
  status: OpportunityStatus;
  createdAt: string;
  rejectionReason?: string;
}

export interface Application {
  id: string;
  opportunityId: string;
  opportunityTitle: string;
  organizationName: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  studentDepartment: string;
  studentCgpa: number;
  studentTier: StudentTier;
  monthlyHoursAtApply: number;
  coverMessage: string;
  portfolioLink?: string;
  supportingDocName?: string;
  status: ApplicationStatus;
  appliedDate: string;
  statusNotes?: string;
  statusHistory: {
    status: ApplicationStatus;
    timestamp: string;
    note?: string;
  }[];
}

export interface WorkLogEntry {
  id: string;
  projectId: string;
  studentId: string;
  date: string;
  hoursWorked: number;
  taskDescription: string;
  status: 'Pending' | 'Approved' | 'Flagged';
}

export interface Project {
  id: string;
  opportunityId: string;
  title: string;
  organizationName: string;
  organizationId: string;
  studentId: string;
  studentName: string;
  startDate: string;
  deadline: string;
  assignedHours: number;
  recordedHours: number;
  completionPercentage: number;
  paymentAmount: number;
  status: 'In Progress' | 'Under Review' | 'Completed' | 'Revision Requested';
  deliverablesSummary: string;
  workLogs: WorkLogEntry[];
}

export interface EarningsRecord {
  id: string;
  studentId: string;
  studentName: string;
  projectId: string;
  projectTitle: string;
  organizationName: string;
  hoursWorked: number;
  amount: number;
  date: string;
  paymentStatus: 'Paid' | 'Processing';
  verificationStatus: PaymentVerificationStatus;
  proofFileName?: string;
  proofFileType?: 'receipt' | 'bank_statement' | 'invoice';
  proofNotes?: string;
  verifiedAt?: string;
  verifiedBy?: string;
  rejectionReason?: string;
}

export interface TrainingModule {
  id: string;
  title: string;
  description: string;
  durationMinutes: number;
  category: string;
  isRequired: boolean;
  targetTier?: StudentTier;
  modulesCount: number;
  topics: string[];
}

export interface StudentTrainingProgress {
  moduleId: string;
  completed: boolean;
  progressPercentage: number;
  completedAt?: string;
}

export interface ComplianceAlert {
  id: string;
  studentId: string;
  studentName: string;
  department: string;
  type: 'Hour Cap Exceeded' | 'Approaching Hour Cap' | 'Below Minimum CGPA' | 'Missing Mandatory Training' | 'Blocked Application';
  severity: 'Critical' | 'Warning' | 'Info';
  currentValue: string;
  permittedValue: string;
  suggestedAction: string;
  date: string;
  isResolved: boolean;
}

export interface ProgrammeSettings {
  minimumCgpa: number;
  monthlyHourCap: number;
  maxActiveProjects: number;
  warningHourThresholdPercent: number; // e.g. 75%
  criticalHourThresholdPercent: number; // e.g. 90%
  requireTrainingForFirstOpportunity: boolean;
  tierRequirements: {
    tier: StudentTier;
    minCgpa: number;
    minCompletedProjects: number;
    minTrainingCount: number;
  }[];
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  type: 'application' | 'earning' | 'compliance' | 'project' | 'system';
  linkUrl?: string;
}
