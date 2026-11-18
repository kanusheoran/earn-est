import React, { useState } from 'react';
import { FolderKanban, CheckCircle2, Clock, DollarSign, Calendar, MessageSquare, Check } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../../components/common/StatusBadge';
import { EmptyState } from '../../components/common/EmptyState';

export const EnterpriseProjectsPage: React.FC = () => {
  const { projects, currentOrganization, showToast } = useApp();

  const myProjects = projects.filter(
    (p) => p.organizationName === currentOrganization.name || currentOrganization.id === 'org-1'
  );

  const handleApproveDeliverable = (projId: string) => {
    showToast('Milestone Confirmed', 'You approved the student deliverable. Payment confirmation recorded for coordinator verification.', 'success');
  };

  const handleRequestRevision = (projId: string) => {
    const feedback = prompt('Enter specific revision feedback for the student:');
    if (feedback) {
      showToast('Revision Requested', 'Feedback communicated to student.', 'info');
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-lavender-200/80">
        <div>
          <div className="flex items-center gap-2">
            <FolderKanban className="w-6 h-6 text-plum-600" />
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-charcoal-900">
              Active & Completed Projects
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-mutedGray mt-1">
            Track student milestone delivery, review recorded work logs, and confirm project disbursements.
          </p>
        </div>
      </div>

      {/* Projects List */}
      {myProjects.length > 0 ? (
        <div className="space-y-5">
          {myProjects.map((proj) => (
            <div
              key={proj.id}
              className="card-subtle rounded-3xl p-6 bg-white border border-lavender-200/90 space-y-5"
            >
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-3 border-b border-ivory-200">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-forest-700 uppercase tracking-wider">
                      Student: {proj.studentName}
                    </span>
                    <span className="text-mutedGray text-xs">·</span>
                    <span className="text-xs text-mutedGray">Started {proj.startDate}</span>
                  </div>

                  <h3 className="text-xl font-serif font-bold text-charcoal-900">
                    {proj.title}
                  </h3>
                </div>

                <StatusBadge status={proj.status} size="md" />
              </div>

              {/* Scope & Deliverables */}
              <div className="p-3.5 rounded-2xl bg-ivory-50 border border-ivory-200 text-xs">
                <span className="font-bold uppercase tracking-wider text-mutedGray text-[10px] block mb-1">
                  Agreed Milestone Deliverables:
                </span>
                <p className="text-charcoal-800 leading-relaxed">
                  {proj.deliverablesSummary}
                </p>
              </div>

              {/* Metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-3 rounded-2xl bg-white border border-lavender-200">
                  <span className="text-mutedGray text-[10px] uppercase font-bold">Stipend Budget</span>
                  <div className="font-serif font-bold text-forest-700 text-base mt-0.5">${proj.paymentAmount}</div>
                </div>

                <div className="p-3 rounded-2xl bg-white border border-lavender-200">
                  <span className="text-mutedGray text-[10px] uppercase font-bold">Student Hours Logged</span>
                  <div className="font-bold text-charcoal-900 text-sm mt-0.5">{proj.recordedHours} / {proj.assignedHours} hrs</div>
                </div>

                <div className="p-3 rounded-2xl bg-white border border-lavender-200">
                  <span className="text-mutedGray text-[10px] uppercase font-bold">Milestone Deadline</span>
                  <div className="font-medium text-charcoal-900 text-xs mt-1">{proj.deadline}</div>
                </div>

                <div className="p-3 rounded-2xl bg-white border border-lavender-200">
                  <span className="text-mutedGray text-[10px] uppercase font-bold">Progress</span>
                  <div className="font-bold text-plum-700 text-sm mt-0.5">{proj.completionPercentage}%</div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="space-y-1">
                <div className="w-full bg-ivory-200 h-2.5 rounded-full overflow-hidden border border-mutedGray-border/30">
                  <div
                    className="bg-plum-500 h-full rounded-full transition-all"
                    style={{ width: `${proj.completionPercentage}%` }}
                  />
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-ivory-200 text-xs">
                <span className="text-mutedGray text-[11px]">
                  Payment confirmations route through university verification before official transcript ledger entry.
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleRequestRevision(proj.id)}
                    className="px-3.5 py-1.5 rounded-xl border border-lavender-300 text-charcoal-800 font-semibold hover:bg-lavender-50 transition-colors"
                  >
                    Request Revision
                  </button>

                  <button
                    onClick={() => handleApproveDeliverable(proj.id)}
                    className="px-4 py-1.5 rounded-xl bg-forest-600 hover:bg-forest-700 text-white font-semibold transition-colors shadow-xs flex items-center gap-1.5"
                  >
                    <Check className="w-4 h-4" />
                    <span>Approve Deliverables & Confirm Payment</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          title="No projects commissioned yet"
          description="Review student candidates in your Applicants dashboard to approve offers and activate new project work."
        />
      )}

    </div>
  );
};
