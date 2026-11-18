import React from 'react';
import { Link } from 'react-router-dom';

interface BrandLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showTagline?: boolean;
  linkTo?: string;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  className = '',
  size = 'md',
  showTagline = false,
  linkTo = '/'
}) => {
  const iconSizes = {
    sm: 'w-7 h-7 text-xs',
    md: 'w-9 h-9 text-sm',
    lg: 'w-12 h-12 text-base',
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl',
  };

  const content = (
    <div className={`flex items-center gap-2.5 group ${className}`}>
      {/* Brand Icon: Editorial stamp with stylized 'E' and organic leaf/sprout accent */}
      <div className={`${iconSizes[size]} relative rounded-2xl bg-forest-700 text-ivory-100 flex items-center justify-center font-serif font-bold shadow-soft transition-transform group-hover:scale-105 duration-200 border border-forest-600`}>
        <span className="relative z-10 text-ivory-100 font-serif">E</span>
        <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-citron-300 border-2 border-white"></span>
      </div>

      <div className="flex flex-col">
        <span className={`font-serif tracking-tight text-charcoal-900 leading-none font-semibold ${textSizes[size]}`}>
          Earnest
        </span>
        {showTagline && (
          <span className="text-[10px] font-sans font-bold text-forest-700 tracking-wider uppercase mt-0.5">
            Skills · Work · Earnings
          </span>
        )}
      </div>
    </div>
  );

  if (linkTo) {
    return (
      <Link to={linkTo} className="inline-flex focus:outline-none focus:ring-2 focus:ring-forest-400 rounded-lg">
        {content}
      </Link>
    );
  }

  return content;
};
