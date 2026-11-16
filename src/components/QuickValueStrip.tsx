import React from 'react';
import { Tag, Zap, Sliders, ShieldCheck } from 'lucide-react';
import type { QuickValuePoint } from '../types';

const VALUE_POINTS: QuickValuePoint[] = [
  {
    id: 'affordable',
    title: 'Transparent Pricing',
    description: 'Fixed rates with zero hidden fees',
    iconName: 'tag',
  },
  {
    id: 'simple',
    title: '48–72h Turnaround',
    description: 'Rapid institutional delivery',
    iconName: 'simple',
  },
  {
    id: 'flexible',
    title: 'Modular Packages',
    description: 'Full suites or individual items',
    iconName: 'flexible',
  },
  {
    id: 'professional',
    title: 'Direct WhatsApp Desk',
    description: 'Instant engineering support',
    iconName: 'professional',
  },
];

export const QuickValueStrip: React.FC = () => {
  const renderIcon = (name: string) => {
    switch (name) {
      case 'tag':
        return <Tag className="w-4 h-4 text-[#2563EB]" />;
      case 'simple':
        return <Zap className="w-4 h-4 text-emerald-600" />;
      case 'flexible':
        return <Sliders className="w-4 h-4 text-indigo-600" />;
      case 'professional':
        return <ShieldCheck className="w-4 h-4 text-[#2563EB]" />;
      default:
        return <Tag className="w-4 h-4 text-[#2563EB]" />;
    }
  };

  return (
    <section className="bg-[#F4F6FB] border-y border-slate-200/70 py-4 sm:py-5 text-[#0F172A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 items-start">
          {VALUE_POINTS.map((point) => (
            <div
              key={point.id}
              className="flex items-start gap-3 select-none"
            >
              <div className="w-8 h-8 rounded-lg bg-white shadow-[0_2px_8px_-2px_rgba(15,23,42,0.08)] flex items-center justify-center shrink-0 mt-0.5">
                {renderIcon(point.iconName)}
              </div>
              <div className="min-w-0">
                <div className="font-['Outfit'] font-bold text-xs sm:text-sm text-[#0F172A] leading-snug">
                  {point.title}
                </div>
                <div className="text-[11px] sm:text-xs text-slate-500 leading-snug mt-0.5">
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
