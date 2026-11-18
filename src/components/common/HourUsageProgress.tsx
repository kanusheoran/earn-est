import React from 'react';
import { AlertTriangle, CheckCircle, Info, ShieldAlert } from 'lucide-react';
import { getHourStatus } from '../../context/SafeguardEngine';

interface HourUsageProgressProps {
  hoursUsed: number;
  hourLimit: number;
  estimatedAdditionalHours?: number;
  showDetails?: boolean;
  className?: string;
}

export const HourUsageProgress: React.FC<HourUsageProgressProps> = ({
  hoursUsed,
  hourLimit = 20,
  estimatedAdditionalHours = 0,
  showDetails = true,
  className = '',
}) => {
  const percentage = Math.min(100, Math.round((hoursUsed / hourLimit) * 100));
  const remainingHours = Math.max(0, hourLimit - hoursUsed);
  const status = getHourStatus(hoursUsed, hourLimit);

  // Projected if additional hours are specified
  const projectedTotal = hoursUsed + estimatedAdditionalHours;
  const isOverLimitWithProjected = estimatedAdditionalHours > 0 && projectedTotal > hourLimit;

  let barColor = 'bg-forest-500';
  let badgeText = 'Normal — Academically Balanced';
  let badgeBg = 'bg-sage-200 text-forest-700 border-sage-300';
  let StatusIcon = CheckCircle;
  let explanation = `You have used ${hoursUsed} of your ${hourLimit}h permitted monthly work allowance (${remainingHours}h remaining).`;

  if (status === 'approaching') {
    barColor = 'bg-mutedYellow-300';
    badgeText = 'Approaching Limit (75–89%)';
    badgeBg = 'bg-amber-100 text-amber-900 border-amber-300';
    StatusIcon = Info;
    explanation = `You have logged ${hoursUsed}h this month. You have ${remainingHours}h remaining before reaching the university safeguard cap.`;
  } else if (status === 'near-limit') {
    barColor = 'bg-peach-300';
    badgeText = 'Near Limit (90–99%)';
    badgeBg = 'bg-peach-100 text-charcoal-900 border-peach-200';
    StatusIcon = AlertTriangle;
    explanation = `Attention: Only ${remainingHours}h remaining this month. Plan your deliverables carefully to preserve study commitments.`;
  } else if (status === 'limit-reached') {
    barColor = 'bg-rose-500';
    badgeText = 'Monthly Cap Reached (100%)';
    badgeBg = 'bg-rose-100 text-rose-800 border-rose-300';
    StatusIcon = ShieldAlert;
    explanation = `You have reached the maximum allowed ${hourLimit} hours for this calendar month. New applications and additional hours are paused until next month.`;
  }

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Header with values and status badge */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-mutedGray">Monthly Work-Hour Cap</span>
          <div className="flex items-baseline gap-1.5 mt-0.5">
            <span className="text-2xl font-bold font-serif text-charcoal-900">{hoursUsed}</span>
            <span className="text-sm font-medium text-mutedGray">/ {hourLimit} hrs</span>
            <span className="text-xs text-mutedGray ml-1">({percentage}%)</span>
          </div>
        </div>

        <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${badgeBg}`}>
          <StatusIcon className="w-3.5 h-3.5 shrink-0" />
          <span>{badgeText}</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="relative w-full h-3 bg-ivory-200 rounded-full overflow-hidden p-0.5 border border-mutedGray-border/40">
        <div
          className={`h-full rounded-full transition-all duration-500 ease-out ${barColor}`}
          style={{ width: `${Math.min(100, percentage)}%` }}
        />
        {/* Additional projected hours preview */}
        {estimatedAdditionalHours > 0 && !isOverLimitWithProjected && (
          <div
            className="absolute top-0.5 bottom-0.5 rounded-full bg-peach-300/80 animate-pulse"
            style={{
              left: `${percentage}%`,
              width: `${Math.min(100 - percentage, (estimatedAdditionalHours / hourLimit) * 100)}%`,
            }}
          />
        )}
      </div>

      {/* Warning if projected exceeds cap */}
      {isOverLimitWithProjected && (
        <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-start gap-2">
          <ShieldAlert className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
          <div>
            <span className="font-semibold">Exceeds Monthly Safeguard: </span>
            This project adds ~{estimatedAdditionalHours}h to your current {hoursUsed}h, totaling {projectedTotal}h (cap is {hourLimit}h).
          </div>
        </div>
      )}

      {showDetails && (
        <p className="text-xs text-mutedGray leading-relaxed">
          {explanation}
        </p>
      )}
    </div>
  );
};
