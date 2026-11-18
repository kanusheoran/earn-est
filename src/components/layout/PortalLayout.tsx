import React, { useState } from 'react';
import { Menu, X, Bell, User, Shield, Building2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { StudentSidebar } from './StudentSidebar';
import { CoordinatorSidebar } from './CoordinatorSidebar';
import { EnterpriseSidebar } from './EnterpriseSidebar';
import { ToastContainer } from '../common/ToastNotification';
import { QuickRoleSwitcher } from '../common/QuickRoleSwitcher';

interface PortalLayoutProps {
  role: 'student' | 'coordinator' | 'enterprise';
  children: React.ReactNode;
}

export const PortalLayout: React.FC<PortalLayoutProps> = ({ role, children }) => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const { currentStudent, currentOrganization } = useApp();

  const SidebarComponent = 
    role === 'coordinator' 
      ? CoordinatorSidebar 
      : role === 'enterprise' 
      ? EnterpriseSidebar 
      : StudentSidebar;

  const roleMeta = {
    student: {
      title: 'Student Portal',
      badge: 'Student View',
      bg: 'bg-lavender-100 text-plum-900 border-lavender-200',
      icon: User,
    },
    coordinator: {
      title: 'University Safeguards & Coordinator',
      badge: 'Administrator View',
      bg: 'bg-sage-200 text-forest-800 border-sage-300',
      icon: Shield,
    },
    enterprise: {
      title: 'Enterprise Partner Hub',
      badge: 'Enterprise View',
      bg: 'bg-peach-100 text-charcoal-900 border-peach-200',
      icon: Building2,
    },
  }[role];

  const RoleIcon = roleMeta.icon;

  return (
    <div className="min-h-screen bg-ivory-100 flex flex-col md:flex-row antialiased text-charcoal-900">
      {/* Desktop Persistent Sidebar */}
      <div className="hidden md:block shrink-0 sticky top-0 h-screen z-30">
        <SidebarComponent />
      </div>

      {/* Mobile Top Header */}
      <div className="md:hidden sticky top-0 z-40 bg-white border-b border-lavender-200/90 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setMobileSidebarOpen(true)}
            className="p-1.5 rounded-xl text-charcoal-900 hover:bg-lavender-100 transition-colors"
            aria-label="Open navigation menu"
          >
            <Menu className="w-6 h-6" />
          </button>
          <span className="font-serif font-bold text-lg text-charcoal-900">
            Earnest
          </span>
          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${roleMeta.bg}`}>
            {roleMeta.badge}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {role === 'student' && (
            <img
              src={currentStudent.avatarUrl}
              alt={currentStudent.name}
              className="w-8 h-8 rounded-full object-cover border border-lavender-200"
            />
          )}
          {role === 'enterprise' && (
            <img
              src={currentOrganization.logo}
              alt={currentOrganization.name}
              className="w-8 h-8 rounded-lg object-cover border border-lavender-200"
            />
          )}
        </div>
      </div>

      {/* Mobile Sidebar Slide-out Drawer */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-charcoal-900/50 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileSidebarOpen(false)}
          />
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white z-10 shadow-2xl">
            <div className="absolute top-3 right-3 z-20">
              <button
                onClick={() => setMobileSidebarOpen(false)}
                className="p-1.5 rounded-xl text-charcoal-900 hover:bg-lavender-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <SidebarComponent onCloseMobile={() => setMobileSidebarOpen(false)} />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>

      {/* Shared Toasts and Role Switcher */}
      <ToastContainer />
      <QuickRoleSwitcher />
    </div>
  );
};
