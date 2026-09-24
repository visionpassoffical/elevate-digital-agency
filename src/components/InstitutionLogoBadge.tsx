import React, { useState, useEffect } from 'react';

interface InstitutionLogoBadgeProps {
  name: string;
  logo?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  grayscaleOnRest?: boolean;
}

export const InstitutionLogoBadge: React.FC<InstitutionLogoBadgeProps> = ({
  name,
  logo,
  size = 'md',
  className = '',
  grayscaleOnRest = false,
}) => {
  const [imageError, setImageError] = useState(false);

  // Reset image error state whenever logo changes
  useEffect(() => {
    setImageError(false);
  }, [logo]);

  // Generate clean initials for typographical monogram badge (e.g., "AM", "SA")
  const initials = React.useMemo(() => {
    if (!name || !name.trim()) return 'IN';
    const words = name.trim().split(/\s+/).filter(Boolean);
    if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
    return (words[0][0] + (words[1] ? words[1][0] : '')).toUpperCase();
  }, [name]);

  // Stable pleasant gradient based on institution name string
  const gradientClass = React.useMemo(() => {
    const gradients = [
      'from-blue-600 to-indigo-800 text-white',
      'from-emerald-600 to-teal-800 text-white',
      'from-cyan-600 to-blue-800 text-white',
      'from-violet-600 to-purple-800 text-white',
      'from-amber-600 to-orange-800 text-white',
      'from-sky-500 to-blue-700 text-white',
    ];
    let hash = 0;
    for (let i = 0; i < (name || '').length; i++) {
      hash = (name.charCodeAt(i) + ((hash << 5) - hash)) | 0;
    }
    const idx = Math.abs(hash) % gradients.length;
    return gradients[idx];
  }, [name]);

  const sizeClasses = {
    sm: 'w-8 h-8 text-[10px] rounded-lg',
    md: 'w-10 h-10 sm:w-11 sm:h-11 text-xs rounded-xl',
    lg: 'w-12 h-12 text-sm rounded-xl',
    xl: 'w-16 h-16 text-base rounded-2xl',
  }[size];

  const hasValidLogo = Boolean(logo && logo.trim() && !imageError);

  if (hasValidLogo) {
    return (
      <div className={`${sizeClasses} bg-white/5 border border-white/10 shrink-0 flex items-center justify-center overflow-hidden p-1.5 ${className}`}>
        <img
          src={logo}
          alt={name}
          className={`max-h-full max-w-full object-contain pointer-events-none transition-all duration-200 ${
            grayscaleOnRest
              ? 'filter grayscale group-hover/tile:grayscale-0 opacity-75 group-hover/tile:opacity-100'
              : 'opacity-90 hover:opacity-100'
          }`}
          loading="lazy"
          onError={() => setImageError(true)}
        />
      </div>
    );
  }

  // Graceful Render: Clean typographical badge when no logo or image fails to load
  return (
    <div
      className={`${sizeClasses} bg-gradient-to-br ${gradientClass} font-bold font-['Outfit'] tracking-wider shrink-0 flex items-center justify-center shadow-sm border border-white/20 select-none ${className}`}
      title={name}
    >
      <span>{initials}</span>
    </div>
  );
};
