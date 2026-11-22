import React, { useState, useEffect } from 'react';
import { 
  Clock, 
  Users, 
  Building2, 
  CheckCircle2, 
  AlertTriangle, 
  Bell, 
  XCircle, 
  RefreshCw, 
  Volume2, 
  ArrowLeft,
  Share2,
  Copy
} from 'lucide-react';
import { QueueEntry, TrackingData } from '../types';
import { apiRequest } from '../services/api';
import { getSocket } from '../services/socket';

interface TrackQueuePageProps {
  tokenParam?: string;
  onNavigate: (view: string) => void;
}

export const TrackQueuePage: React.FC<TrackQueuePageProps> = ({ tokenParam, onNavigate }) => {
  const [ticketInput, setTicketInput] = useState<string>(tokenParam || '');
  const [entry, setEntry] = useState<QueueEntry | null>(null);
  const [tracking, setTracking] = useState<TrackingData | null>(null);
  const [currentServingToken, setCurrentServingToken] = useState<string | null>(null);
  const [currentServingCounter, setCurrentServingCounter] = useState<string | null>(null);
  const [notifications, setNotifications] = useState<any[]>([]);

  const [loading, setLoading] = useState<boolean>(Boolean(tokenParam));
  const [cancelling, setCancelling] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date());

  const fetchTicket = async (tokenToFetch: string) => {
    if (!tokenToFetch.trim()) return;
    setLoading(true);
    setError(null);

    try {
      const data = await apiRequest(`/queues/${tokenToFetch.trim()}`);
      setEntry(data.entry);
      setTracking(data.tracking);
      setCurrentServingToken(data.currentServingToken);
      setCurrentServingCounter(data.currentServingCounter);
      setNotifications(data.notifications || []);
      setLastRefreshed(new Date());

      // If called or serving, play chime sound if browser allows
      if (data.entry.status === 'CALLED') {
        playNotificationAudio();
      }
    } catch (err: any) {
      setError(err.message || 'Ticket not found. Please verify the token.');
      setEntry(null);
    } finally {
      setLoading(false);
    }
  };

  const playNotificationAudio = () => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc.frequency.setValueAtTime(880, ctx.currentTime + 0.15); // A5
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.5);
    } catch (e) {
      // Audio context might require user interaction
    }
  };

  useEffect(() => {
    if (tokenParam) {
      fetchTicket(tokenParam);
    }
  }, [tokenParam]);

  // Real-time Socket.IO listener for live updates
  useEffect(() => {
    const socket = getSocket();

    if (entry?.id) {
      socket.emit('join:ticket', entry.id);
    }
    if (entry?.departmentId) {
      socket.emit('join:department', entry.departmentId);
    }

    const handleTicketCalled = (payload: any) => {
      if (entry && payload.tokenNumber === entry.tokenNumber) {
        playNotificationAudio();
        // re-fetch fresh state
        fetchTicket(entry.secretToken || entry.tokenNumber);
      }
    };

    const handleQueueUpdate = () => {
      if (entry) {
        fetchTicket(entry.secretToken || entry.tokenNumber);
      }
    };

    socket.on('ticket:called', handleTicketCalled);
    socket.on('queue:updated', handleQueueUpdate);

    return () => {
      socket.off('ticket:called', handleTicketCalled);
      socket.off('queue:updated', handleQueueUpdate);
    };
  }, [entry?.id, entry?.departmentId]);

  const handleCancel = async () => {
    if (!entry) return;
    if (!window.confirm('Are you sure you want to cancel your queue ticket?')) return;

    setCancelling(true);
    try {
      await apiRequest(`/queues/${entry.id}/cancel`, {
        method: 'POST',
        body: JSON.stringify({ secretToken: entry.secretToken })
      });
      fetchTicket(entry.secretToken);
    } catch (err: any) {
      alert(err.message || 'Failed to cancel ticket');
    } finally {
      setCancelling(false);
    }
  };

  const handleCopyLink = () => {
    if (!entry) return;
    const url = `${window.location.origin}?track=${entry.secretToken}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  // Status badges & styling
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'WAITING':
        return <span className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full font-semibold text-xs uppercase tracking-wider">In Waiting Line</span>;
      case 'CALLED':
        return <span className="px-3 py-1 bg-sky-100 text-sky-800 rounded-full font-semibold text-xs uppercase tracking-wider animate-pulse">Now Being Called!</span>;
      case 'SERVING':
        return <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full font-semibold text-xs uppercase tracking-wider">Service In Progress</span>;
      case 'SERVED':
        return <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full font-semibold text-xs uppercase tracking-wider">Service Completed</span>;
      case 'SKIPPED':
        return <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full font-semibold text-xs uppercase tracking-wider">Ticket Skipped</span>;
      case 'CANCELLED':
        return <span className="px-3 py-1 bg-rose-100 text-rose-800 rounded-full font-semibold text-xs uppercase tracking-wider">Cancelled</span>;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 sm:py-12">
      {/* Navigation & Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => onNavigate('landing')}
          className="inline-flex items-center space-x-1.5 text-sm text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </button>

        {entry && (
          <button
            onClick={() => fetchTicket(entry.secretToken || entry.tokenNumber)}
            className="inline-flex items-center space-x-1 text-xs text-sky-600 hover:text-sky-700 font-medium"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Updated {lastRefreshed.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
          </button>
        )}
      </div>

      {/* Lookup Bar if not loaded */}
      {!entry && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm mb-6">
          <h2 className="text-lg font-bold text-slate-900 mb-2">Track Queue Position</h2>
          <p className="text-xs text-slate-500 mb-4">
            Enter your token number (e.g. QG-REG-016) or the secure tracking key from your confirmation.
          </p>
          <form 
            onSubmit={(e) => { e.preventDefault(); fetchTicket(ticketInput); }}
            className="flex gap-2"
          >
            <input
              type="text"
              value={ticketInput}
              onChange={(e) => setTicketInput(e.target.value)}
              placeholder="e.g. QG-REG-016"
              className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-mono uppercase placeholder:normal-case focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-medium rounded-xl text-sm transition-colors"
            >
              {loading ? 'Searching...' : 'Track'}
            </button>
          </form>

          {error && (
            <div className="mt-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </div>
      )}

      {/* Ticket Card */}
      {entry && (
        <div className="space-y-6">
          {/* Main Status Ticket Presentation */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-lg overflow-hidden">
            {/* Top header banner */}
            <div className={`p-6 sm:p-8 text-center text-white ${
              entry.status === 'CALLED' 
                ? 'bg-gradient-to-r from-sky-600 to-indigo-600' 
                : entry.status === 'SERVING'
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600'
                : 'bg-slate-900'
            }`}>
              <div className="inline-block mb-3">
                {getStatusBadge(entry.status)}
              </div>

              <div className="text-4xl sm:text-6xl font-black font-mono tracking-wider mt-1">
                {entry.tokenNumber}
              </div>

              <p className="text-sm sm:text-base font-medium opacity-90 mt-2">
                {entry.customerName}
              </p>

              <div className="inline-flex items-center space-x-1.5 px-3 py-1 bg-white/10 rounded-full text-xs font-mono mt-3">
                <Building2 className="w-3.5 h-3.5" />
                <span>{entry.department?.name || 'Service Department'}</span>
              </div>
            </div>

            {/* Calling Alert Banner when CALLED */}
            {entry.status === 'CALLED' && (
              <div className="p-4 bg-amber-400 text-amber-950 text-center font-bold text-sm sm:text-base flex items-center justify-center space-x-2 animate-bounce">
                <Volume2 className="w-5 h-5 flex-shrink-0" />
                <span>Please proceed to {entry.counterNumber || 'the assigned service desk'} immediately!</span>
              </div>
            )}

            {/* Waiting Metrics Grid */}
            {entry.status === 'WAITING' && tracking && (
              <div className="p-6 sm:p-8 bg-slate-50/70 border-b border-slate-100">
                <div className="grid grid-cols-2 gap-6 text-center">
                  <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                    <span className="text-xs font-medium text-slate-500 uppercase tracking-wider block">
                      People Ahead of You
                    </span>
                    <span className="text-4xl font-extrabold text-slate-900 mt-1 block">
                      {tracking.customersAhead}
                    </span>
                    <span className="text-xs text-slate-400 mt-1 block">
                      Queue Position: #{tracking.position}
                    </span>
                  </div>

                  <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                    <span className="text-xs font-medium text-slate-500 uppercase tracking-wider block">
                      Estimated Wait Time
                    </span>
                    <span className="text-4xl font-extrabold text-sky-600 mt-1 block">
                      ~{tracking.estimatedMinutes}
                    </span>
                    <span className="text-xs text-slate-400 mt-1 block">
                      Minutes remaining
                    </span>
                  </div>
                </div>

                <p className="text-xs text-center text-slate-400 mt-4">
                  Estimates account for active serving counters ({tracking.activeCounters}) and rolling average service speed.
                </p>
              </div>
            )}

            {/* Serving / Current Counter Details */}
            <div className="p-6 sm:p-8 space-y-4">
              <div className="flex items-center justify-between text-sm py-2 border-b border-slate-100">
                <span className="text-slate-500">Currently Calling at Desk:</span>
                <span className="font-semibold text-slate-900 font-mono">
                  {currentServingToken ? `${currentServingToken} (${currentServingCounter || 'Desk'})` : 'None'}
                </span>
              </div>

              <div className="flex items-center justify-between text-sm py-2 border-b border-slate-100">
                <span className="text-slate-500">Joined Queue At:</span>
                <span className="font-semibold text-slate-900">
                  {new Date(entry.joinedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>

              {entry.calledAt && (
                <div className="flex items-center justify-between text-sm py-2 border-b border-slate-100">
                  <span className="text-slate-500">Called To Counter At:</span>
                  <span className="font-semibold text-slate-900">
                    {new Date(entry.calledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              )}

              {/* Share and Bookmark bar */}
              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleCopyLink}
                  className="flex-1 py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl flex items-center justify-center space-x-1.5 transition-colors"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>{copied ? 'Tracking URL Copied!' : 'Copy Tracking Link'}</span>
                </button>

                {['WAITING', 'CALLED'].includes(entry.status) && (
                  <button
                    onClick={handleCancel}
                    disabled={cancelling}
                    className="py-2.5 px-4 bg-white hover:bg-rose-50 text-rose-600 border border-rose-200 text-xs font-semibold rounded-xl flex items-center justify-center space-x-1.5 transition-colors"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    <span>{cancelling ? 'Cancelling...' : 'Leave Queue'}</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* In-App Notifications History */}
          {notifications.length > 0 && (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2 mb-3">
                <Bell className="w-4 h-4 text-sky-600" />
                <span>Ticket Notifications</span>
              </h3>
              <div className="divide-y divide-slate-100">
                {notifications.map((n) => (
                  <div key={n.id} className="py-2.5 text-xs">
                    <div className="flex justify-between font-semibold text-slate-800">
                      <span>{n.title}</span>
                      <span className="text-slate-400 font-normal">
                        {new Date(n.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-slate-600 mt-0.5">{n.message}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
