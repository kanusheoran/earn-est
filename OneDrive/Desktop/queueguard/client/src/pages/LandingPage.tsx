import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Clock, 
  ArrowRight, 
  ShieldCheck, 
  CheckCircle2, 
  Building2, 
  Bell, 
  Sparkles,
  Smartphone,
  ChevronRight
} from 'lucide-react';
import { Department } from '../types';
import { apiRequest } from '../services/api';

interface LandingPageProps {
  onNavigate: (view: string, data?: any) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [lookupToken, setLookupToken] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDepts() {
      try {
        const data = await apiRequest<Department[]>('/departments');
        setDepartments(data);
      } catch (err) {
        console.error('Failed to load departments', err);
      } finally {
        setLoading(false);
      }
    }
    fetchDepts();
  }, []);

  const handleLookup = (e: React.FormEvent) => {
    e.preventDefault();
    if (lookupToken.trim()) {
      onNavigate('track', lookupToken.trim());
    }
  };

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-sky-50/70 via-white to-slate-50 border-b border-slate-200 py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Value Prop */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center space-x-2 px-3 py-1 bg-sky-100 text-sky-800 rounded-full text-xs font-semibold tracking-wide uppercase">
                <Sparkles className="w-3.5 h-3.5 text-sky-600" />
                <span>Next-Gen Smart Queue Management</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.1]">
                End the chaos of physical queues with <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-600 to-indigo-600">QueueGuard</span>
              </h1>

              <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto lg:mx-0">
                Seamless digital ticketing, transparent wait-time estimations, real-time live displays, and high-efficiency counter management for customer-first organizations.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <button
                  onClick={() => onNavigate('join')}
                  className="w-full sm:w-auto px-8 py-3.5 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-xl shadow-lg shadow-sky-600/25 flex items-center justify-center space-x-2 transition-all hover:-translate-y-0.5"
                >
                  <span>Join a Service Queue</span>
                  <ArrowRight className="w-5 h-5" />
                </button>

                <button
                  onClick={() => onNavigate('display')}
                  className="w-full sm:w-auto px-6 py-3.5 bg-white hover:bg-slate-50 text-slate-700 font-semibold rounded-xl border border-slate-300 shadow-sm flex items-center justify-center space-x-2 transition-colors"
                >
                  <span>Open Live TV Display</span>
                </button>
              </div>

              {/* Token Quick Lookup */}
              <div className="pt-6 border-t border-slate-200/80 max-w-md mx-auto lg:mx-0">
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">Already have a ticket token?</p>
                <form onSubmit={handleLookup} className="flex gap-2">
                  <input
                    type="text"
                    value={lookupToken}
                    onChange={(e) => setLookupToken(e.target.value)}
                    placeholder="Enter Token e.g. QG-REG-016"
                    className="flex-1 px-4 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500 uppercase placeholder:normal-case font-mono"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-sm font-medium transition-colors"
                  >
                    Track
                  </button>
                </form>
              </div>
            </div>

            {/* Right Column: Live Status Highlights */}
            <div className="lg:col-span-5">
              <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xl p-6 relative">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div className="flex items-center space-x-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    <h3 className="font-semibold text-slate-900">Live Campus & Center Queues</h3>
                  </div>
                  <span className="text-xs font-medium text-slate-500">Auto-updating</span>
                </div>

                <div className="divide-y divide-slate-100 mt-2">
                  {loading ? (
                    <div className="py-8 text-center text-sm text-slate-400">Loading active services...</div>
                  ) : departments.slice(0, 4).map((dept) => (
                    <div key={dept.id} className="py-3.5 flex items-center justify-between">
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="px-1.5 py-0.5 text-xs font-mono font-bold bg-slate-100 text-slate-700 rounded">
                            {dept.code}
                          </span>
                          <span className="text-sm font-medium text-slate-900">{dept.name}</span>
                        </div>
                        <div className="flex items-center space-x-3 text-xs text-slate-500 mt-1">
                          <span className="flex items-center space-x-1">
                            <Clock className="w-3 h-3 text-slate-400" />
                            <span>~{dept.estimatedServiceMinutes}m service</span>
                          </span>
                          <span>•</span>
                          <span>{dept.activeCountersCount} active desks</span>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-sky-50 text-sky-700 border border-sky-100">
                          {dept.waitingCount} waiting
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between items-center">
                  <span className="text-xs text-slate-500">Real-time WebSocket connection</span>
                  <button 
                    onClick={() => onNavigate('join')}
                    className="text-xs font-semibold text-sky-600 hover:text-sky-700 flex items-center space-x-1"
                  >
                    <span>Choose a service</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Feature Pillar Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">Engineered for service speed & operational control</h2>
          <p className="mt-2 text-slate-600">Eliminating crowded waiting halls with intelligent token allocation and real-time alerts.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-sky-100 text-sky-700 rounded-lg flex items-center justify-center mb-4">
              <Smartphone className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Effortless Digital Check-in</h3>
            <p className="text-sm text-slate-600">
              Customers scan a QR or join directly on their phones. They receive a unique token and can wander freely without losing their place.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-indigo-100 text-indigo-700 rounded-lg flex items-center justify-center mb-4">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Dynamic Waiting Estimates</h3>
            <p className="text-sm text-slate-600">
              Wait times adapt dynamically using actual historical throughput and active counter counts rather than naive static countdowns.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-purple-100 text-purple-700 rounded-lg flex items-center justify-center mb-4">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Concurrency & Priority Engine</h3>
            <p className="text-sm text-slate-600">
              Atomic transactional state transitions ensure no two staff call the same customer. Supports VIP, accessibility, and urgent triage.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
