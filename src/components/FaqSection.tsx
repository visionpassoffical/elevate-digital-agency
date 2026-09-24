import React, { useState } from 'react';
import { ChevronDown, MessageCircle } from 'lucide-react';
import { useContent } from '../context/ContentContext';

export const FaqSection: React.FC = () => {
  const { content, openWhatsAppMessage } = useContent();
  const config = content.faq;
  const items = config?.items || [];

  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const handleAskWhatsApp = () => {
    openWhatsAppMessage('Hello ELEVATE, I have a question regarding your services.');
  };

  return (
    <section id="faq" className="py-20 sm:py-28 bg-[#FFFFFF] text-[#0F172A] border-b border-slate-200/80 scroll-mt-20 relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="mb-14 sm:mb-16 text-center">
          <div className="inline-flex items-center gap-2 mb-3">
            <span className="w-1.5 h-1.5 bg-[#2563EB] rounded-full" />
            <span className="text-[11px] font-bold tracking-widest uppercase text-slate-500">
              {config?.sectionBadge || 'FREQUENTLY ASKED QUESTIONS'}
            </span>
          </div>
          <h2 className="font-['Outfit'] font-extrabold text-3xl sm:text-4xl lg:text-5xl text-[#0F172A] tracking-tight mb-4">
            {config?.sectionTitle || 'Everything You Need to Know.'}
          </h2>
          <p className="text-base text-slate-600 font-normal max-w-xl mx-auto">
            {config?.sectionSubtitle ||
              'Clear answers about our institutional workflows, turnarounds, pricing transparency, and WhatsApp support.'}
          </p>
        </div>

        {/* Compact FAQ Accordion */}
        <div className="divide-y divide-slate-200/80 border-y border-slate-200/80">
          {items.filter((faq) => faq.enabled !== false).map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={faq.id || faq.question}
                className="py-1 transition-colors"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(index)}
                  className="w-full text-left py-5 sm:py-6 flex items-center justify-between gap-4 cursor-pointer group"
                  aria-expanded={isOpen}
                >
                  <h3 className={`font-['Outfit'] font-bold text-base sm:text-lg transition-colors ${isOpen ? 'text-[#2563EB]' : 'text-[#0F172A] group-hover:text-[#2563EB]'}`}>
                    {faq.question}
                  </h3>
                  <div className={`w-8 h-8 rounded-full bg-slate-50 border border-slate-200/80 flex items-center justify-center shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180 bg-blue-50 border-blue-200 text-[#2563EB]' : 'text-slate-400 group-hover:text-[#2563EB]'}`}>
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>
                
                {isOpen && (
                  <div className="pb-6 text-sm text-slate-600 leading-relaxed pr-8 animate-fadeIn">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Direct WhatsApp Query Prompt Card */}
        <div className="mt-12 bg-[#F8FAFC] border border-slate-200/90 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-5 shadow-2xs">
          <div>
            <h4 className="font-['Outfit'] font-bold text-[#0F172A] text-base sm:text-lg">
              Have an institutional question not covered here?
            </h4>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Connect directly with our team on WhatsApp for prompt, direct answers.
            </p>
          </div>
          <button
            type="button"
            onClick={handleAskWhatsApp}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 text-xs sm:text-sm font-bold text-white bg-[#2563EB] hover:bg-blue-700 rounded-xl transition-all shrink-0 cursor-pointer shadow-xs active:scale-[0.98]"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Ask on WhatsApp</span>
          </button>
        </div>

      </div>
    </section>
  );
};
