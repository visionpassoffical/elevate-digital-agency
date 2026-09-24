import React from 'react';
import { Tag, Zap, Sliders, ShieldCheck } from 'lucide-react';
import type { QuickValuePoint } from '../types';

const VALUE_POINTS: QuickValuePoint[] = [
  {
    id: 'affordable',
    title: 'Transparent Pricing',
    description: 'Zero hidden fees or surprise invoices',
    iconName: 'tag',
  },
  {
    id: 'simple',
    title: 'Fast Turnaround',
    description: '48 to 72 hours institutional delivery',
    iconName: 'simple',
  },
  {
    id: 'flexible',
    title: 'Modular Ecosystem',
    description: 'Take complete suites or single items',
    iconName: 'flexible',
  },
  {
    id: 'professional',
    title: 'Direct WhatsApp Line',
    description: 'Instant human accountability & support',
    iconName: 'professional',
  },
];

export const QuickValueStrip: React.FC = () => {
  const renderIcon = (name: string) => {
    switch (name) {
      case 'tag':
        return <Tag className="w-4 h-4 text-[#60A5FA]" />;
      case 'simple':
        return <Zap className="w-4 h-4 text-emerald-400" />;
      case 'flexible':
        return <Sliders className="w-4 h-4 text-purple-400" />;
      case 'professional':
        return <ShieldCheck className="w-4 h-4 text-cyan-400" />;
      default:
        return <Tag className="w-4 h-4 text-[#60A5FA]" />;
    }
  };

  return (
    <section className="bg-[#070A11] border-b border-white/10 py-5 text-slate-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 items-center">
          {VALUE_POINTS.map((point) => (
            <div
              key={point.id}
              className="flex items-center gap-3 group cursor-default select-none"
            >
              <div className="w-9 h-9 rounded-xl bg-white/[0.04] border border-white/10 group-hover:border-blue-500/40 group-hover:bg-blue-500/10 flex items-center justify-center shrink-0 transition-colors shadow-2xs">
                {renderIcon(point.iconName)}
              </div>
              <div className="min-w-0">
                <div className="font-['Outfit'] font-bold text-xs uppercase tracking-wider text-white group-hover:text-[#60A5FA] transition-colors truncate">
                  {point.title}
                </div>
                <div className="text-[11px] text-slate-400 truncate mt-0.5">
                  {point.description}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
