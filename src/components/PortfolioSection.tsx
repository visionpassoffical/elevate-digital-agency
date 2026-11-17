import React, { useState, useMemo } from 'react';
import {
  Globe,
  ArrowUpRight,
  Settings,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useContent } from '../context/ContentContext';
import type { PortfolioItemConfig } from '../types';

interface PortfolioSectionProps {
  onOpenAdminPortfolio?: () => void;
  onRequestQuote?: (context: string) => void;
}

const CATEGORIES = [
  'All',
  'Madrasa & Islamic',
  'Schools & Colleges',
  'Business & Corporate',
  'Web Apps',
] as const;

const ensureHttps = (url: string): string => {
  const trimmed = (url || '').trim();
  if (!trimmed) return 'https://elevate-portal.in';
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
};

const formatDisplayDomain = (url: string): string => {
  const full = ensureHttps(url);
  return full.replace(/\/$/, '').replace(/^https?:\/\//, '');
};

/**
 * Rich, custom-styled visual mockup graphic (layered UI preview cards, gradient mesh,
 * and bold brand monogram) when no screenshot is uploaded yet.
 */
const AgencyLayeredUiMockup: React.FC<{ item: PortfolioItemConfig }> = ({ item }) => {
  const cat = item.category.toLowerCase();
  const isMadrasa = cat.includes('madrasa') || cat.includes('islamic');
  const isSchool = cat.includes('school') || cat.includes('college');
  const isApp = cat.includes('app');

  const canvasBg = isMadrasa
    ? 'from-[#052E2B] via-[#064E3B] to-[#09090B]'
    : isSchool
    ? 'from-[#0F172A] via-[#1E3A8A] to-[#09090B]'
    : isApp
    ? 'from-[#1E1B4B] via-[#311042] to-[#09090B]'
    : 'from-[#09090B] via-[#18181B] to-[#1E293B]';

  const accentPill = isMadrasa
    ? 'bg-emerald-400 text-[#052E2B]'
    : isSchool
    ? 'bg-blue-400 text-[#09090B]'
    : isApp
    ? 'bg-violet-400 text-[#09090B]'
    : 'bg-sky-400 text-[#09090B]';

  const monogram = (item.clientName || item.title || 'EL')
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();

  const tags =
    item.tags && item.tags.length > 0
      ? item.tags.slice(0, 2)
      : ['Responsive Architecture', 'Live Portal'];

  return (
    <div
      className={`w-full h-full bg-gradient-to-br ${canvasBg} p-4 sm:p-5 flex flex-col justify-between relative overflow-hidden select-none text-white`}
    >
      {/* Ambient Radial Mesh */}
      <div
        aria-hidden="true"
        className="absolute -top-16 -right-10 w-56 h-56 rounded-full bg-white/10 blur-3xl pointer-events-none"
      />
      <div
        aria-hidden="true"
        className="absolute -bottom-20 -left-10 w-56 h-56 rounded-full bg-[#2563EB]/25 blur-3xl pointer-events-none"
      />

      {/* Layered Floating Browser/UI Card Inside the Showcase Frame */}
      <div className="relative z-10 my-auto mx-auto w-full max-w-[94%] rounded-xl bg-white/[0.08] backdrop-blur-md border border-white/15 p-3.5 sm:p-4 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)] group-hover:-translate-y-0.5 transition-transform duration-300">
        {/* Mini UI Top Navigation Bar */}
        <div className="flex items-center justify-between gap-2 pb-2.5 mb-3 border-b border-white/10">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-6 h-6 rounded-md bg-white text-[#09090B] font-['Outfit'] font-extrabold text-[10px] flex items-center justify-center shrink-0">
              {monogram}
            </div>
            <span className="font-['Outfit'] font-bold text-xs text-white/95 truncate">
              {item.clientName || item.title}
            </span>
          </div>
          <span className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider shrink-0 ${accentPill}`}>
            Live
          </span>
        </div>

        {/* Mini UI Hero Split */}
        <div className="grid grid-cols-12 gap-2.5 items-center">
          <div className="col-span-8 space-y-1.5">
            <div className="text-[9px] font-mono uppercase tracking-widest text-white/60">
              {formatDisplayDomain(item.url)}
            </div>
            <div className="font-['Outfit'] font-bold text-xs sm:text-sm text-white leading-tight line-clamp-2">
              {item.title}
            </div>
            <div className="flex flex-wrap gap-1 pt-1">
              {tags.map((t, idx) => (
                <span
                  key={idx}
                  className="text-[9px] font-medium text-white/80 bg-white/10 px-2 py-0.5 rounded"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* Right Layered Metric Widget */}
          <div className="col-span-4 rounded-lg bg-black/30 border border-white/10 p-2 text-center">
            <div className="font-['Outfit'] font-extrabold text-sm sm:text-base text-white leading-none">
              100%
            </div>
            <div className="text-[8px] uppercase tracking-wider text-white/60 mt-1">
              Core Web Vitals
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const PortfolioSection: React.FC<PortfolioSectionProps> = ({
  onOpenAdminPortfolio,
}) => {
  const { content, isAuthenticated, openWhatsAppMessage } = useContent();
  const portfolio = content.portfolio || {
    sectionBadge: 'SELECTED WORK',
    sectionTitle: 'Selected Digital Products & Live Portals.',
    sectionSubtitle:
      'Explore live websites, institutional portals, and digital systems engineered for schools, madrasas, and businesses.',
    items: [],
  };

  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});

  const enabledItems = useMemo(() => {
    return (portfolio.items || [])
      .filter((item) => item.enabled !== false)
      .sort((a, b) => (a.order || 0) - (b.order || 0));
  }, [portfolio.items]);

  const filteredItems = useMemo(() => {
    if (activeCategory === 'All') return enabledItems;
    return enabledItems.filter(
      (item) => item.category.toLowerCase() === activeCategory.toLowerCase()
    );
  }, [enabledItems, activeCategory]);

  const handleBuildSimilar = (item: PortfolioItemConfig) => {
    const cleanUrl = ensureHttps(item.url);
    const msg = `Hello ELEVATE,\n\nI saw "${item.title}" (${cleanUrl}) in your Selected Work portfolio and would like to build a similar website for our organization.\n\nPlease share the details and pricing.`;
    openWhatsAppMessage(msg);
  };

  return (
    <section
      id="portfolio"
      className="py-14 sm:py-22 bg-[#F5F5F7] text-[#09090B] border-b border-slate-200/80 scroll-mt-16 relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 relative z-10">
        {/* Left-Aligned Editorial Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 mb-8 sm:mb-10">
          <div className="max-w-2xl">
            <div className="text-[11px] font-bold tracking-[0.14em] uppercase text-[#2563EB] mb-2">
              01 / SELECTED WORK
            </div>

            <h2 className="font-['Outfit'] font-extrabold text-3xl sm:text-4xl lg:text-5xl text-[#09090B] tracking-[-0.03em] leading-[1.08]">
              {portfolio.sectionTitle || 'Websites & Digital Brands We’ve Shipped.'}
            </h2>

            <p className="mt-2.5 text-sm sm:text-base text-slate-600 leading-relaxed max-w-xl">
              Live production websites, admission portals, and custom web platforms crafted for partner institutions and businesses.
            </p>
          </div>

          {isAuthenticated && onOpenAdminPortfolio && (
            <button
              type="button"
              onClick={onOpenAdminPortfolio}
              className="self-start md:self-auto inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white border border-slate-200/90 hover:border-[#09090B] text-xs font-bold text-[#09090B] transition-colors cursor-pointer"
            >
              <Settings className="w-3.5 h-3.5 text-[#2563EB]" />
              <span>Manage Sites</span>
            </button>
          )}
        </div>

        {/* Horizontal Filter Pills (.no-scrollbar) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-8 sm:mb-10 -mx-5 px-5 sm:mx-0 sm:px-0 no-scrollbar">
          {CATEGORIES.map((category) => {
            const isActive = activeCategory === category;
            const count =
              category === 'All'
                ? enabledItems.length
                : enabledItems.filter(
                    (i) => i.category.toLowerCase() === category.toLowerCase()
                  ).length;

            return (
              <button
                key={category}
                type="button"
                onClick={() => setActiveCategory(category)}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 border ${
                  isActive
                    ? 'bg-[#09090B] text-white border-[#09090B]'
                    : 'bg-white text-slate-600 border-slate-200/90 hover:border-slate-400 hover:text-[#09090B]'
                }`}
              >
                <span>{category}</span>
                <span
                  className={`text-[10px] font-mono tabular-nums ${
                    isActive ? 'text-slate-400' : 'text-slate-400'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Agency Case-Study Showcase Cards */}
        {filteredItems.length === 0 ? (
          <div className="py-12 border-y border-slate-200/80 text-left">
            <Globe className="w-7 h-7 text-[#2563EB] mb-2" />
            <h3 className="font-['Outfit'] font-bold text-lg text-[#09090B]">
              No projects in this category yet
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Select another category tab above to inspect our live deployments.
            </p>
          </div>
        ) : (
          <div className="flex md:grid md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 overflow-x-auto md:overflow-visible snap-x snap-mandatory pb-2 md:pb-0 -mx-5 px-5 md:mx-0 md:px-0 no-scrollbar">
            <AnimatePresence mode="popLayout">
              {filteredItems.map((item) => {
                const fullUrl = ensureHttps(item.url);
                const cleanDomain = formatDisplayDomain(item.url);
                const hasValidScreenshot =
                  Boolean(item.screenshot && item.screenshot.trim()) && !failedImages[item.id];

                return (
                  <motion.article
                    layout
                    key={item.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.97 }}
                    transition={{ duration: 0.22 }}
                    className="w-[85vw] max-w-[350px] sm:w-[370px] md:w-auto md:max-w-none shrink-0 snap-center group flex flex-col justify-between"
                  >
                    <div>
                      {/* 16:10 Visual Showcase Frame with Rounded-2xl Edges & Floating Domain/Category Overlay */}
                      <a
                        href={fullUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block relative aspect-[16/10] w-full rounded-2xl bg-[#09090B] overflow-hidden border border-slate-200/80 mb-4"
                      >
                        {hasValidScreenshot ? (
                          <img
                            src={item.screenshot}
                            alt={`${item.title} live website preview`}
                            referrerPolicy="no-referrer"
                            onError={() =>
                              setFailedImages((prev) => ({ ...prev, [item.id]: true }))
                            }
                            className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <AgencyLayeredUiMockup item={item} />
                        )}

                        {/* Top Floating Category & Domain Bar */}
                        <div className="absolute top-3 left-3 right-3 z-20 flex items-center justify-between gap-2 pointer-events-none">
                          <span className="px-2.5 py-1 rounded-full bg-black/65 backdrop-blur-md text-[10px] font-bold text-white border border-white/15">
                            {item.category}
                          </span>
                          <span className="px-2.5 py-1 rounded-full bg-white/95 backdrop-blur-md text-[10px] font-mono font-semibold text-[#09090B] inline-flex items-center gap-1 shadow-xs">
                            <span>{cleanDomain}</span>
                            <ArrowUpRight className="w-3 h-3 text-[#2563EB]" />
                          </span>
                        </div>
                      </a>

                      {/* Case Study Editorial Copy Below Frame */}
                      <div className="px-0.5">
                        <div className="text-xs font-medium text-slate-500 mb-1">
                          {item.category}
                          {(item.location || item.clientName) && (
                            <>
                              <span aria-hidden="true"> · </span>
                              <span>{item.location || item.clientName}</span>
                            </>
                          )}
                        </div>

                        <h3 className="font-['Outfit'] font-extrabold text-xl text-[#09090B] group-hover:text-[#2563EB] transition-colors tracking-[-0.02em] leading-snug mb-1.5">
                          <a
                            href={fullUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {item.title}
                          </a>
                        </h3>

                        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-2">
                          {item.description}
                        </p>
                      </div>
                    </div>

                    {/* Crisp Agency Action Links */}
                    <div className="pt-4 mt-4 border-t border-slate-200/80 flex items-center justify-between gap-4 px-0.5">
                      <a
                        href={fullUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#09090B] hover:text-[#2563EB] transition-colors"
                      >
                        <span>Visit Live Site</span>
                        <ArrowUpRight className="w-4 h-4 text-[#2563EB]" />
                      </a>

                      <button
                        type="button"
                        onClick={() => handleBuildSimilar(item)}
                        className="inline-flex items-center gap-1 text-xs font-bold text-slate-600 hover:text-[#09090B] transition-colors cursor-pointer"
                      >
                        <span>Request Similar</span>
                        <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
                      </button>
                    </div>
                  </motion.article>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>
    </section>
  );
};
