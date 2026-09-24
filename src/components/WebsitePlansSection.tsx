import React, { useState } from 'react';
import { Check, ArrowRight, Lock, MessageCircle, Sparkles, Shield, Zap } from 'lucide-react';
import type { WebsitePlanConfig, SelectedWebsitePlan } from '../types';
import { useContent } from '../context/ContentContext';

interface WebsitePlansSectionProps {
  selectedPlan?: SelectedWebsitePlan | null;
  onSelectPlan?: (plan: SelectedWebsitePlan | null) => void;
  onOpenCustomQuote: () => void;
}

export const WebsitePlansSection: React.FC<WebsitePlansSectionProps> = ({
  selectedPlan: selectedPlanProp,
  onSelectPlan,
  onOpenCustomQuote,
}) => {
  const { content, openWhatsAppMessage, formatWhatsAppTemplate } = useContent();
  const plans = content.websitePlans || [];

  // State for chosen website plan
  const [internalSelectedPlan, setInternalSelectedPlan] = useState<SelectedWebsitePlan | null>(null);
  const selectedPlan = selectedPlanProp !== undefined ? selectedPlanProp : internalSelectedPlan;
  const setSelectedPlan = (val: SelectedWebsitePlan | null) => {
    setInternalSelectedPlan(val);
    if (onSelectPlan) onSelectPlan(val);
  };

  const handlePlanClick = (plan: WebsitePlanConfig) => {
    if (!plan.isAvailable) return;

    const chosen: SelectedWebsitePlan = {
      id: plan.id,
      name: plan.name,
      price: `${plan.price}${plan.billingCycle}`,
      billingCycle: plan.billingCycle,
      priceNumber: plan.priceNumber,
    };

    if (selectedPlan?.id === plan.id) {
      // If already active, trigger WhatsApp flow immediately
      const priceString = `${plan.price}${plan.billingCycle}`;
      const msg = formatWhatsAppTemplate('websitePlan', {
        planName: plan.name,
        priceFormatted: priceString,
      });
      openWhatsAppMessage(msg);
    } else {
      setSelectedPlan(chosen);
    }
  };

  return (
    <section
      id="websites"
      className="py-20 sm:py-28 bg-[#FFFFFF] text-[#0F172A] border-b border-slate-200/80 scroll-mt-20 relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Intro */}
        <div className="max-w-3xl mb-14 sm:mb-16">
          <div className="inline-flex items-center gap-2 mb-3">
            <span className="w-1.5 h-1.5 bg-[#2563EB] rounded-full" />
            <span className="text-[11px] font-bold tracking-widest uppercase text-slate-500">
              TRANSPARENT INSTITUTIONAL PRICING
            </span>
          </div>
          <h2 className="font-['Outfit'] font-extrabold text-3xl sm:text-4xl md:text-5xl text-[#0F172A] tracking-tight leading-tight">
            Institutional Website Plans.
          </h2>
          <p className="mt-3 text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
            Turnkey website architectures engineered for schools, academies, madrasas, and organizations. Zero surprise hosting charges or hidden maintenance fees.
          </p>
        </div>

        {/* Pricing Comparison Tiers */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch">
          {plans.map((plan) => {
            const isSelected = selectedPlan?.id === plan.id;
            const isUnavailable = !plan.isAvailable;
            const isPopular = plan.isPopular;

            return (
              <div
                key={plan.id}
                id={`website-plan-card-${plan.id}`}
                className={`relative flex flex-col justify-between rounded-3xl p-6 sm:p-8 transition-all duration-200 ${
                  isPopular
                    ? 'bg-slate-900 text-white shadow-xl shadow-slate-900/10 ring-1 ring-slate-800'
                    : isSelected
                    ? 'bg-white border-2 border-[#2563EB] ring-4 ring-[#2563EB]/10 shadow-lg'
                    : isUnavailable
                    ? 'bg-slate-50/70 border border-slate-200/80 opacity-70'
                    : 'bg-white border border-slate-200/90 hover:border-slate-300 hover:shadow-md'
                }`}
              >
                {/* Popular Pill Badge */}
                {isPopular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3.5 py-1 text-[10px] font-bold tracking-widest uppercase bg-gradient-to-r from-[#2563EB] to-[#3B82F6] text-white rounded-full shadow-md">
                    RECOMMENDED PLAN
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className={`font-['Outfit'] font-extrabold text-xl sm:text-2xl tracking-tight ${isPopular ? 'text-white' : 'text-[#0F172A]'}`}>
                      {plan.name}
                    </span>
                    {isSelected && (
                      <span className="px-2.5 py-0.5 text-[10px] font-bold tracking-wider uppercase bg-emerald-500 text-white rounded-full">
                        Selected
                      </span>
                    )}
                  </div>

                  {/* Price Block */}
                  <div className="mb-4 flex items-baseline">
                    <span className={`font-['Outfit'] font-extrabold text-3xl sm:text-4xl lg:text-5xl tracking-tight ${isPopular ? 'text-white' : 'text-[#0F172A]'}`}>
                      {plan.price}
                    </span>
                    <span className={`ml-1.5 text-xs font-semibold ${isPopular ? 'text-slate-400' : 'text-slate-500'}`}>
                      {plan.billingCycle}
                    </span>
                  </div>

                  {/* Short Description */}
                  <p className={`text-xs sm:text-sm leading-relaxed mb-6 ${isPopular ? 'text-slate-300' : 'text-slate-600'}`}>
                    {plan.shortDescription}
                  </p>

                  {/* Feature List Header */}
                  <div className={`mb-3 text-[11px] font-bold uppercase tracking-wider pt-5 border-t ${isPopular ? 'border-slate-800 text-slate-400' : 'border-slate-100 text-slate-400'}`}>
                    {isUnavailable ? 'Upcoming features' : 'Included capabilities'}
                  </div>

                  {/* Feature List */}
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, idx) => {
                      const isEverythingInBasic = feature.startsWith('Everything in');
                      return (
                        <li
                          key={idx}
                          className={`flex items-start gap-2.5 text-xs sm:text-sm ${
                            isPopular
                              ? isEverythingInBasic
                                ? 'font-bold text-white'
                                : 'text-slate-300'
                              : isEverythingInBasic
                              ? 'font-bold text-[#0F172A]'
                              : 'text-slate-600'
                          }`}
                        >
                          <Check className={`w-4 h-4 shrink-0 mt-0.5 ${isPopular ? 'text-[#60A5FA]' : 'text-[#2563EB]'}`} />
                          <span className="leading-snug">{feature}</span>
                        </li>
                      );
                    })}
                  </ul>
                </div>

                {/* Plan Action CTA */}
                <div className="pt-4">
                  {isUnavailable ? (
                    <button
                      type="button"
                      disabled
                      className="w-full py-3 px-4 rounded-xl text-xs font-semibold text-slate-400 bg-slate-100 border border-slate-200 cursor-not-allowed flex items-center justify-center gap-1.5"
                    >
                      <Lock className="w-3.5 h-3.5" />
                      <span>{plan.ctaLabel || 'Coming Soon'}</span>
                    </button>
                  ) : (
                    <div className="space-y-2">
                      <button
                        type="button"
                        onClick={() => handlePlanClick(plan)}
                        className={`w-full py-3.5 px-4 rounded-xl text-xs sm:text-sm font-bold active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs ${
                          isSelected
                            ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                            : isPopular
                            ? 'bg-[#2563EB] hover:bg-[#3B82F6] text-white shadow-[0_0_20px_-3px_rgba(37,99,235,0.6)]'
                            : 'bg-[#0F172A] hover:bg-[#2563EB] text-white'
                        }`}
                      >
                        {isSelected ? (
                          <>
                            <MessageCircle className="w-4 h-4" />
                            <span>Confirm on WhatsApp ({plan.price})</span>
                          </>
                        ) : (
                          <>
                            <span>{plan.ctaLabel || `Select ${plan.name}`}</span>
                            <ArrowRight className="w-4 h-4" />
                          </>
                        )}
                      </button>

                      {isSelected && (
                        <p className={`text-[11px] text-center ${isPopular ? 'text-slate-400' : 'text-slate-500'}`}>
                          Plan added to order bar below. Click to dispatch directly to WhatsApp.
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Custom Requirements Banner */}
        <div className="mt-12 sm:mt-16 bg-[#F8FAFC] border border-slate-200/90 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-2xs">
          <div>
            <h3 className="font-['Outfit'] font-bold text-lg sm:text-xl text-[#0F172A]">
              Need a Custom Institutional Setup or Multi-Campus Portal?
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-xl">
              We engineer custom portals, examination results publishing desks, alumni directories, and dedicated madrasa setups.
            </p>
          </div>
          <button
            type="button"
            onClick={onOpenCustomQuote}
            className="w-full sm:w-auto px-6 py-3 rounded-xl font-bold text-xs sm:text-sm text-[#0F172A] bg-white hover:bg-slate-50 border border-slate-200 hover:border-slate-300 shadow-2xs transition-all flex items-center justify-center gap-2 shrink-0 cursor-pointer active:scale-98"
          >
            <span>Request Custom Scope</span>
            <ArrowRight className="w-4 h-4 text-slate-400" />
          </button>
        </div>

      </div>
    </section>
  );
};
