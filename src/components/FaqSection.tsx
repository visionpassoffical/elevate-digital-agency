import React, { useState } from 'react';
import { Plus, Minus, MessageCircle } from 'lucide-react';
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
    <section id="faq" className="py-16 sm:py-20 lg:py-24 bg-white border-b border-slate-200/80 scroll-mt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="mb-12 sm:mb-14">
          <div className="inline-flex items-center gap-2 mb-3">
            <span className="w-1.5 h-1.5 bg-[#2563EB] rounded-full" />
            <span className="text-[11px] font-bold tracking-widest uppercase text-slate-500">
              {config?.sectionBadge || 'FAQ'}
            </span>
          </div>
          <h2 className="font-['Outfit'] font-extrabold text-3xl sm:text-4xl lg:text-5xl text-[#0F172A] tracking-tight mb-3">
            {config?.sectionTitle || 'Frequently Asked Questions'}
          </h2>
          <p className="text-sm sm:text-base text-slate-600 font-normal max-w-2xl">
            {config?.sectionSubtitle || 'Everything you need to know about our approach, pricing philosophy, and institutional support.'}
          </p>
        </div>

        <div className="border-t border-slate-200/80">
          {items.filter(faq => faq.enabled !== false).map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={faq.id || faq.question}
                className="border-b border-slate-200/80"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(index)}
                  className="w-full text-left py-5 flex items-center justify-between gap-4 cursor-pointer group"
                  aria-expanded={isOpen}
                >
                  <h3 className={`font-['Outfit'] font-bold text-base sm:text-lg transition-colors ${isOpen ? 'text-[#2563EB]' : 'text-[#0F172A] group-hover:text-[#2563EB]'}`}>
                    {faq.question}
                  </h3>
                  <div className={`shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>
                    {isOpen ? <Minus className="w-4 h-4 text-[#2563EB]" /> : <Plus className="w-4 h-4 text-slate-400 group-hover:text-[#2563EB]" />}
                  </div>
                </button>
                
                {isOpen && (
                  <div className="pb-5 text-xs sm:text-sm text-slate-600 leading-relaxed pr-6">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Direct question prompt */}
        <div className="mt-12 bg-[#F8FAFC] border border-slate-200/80 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-5">
          <div>
            <h4 className="font-bold text-[#0F172A] text-sm sm:text-base">
              Have a specific institutional question?
            </h4>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Chat directly with our team on WhatsApp for immediate clarity.
            </p>
          </div>
          <button
            type="button"
            onClick={handleAskWhatsApp}
            className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-[#2563EB] hover:bg-blue-700 rounded-xl transition-all shrink-0 cursor-pointer shadow-xs active:scale-[0.98]"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>Ask on WhatsApp</span>
          </button>
        </div>

      </div>
    </section>
  );
};
