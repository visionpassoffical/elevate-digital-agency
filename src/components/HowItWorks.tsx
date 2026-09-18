import React from 'react';
import { useContent } from '../context/ContentContext';

export const HowItWorks: React.FC = () => {
  const { content } = useContent();
  const config = content.howItWorks;

  const steps = (config?.steps && config.steps.length > 0) ? config.steps.filter(s => s.enabled !== false) : [
    {
      step: '01',
      title: 'Select or Inquire',
      description: 'Explore our turnkey packages, individual services, or custom deliverables directly on this page.',
    },
    {
      step: '02',
      title: 'Connect on WhatsApp',
      description: 'Click "Continue on WhatsApp". Your selected requirements open instantly in chat with our team.',
    },
    {
      step: '03',
      title: 'Review & Refine',
      description: 'We draft and share institutional mockups for your approval with prompt, hassle-free revisions.',
    },
    {
      step: '04',
      title: 'Turnkey Delivery',
      description: 'Your high-performance live website goes live or print-ready PDF/vector packages are delivered in 48-72h.',
    },
  ];

  return (
    <section id="how-it-works" className="py-16 sm:py-20 lg:py-24 bg-white border-b border-slate-200/80 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-12 sm:mb-14">
          <div className="inline-flex items-center gap-2 mb-3">
            <span className="w-1.5 h-1.5 bg-[#2563EB] rounded-full" />
            <span className="text-[11px] font-bold tracking-widest uppercase text-slate-500">
              STREAMLINED WORKFLOW
            </span>
          </div>
          <h2 className="font-['Outfit'] font-extrabold text-3xl sm:text-4xl lg:text-5xl text-[#0F172A] tracking-tight mb-3 leading-tight">
            {config?.sectionTitle || 'How It Works'}
          </h2>
          <p className="text-sm sm:text-base text-slate-600 font-normal leading-relaxed max-w-lg">
            {config?.sectionSubtitle || 'A transparent, frictionless process from your initial inquiry to final institutional delivery.'}
          </p>
        </div>

        {/* Clean step cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {steps.map((item, idx) => (
            <div
              key={item.step || idx}
              className="bg-[#F8FAFC] border border-slate-200/80 rounded-2xl p-6 shadow-2xs hover:border-slate-300 transition-all duration-200 flex flex-col justify-between"
            >
              <div>
                <span className="font-['Outfit'] font-extrabold text-2xl text-[#2563EB] mb-3 block">
                  {item.step}
                </span>
                <h3 className="font-['Outfit'] font-bold text-base sm:text-lg text-[#0F172A] mb-2">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
