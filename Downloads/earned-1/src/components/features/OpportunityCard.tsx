import React from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, ArrowRight, IndianRupee, Clock } from 'lucide-react';
import { Opportunity } from '../../types';
import { useApp } from '../../context/AppContext';

interface OpportunityCardProps {
  opportunity: Opportunity;
  onApplyClick?: (opp: Opportunity) => void;
  showApplyButton?: boolean;
}

export const OpportunityCard: React.FC<OpportunityCardProps> = ({
  opportunity,
}) => {
  const { currentStudent, checkStudentEligibility, currentRole } = useApp();
  const eligibility = currentRole === 'student' ? checkStudentEligibility(opportunity, currentStudent) : null;

  return (
    <div className="card-subtle rounded-3xl p-5 bg-white border border-lavender-200/90 hover:border-forest-400 hover:shadow-soft-lg transition-all duration-200 flex flex-col justify-between group">
      <div>
        {/* Top bar with company & arrangement */}
        <div className="flex items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <img
              src={opportunity.organizationLogo}
              alt={opportunity.organizationName}
              className="w-8 h-8 rounded-xl object-cover border border-lavender-200 shrink-0"
            />
            <span className="text-xs font-semibold text-charcoal-800 truncate">
              {opportunity.organizationName}
            </span>
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-forest-700 bg-sage-100 px-2.5 py-0.5 rounded-full shrink-0">
            {opportunity.workArrangement}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-base font-serif font-bold text-charcoal-900 group-hover:text-forest-700 transition-colors line-clamp-1 mb-1.5">
          {opportunity.title}
        </h3>

        {/* Category tag */}
        <div className="mb-3">
          <span className="text-[11px] font-medium text-mutedGray">
            {opportunity.category}
          </span>
        </div>

        {/* Compensation and hours pill */}
        <div className="flex items-center gap-2 text-xs font-semibold text-charcoal-900 bg-ivory-50 p-2.5 rounded-xl border border-ivory-200/80">
          <span className="flex items-center text-forest-700 font-bold">
            <IndianRupee className="w-3.5 h-3.5 mr-0.5" />
            {opportunity.compensation.toLocaleString('en-IN')}
          </span>
          <span className="text-mutedGray text-[11px]">·</span>
          <span className="flex items-center gap-1 text-[11px] text-mutedGray font-normal">
            <Clock className="w-3 h-3 text-mutedGray" />
            {opportunity.estimatedHours}h estimated
          </span>
        </div>

        {/* Show concise warning only when student is ineligible */}
        {eligibility && !eligibility.canApply && (
          <div className="mt-3 flex items-center gap-1.5 text-[11px] text-amber-800 bg-amber-50 px-2.5 py-1 rounded-xl border border-amber-200/70">
            <AlertCircle className="w-3.5 h-3.5 shrink-0 text-amber-600" />
            <span className="truncate">{eligibility.reasons[0] || 'Safeguard limit reached'}</span>
          </div>
        )}
      </div>

      <div className="pt-4 mt-2">
        <Link
          to={`/student/opportunities/${opportunity.id}`}
          className="w-full py-2.5 px-3 rounded-xl bg-ivory-100 hover:bg-forest-600 hover:text-white text-charcoal-900 text-xs font-semibold text-center transition-all flex items-center justify-center gap-1.5 group-hover:bg-forest-600 group-hover:text-white"
        >
          <span>View Opportunity</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};
