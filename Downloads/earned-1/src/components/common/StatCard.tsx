import React from 'react';
import { LucideIcon } from 'lucide-react';

export interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: LucideIcon;
  iconBgColor?: string;
  iconColor?: string;
  trend?: {
    value: string;
    label?: string;
    isPositive?: boolean;
  };
  onClick?: () => void;
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  iconBgColor = 'bg-lavender-100',
  iconColor = 'text-plum-600',
  trend,
  onClick,
  className = '',
}) => {
  return (
    <div
      onClick={onClick}
      className={`card-subtle rounded-2xl p-5 bg-white border border-lavender-200/80 transition-all ${
        onClick ? 'cursor-pointer hover:border-plum-300' : ''
      } ${className}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium text-mutedGray">
            {title}
          </p>
          <h3 className="text-2xl sm:text-3xl font-serif font-bold text-charcoal-900 mt-1">
            {value}
          </h3>
          {subtitle && (
            <p className="text-[11px] text-mutedGray mt-0.5">
              {subtitle}
            </p>
          )}
          {trend && (
            <div className="flex items-center gap-1.5 mt-2 text-[11px]">
              <span className={`font-semibold ${trend.isPositive ? 'text-forest-700' : 'text-rose-700'}`}>
                {trend.value}
              </span>
              {trend.label && (
                <span className="text-mutedGray">{trend.label}</span>
              )}
            </div>
          )}
        </div>

        {Icon && (
          <div className={`w-10 h-10 rounded-xl ${iconBgColor} ${iconColor} flex items-center justify-center shrink-0`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>
    </div>
  );
};
