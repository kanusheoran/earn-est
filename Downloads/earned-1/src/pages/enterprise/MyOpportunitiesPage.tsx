import React from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, PlusCircle, Users, Clock, DollarSign, Calendar, ArrowRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../../components/common/StatusBadge';
import { EmptyState } from '../../components/common/EmptyState';

export const MyOpportunitiesPage: React.FC = () => {
  const { opportunities, currentOrganization, applications } = useApp();

  const myOpps = opportunities.filter(
    (o) => o.organizationId === currentOrganization.id || o.organizationName === currentOrganization.name
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-lavender-200/80">
        <div>
          <div className="flex items-center gap-2">
            <Briefcase className="w-6 h-6 text-plum-600" />
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-charcoal-900">
              My Posted Opportunities
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-mutedGray mt-1">
            Manage your organization's work-study projects, review applicant submissions, and check moderation status.
          </p>
        </div>

        <Link
          to="/enterprise/post-opportunity"
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-plum-500 hover:bg-plum-600 text-white font-semibold text-xs shadow-xs transition-colors shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Post New Opportunity</span>
        </Link>
      </div>

      {/* Opportunities List */}
      {myOpps.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {myOpps.map((opp) => {
            const oppApplicants = applications.filter((a) => a.opportunityId === opp.id);
            return (
              <div
                key={opp.id}
                className="card-subtle rounded-3xl p-6 bg-white border border-lavender-200/90 flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-plum-700">
                      {opp.category} · {opp.workArrangement}
                    </span>
                    <StatusBadge status={opp.status} size="sm" />
                  </div>

                  <h3 className="text-lg font-serif font-bold text-charcoal-900 line-clamp-2">
                    {opp.title}
                  </h3>

                  <p className="text-xs text-mutedGray line-clamp-2 mt-1.5 leading-relaxed">
                    {opp.description}
                  </p>

                  <div className="grid grid-cols-3 gap-2 py-3 px-3 rounded-2xl bg-ivory-50 border border-ivory-200 mt-4 text-xs">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-mutedGray">Stipend</span>
                      <div className="font-serif font-bold text-forest-700 mt-0.5">${opp.compensation}</div>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-mutedGray">Work Estimate</span>
                      <div className="font-bold text-charcoal-900 mt-0.5">{opp.estimatedHours} hrs</div>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-mutedGray">Deadline</span>
                      <div className="font-medium text-charcoal-900 mt-0.5">{opp.deadline.replace('2026-', '')}</div>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-ivory-200 flex items-center justify-between text-xs">
                  <span className="text-mutedGray font-semibold flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-plum-500" />
                    <span>{oppApplicants.length} Candidates Applied</span>
                  </span>

                  <Link
                    to="/enterprise/applicants"
                    className="px-3.5 py-1.5 rounded-xl bg-ivory-100 hover:bg-lavender-100 text-charcoal-900 font-semibold transition-colors flex items-center gap-1"
                  >
                    <span>View Applicants</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <EmptyState
          title="No opportunities posted yet"
          description="Create your first student freelance posting to connect with vetted university talent."
          actionText="Create an Opportunity"
          onAction={() => window.location.href = '/enterprise/post-opportunity'}
        />
      )}

    </div>
  );
};
