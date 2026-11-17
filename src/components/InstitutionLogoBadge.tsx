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
}) => {
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    setImageError(false);
  }, [logo]);

  // Generate clean 2-letter monogram for institutional badge
  const initials = React.useMemo(() => {
    if (!name || !name.trim()) return 'IN';
    const words = name
      .trim()
      .replace(/[^a-zA-Z0-9\s]/g, '')
      .split(/\s+/)
      .filter(Boolean);
    if (words.length === 0) return 'IN';
    if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
    return (words[0][0] + words[1][0]).toUpperCase();
  }, [name]);

  // Rich, vibrant gradient palette so every client badge looks like a crafted emblem
  const gradientClass = React.useMemo(() => {
    const gradients = [
      'from-[#2563EB] to-[#1E3A8A] text-white',
      'from-[#059669] to-[#064E3B] text-white',
      'from-[#4F46E5] to-[#312E81] text-white',
      'from-[#0284C7] to-[#0C4A6E] text-white',
      'from-[#D97706] to-[#78350F] text-white',
      'from-[#7C3AED] to-[#4C1D95] text-white',
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

  // Treat default placeholder paths (/logos/client-*) as monogram candidates unless a real custom logo (data:image or external/uploaded url) is provided
  const isPlaceholderPath = Boolean(logo && /^\/logos\/client-\d+\.svg$/i.test(logo.trim()));
  const hasValidCustomLogo = Boolean(logo && logo.trim() && !isPlaceholderPath && !imageError);

  if (hasValidCustomLogo) {
    return (
      <div
        className={`${sizeClasses} bg-white ring-1 ring-slate-200/80 shrink-0 flex items-center justify-center overflow-hidden p-1.5 shadow-2xs ${className}`}
      >
        <img
          src={logo}
          alt={name}
          referrerPolicy="no-referrer"
          className="max-h-full max-w-full object-contain pointer-events-none transition-transform duration-200"
          loading="lazy"
          onError={() => setImageError(true)}
        />
      </div>
    );
  }

  return (
    <div
      className={`${sizeClasses} bg-gradient-to-br ${gradientClass} font-extrabold font-['Outfit'] tracking-wider shrink-0 flex items-center justify-center shadow-xs select-none ${className}`}
      title={name}
    >
      <span>{initials}</span>
    </div>
  );
};
