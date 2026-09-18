import React from 'react';
import { useContent } from '../context/ContentContext';

export const WhyElevate: React.FC = () => {
  const { content } = useContent();
  const config = content.whyElevate;

  const points = (config?.benefits && config.benefits.length > 0)
    ? config.benefits.filter(b => b.enabled !== false)
    : [
        {
          id: 'clear-pricing',
          number: '01',
          title: 'Clear Pricing',
          description: "Know what you're selecting before you enquire.",
        },
        {
          id: 'flexible-options',
          number: '02',
          title: 'Flexible Options',
          description: 'Packages or individual services.',
        },
        {
          id: 'direct-communication',
          number: '03',
          title: 'Direct Communication',
          description: 'Send your requirement directly to ELEVATE.',
        },
        {
          id: 'practical-solutions',
          number: '04',
          title: 'Practical Solutions',
          description: 'Focused on useful digital work rather than unnecessary features.',
        },
      ];

  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-[#F8FAFC] border-b border-slate-200/80 text-[#0F172A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          
          {/* Section Header */}
          <div className="lg:col-span-5 lg:sticky lg:top-28">
            <div className="inline-flex items-center gap-2 mb-3">
              <span className="w-1.5 h-1.5 bg-[#2563EB] rounded-full" />
              <span className="text-[11px] font-bold tracking-widest uppercase text-slate-500">
                {config?.sectionBadge || 'WHY ELEVATE'}
              </span>
            </div>
            
            <h2 className="font-['Outfit'] font-extrabold text-3xl sm:text-4xl lg:text-5xl text-[#0F172A] tracking-tight leading-tight mb-3">
              {config?.sectionTitle || 'Digital Work. Made Simple.'}
            </h2>
            
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal max-w-md">
              {config?.sectionSubtitle || 'We operate with complete transparency, lean workflows, and direct accountability — so your institution gets exactly what it needs without friction.'}
            </p>
          </div>

          {/* Points Grid */}
          <div className="lg:col-span-7">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
              {points.map((point) => (
                <div
                  key={point.id || point.number}
                  className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs hover:border-slate-300 transition-all duration-200"
                >
                  <span className="font-['Outfit'] font-extrabold text-xl text-[#2563EB] block mb-2">
                    {point.number}
                  </span>
                  <h3 className="font-['Outfit'] font-bold text-base sm:text-lg text-[#0F172A] mb-1.5">
                    {point.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                    {point.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
