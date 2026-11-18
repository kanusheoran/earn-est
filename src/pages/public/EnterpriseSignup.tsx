import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Building2, ArrowRight, ShieldCheck } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { BrandLogo } from '../../components/common/BrandLogo';

export const EnterpriseSignup: React.FC = () => {
  const [orgName, setOrgName] = useState('');
  const [industry, setIndustry] = useState('Software & Technology');
  const [website, setWebsite] = useState('');
  const [contactName, setContactName] = useState('');
  const [workEmail, setWorkEmail] = useState('');
  const [description, setDescription] = useState('');

  const { showToast, loginAsRole } = useApp();
  const navigate = useNavigate();

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Enterprise Registered!', `Your partnership application for ${orgName} has been submitted for university review.`, 'success');
    loginAsRole('enterprise');
    navigate('/enterprise/dashboard');
  };

  return (
    <div className="min-h-screen bg-ivory-100 flex flex-col justify-between antialiased text-charcoal-900">
      <header className="px-6 py-5 max-w-7xl mx-auto w-full flex items-center justify-between">
        <BrandLogo size="md" showTagline={false} />
        <Link to="/enterprise/login" className="text-xs font-semibold text-plum-600 hover:underline">
          Already registered? Enterprise Sign In →
        </Link>
      </header>

      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="max-w-2xl w-full bg-white rounded-3xl shadow-soft-lg border border-peach-200 p-8 sm:p-10">
          <div className="mb-6 space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-plum-600">
              Enterprise Partnership
            </span>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-charcoal-900">
              Register Your Organization
            </h1>
            <p className="text-xs text-mutedGray">
              Collaborate directly with vetted student talent and tap into university-backed project scoping.
            </p>
          </div>

          <form onSubmit={handleRegister} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold uppercase tracking-wider text-charcoal-900 mb-1">
                  Company / Organization Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={orgName}
                  onChange={(e) => setOrgName(e.target.value)}
                  placeholder="e.g. Apex AI Studio"
                  className="w-full rounded-xl border border-peach-200 px-3 py-2 text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-plum-400 bg-white"
                />
              </div>

              <div>
                <label className="block font-bold uppercase tracking-wider text-charcoal-900 mb-1">
                  Industry Sector <span className="text-rose-500">*</span>
                </label>
                <select
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  className="w-full rounded-xl border border-peach-200 p-2 text-charcoal-900 bg-white focus:outline-none focus:ring-2 focus:ring-plum-400"
                >
                  <option value="Software & Technology">Software & Technology</option>
                  <option value="Design & Creative Arts">Design & Creative Arts</option>
                  <option value="Financial & Business Analytics">Financial & Business Analytics</option>
                  <option value="CleanTech / Environmental">CleanTech / Environmental</option>
                  <option value="Health Sciences & Bio">Health Sciences & Bio</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold uppercase tracking-wider text-charcoal-900 mb-1">
                  Official Website <span className="text-rose-500">*</span>
                </label>
                <input
                  type="url"
                  required
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  placeholder="https://company.com"
                  className="w-full rounded-xl border border-peach-200 px-3 py-2 text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-plum-400 bg-white"
                />
              </div>

              <div>
                <label className="block font-bold uppercase tracking-wider text-charcoal-900 mb-1">
                  Primary Contact Person <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  placeholder="e.g. Sarah Jenkins"
                  className="w-full rounded-xl border border-peach-200 px-3 py-2 text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-plum-400 bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold uppercase tracking-wider text-charcoal-900 mb-1">
                Work Email <span className="text-rose-500">*</span>
              </label>
              <input
                type="email"
                required
                value={workEmail}
                onChange={(e) => setWorkEmail(e.target.value)}
                placeholder="sarah@company.com"
                className="w-full rounded-xl border border-peach-200 px-3 py-2 text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-plum-400 bg-white"
              />
            </div>

            <div>
              <label className="block font-bold uppercase tracking-wider text-charcoal-900 mb-1">
                Organization Description
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief summary of your product, team, and types of student projects you intend to commission..."
                className="w-full rounded-xl border border-peach-200 p-2.5 text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-plum-400 bg-white"
              />
            </div>

            <div className="p-3.5 rounded-2xl bg-peach-50 border border-peach-200 text-charcoal-800 flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-plum-600 mt-0.5 shrink-0" />
              <p className="text-[11px] leading-relaxed">
                New enterprise registrations receive a temporary <em>"Awaiting Verification"</em> status until certified by University Faculty Affairs.
              </p>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-charcoal-900 hover:bg-charcoal-800 text-white font-semibold text-xs shadow-sm transition-colors flex items-center justify-center gap-2"
            >
              <span>Submit Enterprise Application</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
