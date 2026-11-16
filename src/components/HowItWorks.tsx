import React from 'react';
import { useContent } from '../context/ContentContext';

export const HowItWorks: React.FC = () => {
  const { content } = useContent();
  const config = content.howItWorks;

  const steps =
    config?.steps && config.steps.length > 0
      ? config.steps.filter((s) => s.enabled !== false).slice(0, 4)
      : [
          {
            step: '01',
            title: 'Select or Inquire',
            description:
              'Pick a website plan, admission kit, exam package, or creative retainer directly from our interactive tabs.',
          },
          {
            step: '02',
            title: 'Connect on WhatsApp',
            description:
              'Your selected items format automatically into a structured WhatsApp brief with zero login walls.',
          },
          {
            step: '03',
            title: 'Review & Refine',
            description:
              'We share tailored institutional previews and layout proofs for your approval with prompt revisions.',
          },
          {
            step: '04',
            title: 'Turnkey Delivery',
            description:
              'Your live institutional portal or print-ready HD files are delivered within 48–72 hours.',
          },
        ];

  return (
    <section
      id="how-it-works"
      className="py-12 sm:py-16 bg-[#FFFFFF] text-[#0F172A] scroll-mt-16 relative overflow-hidden"
    >
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Compact Editorial Header */}
        <div className="text-center mb-8 sm:mb-10">
          <div className="text-[11px] font-bold tracking-[0.14em] uppercase text-[#2563EB] mb-1.5">
            STREAMLINED WORKFLOW
          </div>
          <h2 className="font-['Outfit'] font-extrabold text-2xl sm:text-3xl text-[#0F172A] tracking-tight">
            {config?.sectionTitle || 'How ELEVATE Works'}
          </h2>
          <p className="mt-1.5 text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
            From your initial selection to turnkey institutional delivery in four clear steps.
          </p>
        </div>

        {/* Sleek Connected Vertical Stepper Timeline */}
        <div className="relative max-w-2xl mx-auto bg-[#F4F6FB] rounded-3xl p-6 sm:p-8 shadow-[0_10px_30px_-10px_rgba(15,23,42,0.06)]">
          <div className="relative">
            {/* Continuous Vertical Line Connecting Circle Nodes */}
            <div
              aria-hidden="true"
              className="absolute left-5 top-5 bottom-5 w-px bg-gradient-to-b from-[#2563EB] via-blue-300 to-slate-300"
            />

            <div className="space-y-6 sm:space-y-7">
              {steps.map((item, idx) => (
                <div
                  key={item.step || idx}
                  className="relative flex items-start gap-4 sm:gap-5 group"
                >
                  {/* Numbered Blue Circle Node */}
                  <div className="relative z-10 w-10 h-10 rounded-full bg-[#2563EB] text-white font-['Outfit'] font-extrabold text-xs flex items-center justify-center shrink-0 shadow-[0_4px_12px_rgba(37,99,235,0.35)] ring-4 ring-[#F4F6FB]">
                    {item.step}
                  </div>

                  {/* Clean Title + 1-Line Description */}
                  <div className="min-w-0 flex-1 pt-0.5">
                    <h3 className="font-['Outfit'] font-bold text-base sm:text-lg text-[#0F172A] leading-snug">
                      {item.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mt-0.5">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
