import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  PlusCircle, 
  ArrowRight, 
  Check, 
  Eye, 
  Clock, 
  IndianRupee, 
  GraduationCap, 
  Building2, 
  ShieldCheck,
  Sparkles 
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../../components/common/Modal';

export const PostOpportunityPage: React.FC = () => {
  const { createOpportunity, currentOrganization, showToast } = useApp();
  const navigate = useNavigate();

  // Wizard sections: 1. Basic Details, 2. Skills & Eligibility, 3. Compensation & Hours, 4. Timeline
  const [step, setStep] = useState<number>(1);

  // Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Engineering & Development');
  const [description, setDescription] = useState('');
  const [deliverables, setDeliverables] = useState('Deliverable 1: Design & implementation\nDeliverable 2: Automated testing and docs');
  const [studentsRequired, setStudentsRequired] = useState(1);

  const [skills, setSkills] = useState('React, TypeScript, CSS');
  const [minCgpa, setMinCgpa] = useState('7.0');
  const [requiredTier, setRequiredTier] = useState<'Bronze' | 'Silver' | 'Gold' | 'Platinum'>('Bronze');

  const [compensation, setCompensation] = useState('7500');
  const [compensationType, setCompensationType] = useState<'Fixed' | 'Hourly' | 'Milestone'>('Fixed');
  const [estimatedHours, setEstimatedHours] = useState('6');
  const [durationWeeks, setDurationWeeks] = useState(2);
  const [workArrangement, setWorkArrangement] = useState<'Remote' | 'On-Campus' | 'Hybrid'>('Remote');

  const [startDate, setStartDate] = useState('2026-11-20');
  const [deadline, setDeadline] = useState('2026-12-05');

  // Preview Modal
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 4) {
      setStep(step + 1);
    } else {
      setShowPreviewModal(true);
    }
  };

  const handleFinalSubmit = () => {
    const deliverablesList = deliverables
      .split('\n')
      .map(d => d.replace(/^[•\-\d\.]\s*/, '').trim())
      .filter(Boolean);

    const skillsList = skills
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    createOpportunity({
      title,
      category,
      description,
      deliverables: deliverablesList.length > 0 ? deliverablesList : ['Key project deliverable milestone'],
      responsibilities: [
        'Adhere to project specifications and code quality standards',
        'Participate in scheduled status syncs with enterprise mentor',
        'Record honest working hours within university academic limits'
      ],
      requiredSkills: skillsList.length > 0 ? skillsList : ['General Competency'],
      compensation: parseFloat(compensation) || 300,
      compensationType,
      estimatedHours: parseFloat(estimatedHours) || 6,
      workArrangement,
      deadline,
      startDate,
      durationWeeks,
      minimumCgpa: parseFloat(minCgpa) || 3.0,
      requiredTier,
      studentsRequired,
    });

    setShowPreviewModal(false);
    navigate('/enterprise/opportunities');
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300 max-w-4xl mx-auto">
      
      {/* Header */}
      <div className="pb-3 border-b border-lavender-200/80">
        <div className="flex items-center gap-2">
          <PlusCircle className="w-6 h-6 text-plum-600" />
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-charcoal-900">
            Post an Opportunity
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-mutedGray mt-1">
          Create a university work-study opportunity. Submissions are reviewed by campus coordinators to guarantee academic safeguard compatibility.
        </p>
      </div>

      {/* Stepper Header */}
      <div className="grid grid-cols-4 gap-2 text-xs">
        {[
          { num: 1, label: 'Basic Details' },
          { num: 2, label: 'Skills & Eligibility' },
          { num: 3, label: 'Compensation & Hours' },
          { num: 4, label: 'Timeline & Review' },
        ].map((s) => (
          <div
            key={s.num}
            onClick={() => s.num < step && setStep(s.num)}
            className={`p-3 rounded-2xl border transition-all text-center cursor-pointer ${
              step === s.num
                ? 'bg-plum-500 text-white border-plum-600 font-bold shadow-xs'
                : step > s.num
                ? 'bg-sage-100 text-forest-800 border-sage-200 font-semibold'
                : 'bg-white text-mutedGray border-lavender-200'
            }`}
          >
            <div className="text-[10px] uppercase font-bold tracking-wider">Step 0{s.num}</div>
            <div className="truncate mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Form Card */}
      <form onSubmit={handleNextStep} className="card-subtle rounded-3xl p-6 sm:p-8 bg-white border border-lavender-200/90 space-y-6 text-xs">
        
        {/* Step 1: Basic Details */}
        {step === 1 && (
          <div className="space-y-4 animate-in fade-in">
            <h3 className="text-base font-serif font-bold text-charcoal-900 pb-2 border-b border-ivory-200">
              Section 1: Project Identity & Scope
            </h3>

            <div>
              <label className="block font-bold uppercase tracking-wider text-charcoal-900 mb-1">
                Project Title <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Accessible React Component Primitives for Analytics Dashboard"
                className="w-full rounded-xl border border-lavender-200 p-2.5 text-xs text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-plum-400 bg-white"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold uppercase tracking-wider text-charcoal-900 mb-1">
                  Project Category <span className="text-rose-500">*</span>
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full rounded-xl border border-lavender-200 p-2 text-charcoal-900 bg-white focus:outline-none focus:ring-2 focus:ring-plum-400"
                >
                  <option value="Engineering & Development">Engineering & Development</option>
                  <option value="Design & Creative">Design & Creative</option>
                  <option value="Data & Analytics">Data & Analytics</option>
                  <option value="Content & Research">Content & Research</option>
                  <option value="Business Operations">Business Operations</option>
                </select>
              </div>

              <div>
                <label className="block font-bold uppercase tracking-wider text-charcoal-900 mb-1">
                  Students Required
                </label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={studentsRequired}
                  onChange={(e) => setStudentsRequired(parseInt(e.target.value) || 1)}
                  className="w-full rounded-xl border border-lavender-200 p-2 text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-plum-400 bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold uppercase tracking-wider text-charcoal-900 mb-1">
                Project Description <span className="text-rose-500">*</span>
              </label>
              <textarea
                rows={4}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the context of the work, what the student will learn, and expectations..."
                className="w-full rounded-xl border border-lavender-200 p-2.5 text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-plum-400 bg-white"
              />
            </div>

            <div>
              <label className="block font-bold uppercase tracking-wider text-charcoal-900 mb-1">
                Deliverables (One per line) <span className="text-rose-500">*</span>
              </label>
              <textarea
                rows={3}
                required
                value={deliverables}
                onChange={(e) => setDeliverables(e.target.value)}
                placeholder="Deliverable 1: ..."
                className="w-full rounded-xl border border-lavender-200 p-2.5 text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-plum-400 bg-white"
              />
            </div>
          </div>
        )}

        {/* Step 2: Skills & Eligibility */}
        {step === 2 && (
          <div className="space-y-4 animate-in fade-in">
            <h3 className="text-base font-serif font-bold text-charcoal-900 pb-2 border-b border-ivory-200">
              Section 2: Candidate Qualifications & Academic Requirements
            </h3>

            <div>
              <label className="block font-bold uppercase tracking-wider text-charcoal-900 mb-1">
                Required Skills (Comma separated) <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                placeholder="React, TypeScript, Tailwind, Figma..."
                className="w-full rounded-xl border border-lavender-200 p-2.5 text-xs text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-plum-400 bg-white"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold uppercase tracking-wider text-charcoal-900 mb-1">
                  Minimum Academic CGPA
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="5.0"
                  max="10.0"
                  value={minCgpa}
                  onChange={(e) => setMinCgpa(e.target.value)}
                  className="w-full rounded-xl border border-lavender-200 p-2 text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-plum-400 bg-white"
                />
                <span className="text-[11px] text-mutedGray mt-0.5 block">University minimum is 7.0 / 10.0</span>
              </div>

              <div>
                <label className="block font-bold uppercase tracking-wider text-charcoal-900 mb-1">
                  Minimum Student Tier
                </label>
                <select
                  value={requiredTier}
                  onChange={(e) => setRequiredTier(e.target.value as any)}
                  className="w-full rounded-xl border border-lavender-200 p-2 text-charcoal-900 bg-white focus:outline-none focus:ring-2 focus:ring-plum-400"
                >
                  <option value="Bronze">Bronze (All eligible students)</option>
                  <option value="Silver">Silver (2+ completed projects)</option>
                  <option value="Gold">Gold (5+ completed projects)</option>
                  <option value="Platinum">Platinum (Senior leaders)</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Compensation & Hours */}
        {step === 3 && (
          <div className="space-y-4 animate-in fade-in">
            <h3 className="text-base font-serif font-bold text-charcoal-900 pb-2 border-b border-ivory-200">
              Section 3: Compensation & Work-Hour Estimates
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold uppercase tracking-wider text-charcoal-900 mb-1">
                  Payment Amount (₹) <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="1000"
                    step="500"
                    required
                    value={compensation}
                    onChange={(e) => setCompensation(e.target.value)}
                    className="w-full rounded-xl border border-lavender-200 p-2.5 pl-8 text-xs text-charcoal-900 font-bold focus:outline-none focus:ring-2 focus:ring-plum-400 bg-white"
                  />
                  <IndianRupee className="w-4 h-4 text-plum-600 absolute left-2.5 top-3" />
                </div>
              </div>

              <div>
                <label className="block font-bold uppercase tracking-wider text-charcoal-900 mb-1">
                  Payment Structure
                </label>
                <select
                  value={compensationType}
                  onChange={(e) => setCompensationType(e.target.value as any)}
                  className="w-full rounded-xl border border-lavender-200 p-2.5 text-charcoal-900 bg-white focus:outline-none focus:ring-2 focus:ring-plum-400"
                >
                  <option value="Fixed">Fixed Milestone Stipend</option>
                  <option value="Hourly">Hourly Rate</option>
                  <option value="Milestone">Multi-Milestone</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold uppercase tracking-wider text-charcoal-900 mb-1">
                  Estimated Total Hours <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="2"
                    max="20"
                    step="1"
                    required
                    value={estimatedHours}
                    onChange={(e) => setEstimatedHours(e.target.value)}
                    className="w-full rounded-xl border border-lavender-200 p-2.5 pl-8 text-xs text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-plum-400 bg-white"
                  />
                  <Clock className="w-4 h-4 text-plum-600 absolute left-2.5 top-3" />
                </div>
                <span className="text-[11px] text-mutedGray mt-0.5 block">
                  University monthly safeguard cap is 20 hours per student.
                </span>
              </div>

              <div>
                <label className="block font-bold uppercase tracking-wider text-charcoal-900 mb-1">
                  Work Arrangement
                </label>
                <select
                  value={workArrangement}
                  onChange={(e) => setWorkArrangement(e.target.value as any)}
                  className="w-full rounded-xl border border-lavender-200 p-2.5 text-charcoal-900 bg-white focus:outline-none focus:ring-2 focus:ring-plum-400"
                >
                  <option value="Remote">Remote</option>
                  <option value="On-Campus">On-Campus Lab</option>
                  <option value="Hybrid">Hybrid</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Timeline */}
        {step === 4 && (
          <div className="space-y-4 animate-in fade-in">
            <h3 className="text-base font-serif font-bold text-charcoal-900 pb-2 border-b border-ivory-200">
              Section 4: Milestones & Deadlines
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold uppercase tracking-wider text-charcoal-900 mb-1">
                  Expected Start Date <span className="text-rose-500">*</span>
                </label>
                <input
                  type="date"
                  required
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full rounded-xl border border-lavender-200 p-2.5 text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-plum-400 bg-white"
                />
              </div>

              <div>
                <label className="block font-bold uppercase tracking-wider text-charcoal-900 mb-1">
                  Project Deadline <span className="text-rose-500">*</span>
                </label>
                <input
                  type="date"
                  required
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className="w-full rounded-xl border border-lavender-200 p-2.5 text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-plum-400 bg-white"
                />
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-peach-50 border border-peach-200 flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-plum-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-charcoal-900">University Moderation Process</h4>
                <p className="text-[11px] text-mutedGray leading-relaxed">
                  Upon submission, this opportunity will enter <strong>Pending Approval</strong> state. A University Coordinator will verify compliance with academic hour guidelines before publishing to eligible students.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Step Navigation Controls */}
        <div className="pt-4 border-t border-ivory-200 flex items-center justify-between">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="px-4 py-2 rounded-xl border border-lavender-200 text-charcoal-800 font-semibold hover:bg-lavender-50 transition-colors"
            >
              Back
            </button>
          ) : (
            <div />
          )}

          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-plum-500 hover:bg-plum-600 text-white font-semibold shadow-xs transition-colors flex items-center gap-1.5"
          >
            <span>{step === 4 ? 'Preview & Submit for Approval' : 'Continue to Next Step'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </form>

      {/* Final Preview & Confirmation Modal */}
      {showPreviewModal && (
        <Modal
          isOpen={showPreviewModal}
          onClose={() => setShowPreviewModal(false)}
          title="Review Opportunity Before Submission"
          subtitle={`${currentOrganization.name} · ${category}`}
          maxWidth="lg"
        >
          <div className="space-y-4 text-xs">
            <div className="p-4 rounded-2xl bg-ivory-50 border border-lavender-200 space-y-2">
              <h4 className="text-base font-serif font-bold text-charcoal-900">{title}</h4>
              <p className="text-mutedGray leading-relaxed">{description}</p>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 rounded-xl bg-white border border-lavender-200">
                <span className="text-[10px] text-mutedGray uppercase font-bold">Stipend</span>
                <div className="font-serif font-bold text-forest-700 text-base mt-0.5">${compensation}</div>
              </div>
              <div className="p-3 rounded-xl bg-white border border-lavender-200">
                <span className="text-[10px] text-mutedGray uppercase font-bold">Work Allowance</span>
                <div className="font-bold text-charcoal-900 mt-0.5">{estimatedHours} hrs total</div>
              </div>
              <div className="p-3 rounded-xl bg-white border border-lavender-200">
                <span className="text-[10px] text-mutedGray uppercase font-bold">Min Standing</span>
                <div className="font-bold text-charcoal-900 mt-0.5">{minCgpa} CGPA</div>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-sage-50 border border-sage-200 text-forest-800 text-[11px]">
              ✓ Complies with university monthly student hour limits ({estimatedHours}h &lt;= 20h cap).
            </div>

            <div className="pt-3 border-t border-ivory-200 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowPreviewModal(false)}
                className="px-4 py-2 rounded-xl border border-lavender-200 font-semibold text-charcoal-800 hover:bg-lavender-50"
              >
                Back to Edit
              </button>
              <button
                type="button"
                onClick={handleFinalSubmit}
                className="px-6 py-2 rounded-xl bg-plum-500 hover:bg-plum-600 text-white font-semibold shadow-xs"
              >
                Confirm & Submit for Review
              </button>
            </div>
          </div>
        </Modal>
      )}

    </div>
  );
};
