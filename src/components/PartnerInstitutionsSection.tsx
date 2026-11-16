import React, { useMemo } from 'react';
import { useContent } from '../context/ContentContext';
import { InstitutionLogoBadge } from './InstitutionLogoBadge';
import type { ClientInstitution } from '../types';

interface LogoTileProps {
  institution: ClientInstitution;
}

const LogoTile: React.FC<LogoTileProps> = ({ institution }) => {
  return (
    <div className="min-w-[190px] max-w-[240px] sm:min-w-[215px] sm:max-w-[260px] shrink-0 bg-white rounded-2xl px-3.5 py-3 flex items-center gap-3 transition-all duration-200 group/tile select-none shadow-[0_6px_20px_-8px_rgba(15,23,42,0.08)]">
      <InstitutionLogoBadge
        name={institution.name}
        logo={institution.logo}
        size="md"
        grayscaleOnRest={false}
        className="transition-transform group-hover/tile:scale-105"
      />

      <div className="min-w-0 flex-1">
        <div className="text-xs font-bold text-[#0F172A] group-hover/tile:text-[#2563EB] leading-snug transition-colors">
          {institution.name}
        </div>
        {institution.location && (
          <div className="text-[11px] text-slate-500 leading-tight mt-0.5">
            {institution.location}
          </div>
        )}
      </div>
    </div>
  );
};

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

  const row1Base = useMemo(
    () => createMarqueeSequence(activeInstitutions, 14),
    [activeInstitutions]
  );

  const row2Base = useMemo(() => {
    if (activeInstitutions.length === 0) return [];
    const half = Math.ceil(activeInstitutions.length / 2);
    const staggered = [...activeInstitutions.slice(half), ...activeInstitutions.slice(0, half)];
    return createMarqueeSequence(staggered, 14);
  }, [activeInstitutions]);

  if (activeInstitutions.length === 0) return null;

  return (
    <section
      id="clients"
      className="py-12 sm:py-16 bg-[#F4F6FB] border-y border-slate-200/70 scroll-mt-16 relative overflow-hidden text-[#0F172A]"
    >
      {/* Subtle edge fades for marquee */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-0 w-12 sm:w-28 bg-gradient-to-r from-[#F4F6FB] to-transparent z-10"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 right-0 w-12 sm:w-28 bg-gradient-to-l from-[#F4F6FB] to-transparent z-10"
      />

      {/* Section Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-7 sm:mb-9 relative z-10 text-center">
        <div className="text-[11px] font-bold tracking-[0.14em] uppercase text-[#2563EB] mb-1.5">
          {institutionsData?.sectionBadge || 'TRUSTED BY INSTITUTIONS'}
        </div>
        <h2 className="font-['Outfit'] font-extrabold text-xl sm:text-2xl lg:text-3xl text-[#0F172A] tracking-tight">
          {institutionsData?.sectionTitle || 'Partner Schools, Madrasas & Academies'}
        </h2>
      </div>

      {/* Dual-row continuous marquee without text truncation */}
      <div className="marquee-container space-y-3 sm:space-y-4 w-full overflow-hidden">
        {/* Row 1 */}
        <div className="w-full overflow-hidden py-1">
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

        {/* Row 2 */}
        <div className="w-full overflow-hidden py-1">
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
