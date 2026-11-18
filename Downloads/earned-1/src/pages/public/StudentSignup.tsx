import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, User, BookOpen, GraduationCap, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { BrandLogo } from '../../components/common/BrandLogo';

export const StudentSignup: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [studentId, setStudentId] = useState('');
  const [department, setDepartment] = useState('Computer Science & Engineering');
  const [cgpa, setCgpa] = useState('3.75');
  const [semester, setSemester] = useState('4');
  const [skills, setSkills] = useState('React, Python, UI Design');
  const [agreed, setAgreed] = useState(false);

  const { showToast, loginAsRole } = useApp();
  const navigate = useNavigate();

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreed) {
      alert('Please agree to university academic safeguard rules and monthly work caps.');
      return;
    }
    showToast('Account Created!', `Welcome to Earnest, ${name || 'Achiever'}!`, 'success');
    loginAsRole('student');
    navigate('/student/dashboard');
  };

  return (
    <div className="min-h-screen bg-ivory-100 flex flex-col justify-between antialiased text-charcoal-900">
      <header className="px-6 py-5 max-w-7xl mx-auto w-full flex items-center justify-between">
        <BrandLogo size="md" showTagline={false} />
        <Link to="/student/login" className="text-xs font-semibold text-plum-600 hover:underline">
          Already registered? Sign In →
        </Link>
      </header>

      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="max-w-2xl w-full bg-white rounded-3xl shadow-soft-lg border border-lavender-200/90 p-8 sm:p-10">
          <div className="mb-6 space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-plum-600">
              Student Registration
            </span>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-charcoal-900">
              Join the Earnest Campus Network
            </h1>
            <p className="text-xs text-mutedGray">
              Register with your valid university credentials to unlock verified projects and micro-earning safeguards.
            </p>
          </div>

          <form onSubmit={handleRegister} className="space-y-4 text-xs">
            {/* Name & ID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold uppercase tracking-wider text-charcoal-900 mb-1">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Maya Lin"
                  className="w-full rounded-xl border border-lavender-200 px-3 py-2 text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-plum-400 bg-white"
                />
              </div>

              <div>
                <label className="block font-bold uppercase tracking-wider text-charcoal-900 mb-1">
                  University Student ID <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  placeholder="ST-2026-XXXX"
                  className="w-full rounded-xl border border-lavender-200 px-3 py-2 text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-plum-400 bg-white"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block font-bold uppercase tracking-wider text-charcoal-900 mb-1">
                Institutional Email (.edu / .ac) <span className="text-rose-500">*</span>
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.name@campus.edu"
                className="w-full rounded-xl border border-lavender-200 px-3 py-2 text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-plum-400 bg-white"
              />
            </div>

            {/* Department & Semester */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="block font-bold uppercase tracking-wider text-charcoal-900 mb-1">
                  Department / Faculty <span className="text-rose-500">*</span>
                </label>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full rounded-xl border border-lavender-200 p-2 text-charcoal-900 bg-white focus:outline-none focus:ring-2 focus:ring-plum-400"
                >
                  <option value="Computer Science & Engineering">Computer Science & Engineering</option>
                  <option value="Visual Communication & Design">Visual Communication & Design</option>
                  <option value="School of Business & Finance">School of Business & Finance</option>
                  <option value="Data Science & AI">Data Science & AI</option>
                  <option value="Biological Sciences & Health">Biological Sciences & Health</option>
                </select>
              </div>

              <div>
                <label className="block font-bold uppercase tracking-wider text-charcoal-900 mb-1">
                  Semester
                </label>
                <select
                  value={semester}
                  onChange={(e) => setSemester(e.target.value)}
                  className="w-full rounded-xl border border-lavender-200 p-2 text-charcoal-900 bg-white focus:outline-none focus:ring-2 focus:ring-plum-400"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8].map(s => (
                    <option key={s} value={s}>Semester {s}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* CGPA */}
            <div>
              <label className="block font-bold uppercase tracking-wider text-charcoal-900 mb-1">
                Current Cumulative GPA (CGPA) <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                step="0.01"
                min="0.0"
                max="4.0"
                required
                value={cgpa}
                onChange={(e) => setCgpa(e.target.value)}
                placeholder="3.75"
                className="w-full rounded-xl border border-lavender-200 px-3 py-2 text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-plum-400 bg-white"
              />
              <span className="text-[11px] text-mutedGray mt-1 block">
                Standard university threshold for freelance participation is 3.00 CGPA.
              </span>
            </div>

            {/* Skills */}
            <div>
              <label className="block font-bold uppercase tracking-wider text-charcoal-900 mb-1">
                Primary Skills (comma-separated)
              </label>
              <input
                type="text"
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                placeholder="React, Figma, Graphic Design, Research..."
                className="w-full rounded-xl border border-lavender-200 px-3 py-2 text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-plum-400 bg-white"
              />
            </div>

            {/* Safeguard Agreement */}
            <div className="p-3.5 rounded-2xl bg-sage-50 border border-sage-200 text-charcoal-800">
              <label className="flex items-start gap-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  required
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="rounded text-forest-600 focus:ring-forest-500 mt-0.5"
                />
                <span className="text-xs leading-relaxed">
                  I agree to abide by the university's <strong>20-hour monthly work cap</strong>, maintain the minimum 3.0 CGPA standard, and submit official proof for all earned stipends.
                </span>
              </label>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-plum-500 hover:bg-plum-600 text-white font-semibold text-xs shadow-sm transition-colors flex items-center justify-center gap-2"
            >
              <span>Complete Student Registration</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
