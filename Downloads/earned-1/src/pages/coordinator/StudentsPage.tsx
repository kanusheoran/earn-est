import React, { useState, useMemo } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  GraduationCap, 
  Clock, 
  DollarSign, 
  CheckCircle2, 
  AlertTriangle, 
  Eye, 
  Download,
  RotateCcw
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Modal } from '../../components/common/Modal';
import { StudentProfile } from '../../types';

export const StudentsPage: React.FC = () => {
  const { allStudents, programmeSettings, checkStudentEligibility } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('All');
  const [tierFilter, setTierFilter] = useState('All');
  const [eligibilityFilter, setEligibilityFilter] = useState('All');
  const [inspectStudent, setInspectStudent] = useState<StudentProfile | null>(null);

  // Departments list
  const departments = useMemo(() => {
    return Array.from(new Set(allStudents.map(s => s.department)));
  }, [allStudents]);

  // Filtered students
  const filteredStudents = useMemo(() => {
    return allStudents.filter(std => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = std.name.toLowerCase().includes(q);
        const matchId = std.studentId.toLowerCase().includes(q);
        const matchEmail = std.email.toLowerCase().includes(q);
        if (!matchName && !matchId && !matchEmail) return false;
      }

      if (departmentFilter !== 'All' && std.department !== departmentFilter) {
        return false;
      }

      if (tierFilter !== 'All' && std.tier !== tierFilter) {
        return false;
      }

      const el = checkStudentEligibility(undefined, std);
      if (eligibilityFilter === 'Eligible' && !el.isEligible) return false;
      if (eligibilityFilter === 'Restricted' && el.isEligible) return false;

      return true;
    });
  }, [allStudents, searchQuery, departmentFilter, tierFilter, eligibilityFilter, checkStudentEligibility]);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-lavender-200/80">
        <div>
          <div className="flex items-center gap-2">
            <Users className="w-6 h-6 text-forest-600" />
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-charcoal-900">
              Student Directory & Safeguard Tracking
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-mutedGray mt-1">
            Search, filter, and inspect enrolled university students, their work-hour caps, CGPA standings, and earnings.
          </p>
        </div>

        <button
          onClick={() => alert('Simulating exporting full campus safeguard report to CSV...')}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-lavender-200 text-charcoal-800 text-xs font-semibold hover:bg-lavender-50 transition-colors shrink-0"
        >
          <Download className="w-3.5 h-3.5 text-forest-600" />
          <span>Export Student CSV</span>
        </button>
      </div>

      {/* Filter Controls */}
      <div className="card-subtle rounded-3xl p-4 bg-white border border-lavender-200/90 space-y-3">
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search student by name, student ID, or university email..."
            className="w-full rounded-2xl border border-lavender-200 px-4 py-2.5 pl-11 text-xs text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-forest-500 bg-ivory-50/60"
          />
          <Search className="w-5 h-5 text-forest-600 absolute left-3.5 top-2.5" />
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-1 text-xs">
          {/* Department */}
          <select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            className="rounded-xl border border-lavender-200 px-3 py-1.5 bg-white text-charcoal-800 focus:outline-none focus:ring-2 focus:ring-forest-500"
          >
            <option value="All">All Departments</option>
            {departments.map(d => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>

          {/* Tier */}
          <select
            value={tierFilter}
            onChange={(e) => setTierFilter(e.target.value)}
            className="rounded-xl border border-lavender-200 px-3 py-1.5 bg-white text-charcoal-800 focus:outline-none focus:ring-2 focus:ring-forest-500"
          >
            <option value="All">All Tiers</option>
            <option value="Bronze">Bronze</option>
            <option value="Silver">Silver</option>
            <option value="Gold">Gold</option>
            <option value="Platinum">Platinum</option>
          </select>

          {/* Eligibility Filter */}
          <select
            value={eligibilityFilter}
            onChange={(e) => setEligibilityFilter(e.target.value)}
            className="rounded-xl border border-lavender-200 px-3 py-1.5 bg-white text-charcoal-800 focus:outline-none focus:ring-2 focus:ring-forest-500"
          >
            <option value="All">All Standing Statuses</option>
            <option value="Eligible">Compliant Only</option>
            <option value="Restricted">Action / Hold Required</option>
          </select>

          {(searchQuery || departmentFilter !== 'All' || tierFilter !== 'All' || eligibilityFilter !== 'All') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setDepartmentFilter('All');
                setTierFilter('All');
                setEligibilityFilter('All');
              }}
              className="flex items-center gap-1 text-xs text-mutedGray hover:text-forest-700 p-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Student Table */}
      <div className="card-subtle rounded-3xl p-6 bg-white border border-lavender-200/90 space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-ivory-200 text-xs text-mutedGray">
          <span>Found <strong>{filteredStudents.length}</strong> enrolled students</span>
          <span>Monthly Cap: {programmeSettings.monthlyHourCap} hrs</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-ivory-200 text-mutedGray text-[10px] uppercase tracking-wider">
                <th className="py-3 px-3">Student</th>
                <th className="py-3 px-3">Department & Semester</th>
                <th className="py-3 px-3">CGPA</th>
                <th className="py-3 px-3">Tier</th>
                <th className="py-3 px-3">Monthly Workload</th>
                <th className="py-3 px-3">Verified Payouts</th>
                <th className="py-3 px-3">Safeguard Status</th>
                <th className="py-3 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ivory-200">
              {filteredStudents.map((std) => {
                const el = checkStudentEligibility(undefined, std);
                const hourCap = programmeSettings.monthlyHourCap || 20;
                const isOverCap = std.monthlyHoursWorked >= hourCap;
                const isNearCap = std.monthlyHoursWorked >= 18;

                return (
                  <tr key={std.id} className="hover:bg-ivory-50/70 transition-colors">
                    {/* Student Info */}
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={std.avatarUrl}
                          alt={std.name}
                          className="w-8 h-8 rounded-full object-cover border border-lavender-200 shrink-0"
                        />
                        <div>
                          <div className="font-bold text-charcoal-900">{std.name}</div>
                          <div className="text-[10px] text-mutedGray">{std.studentId}</div>
                        </div>
                      </div>
                    </td>

                    {/* Department */}
                    <td className="py-3 px-3">
                      <div className="font-medium text-charcoal-800 line-clamp-1">{std.department}</div>
                      <div className="text-[10px] text-mutedGray">Sem {std.semester} · {std.degree}</div>
                    </td>

                    {/* CGPA */}
                    <td className="py-3 px-3 font-semibold text-charcoal-900">
                      <span className={std.cgpa < programmeSettings.minimumCgpa ? 'text-rose-600 font-bold' : ''}>
                        {std.cgpa.toFixed(1)} / 10.0
                      </span>
                    </td>

                    {/* Tier */}
                    <td className="py-3 px-3">
                      <StatusBadge status={std.tier} size="sm" />
                    </td>

                    {/* Monthly Hours */}
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-1.5 font-semibold text-charcoal-900">
                        <span>{std.monthlyHoursWorked} / {hourCap}h</span>
                        {isOverCap ? (
                          <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0" title="Cap Exceeded" />
                        ) : isNearCap ? (
                          <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" title="Near Cap" />
                        ) : null}
                      </div>
                      <div className="w-20 bg-ivory-200 h-1.5 rounded-full mt-1 overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            isOverCap ? 'bg-rose-500' : isNearCap ? 'bg-amber-400' : 'bg-forest-500'
                          }`}
                          style={{ width: `${Math.min(100, (std.monthlyHoursWorked / hourCap) * 100)}%` }}
                        />
                      </div>
                    </td>

                    {/* Verified Earnings */}
                    <td className="py-3 px-3 font-serif font-bold text-forest-700">
                      ₹{std.verifiedEarnings.toLocaleString('en-IN')}
                    </td>

                    {/* Safeguard Status */}
                    <td className="py-3 px-3">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${
                        el.isEligible
                          ? 'bg-sage-200 text-forest-700 border-sage-300'
                          : 'bg-rose-50 text-rose-700 border-rose-200'
                      }`}>
                        {el.isEligible ? (
                          <>
                            <CheckCircle2 className="w-3 h-3 text-forest-600" />
                            <span>Compliant</span>
                          </>
                        ) : (
                          <>
                            <AlertTriangle className="w-3 h-3 text-rose-600" />
                            <span>Action Req</span>
                          </>
                        )}
                      </span>
                    </td>

                    {/* Action */}
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => setInspectStudent(std)}
                        className="px-3 py-1 rounded-xl bg-ivory-100 hover:bg-lavender-100 text-charcoal-900 font-semibold transition-colors flex items-center gap-1 ml-auto"
                      >
                        <Eye className="w-3.5 h-3.5 text-plum-600" />
                        <span>Inspect</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Student Inspector Modal */}
      {inspectStudent && (
        <Modal
          isOpen={!!inspectStudent}
          onClose={() => setInspectStudent(null)}
          title={`Student File: ${inspectStudent.name}`}
          subtitle={`ID: ${inspectStudent.studentId} · ${inspectStudent.department}`}
          maxWidth="lg"
        >
          <div className="space-y-5 text-xs">
            {/* Header Persona card */}
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-ivory-50 border border-lavender-200">
              <img
                src={inspectStudent.avatarUrl}
                alt={inspectStudent.name}
                className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-xs"
              />
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-serif font-bold text-base text-charcoal-900">{inspectStudent.name}</h4>
                  <StatusBadge status={inspectStudent.tier} size="sm" />
                </div>
                <p className="text-mutedGray text-[11px]">{inspectStudent.email}</p>
                <p className="text-charcoal-800 font-medium">{inspectStudent.degree} · Semester {inspectStudent.semester}</p>
              </div>
            </div>

            {/* Academic Safeguards Audit */}
            <div className="p-4 rounded-2xl bg-sage-50/60 border border-sage-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold uppercase tracking-wider text-forest-800 text-[10px]">
                  Academic Safeguard Health
                </span>
                <span className="text-xs font-semibold text-charcoal-900">
                  CGPA {inspectStudent.cgpa.toFixed(1)} / 10.0 (Min: {programmeSettings.minimumCgpa.toFixed(1)})
                </span>
              </div>
              <div className="flex justify-between items-center text-xs pt-1">
                <span className="text-mutedGray">Monthly Hours Logged:</span>
                <span className="font-bold text-charcoal-900">
                  {inspectStudent.monthlyHoursWorked} / {programmeSettings.monthlyHourCap} hours
                </span>
              </div>
              {inspectStudent.cgpa < programmeSettings.minimumCgpa && (
                <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-[11px] font-medium">
                  Student CGPA is below the minimum threshold. Automatic hold active on new opportunity applications.
                </div>
              )}
            </div>

            {/* Financial History */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-white border border-lavender-200">
                <span className="text-mutedGray text-[10px] uppercase font-bold">Total Verified Earnings</span>
                <div className="font-serif font-bold text-forest-700 text-lg mt-0.5">₹{inspectStudent.verifiedEarnings.toLocaleString('en-IN')}</div>
              </div>
              <div className="p-3.5 rounded-2xl bg-white border border-lavender-200">
                <span className="text-mutedGray text-[10px] uppercase font-bold">Pending Review</span>
                <div className="font-serif font-bold text-charcoal-900 text-lg mt-0.5">₹{inspectStudent.pendingEarnings.toLocaleString('en-IN')}</div>
              </div>
            </div>

            {/* Skills */}
            <div>
              <span className="font-bold uppercase tracking-wider text-mutedGray text-[10px] block mb-1.5">
                Skills & Verification
              </span>
              <div className="flex flex-wrap gap-1.5">
                {inspectStudent.skills.map((s) => (
                  <span key={s} className="px-2.5 py-1 rounded-lg bg-ivory-100 text-charcoal-800 font-medium text-[11px]">
                    {s}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-ivory-200 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setInspectStudent(null)}
                className="px-4 py-2 rounded-xl bg-charcoal-900 text-white font-semibold text-xs"
              >
                Close File
              </button>
            </div>
          </div>
        </Modal>
      )}

    </div>
  );
};
