import React, { useState } from 'react';
import { Plus, Minus } from 'lucide-react';
import { useContent } from '../context/ContentContext';

export const FaqSection: React.FC = () => {
  const { content } = useContent();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const visibleFaqs = (content.faq?.items || [])
    .filter((item) => item.enabled !== false)
    .slice(0, 4);

  return (
    <section
      id="faq"
      className="py-16 sm:py-24 bg-[#F5F5F7] text-[#09090B] border-b border-slate-200/80 relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          {/* Left Column: Editorial Heading */}
          <div className="lg:col-span-5">
            <div className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-[#2563EB] mb-3">
              <span>05 / FAQ</span>
            </div>
            <h2 className="font-['Outfit'] font-extrabold text-3xl sm:text-5xl text-[#09090B] tracking-[-0.03em] leading-[1.06] mb-4">
              Common Questions.
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-sm">
              Clear answers on turnaround speed, domain ownership, custom features, and ongoing studio support.
            </p>
          </div>

          {/* Right Column: Hairline Accordion (No Box Inside a Box) */}
          <div className="lg:col-span-7 border-t border-b border-slate-200/80 divide-y divide-slate-200/80">
            {visibleFaqs.map((faq, idx) => {
              const isOpen = openIndex === idx;
              return (
                <div key={faq.id} className="py-5 sm:py-6">
                  <button
                    type="button"
                    onClick={() => setOpenIndex(isOpen ? null : idx)}
                    className="w-full text-left flex items-start justify-between gap-6 group cursor-pointer"
                  >
                    <div className="flex items-baseline gap-3.5">
                      <span className="font-['Outfit'] font-bold text-xs text-[#2563EB] tracking-wider shrink-0">
                        0{idx + 1}
                      </span>
                      <span className="font-['Outfit'] font-bold text-base sm:text-lg text-[#09090B] group-hover:text-[#2563EB] transition-colors leading-snug">
                        {faq.question}
                      </span>
                    </div>
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-colors mt-0.5 ${
                        isOpen
                          ? 'bg-[#09090B] text-white'
                          : 'bg-white text-[#09090B] border border-slate-300 group-hover:border-[#09090B]'
                      }`}
                    >
                      {isOpen ? (
                        <Minus className="w-3.5 h-3.5" />
                      ) : (
                        <Plus className="w-3.5 h-3.5" />
                      )}
                    </div>
                  </button>
                  {isOpen && (
                    <div className="pt-3 pl-7 pr-4 text-slate-600 text-sm sm:text-[15px] leading-relaxed">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
