import React from 'react';
import { Building2, Globe, Mail, User, ShieldCheck, BadgeCheck, CheckCircle2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const EnterpriseProfilePage: React.FC = () => {
  const { currentOrganization } = useApp();

  return (
    <div className="space-y-6 animate-in fade-in duration-300 max-w-4xl mx-auto">
      
      {/* Header */}
      <div className="pb-3 border-b border-lavender-200/80">
        <div className="flex items-center gap-2">
          <Building2 className="w-6 h-6 text-plum-600" />
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-charcoal-900">
            Organization Profile & University Standing
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-mutedGray mt-1">
          Review your enterprise credentials, faculty partnership certification, and public details.
        </p>
      </div>

      {/* Main Profile Card */}
      <div className="card-subtle rounded-3xl p-6 sm:p-8 bg-white border border-lavender-200/90 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 pb-6 border-b border-ivory-200">
          <div className="flex items-start gap-5">
            <img
              src={currentOrganization.logo}
              alt={currentOrganization.name}
              className="w-20 h-20 rounded-2xl object-cover border-2 border-lavender-200 shadow-sm shrink-0"
            />
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-serif font-bold text-charcoal-900">
                  {currentOrganization.name}
                </h2>
                {currentOrganization.isVerified && (
                  <span title="Certified University Partner">
                    <BadgeCheck className="w-5 h-5 text-forest-600" />
                  </span>
                )}
              </div>
              <p className="text-xs font-semibold text-plum-700">
                {currentOrganization.industry}
              </p>
              <a
                href={currentOrganization.website}
                target="_blank"
                rel="noreferrer"
                className="text-xs text-mutedGray hover:text-plum-600 flex items-center gap-1 pt-0.5"
              >
                <Globe className="w-3.5 h-3.5" />
                <span>{currentOrganization.website}</span>
              </a>
            </div>
          </div>

          <div className="shrink-0">
            {currentOrganization.isVerified ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-sage-200 text-forest-700 border border-sage-300">
                <CheckCircle2 className="w-4 h-4 text-forest-600" />
                <span>Certified Enterprise Partner</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-peach-100 text-charcoal-900 border border-peach-200">
                <span>Awaiting University Accreditation</span>
              </span>
            )}
          </div>
        </div>

        {/* Description */}
        <div className="space-y-2 text-xs">
          <span className="font-bold uppercase tracking-wider text-charcoal-900 block">
            About the Organization:
          </span>
          <p className="text-charcoal-800 leading-relaxed bg-ivory-50 p-4 rounded-2xl border border-ivory-200">
            {currentOrganization.description}
          </p>
        </div>

        {/* Contact info grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-2">
          <div className="p-4 rounded-2xl bg-ivory-50 border border-ivory-200 space-y-1">
            <span className="text-[10px] uppercase font-bold text-mutedGray">Lead University Liaison</span>
            <div className="font-semibold text-charcoal-900 flex items-center gap-1.5">
              <User className="w-4 h-4 text-plum-500" />
              <span>{currentOrganization.contactPerson}</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-ivory-50 border border-ivory-200 space-y-1">
            <span className="text-[10px] uppercase font-bold text-mutedGray">Official Contact Email</span>
            <div className="font-semibold text-charcoal-900 flex items-center gap-1.5">
              <Mail className="w-4 h-4 text-plum-500" />
              <span>{currentOrganization.contactEmail}</span>
            </div>
          </div>
        </div>

        {/* Partnership guidelines */}
        <div className="p-4 rounded-2xl bg-sage-50 border border-sage-200 text-xs text-forest-800 flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-forest-600 shrink-0 mt-0.5" />
          <p className="text-[11px] leading-relaxed">
            As an approved partner, your project deliverables automatically qualify students for academic work-study credit. University coordinators oversee compliance to safeguard study balance.
          </p>
        </div>
      </div>

    </div>
  );
};
