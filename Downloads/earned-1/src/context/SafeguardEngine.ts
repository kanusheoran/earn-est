import { StudentProfile, Opportunity, ProgrammeSettings } from '../types';

export interface EligibilityResult {
  isEligible: boolean;
  canApply: boolean;
  cgpaOk: boolean;
  hoursOk: boolean;
  trainingOk: boolean;
  tierOk: boolean;
  reasons: string[];
  currentMonthlyHours: number;
  remainingMonthlyHours: number;
  estimatedAdditionalHours: number;
  projectedHours: number;
  hourLimit: number;
  hourUsagePercent: number;
  hourStatus: 'normal' | 'approaching' | 'near-limit' | 'limit-reached';
}

const TIER_ORDER: Record<string, number> = {
  'Bronze': 1,
  'Silver': 2,
  'Gold': 3,
  'Platinum': 4,
};

export function getHourStatus(
  hoursUsed: number,
  hourLimit: number,
  warningPercent: number = 75,
  criticalPercent: number = 90
): 'normal' | 'approaching' | 'near-limit' | 'limit-reached' {
  if (hoursUsed >= hourLimit) {
    return 'limit-reached';
  }
  const pct = (hoursUsed / hourLimit) * 100;
  if (pct >= criticalPercent) {
    return 'near-limit';
  }
  if (pct >= warningPercent) {
    return 'approaching';
  }
  return 'normal';
}

export function evaluateStudentEligibility(
  student: StudentProfile,
  opportunity?: Opportunity,
  settings?: ProgrammeSettings
): EligibilityResult {
  const minCgpa = Math.max(
    settings?.minimumCgpa ?? 7.0,
    opportunity?.minimumCgpa ?? 7.0
  );
  const hourLimit = settings?.monthlyHourCap ?? student.monthlyHourLimit ?? 20;
  const currentHours = student.monthlyHoursWorked;
  const remainingHours = Math.max(0, hourLimit - currentHours);
  const estimatedHours = opportunity?.estimatedHours ?? 0;
  const projectedHours = currentHours + estimatedHours;
  const usagePercent = Math.round((currentHours / hourLimit) * 100);

  const reasons: string[] = [];
  let cgpaOk = true;
  let hoursOk = true;
  let trainingOk = true;
  let tierOk = true;

  // 1. CGPA check
  if (student.cgpa < minCgpa) {
    cgpaOk = false;
    reasons.push(
      `Your current CGPA of ${student.cgpa.toFixed(1)} is below the minimum required standard (${minCgpa.toFixed(1)} / 10.0). Academic recovery is prioritized.`
    );
  }

  // 2. Hour cap check
  if (currentHours >= hourLimit) {
    hoursOk = false;
    reasons.push(
      `You have reached your monthly academic work cap of ${hourLimit} hours (${currentHours}/${hourLimit}h). No additional hours can be taken this month.`
    );
  } else if (opportunity && projectedHours > hourLimit) {
    hoursOk = false;
    reasons.push(
      `You have ${remainingHours}h remaining this month. This project requires ~${estimatedHours}h, which would exceed your ${hourLimit}h monthly academic safeguard cap.`
    );
  }

  // 3. Training requirement check
  if (opportunity?.requiredTrainingId) {
    const hasCompleted = student.completedTrainingIds.includes(opportunity.requiredTrainingId);
    if (!hasCompleted) {
      trainingOk = false;
      reasons.push(`Requires completion of prerequisite university training module before applying.`);
    }
  }

  // 4. Tier requirement check
  if (opportunity?.requiredTier) {
    const studentTierLevel = TIER_ORDER[student.tier] || 1;
    const requiredTierLevel = TIER_ORDER[opportunity.requiredTier] || 1;
    if (studentTierLevel < requiredTierLevel) {
      tierOk = false;
      reasons.push(
        `Requires ${opportunity.requiredTier} tier or higher (Your current tier is ${student.tier}). Complete additional verified projects to unlock.`
      );
    }
  }

  const isEligible = cgpaOk && hoursOk && trainingOk && tierOk;
  const hourStatus = getHourStatus(
    currentHours,
    hourLimit,
    settings?.warningHourThresholdPercent ?? 75,
    settings?.criticalHourThresholdPercent ?? 90
  );

  return {
    isEligible,
    canApply: isEligible,
    cgpaOk,
    hoursOk,
    trainingOk,
    tierOk,
    reasons,
    currentMonthlyHours: currentHours,
    remainingMonthlyHours: remainingHours,
    estimatedAdditionalHours: estimatedHours,
    projectedHours,
    hourLimit,
    hourUsagePercent: usagePercent,
    hourStatus,
  };
}
