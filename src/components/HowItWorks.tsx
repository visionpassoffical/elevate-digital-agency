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
    <section id="how-it-works" className="py-20 sm:py-28 bg-white border-b border-slate-100 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-16">
          <h2 className="font-['Outfit'] font-extrabold text-4xl sm:text-5xl lg:text-6xl text-[#0B0F17] tracking-tight mb-6 leading-tight">
            {config?.sectionTitle || 'How It Works'}
          </h2>
          <p className="text-lg text-slate-600 font-normal leading-relaxed max-w-lg">
            {config?.sectionSubtitle || 'A transparent, frictionless process from your initial inquiry to final institutional delivery.'}
          </p>
        </div>

        {/* Clean minimal steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 pt-8 border-t border-slate-100">
          {steps.map((item, idx) => (
            <div key={item.step || idx} className="flex flex-col">
              <span className="font-['Outfit'] font-extrabold text-5xl text-slate-200 mb-6 block">
                {item.step}
              </span>
              <h3 className="font-['Outfit'] font-bold text-xl text-[#0B0F17] mb-3">
                {item.title}
              </h3>
              <p className="text-sm text-slate-500 leading-relaxed font-normal">
                {item.description}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
