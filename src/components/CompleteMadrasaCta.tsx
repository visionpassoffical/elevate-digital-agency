import React from 'react';
import { BookOpen, MessageCircle, ArrowRight, CheckCircle2 } from 'lucide-react';
import { openWhatsApp, formatGeneralInquiryMessage } from '../utils/whatsapp';

interface CompleteMadrasaCtaProps {
  onOpenQuote: (context?: string) => void;
}

const HIGHLIGHTS = [
  'Dignified Arabic & multi-lingual typography precision',
  'Complete online admission registration & printable application forms',
  'Formatted question papers, timetables & verified student ID cards',
  'Prospectus layouts, event souvenirs & monthly announcement creatives',
];

export const CompleteMadrasaCta: React.FC<CompleteMadrasaCtaProps> = ({ onOpenQuote }) => {
  const handleDiscussMadrasa = () => {
    openWhatsApp(
      formatGeneralInquiryMessage('Complete Madrasa Digital Setup & Institutional Work')
    );
  };

  return (
    <section
      id="madrasa-solutions"
      className="py-12 sm:py-16 lg:py-20 bg-[#0B0F17] text-white border-b border-slate-800 scroll-mt-20 relative overflow-hidden"
    >
      {/* Subtle ambient lighting */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#0062EB]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10 shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-center">
            
            {/* Left 7 cols: Content */}
            <div className="lg:col-span-7 space-y-4 sm:space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-slate-800 border border-slate-700 text-[#0EA5E9] text-xs font-bold uppercase tracking-wider">
                <BookOpen className="w-3.5 h-3.5" />
                <span>COMPLETE MADRASA & CUSTOM WORK</span>
              </div>

              <h2 className="font-['Outfit'] font-extrabold text-2xl sm:text-3xl lg:text-4xl text-white tracking-tight leading-tight">
                Complete Madrasa Digital Setup or Specialized Work
              </h2>

              <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
                Need a comprehensive institutional setup? We unite modern responsive websites, admissions, typed exam papers, student ID cards, and annual publications into a cohesive digital workflow that respects institutional dignity.
              </p>

              {/* Highlights grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
                {HIGHLIGHTS.map((item) => (
                  <div key={item} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right 5 cols: Direct Actions */}
            <div className="lg:col-span-5 bg-slate-950/70 border border-slate-800 rounded-2xl p-5 sm:p-7 space-y-4">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Direct WhatsApp Scoping
              </div>

              <div className="text-sm text-slate-300 leading-relaxed">
                Tell us about your madrasa, school or custom requirements. We will review and provide a structured quote on WhatsApp within hours.
              </div>

              <div className="pt-2 flex flex-col gap-3">
                <button
                  id="btn-madrasa-setup-whatsapp"
                  type="button"
                  onClick={handleDiscussMadrasa}
                  className="w-full py-3.5 px-6 rounded-xl font-bold text-sm text-white bg-emerald-600 hover:bg-emerald-500 active:scale-[0.98] transition-all shadow-md flex items-center justify-center gap-2.5 cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4 fill-white/20" />
                  <span>Discuss Madrasa Setup</span>
                </button>

                <button
                  id="btn-madrasa-custom-quote"
                  type="button"
                  onClick={() => onOpenQuote('Complete Madrasa / Custom Work')}
                  className="w-full py-3 px-6 rounded-xl font-bold text-xs text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-700 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Request Custom Institutional Quote</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="pt-2 text-[11px] text-slate-500 text-center">
                Dedicated WhatsApp line: +91 94971 22397
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};
