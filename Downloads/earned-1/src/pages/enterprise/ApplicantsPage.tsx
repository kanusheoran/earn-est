import React, { useState } from 'react';
import { Users, CheckCircle2, XCircle, Clock, Building2, Globe, FileText, Check } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../../components/common/StatusBadge';
import { EmptyState } from '../../components/common/EmptyState';
import { ApplicationStatus } from '../../types';

export const ApplicantsPage: React.FC = () => {
  const { applications, currentOrganization, updateApplicationStatus } = useApp();
  const [filterStatus, setFilterStatus] = useState<string>('All');

  const myApplicants = applications.filter(
    (a) => a.organizationName === currentOrganization.name || currentOrganization.id === 'org-1'
  );

  const displayedApplicants = myApplicants.filter((a) => {
    if (filterStatus !== 'All' && a.status !== filterStatus) return false;
    return true;
  });

  const handleDecision = (appId: string, status: ApplicationStatus) => {
    const note = prompt(`Enter note for candidate decision ("${status}"):`) || `Decision set to ${status}`;
    updateApplicationStatus(appId, status, note);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-lavender-200/80">
        <div>
          <div className="flex items-center gap-2">
            <Users className="w-6 h-6 text-plum-600" />
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-charcoal-900">
              Candidate Pipeline & Applicants
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-mutedGray mt-1">
            Review applicant portfolios, verify academic standing, and hire student freelancers.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-mutedGray font-medium">Filter by Stage:</span>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="rounded-xl border border-lavender-200 px-3 py-1.5 text-xs text-charcoal-800 bg-white focus:outline-none focus:ring-2 focus:ring-plum-400"
          >
            <option value="All">All Applicants</option>
            <option value="Applied">New Applications</option>
            <option value="Under Review">Under Review</option>
            <option value="Shortlisted">Shortlisted</option>
            <option value="Selected">Selected / Hired</option>
          </select>
        </div>
      </div>

      {/* Applicants List */}
      {displayedApplicants.length > 0 ? (
        <div className="space-y-4">
          {displayedApplicants.map((app) => (
            <div
              key={app.id}
              className="card-subtle rounded-3xl p-6 bg-white border border-lavender-200/90 space-y-4"
            >
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-3 border-b border-ivory-200">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-serif font-bold text-lg text-charcoal-900">{app.studentName}</h3>
                    <StatusBadge status={app.studentTier} size="sm" />
                    <span className="text-mutedGray text-xs">·</span>
                    <span className="text-xs text-mutedGray">Applied on {app.appliedDate}</span>
                  </div>
                  <p className="text-xs text-charcoal-800">
                    {app.studentDepartment} · CGPA <strong>{app.studentCgpa.toFixed(2)}</strong> (Safeguard Approved)
                  </p>
                  <p className="text-xs font-semibold text-plum-700">
                    Target Opportunity: {app.opportunityTitle}
                  </p>
                </div>

                <StatusBadge status={app.status} size="md" />
              </div>

              {/* Statement */}
              <div className="p-3.5 rounded-2xl bg-ivory-50 border border-ivory-200 text-xs">
                <span className="font-bold uppercase tracking-wider text-mutedGray text-[10px] block mb-1">
                  Applicant Pitch:
                </span>
                <p className="text-charcoal-800 italic leading-relaxed">
                  "{app.coverMessage}"
                </p>
              </div>

              {/* Portfolio & Documents */}
              <div className="flex flex-wrap items-center justify-between gap-4 text-xs pt-1">
                <div className="flex items-center gap-4">
                  {app.portfolioLink && (
                    <a
                      href={app.portfolioLink}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1.5 text-plum-600 font-bold hover:underline"
                    >
                      <Globe className="w-3.5 h-3.5" />
                      <span>View Portfolio Website</span>
                    </a>
                  )}

                  {app.supportingDocName && (
                    <span className="flex items-center gap-1.5 text-mutedGray">
                      <FileText className="w-3.5 h-3.5 text-plum-500" />
                      <span>{app.supportingDocName}</span>
                    </span>
                  )}
                </div>

                {/* Selection Actions */}
                <div className="flex items-center gap-2">
                  {app.status !== 'Selected' ? (
                    <>
                      <button
                        onClick={() => handleDecision(app.id, 'Shortlisted')}
                        className="px-3.5 py-1.5 rounded-xl border border-mutedYellow-200 bg-mutedYellow-100 hover:bg-mutedYellow-200 text-charcoal-900 font-semibold transition-colors"
                      >
                        Shortlist
                      </button>
                      <button
                        onClick={() => handleDecision(app.id, 'Selected')}
                        className="px-4 py-1.5 rounded-xl bg-forest-600 hover:bg-forest-700 text-white font-semibold transition-colors shadow-xs flex items-center gap-1"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Select & Activate Project</span>
                      </button>
                      <button
                        onClick={() => handleDecision(app.id, 'Rejected')}
                        className="px-3 py-1.5 rounded-xl border border-rose-200 text-rose-700 hover:bg-rose-50 font-semibold transition-colors"
                      >
                        Pass
                      </button>
                    </>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-xl bg-sage-200 text-forest-700 font-semibold border border-sage-300">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Project Assigned</span>
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          title="No candidates in this stage"
          description="When students apply for your published opportunities, their submissions will appear here for review."
        />
      )}

    </div>
  );
};
