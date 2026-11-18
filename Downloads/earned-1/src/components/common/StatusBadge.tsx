import React from 'react';
import { 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  XCircle, 
  FileText, 
  Award, 
  Sparkles,
  ArrowUpRight 
} from 'lucide-react';
import { ApplicationStatus, OpportunityStatus, PaymentVerificationStatus, StudentTier } from '../../types';

interface StatusBadgeProps {
  status: ApplicationStatus | OpportunityStatus | PaymentVerificationStatus | StudentTier | string;
  type?: 'application' | 'opportunity' | 'payment' | 'tier' | 'compliance' | 'general';
  size?: 'sm' | 'md';
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  size = 'md',
  className = ''
}) => {
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs';

  let bgClass = 'bg-lavender-50 text-charcoal-800 border-lavender-200';
  let IconComponent = Clock;

  switch (status) {
    // Positive / Verified / Completed
    case 'Verified':
    case 'Completed':
    case 'Selected':
    case 'Published':
    case 'Compliant':
      bgClass = 'bg-sage-200 text-forest-700 border-sage-300 font-semibold';
      IconComponent = CheckCircle2;
      break;

    // In Progress / Active
    case 'In Progress':
    case 'Under Review':
    case 'Shortlisted':
    case 'Processing':
    case 'Approaching Limit':
      bgClass = 'bg-mutedYellow-100 text-charcoal-900 border-mutedYellow-200 font-medium';
      IconComponent = Clock;
      break;

    // Pending / Submitted
    case 'Applied':
    case 'Pending':
    case 'Submitted for Verification':
    case 'Pending Approval':
    case 'Review Required':
      bgClass = 'bg-peach-100 text-charcoal-900 border-peach-200 font-medium';
      IconComponent = FileText;
      break;

    // Rejected / Warning / Limit Reached
    case 'Rejected':
    case 'Withdrawn':
    case 'Closed':
    case 'Non-compliant':
    case 'Critical':
    case 'Limit Reached':
      bgClass = 'bg-rose-50 text-rose-700 border-rose-200 font-medium';
      IconComponent = XCircle;
      break;

    // Tiers
    case 'Bronze':
      bgClass = 'bg-[#F2ECE4] text-[#7A5835] border-[#DECBB8] font-semibold';
      IconComponent = Award;
      break;
    case 'Silver':
      bgClass = 'bg-slate-100 text-slate-700 border-slate-300 font-semibold';
      IconComponent = Award;
      break;
    case 'Gold':
      bgClass = 'bg-amber-100 text-amber-900 border-amber-300 font-semibold';
      IconComponent = Award;
      break;
    case 'Platinum':
      bgClass = 'bg-lavender-200 text-plum-900 border-lavender-300 font-semibold';
      IconComponent = Sparkles;
      break;

    default:
      bgClass = 'bg-ivory-200 text-charcoal-800 border-mutedGray-border';
      IconComponent = AlertCircle;
      break;
  }

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border ${sizeClasses} ${bgClass} transition-colors ${className}`}>
      <IconComponent className="w-3.5 h-3.5 shrink-0" />
      <span>{status}</span>
    </span>
  );
};
