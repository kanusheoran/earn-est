import React, { useState } from 'react';
import { EarningsRecord } from '../../types';
import { useApp } from '../../context/AppContext';
import { Modal } from '../common/Modal';
import { FileText, CheckCircle2, XCircle, AlertTriangle, ShieldCheck } from 'lucide-react';

interface VerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  record: EarningsRecord | null;
}

export const VerificationModal: React.FC<VerificationModalProps> = ({
  isOpen,
  onClose,
  record,
}) => {
  const { verifyEarningsRecord } = useApp();
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectInput, setShowRejectInput] = useState(false);

  if (!record) return null;

  const handleApprove = () => {
    verifyEarningsRecord(record.id, true);
    onClose();
  };

  const handleReject = () => {
    if (!rejectionReason.trim()) {
      alert('Please provide a specific reason for rejection to help the student correct their submission.');
      return;
    }
    verifyEarningsRecord(record.id, false, rejectionReason);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Verify Student Earnings Record"
      subtitle={`Submission ID: ${record.id} · Student: ${record.studentName}`}
      maxWidth="lg"
    >
      <div className="space-y-4 text-xs">
        {/* Verification Summary Card */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-2xl bg-ivory-50 border border-lavender-200">
          <div>
            <span className="text-[10px] uppercase font-bold text-mutedGray">Student</span>
            <div className="font-semibold text-charcoal-900 mt-0.5">{record.studentName}</div>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-mutedGray">Claimed Amount</span>
            <div className="font-bold text-forest-700 text-sm mt-0.5 font-serif">₹{record.amount.toLocaleString('en-IN')}</div>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-mutedGray">Hours Logged</span>
            <div className="font-semibold text-charcoal-900 mt-0.5">{record.hoursWorked} hrs</div>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-mutedGray">Submission Date</span>
            <div className="font-semibold text-charcoal-900 mt-0.5">{record.date}</div>
          </div>
        </div>

        {/* Project & Client */}
        <div className="p-3 rounded-xl bg-white border border-lavender-200 space-y-1">
          <span className="text-[10px] uppercase font-bold text-mutedGray">Associated Project</span>
          <div className="font-semibold text-charcoal-900">{record.projectTitle}</div>
          <div className="text-mutedGray text-[11px]">{record.organizationName}</div>
        </div>

        {/* Proof Document Inspection */}
        <div>
          <span className="block font-bold uppercase tracking-wider text-charcoal-900 mb-1.5">
            Submitted Payment Evidence
          </span>
          <div className="p-4 rounded-2xl border border-lavender-300 bg-lavender-50/50 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-plum-100 text-plum-700 flex items-center justify-center shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h5 className="font-semibold text-charcoal-900">{record.proofFileName || 'Evidence_Document.pdf'}</h5>
                <p className="text-[11px] text-mutedGray">Document Type: {record.proofFileType || 'Invoice / Receipt'}</p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => alert(`Simulating viewing ${record.proofFileName} in secure viewer.`)}
              className="px-3 py-1.5 rounded-xl bg-white border border-lavender-300 text-plum-700 font-semibold text-xs hover:bg-lavender-100"
            >
              View Document
            </button>
          </div>
          {record.proofNotes && (
            <p className="text-[11px] text-mutedGray mt-2 italic bg-ivory-50 p-2.5 rounded-xl border border-ivory-200">
              Student Note: "{record.proofNotes}"
            </p>
          )}
        </div>

        {/* Rejection input toggle */}
        {showRejectInput && (
          <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 space-y-2">
            <div className="flex items-center gap-1.5 font-bold text-rose-800">
              <AlertTriangle className="w-4 h-4 text-rose-600" />
              <span>Provide Reason for Rejection</span>
            </div>
            <textarea
              rows={3}
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="e.g. Missing bank transaction ID, receipt does not show employer stamp, or hours claimed exceed project scope..."
              className="w-full rounded-xl border border-rose-200 p-2.5 text-xs text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-rose-400 bg-white"
            />
          </div>
        )}

        {/* Actions */}
        <div className="pt-3 border-t border-ivory-200 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-lavender-200 font-semibold text-charcoal-800 hover:bg-lavender-50"
          >
            Close
          </button>

          <div className="flex items-center gap-2">
            {!showRejectInput ? (
              <button
                type="button"
                onClick={() => setShowRejectInput(true)}
                className="px-4 py-2 rounded-xl border border-rose-200 text-rose-700 font-semibold hover:bg-rose-50 flex items-center gap-1.5"
              >
                <XCircle className="w-4 h-4" />
                <span>Reject...</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleReject}
                className="px-4 py-2 rounded-xl bg-rose-600 text-white font-semibold hover:bg-rose-700 flex items-center gap-1.5"
              >
                <XCircle className="w-4 h-4" />
                <span>Confirm Rejection</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleApprove}
              className="px-5 py-2 rounded-xl bg-forest-600 hover:bg-forest-700 text-white font-semibold shadow-sm flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Approve & Verify</span>
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
