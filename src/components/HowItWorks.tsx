import React from 'react';
import { motion } from 'motion/react';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      num: '01',
      label: 'Scope on WhatsApp',
      title: '01 / Scope on WhatsApp',
      desc: 'Select a turnkey package or custom deliverable above. Your structured brief and pricing open directly on WhatsApp—zero lengthy agency forms.',
      meta: 'Instant Brief & Rate Lock',
    },
    {
      num: '02',
      label: 'Design & Engineer',
      title: '02 / Design & Engineer',
      desc: 'Our studio designs your custom UI, configures your domain or print-ready creatives, and shares a live staging link for rapid feedback.',
      meta: 'Live Staging Preview',
    },
    {
      num: '03',
      label: 'Launch in 48h',
      title: '03 / Launch in 48h',
      desc: 'Your high-converting institutional or business website goes live with SSL & hosting—or your HD creative campaign is delivered ready to publish.',
      meta: 'Full Handover & Support',
    },
  ];

  return (
    <section
      id="process"
      className="py-16 sm:py-24 bg-[#FFFFFF] text-[#09090B] border-b border-slate-200/80 relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Editorial Left-Aligned Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12 sm:mb-16">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-[#2563EB] mb-3">
              <span>04 / EXECUTION MODEL</span>
            </div>
            <h2 className="font-['Outfit'] font-extrabold text-3xl sm:text-5xl text-[#09090B] tracking-[-0.03em] leading-[1.06]">
              From Brief to Live in 48 Hours.
            </h2>
          </div>
          <p className="text-slate-600 text-sm sm:text-base max-w-md leading-relaxed">
            No bloated retainers or weeks of waiting. A streamlined 3-step studio workflow engineered for fast-moving schools, madrasas, and ambitious brands.
          </p>
        </div>

        {/* 3-Column / Stacked Architectural Process with Hairline Dividers */}
        <div className="grid grid-cols-1 md:grid-cols-3 border-t border-b border-slate-200/80 divide-y md:divide-y-0 md:divide-x divide-slate-200/80">
          {steps.map((step, idx) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.35, delay: idx * 0.06 }}
              className={`py-8 sm:py-10 flex flex-col justify-between ${
                idx === 0
                  ? 'md:pr-8 lg:pr-10'
                  : idx === 1
                  ? 'md:px-8 lg:px-10'
                  : 'md:pl-8 lg:pl-10'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-3 mb-5">
                  <span className="font-['Outfit'] font-extrabold text-3xl sm:text-4xl text-[#2563EB] tracking-[-0.04em]">
                    {step.num}
                  </span>
                  <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-400">
                    {step.meta}
                  </span>
                </div>

                <h3 className="font-['Outfit'] font-extrabold text-xl sm:text-2xl text-[#09090B] tracking-[-0.02em] mb-3">
                  {step.title}
                </h3>

                <p className="text-sm sm:text-[15px] text-slate-600 leading-relaxed">
                  {step.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
