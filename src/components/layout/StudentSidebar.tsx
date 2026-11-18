import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Compass, 
  FileText, 
  Briefcase, 
  Wallet, 
  User, 
  LogOut
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { BrandLogo } from '../common/BrandLogo';

export const StudentSidebar: React.FC<{ onCloseMobile?: () => void }> = ({ onCloseMobile }) => {
  const { currentStudent, logout } = useApp();

  const links = [
    { label: 'Overview', to: '/student/dashboard', icon: LayoutDashboard },
    { label: 'Opportunities', to: '/student/opportunities', icon: Compass },
    { label: 'My Applications', to: '/student/applications', icon: FileText },
    { label: 'My Projects', to: '/student/projects', icon: Briefcase },
    { label: 'Earnings', to: '/student/earnings', icon: Wallet },
    { label: 'Profile', to: '/student/profile', icon: User },
  ];

  return (
    <aside className="w-60 bg-white border-r border-lavender-200/80 flex flex-col h-full min-h-screen">
      {/* Brand Header */}
      <div className="p-5 border-b border-ivory-200/80">
        <BrandLogo size="md" showTagline={false} linkTo="/student/dashboard" />
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
                `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-colors ${
                  isActive
                    ? 'bg-lavender-100 text-plum-900 font-semibold'
                    : 'text-charcoal-800 hover:bg-ivory-100 hover:text-plum-800'
                }`
              }
            >
              <Icon className="w-4 h-4 text-plum-600 shrink-0" />
              <span>{link.label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Student Compact Account Footer */}
      <div className="p-3 border-t border-ivory-200/80">
        <div className="flex items-center justify-between p-2 rounded-xl bg-ivory-50 border border-ivory-200/60">
          <div className="flex items-center gap-2.5 min-w-0">
            <img
              src={currentStudent.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
              alt={currentStudent.name}
              className="w-8 h-8 rounded-full object-cover shrink-0"
            />
            <div className="min-w-0">
              <p className="text-xs font-semibold text-charcoal-900 truncate">
                {currentStudent.name}
              </p>
              <p className="text-[10px] text-mutedGray truncate">
                {currentStudent.tier} · {currentStudent.department.split('&')[0]}
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
