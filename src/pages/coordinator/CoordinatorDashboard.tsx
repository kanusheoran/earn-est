import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, 
  Briefcase, 
  IndianRupee, 
  Clock, 
  AlertTriangle,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { useApp } from '../../context/AppContext';
import { StatCard } from '../../components/common/StatCard';
import { StatusBadge } from '../../components/common/StatusBadge';

export const CoordinatorDashboard: React.FC = () => {
  const { 
    allStudents, 
    projects, 
    earnings, 
    complianceAlerts 
  } = useApp();

  // 1. Four Key Metrics
  const activeStudents = allStudents.filter(s => s.monthlyHoursWorked > 0 || s.activeProjectsCount > 0).length;
  const activeProjects = projects.filter(p => p.status === 'In Progress').length;
  const verifiedEarnings = earnings
    .filter(e => e.verificationStatus === 'Verified')
    .reduce((sum, e) => sum + e.amount, 0);
  const pendingVerifications = earnings.filter(e => e.verificationStatus === 'Submitted for Verification').length;

  // Simple monthly earnings trend data
  const monthlyData = [
    { month: 'Aug', amount: 48000 },
    { month: 'Sep', amount: 96000 },
    { month: 'Oct', amount: 144000 },
    { month: 'Nov', amount: verifiedEarnings > 0 ? verifiedEarnings : 168000 },
  ];

  // Up to 3 urgent issues for "Needs Attention"
  const needsAttention = complianceAlerts.slice(0, 3);

  // Recent activity: 3 items
  const recentActivities = earnings.slice(0, 3);

  return (
    <div className="space-y-6 max-w-6xl mx-auto animate-in fade-in duration-200">
      
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-lavender-200/80">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-charcoal-900">
              Coordinator Programme Desk
            </h1>
            <span className="font-handwriting text-xl text-forest-600 hidden sm:inline">
              Safeguards Active ✦
            </span>
          </div>
          <p className="text-xs sm:text-sm text-mutedGray mt-0.5">
            Real-time university overview of student participation, earnings verification, and academic safeguards.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-sage-200 text-forest-700 font-bold text-xs border border-sage-300 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-forest-600" />
            <span>20h Monthly Cap Enforced</span>
          </span>
        </div>
      </div>

      {/* 2. Four Key Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Active Students"
          value={activeStudents}
          subtitle="Enrolled in projects"
          icon={Users}
          iconBgColor="bg-lavender-100"
          iconColor="text-plum-700"
        />

        <StatCard
          title="Active Projects"
          value={activeProjects}
          subtitle="Enterprise contracts"
          icon={Briefcase}
          iconBgColor="bg-ivory-200"
          iconColor="text-charcoal-800"
        />

        <StatCard
          title="Verified Earnings"
          value={`₹${verifiedEarnings.toLocaleString('en-IN')}`}
          subtitle="Audited payouts"
          icon={IndianRupee}
          iconBgColor="bg-sage-200"
          iconColor="text-forest-700"
        />

        <StatCard
          title="Pending Approvals"
          value={pendingVerifications}
          subtitle="Vouchers to audit"
          icon={Clock}
          iconBgColor="bg-peach-100"
          iconColor="text-terracotta-600"
        />
      </div>

      {/* 3. Main Content: Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left: Monthly Earnings Trend */}
        <div className="lg:col-span-7 card-subtle rounded-3xl p-6 bg-white border border-lavender-200/90 space-y-3 shadow-xs">
          <div className="flex items-center justify-between pb-2 border-b border-ivory-200">
            <div>
              <h3 className="text-sm font-serif font-bold text-charcoal-900">
                Monthly Campus Stipends Disbursed
              </h3>
              <p className="text-[11px] text-mutedGray">Audited payouts across all university departments</p>
            </div>
            <Link to="/coordinator/reports" className="text-xs text-forest-700 font-semibold hover:underline">
              Full Analytics →
            </Link>
          </div>

          <div className="h-56 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorForest" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#245747" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#245747" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F5EFE3" vertical={false} />
                <XAxis dataKey="month" stroke="#726B73" fontSize={11} tickLine={false} />
                <YAxis 
                  stroke="#726B73" 
                  fontSize={11} 
                  tickLine={false}
                  tickFormatter={(val) => `₹${val / 1000}k`}
                />
                <Tooltip
                  formatter={(value: any) => [`₹${Number(value).toLocaleString('en-IN')}`, 'Verified Stipends']}
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '16px',
                    border: '1px solid #DCE8DA',
                    fontSize: '12px',
                    boxShadow: '0 4px 12px rgba(36, 87, 71, 0.08)'
                  }}
                />
                <Area type="monotone" dataKey="amount" stroke="#245747" strokeWidth={2.5} fill="url(#colorForest)" name="Verified (₹)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right: Needs Attention List (Max 3) */}
        <div className="lg:col-span-5 card-subtle rounded-3xl p-6 bg-white border border-lavender-200/90 space-y-4 shadow-xs">
          <div className="flex items-center justify-between pb-2 border-b border-ivory-200">
            <div>
              <h3 className="text-sm font-serif font-bold text-charcoal-900 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span>Safeguards Queue</span>
              </h3>
              <p className="text-[11px] text-mutedGray">Students requiring advisor consultation</p>
            </div>
            <Link to="/coordinator/compliance" className="text-xs text-forest-700 font-semibold hover:underline">
              View All →
            </Link>
          </div>

          <div className="space-y-2.5">
            {needsAttention.map((alert) => (
              <div
                key={alert.id}
                className="p-3.5 rounded-2xl bg-ivory-50/80 border border-ivory-200 space-y-1.5 hover:bg-ivory-100/70 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-charcoal-900">{alert.studentName}</span>
                  <StatusBadge status={alert.severity} size="sm" />
                </div>
                <p className="text-[11px] text-charcoal-800">
                  <span className="font-semibold text-rose-700">{alert.type}</span> · <span className="text-mutedGray">{alert.currentValue}</span>
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* 4. Below: Compact Recent Activity Table */}
      <div className="card-subtle rounded-3xl bg-white border border-lavender-200/90 shadow-xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-ivory-200 flex items-center justify-between">
          <h3 className="text-sm font-serif font-bold text-charcoal-900">Recent Payment Records Submitted for Audit</h3>
          <Link to="/coordinator/earnings" className="text-xs text-forest-700 font-semibold hover:underline">
            Go to Earnings Desk →
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-ivory-200 text-mutedGray text-[11px] uppercase tracking-wider bg-ivory-50/70">
                <th className="py-3 px-4">Student</th>
                <th className="py-3 px-4">Project & Enterprise</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ivory-200">
              {recentActivities.map((act) => (
                <tr key={act.id} className="hover:bg-ivory-50/50">
                  <td className="py-3 px-4 font-bold text-charcoal-900">{act.studentName}</td>
                  <td className="py-3 px-4 text-mutedGray">
                    <div>{act.projectTitle}</div>
                    <div className="text-[10px] text-mutedGray">{act.organizationName}</div>
                  </td>
                  <td className="py-3 px-4 font-bold text-forest-700">₹{act.amount.toLocaleString('en-IN')}</td>
                  <td className="py-3 px-4 text-right">
                    <StatusBadge status={act.verificationStatus} size="sm" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
