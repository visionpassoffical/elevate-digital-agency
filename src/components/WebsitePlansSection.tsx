import React, { useState } from 'react';
import { Check, ArrowRight, Lock, MessageCircle } from 'lucide-react';
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
      className="py-16 sm:py-20 lg:py-24 bg-white border-b border-slate-200/80 scroll-mt-20"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* SECTION INTRO */}
        <div className="max-w-3xl mb-12 sm:mb-14">
          <div className="inline-flex items-center gap-2 mb-3">
            <span className="w-1.5 h-1.5 bg-[#2563EB] rounded-full" />
            <span className="text-[11px] font-bold tracking-widest uppercase text-slate-500">
              WEBSITES & PORTALS
            </span>
          </div>
          <h2 className="font-['Outfit'] font-extrabold text-3xl sm:text-4xl md:text-5xl text-[#0F172A] tracking-tight leading-tight">
            A Website That Works for You.
          </h2>
          <p className="mt-3 text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
            Professional, responsive websites designed to give your institution a clear and credible digital presence.
          </p>
        </div>

        {/* PRICING CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6">
          {plans.map((plan) => {
            const isSelected = selectedPlan?.id === plan.id;
            const isUnavailable = !plan.isAvailable;

            return (
              <div
                key={plan.id}
                id={`website-plan-card-${plan.id}`}
                className={`relative flex flex-col justify-between rounded-2xl p-6 sm:p-7 border transition-all duration-200 ${
                  isSelected
                    ? 'border-[#2563EB] ring-2 ring-[#2563EB]/15 bg-white shadow-sm'
                    : isUnavailable
                    ? 'bg-slate-50/60 border-slate-200/80 opacity-70'
                    : 'bg-white border-slate-200/90 hover:border-slate-300 shadow-xs hover:shadow-sm'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <span className="font-['Outfit'] font-extrabold text-xl text-[#0F172A] tracking-tight">
                      {plan.name}
                    </span>
                    {plan.isPopular && (
                      <span className="px-2.5 py-0.5 text-[10px] font-bold tracking-wider uppercase bg-blue-50 text-[#2563EB] border border-blue-200/80 rounded-full">
                        Most Popular
                      </span>
                    )}
                  </div>

                  {/* Price Block */}
                  <div className="mb-3 flex items-baseline">
                    <span className="font-['Outfit'] font-extrabold text-3xl sm:text-4xl text-[#0F172A] tracking-tight">
                      {plan.price}
                    </span>
                    <span className="ml-1.5 text-xs font-semibold text-slate-500">
                      {plan.billingCycle}
                    </span>
                  </div>

                  {/* Short Description */}
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
                    {plan.shortDescription}
                  </p>

                  {/* Feature List Header */}
                  <div className="mb-3 text-[11px] font-bold uppercase tracking-wider text-slate-400 border-t border-slate-100 pt-5">
                    {isUnavailable ? 'Upcoming features' : 'Included features'}
                  </div>

                  {/* Feature List */}
                  <ul className="space-y-2.5 mb-8">
                    {plan.features.map((feature, idx) => {
                      const isEverythingInBasic = feature.startsWith('Everything in');
                      return (
                        <li
                          key={idx}
                          className={`flex items-start gap-2.5 text-xs ${
                            isEverythingInBasic
                              ? 'font-bold text-[#0F172A]'
                              : 'text-slate-600'
                          }`}
                        >
                          <Check className="w-3.5 h-3.5 text-[#2563EB] shrink-0 mt-0.5" />
                          <span className="leading-snug">{feature}</span>
                        </li>
                      );
                    })}
                  </ul>
                </div>

                {/* Card CTA Area */}
                <div className="mt-auto pt-4 border-t border-slate-100">
                  {isUnavailable ? (
                    <button
                      type="button"
                      disabled
                      className="w-full py-3 px-4 rounded-xl text-xs font-bold bg-slate-100 text-slate-400 cursor-not-allowed text-center select-none"
                    >
                      {plan.unavailableStatus}
                    </button>
                  ) : (
                    <button
                      id={`choose-plan-btn-${plan.id}`}
                      type="button"
                      onClick={() => handlePlanClick(plan)}
                      className={`w-full py-3 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer active:scale-[0.98] ${
                        isSelected
                          ? 'bg-[#2563EB] hover:bg-blue-700 text-white shadow-xs'
                          : 'bg-white hover:bg-slate-50 text-[#0F172A] border border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      {isSelected ? (
                        <>
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>Continue on WhatsApp</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </>
                      ) : (
                        <>
                          <span>{plan.ctaLabel}</span>
                          <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Custom Quote CTA Below Grid */}
        <div className="mt-10 sm:mt-14 p-5 sm:p-6 bg-[#F1F5F9]/80 border border-slate-200/90 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-center sm:text-left max-w-lg">
            <h3 className="text-base font-bold text-[#0F172A] mb-0.5">
              Need a completely custom web solution?
            </h3>
            <p className="text-xs sm:text-sm text-slate-600">
              For complex academies, multi-campus institutions, and deep e-learning integration, we provide bespoke builds.
            </p>
          </div>
          <button
            onClick={onOpenCustomQuote}
            className="shrink-0 px-5 py-2.5 rounded-xl font-bold text-xs text-[#0F172A] bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 hover:shadow-xs transition-all cursor-pointer flex items-center gap-2"
          >
            <span>Request Custom Build</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#2563EB]" />
          </button>
        </div>

      </div>
    </section>
  );
};
