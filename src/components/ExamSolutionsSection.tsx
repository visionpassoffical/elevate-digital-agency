import React, { useState } from 'react';
import {
  Check,
  ArrowRight,
  MessageCircle,
  Plus,
  Minus,
  Info,
} from 'lucide-react';
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
        const qty = item.allowsQuantity ? nextQuantities[item.id] || 1 : 1;
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
      className="py-16 sm:py-20 lg:py-24 bg-white border-b border-slate-200/80 scroll-mt-20"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-start">
          
          {/* LEFT COLUMN: Editorial Intro & Package */}
          <div className="lg:sticky lg:top-28">
            <div className="mb-8">
              <div className="inline-flex items-center gap-2 mb-3">
                <span className="w-1.5 h-1.5 bg-[#2563EB] rounded-full" />
                <span className="text-[11px] font-bold tracking-widest uppercase text-slate-500">
                  EXAM SOLUTIONS
                </span>
              </div>
              <h2 className="font-['Outfit'] font-extrabold text-3xl sm:text-4xl lg:text-5xl text-[#0F172A] tracking-tight leading-tight mb-3">
                Streamline Assessments.
              </h2>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-md">
                Secure, professional-grade examination materials from question papers to secure hall tickets and answer keys.
              </p>
            </div>

            {/* Complete Package Editorial Card */}
            <div className={`rounded-2xl p-6 sm:p-7 transition-all duration-200 border bg-[#F8FAFC] ${
              selectionMode === 'package' 
                ? 'border-[#2563EB] ring-2 ring-[#2563EB]/15 bg-white shadow-sm'
                : 'border-slate-200/90 hover:border-slate-300 shadow-xs'
            }`}>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <span className="text-[10px] font-bold tracking-wider uppercase bg-blue-50 text-[#2563EB] px-2.5 py-0.5 rounded-full inline-block mb-2">
                    Turnkey Package
                  </span>
                  <h3 className="font-['Outfit'] font-extrabold text-xl sm:text-2xl text-[#0F172A]">
                    {examPackage.name}
                  </h3>
                </div>
                <span className="font-['Outfit'] font-extrabold text-2xl sm:text-3xl text-[#0F172A]">
                  ₹{examPackage.price}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 mb-6 leading-relaxed">
                {examPackage.description || 'Full end-to-end examination material preparation including hall tickets and secure question papers.'}
              </p>
              
              <ul className="space-y-2.5 mb-6 border-t border-slate-200/60 pt-5">
                {examPackage.includes.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs font-medium text-slate-700">
                    <Check className="w-3.5 h-3.5 text-[#2563EB] shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                type="button"
                onClick={handleSelectPackage}
                className={`w-full py-3 px-5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all duration-200 active:scale-[0.98] ${
                  selectionMode === 'package'
                    ? 'bg-[#2563EB] hover:bg-blue-700 text-white shadow-xs'
                    : 'bg-white hover:bg-slate-50 text-[#0F172A] border border-slate-200 hover:border-slate-300'
                }`}
              >
                {selectionMode === 'package' ? (
                  <>
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>Continue with Package</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                ) : (
                  <>
                    <span>Select Complete Package</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* RIGHT COLUMN: Individual Services */}
          <div>
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-200/80">
              <h3 className="font-['Outfit'] font-bold text-lg text-[#0F172A]">
                Individual Services
              </h3>
              <span className="text-xs text-slate-500">
                Pick what you need
              </span>
            </div>
            
            <div className="space-y-3">
              {individualServicesList.map((service) => {
                const isChecked = selectedIndividualIds.includes(service.id);
                const qty = quantities[service.id] || 1;
                
                return (
                  <div
                    key={service.id}
                    onClick={() => handleToggleService(service.id)}
                    className={`group rounded-xl p-4 sm:p-5 flex items-start gap-3.5 cursor-pointer transition-all duration-150 border ${
                      isChecked
                        ? 'bg-blue-50/20 border-[#2563EB] ring-1 ring-[#2563EB]/20 shadow-xs'
                        : 'bg-white hover:bg-slate-50/70 border-slate-200/80 hover:border-slate-300 shadow-2xs'
                    }`}
                  >
                    <div className="shrink-0 mt-0.5">
                      <div className={`w-4 h-4 rounded flex items-center justify-center border transition-all ${
                        isChecked ? 'bg-[#2563EB] border-[#2563EB]' : 'border-slate-300 group-hover:border-slate-400 bg-white'
                      }`}>
                        {isChecked && <Check className="w-3 h-3 text-white stroke-[3]" />}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-baseline gap-2 mb-1">
                        <h4 className={`font-bold text-sm sm:text-base transition-colors ${isChecked ? 'text-[#2563EB]' : 'text-[#0F172A]'}`}>
                          {service.name}
                        </h4>
                        <span className="font-['Outfit'] font-extrabold text-base text-[#0F172A] shrink-0">
                          ₹{service.price}
                        </span>
                      </div>
                      
                      {service.description && (
                        <p className="text-slate-500 leading-relaxed text-xs">
                          {service.description}
                        </p>
                      )}

                      {/* Interactive Quantity Stepper for Multi-Paper services */}
                      {service.allowsQuantity && isChecked && (
                        <div
                          onClick={(e) => e.stopPropagation()}
                          className="mt-3 inline-flex items-center gap-3 p-1.5 rounded-lg bg-white border border-slate-200 shadow-2xs"
                        >
                          <span className="text-[11px] font-semibold text-slate-600 pl-1.5">
                            Papers:
                          </span>
                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={(e) => handleQuantityChange(service.id, -1, e)}
                              disabled={qty <= 1}
                              className="w-6 h-6 rounded bg-slate-100 hover:bg-slate-200 disabled:opacity-40 flex items-center justify-center text-slate-700 cursor-pointer disabled:cursor-not-allowed transition-colors"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-6 text-center text-xs font-bold text-[#0F172A]">
                              {qty}
                            </span>
                            <button
                              type="button"
                              onClick={(e) => handleQuantityChange(service.id, 1, e)}
                              className="w-6 h-6 rounded bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-700 cursor-pointer transition-colors"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Specific Hall Ticket Note */}
                      {service.note && isChecked && (
                        <div className="mt-3 p-2.5 rounded-lg bg-blue-50/70 border border-blue-100 text-[11px] text-slate-600 flex items-start gap-2">
                          <Info className="w-3.5 h-3.5 text-[#2563EB] shrink-0 mt-0.5" />
                          <span className="leading-relaxed">{service.note}</span>
                        </div>
                      )}

                    </div>
                  </div>
                );
              })}
            </div>

            {/* Individual Checkout Card */}
            {selectionMode === 'individual' && selectedIndividualServices.length > 0 && (
              <div className="mt-6 bg-[#0F172A] text-white p-5 rounded-2xl shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <p className="text-xs text-slate-400">
                    {selectedIndividualServices.length} service{selectedIndividualServices.length > 1 ? 's' : ''} selected
                  </p>
                  <p className="font-['Outfit'] font-extrabold text-xl text-white">
                    Total: ₹{individualTotal}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleProceedWhatsApp}
                  className="w-full sm:w-auto py-2.5 px-5 rounded-xl font-bold text-xs bg-[#2563EB] text-white hover:bg-blue-600 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs active:scale-[0.98]"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>Send Enquiry</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

          </div>

        </div>
      </div>
    </section>
  );
};
