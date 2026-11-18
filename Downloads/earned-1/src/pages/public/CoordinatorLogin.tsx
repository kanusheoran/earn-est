import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Lock, Mail, ArrowRight, ShieldCheck, ShieldAlert } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { BrandLogo } from '../../components/common/BrandLogo';

export const CoordinatorLogin: React.FC = () => {
  const [email, setEmail] = useState('coordinator@university.edu');
  const [password, setPassword] = useState('adminpass123');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { loginAsRole } = useApp();
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please provide your institutional administrative credentials.');
      return;
    }
    loginAsRole('coordinator');
    navigate('/coordinator/dashboard');
  };

  return (
    <div className="min-h-screen bg-ivory-100 flex flex-col justify-between antialiased text-charcoal-900">
      {/* Top Bar */}
      <header className="px-6 py-5 max-w-7xl mx-auto w-full flex items-center justify-between">
        <BrandLogo size="md" showTagline={false} />
        <Link
          to="/"
          className="text-xs font-semibold text-mutedGray hover:text-charcoal-900 transition-colors"
        >
          ← Back to Public Overview
        </Link>
      </header>

      {/* Main Container */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="max-w-4xl w-full bg-white rounded-3xl shadow-soft-lg border border-sage-300 overflow-hidden grid grid-cols-1 md:grid-cols-12">
          
          {/* Left Column: Professional & Structured Institutional Panel */}
          <div className="md:col-span-5 bg-gradient-to-br from-sage-100 via-ivory-100 to-lavender-50 p-8 flex flex-col justify-between border-b md:border-b-0 md:border-r border-sage-200">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sage-200 border border-sage-300 text-forest-800 text-[11px] font-bold uppercase tracking-wider mb-6">
                <ShieldCheck className="w-3.5 h-3.5 text-forest-600" />
                <span>University Programme Portal</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-charcoal-900 leading-tight">
                Academic Safeguards & <br />
                <span className="italic text-forest-700">Financial Oversight.</span>
              </h2>

              <p className="text-xs text-mutedGray leading-relaxed mt-3">
                Monitor student workload caps, review earnings evidence submissions, and audit enterprise partnerships with single-pane compliance clarity.
              </p>
            </div>

            <div className="mt-8 p-3.5 rounded-2xl bg-white border border-sage-200 text-xs space-y-1.5">
              <div className="flex items-center gap-1.5 font-bold text-forest-800">
                <ShieldAlert className="w-4 h-4 text-forest-600" />
                <span>Restricted Administrative Access</span>
              </div>
              <p className="text-[11px] text-mutedGray leading-relaxed">
                Accounts are provisioned by Campus Faculty Affairs. Public registration is disabled to safeguard student records.
              </p>
            </div>
          </div>

          {/* Right: Login Form */}
          <div className="md:col-span-7 p-8 sm:p-10 flex flex-col justify-center">
            <div className="mb-6 space-y-1">
              <h1 className="text-2xl sm:text-3xl font-serif font-bold text-charcoal-900">
                Your Programme, At a Glance.
              </h1>
              <p className="text-xs text-mutedGray">
                Manage opportunities, student earnings, and academic safeguards.
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4 text-xs">
              {/* Institutional Email */}
              <div>
                <label className="block font-bold uppercase tracking-wider text-charcoal-900 mb-1">
                  Institutional Email
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="coordinator@university.edu"
                    className="w-full rounded-xl border border-sage-300 px-3.5 py-2.5 pl-9 text-xs text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-forest-500 bg-white"
                  />
                  <Mail className="w-4 h-4 text-forest-600 absolute left-3 top-3" />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-bold uppercase tracking-wider text-charcoal-900">
                    Administrative Password
                  </label>
                  <a href="#forgot" onClick={(e) => { e.preventDefault(); alert('Reset link routed via University IT Identity Provider.'); }} className="text-[11px] text-forest-700 hover:underline">
                    Forgot password?
                  </a>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full rounded-xl border border-sage-300 px-3.5 py-2.5 pl-9 pr-9 text-xs text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-forest-500 bg-white"
                  />
                  <Lock className="w-4 h-4 text-forest-600 absolute left-3 top-3" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-mutedGray hover:text-charcoal-900"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {error && (
                <p className="text-rose-600 font-medium">
                  {error}
                </p>
              )}

              {/* Submit */}
              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-forest-600 hover:bg-forest-700 text-white font-semibold text-xs shadow-sm transition-colors flex items-center justify-center gap-2"
              >
                <span>Sign In as Coordinator</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-ivory-200 flex items-center justify-between text-xs text-mutedGray">
              <Link to="/student/login" className="hover:text-charcoal-900 underline">
                Student Portal
              </Link>
              <Link to="/enterprise/login" className="hover:text-charcoal-900 underline">
                Enterprise Portal
              </Link>
            </div>
          </div>

        </div>
      </div>

      <footer className="py-4 text-center text-xs text-mutedGray">
        Authorized University Staff Only · Powered by Earnest Safeguards
      </footer>
    </div>
  );
};
