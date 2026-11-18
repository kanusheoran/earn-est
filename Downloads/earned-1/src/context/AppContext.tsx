import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  UserRole, 
  StudentProfile, 
  Organization, 
  Opportunity, 
  Application, 
  Project, 
  EarningsRecord, 
  TrainingModule, 
  ComplianceAlert, 
  ProgrammeSettings, 
  NotificationItem,
  ApplicationStatus
} from '../types';
import { 
  INITIAL_STUDENTS, 
  INITIAL_ORGANIZATIONS, 
  INITIAL_OPPORTUNITIES, 
  INITIAL_APPLICATIONS, 
  INITIAL_PROJECTS, 
  INITIAL_EARNINGS, 
  INITIAL_TRAINING_MODULES, 
  INITIAL_COMPLIANCE_ALERTS, 
  INITIAL_PROGRAMME_SETTINGS, 
  INITIAL_NOTIFICATIONS 
} from '../data/mockData';
import { evaluateStudentEligibility, EligibilityResult } from './SafeguardEngine';

export interface ToastMessage {
  id: string;
  type: 'success' | 'warning' | 'error' | 'info';
  title: string;
  description?: string;
}

interface AppContextType {
  // Current user & authentication state
  currentRole: UserRole | null;
  currentStudent: StudentProfile;
  allStudents: StudentProfile[];
  organizations: Organization[];
  currentOrganization: Organization;
  opportunities: Opportunity[];
  applications: Application[];
  projects: Project[];
  earnings: EarningsRecord[];
  trainingModules: TrainingModule[];
  complianceAlerts: ComplianceAlert[];
  programmeSettings: ProgrammeSettings;
  notifications: NotificationItem[];
  toasts: ToastMessage[];

  // Actions
  switchStudent: (studentId: string) => void;
  switchOrganization: (orgId: string) => void;
  loginAsRole: (role: UserRole, customEmail?: string) => void;
  logout: () => void;
  showToast: (title: string, description?: string, type?: ToastMessage['type']) => void;
  dismissToast: (id: string) => void;

  // Domain Actions
  applyForOpportunity: (opportunityId: string, coverMessage: string, portfolioLink?: string, docName?: string) => { success: boolean; message: string };
  submitWorkLog: (projectId: string, hours: number, description: string) => void;
  submitEarningsRecord: (projectId: string, hours: number, amount: number, proofName: string, proofType: 'receipt' | 'bank_statement' | 'invoice', notes?: string) => void;
  verifyEarningsRecord: (recordId: string, approved: boolean, reason?: string) => void;
  createOpportunity: (data: Omit<Opportunity, 'id' | 'createdAt' | 'status' | 'organizationId' | 'organizationName' | 'organizationLogo'>) => void;
  approveOpportunity: (oppId: string, approved: boolean, reason?: string) => void;
  updateApplicationStatus: (applicationId: string, newStatus: ApplicationStatus, notes?: string) => void;
  updateProgrammeSettings: (settings: Partial<ProgrammeSettings>) => void;
  completeTrainingModule: (moduleId: string) => void;
  checkStudentEligibility: (opportunity?: Opportunity, student?: StudentProfile) => EligibilityResult;
  resetAllData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEY_PREFIX = 'earnest_v2_inr_';

function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(STORAGE_KEY_PREFIX + key);
    return item ? JSON.parse(item) : fallback;
  } catch (e) {
    console.error(`Error loading ${key} from storage:`, e);
    return fallback;
  }
}

function saveToStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(STORAGE_KEY_PREFIX + key, JSON.stringify(value));
  } catch (e) {
    console.error(`Error saving ${key} to storage:`, e);
  }
}

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // State
  const [currentRole, setCurrentRole] = useState<UserRole | null>(() => loadFromStorage('role', 'student'));
  const [currentStudentId, setCurrentStudentId] = useState<string>(() => loadFromStorage('currentStudentId', 'std-1'));
  const [currentOrgId, setCurrentOrgId] = useState<string>(() => loadFromStorage('currentOrgId', 'org-1'));

  const [students, setStudents] = useState<StudentProfile[]>(() => loadFromStorage('students', INITIAL_STUDENTS));
  const [organizations, setOrganizations] = useState<Organization[]>(() => loadFromStorage('orgs', INITIAL_ORGANIZATIONS));
  const [opportunities, setOpportunities] = useState<Opportunity[]>(() => loadFromStorage('opportunities', INITIAL_OPPORTUNITIES));
  const [applications, setApplications] = useState<Application[]>(() => loadFromStorage('applications', INITIAL_APPLICATIONS));
  const [projects, setProjects] = useState<Project[]>(() => loadFromStorage('projects', INITIAL_PROJECTS));
  const [earnings, setEarnings] = useState<EarningsRecord[]>(() => loadFromStorage('earnings', INITIAL_EARNINGS));
  const [trainingModules, setTrainingModules] = useState<TrainingModule[]>(() => loadFromStorage('training', INITIAL_TRAINING_MODULES));
  const [complianceAlerts, setComplianceAlerts] = useState<ComplianceAlert[]>(() => loadFromStorage('compliance', INITIAL_COMPLIANCE_ALERTS));
  const [programmeSettings, setProgrammeSettings] = useState<ProgrammeSettings>(() => loadFromStorage('settings', INITIAL_PROGRAMME_SETTINGS));
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => loadFromStorage('notifications', INITIAL_NOTIFICATIONS));
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Sync to local storage
  useEffect(() => { saveToStorage('role', currentRole); }, [currentRole]);
  useEffect(() => { saveToStorage('currentStudentId', currentStudentId); }, [currentStudentId]);
  useEffect(() => { saveToStorage('currentOrgId', currentOrgId); }, [currentOrgId]);
  useEffect(() => { saveToStorage('students', students); }, [students]);
  useEffect(() => { saveToStorage('orgs', organizations); }, [organizations]);
  useEffect(() => { saveToStorage('opportunities', opportunities); }, [opportunities]);
  useEffect(() => { saveToStorage('applications', applications); }, [applications]);
  useEffect(() => { saveToStorage('projects', projects); }, [projects]);
  useEffect(() => { saveToStorage('earnings', earnings); }, [earnings]);
  useEffect(() => { saveToStorage('settings', programmeSettings); }, [programmeSettings]);
  useEffect(() => { saveToStorage('notifications', notifications); }, [notifications]);

  // Derived current user / org
  const currentStudent = students.find(s => s.id === currentStudentId) || students[0];
  const currentOrganization = organizations.find(o => o.id === currentOrgId) || organizations[0];

  // Toast helper
  const showToast = (title: string, description?: string, type: ToastMessage['type'] = 'info') => {
    const id = 'toast-' + Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { id, title, description, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4500);
  };

  const dismissToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Switch student persona
  const switchStudent = (studentId: string) => {
    const found = students.find(s => s.id === studentId);
    if (found) {
      setCurrentStudentId(studentId);
      setCurrentRole('student');
      showToast(`Switched persona to ${found.name}`, `Department: ${found.department}`, 'info');
    }
  };

  const switchOrganization = (orgId: string) => {
    const found = organizations.find(o => o.id === orgId);
    if (found) {
      setCurrentOrgId(orgId);
      setCurrentRole('enterprise');
      showToast(`Switched active enterprise to ${found.name}`, undefined, 'info');
    }
  };

  const loginAsRole = (role: UserRole, customEmail?: string) => {
    setCurrentRole(role);
    if (role === 'student' && customEmail) {
      const match = students.find(s => s.email.toLowerCase() === customEmail.toLowerCase());
      if (match) setCurrentStudentId(match.id);
    }
    showToast(`Logged in as ${role === 'coordinator' ? 'Programme Coordinator' : role === 'enterprise' ? 'Enterprise Partner' : 'Student'}`, undefined, 'success');
  };

  const logout = () => {
    setCurrentRole(null);
    showToast('Signed out successfully', 'You are now on the public portal.', 'info');
  };

  // Safeguard evaluation helper
  const checkStudentEligibility = (opp?: Opportunity, student?: StudentProfile): EligibilityResult => {
    return evaluateStudentEligibility(student || currentStudent, opp, programmeSettings);
  };

  // Submit student application
  const applyForOpportunity = (
    opportunityId: string, 
    coverMessage: string, 
    portfolioLink?: string, 
    docName?: string
  ): { success: boolean; message: string } => {
    const opp = opportunities.find(o => o.id === opportunityId);
    if (!opp) return { success: false, message: 'Opportunity not found' };

    // Prevent duplicate
    const existing = applications.find(a => a.opportunityId === opportunityId && a.studentId === currentStudent.id);
    if (existing) {
      showToast('Already applied', 'You have already submitted an application for this opportunity.', 'warning');
      return { success: false, message: 'You have already applied for this opportunity.' };
    }

    // Backend rule enforcement simulation
    const eligibility = checkStudentEligibility(opp, currentStudent);
    if (!eligibility.canApply) {
      const reasonText = eligibility.reasons.join(' ');
      showToast('Application blocked by safeguard rules', reasonText, 'error');
      
      // Also log a compliance alert for coordinators!
      const newAlert: ComplianceAlert = {
        id: 'cmp-' + Date.now(),
        studentId: currentStudent.id,
        studentName: currentStudent.name,
        department: currentStudent.department,
        type: 'Blocked Application',
        severity: 'Warning',
        currentValue: `Attempted to apply for ${opp.title} (${opp.estimatedHours}h)`,
        permittedValue: `Allowed ${eligibility.remainingMonthlyHours}h remaining`,
        suggestedAction: 'Review student work-hour balance or CGPA safeguard status.',
        date: new Date().toISOString().split('T')[0],
        isResolved: false
      };
      setComplianceAlerts(prev => [newAlert, ...prev]);

      return { success: false, message: reasonText };
    }

    const newApp: Application = {
      id: 'app-' + Date.now(),
      opportunityId: opp.id,
      opportunityTitle: opp.title,
      organizationName: opp.organizationName,
      studentId: currentStudent.id,
      studentName: currentStudent.name,
      studentEmail: currentStudent.email,
      studentDepartment: currentStudent.department,
      studentCgpa: currentStudent.cgpa,
      studentTier: currentStudent.tier,
      monthlyHoursAtApply: currentStudent.monthlyHoursWorked,
      coverMessage,
      portfolioLink: portfolioLink || currentStudent.portfolioUrl,
      supportingDocName: docName || currentStudent.resumeFileName,
      status: 'Applied',
      appliedDate: new Date().toISOString().split('T')[0],
      statusNotes: 'Application submitted and passed automatic academic safeguard check.',
      statusHistory: [
        {
          status: 'Applied',
          timestamp: new Date().toISOString(),
          note: 'Application submitted successfully'
        }
      ]
    };

    setApplications(prev => [newApp, ...prev]);
    showToast('Application Submitted!', `Successfully applied to ${opp.title} at ${opp.organizationName}.`, 'success');
    return { success: true, message: 'Application submitted successfully!' };
  };

  // Submit project work log
  const submitWorkLog = (projectId: string, hours: number, description: string) => {
    const proj = projects.find(p => p.id === projectId);
    if (!proj) return;

    // Check if adding hours would breach student hour cap
    const student = students.find(s => s.id === proj.studentId) || currentStudent;
    const newTotalHours = student.monthlyHoursWorked + hours;

    const newLog = {
      id: 'wl-' + Date.now(),
      projectId,
      studentId: proj.studentId,
      date: new Date().toISOString().split('T')[0],
      hoursWorked: hours,
      taskDescription: description,
      status: 'Approved' as const,
    };

    const updatedProjects = projects.map(p => {
      if (p.id === projectId) {
        const newRecorded = p.recordedHours + hours;
        const newPct = Math.min(100, Math.round((newRecorded / p.assignedHours) * 100));
        return {
          ...p,
          recordedHours: newRecorded,
          completionPercentage: newPct,
          workLogs: [newLog, ...p.workLogs]
        };
      }
      return p;
    });

    setProjects(updatedProjects);

    // Update student monthly hours
    setStudents(prev => prev.map(s => {
      if (s.id === student.id) {
        return { ...s, monthlyHoursWorked: newTotalHours };
      }
      return s;
    }));

    showToast('Work hours recorded', `${hours} hours added to ${proj.title}.`, 'success');
  };

  // Submit student earnings proof
  const submitEarningsRecord = (
    projectId: string, 
    hours: number, 
    amount: number, 
    proofName: string, 
    proofType: 'receipt' | 'bank_statement' | 'invoice', 
    notes?: string
  ) => {
    const proj = projects.find(p => p.id === projectId);
    const newRecord: EarningsRecord = {
      id: 'ern-' + Date.now(),
      studentId: currentStudent.id,
      studentName: currentStudent.name,
      projectId,
      projectTitle: proj ? proj.title : 'External University Project',
      organizationName: proj ? proj.organizationName : 'Enterprise Partner',
      hoursWorked: hours,
      amount,
      date: new Date().toISOString().split('T')[0],
      paymentStatus: 'Processing',
      verificationStatus: 'Submitted for Verification',
      proofFileName: proofName,
      proofFileType: proofType,
      proofNotes: notes,
    };

    setEarnings(prev => [newRecord, ...prev]);

    // Update pending earnings on student profile
    setStudents(prev => prev.map(s => {
      if (s.id === currentStudent.id) {
        return {
          ...s,
          totalEarnings: s.totalEarnings + amount,
          pendingEarnings: s.pendingEarnings + amount
        };
      }
      return s;
    }));

    showToast('Payment proof submitted', 'Your submission is now queued for coordinator verification.', 'success');
  };

  // Coordinator verifies or rejects an earnings record
  const verifyEarningsRecord = (recordId: string, approved: boolean, reason?: string) => {
    const rec = earnings.find(e => e.id === recordId);
    if (!rec) return;

    setEarnings(prev => prev.map(e => {
      if (e.id === recordId) {
        return {
          ...e,
          verificationStatus: approved ? 'Verified' : 'Rejected',
          paymentStatus: approved ? 'Paid' : 'Processing',
          verifiedAt: approved ? new Date().toISOString().split('T')[0] : undefined,
          verifiedBy: approved ? 'Dr. Aris Thorne (Programme Coordinator)' : undefined,
          rejectionReason: approved ? undefined : (reason || 'Documentation did not meet criteria.'),
        };
      }
      return e;
    }));

    // Update student financials
    setStudents(prev => prev.map(s => {
      if (s.id === rec.studentId) {
        if (approved) {
          return {
            ...s,
            pendingEarnings: Math.max(0, s.pendingEarnings - rec.amount),
            verifiedEarnings: s.verifiedEarnings + rec.amount,
          };
        } else {
          return {
            ...s,
            totalEarnings: Math.max(0, s.totalEarnings - rec.amount),
            pendingEarnings: Math.max(0, s.pendingEarnings - rec.amount),
          };
        }
      }
      return s;
    }));

    if (approved) {
      showToast('Earnings Verified', `Approved $${rec.amount} for ${rec.studentName}.`, 'success');
    } else {
      showToast('Submission Rejected', `Rejected record for ${rec.studentName}. Reason recorded.`, 'warning');
    }
  };

  // Enterprise creates opportunity (starts as Pending Approval)
  const createOpportunity = (data: Omit<Opportunity, 'id' | 'createdAt' | 'status' | 'organizationId' | 'organizationName' | 'organizationLogo'>) => {
    const newOpp: Opportunity = {
      ...data,
      id: 'opp-' + Date.now(),
      organizationId: currentOrganization.id,
      organizationName: currentOrganization.name,
      organizationLogo: currentOrganization.logo,
      status: 'Pending Approval', // Awaiting university coordinator review!
      createdAt: new Date().toISOString().split('T')[0],
    };

    setOpportunities(prev => [newOpp, ...prev]);
    showToast('Opportunity Created', 'Submitted to University Coordinators for safeguard review.', 'success');
  };

  // Coordinator approves or rejects opportunity
  const approveOpportunity = (oppId: string, approved: boolean, reason?: string) => {
    setOpportunities(prev => prev.map(o => {
      if (o.id === oppId) {
        return {
          ...o,
          status: approved ? 'Published' : 'Rejected',
          rejectionReason: approved ? undefined : reason,
        };
      }
      return o;
    }));

    if (approved) {
      showToast('Opportunity Published', 'It is now visible to eligible students.', 'success');
    } else {
      showToast('Opportunity Rejected', 'Feedback communicated to enterprise.', 'warning');
    }
  };

  // Enterprise or coordinator updates application status (e.g. Selected -> creates project!)
  const updateApplicationStatus = (applicationId: string, newStatus: ApplicationStatus, notes?: string) => {
    const app = applications.find(a => a.id === applicationId);
    if (!app) return;

    setApplications(prev => prev.map(a => {
      if (a.id === applicationId) {
        return {
          ...a,
          status: newStatus,
          statusNotes: notes || a.statusNotes,
          statusHistory: [
            ...a.statusHistory,
            {
              status: newStatus,
              timestamp: new Date().toISOString(),
              note: notes || `Status changed to ${newStatus}`
            }
          ]
        };
      }
      return a;
    }));

    // If candidate is Selected, automatically generate active Project!
    if (newStatus === 'Selected') {
      const opp = opportunities.find(o => o.id === app.opportunityId);
      const existingProject = projects.find(p => p.opportunityId === app.opportunityId && p.studentId === app.studentId);
      if (!existingProject && opp) {
        const newProj: Project = {
          id: 'proj-' + Date.now(),
          opportunityId: opp.id,
          title: opp.title,
          organizationName: opp.organizationName,
          organizationId: opp.organizationId,
          studentId: app.studentId,
          studentName: app.studentName,
          startDate: new Date().toISOString().split('T')[0],
          deadline: opp.deadline,
          assignedHours: opp.estimatedHours,
          recordedHours: 0,
          completionPercentage: 0,
          paymentAmount: opp.compensation,
          status: 'In Progress',
          deliverablesSummary: opp.deliverables.join('; '),
          workLogs: []
        };
        setProjects(prev => [newProj, ...prev]);
        setStudents(prev => prev.map(s => {
          if (s.id === app.studentId) {
            return { ...s, activeProjectsCount: s.activeProjectsCount + 1 };
          }
          return s;
        }));
      }
    }

    showToast(`Application updated to "${newStatus}"`, `Candidate: ${app.studentName}`, 'info');
  };

  const updateProgrammeSettings = (newSettings: Partial<ProgrammeSettings>) => {
    setProgrammeSettings(prev => ({ ...prev, ...newSettings }));
    showToast('Programme Settings Updated', 'Academic rules and hour limits successfully applied across platform.', 'success');
  };

  const completeTrainingModule = (moduleId: string) => {
    if (currentStudent.completedTrainingIds.includes(moduleId)) {
      showToast('Already completed', 'You have already earned this skill certification.', 'info');
      return;
    }

    const updated = [...currentStudent.completedTrainingIds, moduleId];
    setStudents(prev => prev.map(s => {
      if (s.id === currentStudent.id) {
        return { ...s, completedTrainingIds: updated };
      }
      return s;
    }));

    const mod = trainingModules.find(m => m.id === moduleId);
    showToast('Module Completed! 🎓', `You completed "${mod?.title || 'Training'}"!`, 'success');
  };

  const resetAllData = () => {
    localStorage.clear();
    setStudents(INITIAL_STUDENTS);
    setOrganizations(INITIAL_ORGANIZATIONS);
    setOpportunities(INITIAL_OPPORTUNITIES);
    setApplications(INITIAL_APPLICATIONS);
    setProjects(INITIAL_PROJECTS);
    setEarnings(INITIAL_EARNINGS);
    setTrainingModules(INITIAL_TRAINING_MODULES);
    setComplianceAlerts(INITIAL_COMPLIANCE_ALERTS);
    setProgrammeSettings(INITIAL_PROGRAMME_SETTINGS);
    setNotifications(INITIAL_NOTIFICATIONS);
    setCurrentStudentId('std-1');
    setCurrentOrgId('org-1');
    setCurrentRole('student');
    showToast('System Reset', 'All data reset to fresh demonstration baseline.', 'info');
  };

  return (
    <AppContext.Provider
      value={{
        currentRole,
        currentStudent,
        allStudents: students,
        organizations,
        currentOrganization,
        opportunities,
        applications,
        projects,
        earnings,
        trainingModules,
        complianceAlerts,
        programmeSettings,
        notifications,
        toasts,
        switchStudent,
        switchOrganization,
        loginAsRole,
        logout,
        showToast,
        dismissToast,
        applyForOpportunity,
        submitWorkLog,
        submitEarningsRecord,
        verifyEarningsRecord,
        createOpportunity,
        approveOpportunity,
        updateApplicationStatus,
        updateProgrammeSettings,
        completeTrainingModule,
        checkStudentEligibility,
        resetAllData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
