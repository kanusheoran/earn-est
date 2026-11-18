import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Lock, Mail, ArrowRight, Building2, CheckCircle2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { BrandLogo } from '../../components/common/BrandLogo';

export const EnterpriseLogin: React.FC = () => {
  const [email, setEmail] = useState('campus.hiring@infosysbpm.com');
  const [password, setPassword] = useState('enterprise123');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { loginAsRole, switchOrganization } = useApp();
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter your work email and password.');
      return;
    }
    switchOrganization('org-1');
    loginAsRole('enterprise');
    navigate('/enterprise/dashboard');
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
        <div className="max-w-4xl w-full bg-white rounded-3xl shadow-soft-lg border border-peach-200 overflow-hidden grid grid-cols-1 md:grid-cols-12">
          
          {/* Left: Creative Enterprise Brand Column */}
          <div className="md:col-span-5 bg-gradient-to-br from-peach-100/70 via-ivory-100 to-lavender-100/60 p-8 flex flex-col justify-between border-b md:border-b-0 md:border-r border-peach-200">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-peach-200 border border-peach-300 text-charcoal-900 text-[11px] font-bold uppercase tracking-wider mb-6">
                <Building2 className="w-3.5 h-3.5 text-peach-300" />
                <span>Enterprise Partner Hub</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-charcoal-900 leading-tight">
                Engage High-Caliber <br />
                <span className="italic text-plum-700">Campus Talent.</span>
              </h2>

              <p className="text-xs text-mutedGray leading-relaxed mt-3">
                Post targeted milestones, review students with verified academic standings, and manage deliverable handoffs seamlessly.
              </p>
            </div>

            <div className="mt-8 space-y-2 text-xs text-charcoal-800">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-forest-600" />
                <span>Zero-risk safeguard compliance</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-forest-600" />
                <span>Direct milestone escrow support</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-forest-600" />
                <span>Verified university affiliation</span>
              </div>
            </div>
          </div>

          {/* Right: Login Form */}
          <div className="md:col-span-7 p-8 sm:p-10 flex flex-col justify-center">
            <div className="mb-6 space-y-1">
              <h1 className="text-2xl sm:text-3xl font-serif font-bold text-charcoal-900">
                Find Talent. Build What's Next.
              </h1>
              <p className="text-xs text-mutedGray">
                Connect with skilled students and manage projects in one place.
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4 text-xs">
              {/* Work Email */}
              <div>
                <label className="block font-bold uppercase tracking-wider text-charcoal-900 mb-1">
                  Corporate Work Email
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@company.com"
                    className="w-full rounded-xl border border-peach-200 px-3.5 py-2.5 pl-9 text-xs text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-plum-400 bg-white"
                  />
                  <Mail className="w-4 h-4 text-plum-500 absolute left-3 top-3" />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-bold uppercase tracking-wider text-charcoal-900">
                    Password
                  </label>
                  <a href="#forgot" onClick={(e) => { e.preventDefault(); alert('Reset link sent to work email.'); }} className="text-[11px] text-plum-600 hover:underline">
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
                    className="w-full rounded-xl border border-peach-200 px-3.5 py-2.5 pl-9 pr-9 text-xs text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-plum-400 bg-white"
                  />
                  <Lock className="w-4 h-4 text-plum-500 absolute left-3 top-3" />
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
                className="w-full py-3 rounded-xl bg-charcoal-900 hover:bg-charcoal-800 text-white font-semibold text-xs shadow-sm transition-colors flex items-center justify-center gap-2"
              >
                <span>Sign In to Enterprise Hub</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* Registration Link */}
            <div className="mt-8 pt-6 border-t border-ivory-200 text-center text-xs text-mutedGray">
              New company partner?{' '}
              <Link to="/enterprise/signup" className="text-plum-600 font-bold hover:underline">
                Register Organization
              </Link>
            </div>
          </div>

        </div>
      </div>

      <footer className="py-4 text-center text-xs text-mutedGray">
        Enterprise Partner Services · University Micro-Earning Platform
      </footer>
    </div>
  );
};
