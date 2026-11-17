import React from 'react';
import { ArrowDownRight, ArrowUpRight, MessageCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { useContent } from '../context/ContentContext';
import { ensureRupee } from '../utils/whatsapp';
import type { ServiceTabKey } from './Header';

interface HeroProps {
  onOpenQuote: () => void;
  onSelectServiceTab?: (tab: ServiceTabKey) => void;
}

export const Hero: React.FC<HeroProps> = ({ onSelectServiceTab }) => {
  const { content, openWhatsAppMessage, formatWhatsAppTemplate } = useContent();

  const rawWebPrice = content.websitePlans?.[0]?.price || '₹999';
  const websiteStartPrice = rawWebPrice.includes('/')
    ? ensureRupee(rawWebPrice)
    : `${ensureRupee(rawWebPrice)}/yr`;

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const headerOffset = 72;
      const elPos = el.getBoundingClientRect().top;
      const offsetPos = elPos + window.pageYOffset - headerOffset;
      window.scrollTo({ top: offsetPos, behavior: 'smooth' });
    }
  };

  const handleJumpToTab = (tab: ServiceTabKey) => {
    if (onSelectServiceTab) {
      onSelectServiceTab(tab);
    }
    scrollToSection('services');
  };

  const handleWhatsAppHero = () => {
    const msg = formatWhatsAppTemplate('generalEnquiry', {});
    openWhatsAppMessage(msg);
  };

  return (
    <section className="relative pt-26 pb-12 sm:pt-34 sm:pb-16 lg:pt-38 lg:pb-20 bg-[#FFFFFF] text-[#09090B] border-b border-slate-200/80 overflow-hidden">
      {/* Subtle Architectural Grid & Soft Electric-Blue Radial Ambient Light */}
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.45]"
          style={{
            backgroundImage:
              'linear-gradient(to right, rgba(226,232,240,0.6) 1px, transparent 1px), linear-gradient(to bottom, rgba(226,232,240,0.6) 1px, transparent 1px)',
            backgroundSize: '56px 56px',
            maskImage: 'radial-gradient(ellipse 90% 75% at 25% 15%, #000 30%, transparent 100%)',
            WebkitMaskImage:
              'radial-gradient(ellipse 90% 75% at 25% 15%, #000 30%, transparent 100%)',
          }}
        />
        <div className="absolute -top-36 -left-24 w-[620px] sm:w-[880px] h-[420px] bg-gradient-to-br from-[#2563EB]/12 via-blue-400/6 to-transparent blur-3xl rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 relative z-10">
        {/* Confident Left-Aligned Editorial Layout */}
        <div className="max-w-4xl">
          {/* Top Live Studio Badge */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="inline-flex items-center gap-2.5 mb-5 sm:mb-6"
          >
            <span className="relative flex h-2 w-2 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="font-['Outfit'] font-bold text-[11px] sm:text-xs text-slate-600 tracking-[0.14em] uppercase">
              ELEVATE STUDIO • WEB, MARKETING &amp; INSTITUTIONAL SYSTEMS
            </span>
          </motion.div>

          {/* Large Authoritative Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.04 }}
            className="font-['Outfit'] font-extrabold text-[2.35rem] sm:text-6xl lg:text-[4.35rem] tracking-[-0.035em] leading-[1.04] text-[#09090B] mb-5 sm:mb-6"
          >
            We Build High-Converting Websites &amp;{' '}
            <span className="text-[#2563EB]">Digital Brands.</span>
          </motion.h1>

          {/* Crisp Editorial Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.08 }}
            className="text-base sm:text-lg lg:text-xl text-slate-600 font-normal leading-relaxed max-w-2xl mb-8 sm:mb-10"
          >
            ELEVATE crafts bespoke institutional &amp; business websites, digital marketing creatives, admission funnels, and academic systems with 48–72h turnaround.
          </motion.p>

          {/* 2 Clean Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.12 }}
            className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 mb-12 sm:mb-16"
          >
            <button
              type="button"
              onClick={handleWhatsAppHero}
              className="inline-flex items-center justify-center gap-2.5 px-7 py-4 text-xs sm:text-sm font-bold text-white bg-[#09090B] hover:bg-[#2563EB] active:scale-[0.99] rounded-full transition-colors cursor-pointer"
            >
              <MessageCircle className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Start a Project on WhatsApp</span>
              <ArrowUpRight className="w-4 h-4 text-slate-400 shrink-0" />
            </button>

            <button
              type="button"
              onClick={() => scrollToSection('portfolio')}
              className="inline-flex items-center justify-center gap-2 px-7 py-4 text-xs sm:text-sm font-bold text-[#09090B] bg-transparent hover:bg-[#F5F5F7] border border-slate-300 hover:border-[#09090B] active:scale-[0.99] rounded-full transition-all cursor-pointer"
            >
              <span>See Selected Work</span>
              <ArrowDownRight className="w-4 h-4 text-[#2563EB] shrink-0" />
            </button>
          </motion.div>
        </div>

        {/* Clean Editorial KPI / Capabilities Strip Separated by 1px Hairline Dividers */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.16 }}
          className="pt-8 border-t border-slate-200/80 grid grid-cols-3 gap-4 sm:gap-8 divide-x divide-slate-200/80"
        >
          <button
            type="button"
            onClick={() => scrollToSection('how-it-works')}
            className="text-left pr-2 sm:pr-6 group cursor-pointer"
          >
            <div className="font-['Outfit'] font-extrabold text-xl sm:text-3xl text-[#09090B] group-hover:text-[#2563EB] tracking-[-0.03em] tabular-nums transition-colors">
              48h
            </div>
            <div className="text-[11px] sm:text-xs font-medium text-slate-500 mt-0.5 leading-snug">
              Launch Speed
            </div>
          </button>

          <button
            type="button"
            onClick={() => handleJumpToTab('websites')}
            className="text-left pl-4 sm:pl-8 pr-2 sm:pr-6 group cursor-pointer"
          >
            <div className="font-['Outfit'] font-extrabold text-xl sm:text-3xl text-[#09090B] group-hover:text-[#2563EB] tracking-[-0.03em] tabular-nums transition-colors">
              {websiteStartPrice}
            </div>
            <div className="text-[11px] sm:text-xs font-medium text-slate-500 mt-0.5 leading-snug">
              Turnkey Websites
            </div>
          </button>

          <button
            type="button"
            onClick={() => handleJumpToTab('creative')}
            className="text-left pl-4 sm:pl-8 group cursor-pointer"
          >
            <div className="font-['Outfit'] font-extrabold text-xl sm:text-3xl text-[#09090B] group-hover:text-[#2563EB] tracking-[-0.03em] tabular-nums transition-colors">
              100%
            </div>
            <div className="text-[11px] sm:text-xs font-medium text-slate-500 mt-0.5 leading-snug">
              Custom Design
            </div>
          </button>
        </motion.div>
      </div>
    </section>
  );
};
