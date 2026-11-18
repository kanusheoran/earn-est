import React, { useState } from 'react';
import { 
  BadgePercent, 
  CheckCircle2, 
  XCircle, 
  FileText, 
  Clock, 
  DollarSign, 
  ShieldCheck, 
  Eye, 
  Filter 
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../../components/common/StatusBadge';
import { VerificationModal } from '../../components/features/VerificationModal';
import { EarningsRecord } from '../../types';

export const EarningsVerificationPage: React.FC = () => {
  const { earnings } = useApp();
  const [selectedRecord, setSelectedRecord] = useState<EarningsRecord | null>(null);
  const [activeTab, setActiveTab] = useState<'pending' | 'verified' | 'rejected'>('pending');

  const pendingRecords = earnings.filter(e => e.verificationStatus === 'Submitted for Verification');
  const verifiedRecords = earnings.filter(e => e.verificationStatus === 'Verified');
  const rejectedRecords = earnings.filter(e => e.verificationStatus === 'Rejected');

  const displayedRecords = 
    activeTab === 'pending' 
      ? pendingRecords 
      : activeTab === 'verified' 
      ? verifiedRecords 
      : rejectedRecords;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-lavender-200/80">
        <div>
          <div className="flex items-center gap-2">
            <BadgePercent className="w-6 h-6 text-forest-600" />
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-charcoal-900">
              Earnings Verification Desk
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-mutedGray mt-1">
            Audit student-submitted payment evidence, invoices, and bank transfer receipts to certify official micro-earnings.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-full bg-peach-100 text-charcoal-900 border border-peach-200 font-bold text-xs">
            {pendingRecords.length} Awaiting Audit
          </span>
        </div>
      </div>

      {/* Verification Protocol Notice */}
      <div className="p-4 rounded-3xl bg-sage-50/80 border border-sage-200 flex items-start gap-3 text-xs">
        <ShieldCheck className="w-5 h-5 text-forest-600 shrink-0 mt-0.5" />
        <div>
          <h4 className="font-bold text-forest-800">Coordinator Oversight Protocol</h4>
          <p className="text-mutedGray text-[11px] leading-relaxed">
            Ensure the attached proof explicitly identifies the client organization, transaction date, supervisor signature or bank trace, and matches recorded work-log hours before verifying.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-ivory-200 pb-2">
        <button
          onClick={() => setActiveTab('pending')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors flex items-center gap-2 ${
            activeTab === 'pending'
              ? 'bg-plum-500 text-white shadow-xs'
              : 'bg-white text-charcoal-800 hover:bg-lavender-50 border border-lavender-200'
          }`}
        >
          <span>Pending Audit</span>
          <span className={`px-2 py-0.2 rounded-full text-[10px] ${activeTab === 'pending' ? 'bg-white text-plum-900' : 'bg-peach-100 text-charcoal-900'}`}>
            {pendingRecords.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('verified')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors flex items-center gap-2 ${
            activeTab === 'verified'
              ? 'bg-forest-600 text-white shadow-xs'
              : 'bg-white text-charcoal-800 hover:bg-lavender-50 border border-lavender-200'
          }`}
        >
          <span>Verified ({verifiedRecords.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('rejected')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors flex items-center gap-2 ${
            activeTab === 'rejected'
              ? 'bg-rose-600 text-white shadow-xs'
              : 'bg-white text-charcoal-800 hover:bg-lavender-50 border border-lavender-200'
          }`}
        >
          <span>Rejected ({rejectedRecords.length})</span>
        </button>
      </div>

      {/* Submissions Table */}
      <div className="card-subtle rounded-3xl p-6 bg-white border border-lavender-200/90 space-y-4">
        {displayedRecords.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-ivory-200 text-mutedGray text-[10px] uppercase tracking-wider">
                  <th className="py-3 px-3">Date</th>
                  <th className="py-3 px-3">Student Name</th>
                  <th className="py-3 px-3">Project & Organization</th>
                  <th className="py-3 px-3">Hours Logged</th>
                  <th className="py-3 px-3">Claimed Amount</th>
                  <th className="py-3 px-3">Submitted File</th>
                  <th className="py-3 px-3">Audit Status</th>
                  <th className="py-3 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ivory-200">
                {displayedRecords.map((record) => (
                  <tr key={record.id} className="hover:bg-ivory-50/70 transition-colors">
                    <td className="py-3 px-3 font-semibold text-charcoal-900 whitespace-nowrap">
                      {record.date}
                    </td>

                    <td className="py-3 px-3 font-bold text-charcoal-900">
                      {record.studentName}
                    </td>

                    <td className="py-3 px-3">
                      <div className="font-semibold text-charcoal-900 line-clamp-1">{record.projectTitle}</div>
                      <div className="text-[11px] text-mutedGray">{record.organizationName}</div>
                    </td>

                    <td className="py-3 px-3 font-medium text-charcoal-800">
                      {record.hoursWorked} hrs
                    </td>

                    <td className="py-3 px-3 font-serif font-bold text-forest-700 text-sm">
                      ₹{record.amount.toLocaleString('en-IN')}
                    </td>

                    <td className="py-3 px-3">
                      <div className="flex items-center gap-1.5 text-plum-600 font-medium">
                        <FileText className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate max-w-[130px]">{record.proofFileName || 'Evidence.pdf'}</span>
                      </div>
                    </td>

                    <td className="py-3 px-3">
                      <StatusBadge status={record.verificationStatus} size="sm" />
                    </td>

                    <td className="py-3 px-3 text-right">
                      {record.verificationStatus === 'Submitted for Verification' ? (
                        <button
                          onClick={() => setSelectedRecord(record)}
                          className="px-3.5 py-1.5 rounded-xl bg-forest-600 hover:bg-forest-700 text-white font-semibold transition-colors"
                        >
                          Audit & Verify
                        </button>
                      ) : (
                        <button
                          onClick={() => setSelectedRecord(record)}
                          className="px-3 py-1 rounded-xl bg-ivory-100 text-charcoal-800 font-semibold hover:bg-lavender-100 transition-colors"
                        >
                          View Details
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-12 text-center text-xs text-mutedGray">
            No records in the <strong>{activeTab}</strong> queue.
          </div>
        )}
      </div>

      {/* Verification Modal */}
      <VerificationModal
        isOpen={!!selectedRecord}
        onClose={() => setSelectedRecord(null)}
        record={selectedRecord}
      />
    </div>
  );
};
