import React from 'react';
import { LucideIcon, Sparkles } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: LucideIcon;
  actionText?: string;
  onAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon: Icon = Sparkles,
  actionText,
  onAction,
  className = '',
}) => {
  return (
    <div className={`text-center py-12 px-6 rounded-3xl bg-white border border-lavender-200/80 shadow-soft max-w-md mx-auto my-6 ${className}`}>
      {/* Warm illustrated icon circle */}
      <div className="w-16 h-16 rounded-3xl bg-lavender-100 text-plum-600 flex items-center justify-center mx-auto mb-4 relative shadow-sm">
        <Icon className="w-8 h-8" />
        <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-peach-200 border-2 border-white" />
      </div>

      <h3 className="text-xl font-serif font-bold text-charcoal-900 mb-2">
        {title}
      </h3>
      <p className="text-xs text-mutedGray leading-relaxed max-w-xs mx-auto mb-6">
        {description}
      </p>

      {actionText && onAction && (
        <button
          onClick={onAction}
          className="inline-flex items-center justify-center px-4 py-2.5 rounded-xl bg-plum-500 text-white text-xs font-semibold shadow-sm hover:bg-plum-600 transition-colors"
        >
          {actionText}
        </button>
      )}
    </div>
  );
};
