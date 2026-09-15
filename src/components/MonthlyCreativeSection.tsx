import React, { useState } from 'react';
import {
  Check,
  ArrowRight,
  MessageCircle,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
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
      className="py-20 sm:py-28 bg-[#F8FAFC] border-b border-slate-200 scroll-mt-20"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">
          
          {/* LEFT COLUMN: Editorial Intro & Included Types */}
          <div className="sticky top-32">
            <div className="mb-12">
              <div className="inline-flex items-center gap-2 mb-6">
                <span className="w-1.5 h-1.5 bg-[#0B0F17] rounded-full" />
                <span className="text-xs font-bold tracking-widest uppercase text-[#0B0F17]">
                  MONTHLY CREATIVE
                </span>
              </div>
              <h2 className="font-['Outfit'] font-extrabold text-4xl sm:text-5xl lg:text-6xl text-[#0B0F17] tracking-tight leading-tight mb-6">
                Consistent Digital Identity.
              </h2>
              <p className="text-lg text-slate-600 leading-relaxed max-w-md">
                Keep your social media active and professional with our fixed-price monthly design plans. Pick a quota and request any creative type as needed.
              </p>
            </div>

            {/* INCLUDED CREATIVE TYPES - Clean, elegant list */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-8 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 mb-6">
                <div>
                  <h3 className="font-['Outfit'] font-bold text-xl text-[#0B0F17]">
                    Included Creative Types
                  </h3>
                  <p className="text-sm text-slate-500 mt-1">
                    Mix and match any of these formats within your monthly quota
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsCreativeListExpanded(!isCreativeListExpanded)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-slate-50 hover:bg-slate-100 text-xs font-semibold text-slate-700 transition-colors cursor-pointer self-start sm:self-auto shrink-0 border border-slate-200"
                >
                  <span>{isCreativeListExpanded ? 'Show Less' : `View All (${creativeTypes.length})`}</span>
                  {isCreativeListExpanded ? (
                    <ChevronUp className="w-4 h-4 text-slate-500" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-500" />
                  )}
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6">
                {(isCreativeListExpanded
                  ? creativeTypes
                  : creativeTypes.slice(0, 6)
                ).map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-3"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-[#0062EB] shrink-0" />
                    <span className="text-sm font-medium text-slate-700">
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
              {!isCreativeListExpanded && creativeTypes.length > 6 && (
                <div className="mt-6 pt-4 border-t border-slate-100">
                  <span className="text-xs text-slate-500">
                    + {creativeTypes.length - 6} more formats available
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT COLUMN: Plans List */}
          <div className="pt-8 lg:pt-0">
            <h3 className="font-['Outfit'] font-bold text-xl text-[#0B0F17] mb-8 pb-4 border-b border-slate-200">
              Select Your Plan
            </h3>
            
            <div className="space-y-0 border-t border-slate-200">
              {plans.map((plan) => {
                const isSelected = selectedPlan?.id === plan.id;
                
                return (
                  <div
                    key={plan.id}
                    onClick={() => handleTogglePlan(plan.id)}
                    className={`group border-b border-slate-200 py-8 flex items-start gap-6 cursor-pointer transition-colors ${isSelected ? 'bg-white px-6 -mx-6 rounded-xl border-b-transparent my-2 shadow-sm' : 'hover:bg-slate-50 px-2'}`}
                  >
                    <div className="shrink-0 mt-1">
                      <div className={`w-5 h-5 flex items-center justify-center border rounded-full transition-all ${
                        isSelected ? 'bg-[#0062EB] border-[#0062EB]' : 'border-slate-300 group-hover:border-slate-400'
                      }`}>
                        {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-baseline gap-4 mb-2">
                        <div>
                          <h4 className={`font-bold text-xl sm:text-2xl transition-colors ${isSelected ? 'text-[#0B0F17]' : 'text-slate-800'}`}>
                            {plan.name}
                          </h4>
                          <span className="inline-block mt-2 px-3 py-1 bg-slate-100 text-slate-700 text-xs font-bold rounded-md">
                            {plan.creativesCountLabel}
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="font-['Outfit'] font-extrabold text-3xl text-[#0B0F17] block">
                            {plan.price}
                          </span>
                          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                            / month
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Floating Individual Checkout Banner */}
            {selectedPlan && (
              <div className="sticky bottom-8 mt-12 bg-[#0B0F17] text-white p-6 sm:p-8 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-6 rounded-xl">
                <div>
                  <p className="text-sm text-slate-400 mb-1">
                    Selected Plan
                  </p>
                  <p className="font-['Outfit'] font-extrabold text-2xl">
                    {selectedPlan.name}
                  </p>
                </div>
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={() => onSelectPlan(null)}
                    className="px-4 py-3.5 text-sm font-semibold text-slate-300 hover:text-white transition-colors"
                  >
                    Clear
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const p = plans.find(x => x.id === selectedPlan.id);
                      if (p) handleOpenWhatsAppForPlan(p);
                    }}
                    className="w-full sm:w-auto py-3.5 px-6 font-bold text-sm bg-white text-[#0B0F17] hover:bg-[#0062EB] hover:text-white transition-colors flex items-center justify-center gap-2 rounded-lg"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Send Enquiry</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

          </div>

        </div>
      </div>
    </section>
  );
};
