import React, { useMemo } from 'react';
import { useContent } from '../context/ContentContext';
import { InstitutionLogoBadge } from './InstitutionLogoBadge';
import type { ClientInstitution } from '../types';

interface LogoTileProps {
  institution: ClientInstitution;
}

const LogoTile: React.FC<LogoTileProps> = ({ institution }) => {
  const cleanName = (institution.name || 'Partner Institution').trim();
  return (
    <div className="min-w-[200px] max-w-[260px] shrink-0 bg-white border border-slate-200/80 rounded-2xl px-4 py-3 flex items-center gap-3.5 transition-colors duration-200 group/tile select-none">
      <InstitutionLogoBadge
        name={cleanName}
        logo={institution.logo}
        size="md"
        grayscaleOnRest={false}
      />

      <div className="min-w-0 flex-1">
        <div className="font-['Outfit'] font-bold text-xs sm:text-sm text-[#09090B] group-hover/tile:text-[#2563EB] leading-snug transition-colors">
          {cleanName}
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

function createMarqueeSequence(items: ClientInstitution[], minCount = 12): ClientInstitution[] {
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
    () =>
      (institutionsData?.list || []).filter(
        (inst) => inst.enabled && inst.name && inst.name.trim().length > 0
      ),
    [institutionsData?.list]
  );

  const row1Base = useMemo(
    () => createMarqueeSequence(activeInstitutions, 12),
    [activeInstitutions]
  );

  const row2Base = useMemo(() => {
    if (activeInstitutions.length === 0) return [];
    const half = Math.ceil(activeInstitutions.length / 2);
    const staggered = [...activeInstitutions.slice(half), ...activeInstitutions.slice(0, half)];
    return createMarqueeSequence(staggered, 12);
  }, [activeInstitutions]);

  if (activeInstitutions.length === 0) return null;

  return (
    <section
      id="clients"
      className="py-12 sm:py-16 bg-[#F5F5F7] border-b border-slate-200/80 scroll-mt-16 relative overflow-hidden text-[#09090B]"
    >
      {/* Subtle edge fades for marquee */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-0 w-10 sm:w-24 bg-gradient-to-r from-[#F5F5F7] to-transparent z-10"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 right-0 w-10 sm:w-24 bg-gradient-to-l from-[#F5F5F7] to-transparent z-10"
      />

      {/* Confident Left-Aligned Editorial Header */}
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 mb-7 sm:mb-9 relative z-10">
        <div className="text-[11px] font-bold tracking-[0.14em] uppercase text-[#2563EB] mb-1.5">
          03 / CLIENT NETWORK
        </div>
        <h2 className="font-['Outfit'] font-extrabold text-2xl sm:text-3xl lg:text-4xl text-[#09090B] tracking-[-0.03em]">
          {institutionsData?.sectionTitle || 'Trusted by Schools, Madrasas & Modern Brands.'}
        </h2>
      </div>

      {/* Dual-row continuous marquee */}
      <div className="marquee-container space-y-3 w-full overflow-hidden">
        {/* Row 1 */}
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

        {/* Row 2 */}
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
