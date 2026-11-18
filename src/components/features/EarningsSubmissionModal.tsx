import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../common/Modal';
import { UploadCloud, FileText, IndianRupee, ShieldAlert } from 'lucide-react';

interface EarningsSubmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EarningsSubmissionModal: React.FC<EarningsSubmissionModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { projects, submitEarningsRecord } = useApp();
  const [projectId, setProjectId] = useState(projects[0]?.id || '');
  const [hours, setHours] = useState(4);
  const [amount, setAmount] = useState(3200);
  const [proofType, setProofType] = useState<'receipt' | 'bank_statement' | 'invoice'>('invoice');
  const [proofName, setProofName] = useState('Payment_Invoice_Signed.pdf');
  const [notes, setNotes] = useState('');
  const [errorText, setErrorText] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (amount <= 0) {
      setErrorText('Please enter a valid compensation amount.');
      return;
    }
    if (hours <= 0) {
      setErrorText('Please enter the hours worked for this claim.');
      return;
    }

    submitEarningsRecord(projectId, hours, amount, proofName, proofType, notes);
    onClose();
    setErrorText(null);
  };

  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Submit Earnings for Verification"
      subtitle="Upload legitimate payment proof for university coordinator review"
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        {/* Notice on verification policy */}
        <div className="p-3.5 rounded-2xl bg-lavender-50 border border-lavender-200 text-charcoal-800 space-y-1">
          <div className="flex items-center gap-1.5 font-semibold text-plum-900">
            <ShieldAlert className="w-4 h-4 text-plum-600" />
            <span>Coordinator Verification Protocol</span>
          </div>
          <p className="text-[11px] text-mutedGray leading-relaxed">
            All student-reported earnings require independent verification by a university coordinator before counting toward official university micro-earning records.
          </p>
        </div>

        {/* Project Selector */}
        <div>
          <label className="block font-bold uppercase tracking-wider text-charcoal-900 mb-1">
            Associated Project <span className="text-rose-500">*</span>
          </label>
          <select
            value={projectId}
            onChange={(e) => setProjectId(e.target.value)}
            className="w-full rounded-xl border border-lavender-200 p-2.5 bg-white text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-plum-400"
          >
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.title} · {p.organizationName}
              </option>
            ))}
          </select>
        </div>

        {/* Amount & Hours Row */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block font-bold uppercase tracking-wider text-charcoal-900 mb-1">
              Payment Amount (₹) <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <input
                type="number"
                min="100"
                step="100"
                value={amount}
                onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                className="w-full rounded-xl border border-lavender-200 px-3 py-2 pl-8 text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-plum-400 bg-white"
              />
              <IndianRupee className="w-4 h-4 text-plum-600 absolute left-2.5 top-2.5" />
            </div>
          </div>

          <div>
            <label className="block font-bold uppercase tracking-wider text-charcoal-900 mb-1">
              Hours Worked <span className="text-rose-500">*</span>
            </label>
            <input
              type="number"
              min="1"
              step="0.5"
              value={hours}
              onChange={(e) => setHours(parseFloat(e.target.value) || 0)}
              className="w-full rounded-xl border border-lavender-200 px-3 py-2 text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-plum-400 bg-white"
            />
          </div>
        </div>

        {/* Proof Type */}
        <div>
          <label className="block font-bold uppercase tracking-wider text-charcoal-900 mb-1">
            Proof Document Type
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'invoice', label: 'Client Invoice' },
              { id: 'receipt', label: 'Payment Receipt' },
              { id: 'bank_statement', label: 'Bank Statement' },
            ].map((t) => (
              <button
                type="button"
                key={t.id}
                onClick={() => setProofType(t.id as any)}
                className={`py-2 px-2 rounded-xl text-center border font-medium transition-all ${
                  proofType === t.id
                    ? 'bg-plum-500 text-white border-plum-600 font-semibold'
                    : 'bg-white text-charcoal-800 border-lavender-200 hover:bg-lavender-50'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Upload simulation */}
        <div>
          <label className="block font-bold uppercase tracking-wider text-charcoal-900 mb-1">
            Upload Proof File (PDF / PNG) <span className="text-rose-500">*</span>
          </label>
          <div className="border border-dashed border-lavender-300 rounded-2xl p-4 bg-lavender-50/40 text-center space-y-2">
            <UploadCloud className="w-8 h-8 text-plum-500 mx-auto" />
            <div className="font-semibold text-charcoal-900">{proofName}</div>
            <p className="text-[11px] text-mutedGray">
              Clear screenshot or official document containing transaction reference, date, and supervisor signature.
            </p>
            <button
              type="button"
              onClick={() => setProofName(`Wire_Transfer_Receipt_${Date.now().toString().slice(-4)}.pdf`)}
              className="text-xs text-plum-600 font-bold underline hover:text-plum-700"
            >
              Simulate File Selection
            </button>
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="block font-bold uppercase tracking-wider text-charcoal-900 mb-1">
            Additional Context or Notes
          </label>
          <textarea
            rows={2}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="e.g. Milestone 2 completed, client confirmed payment via ACH transfer #9842"
            className="w-full rounded-xl border border-lavender-200 p-2.5 text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-plum-400 bg-white"
          />
        </div>

        {errorText && (
          <p className="text-rose-600 font-medium">
            {errorText}
          </p>
        )}

        {/* Actions */}
        <div className="pt-3 border-t border-ivory-200 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-lavender-200 font-semibold text-charcoal-800 hover:bg-lavender-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2 rounded-xl bg-plum-500 hover:bg-plum-600 text-white font-semibold shadow-sm transition-colors"
          >
            Submit for Verification
          </button>
        </div>
      </form>
    </Modal>
  );
};
