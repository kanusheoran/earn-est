import React, { useState } from 'react';
import { Opportunity } from '../../types';
import { useApp } from '../../context/AppContext';
import { Modal } from '../common/Modal';
import { HourUsageProgress } from '../common/HourUsageProgress';
import { CheckCircle2, AlertTriangle, FileUp, Send } from 'lucide-react';

interface ApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  opportunity: Opportunity | null;
}

export const ApplicationModal: React.FC<ApplicationModalProps> = ({
  isOpen,
  onClose,
  opportunity,
}) => {
  const { currentStudent, applyForOpportunity, checkStudentEligibility } = useApp();
  const [coverMessage, setCoverMessage] = useState('');
  const [portfolioLink, setPortfolioLink] = useState(currentStudent.portfolioUrl || '');
  const [uploadedFile, setUploadedFile] = useState<string | null>(currentStudent.resumeFileName || null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorText, setErrorText] = useState<string | null>(null);

  if (!opportunity) return null;

  const eligibility = checkStudentEligibility(opportunity, currentStudent);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!coverMessage.trim()) {
      setErrorText('Please write a brief cover message explaining your interest and qualifications.');
      return;
    }

    setIsSubmitting(true);
    setErrorText(null);

    setTimeout(() => {
      const res = applyForOpportunity(
        opportunity.id,
        coverMessage,
        portfolioLink,
        uploadedFile || undefined
      );

      setIsSubmitting(false);
      if (res.success) {
        onClose();
        setCoverMessage('');
      } else {
        setErrorText(res.message);
      }
    }, 400);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Apply for Opportunity"
      subtitle={`${opportunity.title} · ${opportunity.organizationName}`}
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Academic Safeguard Pre-Flight Verification */}
        <div className="p-4 rounded-2xl bg-ivory-50 border border-lavender-200 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-charcoal-800">
              Academic Safeguard Check
            </span>
            <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${
              eligibility.canApply
                ? 'bg-sage-200 text-forest-700 border-sage-300'
                : 'bg-rose-100 text-rose-800 border-rose-200'
            }`}>
              {eligibility.canApply ? 'All Safeguards Passed' : 'Safeguard Block Active'}
            </span>
          </div>

          <HourUsageProgress
            hoursUsed={currentStudent.monthlyHoursWorked}
            hourLimit={currentStudent.monthlyHourLimit || 20}
            estimatedAdditionalHours={opportunity.estimatedHours}
            showDetails={true}
          />

          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-ivory-200 text-xs text-charcoal-800">
            <div>
              <span className="text-mutedGray text-[11px]">Academic CGPA:</span>
              <p className="font-semibold text-charcoal-900">
                {currentStudent.cgpa.toFixed(2)} (Req: {opportunity.minimumCgpa.toFixed(1)})
              </p>
            </div>
            <div>
              <span className="text-mutedGray text-[11px]">Estimated Work:</span>
              <p className="font-semibold text-charcoal-900">
                ~{opportunity.estimatedHours} hrs (${opportunity.compensation})
              </p>
            </div>
          </div>

          {!eligibility.canApply && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
              <div>
                <p className="font-bold">Application Blocked:</p>
                <p>{eligibility.reasons.join(' ')}</p>
              </div>
            </div>
          )}
        </div>

        {/* Cover Note */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-charcoal-900 mb-1.5">
            Cover Message & Relevant Experience <span className="text-rose-500">*</span>
          </label>
          <textarea
            rows={4}
            value={coverMessage}
            onChange={(e) => setCoverMessage(e.target.value)}
            placeholder="Introduce yourself, describe relevant projects or skills, and explain your availability for this milestone..."
            className="w-full rounded-2xl border border-lavender-200 p-3 text-xs text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-plum-400 bg-white"
          />
        </div>

        {/* Portfolio Link */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-charcoal-900 mb-1.5">
            Portfolio / GitHub / Work Sample URL
          </label>
          <input
            type="url"
            value={portfolioLink}
            onChange={(e) => setPortfolioLink(e.target.value)}
            placeholder="https://yourportfolio.dev or GitHub repo"
            className="w-full rounded-xl border border-lavender-200 px-3 py-2 text-xs text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-plum-400 bg-white"
          />
        </div>

        {/* Supporting Document / Resume simulation */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-charcoal-900 mb-1.5">
            Resume / Academic Verification
          </label>
          <div className="flex items-center justify-between p-3 rounded-xl border border-dashed border-lavender-300 bg-lavender-50/50 text-xs">
            <div className="flex items-center gap-2 text-charcoal-800 truncate">
              <FileUp className="w-4 h-4 text-plum-500 shrink-0" />
              <span className="truncate">{uploadedFile || 'Upload supplementary PDF or certificate'}</span>
            </div>
            <button
              type="button"
              onClick={() => setUploadedFile(`${currentStudent.name.replace(' ', '_')}_Resume_2026.pdf`)}
              className="text-plum-600 font-semibold hover:underline shrink-0 ml-2"
            >
              Attach File
            </button>
          </div>
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
            className="px-4 py-2.5 rounded-xl border border-lavender-200 text-xs font-semibold text-charcoal-800 hover:bg-lavender-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!eligibility.canApply || isSubmitting}
            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold text-white shadow-sm transition-all ${
              eligibility.canApply && !isSubmitting
                ? 'bg-plum-500 hover:bg-plum-600'
                : 'bg-mutedGray-light cursor-not-allowed'
            }`}
          >
            <Send className="w-3.5 h-3.5" />
            <span>{isSubmitting ? 'Verifying & Submitting...' : 'Submit Application'}</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};
