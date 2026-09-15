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
    <section id="faq" className="py-20 sm:py-28 bg-white border-b border-slate-100 scroll-mt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="mb-16">
          <div className="inline-flex items-center gap-2 mb-6">
            <span className="w-1.5 h-1.5 bg-[#0B0F17] rounded-full" />
            <span className="text-xs font-bold tracking-widest uppercase text-[#0B0F17]">
              {config?.sectionBadge || 'FAQ'}
            </span>
          </div>
          <h2 className="font-['Outfit'] font-extrabold text-4xl sm:text-5xl text-[#0B0F17] tracking-tight mb-4">
            {config?.sectionTitle || 'Frequently Asked Questions'}
          </h2>
          <p className="text-lg text-slate-500 font-normal max-w-2xl">
            {config?.sectionSubtitle || 'Everything you need to know about our approach, pricing philosophy, and institutional support.'}
          </p>
        </div>

        <div className="border-t border-slate-200">
          {items.filter(faq => faq.enabled !== false).map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={faq.id || faq.question}
                className="border-b border-slate-200"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(index)}
                  className="w-full text-left py-6 flex items-center justify-between gap-6 cursor-pointer group"
                  aria-expanded={isOpen}
                >
                  <h3 className={`font-['Outfit'] font-bold text-xl sm:text-2xl transition-colors ${isOpen ? 'text-[#0062EB]' : 'text-[#0B0F17] group-hover:text-[#0062EB]'}`}>
                    {faq.question}
                  </h3>
                  <div className={`shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
                    {isOpen ? <Minus className="w-5 h-5 text-[#0062EB]" /> : <Plus className="w-5 h-5 text-slate-400 group-hover:text-[#0062EB]" />}
                  </div>
                </button>
                
                {/* We use a simple conditional render for the answer. For smooth height transitions, we'd need more complex CSS, but this is clean. */}
                {isOpen && (
                  <div className="pb-8 text-base text-slate-500 leading-relaxed pr-8">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Direct question prompt */}
        <div className="mt-16 pt-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h4 className="font-bold text-[#0B0F17] text-lg">
              Have a specific institutional question?
            </h4>
            <p className="text-sm text-slate-500 mt-1">
              Chat directly with our design leads on WhatsApp for immediate answers.
            </p>
          </div>
          <button
            type="button"
            onClick={handleAskWhatsApp}
            className="inline-flex items-center gap-2 px-6 py-3.5 text-sm font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl transition-all shrink-0 cursor-pointer"
          >
            <MessageCircle className="w-4 h-4 text-emerald-600" />
            <span>Ask via WhatsApp</span>
          </button>
        </div>

      </div>
    </section>
  );
};
