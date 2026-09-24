import React from 'react';
import { useContent } from '../context/ContentContext';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const { content } = useContent();
  const config = content.howItWorks;

  const steps = (config?.steps && config.steps.length > 0)
    ? config.steps.filter((s) => s.enabled !== false)
    : [
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
    <section id="how-it-works" className="py-20 sm:py-28 bg-[#FFFFFF] text-[#0F172A] border-b border-slate-200/80 scroll-mt-20 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-14 sm:mb-18">
          <div className="inline-flex items-center gap-2 mb-3">
            <span className="w-1.5 h-1.5 bg-[#2563EB] rounded-full" />
            <span className="text-[11px] font-bold tracking-widest uppercase text-slate-500">
              STREAMLINED 4-STEP WORKFLOW
            </span>
          </div>
          <h2 className="font-['Outfit'] font-extrabold text-3xl sm:text-4xl lg:text-5xl text-[#0F172A] tracking-tight mb-4 leading-tight">
            {config?.sectionTitle || 'How ELEVATE Works'}
          </h2>
          <p className="text-base sm:text-lg text-slate-600 font-normal leading-relaxed max-w-xl">
            {config?.sectionSubtitle ||
              'A transparent, frictionless process from your initial inquiry to final institutional delivery.'}
          </p>
        </div>

        {/* Minimalist Step-by-Step Progress Timeline */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {steps.map((item, idx) => (
            <div
              key={item.step || idx}
              className="group bg-[#F8FAFC] border border-slate-200/90 rounded-3xl p-6 sm:p-7 shadow-xs hover:border-slate-300 hover:bg-slate-100/50 transition-all duration-200 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <span className="font-['Outfit'] font-extrabold text-3xl sm:text-4xl text-[#2563EB] tracking-tighter">
                    {item.step}
                  </span>
                  <div className="w-7 h-7 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-[#2563EB]">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                </div>

                <h3 className="font-['Outfit'] font-bold text-lg sm:text-xl text-[#0F172A] mb-2.5 group-hover:text-[#2563EB] transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                  {item.description}
                </p>
              </div>

              <div className="pt-6 mt-6 border-t border-slate-200/60 flex items-center gap-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <span>Phase {item.step}</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
