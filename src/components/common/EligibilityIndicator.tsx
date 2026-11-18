import React from 'react';
import { CheckCircle2, XCircle, AlertCircle, GraduationCap, Clock, Award } from 'lucide-react';
import { EligibilityResult } from '../../context/SafeguardEngine';

interface EligibilityIndicatorProps {
  eligibility: EligibilityResult;
  studentCgpa: number;
  minimumCgpa?: number;
  compact?: boolean;
  className?: string;
}

export const EligibilityIndicator: React.FC<EligibilityIndicatorProps> = ({
  eligibility,
  studentCgpa,
  minimumCgpa = 3.0,
  compact = false,
  className = '',
}) => {
  const { isEligible, cgpaOk, hoursOk, trainingOk, tierOk, reasons, remainingMonthlyHours, hourLimit } = eligibility;

  if (compact) {
    return (
      <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${
        isEligible 
          ? 'bg-sage-200 text-forest-700 border-sage-300' 
          : 'bg-rose-50 text-rose-700 border-rose-200'
      } ${className}`}>
        {isEligible ? (
          <>
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Eligible ({remainingHoursText(remainingMonthlyHours)})</span>
          </>
        ) : (
          <>
            <XCircle className="w-3.5 h-3.5" />
            <span>Eligibility Check Required</span>
          </>
        )}
      </div>
    );
  }

  function remainingHoursText(h: number) {
    return `${h}h remaining`;
  }

  return (
    <div className={`rounded-2xl p-4 card-subtle border ${
      isEligible ? 'border-sage-300/80 bg-white' : 'border-rose-200/90 bg-rose-50/20'
    } ${className}`}>
      {/* Banner */}
      <div className="flex items-center justify-between pb-3 border-b border-ivory-200">
        <div className="flex items-center gap-2">
          {isEligible ? (
            <div className="w-7 h-7 rounded-full bg-sage-200 text-forest-700 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          ) : (
            <div className="w-7 h-7 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center">
              <AlertCircle className="w-4 h-4" />
            </div>
          )}
          <div>
            <h4 className="text-sm font-semibold text-charcoal-900">
              {isEligible ? 'Academic Safeguard: Eligible to Work' : 'Academic Safeguard: Action Needed'}
            </h4>
            <p className="text-xs text-mutedGray">
              {isEligible 
                ? 'All academic and work-hour parameters satisfy university policy.' 
                : 'One or more university guidelines currently restrict new applications.'}
            </p>
          </div>
        </div>

        <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${
          isEligible ? 'bg-sage-200 text-forest-700 border-sage-300' : 'bg-rose-100 text-rose-800 border-rose-200'
        }`}>
          {isEligible ? 'QUALIFIED' : 'REVIEW NEEDED'}
        </span>
      </div>

      {/* Grid of checks */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-3 text-xs">
        {/* CGPA */}
        <div className="flex items-center gap-2">
          {cgpaOk ? (
            <CheckCircle2 className="w-4 h-4 text-forest-500 shrink-0" />
          ) : (
            <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
          )}
          <div>
            <div className="text-mutedGray text-[11px]">Academic CGPA</div>
            <div className="font-semibold text-charcoal-900">
              {studentCgpa.toFixed(2)} / min {minimumCgpa.toFixed(1)}
            </div>
          </div>
        </div>

        {/* Monthly Hours */}
        <div className="flex items-center gap-2">
          {hoursOk ? (
            <CheckCircle2 className="w-4 h-4 text-forest-500 shrink-0" />
          ) : (
            <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
          )}
          <div>
            <div className="text-mutedGray text-[11px]">Work Allowance</div>
            <div className="font-semibold text-charcoal-900">
              {remainingMonthlyHours}h left (cap {hourLimit}h)
            </div>
          </div>
        </div>

        {/* Training */}
        <div className="flex items-center gap-2">
          {trainingOk ? (
            <CheckCircle2 className="w-4 h-4 text-forest-500 shrink-0" />
          ) : (
            <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
          )}
          <div>
            <div className="text-mutedGray text-[11px]">Policy Training</div>
            <div className="font-semibold text-charcoal-900">
              {trainingOk ? 'Completed' : 'Prereq Missing'}
            </div>
          </div>
        </div>

        {/* Tier */}
        <div className="flex items-center gap-2">
          {tierOk ? (
            <CheckCircle2 className="w-4 h-4 text-forest-500 shrink-0" />
          ) : (
            <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
          )}
          <div>
            <div className="text-mutedGray text-[11px]">Student Tier</div>
            <div className="font-semibold text-charcoal-900">
              {tierOk ? 'Sufficient' : 'Level Locked'}
            </div>
          </div>
        </div>
      </div>

      {/* Reasons breakdown if ineligible */}
      {!isEligible && reasons.length > 0 && (
        <div className="mt-2 pt-2 border-t border-rose-100 space-y-1.5 text-xs text-rose-800">
          {reasons.map((reason, idx) => (
            <div key={idx} className="flex items-start gap-1.5">
              <span className="font-bold">•</span>
              <span>{reason}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
