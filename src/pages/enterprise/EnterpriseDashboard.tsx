import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Briefcase, 
  Users, 
  FolderKanban, 
  PlusCircle, 
  ArrowRight,
  Clock
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { StatCard } from '../../components/common/StatCard';
import { StatusBadge } from '../../components/common/StatusBadge';

export const EnterpriseDashboard: React.FC = () => {
  const { currentOrganization, opportunities, applications, projects } = useApp();

  const myOpps = opportunities.filter(o => o.organizationId === currentOrganization.id || o.organizationName === currentOrganization.name);
  const myOppIds = new Set(myOpps.map(o => o.id));
  const myApplicants = applications.filter(a => myOppIds.has(a.opportunityId) || a.organizationName === currentOrganization.name);
  const myProjects = projects.filter(p => p.organizationId === currentOrganization.id || p.organizationName === currentOrganization.name);

  const activeOpps = myOpps.filter(o => o.status === 'Published');
  const newApplicants = myApplicants.filter(a => a.status === 'Applied' || a.status === 'Under Review');
  const activeProjects = myProjects.filter(p => p.status === 'In Progress');

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-lavender-200/80">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-charcoal-900">
            {currentOrganization.name}
          </h1>
          <p className="text-sm text-mutedGray mt-0.5">
            Enterprise Talent Portal · {currentOrganization.industry}
          </p>
        </div>

        <Link
          to="/enterprise/post-opportunity"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-plum-500 hover:bg-plum-600 text-white font-semibold text-xs shadow-xs transition-colors shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Post an Opportunity</span>
        </Link>
      </div>

      {/* 3 Summary Cards Maximum */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Active Opportunities"
          value={activeOpps.length}
          icon={Briefcase}
          iconBgColor="bg-peach-100"
          iconColor="text-charcoal-900"
        />

        <StatCard
          title="New Applicants"
          value={newApplicants.length}
          icon={Users}
          iconBgColor="bg-lavender-100"
          iconColor="text-plum-700"
        />

        <StatCard
          title="Active Projects"
          value={activeProjects.length}
          icon={FolderKanban}
          iconBgColor="bg-sage-200"
          iconColor="text-forest-700"
        />
      </div>

      {/* Two Column Layout: Recent Applicants & Active Projects */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Recent Applicants */}
        <div className="lg:col-span-7 rounded-2xl p-5 bg-white border border-lavender-200/90 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-ivory-200">
            <div>
              <h3 className="font-serif font-bold text-base text-charcoal-900">
                Recent Applicants
              </h3>
              <p className="text-xs text-mutedGray">Candidates awaiting review</p>
            </div>
            <Link to="/enterprise/applicants" className="text-xs font-medium text-plum-600 hover:underline">
              View all ({myApplicants.length}) →
            </Link>
          </div>

          {myApplicants.length > 0 ? (
            <div className="space-y-3">
              {myApplicants.slice(0, 3).map((app) => (
                <div
                  key={app.id}
                  className="p-3.5 rounded-xl bg-ivory-50/70 border border-ivory-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-charcoal-900">{app.studentName}</span>
                      <StatusBadge status={app.status} size="sm" />
                    </div>
                    <p className="text-[11px] text-mutedGray mt-0.5">
                      Applied for <span className="font-semibold text-charcoal-800">{app.opportunityTitle}</span>
                    </p>
                  </div>

                  <Link
                    to="/enterprise/applicants"
                    className="inline-flex items-center gap-1 text-xs font-semibold text-plum-600 hover:text-plum-700 shrink-0"
                  >
                    <span>Review</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-mutedGray py-6 text-center">No applicants yet for your postings.</p>
          )}
        </div>

        {/* Right: Active Projects Progress */}
        <div className="lg:col-span-5 rounded-2xl p-5 bg-white border border-lavender-200/90 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-ivory-200">
            <div>
              <h3 className="font-serif font-bold text-base text-charcoal-900">
                Active Projects
              </h3>
              <p className="text-xs text-mutedGray">Milestone tracking</p>
            </div>
            <Link to="/enterprise/projects" className="text-xs font-medium text-plum-600 hover:underline">
              View all →
            </Link>
          </div>

          {activeProjects.length > 0 ? (
            <div className="space-y-3">
              {activeProjects.slice(0, 3).map((p) => (
                <div
                  key={p.id}
                  className="p-3.5 rounded-xl bg-ivory-50/70 border border-ivory-200 space-y-2"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-xs text-charcoal-900">{p.title}</h4>
                      <p className="text-[11px] text-mutedGray">{p.studentName}</p>
                    </div>
                    <span className="text-xs font-bold text-charcoal-900">{p.completionPercentage}%</span>
                  </div>

                  <div className="w-full bg-white h-1.5 rounded-full overflow-hidden border border-lavender-200">
                    <div
                      className="bg-plum-500 h-full rounded-full transition-all"
                      style={{ width: `${p.completionPercentage}%` }}
                    />
                  </div>

                  <div className="flex justify-between items-center text-[10px] text-mutedGray pt-0.5">
                    <span>Due {p.deadline}</span>
                    <span className="font-semibold text-forest-700">₹{p.paymentAmount.toLocaleString('en-IN')} Stipend</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-mutedGray py-6 text-center">No active projects currently underway.</p>
          )}
        </div>

      </div>

    </div>
  );
};
