import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  User, 
  Phone, 
  Mail, 
  AlertCircle, 
  Sparkles, 
  Clock, 
  Users, 
  ArrowRight,
  Shield,
  Check
} from 'lucide-react';
import { Department } from '../types';
import { apiRequest } from '../services/api';

interface JoinQueuePageProps {
  onTicketGenerated: (ticketData: any) => void;
  onNavigate: (view: string) => void;
}

export const JoinQueuePage: React.FC<JoinQueuePageProps> = ({ onTicketGenerated, onNavigate }) => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [selectedDeptId, setSelectedDeptId] = useState<string>('');
  const [customerName, setCustomerName] = useState<string>('');
  const [customerPhone, setCustomerPhone] = useState<string>('');
  const [customerEmail, setCustomerEmail] = useState<string>('');
  const [priority, setPriority] = useState<string>('STANDARD');
  const [notes, setNotes] = useState<string>('');
  
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    async function loadDepts() {
      try {
        const list = await apiRequest<Department[]>('/departments');
        setDepartments(list);
        if (list.length > 0) {
          setSelectedDeptId(list[0].id);
        }
      } catch (err: any) {
        setErrorMessage(err.message || 'Failed to fetch departments');
      } finally {
        setLoading(false);
      }
    }
    loadDepts();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !selectedDeptId) {
      setErrorMessage('Please provide your name and select a service department.');
      return;
    }

    setSubmitting(true);
    setErrorMessage(null);

    try {
      const response = await apiRequest('/queues/join', {
        method: 'POST',
        body: JSON.stringify({
          departmentId: selectedDeptId,
          customerName: customerName.trim(),
          customerPhone: customerPhone.trim() || undefined,
          customerEmail: customerEmail.trim() || undefined,
          priority,
          notes: notes.trim() || undefined
        })
      });

      // Navigate to tracking with the newly generated ticket
      onTicketGenerated(response);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to join the queue. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const selectedDepartment = departments.find(d => d.id === selectedDeptId);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12">
      <div className="mb-8 text-center sm:text-left">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Join Service Queue</h1>
        <p className="mt-1 text-slate-600">
          Enter your details to generate your digital ticket and track your wait time in real-time.
        </p>
      </div>

      {errorMessage && (
        <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 flex items-start space-x-3 text-sm">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-rose-600" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Form Details */}
        <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          
          {/* Department Selection */}
          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2">
              Select Department or Service *
            </label>
            {loading ? (
              <div className="p-4 bg-slate-50 border rounded-xl text-center text-sm text-slate-500">
                Loading active departments...
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-2.5">
                {departments.map((dept) => {
                  const isSelected = dept.id === selectedDeptId;
                  return (
                    <div
                      key={dept.id}
                      onClick={() => setSelectedDeptId(dept.id)}
                      className={`cursor-pointer p-3.5 rounded-xl border text-left transition-all ${
                        isSelected 
                          ? 'border-sky-600 bg-sky-50/60 ring-2 ring-sky-600/20' 
                          : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-0.5 text-xs font-mono font-bold rounded ${
                            isSelected ? 'bg-sky-600 text-white' : 'bg-slate-200 text-slate-700'
                          }`}>
                            {dept.code}
                          </span>
                          <span className="font-semibold text-sm text-slate-900">{dept.name}</span>
                        </div>
                        <span className="text-xs font-medium text-slate-500">
                          {dept.waitingCount} waiting
                        </span>
                      </div>
                      {dept.description && (
                        <p className="mt-1 text-xs text-slate-500 line-clamp-1">{dept.description}</p>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Customer Name */}
          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-1.5">
              Full Name or Display Name *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <User className="w-4 h-4" />
              </div>
              <input
                type="text"
                required
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="e.g. Alex Morgan"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all"
              />
            </div>
          </div>

          {/* Contact Details (Optional) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-1.5">
                Phone Number <span className="text-slate-400 font-normal">(Optional)</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Phone className="w-4 h-4" />
                </div>
                <input
                  type="tel"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="+1 (555) 000-0000"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-1.5">
                Email Address <span className="text-slate-400 font-normal">(Optional)</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  placeholder="alex@example.com"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all"
                />
              </div>
            </div>
          </div>

          {/* Priority / Accessibility Category */}
          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2">
              Queue Category / Priority
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'STANDARD', label: 'Standard' },
                { id: 'SENIOR_ACCESSIBLE', label: 'Senior / Access' },
                { id: 'URGENT', label: 'Urgent' },
                { id: 'VIP', label: 'VIP' }
              ].map((tier) => (
                <button
                  type="button"
                  key={tier.id}
                  onClick={() => setPriority(tier.id)}
                  className={`py-2 px-3 text-xs font-semibold rounded-lg border text-center transition-all ${
                    priority === tier.id
                      ? 'bg-slate-900 text-white border-slate-900'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {tier.label}
                </button>
              ))}
            </div>
          </div>

          {/* Service Notes */}
          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-1.5">
              Service Notes or Requirements <span className="text-slate-400 font-normal">(Optional)</span>
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Inquiring regarding semester enrollment documents..."
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={submitting || loading}
            className="w-full py-3.5 bg-sky-600 hover:bg-sky-700 disabled:opacity-50 text-white font-semibold rounded-xl shadow-md shadow-sky-600/20 flex items-center justify-center space-x-2 transition-all"
          >
            {submitting ? (
              <span>Generating Secure Token...</span>
            ) : (
              <>
                <span>Get Queue Token</span>
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </div>

        {/* Right Column: Live Context & Service Guarantee */}
        <div className="lg:col-span-5 space-y-6">
          {selectedDepartment ? (
            <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-6 opacity-10">
                <Building2 className="w-32 h-32 text-white" />
              </div>

              <div className="relative z-10 space-y-6">
                <div>
                  <span className="text-xs font-mono uppercase tracking-wider text-sky-400 font-semibold">Selected Desk</span>
                  <h3 className="text-xl font-bold mt-0.5">{selectedDepartment.name}</h3>
                  <p className="text-xs text-slate-300 mt-1">{selectedDepartment.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4 py-4 border-y border-slate-800">
                  <div>
                    <span className="text-xs text-slate-400 block">Current Waitline</span>
                    <span className="text-2xl font-extrabold text-white">
                      {selectedDepartment.waitingCount || 0}
                    </span>
                    <span className="text-xs text-slate-400 ml-1">people</span>
                  </div>

                  <div>
                    <span className="text-xs text-slate-400 block">Est. Duration</span>
                    <span className="text-2xl font-extrabold text-white">
                      ~{selectedDepartment.estimatedServiceMinutes}
                    </span>
                    <span className="text-xs text-slate-400 ml-1">mins</span>
                  </div>
                </div>

                <div className="space-y-2.5 text-xs text-slate-300">
                  <div className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span>Real-time position updates on your mobile screen.</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span>Audio & visual alerts when your token is called.</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span>Ability to cancel anytime without penalty.</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 text-center text-slate-500">
              Select a department to view real-time estimates.
            </div>
          )}

          <div className="bg-white p-5 rounded-2xl border border-slate-200 text-xs text-slate-500 space-y-2">
            <h4 className="font-semibold text-slate-800 flex items-center space-x-1.5">
              <Shield className="w-4 h-4 text-sky-600" />
              <span>Queue Etiquette & Privacy</span>
            </h4>
            <p>
              Your contact details are encrypted and never shown publicly on reception screens. Only your anonymous token number (e.g. QG-REG-016) is broadcast.
            </p>
          </div>
        </div>
      </form>
    </div>
  );
};
