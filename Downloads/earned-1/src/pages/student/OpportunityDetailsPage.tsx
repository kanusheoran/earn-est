import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Clock, 
  IndianRupee, 
  Calendar, 
  Building2, 
  CheckCircle2, 
  AlertTriangle, 
  Briefcase, 
  GraduationCap, 
  Award, 
  Send,
  ShieldCheck,
  Globe,
  Share2
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ApplicationModal } from '../../components/features/ApplicationModal';
import { EligibilityIndicator } from '../../components/common/EligibilityIndicator';
import { HourUsageProgress } from '../../components/common/HourUsageProgress';
import { StatusBadge } from '../../components/common/StatusBadge';

export const OpportunityDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { opportunities, organizations, currentStudent, checkStudentEligibility, applications } = useApp();

  const [applyModalOpen, setApplyModalOpen] = useState(false);

  const opportunity = opportunities.find((o) => o.id === id);
  if (!opportunity) {
    return (
      <div className="py-20 text-center space-y-4">
        <h2 className="text-2xl font-serif font-bold text-charcoal-900">Opportunity Not Found</h2>
        <p className="text-xs text-mutedGray">The requested project might have been closed or removed.</p>
        <Link
          to="/student/opportunities"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-plum-500 text-white text-xs font-semibold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Opportunities</span>
        </Link>
      </div>
    );
  }

  const organization = organizations.find((org) => org.id === opportunity.organizationId);
  const eligibility = checkStudentEligibility(opportunity, currentStudent);
  const existingApp = applications.find(
    (a) => a.opportunityId === opportunity.id && a.studentId === currentStudent.id
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-300 max-w-5xl mx-auto">
      
      {/* Back button & Meta Top */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-mutedGray hover:text-charcoal-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Opportunities</span>
        </button>

        <div className="flex items-center gap-2">
          <StatusBadge status={opportunity.status} size="sm" />
          <span className="text-xs text-mutedGray">Posted {opportunity.createdAt}</span>
        </div>
      </div>

      {/* Main Header Card */}
      <div className="card-subtle rounded-3xl p-6 sm:p-8 bg-white border border-lavender-200/90 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 pb-6 border-b border-ivory-200">
          
          <div className="flex items-start gap-4">
            <img
              src={opportunity.organizationLogo}
              alt={opportunity.organizationName}
              className="w-16 h-16 rounded-2xl object-cover border border-lavender-200 shadow-xs shrink-0"
            />
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-plum-700 uppercase tracking-wide">
                  {opportunity.category}
                </span>
                <span className="text-mutedGray text-xs">·</span>
                <span className="text-xs text-mutedGray">{opportunity.workArrangement}</span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-serif font-bold text-charcoal-900 leading-tight">
                {opportunity.title}
              </h1>

              <div className="flex items-center gap-3 text-xs text-mutedGray pt-1">
                <span className="font-semibold text-charcoal-800 flex items-center gap-1">
                  <Building2 className="w-3.5 h-3.5 text-plum-500" />
                  <span>{opportunity.organizationName}</span>
                </span>
                {organization?.website && (
                  <a
                    href={organization.website}
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-plum-600 flex items-center gap-1"
                  >
                    <Globe className="w-3 h-3" />
                    <span>Website</span>
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Quick Compensation Pill */}
          <div className="sm:text-right shrink-0 bg-ivory-50 p-4 rounded-2xl border border-ivory-200/90">
            <span className="text-[10px] font-bold uppercase tracking-wider text-mutedGray block">
              Verified Compensation
            </span>
            <div className="text-2xl sm:text-3xl font-bold font-serif text-forest-700 mt-0.5">
              ₹{opportunity.compensation.toLocaleString('en-IN')}
            </div>
            <span className="text-[11px] text-mutedGray">
              {opportunity.compensationType} · ~{opportunity.estimatedHours} hrs estimated
            </span>
          </div>

        </div>

        {/* Metrics Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div className="p-3 rounded-2xl bg-ivory-50 border border-ivory-200">
            <span className="text-mutedGray text-[10px] uppercase font-bold">Estimated Hours</span>
            <div className="font-bold text-charcoal-900 text-sm mt-0.5 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-plum-600" />
              <span>{opportunity.estimatedHours} hours</span>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-ivory-50 border border-ivory-200">
            <span className="text-mutedGray text-[10px] uppercase font-bold">Application Deadline</span>
            <div className="font-bold text-charcoal-900 text-sm mt-0.5 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-plum-600" />
              <span>{opportunity.deadline}</span>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-ivory-50 border border-ivory-200">
            <span className="text-mutedGray text-[10px] uppercase font-bold">Min Academic CGPA</span>
            <div className="font-bold text-charcoal-900 text-sm mt-0.5 flex items-center gap-1">
              <GraduationCap className="w-3.5 h-3.5 text-plum-600" />
              <span>{opportunity.minimumCgpa.toFixed(1)} CGPA</span>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-ivory-50 border border-ivory-200">
            <span className="text-mutedGray text-[10px] uppercase font-bold">Student Positions</span>
            <div className="font-bold text-charcoal-900 text-sm mt-0.5 flex items-center gap-1">
              <Award className="w-3.5 h-3.5 text-plum-600" />
              <span>{opportunity.studentsRequired} required</span>
            </div>
          </div>
        </div>

      </div>

      {/* Two Column Layout: Description & Safeguard Verification */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left: Detailed Opportunity Breakdown */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Overview */}
          <div className="card-subtle rounded-3xl p-6 bg-white border border-lavender-200/90 space-y-3">
            <h3 className="font-serif font-bold text-lg text-charcoal-900">
              Project Overview
            </h3>
            <p className="text-xs text-charcoal-800 leading-relaxed font-sans whitespace-pre-line">
              {opportunity.description}
            </p>
          </div>

          {/* Key Deliverables */}
          <div className="card-subtle rounded-3xl p-6 bg-white border border-lavender-200/90 space-y-3">
            <h3 className="font-serif font-bold text-lg text-charcoal-900">
              Key Deliverables
            </h3>
            <ul className="space-y-2 text-xs text-charcoal-800">
              {opportunity.deliverables.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-sage-200 text-forest-700 flex items-center justify-center shrink-0 font-bold text-[11px] mt-0.5">
                    ✓
                  </span>
                  <span className="leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Responsibilities */}
          <div className="card-subtle rounded-3xl p-6 bg-white border border-lavender-200/90 space-y-3">
            <h3 className="font-serif font-bold text-lg text-charcoal-900">
              Responsibilities & Expectations
            </h3>
            <ul className="space-y-2 text-xs text-charcoal-800">
              {opportunity.responsibilities.map((resp, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-plum-500 font-bold">•</span>
                  <span className="leading-relaxed">{resp}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Required Skills */}
          <div className="card-subtle rounded-3xl p-6 bg-white border border-lavender-200/90 space-y-3">
            <h3 className="font-serif font-bold text-lg text-charcoal-900">
              Required Skills & Competencies
            </h3>
            <div className="flex flex-wrap gap-2">
              {opportunity.requiredSkills.map((skill) => (
                <span
                  key={skill}
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-lavender-100 text-plum-900 border border-lavender-200"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

        </div>

        {/* Right: Academic Safeguard & Application Card */}
        <div className="lg:col-span-5 space-y-6 sticky top-6">
          
          {/* Safeguard Pre-Flight Card */}
          <div className="card-subtle rounded-3xl p-6 bg-white border border-lavender-200/90 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-ivory-200">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-forest-600" />
                <h3 className="font-serif font-bold text-base text-charcoal-900">
                  Safeguard Compatibility
                </h3>
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                eligibility.canApply 
                  ? 'bg-sage-200 text-forest-700 border-sage-300' 
                  : 'bg-rose-100 text-rose-800 border-rose-200'
              }`}>
                {eligibility.canApply ? 'ELIGIBLE' : 'INELIGIBLE'}
              </span>
            </div>

            {/* Hour calculation */}
            <HourUsageProgress
              hoursUsed={currentStudent.monthlyHoursWorked}
              hourLimit={currentStudent.monthlyHourLimit || 20}
              estimatedAdditionalHours={opportunity.estimatedHours}
              showDetails={true}
            />

            {/* Eligibility summary */}
            <EligibilityIndicator
              eligibility={eligibility}
              studentCgpa={currentStudent.cgpa}
              minimumCgpa={opportunity.minimumCgpa}
            />

            {/* Application CTA */}
            {existingApp ? (
              <div className="p-4 rounded-2xl bg-lavender-50 border border-lavender-200 text-center space-y-2">
                <p className="text-xs font-semibold text-plum-900">
                  You applied for this project on {existingApp.appliedDate}.
                </p>
                <div className="flex items-center justify-center gap-1.5">
                  <span className="text-xs text-mutedGray">Current status:</span>
                  <StatusBadge status={existingApp.status} size="sm" />
                </div>
                <Link
                  to="/student/applications"
                  className="text-xs font-bold text-plum-600 hover:underline block pt-1"
                >
                  View in My Applications →
                </Link>
              </div>
            ) : (
              <div className="space-y-2 pt-2">
                <button
                  onClick={() => setApplyModalOpen(true)}
                  disabled={!eligibility.canApply}
                  className={`w-full py-3.5 rounded-2xl font-semibold text-xs transition-all flex items-center justify-center gap-2 shadow-sm ${
                    eligibility.canApply
                      ? 'bg-plum-500 hover:bg-plum-600 text-white'
                      : 'bg-ivory-200 text-mutedGray cursor-not-allowed border border-mutedGray-border/40'
                  }`}
                >
                  <Send className="w-4 h-4" />
                  <span>{eligibility.canApply ? 'Apply for this Opportunity' : 'Application Restricted by Safeguards'}</span>
                </button>

                {!eligibility.canApply && (
                  <p className="text-[11px] text-mutedGray text-center leading-relaxed">
                    University rules prevent submitting an application when academic parameters are not met.
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Enterprise Partner Card */}
          {organization && (
            <div className="card-subtle rounded-3xl p-6 bg-white border border-lavender-200/90 space-y-3 text-xs">
              <span className="text-[10px] uppercase font-bold text-mutedGray">About the Organization</span>
              <div className="flex items-center gap-3 pt-1">
                <img
                  src={organization.logo}
                  alt={organization.name}
                  className="w-10 h-10 rounded-xl object-cover border border-lavender-200"
                />
                <div>
                  <h4 className="font-semibold text-charcoal-900">{organization.name}</h4>
                  <p className="text-[11px] text-mutedGray">{organization.industry}</p>
                </div>
              </div>
              <p className="text-mutedGray leading-relaxed pt-1">
                {organization.description}
              </p>
            </div>
          )}

        </div>

      </div>

      {/* Application Modal */}
      <ApplicationModal
        isOpen={applyModalOpen}
        onClose={() => setApplyModalOpen(false)}
        opportunity={opportunity}
      />
    </div>
  );
};
