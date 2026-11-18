import React, { useState } from 'react';
import { Plus, CheckCircle2, Clock, IndianRupee, FileText } from 'lucide-react';
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
import { EarningsSubmissionModal } from '../../components/features/EarningsSubmissionModal';

export const EarningsPage: React.FC = () => {
  const { earnings, currentStudent } = useApp();
  const [submissionModalOpen, setSubmissionModalOpen] = useState(false);

  const myEarnings = earnings.filter(e => e.studentId === currentStudent.id);

  const totalVerified = myEarnings
    .filter(e => e.verificationStatus === 'Verified')
    .reduce((sum, e) => sum + e.amount, 0);

  const totalPending = myEarnings
    .filter(e => e.verificationStatus === 'Submitted for Verification')
    .reduce((sum, e) => sum + e.amount, 0);

  const totalEarnings = currentStudent.totalEarnings;

  const chartData = [
    { month: 'Sep', amount: 6400 },
    { month: 'Oct', amount: 10400 },
    { month: 'Nov', amount: totalEarnings },
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-lavender-200/80">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-charcoal-900">
            Student Earnings
          </h1>
          <p className="text-xs sm:text-sm text-mutedGray mt-0.5">
            Track your verified earnings, pending disbursements, and upload payment vouchers.
          </p>
        </div>

        <button
          onClick={() => setSubmissionModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-forest-600 hover:bg-forest-700 text-white text-xs font-semibold shadow-xs transition-colors shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Earnings Record</span>
        </button>
      </div>

      {/* Three Summary Figures */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Total Earnings"
          value={`₹${totalEarnings.toLocaleString('en-IN')}`}
          subtitle="Cumulative campus earnings"
          icon={IndianRupee}
          iconBgColor="bg-sage-200"
          iconColor="text-forest-700"
        />

        <StatCard
          title="Verified Earnings"
          value={`₹${totalVerified.toLocaleString('en-IN')}`}
          subtitle="Audited by coordinator"
          icon={CheckCircle2}
          iconBgColor="bg-sage-100"
          iconColor="text-forest-700"
        />

        <StatCard
          title="Pending Verification"
          value={`₹${totalPending.toLocaleString('en-IN')}`}
          subtitle="Awaiting coordinator review"
          icon={Clock}
          iconBgColor="bg-peach-100"
          iconColor="text-terracotta-600"
        />
      </div>

      {/* Simple, Restrained Earnings Trend Chart */}
      <div className="card-subtle rounded-3xl p-6 bg-white border border-lavender-200/90 shadow-xs space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-serif font-bold text-charcoal-900">Monthly Earnings Trend</h3>
          <span className="text-xs font-semibold text-forest-700">INR (₹)</span>
        </div>
        <div className="h-44 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
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
                formatter={(value: any) => [`₹${Number(value).toLocaleString('en-IN')}`, 'Earnings']}
                contentStyle={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '16px',
                  border: '1px solid #DCE8DA',
                  fontSize: '12px',
                  boxShadow: '0 4px 12px rgba(36, 87, 71, 0.08)'
                }}
              />
              <Area type="monotone" dataKey="amount" stroke="#245747" strokeWidth={2.5} fill="url(#colorForest)" name="Earnings (₹)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Clean Transaction Table */}
      <div className="card-subtle rounded-3xl bg-white border border-lavender-200/90 shadow-xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-ivory-200">
          <h3 className="text-sm font-serif font-bold text-charcoal-900">Disbursement & Verification Records</h3>
        </div>

        {myEarnings.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-ivory-200 text-mutedGray text-[11px] uppercase tracking-wider bg-ivory-50/70">
                  <th className="py-3.5 px-4">Project & Organization</th>
                  <th className="py-3.5 px-4">Disbursement Date</th>
                  <th className="py-3.5 px-4">Amount</th>
                  <th className="py-3.5 px-4 text-right">Verification Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ivory-200">
                {myEarnings.map((record) => (
                  <tr key={record.id} className="hover:bg-ivory-50/50 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-charcoal-900">
                      <div>{record.projectTitle}</div>
                      <div className="text-[11px] text-mutedGray font-normal">{record.organizationName}</div>
                    </td>
                    <td className="py-3.5 px-4 text-mutedGray whitespace-nowrap">
                      {record.date}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-forest-700">
                      ₹{record.amount.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <StatusBadge status={record.verificationStatus} size="sm" />
                      {record.verificationStatus === 'Rejected' && record.rejectionReason && (
                        <p className="text-[10px] text-rose-600 mt-1 max-w-xs ml-auto">
                          {record.rejectionReason}
                        </p>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-8 text-center text-xs text-mutedGray">
            No transactions recorded yet.
          </div>
        )}
      </div>

      {/* Submission Modal */}
      <EarningsSubmissionModal
        isOpen={submissionModalOpen}
        onClose={() => setSubmissionModalOpen(false)}
      />

    </div>
  );
};
