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
      id="exams"
      className="py-20 sm:py-28 bg-white border-b border-slate-200 scroll-mt-20"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">
          
          {/* LEFT COLUMN: Editorial Intro & Package */}
          <div className="sticky top-32">
            <div className="mb-10">
              <div className="inline-flex items-center gap-2 mb-6">
                <span className="w-1.5 h-1.5 bg-[#0B0F17] rounded-full" />
                <span className="text-xs font-bold tracking-widest uppercase text-[#0B0F17]">
                  EXAM SOLUTIONS
                </span>
              </div>
              <h2 className="font-['Outfit'] font-extrabold text-4xl sm:text-5xl lg:text-6xl text-[#0B0F17] tracking-tight leading-tight mb-6">
                Streamline Assessments.
              </h2>
              <p className="text-lg text-slate-600 leading-relaxed max-w-md">
                Secure, professional-grade examination materials from question papers to secure hall tickets and answer keys.
              </p>
            </div>

            {/* Complete Package Editorial Card */}
            <div className={`mt-12 p-8 lg:p-10 transition-all duration-300 ${
              selectionMode === 'package' 
                ? 'bg-[#F8FAFC] border-l-4 border-[#0062EB] shadow-xl'
                : 'bg-white border-l-4 border-transparent border-slate-200/50 hover:shadow-lg'
            }`}>
              <div className="flex justify-between items-start mb-6">
                <h3 className="font-['Outfit'] font-extrabold text-2xl text-[#0B0F17]">
                  {examPackage.name}
                </h3>
                <span className="font-['Outfit'] font-extrabold text-2xl text-[#0B0F17]">
                  ₹{examPackage.price}
                </span>
              </div>
              <p className="text-slate-500 mb-8 leading-relaxed">
                {examPackage.description || 'Full end-to-end examination material preparation including hall tickets and secure question papers.'}
              </p>
              
              <ul className="space-y-3 mb-10 border-t border-slate-100 pt-8">
                {examPackage.includes.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-slate-700">
                    <Check className="w-4 h-4 mt-1 text-[#0062EB] shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                type="button"
                onClick={handleSelectPackage}
                className={`w-full py-4 px-6 rounded-xl font-bold flex items-center justify-center gap-3 transition-all duration-300 ${
                  selectionMode === 'package'
                    ? 'bg-[#0B0F17] text-white shadow-xl hover:bg-[#0062EB]'
                    : 'bg-slate-50 text-[#0B0F17] hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {selectionMode === 'package' ? (
                  <>
                    <MessageCircle className="w-4 h-4 opacity-80" />
                    <span>Continue with Package</span>
                    <ArrowRight className="w-4 h-4" />
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
          <div className="pt-8 lg:pt-0">
            <h3 className="font-['Outfit'] font-bold text-xl text-[#0B0F17] mb-8 pb-4 border-b border-slate-200">
              Individual Services
            </h3>
            
            <div className="space-y-0 border-t border-slate-200">
              {individualServicesList.map((service) => {
                const isChecked = selectedIndividualIds.includes(service.id);
                const qty = quantities[service.id] || 1;
                
                return (
                  <div
                    key={service.id}
                    onClick={() => handleToggleService(service.id)}
                    className={`group border-b border-slate-200 py-6 sm:py-8 flex items-start gap-5 cursor-pointer transition-colors ${isChecked ? 'bg-[#F8FAFC] px-4 -mx-4 rounded-xl border-b-transparent my-2' : 'hover:bg-slate-50'}`}
                  >
                    <div className="shrink-0 mt-1">
                      <div className={`w-5 h-5 flex items-center justify-center border transition-all ${
                        isChecked ? 'bg-[#0B0F17] border-[#0B0F17]' : 'border-slate-300 group-hover:border-slate-400'
                      }`}>
                        {isChecked && <Check className="w-3.5 h-3.5 text-white" />}
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-baseline gap-4 mb-2">
                        <h4 className={`font-bold text-lg sm:text-xl transition-colors ${isChecked ? 'text-[#0B0F17]' : 'text-slate-800'}`}>
                          {service.name}
                        </h4>
                        <span className="font-['Outfit'] font-extrabold text-lg text-[#0B0F17]">
                          ₹{service.price}
                        </span>
                      </div>
                      
                      {service.description && (
                        <p className="text-slate-500 leading-relaxed text-sm pr-8">
                          {service.description}
                        </p>
                      )}

                      {/* Interactive Quantity Stepper for Multi-Paper services */}
                      {service.allowsQuantity && isChecked && (
                        <div
                          onClick={(e) => e.stopPropagation()}
                          className="mt-4 inline-flex items-center gap-4 p-2 rounded-xl bg-white border border-slate-200 shadow-sm"
                        >
                          <span className="text-xs font-bold text-slate-600 pl-2">
                            Number of Papers:
                          </span>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={(e) => handleQuantityChange(service.id, -1, e)}
                              disabled={qty <= 1}
                              className="w-8 h-8 rounded-lg bg-slate-50 hover:bg-slate-100 disabled:opacity-40 flex items-center justify-center text-slate-700 cursor-pointer disabled:cursor-not-allowed transition-colors"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="w-8 text-center text-sm font-bold text-[#0B0F17]">
                              {qty}
                            </span>
                            <button
                              type="button"
                              onClick={(e) => handleQuantityChange(service.id, 1, e)}
                              className="w-8 h-8 rounded-lg bg-slate-50 hover:bg-slate-100 flex items-center justify-center text-slate-700 cursor-pointer transition-colors"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Specific Hall Ticket Note */}
                      {service.note && isChecked && (
                        <div className="mt-4 p-3 rounded-xl bg-blue-50/50 border border-blue-100 text-[11px] text-slate-600 flex items-start gap-2">
                          <Info className="w-4 h-4 text-[#0062EB] shrink-0 mt-0.5" />
                          <span className="leading-relaxed">{service.note}</span>
                        </div>
                      )}

                    </div>
                  </div>
                );
              })}
            </div>

            {/* Floating Individual Checkout Banner */}
            {selectionMode === 'individual' && selectedIndividualServices.length > 0 && (
              <div className="sticky bottom-8 mt-12 bg-[#0B0F17] text-white p-6 sm:p-8 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-6 rounded-xl">
                <div>
                  <p className="text-sm text-slate-400 mb-1">
                    {selectedIndividualServices.length} service{selectedIndividualServices.length > 1 ? 's' : ''} selected
                  </p>
                  <p className="font-['Outfit'] font-extrabold text-2xl">
                    Total: ₹{individualTotal}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleProceedWhatsApp}
                  className="w-full sm:w-auto py-3.5 px-6 font-bold text-sm bg-white text-[#0B0F17] hover:bg-[#0062EB] hover:text-white transition-colors flex items-center justify-center gap-2 rounded-lg"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Send Enquiry</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}

          </div>

        </div>
      </div>
    </section>
  );
};
