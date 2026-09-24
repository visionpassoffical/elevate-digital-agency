import React from 'react';
import { useContent } from '../context/ContentContext';
import { ShieldCheck, Zap, Sliders, MessageSquare } from 'lucide-react';

export const WhyElevate: React.FC = () => {
  const { content } = useContent();
  const config = content.whyElevate;

  const points = (config?.benefits && config.benefits.length > 0)
    ? config.benefits.filter((b) => b.enabled !== false)
    : [
        {
          id: 'clear-pricing',
          number: '01',
          title: 'Clear Pricing',
          description: "Know what you're selecting before you enquire. Zero hidden fees or unexpected invoices.",
        },
        {
          id: 'flexible-options',
          number: '02',
          title: 'Modular & Flexible',
          description: 'Take comprehensive institution packages or single item deliverables on demand.',
        },
        {
          id: 'direct-communication',
          number: '03',
          title: 'Direct WhatsApp Line',
          description: 'Talk directly to engineers and designers who understand institutional dignity.',
        },
        {
          id: 'practical-solutions',
          number: '04',
          title: 'Fast Turnkey Execution',
          description: 'Focused on high-performance digital results delivered reliably within 48 to 72 hours.',
        },
      ];

  return (
    <section className="py-20 sm:py-28 bg-[#F8FAFC] border-b border-slate-200/80 text-[#0F172A] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          
          {/* Section Header (5 cols) */}
          <div className="lg:col-span-5 lg:sticky lg:top-28">
            <div className="inline-flex items-center gap-2 mb-3">
              <span className="w-1.5 h-1.5 bg-[#2563EB] rounded-full" />
              <span className="text-[11px] font-bold tracking-widest uppercase text-slate-500">
                {config?.sectionBadge || 'WHY ELEVATE'}
              </span>
            </div>
            
            <h2 className="font-['Outfit'] font-extrabold text-3xl sm:text-4xl lg:text-5xl text-[#0F172A] tracking-tight leading-tight mb-4">
              {config?.sectionTitle || 'Digital Work. Made Simple.'}
            </h2>
            
            <p className="text-base text-slate-600 leading-relaxed font-normal max-w-md">
              {config?.sectionSubtitle ||
                'We operate with complete transparency, lean workflows, and direct accountability — so your institution gets exactly what it needs without friction.'}
            </p>
          </div>

          {/* Points Grid (7 cols) */}
          <div className="lg:col-span-7">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {points.map((point) => (
                <div
                  key={point.id || point.number}
                  className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-xs hover:border-slate-300 hover:shadow-md transition-all duration-200"
                >
                  <span className="font-['Outfit'] font-extrabold text-2xl text-[#2563EB] block mb-3">
                    {point.number}
                  </span>
                  <h3 className="font-['Outfit'] font-bold text-lg text-[#0F172A] mb-2">
                    {point.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
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
