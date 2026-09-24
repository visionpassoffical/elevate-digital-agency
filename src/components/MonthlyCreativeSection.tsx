import React, { useState } from 'react';
import { Check, ArrowRight, MessageCircle, ChevronDown, ChevronUp, Palette, Sparkles } from 'lucide-react';
import type { MonthlyCreativePlanConfig, SelectedMonthlyPlan } from '../types';
import { useContent } from '../context/ContentContext';

interface MonthlyCreativeSectionProps {
  selectedPlan?: SelectedMonthlyPlan | null;
  onSelectPlan: (plan: SelectedMonthlyPlan | null) => void;
}

export const MonthlyCreativeSection: React.FC<MonthlyCreativeSectionProps> = ({
  selectedPlan,
  onSelectPlan,
}) => {
  const { content, openWhatsAppMessage, formatWhatsAppTemplate } = useContent();
  const plans = content.monthlyCreativePlans.plans || [];
  const creativeTypes = content.monthlyCreativePlans.creativeTypes || [];

  const [isCreativeListExpanded, setIsCreativeListExpanded] = useState(false);

  const handleTogglePlan = (planId: string) => {
    if (selectedPlan?.id === planId) {
      // Trigger WhatsApp directly if they click a selected plan again
      const p = plans.find((x) => x.id === planId);
      if (p) handleOpenWhatsAppForPlan(p);
      return;
    }

    const p = plans.find((x) => x.id === planId);
    if (!p) return;

    onSelectPlan({
      id: p.id,
      name: p.name,
      price: p.price.toString(),
      creativesCountLabel: p.creativesCountLabel,
      monthlyPriceNumber: p.price,
      creativesCount: p.creativesCount,
      category: 'Monthly Creative',
    });
  };

  const handleOpenWhatsAppForPlan = (plan: MonthlyCreativePlanConfig) => {
    const msg = formatWhatsAppTemplate('monthlyPlan', {
      planName: plan.name,
      priceFormatted: plan.price.toString(),
      creativesLabel: plan.creativesCountLabel,
    });
    openWhatsAppMessage(msg);
  };

  return (
    <section
      id="creative"
      className="py-20 sm:py-28 bg-[#090D16] text-white border-b border-white/10 scroll-mt-20 relative overflow-hidden"
    >
      {/* Background ambient lighting */}
      <div 
        aria-hidden="true" 
        className="absolute top-1/2 right-10 w-[500px] h-[500px] bg-amber-500/[0.04] blur-[140px] rounded-full pointer-events-none" 
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          
          {/* LEFT COLUMN: Editorial Intro & Included Formats Showcase (5 cols) */}
          <div className="lg:col-span-5 lg:sticky lg:top-28">
            <div className="mb-8">
              <div className="inline-flex items-center gap-2 mb-3">
                <span className="w-1.5 h-1.5 bg-amber-400 rounded-full shadow-[0_0_8px_rgba(251,191,36,0.8)]" />
                <span className="text-[11px] font-bold tracking-widest uppercase text-slate-400">
                  MONTHLY CREATIVE RETAINERS
                </span>
              </div>
              <h2 className="font-['Outfit'] font-extrabold text-3xl sm:text-4xl lg:text-5xl text-white tracking-tight leading-tight mb-4">
                Consistent Digital Identity.
              </h2>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-md">
                Keep your campus social channels active, dignified, and professional with predictable, fixed-price monthly design quotas.
              </p>
            </div>

            {/* Included Creative Types Card */}
            <div className="bg-white/[0.03] rounded-3xl border border-white/10 p-6 sm:p-7 shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/10 mb-5">
                <div>
                  <h3 className="font-['Outfit'] font-bold text-lg text-white">
                    Included Formats
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Mix & match any within your monthly quota
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsCreativeListExpanded(!isCreativeListExpanded)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.09] text-xs font-semibold text-slate-300 transition-colors cursor-pointer self-start sm:self-auto shrink-0 border border-white/10"
                >
                  <span>{isCreativeListExpanded ? 'Show Less' : `View All (${creativeTypes.length})`}</span>
                  {isCreativeListExpanded ? (
                    <ChevronUp className="w-3.5 h-3.5" />
                  ) : (
                    <ChevronDown className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-4">
                {(isCreativeListExpanded ? creativeTypes : creativeTypes.slice(0, 6)).map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-2.5 text-xs font-medium text-slate-300"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                    <span>{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Plan Cards (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            {plans.map((plan) => {
              const isSelected = selectedPlan?.id === plan.id;
              const isPopular = plan.isPopular;

              return (
                <div
                  key={plan.id}
                  id={`monthly-plan-card-${plan.id}`}
                  onClick={() => handleTogglePlan(plan.id)}
                  className={`relative rounded-3xl p-6 sm:p-7 border transition-all duration-200 cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-6 ${
                    isSelected
                      ? 'bg-amber-500/10 border-amber-400 ring-2 ring-amber-400/20 shadow-lg'
                      : isPopular
                      ? 'bg-white/[0.05] border-amber-500/40 hover:border-amber-400 shadow-md'
                      : 'bg-white/[0.02] border-white/10 hover:border-white/20 hover:bg-white/[0.04]'
                  }`}
                >
                  {isPopular && (
                    <div className="absolute -top-3 left-6 px-3 py-0.5 text-[10px] font-bold tracking-widest uppercase bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 rounded-full shadow-sm">
                      MOST POPULAR RETAINER
                    </div>
                  )}

                  <div className="space-y-1.5 min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-['Outfit'] font-extrabold text-xl text-white tracking-tight">
                        {plan.name}
                      </span>
                      {isSelected && (
                        <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-amber-400 text-slate-950 rounded-md">
                          Active
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-amber-300 font-semibold">
                      {plan.creativesCountLabel}
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed pt-1">
                      {plan.description || 'Fast 24-48h delivery per requested creative design.'}
                    </p>
                  </div>

                  <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-white/10">
                    <div className="text-left sm:text-right">
                      <div className="font-['Outfit'] font-extrabold text-2xl sm:text-3xl text-white tracking-tight">
                        ₹{plan.price}
                      </div>
                      <div className="text-[10px] text-slate-400 font-medium">
                        per month
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleTogglePlan(plan.id);
                      }}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap active:scale-95 ${
                        isSelected
                          ? 'bg-amber-400 text-slate-950 hover:bg-amber-300'
                          : 'bg-white/[0.07] text-white hover:bg-white/[0.12] border border-white/10'
                      }`}
                    >
                      {isSelected ? (
                        <>
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>Confirm</span>
                        </>
                      ) : (
                        <>
                          <span>Select Plan</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

        </div>

      </div>
    </section>
  );
};
