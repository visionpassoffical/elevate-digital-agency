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
    <section className="py-20 sm:py-32 bg-[#0B0F17] border-b border-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-start">
          
          {/* Section Header */}
          <div className="lg:col-span-5 sticky top-32">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-white/5 border border-white/10 text-white text-xs font-bold tracking-wider uppercase mb-8">
              <span>{config?.sectionBadge || 'WHY ELEVATE'}</span>
            </div>
            
            <h2 className="font-['Outfit'] font-extrabold text-4xl sm:text-5xl md:text-6xl text-white tracking-tight leading-tight">
              {config?.sectionTitle || 'Digital Work. Made Simple.'}
            </h2>
            
            <p className="mt-6 text-lg text-slate-400 leading-relaxed font-normal max-w-md">
              {config?.sectionSubtitle || 'We operate with complete transparency, lean workflows, and direct accountability — so your institution gets exactly what it needs without friction.'}
            </p>
          </div>

          {/* Points List */}
          <div className="lg:col-span-7">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 lg:gap-12">
              {points.map((point) => (
                <div
                  key={point.id || point.number}
                  className="pt-8 border-t border-white/10"
                >
                  <span className="font-['Outfit'] font-extrabold text-2xl text-[#0062EB] block mb-4">
                    {point.number}
                  </span>
                  <h3 className="font-['Outfit'] font-bold text-xl text-white mb-3">
                    {point.title}
                  </h3>
                  <p className="text-sm text-slate-400 leading-relaxed">
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
