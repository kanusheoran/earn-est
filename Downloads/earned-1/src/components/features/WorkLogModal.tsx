import React, { useState } from 'react';
import { Project } from '../../types';
import { useApp } from '../../context/AppContext';
import { Modal } from '../common/Modal';
import { Clock, CheckSquare } from 'lucide-react';

interface WorkLogModalProps {
  isOpen: boolean;
  onClose: () => void;
  project?: Project | null;
}

export const WorkLogModal: React.FC<WorkLogModalProps> = ({
  isOpen,
  onClose,
  project,
}) => {
  const { currentStudent, submitWorkLog, projects, programmeSettings } = useApp();
  const [selectedProjectId, setSelectedProjectId] = useState<string>(project?.id || projects[0]?.id || '');
  const [hours, setHours] = useState<number>(2);
  const [description, setDescription] = useState('');
  const [errorText, setErrorText] = useState<string | null>(null);

  const activeProject = projects.find(p => p.id === (project?.id || selectedProjectId)) || projects[0];

  const hourCap = programmeSettings.monthlyHourCap || 20;
  const remainingHours = Math.max(0, hourCap - currentStudent.monthlyHoursWorked);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (hours <= 0) {
      setErrorText('Please enter a valid number of hours worked (greater than 0).');
      return;
    }
    if (hours > remainingHours) {
      setErrorText(`Logging ${hours} hours exceeds your monthly remaining limit of ${remainingHours} hours.`);
      return;
    }
    if (!description.trim()) {
      setErrorText('Please describe what tasks were completed during this session.');
      return;
    }

    submitWorkLog(activeProject.id, hours, description);
    onClose();
    setDescription('');
    setHours(2);
    setErrorText(null);
  };

  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Record Project Hours"
      subtitle={activeProject ? `${activeProject.title} · ${activeProject.organizationName}` : 'Select an active project'}
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Project selector if not pre-locked */}
        {!project && projects.length > 0 && (
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-charcoal-900 mb-1.5">
              Select Active Project
            </label>
            <select
              value={selectedProjectId}
              onChange={(e) => setSelectedProjectId(e.target.value)}
              className="w-full rounded-xl border border-lavender-200 p-2.5 text-xs text-charcoal-900 bg-white focus:outline-none focus:ring-2 focus:ring-plum-400"
            >
              {projects.map(p => (
                <option key={p.id} value={p.id}>
                  {p.title} ({p.organizationName})
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Current monthly balance preview */}
        <div className="p-3 rounded-2xl bg-ivory-50 border border-lavender-200 text-xs flex items-center justify-between">
          <div>
            <span className="text-mutedGray">Monthly Cap Status:</span>
            <div className="font-semibold text-charcoal-900">
              {currentStudent.monthlyHoursWorked} / {hourCap} hrs used
            </div>
          </div>
          <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-sage-200 text-forest-700">
            {remainingHours}h remaining
          </span>
        </div>

        {/* Hours Worked */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-charcoal-900 mb-1.5">
            Hours Worked Today <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <input
              type="number"
              min="0.5"
              max={remainingHours}
              step="0.5"
              value={hours}
              onChange={(e) => setHours(parseFloat(e.target.value) || 0)}
              className="w-full rounded-xl border border-lavender-200 px-3 py-2 text-xs text-charcoal-900 pl-9 focus:outline-none focus:ring-2 focus:ring-plum-400 bg-white"
            />
            <Clock className="w-4 h-4 text-plum-500 absolute left-3 top-2.5" />
          </div>
          <span className="text-[11px] text-mutedGray mt-1 block">
            Maximum you can log this session: {remainingHours} hours.
          </span>
        </div>

        {/* Task Description */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-charcoal-900 mb-1.5">
            Work Description & Deliverables <span className="text-rose-500">*</span>
          </label>
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Detailed description of components drafted, bug fixes, or research performed..."
            className="w-full rounded-xl border border-lavender-200 p-3 text-xs text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-plum-400 bg-white"
          />
        </div>

        {errorText && (
          <p className="text-xs text-rose-600 font-medium">
            {errorText}
          </p>
        )}

        {/* Actions */}
        <div className="pt-3 border-t border-ivory-200 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-lavender-200 text-xs font-semibold text-charcoal-800 hover:bg-lavender-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2 rounded-xl bg-plum-500 hover:bg-plum-600 text-white text-xs font-semibold shadow-sm transition-colors flex items-center gap-1.5"
          >
            <CheckSquare className="w-4 h-4" />
            <span>Confirm & Record Hours</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};
