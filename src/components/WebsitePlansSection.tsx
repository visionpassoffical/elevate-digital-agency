import React, { useState, useMemo } from 'react';
import { Check, ArrowUpRight, Lock, MessageCircle } from 'lucide-react';
import { motion } from 'motion/react';
import type { WebsitePlanConfig, SelectedWebsitePlan } from '../types';
import { useContent } from '../context/ContentContext';
import { ensureRupee } from '../utils/whatsapp';

interface WebsitePlansSectionProps {
  selectedPlan?: SelectedWebsitePlan | null;
  onSelectPlan?: (plan: SelectedWebsitePlan | null) => void;
  onOpenCustomQuote: () => void;
  embedded?: boolean;
}

export const WebsitePlansSection: React.FC<WebsitePlansSectionProps> = ({
  selectedPlan: selectedPlanProp,
  onSelectPlan,
  onOpenCustomQuote,
  embedded = false,
}) => {
  const { content, openWhatsAppMessage, formatWhatsAppTemplate } = useContent();

  // Order plans so Standard / Popular Plan is featured first
  const orderedPlans = useMemo(() => {
    const raw = [...(content.websitePlans || [])];
    return raw.sort((a, b) => {
      if (a.isPopular && !b.isPopular) return -1;
      if (!a.isPopular && b.isPopular) return 1;
      return 0;
    });
  }, [content.websitePlans]);

  const [internalSelectedPlan, setInternalSelectedPlan] = useState<SelectedWebsitePlan | null>(null);
  const selectedPlan = selectedPlanProp !== undefined ? selectedPlanProp : internalSelectedPlan;
  const setSelectedPlan = (val: SelectedWebsitePlan | null) => {
    setInternalSelectedPlan(val);
    if (onSelectPlan) onSelectPlan(val);
  };

  const handlePlanClick = (plan: WebsitePlanConfig) => {
    if (!plan.isAvailable) return;

    const cleanPrice = ensureRupee(plan.price);
    const chosen: SelectedWebsitePlan = {
      id: plan.id,
      name: plan.name,
      price: `${cleanPrice}${plan.billingCycle}`,
      billingCycle: plan.billingCycle,
      priceNumber: plan.priceNumber,
    };

    if (selectedPlan?.id === plan.id) {
      const priceString = `${cleanPrice}${plan.billingCycle}`;
      const msg = formatWhatsAppTemplate('websitePlan', {
        planName: plan.name,
        plan_name: plan.name,
        priceFormatted: priceString,
        price: priceString,
      });
      openWhatsAppMessage(msg);
    } else {
      setSelectedPlan(chosen);
    }
  };

  const innerContent = (
    <div id="websites" className="scroll-mt-24">
      {!embedded && (
        <div className="max-w-3xl mb-10">
          <div className="text-[11px] font-bold tracking-[0.14em] uppercase text-[#2563EB] mb-2">
            WEB ARCHITECTURE
          </div>
          <h2 className="font-['Outfit'] font-extrabold text-3xl sm:text-4xl text-[#09090B] tracking-[-0.03em] leading-tight">
            Website Development Tiers
          </h2>
        </div>
      )}

      {/* Editorial Pricing Tiers */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 items-stretch">
        {orderedPlans.map((plan, idx) => {
          const isSelected = selectedPlan?.id === plan.id;
          const isUnavailable = !plan.isAvailable;
          const isPopular = plan.isPopular;
          const formattedPlanPrice = ensureRupee(plan.price);

          return (
            <motion.div
              key={plan.id}
              id={`website-plan-card-${plan.id}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: idx * 0.04 }}
              className={`relative flex flex-col justify-between rounded-2xl p-6 sm:p-8 transition-all duration-200 ${
                isPopular
                  ? 'bg-[#09090B] text-white border border-[#09090B]'
                  : isSelected
                  ? 'bg-white text-[#09090B] border-2 border-[#2563EB]'
                  : isUnavailable
                  ? 'bg-[#F5F5F7] text-[#09090B] border border-slate-200/80 opacity-80'
                  : 'bg-white text-[#09090B] border border-slate-200/90 hover:border-slate-400'
              }`}
            >
              <div>
                {/* Top Kicker Row */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span
                    className={`text-[10px] font-bold uppercase tracking-[0.14em] ${
                      isPopular ? 'text-[#2563EB]' : 'text-slate-400'
                    }`}
                  >
                    {isPopular ? 'MOST POPULAR' : isUnavailable ? 'ENTERPRISE' : 'ESSENTIAL TIER'}
                  </span>
                  {isSelected && (
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400">
                      Selected
                    </span>
                  )}
                </div>

                <h3
                  className={`font-['Outfit'] font-extrabold text-xl sm:text-2xl tracking-[-0.02em] mb-3 ${
                    isPopular ? 'text-white' : 'text-[#09090B]'
                  }`}
                >
                  {plan.name}
                </h3>

                {/* Price Block */}
                <div className="mb-4 flex items-baseline">
                  <span
                    className={`font-['Outfit'] font-extrabold text-3xl sm:text-4xl tracking-[-0.03em] tabular-nums ${
                      isPopular ? 'text-white' : 'text-[#09090B]'
                    }`}
                  >
                    {formattedPlanPrice}
                  </span>
                  <span
                    className={`ml-1.5 text-xs font-medium ${
                      isPopular ? 'text-slate-400' : 'text-slate-500'
                    }`}
                  >
                    {plan.billingCycle}
                  </span>
                </div>

                <p
                  className={`text-xs sm:text-sm leading-relaxed mb-6 pb-6 border-b ${
                    isPopular
                      ? 'text-slate-300 border-white/10'
                      : 'text-slate-600 border-slate-200/80'
                  }`}
                >
                  {plan.shortDescription}
                </p>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, fIdx) => {
                    const isEverythingInBasic = feature.startsWith('Everything in');
                    return (
                      <li
                        key={fIdx}
                        className={`flex items-start gap-2.5 text-xs sm:text-[13px] ${
                          isPopular
                            ? isEverythingInBasic
                              ? 'font-bold text-white'
                              : 'text-slate-300'
                            : isEverythingInBasic
                            ? 'font-bold text-[#09090B]'
                            : 'text-slate-600'
                        }`}
                      >
                        <Check
                          className={`w-4 h-4 shrink-0 mt-0.5 ${
                            isPopular ? 'text-[#2563EB]' : 'text-[#09090B]'
                          }`}
                        />
                        <span className="leading-snug">{feature}</span>
                      </li>
                    );
                  })}
                </ul>
              </div>

              {/* Plan Action CTA */}
              <div>
                {isUnavailable ? (
                  <button
                    type="button"
                    disabled
                    className="w-full py-3.5 px-5 rounded-full text-xs font-semibold text-slate-400 bg-white border border-slate-200/80 cursor-not-allowed flex items-center justify-center gap-1.5"
                  >
                    <Lock className="w-3.5 h-3.5" />
                    <span>{plan.ctaLabel || 'Coming Soon'}</span>
                  </button>
                ) : (
                  <div className="space-y-2">
                    <button
                      type="button"
                      onClick={() => handlePlanClick(plan)}
                      className={`w-full py-3.5 px-5 rounded-full text-xs font-bold active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer ${
                        isSelected
                          ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                          : isPopular
                          ? 'bg-[#2563EB] hover:bg-blue-500 text-white'
                          : 'bg-[#09090B] hover:bg-[#2563EB] text-white'
                      }`}
                    >
                      {isSelected ? (
                        <>
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>Confirm on WhatsApp ({formattedPlanPrice})</span>
                        </>
                      ) : (
                        <>
                          <span>{plan.ctaLabel || `Select ${plan.name}`}</span>
                          <ArrowUpRight className="w-4 h-4" />
                        </>
                      )}
                    </button>

                    {isSelected && (
                      <p
                        className={`text-[10px] text-center ${
                          isPopular ? 'text-slate-400' : 'text-slate-500'
                        }`}
                      >
                        Added to project brief. Tap again to launch WhatsApp.
                      </p>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Architectural Custom Web Application Strip */}
      <div className="mt-8 pt-6 border-t border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h4 className="font-['Outfit'] font-bold text-base text-[#09090B]">
            Need a Custom Web Application, E-Commerce Store, or Campus ERP?
          </h4>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            We architect custom portals, exam results lookup engines, and bespoke brand platforms.
          </p>
        </div>
        <button
          type="button"
          onClick={onOpenCustomQuote}
          className="self-start sm:self-auto inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#2563EB] hover:text-[#09090B] transition-colors cursor-pointer whitespace-nowrap"
        >
          <span>Discuss Custom Architecture</span>
          <ArrowUpRight className="w-4 h-4" />
        </button>
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
