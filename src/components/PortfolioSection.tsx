import React, { useState, useMemo } from 'react';
import {
  ExternalLink,
  Globe,
  Lock,
  MessageCircle,
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

const ArtisticStudioShowcaseFallback: React.FC<{ item: PortfolioItemConfig }> = ({ item }) => {
  const isMadrasa =
    item.category.toLowerCase().includes('madrasa') ||
    item.category.toLowerCase().includes('islamic');
  const isSchool =
    item.category.toLowerCase().includes('school') ||
    item.category.toLowerCase().includes('college');
  const isApp = item.category.toLowerCase().includes('app');

  const bgGradient = isMadrasa
    ? 'from-[#064E3B] via-[#0F172A] to-[#022C22]'
    : isSchool
    ? 'from-[#1E3A8A] via-[#0F172A] to-[#172554]'
    : isApp
    ? 'from-[#311042] via-[#0F172A] to-[#1E1B4B]'
    : 'from-[#0F172A] via-[#1E293B] to-[#090D16]';

  const glowColor = isMadrasa
    ? 'from-emerald-400/25 via-teal-400/10 to-transparent'
    : isSchool
    ? 'from-blue-400/30 via-indigo-400/10 to-transparent'
    : isApp
    ? 'from-violet-400/30 via-fuchsia-400/10 to-transparent'
    : 'from-sky-400/25 via-blue-400/10 to-transparent';

  const monogram = (item.clientName || item.title || 'EL')
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();

  return (
    <div
      className={`w-full h-full bg-gradient-to-br ${bgGradient} p-5 sm:p-6 flex flex-col justify-between relative overflow-hidden select-none text-white`}
    >
      {/* Artistic Radial Mesh & Fine Architectural Grid */}
      <div
        aria-hidden="true"
        className={`absolute -top-12 -right-12 w-56 h-56 rounded-full bg-gradient-to-br ${glowColor} blur-2xl pointer-events-none`}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-[0.14] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(#94A3B8 1px, transparent 1px)',
          backgroundSize: '18px 18px',
        }}
      />

      {/* Top Row: Institutional Monogram Emblem & Category Label */}
      <div className="relative z-10 flex items-center justify-between gap-3">
        <div className="inline-flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-white/10 backdrop-blur-md border border-white/15 flex items-center justify-center font-['Outfit'] font-extrabold text-[11px] text-white tracking-wider">
            {monogram}
          </div>
          <span className="text-[11px] font-medium text-slate-300">
            {item.category}
          </span>
        </div>

        <span className="text-[10px] font-mono text-slate-300/90 bg-white/[0.07] px-2.5 py-0.5 rounded-full border border-white/10">
          Live Portal
        </span>
      </div>

      {/* Center Editorial Typography */}
      <div className="relative z-10 my-auto py-2">
        <div className="text-[10px] uppercase tracking-[0.14em] text-blue-300/90 font-semibold mb-1">
          {item.clientName || item.location || 'Institutional Deployment'}
        </div>
        <h4 className="font-['Outfit'] font-extrabold text-base sm:text-lg text-white tracking-tight leading-snug">
          {item.title}
        </h4>
      </div>

      {/* Bottom Domain Strip */}
      <div className="relative z-10 pt-2.5 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-300">
        <span className="font-mono text-slate-300">
          {formatDisplayDomain(item.url)}
        </span>
        <span className="inline-flex items-center gap-1 text-white font-semibold group-hover:translate-x-0.5 transition-transform">
          <span>Preview</span>
          <ArrowUpRight className="w-3.5 h-3.5 text-blue-300" />
        </span>
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
    sectionTitle: 'Websites & Digital Portals We’ve Built',
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
    const msg = `Hello ELEVATE,\n\nI saw "${item.title}" (${cleanUrl}) in your Built Websites showcase and would like to build a similar website for our organization.\n\nPlease share the details and pricing.`;
    openWhatsAppMessage(msg);
  };

  return (
    <section
      id="portfolio"
      className="py-14 sm:py-20 bg-[#FFFFFF] text-[#0F172A] scroll-mt-16 relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Editorial Section Header (Admin button hidden from public visitors; only shown when authenticated) */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-7 sm:mb-9">
          <div className="max-w-2xl">
            <div className="text-[11px] font-bold tracking-[0.14em] uppercase text-[#2563EB] mb-2">
              {portfolio.sectionBadge || 'SELECTED WORK & LIVE DEPLOYMENTS'}
            </div>

            <h2 className="font-['Outfit'] font-extrabold text-2xl sm:text-3xl lg:text-4xl text-[#0F172A] tracking-tight leading-tight">
              {portfolio.sectionTitle || 'Websites Built by ELEVATE'}
            </h2>

            <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed max-w-xl">
              Live production websites and institutional portals crafted for schools, madrasas, and modern organizations.
            </p>
          </div>

          {isAuthenticated && onOpenAdminPortfolio && (
            <button
              type="button"
              onClick={onOpenAdminPortfolio}
              className="self-start sm:self-auto inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#F4F6FB] hover:bg-blue-50 text-xs font-semibold text-slate-600 hover:text-[#2563EB] transition-colors cursor-pointer"
            >
              <Settings className="w-3.5 h-3.5" />
              <span>Edit Portfolio</span>
            </button>
          )}
        </div>

        {/* Clean Segmented Category Filter Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-6 sm:mb-8 no-scrollbar">
          <div className="inline-flex items-center gap-1 p-1 rounded-xl bg-[#F4F6FB]">
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
                  className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-white text-[#0F172A] shadow-[0_2px_8px_-2px_rgba(15,23,42,0.1)]'
                      : 'text-slate-600 hover:text-[#0F172A]'
                  }`}
                >
                  <span>{category}</span>
                  <span
                    className={`text-[10px] font-mono tabular-nums ${
                      isActive ? 'text-[#2563EB]' : 'text-slate-400'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Portfolio Browser Cards: Horizontal Snap Carousel on Mobile, 3-Col Grid on Desktop */}
        {filteredItems.length === 0 ? (
          <div className="rounded-2xl bg-[#F4F6FB] p-8 text-center max-w-lg mx-auto my-4">
            <Globe className="w-8 h-8 text-[#2563EB] mx-auto mb-2.5 opacity-80" />
            <h3 className="font-['Outfit'] font-bold text-lg text-[#0F172A] mb-1">
              No projects in this category yet
            </h3>
            <p className="text-xs text-slate-500">
              Switch categories above to explore our live institutional deployments.
            </p>
          </div>
        ) : (
          <div className="flex md:grid md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 overflow-x-auto md:overflow-visible snap-x snap-mandatory pb-4 md:pb-0 -mx-4 px-4 md:mx-0 md:px-0 no-scrollbar">
            <AnimatePresence mode="popLayout">
              {filteredItems.map((item) => {
                const fullUrl = ensureHttps(item.url);
                const domainOnly = formatDisplayDomain(item.url);
                const hasValidScreenshot =
                  Boolean(item.screenshot && item.screenshot.trim()) && !failedImages[item.id];

                return (
                  <motion.article
                    layout
                    key={item.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ duration: 0.2 }}
                    className="w-[85vw] max-w-[340px] sm:w-[350px] md:w-auto md:max-w-none shrink-0 snap-center group rounded-2xl bg-white border border-slate-200/70 hover:border-slate-300 transition-all duration-200 flex flex-col justify-between overflow-hidden shadow-[0_10px_30px_-10px_rgba(15,23,42,0.08)] hover:shadow-[0_18px_38px_-12px_rgba(15,23,42,0.14)]"
                  >
                    <div>
                      {/* Clean macOS Browser Top Bar */}
                      <div className="px-3.5 py-2.5 bg-[#F4F6FB] border-b border-slate-200/70 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-1.5 shrink-0">
                          <span className="w-2.5 h-2.5 rounded-full bg-slate-300 group-hover:bg-rose-400 transition-colors" />
                          <span className="w-2.5 h-2.5 rounded-full bg-slate-300 group-hover:bg-amber-400 transition-colors" />
                          <span className="w-2.5 h-2.5 rounded-full bg-slate-300 group-hover:bg-emerald-400 transition-colors" />
                        </div>

                        <a
                          href={fullUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 min-w-0 px-2.5 py-1 rounded-md bg-white text-[11px] font-mono text-slate-600 hover:text-[#2563EB] flex items-center justify-between gap-1.5 transition-colors shadow-[0_1px_2px_rgba(15,23,42,0.04)]"
                          title={`Open ${fullUrl}`}
                        >
                          <span className="flex items-center gap-1.5 min-w-0">
                            <Lock className="w-2.5 h-2.5 text-emerald-600 shrink-0" />
                            <span className="truncate">{domainOnly}</span>
                          </span>
                          <ExternalLink className="w-2.5 h-2.5 text-slate-400 group-hover:text-[#2563EB] shrink-0" />
                        </a>
                      </div>

                      {/* Browser Viewport Area (16:10 Showcase Ratio) */}
                      <a
                        href={fullUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block relative aspect-[16/10] w-full bg-[#0F172A] overflow-hidden"
                      >
                        {hasValidScreenshot ? (
                          <img
                            src={item.screenshot}
                            alt={`${item.title} live website screenshot`}
                            referrerPolicy="no-referrer"
                            onError={() =>
                              setFailedImages((prev) => ({ ...prev, [item.id]: true }))
                            }
                            className="w-full h-full object-cover object-top group-hover:scale-103 transition-transform duration-500"
                          />
                        ) : (
                          <ArtisticStudioShowcaseFallback item={item} />
                        )}
                      </a>

                      {/* Editorial Card Body — Unboxed Metadata & Clean Wrapping */}
                      <div className="p-5">
                        <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1.5 flex-wrap">
                          <span className="font-semibold text-[#2563EB]">{item.category}</span>
                          {(item.location || item.clientName) && (
                            <>
                              <span aria-hidden="true">·</span>
                              <span className="text-slate-500">
                                {item.location || item.clientName}
                              </span>
                            </>
                          )}
                        </div>

                        <h3 className="font-['Outfit'] font-bold text-lg text-[#0F172A] group-hover:text-[#2563EB] transition-colors leading-snug mb-1.5">
                          <a
                            href={fullUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {item.title}
                          </a>
                        </h3>

                        <p className="text-xs sm:text-[13px] text-slate-600 leading-relaxed">
                          {item.description}
                        </p>

                        {item.tags && item.tags.length > 0 && (
                          <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-slate-500">
                            {item.tags.slice(0, 3).map((tag, idx) => (
                              <React.Fragment key={idx}>
                                <span>{tag}</span>
                                {idx < Math.min(item.tags!.length, 3) - 1 && (
                                  <span aria-hidden="true" className="text-slate-300">
                                    ·
                                  </span>
                                )}
                              </React.Fragment>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Card Footer Actions */}
                    <div className="px-5 pb-5 pt-1 flex items-center gap-2.5">
                      <a
                        href={fullUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 py-2.5 px-4 rounded-xl bg-[#0F172A] hover:bg-[#2563EB] text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all active:scale-98 whitespace-nowrap"
                      >
                        <span>Visit Live Site</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </a>

                      <button
                        type="button"
                        onClick={() => handleBuildSimilar(item)}
                        className="py-2.5 px-3.5 rounded-xl bg-[#F4F6FB] hover:bg-blue-50 text-slate-700 hover:text-[#2563EB] text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-98 whitespace-nowrap"
                        title={`Enquire on WhatsApp to build a site like ${item.title}`}
                      >
                        <MessageCircle className="w-3.5 h-3.5 text-[#2563EB]" />
                        <span>Build Similar</span>
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
