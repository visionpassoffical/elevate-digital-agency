import React, { useState } from 'react';
import { MessageCircle, ChevronUp, ChevronDown, ArrowRight, Sparkles } from 'lucide-react';
import type { SelectedServiceItem, SelectedMonthlyPlan, SelectedBulkQuote, SelectedWebsitePlan } from '../types';
import { openWhatsApp, formatCombinedOrderMessage } from '../utils/whatsapp';

interface SelectionDockBarProps {
  websitePlan?: SelectedWebsitePlan | null;
  admissionData: {
    mode: 'package' | 'individual' | 'none';
    packageName?: string;
    services: SelectedServiceItem[];
    total: number;
  };
  examData: {
    mode: 'package' | 'individual' | 'none';
    packageName?: string;
    services: SelectedServiceItem[];
    total: number;
  };
  monthlyPlan?: SelectedMonthlyPlan | null;
  bulkQuote?: SelectedBulkQuote | null;
  onSendWhatsApp: (context: string) => void;
  onClearWebsite?: () => void;
  onClearAdmission: () => void;
  onClearExam: () => void;
  onClearMonthly?: () => void;
  onClearBulk?: () => void;
  onClearAll?: () => void;
}

export const SelectionDockBar: React.FC<SelectionDockBarProps> = ({
  websitePlan,
  admissionData,
  examData,
  monthlyPlan,
  bulkQuote,
  onSendWhatsApp,
  onClearWebsite,
  onClearAdmission,
  onClearExam,
  onClearMonthly,
  onClearBulk,
  onClearAll,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const hasWebsite = !!websitePlan;
  const hasAdmission =
    admissionData.mode !== 'none' &&
    (admissionData.mode === 'package' || admissionData.services.length > 0);
  const hasExam =
    examData.mode !== 'none' &&
    (examData.mode === 'package' || examData.services.length > 0);
  const hasMonthly = !!monthlyPlan;
  const hasBulk = !!bulkQuote;

  if (!hasWebsite && !hasAdmission && !hasExam && !hasMonthly && !hasBulk) {
    return null;
  }

  const websitePrice = hasWebsite && websitePlan
    ? websitePlan.priceNumber || (websitePlan.id === 'basic' ? 999 : websitePlan.id === 'standard' ? 1999 : 0)
    : 0;

  const combinedTotal =
    websitePrice +
    (hasAdmission ? admissionData.total : 0) +
    (hasExam ? examData.total : 0) +
    (hasMonthly ? monthlyPlan.monthlyPriceNumber : 0) +
    (hasBulk ? bulkQuote.estimatedTotal : 0);

  const activeCategories: string[] = [];
  if (hasWebsite) activeCategories.push('Website');
  if (hasAdmission) activeCategories.push('Admission');
  if (hasExam) activeCategories.push('Exam');
  if (hasMonthly) activeCategories.push('Monthly');
  if (hasBulk) activeCategories.push('Bulk');

  const handleDispatch = () => {
    const formatted = formatCombinedOrderMessage({
      website:
        hasWebsite && websitePlan
          ? {
              name: websitePlan.name,
              price: websitePlan.price,
            }
          : undefined,
      admission: hasAdmission
        ? {
            mode: admissionData.mode as 'package' | 'individual',
            services: admissionData.services,
            total: admissionData.total,
          }
        : undefined,
      exam: hasExam
        ? {
            mode: examData.mode as 'package' | 'individual',
            services: examData.services,
            total: examData.total,
          }
        : undefined,
      monthly:
        hasMonthly && monthlyPlan
          ? {
              name: monthlyPlan.name,
              price: monthlyPlan.price,
              creatives: monthlyPlan.creativesCount,
            }
          : undefined,
      bulk:
        hasBulk && bulkQuote
          ? {
              title: bulkQuote.serviceTitle,
              quantity: bulkQuote.quantity,
              unitPrice: bulkQuote.unitPrice,
              total: bulkQuote.estimatedTotal,
            }
          : undefined,
      grandTotal: combinedTotal,
    });

    openWhatsApp(formatted);
  };

  return (
    <aside
      aria-label="Active service order bar"
      className="fixed bottom-2.5 left-2.5 right-2.5 sm:bottom-4 sm:left-auto sm:right-6 sm:w-auto sm:max-w-md z-40 animate-in fade-in slide-in-from-bottom-3 duration-200"
    >
      <div className="bg-white/98 text-[#0F172A] rounded-2xl shadow-xl border border-slate-200/90 p-3.5 sm:p-4 backdrop-blur-md">
        {/* Header row */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#2563EB] animate-pulse" />
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Active Selection ({activeCategories.join(' + ')})
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            {onClearAll && (
              <button
                type="button"
                onClick={onClearAll}
                className="text-xs text-slate-400 hover:text-red-500 px-2 py-0.5 rounded-md hover:bg-slate-100 transition-colors cursor-pointer font-medium"
                title="Clear all selections"
              >
                Clear all
              </button>
            )}
            <button
              type="button"
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-xs text-slate-500 hover:text-[#0F172A] flex items-center gap-1 px-2 py-0.5 rounded-md hover:bg-slate-100 transition-colors cursor-pointer"
              title="Toggle details"
            >
              <span>{isExpanded ? 'Hide' : 'Details'}</span>
              {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Expanded details tray */}
        {isExpanded && (
          <div className="mt-2.5 pt-2.5 border-t border-slate-100 space-y-2 max-h-60 overflow-y-auto pr-1">
            {hasWebsite && websitePlan && (
              <div className="text-xs bg-[#F8FAFC] rounded-xl p-2.5 border border-slate-200/80">
                <div className="flex items-center justify-between text-slate-500 font-bold mb-1">
                  <span className="text-[#2563EB] uppercase text-[10px] tracking-wider">Website Plan</span>
                  {onClearWebsite && (
                    <button
                      type="button"
                      onClick={onClearWebsite}
                      className="text-slate-400 hover:text-red-500 hover:underline cursor-pointer"
                    >
                      Remove
                    </button>
                  )}
                </div>
                <div className="flex items-center justify-between font-medium text-slate-700">
                  <span>{websitePlan.name}</span>
                  <span className="font-bold text-[#0F172A] shrink-0">{websitePlan.price}</span>
                </div>
              </div>
            )}

            {hasAdmission && (
              <div className="text-xs bg-[#F8FAFC] rounded-xl p-2.5 border border-slate-200/80">
                <div className="flex items-center justify-between text-slate-500 font-bold mb-1">
                  <span className="text-[#2563EB] uppercase text-[10px] tracking-wider">Admission Solutions</span>
                  <button
                    type="button"
                    onClick={onClearAdmission}
                    className="text-slate-400 hover:text-red-500 hover:underline cursor-pointer"
                  >
                    Remove
                  </button>
                </div>
                {admissionData.mode === 'package' ? (
                  <div className="flex items-center justify-between font-medium text-slate-700">
                    <span>Complete Admission Package</span>
                    <span className="font-bold text-[#0F172A]">₹449</span>
                  </div>
                ) : (
                  admissionData.services.map((item) => (
                    <div key={item.id} className="flex items-center justify-between py-0.5 text-slate-600">
                      <span className="truncate pr-2">{item.name}</span>
                      <span className="font-semibold text-[#0F172A] shrink-0">₹{item.price.toLocaleString('en-IN')}</span>
                    </div>
                  ))
                )}
              </div>
            )}

            {hasExam && (
              <div className="text-xs bg-[#F8FAFC] rounded-xl p-2.5 border border-slate-200/80">
                <div className="flex items-center justify-between text-slate-500 font-bold mb-1">
                  <span className="text-[#2563EB] uppercase text-[10px] tracking-wider">Exam Solutions</span>
                  <button
                    type="button"
                    onClick={onClearExam}
                    className="text-slate-400 hover:text-red-500 hover:underline cursor-pointer"
                  >
                    Remove
                  </button>
                </div>
                {examData.mode === 'package' ? (
                  <div className="flex items-center justify-between font-medium text-slate-700">
                    <span>Complete Exam Package</span>
                    <span className="font-bold text-[#0F172A]">₹499</span>
                  </div>
                ) : (
                  examData.services.map((item) => (
                    <div key={item.id} className="flex items-center justify-between py-0.5 text-slate-600">
                      <span className="truncate pr-2">{item.name}</span>
                      <span className="font-semibold text-[#0F172A] shrink-0">₹{item.price.toLocaleString('en-IN')}</span>
                    </div>
                  ))
                )}
              </div>
            )}

            {hasMonthly && monthlyPlan && (
              <div className="text-xs bg-[#F8FAFC] rounded-xl p-2.5 border border-slate-200/80">
                <div className="flex items-center justify-between text-slate-500 font-bold mb-1">
                  <span className="text-[#2563EB] uppercase text-[10px] tracking-wider">Monthly Creative</span>
                  {onClearMonthly && (
                    <button
                      type="button"
                      onClick={onClearMonthly}
                      className="text-slate-400 hover:text-red-500 hover:underline cursor-pointer"
                    >
                      Remove
                    </button>
                  )}
                </div>
                <div className="flex items-center justify-between font-medium text-slate-700">
                  <span>{monthlyPlan.name} ({monthlyPlan.creativesCountLabel})</span>
                  <span className="font-bold text-[#0F172A] shrink-0">{monthlyPlan.price}</span>
                </div>
              </div>
            )}

            {hasBulk && bulkQuote && (
              <div className="text-xs bg-[#F8FAFC] rounded-xl p-2.5 border border-slate-200/80">
                <div className="flex items-center justify-between text-slate-500 font-bold mb-1">
                  <span className="text-[#2563EB] uppercase text-[10px] tracking-wider">Bulk Solution</span>
                  {onClearBulk && (
                    <button
                      type="button"
                      onClick={onClearBulk}
                      className="text-slate-400 hover:text-red-500 hover:underline cursor-pointer"
                    >
                      Remove
                    </button>
                  )}
                </div>
                <div className="flex items-center justify-between font-medium text-slate-700">
                  <span>{bulkQuote.serviceTitle} (Qty {bulkQuote.quantity})</span>
                  <span className="font-bold text-[#0F172A] shrink-0">₹{bulkQuote.estimatedTotal.toLocaleString('en-IN')}</span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Total & Primary Action */}
        <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between gap-3">
          <div>
            <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
              Estimated Total
            </div>
            <div className="font-['Outfit'] font-extrabold text-xl sm:text-2xl text-[#0F172A]">
              ₹{combinedTotal.toLocaleString('en-IN')}
            </div>
          </div>

          <button
            id="dock-whatsapp-dispatch-btn"
            type="button"
            onClick={handleDispatch}
            className="py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold bg-[#2563EB] hover:bg-blue-700 active:scale-[0.98] text-white shadow-xs transition-all flex items-center gap-2 cursor-pointer shrink-0"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Continue on WhatsApp</span>
            <ArrowRight className="w-3.5 h-3.5 opacity-80" />
          </button>
        </div>
      </div>
    </aside>
  );
};
