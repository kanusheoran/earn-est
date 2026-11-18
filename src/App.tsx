import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { PortalLayout } from './components/layout/PortalLayout';
import { ProtectedRoute } from './components/layout/ProtectedRoute';

// Public Pages
import { LandingPage } from './pages/public/LandingPage';
import { StudentLogin } from './pages/public/StudentLogin';
import { CoordinatorLogin } from './pages/public/CoordinatorLogin';
import { EnterpriseLogin } from './pages/public/EnterpriseLogin';
import { StudentSignup } from './pages/public/StudentSignup';
import { EnterpriseSignup } from './pages/public/EnterpriseSignup';

// Student Portal Pages
import { StudentDashboard } from './pages/student/StudentDashboard';
import { OpportunitiesPage } from './pages/student/OpportunitiesPage';
import { OpportunityDetailsPage } from './pages/student/OpportunityDetailsPage';
import { ApplicationsPage } from './pages/student/ApplicationsPage';
import { ProjectsPage } from './pages/student/ProjectsPage';
import { EarningsPage } from './pages/student/EarningsPage';
import { TrainingPage } from './pages/student/TrainingPage';
import { ProfilePage } from './pages/student/ProfilePage';
import { NotificationsPage } from './pages/student/NotificationsPage';

// Coordinator Portal Pages
import { CoordinatorDashboard } from './pages/coordinator/CoordinatorDashboard';
import { StudentsPage } from './pages/coordinator/StudentsPage';
import { OpportunitiesApprovalPage } from './pages/coordinator/OpportunitiesApprovalPage';
import { ApplicationsReviewPage } from './pages/coordinator/ApplicationsReviewPage';
import { EarningsVerificationPage } from './pages/coordinator/EarningsVerificationPage';
import { CompliancePage } from './pages/coordinator/CompliancePage';
import { ReportsAnalyticsPage } from './pages/coordinator/ReportsAnalyticsPage';
import { ProgrammeSettingsPage } from './pages/coordinator/ProgrammeSettingsPage';

// Enterprise Portal Pages
import { EnterpriseDashboard } from './pages/enterprise/EnterpriseDashboard';
import { PostOpportunityPage } from './pages/enterprise/PostOpportunityPage';
import { MyOpportunitiesPage } from './pages/enterprise/MyOpportunitiesPage';
import { ApplicantsPage } from './pages/enterprise/ApplicantsPage';
import { EnterpriseProjectsPage } from './pages/enterprise/EnterpriseProjectsPage';
import { EnterpriseProfilePage } from './pages/enterprise/EnterpriseProfilePage';

