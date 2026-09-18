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
      className="py-16 sm:py-20 lg:py-24 bg-[#F8FAFC] border-b border-slate-200/80 scroll-mt-20 relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 lg:p-10 shadow-xs">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left 7 cols: Content */}
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 mb-1">
                <span className="w-1.5 h-1.5 bg-[#2563EB] rounded-full" />
                <span className="text-[11px] font-bold tracking-widest uppercase text-slate-500">
                  INSTITUTIONAL SETUP
                </span>
              </div>

              <h2 className="font-['Outfit'] font-extrabold text-2xl sm:text-3xl lg:text-4xl text-[#0F172A] tracking-tight leading-tight">
                Complete Madrasa Digital Setup or Specialized Work
              </h2>

              <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
                Need a comprehensive institutional setup? We unite modern responsive websites, admissions, typed exam papers, student ID cards, and annual publications into a cohesive digital workflow that respects institutional dignity.
              </p>

              {/* Highlights grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
                {HIGHLIGHTS.map((item) => (
                  <div key={item} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-[#2563EB] shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right 5 cols: Direct Actions */}
            <div className="lg:col-span-5 bg-[#F8FAFC] border border-slate-200/90 rounded-xl p-5 sm:p-6 space-y-4">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Direct WhatsApp Consultation
              </div>

              <div className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Tell us about your madrasa, school or custom requirements. We will review and provide a structured quote on WhatsApp within hours.
              </div>

              <div className="pt-2 flex flex-col gap-2.5">
                <button
                  id="btn-madrasa-setup-whatsapp"
                  type="button"
                  onClick={handleDiscussMadrasa}
                  className="w-full py-3 px-5 rounded-xl font-bold text-xs sm:text-sm text-white bg-[#2563EB] hover:bg-blue-700 active:scale-[0.98] transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Discuss Madrasa Setup</span>
                </button>

                <button
                  id="btn-madrasa-custom-quote"
                  type="button"
                  onClick={() => onOpenQuote('Complete Madrasa / Custom Work')}
                  className="w-full py-2.5 px-4 rounded-xl font-bold text-xs text-[#0F172A] hover:bg-slate-50 bg-white border border-slate-200 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
                >
                  <span>Request Custom Institutional Quote</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                </button>
              </div>

              <div className="pt-1 text-[11px] text-slate-500 text-center">
                Dedicated WhatsApp line: +91 94971 22397
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};
