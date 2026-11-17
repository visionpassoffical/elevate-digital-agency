import React from 'react';
import { ArrowUpRight, MessageCircle } from 'lucide-react';
import type { MonthlyCreativePlanConfig, SelectedMonthlyPlan } from '../types';
import { useContent } from '../context/ContentContext';

interface MonthlyCreativeSectionProps {
  selectedPlan?: SelectedMonthlyPlan | null;
  onSelectPlan: (plan: SelectedMonthlyPlan | null) => void;
  embedded?: boolean;
}

const DEFAULT_CREATIVE_TAGS = [
  'Posters',
  'Social Media Ads',
  'Event Invites',
  'Circulars',
  'WhatsApp Status',
  'Branding',
  'Admission Flyers',
  'Achievement Banners',
];

export const MonthlyCreativeSection: React.FC<MonthlyCreativeSectionProps> = ({
  selectedPlan,
  onSelectPlan,
  embedded = false,
}) => {
  const { content, openWhatsAppMessage, formatWhatsAppTemplate } = useContent();
  const plans = content.monthlyCreativePlans.plans || [];
  const configuredTypes = (content.monthlyCreativePlans.creativeTypes || []).map((t) => t.label);
  const tagItems = Array.from(new Set([...DEFAULT_CREATIVE_TAGS, ...configuredTypes]));

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
    <div id="creative" className="scroll-mt-24">
      {/* Sleek Horizontal Scrolling Tag Strip (Replaces Bulky Checklist Box) */}
      <div className="mb-7 sm:mb-8">
        <div className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-400 mb-3">
          INCLUDED CREATIVE DELIVERABLES — MIX &amp; MATCH ANY FORMAT
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-1 -mx-5 px-5 sm:mx-0 sm:px-0 no-scrollbar">
          {tagItems.map((tag) => (
            <span
              key={tag}
              className="px-3.5 py-1.5 rounded-full bg-[#F5F5F7] border border-slate-200/80 text-xs font-semibold text-[#09090B] whitespace-nowrap shrink-0"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* 3-Column Editorial Retainer Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 items-stretch">
        {plans.map((plan) => {
          const isSelected = selectedPlan?.id === plan.id;
          const isPopular = plan.isPopular;

          return (
            <div
              key={plan.id}
              id={`monthly-plan-card-${plan.id}`}
              onClick={() => handleTogglePlan(plan.id)}
              className={`relative rounded-2xl p-6 sm:p-7 transition-all duration-200 cursor-pointer flex flex-col justify-between ${
                isPopular
                  ? 'bg-[#09090B] text-white border border-[#09090B]'
                  : isSelected
                  ? 'bg-white text-[#09090B] border-2 border-[#2563EB]'
                  : 'bg-white text-[#09090B] border border-slate-200/90 hover:border-slate-400'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span
                    className={`text-[10px] font-bold uppercase tracking-[0.14em] ${
                      isPopular ? 'text-[#2563EB]' : 'text-slate-400'
                    }`}
                  >
                    {isPopular ? 'MOST POPULAR RETAINER' : 'MONTHLY RETAINER'}
                  </span>
                  {isSelected && (
                    <span className="px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-400 rounded-full">
                      Selected
                    </span>
                  )}
                </div>

                <h3
                  className={`font-['Outfit'] font-extrabold text-xl sm:text-2xl tracking-[-0.02em] mb-2 ${
                    isPopular ? 'text-white' : 'text-[#09090B]'
                  }`}
                >
                  {plan.name}
                </h3>

                <div className="mb-4 flex items-baseline">
                  <span
                    className={`font-['Outfit'] font-extrabold text-3xl sm:text-4xl tracking-[-0.03em] tabular-nums ${
                      isPopular ? 'text-white' : 'text-[#09090B]'
                    }`}
                  >
                    ₹{plan.price}
                  </span>
                  <span
                    className={`ml-1.5 text-xs font-medium ${
                      isPopular ? 'text-slate-400' : 'text-slate-500'
                    }`}
                  >
                    /month
                  </span>
                </div>

                <div
                  className={`inline-block px-3 py-1 rounded-full text-xs font-bold mb-4 ${
                    isPopular
                      ? 'bg-white/10 text-blue-300'
                      : 'bg-[#F5F5F7] text-[#2563EB]'
                  }`}
                >
                  {plan.creativesCountLabel} per month
                </div>

                <p
                  className={`text-xs sm:text-sm leading-relaxed mb-6 ${
                    isPopular ? 'text-slate-300' : 'text-slate-600'
                  }`}
                >
                  {plan.description || 'Bespoke social media posters, circulars, and digital campaign assets delivered in 24–48h.'}
                </p>
              </div>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleTogglePlan(plan.id);
                }}
                className={`w-full py-3.5 px-5 rounded-full text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap ${
                  isSelected
                    ? 'bg-emerald-600 text-white hover:bg-emerald-500'
                    : isPopular
                    ? 'bg-[#2563EB] text-white hover:bg-blue-500'
                    : 'bg-[#09090B] text-white hover:bg-[#2563EB]'
                }`}
              >
                {isSelected ? (
                  <>
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>Confirm Retainer (₹{plan.price}/mo)</span>
                  </>
                ) : (
                  <>
                    <span>Select {plan.name}</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );

  if (embedded) {
    return innerContent;
  }

  return (
    <section className="py-14 sm:py-20 bg-[#FFFFFF] text-[#09090B] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 relative z-10">
        {innerContent}
      </div>
    </section>
  );
};
