import React from 'react';
import { Tag, Zap, Sliders, ShieldCheck } from 'lucide-react';
import type { QuickValuePoint } from '../types';

const VALUE_POINTS: QuickValuePoint[] = [
  {
    id: 'affordable',
    title: 'Transparent Pricing',
    description: 'No hidden fees',
    iconName: 'tag',
  },
  {
    id: 'simple',
    title: 'Fast Delivery',
    description: '48-72h turnaround',
    iconName: 'simple',
  },
  {
    id: 'flexible',
    title: 'Modular Solutions',
    description: 'Packages or separate',
    iconName: 'flexible',
  },
  {
    id: 'professional',
    title: 'Direct Support',
    description: 'Human WhatsApp connect',
    iconName: 'professional',
  },
];

export const QuickValueStrip: React.FC = () => {
  const renderIcon = (name: string) => {
    switch (name) {
      case 'tag':
        return <Tag className="w-3.5 h-3.5 text-[#2563EB]" />;
      case 'simple':
        return <Zap className="w-3.5 h-3.5 text-[#2563EB]" />;
      case 'flexible':
        return <Sliders className="w-3.5 h-3.5 text-[#2563EB]" />;
      case 'professional':
        return <ShieldCheck className="w-3.5 h-3.5 text-[#2563EB]" />;
      default:
        return <Tag className="w-3.5 h-3.5 text-[#2563EB]" />;
    }
  };

  return (
    <section className="bg-[#F8FAFC] border-b border-slate-200/80 py-3.5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap justify-center gap-x-8 gap-y-3 md:justify-between items-center">
          {VALUE_POINTS.map((point) => (
            <div
              key={point.id}
              className="flex items-center gap-2.5 group cursor-default"
            >
              <div className="w-6 h-6 rounded-md bg-white border border-slate-200/90 flex items-center justify-center shrink-0 shadow-2xs">
                {renderIcon(point.iconName)}
              </div>
              <div>
                <div className="font-['Outfit'] font-bold text-[11px] uppercase tracking-wider text-[#0F172A]">
                  {point.title}
                </div>
                <div className="text-[11px] text-slate-500">
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

