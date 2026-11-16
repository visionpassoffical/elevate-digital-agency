import React, { useState } from 'react';
import { Check, ArrowRight, Lock, MessageCircle } from 'lucide-react';
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
  const plans = content.websitePlans || [];

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
            TRANSPARENT INSTITUTIONAL PRICING
          </div>
          <h2 className="font-['Outfit'] font-extrabold text-2xl sm:text-3xl md:text-4xl text-[#0F172A] tracking-tight leading-tight">
            Institutional Website Plans
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-600 leading-relaxed">
            Turnkey website architectures engineered for schools, academies, madrasas, and organizations.
          </p>
        </div>
      )}

      {/* Mobile Swipe Hint */}
      <div className="flex items-center justify-between md:hidden mb-3 px-1">
        <span className="text-[11px] font-semibold text-slate-500">
          Swipe to compare plans
        </span>
        <span className="text-[11px] font-bold text-[#2563EB]">
          3 Tiers →
        </span>
      </div>

      {/* Pricing Comparison Tiers: Horizontal Snap Carousel on Mobile, 3-Col Grid on Desktop */}
      <div className="flex md:grid md:grid-cols-3 gap-5 sm:gap-6 items-stretch overflow-x-auto md:overflow-visible snap-x snap-mandatory pt-3 pb-4 md:pb-0 -mx-4 px-4 md:mx-0 md:px-0 no-scrollbar">
        {plans.map((plan, idx) => {
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
              className={`w-[85vw] max-w-[330px] sm:w-[340px] md:w-auto md:max-w-none shrink-0 snap-center relative flex flex-col justify-between rounded-2xl p-6 sm:p-7 transition-all duration-200 ${
                isPopular
                  ? 'bg-[#0F172A] text-white shadow-[0_20px_45px_-15px_rgba(15,23,42,0.45)] ring-1 ring-white/10'
                  : isSelected
                  ? 'bg-white text-[#0F172A] ring-2 ring-emerald-500 shadow-[0_10px_30px_-10px_rgba(15,23,42,0.1)]'
                  : isUnavailable
                  ? 'bg-white/75 text-[#0F172A] shadow-[0_6px_20px_-10px_rgba(15,23,42,0.05)] opacity-85'
                  : 'bg-white text-[#0F172A] shadow-[0_10px_30px_-10px_rgba(15,23,42,0.08)] hover:shadow-[0_16px_36px_-10px_rgba(15,23,42,0.12)]'
              }`}
            >
              {isPopular && (
                <div className="absolute -top-3 left-6 px-3 py-1 text-[10px] font-bold tracking-[0.12em] uppercase bg-[#2563EB] text-white rounded-full shadow-[0_4px_12px_rgba(37,99,235,0.45)] whitespace-nowrap">
                  MOST POPULAR
                </div>
              )}

              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span
                    className={`font-['Outfit'] font-extrabold text-lg sm:text-xl tracking-tight ${
                      isPopular ? 'text-white' : 'text-[#0F172A]'
                    }`}
                  >
                    {plan.name}
                  </span>
                  {isSelected && (
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-400">
                      Selected
                    </span>
                  )}
                </div>

                {/* Price Block */}
                <div className="mb-3 flex items-baseline">
                  <span
                    className={`font-['Outfit'] font-extrabold text-3xl sm:text-4xl tracking-tight tabular-nums ${
                      isPopular ? 'text-white' : 'text-[#0F172A]'
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
                  className={`text-xs sm:text-[13px] leading-relaxed mb-5 ${
                    isPopular ? 'text-slate-300' : 'text-slate-600'
                  }`}
                >
                  {plan.shortDescription}
                </p>

                <div
                  className={`mb-3 text-[10px] font-bold uppercase tracking-[0.12em] pt-4 border-t ${
                    isPopular
                      ? 'border-white/10 text-slate-400'
                      : 'border-slate-100 text-slate-400'
                  }`}
                >
                  {isUnavailable ? 'Upcoming capabilities' : 'Included features'}
                </div>

                <ul className="grid grid-cols-1 gap-2.5 mb-6">
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
                            ? 'font-bold text-[#0F172A]'
                            : 'text-slate-600'
                        }`}
                      >
                        <Check
                          className={`w-4 h-4 shrink-0 mt-0.5 ${
                            isPopular ? 'text-blue-400' : 'text-[#2563EB]'
                          }`}
                        />
                        <span className="leading-snug">{feature}</span>
                      </li>
                    );
                  })}
                </ul>
              </div>

              {/* Plan Action CTA */}
              <div className="pt-2">
                {isUnavailable ? (
                  <button
                    type="button"
                    disabled
                    className="w-full py-3 px-4 rounded-xl text-xs font-semibold text-slate-400 bg-[#F4F6FB] cursor-not-allowed flex items-center justify-center gap-1.5"
                  >
                    <Lock className="w-3.5 h-3.5" />
                    <span>{plan.ctaLabel || 'Coming Soon'}</span>
                  </button>
                ) : (
                  <div className="space-y-1.5">
                    <button
                      type="button"
                      onClick={() => handlePlanClick(plan)}
                      className={`w-full py-3.5 px-4 rounded-xl text-xs font-bold active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer ${
                        isSelected
                          ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm'
                          : isPopular
                          ? 'bg-[#2563EB] hover:bg-blue-500 text-white shadow-[0_8px_25px_-4px_rgba(37,99,235,0.6)]'
                          : 'bg-[#0F172A] hover:bg-[#2563EB] text-white'
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
                          <ArrowRight className="w-3.5 h-3.5" />
                        </>
                      )}
                    </button>

                    {isSelected && (
                      <p
                        className={`text-[10px] text-center ${
                          isPopular ? 'text-slate-400' : 'text-slate-500'
                        }`}
                      >
                        Added to order bar. Tap again to open WhatsApp.
                      </p>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Compact Custom Website Scope Strip */}
      <div className="mt-6 bg-white rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-[0_10px_30px_-10px_rgba(15,23,42,0.06)]">
        <div>
          <h3 className="font-['Outfit'] font-bold text-sm sm:text-base text-[#0F172A]">
            Need a Custom Multi-Campus Portal or Results Desk?
          </h3>
          <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
            We build custom student portals, exam results lookup engines, and bespoke institutional web applications.
          </p>
        </div>
        <button
          type="button"
          onClick={onOpenCustomQuote}
          className="w-full sm:w-auto px-4 py-2.5 rounded-xl font-bold text-xs text-white bg-[#2563EB] hover:bg-[#1D4ED8] transition-all flex items-center justify-center gap-1.5 shrink-0 cursor-pointer active:scale-98 whitespace-nowrap"
        >
          <span>Request Custom Scope</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );

  if (embedded) {
    return innerContent;
  }

  return (
    <section className="py-14 sm:py-20 bg-[#F4F6FB] text-[#0F172A] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {innerContent}
      </div>
    </section>
  );
};
