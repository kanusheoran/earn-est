import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../../components/common/StatusBadge';
import { EmptyState } from '../../components/common/EmptyState';
import { Modal } from '../../components/common/Modal';
import { WorkLogModal } from '../../components/features/WorkLogModal';
import { Project } from '../../types';
import { Plus, IndianRupee, Clock, CheckCircle2 } from 'lucide-react';

export const ProjectsPage: React.FC = () => {
  const { projects, currentStudent } = useApp();
  const myProjects = projects.filter(p => p.studentId === currentStudent.id);

  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [logModalProject, setLogModalProject] = useState<Project | null>(null);

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-lavender-200/80">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-charcoal-900">
            Active Projects
          </h1>
          <p className="text-xs sm:text-sm text-mutedGray mt-0.5">
            Active and completed work deliverables with approved enterprise partners.
          </p>
        </div>

        {myProjects.some(p => p.status === 'In Progress') && (
          <button
            onClick={() => setLogModalProject(myProjects.find(p => p.status === 'In Progress') || myProjects[0])}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-forest-600 hover:bg-forest-700 text-white text-xs font-semibold shadow-xs transition-colors shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Record Hours</span>
          </button>
        )}
      </div>

      {/* Clean Project Cards Grid */}
      {myProjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {myProjects.map((proj) => (
            <div
              key={proj.id}
              onClick={() => setSelectedProject(proj)}
              className="card-subtle rounded-3xl p-6 bg-white border border-lavender-200/90 hover:border-forest-400 hover:shadow-soft-lg transition-all cursor-pointer flex flex-col justify-between space-y-4 group"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2.5">
                  <span className="text-xs font-semibold text-charcoal-800">
                    {proj.organizationName}
                  </span>
                  <StatusBadge status={proj.status} size="sm" />
                </div>

                <h3 className="text-base font-serif font-bold text-charcoal-900 group-hover:text-forest-700 transition-colors line-clamp-1">
                  {proj.title}
                </h3>

                <div className="flex items-center justify-between text-xs text-mutedGray mt-2">
                  <span>Deadline: <strong className="text-charcoal-800">{proj.deadline}</strong></span>
                  <span className="font-bold text-forest-700 font-serif">₹{proj.paymentAmount.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Progress indicator */}
              <div className="space-y-1.5 pt-2 border-t border-ivory-200">
                <div className="flex justify-between text-xs">
                  <span className="text-mutedGray">Milestone Completion</span>
                  <span className="font-semibold text-charcoal-900">{proj.completionPercentage}%</span>
                </div>
                <div className="w-full bg-ivory-200 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-forest-600 h-full rounded-full transition-all"
                    style={{ width: `${proj.completionPercentage}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          title="No active projects"
          description="Apply for opportunities to be selected by enterprises and begin working."
          actionText="Find Projects"
          onAction={() => window.location.href = '/student/opportunities'}
        />
      )}

      {/* Project Detail Modal */}
      {selectedProject && (
        <Modal
          isOpen={!!selectedProject}
          onClose={() => setSelectedProject(null)}
          title={selectedProject.title}
          subtitle={`${selectedProject.organizationName} · Due ${selectedProject.deadline}`}
          maxWidth="lg"
        >
          <div className="space-y-5 text-xs">
            {/* Overview Row */}
            <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl bg-ivory-50 border border-ivory-200">
              <div>
                <span className="text-[11px] text-mutedGray block">Stipend Amount</span>
                <span className="text-base font-bold font-serif text-forest-700">₹{selectedProject.paymentAmount.toLocaleString('en-IN')}</span>
              </div>
              <div>
                <span className="text-[11px] text-mutedGray block">Hours Logged</span>
                <span className="text-sm font-bold text-charcoal-900">{selectedProject.recordedHours} / {selectedProject.assignedHours} hrs</span>
              </div>
              <div>
                <span className="text-[11px] text-mutedGray block">Status</span>
                <span className="mt-0.5 inline-block"><StatusBadge status={selectedProject.status} size="sm" /></span>
              </div>
            </div>

            {/* Deliverables Scope */}
            <div>
              <span className="font-semibold text-charcoal-900 block mb-1">Deliverables Scope:</span>
              <p className="text-mutedGray leading-relaxed bg-white p-3.5 rounded-xl border border-lavender-200">
                {selectedProject.deliverablesSummary}
              </p>
            </div>

            {/* Work Logs List */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-charcoal-900">Logged Hours ({selectedProject.workLogs.length})</span>
                <button
                  onClick={() => {
                    setLogModalProject(selectedProject);
                    setSelectedProject(null);
                  }}
                  className="text-forest-700 font-semibold hover:underline"
                >
                  + Log Hours
                </button>
              </div>

              {selectedProject.workLogs.length > 0 ? (
                <div className="space-y-1.5 max-h-48 overflow-y-auto">
                  {selectedProject.workLogs.map((log) => (
                    <div key={log.id} className="p-3 rounded-xl bg-ivory-50 border border-ivory-200 flex justify-between gap-2">
                      <div>
                        <span className="font-semibold text-charcoal-900">{log.date}: </span>
                        <span className="text-mutedGray">{log.taskDescription}</span>
                      </div>
                      <span className="font-semibold text-forest-700 shrink-0">{log.hoursWorked} hrs</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-mutedGray italic">No work hours logged yet.</p>
              )}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedProject(null)}
                className="px-5 py-2 rounded-xl bg-charcoal-900 text-white font-medium text-xs shadow-xs"
              >
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Record Hours Modal */}
      <WorkLogModal
        isOpen={!!logModalProject}
        onClose={() => setLogModalProject(null)}
        project={logModalProject}
      />

    </div>
  );
};
