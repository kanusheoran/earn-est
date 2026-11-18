import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Briefcase, 
  FileCheck2, 
  BadgePercent, 
  ShieldAlert, 
  BarChart3, 
  LogOut,
  SlidersHorizontal
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { BrandLogo } from '../common/BrandLogo';

export const CoordinatorSidebar: React.FC<{ onCloseMobile?: () => void }> = ({ onCloseMobile }) => {
  const { earnings, complianceAlerts, logout, opportunities } = useApp();

  const pendingEarningsCount = earnings.filter(e => e.verificationStatus === 'Submitted for Verification').length;
  const criticalComplianceCount = complianceAlerts.filter(c => !c.isResolved && c.severity === 'Critical').length;
  const pendingOppCount = opportunities.filter(o => o.status === 'Pending Approval').length;

  const links = [
    { label: 'Overview', to: '/coordinator/dashboard', icon: LayoutDashboard },
    { label: 'Students', to: '/coordinator/students', icon: Users },
    { 
      label: 'Opportunities', 
      to: '/coordinator/opportunities', 
      icon: Briefcase,
      badge: pendingOppCount > 0 ? pendingOppCount : undefined,
    },
    { label: 'Applications', to: '/coordinator/applications', icon: FileCheck2 },
    { 
      label: 'Earnings', 
      to: '/coordinator/earnings', 
      icon: BadgePercent,
      badge: pendingEarningsCount > 0 ? pendingEarningsCount : undefined,
    },
    { 
      label: 'Compliance', 
      to: '/coordinator/compliance', 
      icon: ShieldAlert,
      badge: criticalComplianceCount > 0 ? criticalComplianceCount : undefined,
    },
    { label: 'Reports', to: '/coordinator/reports', icon: BarChart3 },
  ];

  return (
    <aside className="w-60 bg-white border-r border-lavender-200/80 flex flex-col h-full min-h-screen">
      {/* Brand Header */}
      <div className="p-5 border-b border-ivory-200/80">
        <BrandLogo size="md" showTagline={false} linkTo="/coordinator/dashboard" />
        <span className="text-[10px] font-bold uppercase tracking-wider text-forest-700 bg-sage-100 px-2 py-0.5 rounded-md mt-2 inline-block">
          Coordinator Portal
        </span>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={onCloseMobile}
              className={({ isActive }) =>
                `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-colors ${
                  isActive
                    ? 'bg-sage-200 text-forest-800 font-semibold'
                    : 'text-charcoal-800 hover:bg-ivory-100 hover:text-forest-700'
                }`
              }
            >
              <div className="flex items-center gap-3">
                <Icon className="w-4 h-4 text-forest-600 shrink-0" />
                <span>{link.label}</span>
              </div>
              {link.badge !== undefined && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-plum-500 text-white">
                  {link.badge}
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Settings & Signout Footer */}
      <div className="p-3 border-t border-ivory-200/80 space-y-1">
        <NavLink
          to="/coordinator/settings"
          onClick={onCloseMobile}
          className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-mutedGray hover:text-charcoal-900 hover:bg-ivory-100 transition-colors"
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span>Programme Rules</span>
        </NavLink>
        <button
          onClick={logout}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-rose-700 hover:bg-rose-50 transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};
