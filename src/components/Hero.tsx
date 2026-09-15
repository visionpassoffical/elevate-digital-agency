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
    <section className="relative pt-24 pb-20 sm:pt-32 sm:pb-28 lg:pt-40 lg:pb-32 bg-white border-b border-slate-100 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        
        {/* Clear Primary Value Positioning Pill */}
        <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-slate-50 border border-slate-200 mb-8 mx-auto">
          <span className="w-2 h-2 rounded-full bg-[#0062EB]" />
          <span className="font-['Outfit'] font-bold text-xs text-[#0B0F17] tracking-widest uppercase">
            {heroData.pillElevateText || 'ELEVATE'}
          </span>
          <span className="text-slate-300">|</span>
          <span className="text-xs font-semibold text-slate-600">
            {heroData.pillSubtitle || 'Affordable digital solutions for institutions and businesses'}
          </span>
        </div>

        {/* Main Display Heading */}
        <h1 className="font-['Outfit'] font-extrabold text-5xl sm:text-6xl lg:text-7xl text-[#0B0F17] tracking-tight leading-[1.1] max-w-4xl mx-auto mb-8">
          {heroData.heading ? (
            <>
              {heroData.heading}{' '}
              <span className="text-[#0062EB]">
                {heroData.headingHighlight || 'Elevate.'}
              </span>
            </>
          ) : (
            <>
              Digital Solutions Crafted to Help You{' '}
              <span className="text-[#0062EB]">
                Elevate.
              </span>
            </>
          )}
        </h1>

        {/* Supporting Text */}
        <p className="text-lg sm:text-xl text-slate-500 font-normal leading-relaxed max-w-2xl mx-auto mb-10">
          {heroData.description || 'Professional websites, admission setups, automated exam suites, and monthly creative design — made practical, fast, and transparently priced.'}
        </p>

        {/* Primary Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <a
            id="hero-whatsapp-direct-link"
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-colors cursor-pointer"
          >
            <MessageCircle className="w-5 h-5" />
            <span>{heroData.ctaWhatsAppText || 'Continue on WhatsApp'}</span>
          </a>
          <button
            id="hero-get-quote-button"
            onClick={onOpenQuote}
            type="button"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 text-sm font-bold text-[#0B0F17] bg-white border border-slate-300 hover:bg-slate-50 hover:border-slate-400 rounded-xl transition-colors cursor-pointer shadow-sm"
          >
            <span>{heroData.ctaQuoteText || 'Get a Quote'}</span>
            <ArrowUpRight className="w-5 h-5 text-[#0062EB]" />
          </button>
        </div>

        {/* INTEGRATED PRICING HIGHLIGHTS BAR */}
        <div className="max-w-3xl mx-auto border-t border-slate-100 pt-10">
          <div className="text-xs font-bold tracking-widest text-slate-400 uppercase mb-6 flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4 text-[#0062EB]" />
            <span>Transparent Starting Rates</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button
              type="button"
              onClick={() => scrollToSection('websites')}
              className="p-4 rounded-xl hover:bg-slate-50 text-left transition-colors border border-slate-200 cursor-pointer flex flex-col items-center justify-center text-center"
            >
              <div className="flex items-center gap-2 text-sm text-slate-500 mb-2">
                <Globe className="w-4 h-4 text-[#0062EB]" />
                <span className="font-medium">Websites</span>
              </div>
              <div className="font-['Outfit'] font-extrabold text-xl text-[#0B0F17]">
                {websiteStartPrice}
              </div>
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('admission')}
              className="p-4 rounded-xl hover:bg-slate-50 text-left transition-colors border border-slate-200 cursor-pointer flex flex-col items-center justify-center text-center"
            >
              <div className="flex items-center gap-2 text-sm text-slate-500 mb-2">
                <FileText className="w-4 h-4 text-[#0062EB]" />
                <span className="font-medium">Admission</span>
              </div>
              <div className="font-['Outfit'] font-extrabold text-xl text-[#0B0F17]">
                {admissionPrice}
              </div>
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('exam')}
              className="p-4 rounded-xl hover:bg-slate-50 text-left transition-colors border border-slate-200 cursor-pointer flex flex-col items-center justify-center text-center"
            >
              <div className="flex items-center gap-2 text-sm text-slate-500 mb-2">
                <Award className="w-4 h-4 text-[#0062EB]" />
                <span className="font-medium">Exams</span>
              </div>
              <div className="font-['Outfit'] font-extrabold text-xl text-[#0B0F17]">
                {examPrice}
              </div>
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('monthly')}
              className="p-4 rounded-xl hover:bg-slate-50 text-left transition-colors border border-slate-200 cursor-pointer flex flex-col items-center justify-center text-center"
            >
              <div className="flex items-center gap-2 text-sm text-slate-500 mb-2">
                <Palette className="w-4 h-4 text-[#0062EB]" />
                <span className="font-medium">Creatives</span>
              </div>
              <div className="font-['Outfit'] font-extrabold text-xl text-[#0B0F17]">
                {monthlyPrice}
              </div>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};


