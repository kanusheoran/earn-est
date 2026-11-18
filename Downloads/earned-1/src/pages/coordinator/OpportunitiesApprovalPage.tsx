import React, { useState } from 'react';
import { 
  Briefcase, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Plus, 
  Building2, 
  DollarSign, 
  Eye, 
  AlertCircle 
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Modal } from '../../components/common/Modal';
import { Opportunity } from '../../types';

export const OpportunitiesApprovalPage: React.FC = () => {
  const { opportunities, approveOpportunity } = useApp();
  const [inspectOpp, setInspectOpp] = useState<Opportunity | null>(null);
  const [activeTab, setActiveTab] = useState<'pending' | 'published' | 'all'>('pending');

  const pendingOpps = opportunities.filter(o => o.status === 'Pending Approval');
  const publishedOpps = opportunities.filter(o => o.status === 'Published');
  const displayedOpps = 
    activeTab === 'pending' 
      ? pendingOpps 
      : activeTab === 'published' 
      ? publishedOpps 
      : opportunities;

  const handleApprove = (id: string) => {
    approveOpportunity(id, true);
    setInspectOpp(null);
  };

  const handleReject = (id: string) => {
    const reason = prompt('Please enter feedback for the enterprise on why this opportunity was rejected:');
    if (reason) {
      approveOpportunity(id, false, reason);
      setInspectOpp(null);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-lavender-200/80">
        <div>
          <div className="flex items-center gap-2">
            <Briefcase className="w-6 h-6 text-forest-600" />
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-charcoal-900">
              Opportunity Moderation & Publishing
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-mutedGray mt-1">
            Review enterprise-submitted projects, ensure compensation standards, and approve opportunities for campus publishing.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-full bg-peach-100 text-charcoal-900 border border-peach-200 font-bold text-xs">
            {pendingOpps.length} Pending Approval
          </span>
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
          <span>Pending University Approval</span>
          <span className={`px-2 py-0.2 rounded-full text-[10px] ${activeTab === 'pending' ? 'bg-white text-plum-900' : 'bg-peach-100 text-charcoal-900'}`}>
            {pendingOpps.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('published')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors flex items-center gap-2 ${
            activeTab === 'published'
              ? 'bg-forest-600 text-white shadow-xs'
              : 'bg-white text-charcoal-800 hover:bg-lavender-50 border border-lavender-200'
          }`}
        >
          <span>Published ({publishedOpps.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('all')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors flex items-center gap-2 ${
            activeTab === 'all'
              ? 'bg-charcoal-900 text-white shadow-xs'
              : 'bg-white text-charcoal-800 hover:bg-lavender-50 border border-lavender-200'
          }`}
        >
          <span>All Postings ({opportunities.length})</span>
        </button>
      </div>

      {/* Opportunity Table */}
      <div className="card-subtle rounded-3xl p-6 bg-white border border-lavender-200/90 space-y-4">
        {displayedOpps.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-ivory-200 text-mutedGray text-[10px] uppercase tracking-wider">
                  <th className="py-3 px-3">Opportunity Title</th>
                  <th className="py-3 px-3">Organization</th>
                  <th className="py-3 px-3">Category</th>
                  <th className="py-3 px-3">Stipend</th>
                  <th className="py-3 px-3">Est. Hours</th>
                  <th className="py-3 px-3">Min CGPA</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3 text-right">Moderation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ivory-200">
                {displayedOpps.map((opp) => (
                  <tr key={opp.id} className="hover:bg-ivory-50/70 transition-colors">
                    <td className="py-3.5 px-3">
                      <div className="font-bold text-charcoal-900">{opp.title}</div>
                      <div className="text-[10px] text-mutedGray">Deadline: {opp.deadline}</div>
                    </td>

                    <td className="py-3.5 px-3">
                      <div className="flex items-center gap-2">
                        <img
                          src={opp.organizationLogo}
                          alt={opp.organizationName}
                          className="w-6 h-6 rounded-md object-cover border border-lavender-200"
                        />
                        <span className="font-semibold text-charcoal-800">{opp.organizationName}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-3 text-charcoal-800">
                      {opp.category}
                    </td>

                    <td className="py-3.5 px-3 font-serif font-bold text-forest-700 text-sm">
                      ${opp.compensation}
                    </td>

                    <td className="py-3.5 px-3 font-medium text-charcoal-800">
                      {opp.estimatedHours} hrs
                    </td>

                    <td className="py-3.5 px-3 font-medium text-charcoal-800">
                      {opp.minimumCgpa.toFixed(1)}
                    </td>

                    <td className="py-3.5 px-3">
                      <StatusBadge status={opp.status} size="sm" />
                    </td>

                    <td className="py-3.5 px-3 text-right">
                      {opp.status === 'Pending Approval' ? (
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleApprove(opp.id)}
                            className="px-3 py-1.5 rounded-xl bg-forest-600 hover:bg-forest-700 text-white font-semibold text-xs transition-colors flex items-center gap-1"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Approve</span>
                          </button>
                          <button
                            onClick={() => handleReject(opp.id)}
                            className="px-2.5 py-1.5 rounded-xl border border-rose-200 text-rose-700 hover:bg-rose-50 text-xs font-semibold transition-colors"
                          >
                            Reject
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setInspectOpp(opp)}
                          className="px-3 py-1 rounded-xl bg-ivory-100 hover:bg-lavender-100 text-charcoal-900 font-semibold transition-colors"
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
            No opportunities in the <strong>{activeTab}</strong> queue.
          </div>
        )}
      </div>

      {/* Inspect Opportunity Modal */}
      {inspectOpp && (
        <Modal
          isOpen={!!inspectOpp}
          onClose={() => setInspectOpp(null)}
          title={inspectOpp.title}
          subtitle={`${inspectOpp.organizationName} · ${inspectOpp.category}`}
          maxWidth="lg"
        >
          <div className="space-y-4 text-xs">
            <p className="text-charcoal-800 leading-relaxed bg-ivory-50 p-4 rounded-2xl border border-ivory-200">
              {inspectOpp.description}
            </p>

            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 rounded-xl bg-white border border-lavender-200">
                <span className="text-[10px] text-mutedGray uppercase font-bold">Compensation</span>
                <div className="font-bold font-serif text-forest-700 text-sm mt-0.5">${inspectOpp.compensation}</div>
              </div>
              <div className="p-3 rounded-xl bg-white border border-lavender-200">
                <span className="text-[10px] text-mutedGray uppercase font-bold">Estimated Hours</span>
                <div className="font-bold text-charcoal-900 mt-0.5">{inspectOpp.estimatedHours} hrs</div>
              </div>
              <div className="p-3 rounded-xl bg-white border border-lavender-200">
                <span className="text-[10px] text-mutedGray uppercase font-bold">Min CGPA</span>
                <div className="font-bold text-charcoal-900 mt-0.5">{inspectOpp.minimumCgpa.toFixed(1)}</div>
              </div>
            </div>

            <div>
              <span className="font-bold uppercase tracking-wider text-mutedGray text-[10px] block mb-1">
                Required Deliverables:
              </span>
              <ul className="space-y-1 list-disc pl-4 text-charcoal-800">
                {inspectOpp.deliverables.map((d, i) => (
                  <li key={i}>{d}</li>
                ))}
              </ul>
            </div>

            <div className="pt-3 border-t border-ivory-200 flex justify-end">
              <button
                type="button"
                onClick={() => setInspectOpp(null)}
                className="px-4 py-2 rounded-xl bg-charcoal-900 text-white font-semibold text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}

    </div>
  );
};
