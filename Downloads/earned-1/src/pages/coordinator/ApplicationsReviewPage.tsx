import React, { useState } from 'react';
import { FileCheck2, CheckCircle2, XCircle, Clock, Building2, User, Eye, Search } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Modal } from '../../components/common/Modal';
import { Application, ApplicationStatus } from '../../types';

export const ApplicationsReviewPage: React.FC = () => {
  const { applications, updateApplicationStatus } = useApp();
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('All');

  const filteredApplications = applications.filter((a) => {
    if (filterStatus !== 'All' && a.status !== filterStatus) return false;
    return true;
  });

  const handleUpdate = (status: ApplicationStatus) => {
    if (!selectedApp) return;
    const note = prompt(`Enter coordinator review note for status "${status}":`) || `Coordinator changed status to ${status}`;
    updateApplicationStatus(selectedApp.id, status, note);
    setSelectedApp(null);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-lavender-200/80">
        <div>
          <div className="flex items-center gap-2">
            <FileCheck2 className="w-6 h-6 text-forest-600" />
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-charcoal-900">
              Application Review & Workload Oversight
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-mutedGray mt-1">
            Audit student candidate submissions against academic safeguards and enterprise project requirements.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-mutedGray font-medium">Filter by Stage:</span>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="rounded-xl border border-lavender-200 px-3 py-1.5 text-xs text-charcoal-800 bg-white focus:outline-none focus:ring-2 focus:ring-forest-500"
          >
            <option value="All">All Application Stages</option>
            <option value="Applied">Applied (New)</option>
            <option value="Under Review">Under Review</option>
            <option value="Shortlisted">Shortlisted</option>
            <option value="Selected">Selected</option>
            <option value="In Progress">In Progress</option>
          </select>
        </div>
      </div>

      {/* Applications Table */}
      <div className="card-subtle rounded-3xl p-6 bg-white border border-lavender-200/90 space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-ivory-200 text-xs text-mutedGray">
          <span>Total Applications: <strong>{filteredApplications.length}</strong></span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-ivory-200 text-mutedGray text-[10px] uppercase tracking-wider">
                <th className="py-3 px-3">Date</th>
                <th className="py-3 px-3">Applicant Name</th>
                <th className="py-3 px-3">Opportunity & Enterprise</th>
                <th className="py-3 px-3">CGPA Standing</th>
                <th className="py-3 px-3">Workload at Apply</th>
                <th className="py-3 px-3">Current Status</th>
                <th className="py-3 px-3 text-right">Review</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ivory-200">
              {filteredApplications.map((app) => (
                <tr key={app.id} className="hover:bg-ivory-50/70 transition-colors">
                  <td className="py-3 px-3 font-semibold text-charcoal-900 whitespace-nowrap">
                    {app.appliedDate}
                  </td>

                  <td className="py-3 px-3">
                    <div className="font-bold text-charcoal-900">{app.studentName}</div>
                    <div className="text-[10px] text-mutedGray">{app.studentDepartment}</div>
                  </td>

                  <td className="py-3 px-3">
                    <div className="font-semibold text-charcoal-900 line-clamp-1">{app.opportunityTitle}</div>
                    <div className="text-[10px] text-mutedGray">{app.organizationName}</div>
                  </td>

                  <td className="py-3 px-3">
                    <span className="font-semibold text-charcoal-900">{app.studentCgpa.toFixed(2)}</span>
                    <span className="text-[10px] text-forest-700 ml-1 font-bold">✓ Compliant</span>
                  </td>

                  <td className="py-3 px-3 text-charcoal-800 font-medium">
                    {app.monthlyHoursAtApply}h logged
                  </td>

                  <td className="py-3 px-3">
                    <StatusBadge status={app.status} size="sm" />
                  </td>

                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={() => setSelectedApp(app)}
                      className="px-3.5 py-1.5 rounded-xl bg-forest-600 hover:bg-forest-700 text-white font-semibold transition-colors flex items-center gap-1 ml-auto"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Review</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Review Modal */}
      {selectedApp && (
        <Modal
          isOpen={!!selectedApp}
          onClose={() => setSelectedApp(null)}
          title={`Application Review: ${selectedApp.studentName}`}
          subtitle={`${selectedApp.opportunityTitle} · ${selectedApp.organizationName}`}
          maxWidth="lg"
        >
          <div className="space-y-4 text-xs">
            {/* Academic Snapshot */}
            <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl bg-ivory-50 border border-lavender-200">
              <div>
                <span className="text-[10px] uppercase font-bold text-mutedGray">Student CGPA</span>
                <div className="font-serif font-bold text-charcoal-900 text-base mt-0.5">{selectedApp.studentCgpa.toFixed(2)}</div>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-mutedGray">Workload at Apply</span>
                <div className="font-bold text-charcoal-900 text-sm mt-0.5">{selectedApp.monthlyHoursAtApply} hrs logged</div>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-mutedGray">Student Tier</span>
                <div className="mt-1"><StatusBadge status={selectedApp.studentTier} size="sm" /></div>
              </div>
            </div>

            {/* Cover Note */}
            <div>
              <span className="font-bold uppercase tracking-wider text-mutedGray text-[10px] block mb-1">
                Applicant Statement:
              </span>
              <p className="p-3.5 rounded-2xl bg-white border border-lavender-200 text-charcoal-800 italic leading-relaxed">
                "{selectedApp.coverMessage}"
              </p>
            </div>

            {/* Links */}
            {selectedApp.portfolioLink && (
              <div className="p-3 rounded-xl bg-ivory-50 border border-ivory-200 flex items-center justify-between">
                <span className="font-medium text-charcoal-800">Portfolio Work Sample:</span>
                <a href={selectedApp.portfolioLink} target="_blank" rel="noreferrer" className="text-plum-600 font-bold hover:underline">
                  {selectedApp.portfolioLink}
                </a>
              </div>
            )}

            {/* Stage Decision Actions */}
            <div className="pt-3 border-t border-ivory-200 flex items-center justify-between gap-2">
              <span className="text-[11px] text-mutedGray">Update candidate stage:</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleUpdate('Shortlisted')}
                  className="px-3 py-1.5 rounded-xl border border-mutedYellow-200 bg-mutedYellow-100 text-charcoal-900 font-semibold hover:bg-mutedYellow-200 transition-colors"
                >
                  Shortlist
                </button>
                <button
                  type="button"
                  onClick={() => handleUpdate('Selected')}
                  className="px-3 py-1.5 rounded-xl bg-forest-600 text-white font-semibold hover:bg-forest-700 transition-colors"
                >
                  Approve Offer (Selected)
                </button>
                <button
                  type="button"
                  onClick={() => handleUpdate('Rejected')}
                  className="px-3 py-1.5 rounded-xl border border-rose-200 text-rose-700 font-semibold hover:bg-rose-50 transition-colors"
                >
                  Reject
                </button>
              </div>
            </div>
          </div>
        </Modal>
      )}

    </div>
  );
};
