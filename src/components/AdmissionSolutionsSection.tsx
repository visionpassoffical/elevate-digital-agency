import React, { useState } from 'react';
import { Check, ArrowRight, MessageCircle, Sparkles, UserCheck, ShieldCheck, FileCheck, Layers } from 'lucide-react';
import type { SelectedServiceItem } from '../types';
import { useContent } from '../context/ContentContext';

interface AdmissionSolutionsSectionProps {
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

export const AdmissionSolutionsSection: React.FC<AdmissionSolutionsSectionProps> = ({
  currentMode,
  onSelectionChange,
}) => {
  const { content, openWhatsAppMessage, formatWhatsAppTemplate } = useContent();
  const admissionPackage = content.admissionServices.package;
  const individualServicesList = content.admissionServices.individual || [];

  // Selection mode: 'package' | 'individual' | 'none'
  const [selectionMode, setSelectionMode] = useState<'package' | 'individual' | 'none'>('none');
  const [selectedIndividualIds, setSelectedIndividualIds] = useState<string[]>([]);

  // Sync with external clear
  React.useEffect(() => {
    if (currentMode === 'none') {
      setSelectionMode('none');
      setSelectedIndividualIds([]);
    }
  }, [currentMode]);

  // Calculate individual total
  const selectedIndividualServices: SelectedServiceItem[] = individualServicesList
    .filter((item) => selectedIndividualIds.includes(item.id))
    .map((item) => ({
      id: item.id,
      name: item.name,
      price: item.price,
      category: 'admission',
      unitLabel: item.unit,
    }));

  const individualTotal = selectedIndividualServices.reduce((sum, item) => sum + item.price, 0);

  // Switch to package
  const handleSelectPackage = () => {
    if (selectionMode === 'package') {
      const msg = formatWhatsAppTemplate('admissionPackage', {
        packageName: admissionPackage.name,
        packagePrice: `₹${admissionPackage.price}`,
      });
      openWhatsAppMessage(msg);
      return;
    }

    setSelectionMode('package');
    setSelectedIndividualIds([]);

    if (onSelectionChange) {
      onSelectionChange({
        mode: 'package',
        packageName: admissionPackage.name,
        packagePrice: `₹${admissionPackage.price}`,
        services: [],
        total: admissionPackage.price,
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

    if (nextIds.length > 0) {
      setSelectionMode('individual');
    } else {
      setSelectionMode('none');
    }

    setSelectedIndividualIds(nextIds);

    if (onSelectionChange) {
      const updatedSelectedServices = individualServicesList
        .filter((item) => nextIds.includes(item.id))
        .map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          category: 'admission',
          unitLabel: item.unit,
        }));

      const newTotal = updatedSelectedServices.reduce((sum, item) => sum + item.price, 0);

      onSelectionChange({
        mode: nextIds.length > 0 ? 'individual' : 'none',
        services: updatedSelectedServices as SelectedServiceItem[],
        total: newTotal,
      });
    }
  };

  const handleProceedWhatsApp = () => {
    if (selectionMode === 'package') {
      const msg = formatWhatsAppTemplate('admissionPackage', {
        packageName: admissionPackage.name,
        packagePrice: `₹${admissionPackage.price}`,
      });
      openWhatsAppMessage(msg);
    } else if (selectionMode === 'individual' && selectedIndividualServices.length > 0) {
      const serviceList = selectedIndividualServices
        .map((s) => `• ${s.name} (₹${s.price})`)
        .join('\n');
      const msg = formatWhatsAppTemplate('admissionIndividual', {
        serviceList,
        total: `₹${individualTotal}`,
      });
      openWhatsAppMessage(msg);
    }
  };

  return (
    <section
      id="admission"
      className="py-20 sm:py-28 bg-[#F8FAFC] text-[#0F172A] border-b border-slate-200/80 scroll-mt-20 relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-14 sm:mb-16">
          <div className="inline-flex items-center gap-2 mb-3">
            <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full" />
            <span className="text-[11px] font-bold tracking-widest uppercase text-slate-500">
              ADMISSION PIPELINE & STUDENT ONBOARDING
            </span>
          </div>
          <h2 className="font-['Outfit'] font-extrabold text-3xl sm:text-4xl md:text-5xl text-[#0F172A] tracking-tight leading-tight">
            {admissionPackage.name || 'Admission Solutions'}
          </h2>
          <p className="mt-3 text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
            {admissionPackage.description ||
              'A streamlined digital enrollment suite that collects applications, verifies records, and delivers formatted printable forms without administrative delays.'}
          </p>
        </div>

        {/* Workflow-Focused Asymmetric Layout: Package Card (5 cols) + Individual Items (7 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* PACKAGE CARD: Complete Admission Bundle */}
          <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 border-2 border-emerald-500/30 shadow-lg shadow-emerald-500/5 relative flex flex-col justify-between">
            <div className="absolute -top-3.5 left-6 px-3.5 py-1 text-[10px] font-bold tracking-widest uppercase bg-emerald-600 text-white rounded-full shadow-sm">
              ALL-IN-ONE BUNDLE
            </div>

            <div>
              <div className="flex items-center justify-between gap-3 mb-4 pt-2">
                <span className="font-['Outfit'] font-extrabold text-2xl text-[#0F172A] tracking-tight">
                  Complete Admission Suite
                </span>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Save ₹247
                </span>
              </div>

              <div className="mb-4 flex items-baseline">
                <span className="font-['Outfit'] font-extrabold text-4xl sm:text-5xl text-[#0F172A] tracking-tight">
                  ₹{admissionPackage.price}
                </span>
                <span className="ml-2 text-xs font-semibold text-slate-500 line-through">
                  ₹696 separate
                </span>
              </div>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
                Everything required to conduct clean institutional admissions for the entire upcoming academic year.
              </p>

              {/* Package Deliverables */}
              <div className="space-y-3 mb-8">
                {(admissionPackage.includes || [
                  'Online Admission Registration Form Link',
                  'Printable Official Application Form Layout',
                  'Standard Student ID Card Template',
                  'Automated WhatsApp Notification Setup',
                ]).map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-slate-700">
                    <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3.5 h-3.5 text-emerald-700" />
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
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                    : 'bg-[#0F172A] hover:bg-emerald-600 text-white'
                }`}
              >
                {selectionMode === 'package' ? (
                  <>
                    <MessageCircle className="w-4 h-4" />
                    <span>Confirm Suite on WhatsApp (₹{admissionPackage.price})</span>
                  </>
                ) : (
                  <>
                    <span>Select Complete Package (₹{admissionPackage.price})</span>
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
                  Or Select Individual Services
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Pick only the specific components your institution needs right now
                </p>
              </div>

              {selectionMode === 'individual' && selectedIndividualServices.length > 0 && (
                <div className="flex items-center gap-2 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 self-start sm:self-auto">
                  <span className="text-xs font-semibold text-emerald-800">
                    {selectedIndividualServices.length} selected:
                  </span>
                  <span className="font-['Outfit'] font-extrabold text-sm text-emerald-700">
                    ₹{individualTotal}
                  </span>
                </div>
              )}
            </div>

            {/* Individual Services Cards */}
            <div className="space-y-3 mb-6">
              {individualServicesList.map((service) => {
                const isSelected = selectedIndividualIds.includes(service.id);

                return (
                  <div
                    key={service.id}
                    onClick={() => handleToggleService(service.id)}
                    className={`p-4 rounded-2xl border transition-all duration-200 cursor-pointer flex items-center justify-between gap-4 ${
                      isSelected
                        ? 'bg-emerald-50/70 border-emerald-500 ring-2 ring-emerald-500/10'
                        : 'bg-white border-slate-200/90 hover:border-slate-300 hover:bg-slate-50/60'
                    }`}
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div
                        className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 transition-colors ${
                          isSelected
                            ? 'bg-emerald-600 border-emerald-600 text-white'
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
                          {service.description || 'Standard institutional turnaround'}
                        </div>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="font-['Outfit'] font-extrabold text-base text-[#0F172A]">
                        ₹{service.price}
                      </div>
                      <div className="text-[10px] text-slate-400 font-medium">
                        {service.unit || 'per item'}
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
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-bold text-xs text-white bg-emerald-600 hover:bg-emerald-700 active:scale-98 transition-all shadow-xs cursor-pointer"
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
