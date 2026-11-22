import React, { useState, useEffect } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line
} from 'recharts';
import { 
  Users, 
  Clock, 
  CheckCircle2, 
  TrendingDown, 
  Building2, 
  Plus, 
  ShieldCheck, 
  Activity,
  Layers,
  Settings
} from 'lucide-react';
import { Department, ServiceCounter, User } from '../types';
import { apiRequest } from '../services/api';
import { getSocket } from '../services/socket';

export const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'analytics' | 'departments' | 'counters' | 'staff'>('analytics');
  
  // Analytics State
  const [analytics, setAnalytics] = useState<any>(null);
  
  // Entities State
  const [departments, setDepartments] = useState<Department[]>([]);
  const [counters, setCounters] = useState<ServiceCounter[]>([]);
  const [staffList, setStaffList] = useState<User[]>([]);

  // Modals & form state
  const [showDeptModal, setShowDeptModal] = useState(false);
  const [showCounterModal, setShowCounterModal] = useState(false);
  const [showStaffModal, setShowStaffModal] = useState(false);

  // Form inputs
  const [newDept, setNewDept] = useState({ name: '', code: '', description: '', estimatedMinutes: 10, maxCapacity: 200 });
  const [newCounter, setNewCounter] = useState({ counterNumber: '', departmentId: '' });
  const [newStaff, setNewStaff] = useState({ name: '', email: '', password: '', role: 'STAFF', counterId: '' });

  const [loading, setLoading] = useState(true);

  const fetchAllData = async () => {
    try {
      const [analyticsData, deptsData, countersData, staffData] = await Promise.all([
        apiRequest('/admin/analytics'),
        apiRequest('/departments'),
        apiRequest('/admin/counters'),
        apiRequest('/admin/staff')
      ]);

      setAnalytics(analyticsData);
      setDepartments(deptsData);
      setCounters(countersData);
      setStaffList(staffData);
    } catch (err) {
      console.error('Failed to load admin data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  // Listen to socket updates to update charts live
  useEffect(() => {
    const socket = getSocket();
    const handleUpdate = () => {
      fetchAllData();
    };

    socket.on('queue:updated', handleUpdate);
    return () => {
      socket.off('queue:updated', handleUpdate);
    };
  }, []);

  const handleCreateDept = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiRequest('/admin/departments', {
        method: 'POST',
        body: JSON.stringify({
          name: newDept.name,
          code: newDept.code,
          description: newDept.description,
          estimatedServiceMinutes: Number(newDept.estimatedMinutes),
          maxDailyCapacity: Number(newDept.maxCapacity)
        })
      });
      setShowDeptModal(false);
      setNewDept({ name: '', code: '', description: '', estimatedMinutes: 10, maxCapacity: 200 });
      fetchAllData();
    } catch (err: any) {
      alert(err.message || 'Failed to create department');
    }
  };

  const handleCreateCounter = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiRequest('/admin/counters', {
        method: 'POST',
        body: JSON.stringify(newCounter)
      });
      setShowCounterModal(false);
      setNewCounter({ counterNumber: '', departmentId: '' });
      fetchAllData();
    } catch (err: any) {
      alert(err.message || 'Failed to create counter');
    }
  };

  const handleCreateStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiRequest('/admin/staff', {
        method: 'POST',
        body: JSON.stringify(newStaff)
      });
      setShowStaffModal(false);
      setNewStaff({ name: '', email: '', password: '', role: 'STAFF', counterId: '' });
      fetchAllData();
    } catch (err: any) {
      alert(err.message || 'Failed to create staff account');
    }
  };

  if (loading) {
    return <div className="p-12 text-center text-slate-500">Loading Administrative Suite...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Administrator Control Center
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Real-time analytics, queue configurations, desk allocation, and service capacity.
          </p>
        </div>

        {/* Tab selection */}
        <div className="flex bg-slate-100 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'analytics' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Analytics & Reports
          </button>
          <button
            onClick={() => setActiveTab('departments')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'departments' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Departments ({departments.length})
          </button>
          <button
            onClick={() => setActiveTab('counters')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'counters' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Desks ({counters.length})
          </button>
          <button
            onClick={() => setActiveTab('staff')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'staff' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Staff ({staffList.length})
          </button>
        </div>
      </div>

      {/* TAB 1: Analytics & Reports */}
      {activeTab === 'analytics' && analytics && (
        <div className="space-y-8">
          {/* Key KPI Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider">Served Today</span>
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              </div>
              <span className="text-3xl font-extrabold text-slate-900">
                {analytics.summary.servedTodayCount}
              </span>
              <p className="text-xs text-slate-400 mt-1">Total completed tickets</p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider">Active in System</span>
                <Users className="w-5 h-5 text-sky-500" />
              </div>
              <span className="text-3xl font-extrabold text-sky-600">
                {analytics.summary.activeEntriesCount}
              </span>
              <p className="text-xs text-slate-400 mt-1">Waiting or currently being served</p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider">Avg Wait Duration</span>
                <Clock className="w-5 h-5 text-amber-500" />
              </div>
              <span className="text-3xl font-extrabold text-slate-900">
                {analytics.summary.avgWaitMinutes}m
              </span>
              <p className="text-xs text-slate-400 mt-1">From join to counter call</p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider">Abandonment Rate</span>
                <TrendingDown className="w-5 h-5 text-rose-500" />
              </div>
              <span className="text-3xl font-extrabold text-slate-900">
                {analytics.summary.abandonmentRate}%
              </span>
              <p className="text-xs text-slate-400 mt-1">Cancelled or skipped entries</p>
            </div>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Department Volume Bar Chart */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <h3 className="text-base font-bold text-slate-900 mb-4">Traffic Volume by Department</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={analytics.departmentVolumes}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="code" />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Bar dataKey="served" fill="#0284c7" name="Served" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="waiting" fill="#f59e0b" name="Waiting" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Hourly Traffic Trend Line Chart */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <h3 className="text-base font-bold text-slate-900 mb-4">Today's Hourly Arrival Curve</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={analytics.hourlyTraffic}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="hour" />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Line type="monotone" dataKey="count" stroke="#6366f1" strokeWidth={3} name="Customer Arrivals" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Real-time System Audit Events */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="text-base font-bold text-slate-900 mb-4">Live System Event Log</h3>
            <div className="divide-y divide-slate-100 text-xs">
              {analytics.recentEvents.map((evt: any) => (
                <div key={evt.id} className="py-2.5 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="font-mono font-bold text-slate-800">
                      {evt.queueEntry?.tokenNumber}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
                      {evt.toStatus}
                    </span>
                    <span className="text-slate-600">{evt.note}</span>
                  </div>
                  <span className="text-slate-400">
                    {new Date(evt.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Departments Management */}
      {activeTab === 'departments' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-900">Service Departments</h3>
            <button
              onClick={() => setShowDeptModal(true)}
              className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add Department</span>
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {departments.map((d) => (
              <div key={d.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="px-2 py-0.5 bg-slate-100 text-slate-800 font-mono font-bold text-xs rounded">
                      {d.code}
                    </span>
                    <h4 className="font-bold text-slate-900 text-sm">{d.name}</h4>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      d.isActive ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {d.isActive ? 'ACTIVE' : 'INACTIVE'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">{d.description}</p>
                </div>

                <div className="flex items-center space-x-6 text-xs text-slate-600">
                  <div>
                    <span className="text-slate-400 block">Est. Time</span>
                    <span className="font-semibold">{d.estimatedServiceMinutes} mins</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Capacity</span>
                    <span className="font-semibold">{d.maxDailyCapacity}/day</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Hours</span>
                    <span className="font-semibold">{d.openingTime} - {d.closingTime}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: Counter Management */}
      {activeTab === 'counters' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-900">Service Desks & Counters</h3>
            <button
              onClick={() => setShowCounterModal(true)}
              className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add Counter</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {counters.map((c) => (
              <div key={c.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-slate-900">{c.counterNumber}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    c.isPaused ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    {c.isPaused ? 'PAUSED' : 'ONLINE'}
                  </span>
                </div>
                <p className="text-xs text-slate-600">
                  Department: <strong>{c.department?.name}</strong>
                </p>
                <div className="text-xs text-slate-500 pt-2 border-t border-slate-200">
                  Staff:{' '}
                  {c.staffAssignments && c.staffAssignments.length > 0 ? (
                    <span className="font-semibold text-slate-800">
                      {c.staffAssignments.map(a => a.user.name).join(', ')}
                    </span>
                  ) : (
                    <span className="italic text-slate-400">Unassigned</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: Staff Management */}
      {activeTab === 'staff' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-900">Staff Accounts</h3>
            <button
              onClick={() => setShowStaffModal(true)}
              className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Create Staff Member</span>
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {staffList.map((s) => (
              <div key={s.id} className="py-3 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">{s.name}</h4>
                  <p className="text-xs text-slate-500">{s.email}</p>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="px-2.5 py-0.5 bg-slate-100 text-slate-700 font-semibold text-xs rounded-full">
                    {s.role}
                  </span>
                  <span className="text-xs text-slate-500">
                    {s.assignedCounters && s.assignedCounters.length > 0
                      ? s.assignedCounters[0].counter.counterNumber
                      : 'No Desk Assigned'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal: Add Department */}
      {showDeptModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-slate-900">Add Service Department</h3>
            <form onSubmit={handleCreateDept} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Department Name</label>
                <input
                  type="text"
                  required
                  value={newDept.name}
                  onChange={(e) => setNewDept({ ...newDept, name: e.target.value })}
                  placeholder="e.g. Visa & Immigration Office"
                  className="w-full px-3 py-2 border rounded-xl text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Code (2-4 Letters)</label>
                <input
                  type="text"
                  required
                  maxLength={5}
                  value={newDept.code}
                  onChange={(e) => setNewDept({ ...newDept, code: e.target.value.toUpperCase() })}
                  placeholder="VISA"
                  className="w-full px-3 py-2 border rounded-xl text-sm uppercase font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={newDept.description}
                  onChange={(e) => setNewDept({ ...newDept, description: e.target.value })}
                  placeholder="Brief summary of desk functions..."
                  className="w-full px-3 py-2 border rounded-xl text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Avg Service (mins)</label>
                  <input
                    type="number"
                    min={1}
                    value={newDept.estimatedMinutes}
                    onChange={(e) => setNewDept({ ...newDept, estimatedMinutes: Number(e.target.value) })}
                    className="w-full px-3 py-2 border rounded-xl text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Max Daily Capacity</label>
                  <input
                    type="number"
                    min={1}
                    value={newDept.maxCapacity}
                    onChange={(e) => setNewDept({ ...newDept, maxCapacity: Number(e.target.value) })}
                    className="w-full px-3 py-2 border rounded-xl text-sm"
                  />
                </div>
              </div>

              <div className="pt-3 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowDeptModal(false)}
                  className="px-4 py-2 border rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-semibold"
                >
                  Save Department
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add Counter */}
      {showCounterModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-slate-900">Add Service Counter</h3>
            <form onSubmit={handleCreateCounter} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Counter Number / Name</label>
                <input
                  type="text"
                  required
                  value={newCounter.counterNumber}
                  onChange={(e) => setNewCounter({ ...newCounter, counterNumber: e.target.value })}
                  placeholder="e.g. Counter 03, Window B"
                  className="w-full px-3 py-2 border rounded-xl text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Belongs to Department</label>
                <select
                  required
                  value={newCounter.departmentId}
                  onChange={(e) => setNewCounter({ ...newCounter, departmentId: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl text-sm"
                >
                  <option value="">Select a department...</option>
                  {departments.map((d) => (
                    <option key={d.id} value={d.id}>{d.name} ({d.code})</option>
                  ))}
                </select>
              </div>

              <div className="pt-3 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowCounterModal(false)}
                  className="px-4 py-2 border rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-semibold"
                >
                  Save Counter
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add Staff */}
      {showStaffModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-slate-900">Create Staff Member</h3>
            <form onSubmit={handleCreateStaff} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={newStaff.name}
                  onChange={(e) => setNewStaff({ ...newStaff, name: e.target.value })}
                  placeholder="e.g. Rachel Green"
                  className="w-full px-3 py-2 border rounded-xl text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={newStaff.email}
                  onChange={(e) => setNewStaff({ ...newStaff, email: e.target.value })}
                  placeholder="rachel@queueguard.io"
                  className="w-full px-3 py-2 border rounded-xl text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Temporary Password</label>
                <input
                  type="password"
                  required
                  value={newStaff.password}
                  onChange={(e) => setNewStaff({ ...newStaff, password: e.target.value })}
                  placeholder="••••••••"
                  className="w-full px-3 py-2 border rounded-xl text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Assign to Counter</label>
                <select
                  value={newStaff.counterId}
                  onChange={(e) => setNewStaff({ ...newStaff, counterId: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl text-sm"
                >
                  <option value="">No counter assigned yet</option>
                  {counters.map((c) => (
                    <option key={c.id} value={c.id}>{c.counterNumber} ({c.department?.code})</option>
                  ))}
                </select>
              </div>

              <div className="pt-3 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowStaffModal(false)}
                  className="px-4 py-2 border rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-semibold"
                >
                  Create Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
