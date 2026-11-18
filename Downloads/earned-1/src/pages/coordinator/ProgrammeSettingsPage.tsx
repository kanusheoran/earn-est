import React, { useState } from 'react';
import { SlidersHorizontal, ShieldCheck, AlertTriangle, Save, RotateCcw } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ProgrammeSettingsPage: React.FC = () => {
  const { programmeSettings, updateProgrammeSettings, showToast } = useApp();

  const [minCgpa, setMinCgpa] = useState(programmeSettings.minimumCgpa.toString());
  const [hourCap, setHourCap] = useState(programmeSettings.monthlyHourCap.toString());
  const [maxProjects, setMaxProjects] = useState(programmeSettings.maxActiveProjects.toString());
  const [requireTraining, setRequireTraining] = useState(programmeSettings.requireTrainingForFirstOpportunity);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setShowConfirmModal(true);
  };

  const confirmApply = () => {
    updateProgrammeSettings({
      minimumCgpa: parseFloat(minCgpa) || 7.0,
      monthlyHourCap: parseInt(hourCap) || 20,
      maxActiveProjects: parseInt(maxProjects) || 2,
      requireTrainingForFirstOpportunity: requireTraining,
    });
    setShowConfirmModal(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 max-w-4xl mx-auto">
      
      {/* Header */}
      <div className="pb-3 border-b border-lavender-200/80">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-6 h-6 text-forest-600" />
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-charcoal-900">
            Programme Rules & Safeguard Thresholds
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-mutedGray mt-1">
          Configure university-wide eligibility rules, student workload caps, and academic safeguard policies.
        </p>
      </div>

      {/* Main Settings Form */}
      <form onSubmit={handleSave} className="card-subtle rounded-3xl p-6 sm:p-8 bg-white border border-lavender-200/90 space-y-6 text-xs">
        
        {/* Notice */}
        <div className="p-4 rounded-2xl bg-sage-50 border border-sage-200 text-charcoal-800 flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-forest-600 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <h4 className="font-bold text-forest-800">Faculty Safeguard Governance</h4>
            <p className="text-[11px] text-mutedGray leading-relaxed">
              Modifying these thresholds updates backend eligibility validation in real-time. Students exceeding updated limits will be held from new applications automatically.
            </p>
          </div>
        </div>

        {/* Setting 1: Monthly Work-Hour Cap */}
        <div className="space-y-1.5 pb-4 border-b border-ivory-200">
          <label className="block font-bold uppercase tracking-wider text-charcoal-900">
            Monthly Student Work-Hour Cap (Hours/Month)
          </label>
          <div className="flex items-center gap-3">
            <input
              type="number"
              min="10"
              max="40"
              required
              value={hourCap}
              onChange={(e) => setHourCap(e.target.value)}
              className="w-32 rounded-xl border border-lavender-200 px-3 py-2 text-charcoal-900 font-bold text-sm focus:outline-none focus:ring-2 focus:ring-forest-500 bg-white"
            />
            <span className="text-mutedGray text-[11px]">
              Recommended university ceiling is 20 hours/month during active term.
            </span>
          </div>
        </div>

        {/* Setting 2: Minimum CGPA */}
        <div className="space-y-1.5 pb-4 border-b border-ivory-200">
          <label className="block font-bold uppercase tracking-wider text-charcoal-900">
            Minimum Academic CGPA Standard
          </label>
          <div className="flex items-center gap-3">
            <input
              type="number"
              step="0.1"
              min="5.0"
              max="10.0"
              required
              value={minCgpa}
              onChange={(e) => setMinCgpa(e.target.value)}
              className="w-32 rounded-xl border border-lavender-200 px-3 py-2 text-charcoal-900 font-bold text-sm focus:outline-none focus:ring-2 focus:ring-forest-500 bg-white"
            />
            <span className="text-mutedGray text-[11px]">
              Students below this CGPA cannot submit new project applications until academic recovery (Scale out of 10.0).
            </span>
          </div>
        </div>

        {/* Setting 3: Max Concurrent Active Projects */}
        <div className="space-y-1.5 pb-4 border-b border-ivory-200">
          <label className="block font-bold uppercase tracking-wider text-charcoal-900">
            Maximum Concurrent Active Projects
          </label>
          <div className="flex items-center gap-3">
            <input
              type="number"
              min="1"
              max="5"
              required
              value={maxProjects}
              onChange={(e) => setMaxProjects(e.target.value)}
              className="w-32 rounded-xl border border-lavender-200 px-3 py-2 text-charcoal-900 font-bold text-sm focus:outline-none focus:ring-2 focus:ring-forest-500 bg-white"
            />
            <span className="text-mutedGray text-[11px]">
              Limits multi-tasking overload to prevent academic conflict.
            </span>
          </div>
        </div>

        {/* Setting 4: Prerequisite Training Requirement */}
        <div className="space-y-1.5 pb-4 border-b border-ivory-200">
          <label className="flex items-start gap-3 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={requireTraining}
              onChange={(e) => setRequireTraining(e.target.checked)}
              className="rounded text-forest-600 focus:ring-forest-500 mt-0.5"
            />
            <div>
              <span className="font-bold text-charcoal-900">Enforce Mandatory University Policy Training</span>
              <p className="text-[11px] text-mutedGray leading-relaxed mt-0.5">
                Students must complete "University Professional Standards & Academic Safeguards" before submitting their first project application.
              </p>
            </div>
          </label>
        </div>

        {/* Action Button */}
        <div className="pt-2 flex items-center justify-end gap-3">
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-forest-600 hover:bg-forest-700 text-white font-semibold text-xs shadow-sm transition-colors flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>Apply Safeguard Rules</span>
          </button>
        </div>
      </form>

      {/* Confirmation Step Dialog */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-charcoal-900/40 backdrop-blur-sm">
          <div className="max-w-md w-full bg-white rounded-3xl p-6 shadow-2xl border border-lavender-200 space-y-4 text-xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-base text-charcoal-900">
                  Confirm Policy Rule Change
                </h3>
                <p className="text-mutedGray text-[11px]">Changes will immediately affect all student eligibility checks</p>
              </div>
            </div>

            <p className="text-charcoal-800 leading-relaxed bg-ivory-50 p-3.5 rounded-2xl border border-ivory-200">
              You are setting the <strong>Monthly Work-Hour Cap to {hourCap} hours</strong> and <strong>Minimum CGPA to {minCgpa}</strong>. Students currently exceeding these rules will be locked from accepting new work.
            </p>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-ivory-200">
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2 rounded-xl border border-lavender-200 font-semibold text-charcoal-800 hover:bg-lavender-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmApply}
                className="px-5 py-2 rounded-xl bg-forest-600 text-white font-semibold hover:bg-forest-700"
              >
                Confirm & Update Rules
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
