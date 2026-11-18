import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../../components/common/StatusBadge';
import { EmptyState } from '../../components/common/EmptyState';
import { Modal } from '../../components/common/Modal';
import { Application } from '../../types';

export const ApplicationsPage: React.FC = () => {
  const { applications, currentStudent } = useApp();
  const myApplications = applications.filter(a => a.studentId === currentStudent.id);
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-in fade-in duration-200">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-charcoal-900">
          My Applications
        </h1>
        <p className="text-xs sm:text-sm text-mutedGray mt-1">
          Track the status of your submitted project applications.
        </p>
      </div>

      {/* Clean Table */}
      {myApplications.length > 0 ? (
        <div className="card-subtle rounded-2xl bg-white border border-lavender-200/80 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-ivory-200 text-mutedGray text-[11px] uppercase tracking-wider bg-ivory-50/60">
                  <th className="py-3 px-4">Opportunity</th>
                  <th className="py-3 px-4">Organization</th>
                  <th className="py-3 px-4">Date Applied</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ivory-200">
                {myApplications.map((app) => (
                  <tr key={app.id} className="hover:bg-ivory-50/50 transition-colors">
                    <td className="py-3 px-4 font-semibold text-charcoal-900">
                      {app.opportunityTitle}
                    </td>
                    <td className="py-3 px-4 text-mutedGray">
                      {app.organizationName}
                    </td>
                    <td className="py-3 px-4 text-charcoal-800">
                      {app.appliedDate}
                    </td>
                    <td className="py-3 px-4">
                      <StatusBadge status={app.status} size="sm" />
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => setSelectedApp(app)}
                        className="px-3 py-1 rounded-lg bg-ivory-100 hover:bg-lavender-100 text-charcoal-900 font-medium transition-colors"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <EmptyState
          title="No applications yet"
          description="You haven't submitted any applications. Discover projects that fit your skills."
          actionText="Explore Opportunities"
          onAction={() => window.location.href = '/student/opportunities'}
        />
      )}

      {/* Detail Modal (Progressive Disclosure) */}
      {selectedApp && (
        <Modal
          isOpen={!!selectedApp}
          onClose={() => setSelectedApp(null)}
          title={selectedApp.opportunityTitle}
          subtitle={selectedApp.organizationName}
          maxWidth="md"
        >
          <div className="space-y-4 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-ivory-200">
              <span className="text-mutedGray">Current Status:</span>
              <StatusBadge status={selectedApp.status} size="md" />
            </div>

            <div className="space-y-1">
              <span className="font-semibold text-charcoal-900 block">Cover Message:</span>
              <p className="text-mutedGray leading-relaxed bg-ivory-50 p-3 rounded-xl border border-ivory-200">
                "{selectedApp.coverMessage}"
              </p>
            </div>

            {selectedApp.statusNotes && (
              <div className="space-y-1">
                <span className="font-semibold text-charcoal-900 block">Feedback Note:</span>
                <p className="text-charcoal-800 bg-sage-50 p-3 rounded-xl border border-sage-200">
                  {selectedApp.statusNotes}
                </p>
              </div>
            )}

            <div className="pt-2 flex justify-between items-center text-xs text-mutedGray">
              <span>Applied on {selectedApp.appliedDate}</span>
              <Link
                to={`/student/opportunities/${selectedApp.opportunityId}`}
                className="text-plum-600 font-semibold hover:underline"
              >
                View Opportunity Page →
              </Link>
            </div>
          </div>
        </Modal>
      )}

    </div>
  );
};
