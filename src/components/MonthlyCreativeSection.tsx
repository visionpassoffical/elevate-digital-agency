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
      className="py-16 sm:py-20 lg:py-24 bg-[#F8FAFC] border-b border-slate-200/80 scroll-mt-20"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-start">
          
          {/* LEFT COLUMN: Editorial Intro & Included Types */}
          <div className="lg:sticky lg:top-28">
            <div className="mb-8">
              <div className="inline-flex items-center gap-2 mb-3">
                <span className="w-1.5 h-1.5 bg-[#2563EB] rounded-full" />
                <span className="text-[11px] font-bold tracking-widest uppercase text-slate-500">
                  MONTHLY CREATIVE RETAINERS
                </span>
              </div>
              <h2 className="font-['Outfit'] font-extrabold text-3xl sm:text-4xl lg:text-5xl text-[#0F172A] tracking-tight leading-tight mb-3">
                Consistent Digital Identity.
              </h2>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-md">
                Keep your social media active and professional with our fixed-price monthly design plans. Pick a quota and request any creative type as needed.
              </p>
            </div>

            {/* INCLUDED CREATIVE TYPES - Clean, elegant card */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-7 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 mb-5">
                <div>
                  <h3 className="font-['Outfit'] font-bold text-lg text-[#0F172A]">
                    Included Formats
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Mix and match any of these formats within your monthly quota
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsCreativeListExpanded(!isCreativeListExpanded)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-xs font-semibold text-slate-700 transition-colors cursor-pointer self-start sm:self-auto shrink-0 border border-slate-200"
                >
                  <span>{isCreativeListExpanded ? 'Show Less' : `View All (${creativeTypes.length})`}</span>
                  {isCreativeListExpanded ? (
                    <ChevronUp className="w-3.5 h-3.5 text-slate-500" />
                  ) : (
                    <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
                  )}
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-4">
                {(isCreativeListExpanded
                  ? creativeTypes
                  : creativeTypes.slice(0, 6)
                ).map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-2.5 text-xs font-medium text-slate-700"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-[#2563EB] shrink-0" />
                    <span>{item.label}</span>
                  </div>
                ))}
              </div>
              {!isCreativeListExpanded && creativeTypes.length > 6 && (
                <div className="mt-4 pt-3 border-t border-slate-100">
                  <span className="text-[11px] text-slate-500">
                    + {creativeTypes.length - 6} more formats available
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT COLUMN: Plans List */}
          <div>
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-200/80">
              <h3 className="font-['Outfit'] font-bold text-lg text-[#0F172A]">
                Select Your Plan
              </h3>
              <span className="text-xs text-slate-500">
                Monthly Retainers
              </span>
            </div>
            
            <div className="space-y-3">
              {plans.map((plan) => {
                const isSelected = selectedPlan?.id === plan.id;
                
                return (
                  <div
                    key={plan.id}
                    onClick={() => handleTogglePlan(plan.id)}
                    className={`group rounded-xl p-5 sm:p-6 flex items-start gap-4 cursor-pointer transition-all duration-150 border ${
                      isSelected
                        ? 'bg-white border-[#2563EB] ring-2 ring-[#2563EB]/15 shadow-xs'
                        : 'bg-white hover:bg-slate-50/70 border-slate-200/80 hover:border-slate-300 shadow-2xs'
                    }`}
                  >
                    <div className="shrink-0 mt-1">
                      <div className={`w-4 h-4 rounded-full flex items-center justify-center border transition-all ${
                        isSelected ? 'bg-[#2563EB] border-[#2563EB]' : 'border-slate-300 group-hover:border-slate-400 bg-white'
                      }`}>
                        {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-baseline gap-2 mb-1.5">
                        <div>
                          <h4 className={`font-bold text-base sm:text-lg transition-colors ${isSelected ? 'text-[#2563EB]' : 'text-[#0F172A]'}`}>
                            {plan.name}
                          </h4>
                          <span className="inline-block mt-1 px-2.5 py-0.5 bg-slate-100 text-slate-700 text-[11px] font-bold rounded-md">
                            {plan.creativesCountLabel}
                          </span>
                        </div>
                        <div className="text-right shrink-0">
                          <span className="font-['Outfit'] font-extrabold text-xl sm:text-2xl text-[#0F172A] block">
                            ₹{plan.price}
                          </span>
                          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                            / month
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Floating Selection Banner */}
            {selectedPlan && (
              <div className="mt-6 bg-[#0F172A] text-white p-5 rounded-2xl shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <p className="text-xs text-slate-400">
                    Selected Retainer
                  </p>
                  <p className="font-['Outfit'] font-extrabold text-xl text-white">
                    {selectedPlan.name} (₹{selectedPlan.price}/mo)
                  </p>
                </div>
                <div className="flex items-center gap-2.5 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={() => onSelectPlan(null)}
                    className="px-3 py-2 text-xs font-semibold text-slate-300 hover:text-white transition-colors cursor-pointer"
                  >
                    Clear
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const p = plans.find(x => x.id === selectedPlan.id);
                      if (p) handleOpenWhatsAppForPlan(p);
                    }}
                    className="w-full sm:w-auto py-2.5 px-5 font-bold text-xs bg-[#2563EB] text-white hover:bg-blue-600 transition-all flex items-center justify-center gap-2 rounded-xl cursor-pointer shadow-xs active:scale-[0.98]"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>Send Enquiry</span>
                    <ArrowRight className="w-3.5 h-3.5" />
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
