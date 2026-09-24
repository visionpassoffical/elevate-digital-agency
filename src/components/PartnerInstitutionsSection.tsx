import React, { useMemo } from 'react';
import { useContent } from '../context/ContentContext';
import { InstitutionLogoBadge } from './InstitutionLogoBadge';
import type { ClientInstitution } from '../types';

interface LogoTileProps {
  institution: ClientInstitution;
}

const LogoTile: React.FC<LogoTileProps> = ({ institution }) => {
  return (
    <div
      className="w-[160px] sm:w-[190px] h-[76px] sm:h-[84px] shrink-0 bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 hover:border-blue-500/40 rounded-2xl p-2.5 sm:p-3 flex items-center gap-3 transition-all duration-200 group/tile select-none shadow-2xs"
    >
      <InstitutionLogoBadge
        name={institution.name}
        logo={institution.logo}
        size="md"
        grayscaleOnRest={true}
        className="transition-transform group-hover/tile:scale-105"
      />

      <div className="min-w-0 flex-1">
        <div className="text-xs font-semibold text-slate-200 group-hover/tile:text-white leading-snug truncate transition-colors">
          {institution.name}
        </div>
        {institution.location && (
          <div className="text-[10px] text-slate-400 leading-tight truncate mt-0.5">
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
    <section id="clients" className="py-14 sm:py-20 bg-[#090D16] border-b border-white/10 scroll-mt-20 relative overflow-hidden text-white">
      {/* Subtle edge fades for marquee */}
      <div 
        aria-hidden="true" 
        className="pointer-events-none absolute inset-y-0 left-0 w-24 sm:w-36 bg-gradient-to-r from-[#090D16] to-transparent z-10" 
      />
      <div 
        aria-hidden="true" 
        className="pointer-events-none absolute inset-y-0 right-0 w-24 sm:w-36 bg-gradient-to-l from-[#090D16] to-transparent z-10" 
      />

      {/* Section Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 sm:mb-10 relative z-10 text-center">
        <div className="inline-flex items-center gap-2 mb-2">
          <span className="w-1.5 h-1.5 bg-[#3B82F6] rounded-full shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
          <span className="text-[11px] font-bold tracking-widest uppercase text-slate-400">
            {institutionsData?.sectionBadge || 'OUR CLIENTS & PARTNERS'}
          </span>
        </div>
        <h2 className="font-['Outfit'] font-extrabold text-2xl sm:text-3xl lg:text-4xl text-white tracking-tight">
          {institutionsData?.sectionTitle || 'Trusted by Modern Educational Institutions'}
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-2 max-w-xl mx-auto font-normal">
          {institutionsData?.sectionSubtitle || 'Schools, colleges, academies, and madrasas that rely on ELEVATE digital systems'}
        </p>
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

export const ClientsMarquee = PartnerInstitutionsSection;
export default PartnerInstitutionsSection;
