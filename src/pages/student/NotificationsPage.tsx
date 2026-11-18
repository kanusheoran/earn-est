import React from 'react';
import { Bell, CheckCircle2, ShieldAlert, DollarSign, Briefcase, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { EmptyState } from '../../components/common/EmptyState';

export const NotificationsPage: React.FC = () => {
  const { notifications } = useApp();

  return (
    <div className="space-y-6 animate-in fade-in duration-300 max-w-4xl mx-auto">
      <div className="pb-3 border-b border-lavender-200/80">
        <div className="flex items-center gap-2">
          <Bell className="w-6 h-6 text-plum-600" />
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-charcoal-900">
            Notifications & System Alerts
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-mutedGray mt-1">
          Recent updates regarding your applications, earnings verifications, and academic work-hour safeguards.
        </p>
      </div>

      {notifications.length > 0 ? (
        <div className="space-y-3">
          {notifications.map((n) => {
            let Icon = Bell;
            let iconBg = 'bg-lavender-100 text-plum-600';
            if (n.type === 'project') {
              Icon = Briefcase;
              iconBg = 'bg-sage-200 text-forest-700';
            } else if (n.type === 'earning') {
              Icon = DollarSign;
              iconBg = 'bg-peach-100 text-charcoal-900';
            } else if (n.type === 'compliance') {
              Icon = ShieldAlert;
              iconBg = 'bg-amber-100 text-amber-800';
            }

            return (
              <div
                key={n.id}
                className={`card-subtle rounded-3xl p-5 bg-white border transition-all flex items-start justify-between gap-4 ${
                  !n.isRead ? 'border-plum-200 shadow-xs' : 'border-lavender-200/80'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-2xl ${iconBg} flex items-center justify-center shrink-0`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-sm text-charcoal-900">{n.title}</h4>
                      {!n.isRead && (
                        <span className="w-2 h-2 rounded-full bg-plum-500 shrink-0" />
                      )}
                    </div>
                    <p className="text-xs text-mutedGray leading-relaxed">{n.message}</p>
                    <span className="text-[10px] text-mutedGray font-medium block pt-0.5">{n.timestamp}</span>
                  </div>
                </div>

                {n.linkUrl && (
                  <Link
                    to={n.linkUrl}
                    className="p-2 rounded-xl text-plum-600 hover:bg-lavender-50 transition-colors shrink-0"
                    title="View related section"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <EmptyState
          title="All caught up"
          description="You have no unread notifications or compliance reminders at this time."
        />
      )}
    </div>
  );
};
