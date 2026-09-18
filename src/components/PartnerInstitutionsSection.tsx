import React, { useMemo } from 'react';
import { useContent } from '../context/ContentContext';
import { Building2 } from 'lucide-react';
import type { ClientInstitution } from '../types';

interface LogoTileProps {
  institution: ClientInstitution;
}

const LogoTile: React.FC<LogoTileProps> = ({ institution }) => {
  return (
    <div
      className="w-[130px] sm:w-[150px] h-[92px] sm:h-[100px] shrink-0 bg-white border border-[#E5E7EB] rounded-[12px] p-2.5 sm:p-3 flex flex-col items-center justify-center transition-colors duration-150 hover:border-slate-300 group/tile select-none"
    >
      <div className="h-8 sm:h-9 w-full flex items-center justify-center mb-1 overflow-hidden">
        {institution.logo ? (
          <img
            src={institution.logo}
            alt={institution.name}
            className="max-h-full max-w-full object-contain pointer-events-none"
            loading="lazy"
          />
        ) : (
          <Building2 className="w-6 h-6 text-slate-400" />
        )}
      </div>
      <div className="w-full text-center">
        <div className="text-[11px] sm:text-xs font-semibold text-[#0F172A] leading-tight truncate px-1">
          {institution.name}
        </div>
        {institution.location && (
          <div className="text-[9px] sm:text-[10px] text-slate-400 leading-tight truncate mt-0.5">
            {institution.location}
          </div>
        )}
      </div>
    </div>
  );
};

// Duplicates the visual sequence only for seamless continuous animation
function createMarqueeSequence(items: ClientInstitution[], minCount = 14): ClientInstitution[] {
  if (items.length === 0) return [];
  const result: ClientInstitution[] = [];
  while (result.length < minCount) {
    result.push(...items);
  }
  return result;
}

export const PartnerInstitutionsSection: React.FC = () => {
  const { content } = useContent();
  const institutionsData = content.clientInstitutions;
  const activeInstitutions = useMemo(
    () => (institutionsData?.list || []).filter((inst) => inst.enabled),
    [institutionsData?.list]
  );

  // Row 1 sequence: moves slowly left to right
  const row1Base = useMemo(
    () => createMarqueeSequence(activeInstitutions, 14),
    [activeInstitutions]
  );

  // Row 2 sequence: moves slowly right to left, with staggered offset
  const row2Base = useMemo(() => {
    if (activeInstitutions.length === 0) return [];
    const half = Math.ceil(activeInstitutions.length / 2);
    const staggered = [...activeInstitutions.slice(half), ...activeInstitutions.slice(0, half)];
    return createMarqueeSequence(staggered, 14);
  }, [activeInstitutions]);

  if (activeInstitutions.length === 0) return null;

  return (
    <section id="clients" className="py-10 sm:py-14 bg-white border-b border-slate-200/80 scroll-mt-20 overflow-hidden">
      {/* Section Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6 sm:mb-8">
        <div className="text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 mb-2">
            <span className="w-1.5 h-1.5 bg-[#2563EB] rounded-full" />
            <span className="text-[11px] font-bold tracking-widest uppercase text-slate-500">
              {institutionsData?.sectionBadge || 'OUR CLIENTS'}
            </span>
          </div>
          <h2 className="font-['Outfit'] font-extrabold text-2xl sm:text-3xl text-[#0F172A] tracking-tight">
            {institutionsData?.sectionTitle || 'Our Client Institutions'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 font-normal">
            {institutionsData?.sectionSubtitle || 'Educational institutions we work with'}
          </p>
        </div>
      </div>

      {/* Compact Logo Showcase: Dual-row continuous marquee */}
      <div className="marquee-container space-y-3 sm:space-y-4 w-full overflow-hidden">
        {/* Row 1: moves slowly from left to right */}
        <div className="w-full overflow-hidden py-0.5">
          <div className="flex w-max animate-marquee-right hover:[animation-play-state:paused] focus-within:[animation-play-state:paused] active:[animation-play-state:paused]">
            <div className="flex items-center gap-3 sm:gap-4 pr-3 sm:pr-4">
              {row1Base.map((inst, idx) => (
                <LogoTile key={`row1-a-${inst.id}-${idx}`} institution={inst} />
              ))}
            </div>
            <div className="flex items-center gap-3 sm:gap-4 pr-3 sm:pr-4" aria-hidden="true">
              {row1Base.map((inst, idx) => (
                <LogoTile key={`row1-b-${inst.id}-${idx}`} institution={inst} />
              ))}
            </div>
          </div>
        </div>

        {/* Row 2: moves slowly from right to left */}
        <div className="w-full overflow-hidden py-0.5">
          <div className="flex w-max animate-marquee-left hover:[animation-play-state:paused] focus-within:[animation-play-state:paused] active:[animation-play-state:paused]">
            <div className="flex items-center gap-3 sm:gap-4 pr-3 sm:pr-4">
              {row2Base.map((inst, idx) => (
                <LogoTile key={`row2-a-${inst.id}-${idx}`} institution={inst} />
              ))}
            </div>
            <div className="flex items-center gap-3 sm:gap-4 pr-3 sm:pr-4" aria-hidden="true">
              {row2Base.map((inst, idx) => (
                <LogoTile key={`row2-b-${inst.id}-${idx}`} institution={inst} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

