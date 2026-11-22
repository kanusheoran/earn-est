import React from 'react';
import { 
  Users, 
  LayoutDashboard, 
  Monitor, 
  LogOut, 
  LogIn, 
  PlusCircle, 
  ShieldCheck, 
  BarChart3,
  Building2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  currentView: string;
  onNavigate: (view: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentView, onNavigate }) => {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div 
            onClick={() => onNavigate('landing')}
            className="flex items-center space-x-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-600 to-indigo-600 flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-slate-900">
                Queue<span className="text-sky-600">Guard</span>
              </span>
              <span className="hidden sm:inline-block ml-2 px-2 py-0.5 text-xs font-medium bg-sky-50 text-sky-700 rounded-full border border-sky-100">
                Smart Queue
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex items-center space-x-1 sm:space-x-3">
            <button
              onClick={() => onNavigate('join')}
              className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentView === 'join' 
                  ? 'bg-sky-50 text-sky-700 font-semibold' 
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <PlusCircle className="w-4 h-4 text-sky-600" />
              <span>Join Queue</span>
            </button>

            <button
              onClick={() => onNavigate('display')}
              className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentView === 'display' 
                  ? 'bg-sky-50 text-sky-700 font-semibold' 
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Monitor className="w-4 h-4 text-emerald-600" />
              <span>Live Display</span>
            </button>

            {user?.role === 'STAFF' || user?.role === 'ADMIN' ? (
              <button
                onClick={() => onNavigate('staff')}
                className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  currentView === 'staff' 
                    ? 'bg-sky-50 text-sky-700 font-semibold' 
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <LayoutDashboard className="w-4 h-4 text-indigo-600" />
                <span>Counter Desk</span>
              </button>
            ) : null}

            {user?.role === 'ADMIN' && (
              <button
                onClick={() => onNavigate('admin')}
                className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  currentView.startsWith('admin') 
                    ? 'bg-sky-50 text-sky-700 font-semibold' 
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <ShieldCheck className="w-4 h-4 text-purple-600" />
                <span>Admin Suite</span>
              </button>
            )}

            <div className="h-6 w-px bg-slate-200 mx-1 hidden sm:block"></div>

            {user ? (
              <div className="flex items-center space-x-3">
                <div className="hidden md:flex flex-col text-right">
                  <span className="text-sm font-semibold text-slate-800 leading-none">{user.name}</span>
                  <span className="text-xs text-slate-500 capitalize">{user.role.toLowerCase()}</span>
                </div>
                <button
                  onClick={logout}
                  title="Sign out"
                  className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => onNavigate('login')}
                className="flex items-center space-x-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-sm font-medium shadow-sm transition-colors"
              >
                <LogIn className="w-4 h-4" />
                <span>Staff Portal</span>
              </button>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};