export function App() {
  return (
    <AppProvider>
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/student/login" element={<StudentLogin />} />
          <Route path="/coordinator/login" element={<CoordinatorLogin />} />
          <Route path="/enterprise/login" element={<EnterpriseLogin />} />
          <Route path="/student/signup" element={<StudentSignup />} />
          <Route path="/enterprise/signup" element={<EnterpriseSignup />} />

          {/* Student Portal (Protected) */}
          <Route
            path="/student/dashboard"
            element={
              <ProtectedRoute allowedRole="student">
                <PortalLayout role="student">
                  <StudentDashboard />
                </PortalLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/opportunities"
            element={
              <ProtectedRoute allowedRole="student">
                <PortalLayout role="student">
                  <OpportunitiesPage />
                </PortalLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/opportunities/:id"
            element={
              <ProtectedRoute allowedRole="student">
                <PortalLayout role="student">
                  <OpportunityDetailsPage />
                </PortalLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/applications"
            element={
              <ProtectedRoute allowedRole="student">
                <PortalLayout role="student">
                  <ApplicationsPage />
                </PortalLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/projects"
            element={
              <ProtectedRoute allowedRole="student">
                <PortalLayout role="student">
                  <ProjectsPage />
                </PortalLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/earnings"
            element={
              <ProtectedRoute allowedRole="student">
                <PortalLayout role="student">
                  <EarningsPage />
                </PortalLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/training"
            element={
              <ProtectedRoute allowedRole="student">
                <PortalLayout role="student">
                  <TrainingPage />
                </PortalLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/profile"
            element={
              <ProtectedRoute allowedRole="student">
                <PortalLayout role="student">
                  <ProfilePage />
                </PortalLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/notifications"
            element={
              <ProtectedRoute allowedRole="student">
                <PortalLayout role="student">
                  <NotificationsPage />
                </PortalLayout>
              </ProtectedRoute>
            }
          />

          {/* Coordinator Portal (Protected) */}
          <Route
            path="/coordinator/dashboard"
            element={
              <ProtectedRoute allowedRole="coordinator">
                <PortalLayout role="coordinator">
                  <CoordinatorDashboard />
                </PortalLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/coordinator/students"
            element={
              <ProtectedRoute allowedRole="coordinator">
                <PortalLayout role="coordinator">
                  <StudentsPage />
                </PortalLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/coordinator/opportunities"
            element={
              <ProtectedRoute allowedRole="coordinator">
                <PortalLayout role="coordinator">
                  <OpportunitiesApprovalPage />
                </PortalLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/coordinator/applications"
            element={
              <ProtectedRoute allowedRole="coordinator">
                <PortalLayout role="coordinator">
                  <ApplicationsReviewPage />
                </PortalLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/coordinator/earnings"
            element={
              <ProtectedRoute allowedRole="coordinator">
                <PortalLayout role="coordinator">
                  <EarningsVerificationPage />
                </PortalLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/coordinator/compliance"
            element={
              <ProtectedRoute allowedRole="coordinator">
                <PortalLayout role="coordinator">
                  <CompliancePage />
                </PortalLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/coordinator/training-tiers"
            element={
              <ProtectedRoute allowedRole="coordinator">
                <PortalLayout role="coordinator">
                  <TrainingPage />
                </PortalLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/coordinator/reports"
            element={
              <ProtectedRoute allowedRole="coordinator">
                <PortalLayout role="coordinator">
                  <ReportsAnalyticsPage />
                </PortalLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/coordinator/settings"
            element={
              <ProtectedRoute allowedRole="coordinator">
                <PortalLayout role="coordinator">
                  <ProgrammeSettingsPage />
                </PortalLayout>
              </ProtectedRoute>
            }
          />

          {/* Enterprise Portal (Protected) */}
          <Route
            path="/enterprise/dashboard"
            element={
              <ProtectedRoute allowedRole="enterprise">
                <PortalLayout role="enterprise">
                  <EnterpriseDashboard />
                </PortalLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/enterprise/post-opportunity"
            element={
              <ProtectedRoute allowedRole="enterprise">
                <PortalLayout role="enterprise">
                  <PostOpportunityPage />
                </PortalLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/enterprise/opportunities"
            element={
              <ProtectedRoute allowedRole="enterprise">
                <PortalLayout role="enterprise">
                  <MyOpportunitiesPage />
                </PortalLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/enterprise/applicants"
            element={
              <ProtectedRoute allowedRole="enterprise">
                <PortalLayout role="enterprise">
                  <ApplicantsPage />
                </PortalLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/enterprise/projects"
            element={
              <ProtectedRoute allowedRole="enterprise">
                <PortalLayout role="enterprise">
                  <EnterpriseProjectsPage />
                </PortalLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/enterprise/profile"
            element={
              <ProtectedRoute allowedRole="enterprise">
                <PortalLayout role="enterprise">
                  <EnterpriseProfilePage />
                </PortalLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/enterprise/settings"
            element={
              <ProtectedRoute allowedRole="enterprise">
                <PortalLayout role="enterprise">
                  <EnterpriseProfilePage />
                </PortalLayout>
              </ProtectedRoute>
            }
          />

          {/* Catch-all redirect to public landing */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;
