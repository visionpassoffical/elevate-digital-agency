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
      className="py-16 sm:py-24 lg:py-28 bg-white border-b border-slate-100 scroll-mt-20"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* SECTION INTRO */}
        <div className="max-w-3xl mb-12 sm:mb-16">
          <h2 className="font-['Outfit'] font-extrabold text-3xl sm:text-4xl md:text-5xl text-[#0B0F17] tracking-tight leading-tight">
            A Website That Works for You.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
            Professional, responsive websites designed to give your institution a clear and credible digital presence.
          </p>
        </div>

        {/* PRICING COLUMNS */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-y-12 gap-x-12 lg:gap-x-16 border-t border-slate-100 pt-12">
          {plans.map((plan) => {
            const isSelected = selectedPlan?.id === plan.id;
            const isUnavailable = !plan.isAvailable;

            return (
              <div
                key={plan.id}
                id={`website-plan-card-${plan.id}`}
                className={`relative flex flex-col transition-all duration-300 ${
                  isUnavailable ? 'opacity-50' : 'opacity-100'
                }`}
              >
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <span className="font-['Outfit'] font-extrabold text-xl sm:text-2xl text-[#0B0F17] tracking-tight">
                      {plan.name}
                    </span>
                    {plan.isPopular && (
                      <span className="px-2.5 py-1 text-[10px] font-bold tracking-widest uppercase bg-[#0B0F17] text-white rounded">
                        Most Popular
                      </span>
                    )}
                  </div>

                  {/* Price Block */}
                  <div className="mb-4 flex items-baseline">
                    <span className="font-['Outfit'] font-extrabold text-4xl sm:text-5xl text-[#0B0F17] tracking-tight">
                      {plan.price}
                    </span>
                    <span className="ml-2 text-sm font-semibold text-slate-400">
                      {plan.billingCycle}
                    </span>
                  </div>

                  {/* Short Description */}
                  <p className="text-sm text-slate-500 leading-relaxed mb-8">
                    {plan.shortDescription}
                  </p>

                  {/* Feature List Header */}
                  <div className="mb-4 text-xs font-bold uppercase tracking-wider text-slate-400 border-t border-slate-100 pt-6">
                    {isUnavailable ? 'Upcoming features' : 'Included features'}
                  </div>

                  {/* Feature List */}
                  <ul className="space-y-3.5 mb-10">
                    {plan.features.map((feature, idx) => {
                      const isEverythingInBasic = feature.startsWith('Everything in');
                      return (
                        <li
                          key={idx}
                          className={`flex items-start gap-3 text-sm ${
                            isEverythingInBasic
                              ? 'font-bold text-[#0B0F17]'
                              : 'text-slate-600'
                          }`}
                        >
                          <Check className="w-4 h-4 text-[#0B0F17] shrink-0 mt-0.5" />
                          <span className="leading-snug">{feature}</span>
                        </li>
                      );
                    })}
                  </ul>
                </div>

                {/* Card CTA Area */}
                <div className="mt-auto">
                  {isUnavailable ? (
                    <button
                      type="button"
                      disabled
                      className="w-full py-4 px-4 rounded-xl text-sm font-bold bg-slate-100 text-slate-400 cursor-not-allowed text-center select-none"
                    >
                      {plan.unavailableStatus}
                    </button>
                  ) : (
                    <button
                      id={`choose-plan-btn-${plan.id}`}
                      type="button"
                      onClick={() => handlePlanClick(plan)}
                      className={`w-full py-4 px-4 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all duration-300 cursor-pointer active:scale-[0.98] ${
                        isSelected
                          ? 'bg-[#0062EB] text-white shadow-xl hover:shadow-2xl'
                          : 'bg-white hover:bg-slate-50 text-[#0B0F17] border border-[#0B0F17] hover:shadow-lg'
                      }`}
                    >
                      {isSelected ? (
                        <>
                          <MessageCircle className="w-4 h-4" />
                          <span>Continue on WhatsApp</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      ) : (
                        <>
                          <span>{plan.ctaLabel}</span>
                          <ArrowRight className="w-4 h-4" />
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
        <div className="mt-16 sm:mt-20 pt-10 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between bg-slate-50 p-6 sm:p-8 rounded-2xl">
          <div className="mb-6 sm:mb-0 text-center sm:text-left max-w-lg">
            <h3 className="text-lg font-bold text-[#0B0F17] mb-1">
              Need a completely custom web solution?
            </h3>
            <p className="text-sm text-slate-500">
              For complex academies, multi-campus institutions, and deep e-learning integration, we provide bespoke builds.
            </p>
          </div>
          <button
            onClick={onOpenCustomQuote}
            className="shrink-0 px-6 py-3.5 rounded-xl font-bold text-sm text-[#0B0F17] bg-white border border-slate-300 hover:border-[#0B0F17] hover:shadow-md transition-all cursor-pointer flex items-center gap-2"
          >
            <span>Request Custom Build</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </section>
  );
};
