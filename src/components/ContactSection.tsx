import React from 'react';
import { MessageCircle, ArrowRight } from 'lucide-react';
import { useContent } from '../context/ContentContext';

interface ContactSectionProps {
  onOpenQuote?: (context?: string) => void;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ onOpenQuote }) => {
  const { content, openWhatsAppMessage, formatWhatsAppTemplate } = useContent();
  const contact = content.contact;
  const whatsappNumber = contact?.whatsappNumber || '+91 94971 22397';

  const handleChatWithElevate = () => {
    const msg = formatWhatsAppTemplate('generalEnquiry', {});
    openWhatsAppMessage(msg);
  };

  const quickTopics = [
    { label: 'Madrasa Setup', context: 'Complete Madrasa Digital Setup' },
    { label: 'School Portal', context: 'School & College Portal' },
    { label: 'Exam & Admission', context: 'Exam & Admission Suite Bundle' },
    { label: 'Custom Website', context: 'Custom Institutional Website' },
  ];

  return (
    <section
      id="contact"
      className="py-12 sm:py-16 bg-[#FFFFFF] text-[#0B0F19] scroll-mt-16 relative overflow-hidden"
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* ONE Flagship Dark-Obsidian (#0B0F19) Consultation Banner */}
        <div className="relative rounded-3xl bg-[#0B0F19] text-white p-6 sm:p-10 lg:p-12 overflow-hidden shadow-[0_24px_50px_-15px_rgba(11,15,25,0.5)] ring-1 ring-white/10">
          <div
            aria-hidden="true"
            className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-gradient-to-br from-[#2563EB]/35 via-indigo-500/15 to-transparent blur-3xl pointer-events-none"
          />

          <div className="relative z-10 max-w-2xl mx-auto text-center">
            <div className="text-[11px] font-bold tracking-[0.14em] uppercase text-blue-400 mb-2">
              CUSTOM BUNDLES &amp; DIRECT CONSULTATION
            </div>

            <h2 className="font-['Outfit'] font-extrabold text-2xl sm:text-3xl lg:text-4xl text-white tracking-tight leading-tight mb-3 text-balance">
              Ready to Upgrade Your Institution’s Digital Presence?
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-6">
              Discuss websites, admission drives, exam packs, or multilingual creatives directly with our team on WhatsApp—no forms or recurring lock-ins.
            </p>

            {/* Quick Topic Chips */}
            <div className="flex flex-wrap items-center justify-center gap-2 mb-7">
              {quickTopics.map((topic) => (
                <button
                  key={topic.label}
                  type="button"
                  onClick={() =>
                    onOpenQuote
                      ? onOpenQuote(topic.context)
                      : openWhatsAppMessage(
                          `Hello ELEVATE, I would like to enquire about: ${topic.context}`
                        )
                  }
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/[0.08] hover:bg-white/[0.15] border border-white/15 text-xs font-semibold text-slate-200 hover:text-white transition-all cursor-pointer active:scale-95"
                >
                  <span>{topic.label}</span>
                  <ArrowRight className="w-3 h-3 text-blue-400" />
                </button>
              ))}
            </div>

            {/* Prominent Connect on WhatsApp Button */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                id="btn-whatsapp-elevate-final"
                type="button"
                onClick={handleChatWithElevate}
                className="w-full sm:w-auto py-3.5 px-7 rounded-xl font-bold text-xs sm:text-sm text-white bg-[#2563EB] hover:bg-blue-500 active:scale-[0.98] transition-all shadow-[0_10px_28px_-6px_rgba(37,99,235,0.65)] flex items-center justify-center gap-2 cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 shrink-0" />
                <span>Connect on WhatsApp ({whatsappNumber})</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
