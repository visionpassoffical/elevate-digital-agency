import React from 'react';
import { ArrowUpRight, MessageCircle, Globe, FileText, Award, Palette, Sparkles } from 'lucide-react';
import { useContent } from '../context/ContentContext';

interface HeroProps {
  onOpenQuote: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenQuote }) => {
  const { content, getWhatsAppUrl } = useContent();
  const heroData = content.hero;
  const whatsappUrl = getWhatsAppUrl(content.whatsappSettings?.templates?.generalEnquiry || 'Hello ELEVATE, I would like to enquire about your digital services.');
  const displayPhone = content.contact.whatsappNumber;

  const websiteStartPrice = content.websitePlans[0]?.price || '₹999/yr';
  const admissionPrice = content.admissionServices.package ? `₹${content.admissionServices.package.price}` : '₹449';
  const examPrice = content.examServices.package ? `₹${content.examServices.package.price}` : '₹499';
  const monthlyPrice = content.monthlyCreativePlans.plans[0] ? `₹${content.monthlyCreativePlans.plans[0].price}/mo` : '₹499/mo';

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const headerOffset = 80;
      const elPos = el.getBoundingClientRect().top;
      const offsetPos = elPos + window.pageYOffset - headerOffset;
      window.scrollTo({ top: offsetPos, behavior: 'smooth' });
    }
  };

  return (
    <section className="relative pt-24 pb-16 sm:pt-32 sm:pb-24 lg:pt-36 lg:pb-28 bg-white border-b border-slate-200/80 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        
        {/* Clear Primary Value Positioning Pill */}
        <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-slate-50 border border-slate-200 mb-8 mx-auto">
          <span className="w-2 h-2 rounded-full bg-[#2563EB]" />
          <span className="font-['Outfit'] font-bold text-[11px] text-[#0F172A] tracking-wider uppercase">
            {heroData.pillElevateText || 'ELEVATE'}
          </span>
          <span className="text-slate-300">|</span>
          <span className="text-xs font-semibold text-slate-600">
            {heroData.pillSubtitle || 'Affordable digital solutions for institutions and businesses'}
          </span>
        </div>

        {/* Main Display Heading */}
        <h1 className="font-['Outfit'] font-extrabold text-4xl sm:text-6xl lg:text-7xl text-[#0F172A] tracking-tight leading-[1.08] max-w-4xl mx-auto mb-6 sm:mb-8">
          {heroData.heading ? (
            <>
              {heroData.heading}{' '}
              <span className="text-[#2563EB]">
                {heroData.headingHighlight || 'Elevate.'}
              </span>
            </>
          ) : (
            <>
              Digital Solutions Crafted to Help You{' '}
              <span className="text-[#2563EB]">
                Elevate.
              </span>
            </>
          )}
        </h1>

        {/* Supporting Text */}
        <p className="text-base sm:text-lg text-slate-600 font-normal leading-relaxed max-w-2xl mx-auto mb-8 sm:mb-10">
          {heroData.description || 'Professional websites, admission setups, automated exam suites, and monthly creative design — made practical, fast, and transparently priced.'}
        </p>

        {/* Primary Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 mb-14 sm:mb-16">
          <a
            id="hero-whatsapp-direct-link"
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] rounded-xl transition-all cursor-pointer shadow-xs"
          >
            <MessageCircle className="w-4 h-4" />
            <span>{heroData.ctaWhatsAppText || 'Continue on WhatsApp'}</span>
          </a>
          <button
            id="hero-get-quote-button"
            onClick={onOpenQuote}
            type="button"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 text-sm font-bold text-[#0F172A] bg-white border border-slate-200 hover:bg-slate-50 hover:border-slate-300 active:scale-[0.98] rounded-xl transition-all cursor-pointer shadow-xs"
          >
            <span>{heroData.ctaQuoteText || 'Get a Quote'}</span>
            <ArrowUpRight className="w-4 h-4 text-[#2563EB]" />
          </button>
        </div>

        {/* INTEGRATED PRICING HIGHLIGHTS BAR */}
        <div className="max-w-3xl mx-auto border-t border-slate-100 pt-8 sm:pt-10">
          <div className="text-[11px] font-bold tracking-widest text-slate-400 uppercase mb-5 flex items-center justify-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-[#2563EB]" />
            <span>Transparent Starting Rates</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            <button
              type="button"
              onClick={() => scrollToSection('websites')}
              className="p-3.5 sm:p-4 rounded-xl bg-white hover:bg-slate-50/80 transition-all border border-slate-200/80 hover:border-[#2563EB]/40 hover:shadow-xs cursor-pointer flex flex-col items-center justify-center text-center group"
            >
              <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1.5">
                <Globe className="w-3.5 h-3.5 text-[#2563EB]" />
                <span className="font-semibold">Websites</span>
              </div>
              <div className="font-['Outfit'] font-extrabold text-lg sm:text-xl text-[#0F172A] group-hover:text-[#2563EB] transition-colors">
                {websiteStartPrice}
              </div>
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('admission')}
              className="p-3.5 sm:p-4 rounded-xl bg-white hover:bg-slate-50/80 transition-all border border-slate-200/80 hover:border-[#2563EB]/40 hover:shadow-xs cursor-pointer flex flex-col items-center justify-center text-center group"
            >
              <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1.5">
                <FileText className="w-3.5 h-3.5 text-[#2563EB]" />
                <span className="font-semibold">Admission</span>
              </div>
              <div className="font-['Outfit'] font-extrabold text-lg sm:text-xl text-[#0F172A] group-hover:text-[#2563EB] transition-colors">
                {admissionPrice}
              </div>
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('exam')}
              className="p-3.5 sm:p-4 rounded-xl bg-white hover:bg-slate-50/80 transition-all border border-slate-200/80 hover:border-[#2563EB]/40 hover:shadow-xs cursor-pointer flex flex-col items-center justify-center text-center group"
            >
              <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1.5">
                <Award className="w-3.5 h-3.5 text-[#2563EB]" />
                <span className="font-semibold">Exams</span>
              </div>
              <div className="font-['Outfit'] font-extrabold text-lg sm:text-xl text-[#0F172A] group-hover:text-[#2563EB] transition-colors">
                {examPrice}
              </div>
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('monthly')}
              className="p-3.5 sm:p-4 rounded-xl bg-white hover:bg-slate-50/80 transition-all border border-slate-200/80 hover:border-[#2563EB]/40 hover:shadow-xs cursor-pointer flex flex-col items-center justify-center text-center group"
            >
              <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1.5">
                <Palette className="w-3.5 h-3.5 text-[#2563EB]" />
                <span className="font-semibold">Creatives</span>
              </div>
              <div className="font-['Outfit'] font-extrabold text-lg sm:text-xl text-[#0F172A] group-hover:text-[#2563EB] transition-colors">
                {monthlyPrice}
              </div>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};


