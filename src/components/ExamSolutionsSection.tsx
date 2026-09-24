import React, { useState } from 'react';
import { Check, ArrowRight, MessageCircle, Plus, Minus, ShieldCheck, Sparkles, Award } from 'lucide-react';
import type { SelectedServiceItem } from '../types';
import { useContent } from '../context/ContentContext';

interface ExamSolutionsSectionProps {
  currentMode?: 'package' | 'individual' | 'none';
  onSelectionChange?: (data: {
    mode: 'package' | 'individual' | 'none';
    packageName?: string;
    packagePrice?: string;
    services: SelectedServiceItem[];
    total: number;
  }) => void;
  onRequestQuote: (contextDescription?: string) => void;
}

export const ExamSolutionsSection: React.FC<ExamSolutionsSectionProps> = ({
  currentMode,
  onSelectionChange,
}) => {
  const { content, openWhatsAppMessage, formatWhatsAppTemplate } = useContent();
  const examPackage = content.examServices.package;
  const individualServicesList = content.examServices.individual || [];

  // Selection mode: 'package' | 'individual' | 'none'
  const [selectionMode, setSelectionMode] = useState<'package' | 'individual' | 'none'>('none');
  const [selectedIndividualIds, setSelectedIndividualIds] = useState<string[]>([]);
  // Quantities for items that allow quantity (default 1)
  const [quantities, setQuantities] = useState<Record<string, number>>({
    'exam-question-paper': 1,
    'exam-answer-key': 1,
  });

  // Sync with external clear
  React.useEffect(() => {
    if (currentMode === 'none') {
      setSelectionMode('none');
      setSelectedIndividualIds([]);
    }
  }, [currentMode]);

  // Calculate items and total
  const selectedIndividualServices: SelectedServiceItem[] = individualServicesList.filter(
    (item) => selectedIndividualIds.includes(item.id)
  ).map((item) => {
    const qty = item.allowsQuantity ? quantities[item.id] || 1 : 1;
    return {
      id: item.id,
      name: item.allowsQuantity ? `${item.name} (${qty} ${qty === 1 ? 'paper' : 'papers'})` : item.name,
      price: item.price * qty,
      quantity: qty,
      category: 'exam',
      unitLabel: item.unit,
    };
  });

  const individualTotal = selectedIndividualServices.reduce((sum, item) => sum + item.price, 0);

  // Switch to package
  const handleSelectPackage = () => {
    if (selectionMode === 'package') {
      const msg = formatWhatsAppTemplate('examPackage', {
        packageName: examPackage.name,
        packagePrice: `₹${examPackage.price}`,
      });
      openWhatsAppMessage(msg);
      return;
    }

    setSelectionMode('package');
    setSelectedIndividualIds([]);

    if (onSelectionChange) {
      onSelectionChange({
        mode: 'package',
        packageName: examPackage.name,
        packagePrice: `₹${examPackage.price}`,
        services: [],
        total: examPackage.price,
      });
    }
  };

  // Toggle individual service
  const handleToggleService = (serviceId: string) => {
    let nextIds: string[];
    if (selectedIndividualIds.includes(serviceId)) {
      nextIds = selectedIndividualIds.filter((id) => id !== serviceId);
    } else {
      nextIds = [...selectedIndividualIds, serviceId];
    }

    setSelectedIndividualIds(nextIds);
    const nextMode = nextIds.length > 0 ? 'individual' : 'none';
    setSelectionMode(nextMode);

    if (onSelectionChange) {
      const nextServices = individualServicesList.filter((item) =>
        nextIds.includes(item.id)
      ).map((item) => {
        const qty = item.allowsQuantity ? quantities[item.id] || 1 : 1;
        return {
          id: item.id,
          name: item.allowsQuantity ? `${item.name} (${qty} ${qty === 1 ? 'paper' : 'papers'})` : item.name,
          price: item.price * qty,
          quantity: qty,
          category: 'exam' as const,
          unitLabel: item.unit,
        };
      });
      const total = nextServices.reduce((sum, s) => sum + s.price, 0);

      onSelectionChange({
        mode: nextMode,
        services: nextServices,
        total,
      });
    }
  };

  // Quantity change for papers
  const handleQuantityChange = (serviceId: string, delta: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const current = quantities[serviceId] || 1;
    const nextVal = Math.max(1, Math.min(20, current + delta));
    const nextQuantities = { ...quantities, [serviceId]: nextVal };
    setQuantities(nextQuantities);

    // If currently selected, recalculate
    if (selectedIndividualIds.includes(serviceId)) {
      const nextServices = individualServicesList.filter((item) =>
        selectedIndividualIds.includes(item.id)
      ).map((item) => {
        const qty = item.id === serviceId ? nextVal : (item.allowsQuantity ? quantities[item.id] || 1 : 1);
        return {
          id: item.id,
          name: item.allowsQuantity ? `${item.name} (${qty} ${qty === 1 ? 'paper' : 'papers'})` : item.name,
          price: item.price * qty,
          quantity: qty,
          category: 'exam' as const,
          unitLabel: item.unit,
        };
      });
      const total = nextServices.reduce((sum, s) => sum + s.price, 0);

      if (onSelectionChange) {
        onSelectionChange({
          mode: 'individual',
          services: nextServices,
          total,
        });
      }
    }
  };

  const handleProceedWhatsApp = () => {
    if (selectionMode === 'package') {
      const msg = formatWhatsAppTemplate('examPackage', {
        packageName: examPackage.name,
        packagePrice: `₹${examPackage.price}`,
      });
      openWhatsAppMessage(msg);
    } else if (selectionMode === 'individual' && selectedIndividualServices.length > 0) {
      const serviceList = selectedIndividualServices
        .map((s) => `• ${s.name} (₹${s.price})`)
        .join('\n');
      const msg = formatWhatsAppTemplate('examIndividual', {
        serviceList,
        total: `₹${individualTotal}`,
      });
      openWhatsAppMessage(msg);
    }
  };

  return (
    <section
      id="exam"
      className="py-20 sm:py-28 bg-[#FFFFFF] text-[#0F172A] border-b border-slate-200/80 scroll-mt-20 relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-14 sm:mb-16">
          <div className="inline-flex items-center gap-2 mb-3">
            <span className="w-1.5 h-1.5 bg-purple-600 rounded-full" />
            <span className="text-[11px] font-bold tracking-widest uppercase text-slate-500">
              ACADEMIC EXAM SUITE
            </span>
          </div>
          <h2 className="font-['Outfit'] font-extrabold text-3xl sm:text-4xl md:text-5xl text-[#0F172A] tracking-tight leading-tight">
            {examPackage.name || 'Exam Solutions'}
          </h2>
          <p className="mt-3 text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
            {examPackage.description ||
              'Standardized institutional question paper typesetting, answer keys, official timetables, and hall tickets delivered ready for print.'}
          </p>
        </div>

        {/* Asymmetric Layout: Package Card (5 cols) + Individual Items (7 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* PACKAGE CARD: Complete Exam Bundle */}
          <div className="lg:col-span-5 bg-[#F8FAFC] rounded-3xl p-6 sm:p-8 border-2 border-purple-500/30 shadow-lg shadow-purple-500/5 relative flex flex-col justify-between">
            <div className="absolute -top-3.5 left-6 px-3.5 py-1 text-[10px] font-bold tracking-widest uppercase bg-purple-600 text-white rounded-full shadow-sm">
              COMPLETE EXAM SUITE
            </div>

            <div>
              <div className="flex items-center justify-between gap-3 mb-4 pt-2">
                <span className="font-['Outfit'] font-extrabold text-2xl text-[#0F172A] tracking-tight">
                  Complete Exam Suite
                </span>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
                  Save ₹147
                </span>
              </div>

              <div className="mb-4 flex items-baseline">
                <span className="font-['Outfit'] font-extrabold text-4xl sm:text-5xl text-[#0F172A] tracking-tight">
                  ₹{examPackage.price}
                </span>
                <span className="ml-2 text-xs font-semibold text-slate-500 line-through">
                  ₹646 separate
                </span>
              </div>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
                All-in-one examination documentation ready for campus distribution and student evaluation.
              </p>

              {/* Package Deliverables */}
              <div className="space-y-3 mb-8">
                {(examPackage.deliverables || [
                  'Standardized Question Paper Typesetting',
                  'Comprehensive Answer Key Layout',
                  'Academic Examination Timetable',
                  'Printable Hall Ticket Template',
                ]).map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-slate-700">
                    <div className="w-5 h-5 rounded-full bg-purple-100 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3.5 h-3.5 text-purple-700" />
                    </div>
                    <span className="font-medium leading-snug">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <button
                type="button"
                onClick={handleSelectPackage}
                className={`w-full py-3.5 px-4 rounded-xl text-xs sm:text-sm font-bold active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs ${
                  selectionMode === 'package'
                    ? 'bg-purple-600 hover:bg-purple-700 text-white'
                    : 'bg-[#0F172A] hover:bg-purple-600 text-white'
                }`}
              >
                {selectionMode === 'package' ? (
                  <>
                    <MessageCircle className="w-4 h-4" />
                    <span>Confirm Suite on WhatsApp (₹{examPackage.price})</span>
                  </>
                ) : (
                  <>
                    <span>Select Complete Package (₹{examPackage.price})</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>

          {/* INDIVIDUAL SERVICES SELECTION (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-slate-100 mb-6">
              <div>
                <h3 className="font-['Outfit'] font-bold text-xl text-[#0F172A]">
                  Individual Exam Deliverables
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Select single question papers, answer keys, or timetables
                </p>
              </div>

              {selectionMode === 'individual' && selectedIndividualServices.length > 0 && (
                <div className="flex items-center gap-2 bg-purple-50 px-3 py-1.5 rounded-xl border border-purple-200 self-start sm:self-auto">
                  <span className="text-xs font-semibold text-purple-800">
                    {selectedIndividualServices.length} selected:
                  </span>
                  <span className="font-['Outfit'] font-extrabold text-sm text-purple-700">
                    ₹{individualTotal}
                  </span>
                </div>
              )}
            </div>

            {/* Individual Services Cards with Quantity Steppers */}
            <div className="space-y-3 mb-6">
              {individualServicesList.map((service) => {
                const isSelected = selectedIndividualIds.includes(service.id);
                const qty = service.allowsQuantity ? quantities[service.id] || 1 : 1;
                const effectivePrice = service.price * qty;

                return (
                  <div
                    key={service.id}
                    onClick={() => handleToggleService(service.id)}
                    className={`p-4 rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                      isSelected
                        ? 'bg-purple-50/70 border-purple-500 ring-2 ring-purple-500/10'
                        : 'bg-[#F8FAFC] border-slate-200/90 hover:border-slate-300 hover:bg-slate-100/60'
                    }`}
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div
                        className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 transition-colors ${
                          isSelected
                            ? 'bg-purple-600 border-purple-600 text-white'
                            : 'border-slate-300 bg-white'
                        }`}
                      >
                        {isSelected && <Check className="w-3.5 h-3.5" />}
                      </div>

                      <div className="min-w-0">
                        <div className="font-['Outfit'] font-bold text-sm text-[#0F172A] truncate">
                          {service.name}
                        </div>
                        <div className="text-xs text-slate-500 truncate mt-0.5">
                          {service.description || 'Institutional academic formatting'}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-4 self-stretch sm:self-auto pl-8 sm:pl-0">
                      {/* Quantity Stepper if allowed */}
                      {service.allowsQuantity && (
                        <div 
                          className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-xl p-1"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            type="button"
                            onClick={(e) => handleQuantityChange(service.id, -1, e)}
                            className="w-6 h-6 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors cursor-pointer text-xs"
                            title="Decrease quantity"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-7 text-center text-xs font-bold text-[#0F172A]">
                            {qty}
                          </span>
                          <button
                            type="button"
                            onClick={(e) => handleQuantityChange(service.id, 1, e)}
                            className="w-6 h-6 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors cursor-pointer text-xs"
                            title="Increase quantity"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      )}

                      <div className="text-right shrink-0">
                        <div className="font-['Outfit'] font-extrabold text-base text-[#0F172A]">
                          ₹{effectivePrice}
                        </div>
                        <div className="text-[10px] text-slate-400 font-medium">
                          {service.allowsQuantity ? `₹${service.price} / paper` : service.unit || 'per item'}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Individual Action Bar */}
            {selectionMode === 'individual' && selectedIndividualServices.length > 0 && (
              <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="text-xs text-slate-600">
                  <span className="font-bold text-[#0F172A]">{selectedIndividualServices.length} items</span> added to order
                </div>
                <button
                  type="button"
                  onClick={handleProceedWhatsApp}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-bold text-xs text-white bg-purple-600 hover:bg-purple-700 active:scale-98 transition-all shadow-xs cursor-pointer"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>Enquire Selected (₹{individualTotal})</span>
                </button>
              </div>
            )}
          </div>

        </div>

      </div>
    </section>
  );
};
