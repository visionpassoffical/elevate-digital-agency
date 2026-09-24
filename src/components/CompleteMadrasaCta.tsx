import React from 'react';
import { BookOpen, MessageCircle, ArrowRight, CheckCircle2, Sparkles } from 'lucide-react';
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
      formatGeneralInquiryMessage('Complete Madrasa Digital Setup & Specialized Institutional Work')
    );
  };

  return (
    <section
      id="madrasa-solutions"
      className="py-20 sm:py-28 bg-[#090D16] text-white border-b border-white/10 scroll-mt-20 relative overflow-hidden"
    >
      {/* Background ambient glow */}
      <div 
        aria-hidden="true" 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-blue-600/[0.08] blur-[150px] rounded-full pointer-events-none" 
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="bg-gradient-to-br from-white/[0.06] to-white/[0.02] border border-white/15 rounded-3xl p-6 sm:p-10 lg:p-12 shadow-2xl backdrop-blur-xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            
            {/* Left 7 cols: Content */}
            <div className="lg:col-span-7 space-y-5">
              <div className="inline-flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-[#3B82F6] rounded-full shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
                <span className="text-[11px] font-bold tracking-widest uppercase text-blue-300">
                  SPECIALIZED INSTITUTIONAL PROGRAM
                </span>
              </div>

              <h2 className="font-['Outfit'] font-extrabold text-2xl sm:text-3xl lg:text-4xl text-white tracking-tight leading-tight">
                Complete Madrasa Digital Setup & Specialized Work
              </h2>

              <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
                Need a comprehensive institutional digital deployment? We unite modern responsive websites, admissions, typed exam papers, student ID cards, and annual publications into a cohesive workflow that respects institutional dignity.
              </p>

              {/* Highlights grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {HIGHLIGHTS.map((item) => (
                  <div key={item} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-[#60A5FA] shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right 5 cols: Direct Actions */}
            <div className="lg:col-span-5 bg-[#070A11] border border-white/10 rounded-2xl p-6 sm:p-7 space-y-4">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Direct WhatsApp Consultation
              </div>

              <div className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Tell us about your madrasa, school or custom requirements. We will review and provide a structured quote on WhatsApp within hours.
              </div>

              <div className="pt-2 flex flex-col gap-3">
                <button
                  id="btn-madrasa-setup-whatsapp"
                  type="button"
                  onClick={handleDiscussMadrasa}
                  className="w-full py-3.5 px-5 rounded-xl font-bold text-xs sm:text-sm text-white bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] hover:from-[#3B82F6] hover:to-[#2563EB] active:scale-[0.98] transition-all shadow-[0_0_20px_-3px_rgba(37,99,235,0.6)] flex items-center justify-center gap-2 cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Discuss Madrasa Setup</span>
                </button>

                <button
                  id="btn-madrasa-custom-quote"
                  type="button"
                  onClick={() => onOpenQuote('Complete Madrasa / Custom Work')}
                  className="w-full py-3 px-4 rounded-xl font-bold text-xs text-slate-200 hover:text-white hover:bg-white/[0.08] bg-white/[0.04] border border-white/10 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Request Custom Institutional Quote</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                </button>
              </div>

              <div className="pt-1 text-[11px] text-slate-400 text-center font-mono">
                WhatsApp Business: +91 94971 22397
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};
