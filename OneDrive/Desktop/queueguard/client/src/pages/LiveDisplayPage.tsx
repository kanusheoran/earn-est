import React, { useState, useEffect } from 'react';
import { Monitor, Volume2, Building2, Clock, Users } from 'lucide-react';
import { apiRequest } from '../services/api';
import { getSocket } from '../services/socket';

export const LiveDisplayPage: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [loading, setLoading] = useState<boolean>(true);

  const fetchDisplay = async () => {
    try {
      const res = await apiRequest('/display');
      setData(res);
    } catch (err) {
      console.error('Failed to fetch display data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDisplay();

    // Clock ticker every second
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Real-time socket event listener
  useEffect(() => {
    const socket = getSocket();
    const handleUpdate = () => {
      fetchDisplay();
    };

    socket.on('queue:updated', handleUpdate);
    return () => {
      socket.off('queue:updated', handleUpdate);
    };
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 sm:p-10 flex flex-col justify-between select-none">
      {/* Top Header / Clock & Branding */}
      <div className="flex items-center justify-between pb-8 border-b border-slate-800">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-sky-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-sky-600/30">
            <Monitor className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-3xl font-black tracking-tight text-white">
              Queue<span className="text-sky-400">Guard</span> Live Reception
            </h1>
            <p className="text-xs text-slate-400 uppercase tracking-widest font-mono">
              Smart Flow Management System
            </p>
          </div>
        </div>

        <div className="text-right">
          <div className="text-3xl sm:text-4xl font-mono font-bold text-sky-400">
            {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
          </div>
          <div className="text-xs text-slate-400 uppercase tracking-wider mt-0.5">
            {currentTime.toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' })}
          </div>
        </div>
      </div>

      {/* Main Display Body */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 my-8 flex-1">
        {/* Left Column: Currently Called / Serving (Dominant TV element) */}
        <div className="lg:col-span-8 flex flex-col space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold tracking-wide uppercase text-slate-300 flex items-center space-x-2">
              <span className="w-3 h-3 rounded-full bg-emerald-400 animate-ping"></span>
              <span>Now Serving & Called Tokens</span>
            </h2>
            <span className="text-xs font-mono text-slate-500">PROCEED TO DESK</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1">
            {data?.activeCalls?.length > 0 ? (
              data.activeCalls.map((item: any, idx: number) => {
                const isTop = idx === 0;
                return (
                  <div
                    key={item.id}
                    className={`rounded-3xl p-6 flex flex-col justify-between border transition-all ${
                      isTop
                        ? 'bg-gradient-to-br from-sky-900/60 to-indigo-950/80 border-sky-500 shadow-2xl ring-2 ring-sky-500/30'
                        : 'bg-slate-900/80 border-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-1 bg-white/10 rounded-lg text-xs font-mono text-sky-300">
                        {item.departmentCode}
                      </span>
                      <span className={`px-2.5 py-1 rounded text-xs font-bold uppercase tracking-wider ${
                        item.status === 'CALLED' ? 'bg-amber-400 text-slate-950 animate-pulse' : 'bg-emerald-500 text-white'
                      }`}>
                        {item.status}
                      </span>
                    </div>

                    <div className="my-4 text-center">
                      <div className="text-4xl sm:text-6xl font-black font-mono tracking-wider text-white">
                        {item.tokenNumber}
                      </div>
                      <div className="text-sm font-semibold text-slate-300 mt-1 truncate">
                        {item.customerName}
                      </div>
                    </div>

                    <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                      <span className="text-xs text-slate-400">Assigned Station:</span>
                      <span className="text-lg font-black font-mono text-amber-300">
                        {item.counterNumber}
                      </span>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="col-span-2 bg-slate-900/40 rounded-3xl border border-dashed border-slate-800 flex items-center justify-center p-12 text-slate-500 text-lg">
                No active calls right now. Counter desks will appear here when called.
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Queue Summary by Department & Recent Served */}
        <div className="lg:col-span-4 flex flex-col space-y-6">
          {/* Department Queue Counts */}
          <div className="bg-slate-900/90 rounded-3xl border border-slate-800 p-6 shadow-xl space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center space-x-2">
              <Users className="w-4 h-4 text-sky-400" />
              <span>Waiting by Service Department</span>
            </h3>

            <div className="divide-y divide-slate-800">
              {data?.departments?.map((dept: any) => (
                <div key={dept.code} className="py-3 flex items-center justify-between">
                  <div>
                    <span className="font-semibold text-sm text-slate-200">{dept.name}</span>
                    <span className="block text-[10px] text-slate-400 font-mono">{dept.code}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-xl font-bold font-mono text-sky-400">
                      {dept.waitingCount}
                    </span>
                    <span className="text-[10px] text-slate-500 block">waiting</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recently Completed */}
          <div className="bg-slate-900/50 rounded-3xl border border-slate-800/80 p-6 flex-1 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Recently Served
            </h3>
            <div className="space-y-2">
              {data?.recentServed?.map((s: any) => (
                <div key={s.tokenNumber} className="flex items-center justify-between text-xs py-1.5 border-b border-slate-800/50">
                  <span className="font-mono font-bold text-slate-300">{s.tokenNumber}</span>
                  <span className="text-slate-500">{s.counterNumber}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer / Public Notice */}
      <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
        <p>
          Need to join the queue? Scan the reception QR code or visit this portal on your phone.
        </p>
        <span className="font-mono text-sky-400">Auto-synchronized with QueueGuard Server</span>
      </div>
    </div>
  );
};
