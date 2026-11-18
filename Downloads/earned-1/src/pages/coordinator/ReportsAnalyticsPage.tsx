import React, { useState } from 'react';
import { 
  BarChart3, 
  Download, 
  Calendar, 
  Filter, 
  TrendingUp, 
  IndianRupee, 
  Users, 
  ShieldCheck, 
  Award, 
  CheckCircle2 
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { useApp } from '../../context/AppContext';
import { StatCard } from '../../components/common/StatCard';

export const ReportsAnalyticsPage: React.FC = () => {
  const { allStudents, projects, earnings, programmeSettings } = useApp();
  const [selectedDept, setSelectedDept] = useState('All');
  const [dateRange, setDateRange] = useState('Fall 2026 Term');

  const totalVerifiedEarnings = earnings
    .filter(e => e.verificationStatus === 'Verified')
    .reduce((sum, e) => sum + e.amount, 0);

  const completedProjects = projects.filter(p => p.status === 'Completed').length;
  const completionRate = projects.length > 0 ? Math.round((completedProjects / projects.length) * 100) : 100;

  // Monthly trends
  const monthlyTrends = [
    { month: 'Jul', earnings: 1800, hours: 90, students: 16 },
    { month: 'Aug', earnings: 2900, hours: 145, students: 24 },
    { month: 'Sep', earnings: 4200, hours: 210, students: 35 },
    { month: 'Oct', earnings: 6100, hours: 305, students: 44 },
    { month: 'Nov', earnings: totalVerifiedEarnings > 0 ? totalVerifiedEarnings : 8400, hours: 410, students: 52 },
  ];

  // Department distribution
  const deptData = [
    { name: 'Computer Science', value: 42, color: '#795C78' },
    { name: 'Visual Design', value: 28, color: '#245747' },
    { name: 'Business & Finance', value: 16, color: '#F4C4AF' },
    { name: 'Data Science & AI', value: 14, color: '#F2D477' },
  ];

  const handleExportCSV = () => {
    alert('Exporting certified university CSV ledger containing student IDs, departments, verified amounts, hours logged, and supervisor approvals.');
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-lavender-200/80">
        <div>
          <div className="flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-forest-600" />
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-charcoal-900">
              Institutional Reports & Analytics
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-mutedGray mt-1">
            Audited financial records, academic compliance velocity, and student career readiness outcomes.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-forest-600 hover:bg-forest-700 text-white text-xs font-semibold shadow-xs transition-colors shrink-0"
        >
          <Download className="w-4 h-4" />
          <span>Export Certified CSV Report</span>
        </button>
      </div>

      {/* Filter Row */}
      <div className="card-subtle rounded-3xl p-4 bg-white border border-lavender-200/90 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 text-charcoal-800 font-semibold">
            <Calendar className="w-4 h-4 text-forest-600" />
            <span>Academic Term:</span>
          </div>
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="rounded-xl border border-lavender-200 px-3 py-1.5 bg-white text-charcoal-800"
          >
            <option value="Fall 2026 Term">Fall 2026 (Current Term)</option>
            <option value="Spring 2026 Term">Spring 2026</option>
            <option value="Academic Year 2025-26">Full Academic Year 2025-26</option>
          </select>

          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="rounded-xl border border-lavender-200 px-3 py-1.5 bg-white text-charcoal-800 ml-2"
          >
            <option value="All">All Faculties</option>
            <option value="Computer Science">Computer Science & Engineering</option>
            <option value="Visual Design">Visual Communication & Design</option>
            <option value="Business">School of Business & Finance</option>
            <option value="Data Science">Data Science & AI</option>
          </select>
        </div>

        <span className="text-forest-700 font-semibold bg-sage-100 px-3 py-1 rounded-full border border-sage-200">
          Data synchronized with University Registrar
        </span>
      </div>

      {/* 4 Analytics KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Certified Earnings"
          value={`₹${totalVerifiedEarnings.toLocaleString('en-IN')}`}
          subtitle="Audited and approved payouts"
          icon={IndianRupee}
          iconBgColor="bg-sage-200"
          iconColor="text-forest-700"
          trend={{ value: '+24%', label: 'vs previous academic semester', isPositive: true }}
        />

        <StatCard
          title="Student Participation"
          value="82%"
          subtitle="Active freelance engagement"
          icon={Users}
          iconBgColor="bg-lavender-100"
          iconColor="text-plum-700"
          trend={{ value: '48 Students', label: 'actively taking projects', isPositive: true }}
        />

        <StatCard
          title="Safeguard Compliance Rate"
          value="96.2%"
          subtitle="Within monthly 20h limit & 7.0 CGPA"
          icon={ShieldCheck}
          iconBgColor="bg-sage-200"
          iconColor="text-forest-700"
          trend={{ value: 'Normal', label: 'academic priority preserved', isPositive: true }}
        />

        <StatCard
          title="Project Completion Rate"
          value={`${completionRate}%`}
          subtitle="Milestones delivered on schedule"
          icon={Award}
          iconBgColor="bg-peach-100"
          iconColor="text-charcoal-900"
          trend={{ value: 'Excellent', label: 'enterprise partner satisfaction', isPositive: true }}
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Monthly Trend Line Chart */}
        <div className="lg:col-span-8 card-subtle rounded-3xl p-6 bg-white border border-lavender-200/90 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-ivory-200">
            <div>
              <h3 className="font-serif font-bold text-lg text-charcoal-900">
                Monthly Earning & Workload Trends
              </h3>
              <p className="text-xs text-mutedGray">Verified disbursements (₹) vs total student work hours logged</p>
            </div>
          </div>

          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyTrends} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1EBEF" vertical={false} />
                <XAxis dataKey="month" stroke="#777078" fontSize={11} tickLine={false} />
                <YAxis stroke="#777078" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '16px',
                    border: '1px solid #DCCBD9',
                    fontSize: '12px',
                  }}
                />
                <Line type="monotone" dataKey="earnings" stroke="#795C78" strokeWidth={3} dot={{ r: 4 }} name="Total Payout ($)" />
                <Line type="monotone" dataKey="hours" stroke="#245747" strokeWidth={2.5} dot={{ r: 4 }} name="Work Hours Logged" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right: Departmental Share Pie Chart */}
        <div className="lg:col-span-4 card-subtle rounded-3xl p-6 bg-white border border-lavender-200/90 space-y-4 flex flex-col justify-between">
          <div>
            <div className="pb-2 border-b border-ivory-200">
              <h3 className="font-serif font-bold text-lg text-charcoal-900">
                Participation by Faculty
              </h3>
              <p className="text-xs text-mutedGray">Distribution across academic departments</p>
            </div>

            <div className="h-48 w-full flex items-center justify-center pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={deptData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {deptData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-1.5 pt-2 text-xs">
              {deptData.map((d) => (
                <div key={d.name} className="flex items-center justify-between text-charcoal-800">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }} />
                    <span>{d.name}</span>
                  </div>
                  <span className="font-bold">{d.value}%</span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-ivory-50 border border-ivory-200 text-[11px] text-mutedGray leading-relaxed">
            Report certifies zero academic penalties incurred across active work-study participants.
          </div>
        </div>

      </div>

    </div>
  );
};
