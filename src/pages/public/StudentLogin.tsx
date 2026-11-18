import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Lock, Mail, ArrowRight, Sparkles, GraduationCap } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { BrandLogo } from '../../components/common/BrandLogo';

export const StudentLogin: React.FC = () => {
  const [email, setEmail] = useState('priya.sharma@campus.ac.in');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { loginAsRole, switchStudent } = useApp();
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please provide your university credentials.');
      return;
    }
    loginAsRole('student', email);
    navigate('/student/dashboard');
  };

  const handleQuickPersona = (stdId: string, demoEmail: string) => {
    setEmail(demoEmail);
    switchStudent(stdId);
    navigate('/student/dashboard');
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

      {/* Main Two-Column Container */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="max-w-4xl w-full bg-white rounded-3xl shadow-soft-lg border border-lavender-200/90 overflow-hidden grid grid-cols-1 md:grid-cols-12">
          
          {/* Left: Welcoming Student Illustration / Editorial column */}
          <div className="md:col-span-5 bg-gradient-to-br from-lavender-100/90 via-ivory-100 to-peach-50/70 p-8 flex flex-col justify-between border-b md:border-b-0 md:border-r border-lavender-200">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/80 border border-lavender-200 text-plum-900 text-[11px] font-bold uppercase tracking-wider mb-6">
                <GraduationCap className="w-3.5 h-3.5 text-plum-600" />
                <span>Student Opportunity Portal</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-charcoal-900 leading-tight">
                Work on Real Projects. <br />
                <span className="italic text-plum-700">Graduate with Proof.</span>
              </h2>

              <p className="text-xs text-mutedGray leading-relaxed mt-3">
                Access curated opportunities vetted by your university faculties with guaranteed payment verification.
              </p>
            </div>

            {/* Quick Demo Switcher Card for Test Evaluation */}
            <div className="mt-8 p-3.5 rounded-2xl bg-white/90 border border-lavender-200/80 space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-mutedGray block">
                Quick Evaluation Personas
              </span>
              <div className="space-y-1">
                <button
                  type="button"
                  onClick={() => handleQuickPersona('std-1', 'priya.sharma@campus.ac.in')}
                  className="w-full text-left p-2 rounded-lg text-xs hover:bg-sage-50 flex items-center justify-between text-charcoal-800"
                >
                  <span className="font-semibold">Priya Sharma</span>
                  <span className="text-forest-700 font-bold bg-sage-100 px-2 py-0.5 rounded text-[10px]">Eligible (CGPA 8.4)</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickPersona('std-2', 'arjun.nair@campus.ac.in')}
                  className="w-full text-left p-2 rounded-lg text-xs hover:bg-peach-50 flex items-center justify-between text-charcoal-800"
                >
                  <span className="font-semibold">Arjun Nair</span>
                  <span className="text-amber-800 font-bold bg-peach-100 px-2 py-0.5 rounded text-[10px]">Active (14h/20h)</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickPersona('std-3', 'rohan.verma@campus.ac.in')}
                  className="w-full text-left p-2 rounded-lg text-xs hover:bg-rose-50 flex items-center justify-between text-charcoal-800"
                >
                  <span className="font-semibold">Rohan Verma</span>
                  <span className="text-rose-700 font-bold bg-rose-100 px-2 py-0.5 rounded text-[10px]">On Hold (CGPA 5.6)</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right: Login Form */}
          <div className="md:col-span-7 p-8 sm:p-10 flex flex-col justify-center">
            <div className="mb-6 space-y-1">
              <h1 className="text-2xl sm:text-3xl font-serif font-bold text-charcoal-900">
                Welcome Back, Achiever.
              </h1>
              <p className="text-xs text-mutedGray">
                Your next opportunity is waiting. Enter your university credentials.
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4 text-xs">
              {/* University Email */}
              <div>
                <label className="block font-bold uppercase tracking-wider text-charcoal-900 mb-1">
                  University Email
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="student.name@campus.edu"
                    className="w-full rounded-xl border border-lavender-200 px-3.5 py-2.5 pl-9 text-xs text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-plum-400 bg-white"
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
                  <a href="#forgot" onClick={(e) => { e.preventDefault(); alert('Demo password reset instructions sent to university email.'); }} className="text-[11px] text-plum-600 hover:underline">
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
                    className="w-full rounded-xl border border-lavender-200 px-3.5 py-2.5 pl-9 pr-9 text-xs text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-plum-400 bg-white"
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

              {/* Remember Me */}
              <div className="flex items-center">
                <input
                  id="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded text-plum-600 focus:ring-plum-400 mr-2"
                />
                <label htmlFor="remember-me" className="text-xs text-charcoal-800">
                  Remember this device for 30 days
                </label>
              </div>

              {error && (
                <p className="text-rose-600 font-medium">
                  {error}
                </p>
              )}

              {/* Submit */}
              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-plum-500 hover:bg-plum-600 text-white font-semibold text-xs shadow-sm transition-colors flex items-center justify-center gap-2"
              >
                <span>Sign In to Student Portal</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* Registration Link */}
            <div className="mt-8 pt-6 border-t border-ivory-200 text-center text-xs text-mutedGray">
              Don't have an account yet?{' '}
              <Link to="/student/signup" className="text-plum-600 font-bold hover:underline">
                Create Student Account
              </Link>
            </div>
          </div>

        </div>
      </div>

      {/* Subtle bottom footer */}
      <footer className="py-4 text-center text-xs text-mutedGray">
        Need assistance? Contact your campus Student Opportunity Coordinator.
      </footer>
    </div>
  );
};
