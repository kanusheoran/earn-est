import React from 'react';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ToastContainer: React.FC = () => {
  const { toasts, dismissToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        let Icon = Info;
        let borderClass = 'border-lavender-200';
        let bgClass = 'bg-white text-charcoal-900';
        let iconColor = 'text-plum-600';

        switch (toast.type) {
          case 'success':
            Icon = CheckCircle2;
            borderClass = 'border-sage-300';
            iconColor = 'text-forest-600';
            break;
          case 'error':
            Icon = AlertCircle;
            borderClass = 'border-rose-300';
            iconColor = 'text-rose-600';
            break;
          case 'warning':
            Icon = AlertTriangle;
            borderClass = 'border-amber-300';
            iconColor = 'text-amber-600';
            break;
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-2xl shadow-soft-lg border ${borderClass} ${bgClass} transition-all animate-in fade-in slide-in-from-bottom-2`}
          >
            <Icon className={`w-5 h-5 shrink-0 mt-0.5 ${iconColor}`} />
            <div className="flex-1 min-w-0">
              <h5 className="text-sm font-semibold text-charcoal-900">{toast.title}</h5>
              {toast.description && (
                <p className="text-xs text-mutedGray mt-0.5 leading-relaxed">{toast.description}</p>
              )}
            </div>
            <button
              onClick={() => dismissToast(toast.id)}
              className="text-mutedGray hover:text-charcoal-900 p-1 rounded-lg hover:bg-lavender-50 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
