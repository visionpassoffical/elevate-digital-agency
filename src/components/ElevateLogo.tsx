import React from 'react';

interface ElevateLogoProps {
  variant?: 'default' | 'white' | 'mark-only' | 'social-avatar';
  showTagline?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const ElevateLogo: React.FC<ElevateLogoProps> = ({
  variant = 'default',
  showTagline = true,
  size = 'md',
  className = '',
}) => {
  const isWhite = variant === 'white';
  const isMarkOnly = variant === 'mark-only';
  const isSocialAvatar = variant === 'social-avatar';

  // Sizing tokens
  const markDimensions = {
    sm: 28,
    md: 36,
    lg: 48,
    xl: 64,
  }[size];

  const textSize = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
    xl: 'text-3xl',
  }[size];

  const taglineSize = {
    sm: 'text-[9px]',
    md: 'text-[10px]',
    lg: 'text-xs',
    xl: 'text-xs',
  }[size];

  // SVG Geometric Mark:
  // An ascending architectural monogram that embodies "ELEVATION":
  // Precision angled geometric facets forming a stylized, modern "E"
  // stepping upward towards an apex chevron.
  const markSvg = (
    <svg
      width={markDimensions}
      height={markDimensions}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0 transition-transform duration-300 group-hover:scale-105"
      aria-label="ELEVATE Brand Mark"
    >
      {/* Structural base foundation */}
      <path
        d="M6 38L18 38L24 32L12 32L6 38Z"
        fill={isWhite ? '#94A3B8' : '#0B0F17'}
      />
      {/* Lower middle shelf & ascent */}
      <path
        d="M12 28L28 28L34 22L18 22L12 28Z"
        fill="#0062EB"
      />
      {/* Apex chevron cap */}
      <path
        d="M18 18L38 18L44 12L24 12L18 18Z"
        fill="#0EA5E9"
      />
      {/* Dynamic vertical spine connector (representing the backbone of the E) */}
      <path
        d="M6 38L18 12H12L6 38Z"
        fill={isWhite ? '#FFFFFF' : '#0B0F17'}
      />
      {/* Core energetic highlight vertex */}
      <circle
        cx="41"
        cy="15"
        r="2.5"
        fill="#0EA5E9"
      />
    </svg>
  );

  if (isSocialAvatar) {
    return (
      <div
        className={`relative inline-flex flex-col items-center justify-center rounded-2xl bg-[#0B0F17] p-4 text-center shadow-xl border border-slate-800 ${className}`}
      >
        <div className="relative mb-2">
          {markSvg}
        </div>
        <span className="font-['Outfit'] font-bold text-white tracking-[0.2em] text-sm uppercase">
          ELEVATE
        </span>
        <span className="text-[9px] font-medium tracking-wider text-slate-400 uppercase mt-0.5">
          Digital Solutions
        </span>
      </div>
    );
  }

  return (
    <div className={`group inline-flex items-center gap-3 select-none ${className}`}>
      {markSvg}

      {!isMarkOnly && (
        <div className="flex flex-col justify-center text-left leading-none">
          <div className="flex items-center gap-1.5">
            <span
              className={`font-['Outfit'] font-extrabold tracking-[0.14em] uppercase transition-colors ${textSize} ${
                isWhite ? 'text-white' : 'text-[#0B0F17]'
              }`}
            >
              ELEVATE
            </span>
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#0062EB] mb-0.5" />
          </div>

          {showTagline && (
            <span
              className={`font-['Plus_Jakarta_Sans'] font-medium tracking-[0.12em] uppercase mt-1 transition-colors ${taglineSize} ${
                isWhite ? 'text-slate-400' : 'text-slate-500'
              }`}
            >
              Digital Solutions & Creative Services
            </span>
          )}
        </div>
      )}
    </div>
  );
};
