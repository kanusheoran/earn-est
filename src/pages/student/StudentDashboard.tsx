import React from 'react';
import { Link } from 'react-router-dom';
import { 
  IndianRupee, 
  Clock, 
  Briefcase, 
  FileText, 
  CheckCircle2, 
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Award
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { StatCard } from '../../components/common/StatCard';
import { OpportunityCard } from '../../components/features/OpportunityCard';

export const StudentDashboard: React.FC = () => {
  const { 
    currentStudent, 
    opportunities, 
    applications, 
    projects, 
    notifications,
    checkStudentEligibility,
    programmeSettings 
  } = useApp();

  const myApplications = applications.filter(a => a.studentId === currentStudent.id);
  const myProjects = projects.filter(p => p.studentId === currentStudent.id);
  const eligibility = checkStudentEligibility(undefined, currentStudent);

  const activeProjectsCount = myProjects.filter(p => p.status === 'In Progress').length;
  const pendingAppsCount = myApplications.filter(a => a.status === 'Applied' || a.status === 'Under Review' || a.status === 'Shortlisted').length;

  const hourCap = programmeSettings.monthlyHourCap || 20;
  const hourPercentage = Math.min(100, Math.round((currentStudent.monthlyHoursWorked / hourCap) * 100));

  // Max 3 recommended opportunities
  const appliedOppIds = new Set(myApplications.map(a => a.opportunityId));
  const recommendedOpps = opportunities
    .filter(o => o.status === 'Published' && !appliedOppIds.has(o.id))
    .slice(0, 3);

  // Recent activity: max 3 items
  const recentActivities = [
    ...notifications.map(n => ({
      id: n.id,
      title: n.title,
      time: n.timestamp,
      link: n.linkUrl || '/student/applications'
    })),
    ...myApplications.slice(0, 2).map(a => ({
      id: `app-${a.id}`,
      title: `Applied to ${a.opportunityTitle}`,
      time: a.appliedDate,
      link: '/student/applications'
    }))
  ].slice(0, 3);

  return (
    <div className="space-y-7 max-w-6xl mx-auto animate-in fade-in duration-200">
      
      {/* 1. Header with greeting and warm tone */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-lavender-200/80">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-charcoal-900">
              Good afternoon, {currentStudent.name.split(' ')[0]}
            </h1>
            <span className="font-handwriting text-xl text-forest-600 hidden sm:inline">
              Welcome back ✦
            </span>
          </div>
          <p className="text-xs sm:text-sm text-mutedGray mt-0.5">
            Here's where your academic safeguards and earnings stand this month.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-sage-200 text-forest-700 font-bold text-xs border border-sage-300 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-forest-600" />
            <span>Safeguards Active</span>
          </span>
        </div>
      </div>

      {/* 2. Four Summary Cards Maximum */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Earnings"
          value={`₹${currentStudent.totalEarnings.toLocaleString('en-IN')}`}
          subtitle={`₹${currentStudent.verifiedEarnings.toLocaleString('en-IN')} verified`}
          icon={IndianRupee}
          iconBgColor="bg-sage-200"
          iconColor="text-forest-700"
        />

        <StatCard
          title="Hours Used"
          value={`${currentStudent.monthlyHoursWorked} / ${hourCap}h`}
          subtitle={`${Math.max(0, hourCap - currentStudent.monthlyHoursWorked)}h remaining`}
          icon={Clock}
          iconBgColor="bg-peach-100"
          iconColor="text-terracotta-600"
        />

        <StatCard
          title="Active Projects"
          value={activeProjectsCount}
          subtitle="Currently underway"
          icon={Briefcase}
          iconBgColor="bg-lavender-100"
          iconColor="text-plum-700"
        />

        <StatCard
          title="Pending Applications"
          value={pendingAppsCount}
          subtitle="Under review"
          icon={FileText}
          iconBgColor="bg-ivory-200"
          iconColor="text-charcoal-800"
        />
      </div>

      {/* 3. Academic Status — One Compact Section */}
      <div className="card-subtle rounded-3xl p-5 sm:p-6 bg-white border border-lavender-200/90 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-forest-600" />
            <div>
              <h3 className="text-sm font-serif font-bold text-charcoal-900">Academic Standing & Safeguards</h3>
              <p className="text-[11px] text-mutedGray">Enforced automatically to safeguard study priority</p>
            </div>
          </div>
          <span className={`text-xs font-semibold px-3 py-1 rounded-full border flex items-center gap-1 ${
            eligibility.isEligible
              ? 'bg-sage-200 text-forest-700 border-sage-300'
              : 'bg-rose-50 text-rose-700 border-rose-200'
          }`}>
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{eligibility.isEligible ? 'Eligible to Work' : 'Action Required'}</span>
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1 text-xs">
          <div className="p-3.5 rounded-2xl bg-ivory-50 border border-ivory-200">
            <div className="flex justify-between items-center">
              <span className="text-mutedGray">Cumulative GPA:</span>
              <span className="font-bold text-charcoal-900 text-sm">
                {currentStudent.cgpa.toFixed(1)} / 10.0
              </span>
            </div>
            <p className="text-[11px] text-forest-700 mt-1">
              ✓ Exceeds {programmeSettings.minimumCgpa.toFixed(1)} minimum academic threshold
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-ivory-50 border border-ivory-200">
            <div className="flex justify-between items-center">
              <span className="text-mutedGray">Monthly Hours Logged:</span>
              <span className="font-bold text-forest-700 text-sm">
                {currentStudent.monthlyHoursWorked} / {hourCap} hrs ({hourPercentage}%)
              </span>
            </div>
            {/* Progress Bar */}
            <div className="w-full bg-ivory-200 h-2 rounded-full overflow-hidden mt-2">
              <div
                className={`h-full rounded-full transition-all ${
                  hourPercentage >= 100 
                    ? 'bg-rose-500' 
                    : hourPercentage >= 75 
                    ? 'bg-peach-300' 
                    : 'bg-forest-600'
                }`}
                style={{ width: `${hourPercentage}%` }}
              />
            </div>
          </div>
        </div>

        {/* Short warning only when necessary */}
        {!eligibility.isEligible && (
          <div className="flex items-center gap-1.5 text-xs text-rose-700 bg-rose-50 p-2.5 rounded-xl border border-rose-200">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{eligibility.reasons[0]}</span>
          </div>
        )}
      </div>

      {/* 4. Recommended Opportunities (Max 3) */}
      <div className="space-y-3.5 pt-2">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-serif font-bold text-charcoal-900">
              Recommended Opportunities
            </h2>
            <p className="text-xs text-mutedGray">Handpicked based on your verified skills & available study hours</p>
          </div>
          <Link
            to="/student/opportunities"
            className="text-xs font-semibold text-forest-700 hover:text-forest-800 flex items-center gap-1"
          >
            <span>View all opportunities</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {recommendedOpps.map((opp) => (
            <OpportunityCard key={opp.id} opportunity={opp} />
          ))}
        </div>
      </div>

      {/* 5. Recent Activity (Max 3 Items) */}
      <div className="space-y-3 pt-2">
        <h2 className="text-lg font-serif font-bold text-charcoal-900">
          Recent Activity
        </h2>

        <div className="card-subtle rounded-3xl bg-white border border-lavender-200/90 divide-y divide-ivory-200 shadow-xs">
          {recentActivities.map((act) => (
            <div
              key={act.id}
              className="p-4 flex items-center justify-between text-xs hover:bg-ivory-50/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-full bg-sage-100 text-forest-700 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-4 h-4 text-forest-600" />
                </div>
                <span className="font-semibold text-charcoal-900">{act.title}</span>
              </div>
              <span className="text-[11px] text-mutedGray shrink-0">{act.time}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
