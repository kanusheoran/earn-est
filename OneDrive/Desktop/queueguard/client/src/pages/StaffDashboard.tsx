import React, { useState, useEffect } from 'react';
import { 
  Play, 
  CheckCircle2, 
  SkipForward, 
  RotateCcw, 
  Pause, 
  Users, 
  Clock, 
  AlertCircle,
  Building2,
  Calendar,
  Volume2
} from 'lucide-react';
import { QueueEntry, ServiceCounter } from '../types';
import { apiRequest } from '../services/api';
import { getSocket } from '../services/socket';
import { useAuth } from '../context/AuthContext';

export const StaffDashboard: React.FC = () => {
  const { user } = useAuth();
  const [counter, setCounter] = useState<ServiceCounter | null>(null);
  const [currentCustomer, setCurrentCustomer] = useState<QueueEntry | null>(null);
  const [waitingQueue, setWaitingQueue] = useState<QueueEntry[]>([]);
  const [history, setHistory] = useState<QueueEntry[]>([]);
  
  const [loading, setLoading] = useState<boolean>(true);
  const [actionLoading, setActionLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStaffQueue = async () => {
    try {
      const data = await apiRequest('/staff/queue');
      setCounter(data.counter);
      setCurrentCustomer(data.currentCustomer);
      setWaitingQueue(data.waitingQueue || []);
      setHistory(data.history || []);
    } catch (err: any) {
      setError(err.message || 'Failed to load counter queue');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaffQueue();
  }, []);

  // Listen to live socket events
  useEffect(() => {
    const socket = getSocket();
    const handleUpdate = () => {
      fetchStaffQueue();
    };

    socket.on('queue:updated', handleUpdate);
    return () => {
      socket.off('queue:updated', handleUpdate);
    };
  }, []);

  // Staff Actions
  const handleCallNext = async () => {
    if (!counter) return;
    setActionLoading(true);
    setError(null);
    try {
      await apiRequest('/staff/queue/call-next', {
        method: 'POST',
        body: JSON.stringify({ counterId: counter.id, departmentId: counter.departmentId })
      });
      await fetchStaffQueue();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleStartService = async () => {
    if (!currentCustomer) return;
    setActionLoading(true);
    setError(null);
    try {
      await apiRequest(`/staff/queue/${currentCustomer.id}/start`, {
        method: 'POST'
      });
      await fetchStaffQueue();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleCompleteService = async () => {
    if (!currentCustomer) return;
    setActionLoading(true);
    setError(null);
    try {
      await apiRequest(`/staff/queue/${currentCustomer.id}/complete`, {
        method: 'POST',
        body: JSON.stringify({ notes: 'Completed at service counter' })
      });
      await fetchStaffQueue();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleSkip = async (returnToQueue: boolean) => {
    if (!currentCustomer) return;
    setActionLoading(true);
    setError(null);
    try {
      await apiRequest(`/staff/queue/${currentCustomer.id}/skip`, {
        method: 'POST',
        body: JSON.stringify({ returnToQueue })
      });
      await fetchStaffQueue();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleRecall = async () => {
    if (!currentCustomer) return;
    try {
      await apiRequest(`/staff/queue/${currentCustomer.id}/recall`, { method: 'POST' });
      alert(`Customer ${currentCustomer.tokenNumber} has been recalled.`);
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleTogglePause = async () => {
    if (!counter) return;
    try {
      await apiRequest(`/staff/counters/${counter.id}/toggle-pause`, { method: 'POST' });
      await fetchStaffQueue();
    } catch (err: any) {
      alert(err.message);
    }
  };

  if (loading) {
    return <div className="p-12 text-center text-slate-500">Loading counter workstation...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Counter Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-3">
            <span className="px-3 py-1 bg-sky-100 text-sky-800 font-bold rounded-lg text-sm font-mono">
              {counter?.counterNumber || 'Counter'}
            </span>
            <h1 className="text-2xl font-bold text-slate-900">
              {counter?.department?.name || 'Department Workstation'}
            </h1>
            {counter?.isPaused && (
              <span className="px-2.5 py-0.5 bg-rose-100 text-rose-800 text-xs font-semibold rounded-full">
                PAUSED
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Logged in as {user?.name} • Service target: ~{counter?.department?.estimatedServiceMinutes || 10}m per customer
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={handleTogglePause}
            className={`px-4 py-2 rounded-xl text-xs font-semibold border flex items-center space-x-1.5 transition-colors ${
              counter?.isPaused 
                ? 'bg-emerald-600 text-white border-emerald-600 hover:bg-emerald-700' 
                : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
            }`}
          >
            <Pause className="w-3.5 h-3.5" />
            <span>{counter?.isPaused ? 'Resume Desk' : 'Pause Desk'}</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 text-sm rounded-xl flex items-center space-x-2">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Main Grid: Active Serving Customer & Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Active Customer Desk */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">Active Serving Customer</span>
              <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase ${
                currentCustomer?.status === 'SERVING' ? 'bg-emerald-500 text-white' : 'bg-amber-400 text-slate-900'
              }`}>
                {currentCustomer?.status || 'IDLE'}
              </span>
            </div>

            <div className="p-8 text-center">
              {currentCustomer ? (
                <div className="space-y-4">
                  <div className="text-5xl sm:text-6xl font-black font-mono tracking-tight text-slate-900">
                    {currentCustomer.tokenNumber}
                  </div>
                  <h3 className="text-xl font-bold text-slate-800">{currentCustomer.customerName}</h3>
                  <div className="inline-flex items-center space-x-2 px-3 py-1 bg-slate-100 rounded-full text-xs text-slate-600">
                    <span>Priority: <strong>{currentCustomer.priority}</strong></span>
                    {currentCustomer.customerPhone && (
                      <>
                        <span>•</span>
                        <span>{currentCustomer.customerPhone}</span>
                      </>
                    )}
                  </div>

                  {currentCustomer.notes && (
                    <p className="text-xs text-slate-500 italic max-w-md mx-auto bg-slate-50 p-3 rounded-lg border">
                      "{currentCustomer.notes}"
                    </p>
                  )}

                  {/* Actions for current customer */}
                  <div className="pt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {currentCustomer.status === 'CALLED' ? (
                      <button
                        onClick={handleStartService}
                        disabled={actionLoading}
                        className="col-span-2 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl text-sm shadow transition-colors flex items-center justify-center space-x-1.5"
                      >
                        <Play className="w-4 h-4 fill-white" />
                        <span>Start Service</span>
                      </button>
                    ) : (
                      <button
                        onClick={handleCompleteService}
                        disabled={actionLoading}
                        className="col-span-2 py-3 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-xl text-sm shadow transition-colors flex items-center justify-center space-x-1.5"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Complete Service</span>
                      </button>
                    )}

                    <button
                      onClick={handleRecall}
                      title="Announce token again on public monitors"
                      className="py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs flex items-center justify-center space-x-1 transition-colors"
                    >
                      <Volume2 className="w-4 h-4" />
                      <span>Recall</span>
                    </button>

                    <button
                      onClick={() => handleSkip(false)}
                      disabled={actionLoading}
                      title="Mark customer absent and skip"
                      className="py-3 bg-rose-50 hover:bg-rose-100 text-rose-700 font-semibold rounded-xl text-xs flex items-center justify-center space-x-1 transition-colors"
                    >
                      <SkipForward className="w-4 h-4" />
                      <span>Skip</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="py-12 space-y-4">
                  <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto">
                    <Users className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-800">Counter is currently free</h3>
                    <p className="text-xs text-slate-500">Ready to call the next waiting customer.</p>
                  </div>

                  <button
                    onClick={handleCallNext}
                    disabled={actionLoading || waitingQueue.length === 0}
                    className="px-8 py-3.5 bg-sky-600 hover:bg-sky-700 disabled:opacity-50 text-white font-bold rounded-xl shadow-lg shadow-sky-600/20 text-sm transition-all"
                  >
                    {waitingQueue.length === 0 ? 'No Customers Waiting' : 'Call Next Customer'}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Recent Counter History */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 mb-4">Recent Customers Handled</h3>
            {history.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-4">No tickets completed yet during this session.</p>
            ) : (
              <div className="divide-y divide-slate-100 text-xs">
                {history.map((item) => (
                  <div key={item.id} className="py-2.5 flex items-center justify-between">
                    <div>
                      <span className="font-mono font-bold text-slate-800">{item.tokenNumber}</span>
                      <span className="ml-2 text-slate-600">{item.customerName}</span>
                    </div>
                    <div className="flex items-center space-x-3 text-slate-500">
                      <span>{item.serviceDurationSeconds ? `${Math.round(item.serviceDurationSeconds / 60)} mins` : '-'}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        item.status === 'SERVED' ? 'bg-emerald-50 text-emerald-700' : 'bg-orange-50 text-orange-700'
                      }`}>
                        {item.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Waiting Line / Up Next */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-sky-600" />
                <h3 className="font-bold text-slate-900">Waiting Line</h3>
              </div>
              <span className="px-2.5 py-1 bg-sky-50 text-sky-700 font-bold text-xs rounded-full">
                {waitingQueue.length} in queue
              </span>
            </div>

            <div className="divide-y divide-slate-100 mt-2 max-h-[500px] overflow-y-auto">
              {waitingQueue.length === 0 ? (
                <div className="py-12 text-center text-xs text-slate-400">
                  The waiting line is clear.
                </div>
              ) : (
                waitingQueue.map((item, idx) => (
                  <div key={item.id} className="py-3 flex items-center justify-between">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-bold text-slate-400">#{idx + 1}</span>
                        <span className="font-mono font-bold text-sm text-slate-900">{item.tokenNumber}</span>
                        {item.priority !== 'STANDARD' && (
                          <span className="px-1.5 py-0.2 bg-purple-100 text-purple-700 text-[10px] font-bold rounded">
                            {item.priority}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">{item.customerName}</p>
                    </div>

                    <div className="text-right text-xs text-slate-400">
                      <span>{new Date(item.joinedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
