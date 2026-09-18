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
      className="py-16 sm:py-20 lg:py-24 bg-white text-[#0F172A] scroll-mt-20 relative overflow-hidden border-t border-slate-200/80"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Final CTA Header */}
        <div className="max-w-3xl mx-auto text-center mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-2 mb-3">
            <span className="w-1.5 h-1.5 bg-[#2563EB] rounded-full" />
            <span className="text-[11px] font-bold tracking-widest uppercase text-slate-500">
              START YOUR PROJECT
            </span>
          </div>

          <h2 className="font-['Outfit'] font-extrabold text-3xl sm:text-4xl md:text-5xl text-[#0F172A] tracking-tight mb-3 leading-tight">
            Ready to Elevate Your Digital Presence?
          </h2>

          <p className="text-sm sm:text-base md:text-lg text-slate-600 font-normal leading-relaxed max-w-xl mx-auto mb-8">
            Tell us what you need. We&apos;ll help you choose the right solution without confusion.
          </p>

          {/* Primary CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 max-w-md mx-auto">
            <button
              id="btn-whatsapp-elevate-final"
              type="button"
              onClick={handleChatWithElevate}
              className="w-full sm:w-auto min-w-[200px] py-3.5 px-6 rounded-xl font-bold text-xs sm:text-sm text-white bg-[#2563EB] hover:bg-blue-700 active:scale-[0.98] transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
            >
              <MessageCircle className="w-4 h-4" />
              <span>{contact?.ctaText || 'WhatsApp ELEVATE'}</span>
            </button>

            {onOpenQuote && (
              <button
                id="btn-custom-quote-final"
                type="button"
                onClick={onOpenQuote}
                className="w-full sm:w-auto min-w-[200px] py-3.5 px-6 rounded-xl font-bold text-xs sm:text-sm text-[#0F172A] bg-white hover:bg-slate-50 active:scale-[0.98] transition-all border border-slate-200 hover:border-slate-300 shadow-2xs flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Get a Custom Quote</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              </button>
            )}
          </div>
        </div>

        {/* Contact Details Card: Direct WhatsApp line */}
        <div className="max-w-2xl mx-auto">
          <div className="bg-[#F8FAFC] border border-slate-200/90 rounded-2xl p-6 sm:p-7 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-2xs">
            <div className="flex items-center gap-4 text-center sm:text-left">
              <div className="w-11 h-11 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[#2563EB] shrink-0">
                <MessageCircle className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Verified WhatsApp Business Line
                </div>
                <div className="font-['Outfit'] font-extrabold text-xl sm:text-2xl text-[#0F172A] tracking-tight mt-0.5">
                  {contact?.whatsappNumber || '+91 94971 22397'}
                </div>
                <div className="text-xs text-slate-500 mt-0.5">
                  {contact?.turnaroundTarget || 'Average initial consultation response: < 2 hours'}
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={handleChatWithElevate}
              className="px-4 py-2 rounded-xl text-xs font-bold text-[#2563EB] bg-white border border-slate-200 hover:border-slate-300 shadow-2xs transition-colors shrink-0 cursor-pointer"
            >
              Message Directly
            </button>
          </div>
        </div>

        {/* Reassurance Footer Strip */}
        <div className="max-w-2xl mx-auto text-center pt-6 mt-8 border-t border-slate-200/80">
          <p className="text-xs text-slate-500">
            No payment gateways or complicated signups required. All consultations and project details are coordinated directly on WhatsApp for maximum transparency.
          </p>
        </div>
      </div>
    </section>
  );
};
