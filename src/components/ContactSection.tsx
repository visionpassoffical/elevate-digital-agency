import React from 'react';
import { MessageCircle, ArrowRight, ShieldCheck, Zap } from 'lucide-react';
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
      className="py-20 sm:py-28 bg-[#090D16] text-white scroll-mt-20 relative overflow-hidden border-t border-white/10"
    >
      {/* Background ambient lighting */}
      <div 
        aria-hidden="true" 
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-t from-blue-600/10 via-transparent to-transparent blur-[120px] pointer-events-none" 
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Final CTA Header */}
        <div className="max-w-3xl mx-auto text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 mb-3">
            <span className="w-1.5 h-1.5 bg-[#3B82F6] rounded-full shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
            <span className="text-[11px] font-bold tracking-widest uppercase text-slate-400">
              START YOUR INSTITUTIONAL PROJECT
            </span>
          </div>

          <h2 className="font-['Outfit'] font-extrabold text-3xl sm:text-5xl md:text-6xl text-white tracking-tight mb-4 leading-tight">
            Ready to Elevate Your Digital Presence?
          </h2>

          <p className="text-base sm:text-lg text-slate-300 font-normal leading-relaxed max-w-xl mx-auto mb-10">
            Tell us what you need. We&apos;ll help you choose the right institutional solution without confusion or unnecessary sales pitches.
          </p>

          {/* Primary CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 max-w-md mx-auto">
            <button
              id="btn-whatsapp-elevate-final"
              type="button"
              onClick={handleChatWithElevate}
              className="w-full sm:w-auto min-w-[210px] py-4 px-7 rounded-xl font-bold text-xs sm:text-sm text-white bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] hover:from-[#3B82F6] hover:to-[#2563EB] active:scale-[0.98] transition-all shadow-[0_0_25px_-5px_rgba(37,99,235,0.7)] flex items-center justify-center gap-2.5 cursor-pointer"
            >
              <MessageCircle className="w-4 h-4" />
              <span>{contact?.ctaText || 'WhatsApp ELEVATE'}</span>
            </button>

            {onOpenQuote && (
              <button
                id="btn-custom-quote-final"
                type="button"
                onClick={onOpenQuote}
                className="w-full sm:w-auto min-w-[210px] py-4 px-7 rounded-xl font-bold text-xs sm:text-sm text-slate-200 bg-white/[0.05] hover:bg-white/[0.09] hover:text-white active:scale-[0.98] transition-all border border-white/15 hover:border-white/25 flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Get a Custom Quote</span>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </button>
            )}
          </div>
        </div>

        {/* Contact Details Card: Direct WhatsApp line */}
        <div className="max-w-2xl mx-auto">
          <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl backdrop-blur-md">
            <div className="flex items-center gap-4 text-center sm:text-left">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                <MessageCircle className="w-6 h-6" />
              </div>
              <div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Verified WhatsApp Business Line
                </div>
                <div className="font-['Outfit'] font-extrabold text-xl sm:text-2xl text-white tracking-tight mt-0.5">
                  {contact?.whatsappNumber || '+91 94971 22397'}
                </div>
                <div className="text-xs text-slate-400 mt-0.5">
                  {contact?.turnaroundTarget || 'Average initial consultation response: < 2 hours'}
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={handleChatWithElevate}
              className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-white/[0.07] border border-white/15 hover:bg-white/[0.12] hover:border-white/25 transition-all shrink-0 cursor-pointer active:scale-95"
            >
              Message Directly
            </button>
          </div>
        </div>

        {/* Reassurance Footer Strip */}
        <div className="max-w-2xl mx-auto text-center pt-8 mt-10 border-t border-white/10">
          <p className="text-xs text-slate-400 leading-relaxed">
            No complicated signups or recurring subscriptions required. All inquiries, scopes, and proposals are finalized directly on WhatsApp for maximum transparency.
          </p>
        </div>
      </div>
    </section>
  );
};
