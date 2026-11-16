import React, { useState } from 'react';
import { ArrowRight, MessageCircle, ChevronDown, ChevronUp, Check } from 'lucide-react';
import type { MonthlyCreativePlanConfig, SelectedMonthlyPlan } from '../types';
import { useContent } from '../context/ContentContext';

interface MonthlyCreativeSectionProps {
  selectedPlan?: SelectedMonthlyPlan | null;
  onSelectPlan: (plan: SelectedMonthlyPlan | null) => void;
  embedded?: boolean;
}

export const MonthlyCreativeSection: React.FC<MonthlyCreativeSectionProps> = ({
  selectedPlan,
  onSelectPlan,
  embedded = false,
}) => {
  const { content, openWhatsAppMessage, formatWhatsAppTemplate } = useContent();
  const plans = content.monthlyCreativePlans.plans || [];
  const creativeTypes = content.monthlyCreativePlans.creativeTypes || [];

  const [isCreativeListExpanded, setIsCreativeListExpanded] = useState(false);

  const handleTogglePlan = (planId: string) => {
    if (selectedPlan?.id === planId) {
      const p = plans.find((x) => x.id === planId);
      if (p) handleOpenWhatsAppForPlan(p);
      return;
    }

    const p = plans.find((x) => x.id === planId);
    if (!p) return;

    onSelectPlan({
      id: p.id,
      name: p.name,
      price: `₹${p.price}/mo`,
      creativesCountLabel: p.creativesCountLabel,
      monthlyPriceNumber: p.price,
      creativesCount: p.creativesCount,
      category: 'Monthly Creative',
    });
  };

  const handleOpenWhatsAppForPlan = (plan: MonthlyCreativePlanConfig) => {
    const msg = formatWhatsAppTemplate('monthlyPlan', {
      planName: plan.name,
      plan_name: plan.name,
      priceFormatted: `₹${plan.price}/month`,
      price: `₹${plan.price}/month`,
      creativesLabel: plan.creativesCountLabel,
      quantity: String(plan.creativesCount || plan.creativesCountLabel),
    });
    openWhatsAppMessage(msg);
  };

  const innerContent = (
    <div id="creative" className="scroll-mt-24 pt-2">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-start">
        {/* LEFT COLUMN: Included Formats Showcase (5 cols) */}
        <div className="lg:col-span-5">
          {!embedded && (
            <div className="mb-6">
              <h2 className="font-['Outfit'] font-extrabold text-2xl sm:text-3xl text-[#0F172A] tracking-tight mb-2">
                Monthly Creative Retainers
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Keep your campus social channels active and dignified with fixed-price monthly design quotas.
              </p>
            </div>
          )}

          <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-[0_10px_30px_-10px_rgba(15,23,42,0.08)]">
            <div className="flex items-center justify-between gap-2 pb-3.5 border-b border-slate-100 mb-4">
              <div>
                <h3 className="font-['Outfit'] font-bold text-base sm:text-lg text-[#0F172A]">
                  Included Design Formats
                </h3>
                <p className="text-xs text-slate-500">
                  Mix &amp; match any format within your monthly quota
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsCreativeListExpanded(!isCreativeListExpanded)}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#F4F6FB] hover:bg-slate-200/70 text-xs font-semibold text-slate-700 transition-colors cursor-pointer shrink-0"
              >
                <span>{isCreativeListExpanded ? 'Show Less' : `View All (${creativeTypes.length})`}</span>
                {isCreativeListExpanded ? (
                  <ChevronUp className="w-3.5 h-3.5" />
                ) : (
                  <ChevronDown className="w-3.5 h-3.5" />
                )}
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2.5 gap-x-3">
              {(isCreativeListExpanded ? creativeTypes : creativeTypes.slice(0, 6)).map((item) => (
                <div
                  key={item.id}
                  className="flex items-start gap-2 text-xs font-medium text-slate-700"
                >
                  <Check className="w-3.5 h-3.5 text-[#2563EB] shrink-0 mt-0.5" />
                  <span className="leading-snug">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Plan Cards (7 cols) */}
        <div className="lg:col-span-7 space-y-3.5">
          {plans.map((plan) => {
            const isSelected = selectedPlan?.id === plan.id;
            const isPopular = plan.isPopular;

            return (
              <div
                key={plan.id}
                id={`monthly-plan-card-${plan.id}`}
                onClick={() => handleTogglePlan(plan.id)}
                className={`relative rounded-2xl p-5 sm:p-6 transition-all duration-200 cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                  isPopular
                    ? 'bg-[#0F172A] text-white shadow-[0_18px_40px_-14px_rgba(15,23,42,0.4)]'
                    : isSelected
                    ? 'bg-white text-[#0F172A] ring-2 ring-[#2563EB] shadow-[0_10px_30px_-10px_rgba(15,23,42,0.1)]'
                    : 'bg-white text-[#0F172A] shadow-[0_10px_30px_-10px_rgba(15,23,42,0.08)] hover:shadow-[0_14px_32px_-10px_rgba(15,23,42,0.12)]'
                }`}
              >
                {isPopular && (
                  <div className="absolute -top-2.5 left-5 px-3 py-0.5 text-[10px] font-bold tracking-[0.12em] uppercase bg-[#2563EB] text-white rounded-full shadow-xs">
                    MOST POPULAR RETAINER
                  </div>
                )}

                <div className="space-y-1 min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`font-['Outfit'] font-extrabold text-base sm:text-lg tracking-tight ${
                        isPopular ? 'text-white' : 'text-[#0F172A]'
                      }`}
                    >
                      {plan.name}
                    </span>
                    {isSelected && (
                      <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-400 rounded-md">
                        Selected
                      </span>
                    )}
                  </div>
                  <div
                    className={`text-xs font-bold ${
                      isPopular ? 'text-blue-400' : 'text-[#2563EB]'
                    }`}
                  >
                    {plan.creativesCountLabel} per month
                  </div>
                  <p
                    className={`text-xs leading-relaxed ${
                      isPopular ? 'text-slate-300' : 'text-slate-500'
                    }`}
                  >
                    {plan.description || 'Fast 24–48h delivery per requested creative design.'}
                  </p>
                </div>

                <div
                  className={`flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-3 shrink-0 pt-3 sm:pt-0 border-t sm:border-t-0 ${
                    isPopular ? 'border-white/10' : 'border-slate-100'
                  }`}
                >
                  <div className="text-left sm:text-right">
                    <div
                      className={`font-['Outfit'] font-extrabold text-2xl tracking-tight tabular-nums ${
                        isPopular ? 'text-white' : 'text-[#0F172A]'
                      }`}
                    >
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
                    className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap active:scale-95 ${
                      isSelected
                        ? 'bg-emerald-600 text-white hover:bg-emerald-500'
                        : isPopular
                        ? 'bg-[#2563EB] text-white hover:bg-blue-500 shadow-[0_6px_20px_-4px_rgba(37,99,235,0.55)]'
                        : 'bg-[#0F172A] text-white hover:bg-[#2563EB]'
                    }`}
                  >
                    {isSelected ? (
                      <>
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>Confirm (₹{plan.price})</span>
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
  );

  if (embedded) {
    return innerContent;
  }

  return (
    <section className="py-12 sm:py-16 bg-[#F4F6FB] text-[#0F172A] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {innerContent}
      </div>
    </section>
  );
};
