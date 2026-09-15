import React from 'react';
import { MessageCircle, ArrowRight } from 'lucide-react';
import { useContent } from '../context/ContentContext';

interface ContactSectionProps {
  onOpenQuote?: () => void;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ onOpenQuote }) => {
  const { content, openWhatsAppMessage, formatWhatsAppTemplate } = useContent();
  const contact = content.contact;

  const handleChatWithElevate = () => {
    const msg = formatWhatsAppTemplate('generalEnquiry', {});
    openWhatsAppMessage(msg);
  };

  return (
    <section
      id="contact"
      className="py-12 sm:py-16 lg:py-20 bg-[#0B0F17] text-white scroll-mt-20 relative overflow-hidden border-t border-slate-800"
    >
      {/* Ambient background glows */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#0062EB]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Final CTA Header */}
        <div className="max-w-3xl mx-auto text-center mb-8 sm:mb-10 lg:mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-800/90 border border-slate-700/80 text-blue-400 text-xs font-bold uppercase tracking-wider mb-5 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
            <span>START YOUR PROJECT</span>
          </div>

          <h2 className="font-['Outfit'] font-extrabold text-3xl sm:text-4xl md:text-5xl text-white tracking-tight mb-5 leading-tight">
            Ready to Elevate Your Digital Presence?
          </h2>

          <p className="text-base sm:text-lg md:text-xl text-slate-300 font-normal leading-relaxed max-w-2xl mx-auto mb-8">
            Tell us what you need. We&apos;ll help you choose the right solution.
          </p>

          {/* Primary CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
            <button
              id="btn-whatsapp-elevate-final"
              type="button"
              onClick={handleChatWithElevate}
              className="w-full sm:w-auto min-w-[200px] py-4 px-7 rounded-xl font-bold text-sm sm:text-base text-white bg-emerald-600 hover:bg-emerald-500 active:scale-[0.98] transition-all shadow-lg flex items-center justify-center gap-2.5 cursor-pointer"
            >
              <MessageCircle className="w-5 h-5 fill-white/20" />
              <span>{contact?.ctaText || 'WhatsApp ELEVATE'}</span>
            </button>

            {onOpenQuote && (
              <button
                id="btn-custom-quote-final"
                type="button"
                onClick={onOpenQuote}
                className="w-full sm:w-auto min-w-[200px] py-4 px-7 rounded-xl font-bold text-sm sm:text-base text-white bg-slate-800 hover:bg-slate-700 active:scale-[0.98] transition-all border border-slate-700 flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Get a Custom Quote</span>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </button>
            )}
          </div>
        </div>

        {/* Contact Details Card: Direct WhatsApp line */}
        <div className="max-w-2xl mx-auto">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
            <div className="flex items-center gap-4 text-center sm:text-left">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                <MessageCircle className="w-6 h-6" />
              </div>
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Verified WhatsApp Business Line
                </div>
                <div className="font-['Outfit'] font-extrabold text-2xl text-white tracking-tight mt-0.5">
                  {contact?.whatsappNumber || '+91 94971 22397'}
                </div>
                <div className="text-xs text-slate-400 mt-1">
                  {contact?.turnaroundTarget || 'Average initial consultation response: < 2 hours'}
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={handleChatWithElevate}
              className="px-5 py-2.5 rounded-lg text-xs font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-800/80 hover:bg-emerald-900/60 transition-colors shrink-0 cursor-pointer"
            >
              Message Directly
            </button>
          </div>
        </div>

        {/* Reassurance Footer Strip */}
        <div className="max-w-2xl mx-auto text-center pt-8 mt-10 border-t border-slate-800/80">
          <p className="text-xs text-slate-400">
            No payment gateways or complicated signups required. All consultations and project details are coordinated directly on WhatsApp for maximum transparency.
          </p>
        </div>
      </div>
    </section>
  );
};
