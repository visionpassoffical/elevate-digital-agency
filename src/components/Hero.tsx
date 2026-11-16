import React from 'react';
import { ArrowRight, MessageCircle } from 'lucide-react';
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
  const heroData = content.hero;

  const rawWebPrice = content.websitePlans?.[0]?.price || '₹999';
  const websiteStartPrice = rawWebPrice.includes('/')
    ? ensureRupee(rawWebPrice)
    : `${ensureRupee(rawWebPrice)}/yr`;

  const admissionPrice = content.admissionServices?.package
    ? ensureRupee(content.admissionServices.package.price)
    : '₹449';

  const examPrice = content.examServices?.package
    ? ensureRupee(content.examServices.package.price)
    : '₹499';

  const monthlyPrice = content.monthlyCreativePlans?.plans?.[0]
    ? `${ensureRupee(content.monthlyCreativePlans.plans[0].price)}/mo`
    : '₹499/mo';

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const headerOffset = 72;
      const elPos = el.getBoundingClientRect().top;
      const offsetPos = elPos + window.pageYOffset - headerOffset;
      window.scrollTo({ top: offsetPos, behavior: 'smooth' });
    }
  };

  const handlePriceJump = (tab: ServiceTabKey) => {
    if (onSelectServiceTab) {
      onSelectServiceTab(tab);
    }
    scrollToSection('services');
  };

  const handleWhatsAppHero = () => {
    const msg = formatWhatsAppTemplate('generalEnquiry', {});
    openWhatsAppMessage(msg);
  };

  const rateItems: Array<{ label: string; price: string; tab: ServiceTabKey }> = [
    { label: 'Websites', price: websiteStartPrice, tab: 'websites' },
    { label: 'Admission', price: admissionPrice, tab: 'admission' },
    { label: 'Exams', price: examPrice, tab: 'exam' },
    { label: 'Creatives', price: monthlyPrice, tab: 'creative' },
  ];

  return (
    <section className="relative pt-24 pb-12 sm:pt-30 sm:pb-16 lg:pt-34 lg:pb-20 bg-[#FFFFFF] text-[#0F172A] overflow-hidden">
      {/* Architectural Dot-Grid & Soft Radial Blue/Indigo Studio Glow */}
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.55]"
          style={{
            backgroundImage: 'radial-gradient(#CBD5E1 1px, transparent 1px)',
            backgroundSize: '24px 24px',
            maskImage: 'radial-gradient(ellipse 80% 70% at 50% 25%, #000 40%, transparent 100%)',
            WebkitMaskImage: 'radial-gradient(ellipse 80% 70% at 50% 25%, #000 40%, transparent 100%)',
          }}
        />
        <div className="absolute -top-28 left-1/2 -translate-x-1/2 w-[680px] sm:w-[920px] h-[360px] bg-gradient-to-tr from-[#2563EB]/14 via-indigo-500/10 to-sky-400/5 blur-3xl rounded-full" />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        {/* Crisp Eyebrow Pill — Clean Wrapping, Zero Truncation */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="inline-flex items-center justify-center px-3.5 py-1.5 rounded-full bg-[#F4F6FB] border border-slate-200/80 mb-5 shadow-[0_2px_10px_-3px_rgba(15,23,42,0.05)]"
        >
          <span className="font-['Outfit'] font-bold text-[10px] sm:text-[11px] text-[#2563EB] tracking-[0.12em] uppercase">
            DIGITAL STUDIO FOR INSTITUTIONS &amp; BUSINESSES
          </span>
        </motion.div>

        {/* Bold Tight-Tracked Editorial Display Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.04 }}
          className="font-['Outfit'] font-extrabold text-[2.15rem] sm:text-5xl lg:text-[3.65rem] tracking-[-0.03em] leading-[1.08] max-w-3xl mx-auto mb-4 text-[#0F172A] text-balance"
        >
          {heroData.heading || 'Digital solutions that move your institution'}{' '}
          <span className="bg-gradient-to-r from-[#2563EB] to-indigo-600 bg-clip-text text-transparent">
            {heroData.headingHighlight || 'forward.'}
          </span>
        </motion.h1>

        {/* Concise 2-Line Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.08 }}
          className="text-sm sm:text-base lg:text-[17px] text-slate-600 font-normal leading-relaxed max-w-xl mx-auto mb-7"
        >
          Turnkey institutional websites, admission suites, typed exam papers, and monthly design retainers delivered in 48–72 hours.
        </motion.p>

        {/* 2 Balanced Primary & Secondary Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.12 }}
          className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 max-w-sm sm:max-w-none mx-auto mb-8 sm:mb-10"
        >
          <button
            type="button"
            onClick={handleWhatsAppHero}
            className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-xs sm:text-sm font-bold text-white bg-[#2563EB] hover:bg-[#1D4ED8] active:scale-[0.98] rounded-xl shadow-[0_10px_25px_-6px_rgba(37,99,235,0.45)] transition-all cursor-pointer whitespace-nowrap"
          >
            <MessageCircle className="w-4 h-4 shrink-0" />
            <span>Chat on WhatsApp</span>
          </button>

          <button
            type="button"
            onClick={() => scrollToSection('portfolio')}
            className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-xs sm:text-sm font-bold text-[#0F172A] bg-white hover:bg-[#F4F6FB] border border-slate-300/90 hover:border-slate-400 active:scale-[0.98] rounded-xl shadow-[0_4px_14px_-4px_rgba(15,23,42,0.06)] transition-all cursor-pointer whitespace-nowrap"
          >
            <span>View Built Sites</span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-500 shrink-0" />
          </button>
        </motion.div>

        {/* Unified Starting Rates Strip (Replaces 4 Boxy Price Cards) */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.16 }}
          className="inline-flex flex-wrap items-center justify-center gap-x-2 gap-y-1.5 px-4 sm:px-5 py-2.5 rounded-2xl bg-[#F4F6FB] border border-slate-200/70 text-xs sm:text-[13px] text-slate-600 mx-auto"
        >
          {rateItems.map((item, idx) => (
            <React.Fragment key={item.tab}>
              <button
                type="button"
                onClick={() => handlePriceJump(item.tab)}
                className="inline-flex items-center gap-1.5 py-0.5 px-1.5 rounded-lg hover:bg-white hover:text-[#2563EB] transition-colors cursor-pointer group"
              >
                <span className="font-medium text-slate-600 group-hover:text-[#2563EB] transition-colors">
                  {item.label}
                </span>
                <span className="font-['Outfit'] font-bold text-[#0F172A] group-hover:text-[#2563EB] tabular-nums transition-colors">
                  {item.price}
                </span>
              </button>
              {idx < rateItems.length - 1 && (
                <span aria-hidden="true" className="text-slate-300 select-none">
                  •
                </span>
              )}
            </React.Fragment>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
