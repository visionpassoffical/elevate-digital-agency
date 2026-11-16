import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { useContent } from '../context/ContentContext';

export const FaqSection: React.FC = () => {
  const { content } = useContent();
  const config = content.faq;
  const items = (config?.items || []).filter((faq) => faq.enabled !== false);

  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section
      id="faq"
      className="py-12 sm:py-16 bg-[#F4F6FB] text-[#0F172A] border-t border-slate-200/70 scroll-mt-16 relative overflow-hidden"
    >
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Compact Section Header */}
        <div className="mb-8 sm:mb-10 text-center">
          <div className="text-[11px] font-bold tracking-[0.14em] uppercase text-[#2563EB] mb-1.5">
            {config?.sectionBadge || 'COMMON QUESTIONS'}
          </div>
          <h2 className="font-['Outfit'] font-extrabold text-2xl sm:text-3xl text-[#0F172A] tracking-tight mb-1.5">
            {config?.sectionTitle || 'Frequently Asked Questions'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto">
            {config?.sectionSubtitle ||
              'Quick answers on pricing, turnaround times, domain setup, and WhatsApp ordering.'}
          </p>
        </div>

        {/* Clean Elevated Accordion Container */}
        <div className="bg-white rounded-3xl shadow-[0_10px_30px_-10px_rgba(15,23,42,0.08)] divide-y divide-slate-100 overflow-hidden">
          {items.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div key={faq.id || faq.question} className="transition-colors">
                <button
                  type="button"
                  onClick={() => toggleFaq(index)}
                  className="w-full text-left px-5 sm:px-6 py-4 flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-50/70 transition-colors"
                  aria-expanded={isOpen}
                >
                  <h3
                    className={`font-['Outfit'] font-bold text-sm sm:text-base transition-colors leading-snug ${
                      isOpen ? 'text-[#2563EB]' : 'text-[#0F172A]'
                    }`}
                  >
                    {faq.question}
                  </h3>
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-transform duration-200 ${
                      isOpen
                        ? 'rotate-180 bg-blue-50 text-[#2563EB]'
                        : 'bg-[#F4F6FB] text-slate-500'
                    }`}
                  >
                    <ChevronDown className="w-3.5 h-3.5" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 sm:px-6 pb-4 text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
