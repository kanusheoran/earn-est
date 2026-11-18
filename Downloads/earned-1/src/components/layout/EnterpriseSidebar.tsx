import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Briefcase, 
  Users, 
  FolderKanban, 
  Building2, 
  LogOut
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { BrandLogo } from '../common/BrandLogo';

export const EnterpriseSidebar: React.FC<{ onCloseMobile?: () => void }> = ({ onCloseMobile }) => {
  const { currentOrganization, applications, logout } = useApp();

  const newApplicantsCount = applications.filter(a => a.status === 'Applied').length;

  const links = [
    { label: 'Overview', to: '/enterprise/dashboard', icon: LayoutDashboard },
    { label: 'Opportunities', to: '/enterprise/opportunities', icon: Briefcase },
    { 
      label: 'Applicants', 
      to: '/enterprise/applicants', 
      icon: Users,
      badge: newApplicantsCount > 0 ? newApplicantsCount : undefined 
    },
    { label: 'Projects', to: '/enterprise/projects', icon: FolderKanban },
    { label: 'Organization', to: '/enterprise/profile', icon: Building2 },
  ];

  return (
    <aside className="w-60 bg-white border-r border-lavender-200/80 flex flex-col h-full min-h-screen">
      {/* Brand Header */}
      <div className="p-5 border-b border-ivory-200/80">
        <BrandLogo size="md" showTagline={false} linkTo="/enterprise/dashboard" />
        <span className="text-[10px] font-bold uppercase tracking-wider text-charcoal-900 bg-peach-100 px-2 py-0.5 rounded-md mt-2 inline-block">
          Enterprise Portal
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
                    ? 'bg-peach-100 text-charcoal-900 font-semibold'
                    : 'text-charcoal-800 hover:bg-ivory-100 hover:text-plum-800'
                }`
              }
            >
              <div className="flex items-center gap-3">
                <Icon className="w-4 h-4 text-plum-600 shrink-0" />
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

      {/* Organization Footer */}
      <div className="p-3 border-t border-ivory-200/80">
        <div className="flex items-center justify-between p-2 rounded-xl bg-ivory-50 border border-ivory-200/60">
          <div className="flex items-center gap-2.5 min-w-0">
            <img
              src={currentOrganization.logo}
              alt={currentOrganization.name}
              className="w-8 h-8 rounded-lg object-cover shrink-0"
            />
            <div className="min-w-0">
              <p className="text-xs font-semibold text-charcoal-900 truncate">
                {currentOrganization.name}
              </p>
              <p className="text-[10px] text-mutedGray truncate">
                {currentOrganization.industry}
              </p>
            </div>
          </div>
          <button
            onClick={logout}
            className="p-1.5 rounded-lg text-mutedGray hover:text-rose-600 hover:bg-rose-50 transition-colors"
            title="Sign Out"
            aria-label="Sign Out"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
};
