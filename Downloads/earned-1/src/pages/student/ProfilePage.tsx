import React, { useState } from 'react';
import { 
  User, 
  GraduationCap, 
  Award, 
  Globe, 
  FileText, 
  CheckCircle2, 
  Clock,
  ShieldCheck,
  Edit3,
  Save,
  BookOpen,
  Bell,
  Check
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../../components/common/StatusBadge';

export const ProfilePage: React.FC = () => {
  const { 
    currentStudent, 
    programmeSettings, 
    trainingModules, 
    completeTrainingModule,
    notifications,
    showToast 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'overview' | 'training' | 'notifications'>('overview');
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [bioText, setBioText] = useState(currentStudent.bio);
  const [portfolioLink, setPortfolioLink] = useState(currentStudent.portfolioUrl || '');

  // Notifications preference toggles
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [hourWarnings, setHourWarnings] = useState(true);
  const [paymentUpdates, setPaymentUpdates] = useState(true);

  const handleSaveProfile = () => {
    setIsEditingBio(false);
    showToast('Profile Updated', 'Your profile details have been saved.', 'success');
  };

  const handleCompleteModule = (moduleId: string, title: string) => {
    completeTrainingModule(moduleId);
    showToast('Module Completed', `You have completed "${title}".`, 'success');
  };

  const tiers = ['Bronze', 'Silver', 'Gold', 'Platinum'] as const;
  const currentTierIndex = tiers.indexOf(currentStudent.tier as any);
  const nextTier = currentTierIndex < tiers.length - 1 ? tiers[currentTierIndex + 1] : null;

  return (
    <div className="space-y-6 animate-in fade-in duration-300 max-w-4xl mx-auto">
      
      {/* Header */}
      <div className="pb-2 border-b border-lavender-200/80">
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-charcoal-900">
          Student Profile
        </h1>
        <p className="text-sm text-mutedGray mt-0.5">
          Manage your academic record, skills training, and preferences.
        </p>
      </div>

      {/* Profile Summary Card */}
      <div className="rounded-2xl p-6 bg-white border border-lavender-200/90 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-5">
        <div className="flex items-center gap-4">
          <img
            src={currentStudent.avatarUrl}
            alt={currentStudent.name}
            className="w-16 h-16 rounded-full object-cover border-2 border-lavender-200 shadow-xs shrink-0"
          />
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-serif font-bold text-charcoal-900">
                {currentStudent.name}
              </h2>
              <StatusBadge status={currentStudent.tier} size="sm" />
            </div>
            <p className="text-xs text-charcoal-800 font-medium mt-0.5">
              {currentStudent.degree} · Semester {currentStudent.semester}
            </p>
            <p className="text-[11px] text-mutedGray">
              {currentStudent.email} · ID {currentStudent.studentId}
            </p>
          </div>
        </div>

        <div className="flex sm:flex-col items-start sm:items-end justify-between gap-1 pt-3 sm:pt-0 border-t sm:border-t-0 border-ivory-200">
          <span className="text-[10px] uppercase font-bold text-mutedGray">Academic Standing</span>
          <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
            currentStudent.cgpa >= programmeSettings.minimumCgpa
              ? 'bg-sage-200 text-forest-700 border-sage-300'
              : 'bg-rose-100 text-rose-800 border-rose-200'
          }`}>
            {currentStudent.cgpa >= programmeSettings.minimumCgpa ? 'Eligible' : 'Safeguard Hold'}
          </span>
          <span className="text-xs font-serif font-bold text-charcoal-900 mt-0.5">
            CGPA {currentStudent.cgpa.toFixed(1)} / 10.0
          </span>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex border-b border-lavender-200/80 gap-6 text-xs font-medium">
        <button
          onClick={() => setActiveTab('overview')}
          className={`pb-2.5 border-b-2 transition-colors ${
            activeTab === 'overview'
              ? 'border-plum-500 text-plum-900 font-bold'
              : 'border-transparent text-mutedGray hover:text-charcoal-800'
          }`}
        >
          Overview & Academic
        </button>

        <button
          onClick={() => setActiveTab('training')}
          className={`pb-2.5 border-b-2 transition-colors flex items-center gap-1.5 ${
            activeTab === 'training'
              ? 'border-plum-500 text-plum-900 font-bold'
              : 'border-transparent text-mutedGray hover:text-charcoal-800'
          }`}
        >
          <span>Skills & Training</span>
          <span className="px-1.5 py-0.2 rounded-full bg-lavender-100 text-[10px] text-plum-800 font-bold">
            {currentStudent.completedTrainingIds.length}/{trainingModules.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('notifications')}
          className={`pb-2.5 border-b-2 transition-colors ${
            activeTab === 'notifications'
              ? 'border-plum-500 text-plum-900 font-bold'
              : 'border-transparent text-mutedGray hover:text-charcoal-800'
          }`}
        >
          Notifications & Alerts
        </button>
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Academic Safeguards Card */}
          <div className="rounded-2xl p-5 bg-white border border-lavender-200/90 shadow-xs space-y-4">
            <h3 className="font-serif font-bold text-base text-charcoal-900">
              Academic Safeguards
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-3.5 rounded-xl bg-ivory-50 border border-ivory-200">
                <span className="text-[11px] text-mutedGray">Cumulative GPA</span>
                <div className="text-xl font-serif font-bold text-charcoal-900 mt-0.5">{currentStudent.cgpa.toFixed(1)} / 10.0</div>
                <span className="text-[10px] text-forest-700">Min {programmeSettings.minimumCgpa.toFixed(1)} required</span>
              </div>

              <div className="p-3.5 rounded-xl bg-ivory-50 border border-ivory-200">
                <span className="text-[11px] text-mutedGray">Monthly Hours Logged</span>
                <div className="text-xl font-serif font-bold text-charcoal-900 mt-0.5">
                  {currentStudent.monthlyHoursWorked} / {programmeSettings.monthlyHourCap || 20}h
                </div>
                <span className="text-[10px] text-forest-700">
                  {Math.max(0, (programmeSettings.monthlyHourCap || 20) - currentStudent.monthlyHoursWorked)}h remaining
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-ivory-50 border border-ivory-200">
                <span className="text-[11px] text-mutedGray">Department</span>
                <div className="text-base font-semibold text-charcoal-900 mt-1">{currentStudent.department}</div>
                <span className="text-[10px] text-mutedGray">Semester {currentStudent.semester}</span>
              </div>
            </div>
          </div>

          {/* Bio & Professional Links */}
          <div className="rounded-2xl p-5 bg-white border border-lavender-200/90 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-ivory-200">
              <h3 className="font-serif font-bold text-base text-charcoal-900">
                Biography & Links
              </h3>
              <button
                onClick={() => isEditingBio ? handleSaveProfile() : setIsEditingBio(true)}
                className="inline-flex items-center gap-1 text-xs font-semibold text-plum-600 hover:text-plum-700"
              >
                {isEditingBio ? (
                  <>
                    <Save className="w-3.5 h-3.5" />
                    <span>Save</span>
                  </>
                ) : (
                  <>
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </>
                )}
              </button>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-charcoal-800 block">Short Bio</label>
              {isEditingBio ? (
                <textarea
                  rows={3}
                  value={bioText}
                  onChange={(e) => setBioText(e.target.value)}
                  className="w-full rounded-xl border border-lavender-200 p-3 text-xs text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-plum-400 bg-white"
                />
              ) : (
                <p className="text-xs text-charcoal-800 leading-relaxed bg-ivory-50/70 p-3.5 rounded-xl border border-ivory-200">
                  {bioText}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="p-3 rounded-xl bg-ivory-50/70 border border-ivory-200 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 truncate">
                  <Globe className="w-4 h-4 text-plum-500 shrink-0" />
                  <span className="text-charcoal-800 font-medium truncate">
                    {currentStudent.portfolioUrl || 'No portfolio link set'}
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-ivory-50/70 border border-ivory-200 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 truncate">
                  <FileText className="w-4 h-4 text-plum-500 shrink-0" />
                  <span className="text-charcoal-800 font-medium truncate">
                    {currentStudent.resumeFileName || 'Default_Resume.pdf'}
                  </span>
                </div>
                <button
                  onClick={() => alert(`Downloading ${currentStudent.resumeFileName}...`)}
                  className="text-plum-600 font-semibold hover:underline shrink-0 ml-2"
                >
                  Download
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: SKILLS & TRAINING */}
      {activeTab === 'training' && (
        <div className="space-y-6">
          {/* Tier Progression */}
          <div className="rounded-2xl p-5 bg-white border border-lavender-200/90 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-ivory-200">
              <h3 className="font-serif font-bold text-base text-charcoal-900">
                Current Tier: {currentStudent.tier}
              </h3>
              {nextTier && (
                <span className="text-xs text-mutedGray">
                  Next milestone: <strong className="text-charcoal-900">{nextTier}</strong>
                </span>
              )}
            </div>

            <div className="grid grid-cols-4 gap-2 text-center text-xs">
              {tiers.map((t, idx) => {
                const isPassed = idx <= currentTierIndex;
                const isCurrent = idx === currentTierIndex;
                return (
                  <div
                    key={t}
                    className={`p-2.5 rounded-xl border transition-all ${
                      isCurrent
                        ? 'bg-plum-500 text-white border-plum-600 font-bold shadow-xs'
                        : isPassed
                        ? 'bg-sage-100 text-forest-800 border-sage-200 font-semibold'
                        : 'bg-ivory-50 text-mutedGray border-ivory-200'
                    }`}
                  >
                    <div className="text-xs font-serif">{t}</div>
                    <div className="text-[10px] mt-0.5 opacity-80">
                      {idx === 0 && 'Base'}
                      {idx === 1 && '2+ projects'}
                      {idx === 2 && '5+ projects'}
                      {idx === 3 && '8+ projects'}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Competency Tags */}
          <div className="rounded-2xl p-5 bg-white border border-lavender-200/90 shadow-xs space-y-3">
            <h3 className="font-serif font-bold text-base text-charcoal-900">
              Verified Skills
            </h3>
            <div className="flex flex-wrap gap-2">
              {currentStudent.skills.map((skill) => (
                <span
                  key={skill}
                  className="px-3 py-1 rounded-xl text-xs font-medium bg-lavender-100 text-plum-900 border border-lavender-200"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Training Modules */}
          <div className="rounded-2xl p-5 bg-white border border-lavender-200/90 shadow-xs space-y-4">
            <h3 className="font-serif font-bold text-base text-charcoal-900">
              Required Training Modules
            </h3>

            <div className="space-y-3">
              {trainingModules.map((module) => {
                const isCompleted = currentStudent.completedTrainingIds.includes(module.id);
                return (
                  <div
                    key={module.id}
                    className="p-3.5 rounded-xl bg-ivory-50/70 border border-ivory-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-charcoal-900">{module.title}</span>
                        {isCompleted && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-forest-700 bg-sage-200 px-2 py-0.5 rounded-full border border-sage-300">
                            <Check className="w-3 h-3" />
                            <span>Done</span>
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-mutedGray mt-0.5">{module.description}</p>
                    </div>

                    {!isCompleted ? (
                      <button
                        onClick={() => handleCompleteModule(module.id, module.title)}
                        className="px-3 py-1.5 rounded-xl bg-plum-500 hover:bg-plum-600 text-white font-medium text-xs transition-colors shrink-0"
                      >
                        Complete Module
                      </button>
                    ) : (
                      <span className="text-[11px] text-mutedGray shrink-0 font-medium">Completed</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: NOTIFICATIONS & PREFERENCES */}
      {activeTab === 'notifications' && (
        <div className="space-y-6">
          {/* Notification Preferences */}
          <div className="rounded-2xl p-5 bg-white border border-lavender-200/90 shadow-xs space-y-4">
            <h3 className="font-serif font-bold text-base text-charcoal-900">
              Notification Preferences
            </h3>

            <div className="space-y-3">
              <label className="flex items-center justify-between p-3.5 rounded-xl bg-ivory-50/70 border border-ivory-200 cursor-pointer">
                <div>
                  <div className="text-xs font-semibold text-charcoal-900">Email Alerts on New Opportunities</div>
                  <div className="text-[11px] text-mutedGray">Receive notifications when matching projects are posted.</div>
                </div>
                <input
                  type="checkbox"
                  checked={emailAlerts}
                  onChange={(e) => setEmailAlerts(e.target.checked)}
                  className="rounded border-lavender-200 text-plum-600 focus:ring-plum-400 w-4 h-4"
                />
              </label>

              <label className="flex items-center justify-between p-3.5 rounded-xl bg-ivory-50/70 border border-ivory-200 cursor-pointer">
                <div>
                  <div className="text-xs font-semibold text-charcoal-900">Monthly Hour Safeguard Warnings</div>
                  <div className="text-[11px] text-mutedGray">Get an early alert when you reach 15 hours in a month.</div>
                </div>
                <input
                  type="checkbox"
                  checked={hourWarnings}
                  onChange={(e) => setHourWarnings(e.target.checked)}
                  className="rounded border-lavender-200 text-plum-600 focus:ring-plum-400 w-4 h-4"
                />
              </label>

              <label className="flex items-center justify-between p-3.5 rounded-xl bg-ivory-50/70 border border-ivory-200 cursor-pointer">
                <div>
                  <div className="text-xs font-semibold text-charcoal-900">Payment & Verification Updates</div>
                  <div className="text-[11px] text-mutedGray">Instant notification when a coordinator approves earnings proof.</div>
                </div>
                <input
                  type="checkbox"
                  checked={paymentUpdates}
                  onChange={(e) => setPaymentUpdates(e.target.checked)}
                  className="rounded border-lavender-200 text-plum-600 focus:ring-plum-400 w-4 h-4"
                />
              </label>
            </div>
          </div>

          {/* Recent Notification History */}
          <div className="rounded-2xl p-5 bg-white border border-lavender-200/90 shadow-xs space-y-4">
            <h3 className="font-serif font-bold text-base text-charcoal-900">
              Recent Alerts
            </h3>

            <div className="space-y-2.5">
              {notifications.slice(0, 4).map((notif) => (
                <div
                  key={notif.id}
                  className="p-3 rounded-xl bg-ivory-50/70 border border-ivory-200 flex items-start gap-3"
                >
                  <Bell className="w-4 h-4 text-plum-600 mt-0.5 shrink-0" />
                  <div className="flex-1">
                    <div className="text-xs font-bold text-charcoal-900">{notif.title}</div>
                    <div className="text-[11px] text-mutedGray mt-0.5">{notif.message}</div>
                    <div className="text-[10px] text-mutedGray mt-1">{notif.timestamp}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
