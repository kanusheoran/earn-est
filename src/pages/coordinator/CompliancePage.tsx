import React, { useState } from 'react';
import { 
  ShieldAlert, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  GraduationCap, 
  Search, 
  Check, 
  X,
  ExternalLink,
  ShieldCheck,
  UserCheck
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../../components/common/StatusBadge';
import { ComplianceAlert } from '../../types';

export const CompliancePage: React.FC = () => {
  const { complianceAlerts, programmeSettings, allStudents, showToast } = useApp();
  const [selectedSeverity, setSelectedSeverity] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeAlertModal, setActiveAlertModal] = useState<ComplianceAlert | null>(null);
  const [interventionNote, setInterventionNote] = useState<string>('');
  const [resolvedIds, setResolvedIds] = useState<Set<string>>(new Set());

  const hourCap = programmeSettings.monthlyHourCap || 20;

  // Real-time dynamic compliance statistics
  const overCapCount = allStudents.filter(s => s.monthlyHoursWorked >= hourCap).length;
  const approachingCapCount = allStudents.filter(s => s.monthlyHoursWorked >= 15 && s.monthlyHoursWorked < hourCap).length;
  const belowCgpaCount = allStudents.filter(s => s.cgpa < programmeSettings.minimumCgpa).length;

  const handleOpenActionModal = (alert: ComplianceAlert) => {
    setActiveAlertModal(alert);
    setInterventionNote(alert.suggestedAction || '');
  };

  const handleResolveAlert = (id: string, note: string) => {
    setResolvedIds(prev => new Set([...prev, id]));
    setActiveAlertModal(null);
    showToast('Action Recorded', `Intervention recorded for issue ${id}.`, 'success');
  };

  const filteredAlerts = complianceAlerts.filter(a => {
    if (selectedSeverity !== 'All' && a.severity !== selectedSeverity) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchName = a.studentName.toLowerCase().includes(q);
      const matchType = a.type.toLowerCase().includes(q);
      const matchDept = a.department.toLowerCase().includes(q);
      if (!matchName && !matchType && !matchDept) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-lavender-200/80">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-charcoal-900">
            Academic Compliance
          </h1>
          <p className="text-sm text-mutedGray mt-1">
            Monitor student work limits, academic thresholds, and policy safeguards.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-full bg-sage-200 text-forest-700 font-bold text-xs border border-sage-300 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-forest-600" />
            <span>{hourCap}h Monthly Cap Active</span>
          </span>
        </div>
      </div>

      {/* 3 Clean Summary Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl p-5 bg-white border border-lavender-200/90 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs text-mutedGray font-medium">Cap Reached (100%+)</div>
            <div className="text-2xl font-serif font-bold text-rose-700 mt-1">{overCapCount}</div>
            <div className="text-[11px] text-mutedGray mt-0.5">Applications restricted</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>

        <div className="rounded-2xl p-5 bg-white border border-lavender-200/90 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs text-mutedGray font-medium">Approaching Cap (75–99%)</div>
            <div className="text-2xl font-serif font-bold text-amber-800 mt-1">{approachingCapCount}</div>
            <div className="text-[11px] text-mutedGray mt-0.5">15–19 hours logged</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="rounded-2xl p-5 bg-white border border-lavender-200/90 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs text-mutedGray font-medium">Below Min CGPA</div>
            <div className="text-2xl font-serif font-bold text-rose-700 mt-1">{belowCgpaCount}</div>
            <div className="text-[11px] text-mutedGray mt-0.5">&lt; {programmeSettings.minimumCgpa.toFixed(1)} threshold</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center">
            <GraduationCap className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-mutedGray absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search student, department, or issue..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-lavender-200 bg-white focus:outline-none focus:ring-2 focus:ring-plum-400"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <span className="text-xs text-mutedGray font-medium">Severity:</span>
          <select
            value={selectedSeverity}
            onChange={(e) => setSelectedSeverity(e.target.value)}
            className="rounded-xl border border-lavender-200 px-3 py-2 text-xs text-charcoal-800 bg-white focus:outline-none focus:ring-2 focus:ring-forest-500"
          >
            <option value="All">All Severities</option>
            <option value="Critical">Critical</option>
            <option value="Warning">Warning</option>
            <option value="Info">Info</option>
          </select>
        </div>
      </div>

      {/* Clean, Focused Table */}
      <div className="rounded-2xl bg-white border border-lavender-200/90 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-ivory-200 bg-ivory-50/50 text-mutedGray text-[11px] font-semibold">
                <th className="py-3 px-4">Student</th>
                <th className="py-3 px-4">Safeguard Issue</th>
                <th className="py-3 px-4">Severity</th>
                <th className="py-3 px-4">Current Value</th>
                <th className="py-3 px-4">Permitted</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ivory-200">
              {filteredAlerts.length > 0 ? (
                filteredAlerts.map((alert) => {
                  const isResolved = resolvedIds.has(alert.id);
                  return (
                    <tr 
                      key={alert.id} 
                      className={`hover:bg-ivory-50/70 transition-colors ${isResolved ? 'opacity-50 bg-ivory-50/30' : ''}`}
                    >
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-charcoal-900">{alert.studentName}</div>
                        <div className="text-[11px] text-mutedGray">{alert.department}</div>
                      </td>

                      <td className="py-3.5 px-4 font-medium text-charcoal-900">
                        {alert.type}
                      </td>

                      <td className="py-3.5 px-4">
                        <StatusBadge status={alert.severity} size="sm" />
                      </td>

                      <td className="py-3.5 px-4 font-bold text-charcoal-900">
                        {alert.currentValue}
                      </td>

                      <td className="py-3.5 px-4 text-mutedGray">
                        {alert.permittedValue}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        {isResolved ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-forest-700 bg-sage-200 px-2.5 py-1 rounded-full border border-sage-300">
                            <Check className="w-3 h-3" />
                            <span>Resolved</span>
                          </span>
                        ) : (
                          <button
                            onClick={() => handleOpenActionModal(alert)}
                            className="px-3 py-1.5 rounded-xl bg-plum-500 hover:bg-plum-600 text-white font-medium text-xs transition-colors"
                          >
                            Review & Act
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-xs text-mutedGray">
                    No compliance alerts match the current filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Action / Detail Modal */}
      {activeAlertModal && (
        <div className="fixed inset-0 z-50 bg-charcoal-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-5 shadow-soft-xl border border-lavender-200 animate-in zoom-in-95">
            <div className="flex items-start justify-between pb-3 border-b border-ivory-200">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-plum-600">Compliance Intervention</span>
                <h3 className="font-serif font-bold text-xl text-charcoal-900 mt-0.5">
                  {activeAlertModal.studentName}
                </h3>
                <p className="text-xs text-mutedGray">{activeAlertModal.department}</p>
              </div>
              <button
                onClick={() => setActiveAlertModal(null)}
                className="w-8 h-8 rounded-full bg-ivory-100 text-mutedGray hover:text-charcoal-900 flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-ivory-50 border border-ivory-200 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-mutedGray">Rule Flagged:</span>
                <span className="font-bold text-charcoal-900">{activeAlertModal.type}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-mutedGray">Current Value:</span>
                <span className="font-bold text-rose-700">{activeAlertModal.currentValue}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-mutedGray">Policy Limit:</span>
                <span className="font-medium text-charcoal-800">{activeAlertModal.permittedValue}</span>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-charcoal-900 block">
                Recommended Action / Notes
              </label>
              <textarea
                rows={3}
                value={interventionNote}
                onChange={(e) => setInterventionNote(e.target.value)}
                placeholder="Enter notes on coordinator action, advisor meeting, or temporary exception..."
                className="w-full text-xs rounded-xl border border-lavender-200 p-3 text-charcoal-800 focus:outline-none focus:ring-2 focus:ring-plum-400 bg-white"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-ivory-200">
              <button
                onClick={() => setActiveAlertModal(null)}
                className="px-4 py-2 rounded-xl text-xs font-medium text-mutedGray hover:text-charcoal-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleResolveAlert(activeAlertModal.id, interventionNote)}
                className="px-5 py-2 rounded-xl bg-forest-600 hover:bg-forest-700 text-white font-semibold text-xs shadow-xs transition-colors"
              >
                Confirm & Resolve Flag
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
