import React, { useState } from 'react';
import { Check, ArrowRight, MessageCircle } from 'lucide-react';
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
  embedded?: boolean;
}

export const AdmissionSolutionsSection: React.FC<AdmissionSolutionsSectionProps> = ({
  currentMode,
  onSelectionChange,
  embedded = false,
}) => {
  const { content, openWhatsAppMessage, formatWhatsAppTemplate } = useContent();
  const admissionPackage = content.admissionServices.package;
  const individualServicesList = content.admissionServices.individual || [];

  const [selectionMode, setSelectionMode] = useState<'package' | 'individual' | 'none'>('none');
  const [selectedIndividualIds, setSelectedIndividualIds] = useState<string[]>([]);

  React.useEffect(() => {
    if (currentMode === 'none') {
      setSelectionMode('none');
      setSelectedIndividualIds([]);
    }
  }, [currentMode]);

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
  const separateSum =
    individualServicesList.reduce((sum, item) => sum + Number(item.price || 0), 0) || 497;
  const packageSavings = Math.max(0, separateSum - Number(admissionPackage.price || 449));

  const handleSelectPackage = () => {
    if (selectionMode === 'package') {
      const msg = formatWhatsAppTemplate('admissionPackage', {
        packageName: admissionPackage.name,
        package_name: admissionPackage.name,
        packagePrice: `₹${admissionPackage.price}`,
        price: `₹${admissionPackage.price}`,
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
        package_name: admissionPackage.name,
        packagePrice: `₹${admissionPackage.price}`,
        price: `₹${admissionPackage.price}`,
      });
      openWhatsAppMessage(msg);
    } else if (selectionMode === 'individual' && selectedIndividualServices.length > 0) {
      const serviceList = selectedIndividualServices
        .map((s) => `• ${s.name} (₹${s.price})`)
        .join('\n');
      const msg = formatWhatsAppTemplate('admissionIndividual', {
        serviceList,
        selected_services: serviceList,
        total: `₹${individualTotal}`,
      });
      openWhatsAppMessage(msg);
    }
  };

  const innerContent = (
    <div id="admission" className="scroll-mt-24 pt-2">
      {!embedded && (
        <div className="max-w-3xl mb-10">
          <h2 className="font-['Outfit'] font-extrabold text-2xl sm:text-3xl text-[#0F172A] tracking-tight">
            {admissionPackage.name || 'Admission Solutions'}
          </h2>
          <p className="mt-2 text-sm text-slate-600">{admissionPackage.description}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-start">
        {/* FLAGSHIP DARK NAVY BUNDLE CARD */}
        <div className="lg:col-span-5 bg-[#0F172A] text-white rounded-2xl p-6 sm:p-7 shadow-[0_20px_45px_-15px_rgba(15,23,42,0.45)] relative flex flex-col justify-between">
          <div className="absolute -top-3 left-6 px-3 py-1 text-[10px] font-bold tracking-[0.12em] uppercase bg-[#2563EB] text-white rounded-full shadow-[0_4px_12px_rgba(37,99,235,0.45)]">
            ALL-IN-ONE BUNDLE
          </div>

          <div>
            <div className="flex items-center justify-between gap-2 mb-3 pt-1 flex-wrap">
              <span className="font-['Outfit'] font-extrabold text-xl text-white tracking-tight">
                Complete Admission Suite
              </span>
              {packageSavings > 0 && (
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 tabular-nums">
                  Save ₹{packageSavings}
                </span>
              )}
            </div>

            <div className="mb-3 flex items-baseline">
              <span className="font-['Outfit'] font-extrabold text-3xl sm:text-4xl text-white tracking-tight tabular-nums">
                ₹{admissionPackage.price}
              </span>
              <span className="ml-2 text-xs font-medium text-slate-400 line-through tabular-nums">
                ₹{separateSum} separate
              </span>
            </div>

            <p className="text-xs sm:text-[13px] text-slate-300 leading-relaxed mb-5">
              Everything required to launch and manage student admissions for the upcoming academic year.
            </p>

            <div className="space-y-3 mb-6 pt-4 border-t border-white/10">
              {(
                admissionPackage.includes || [
                  'Admission Poster / Announcement',
                  'Online Admission Form',
                  'ID Card Design / Template',
                ]
              ).map((item, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-[13px] text-slate-200">
                  <Check className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                  <span className="font-medium leading-snug">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={handleSelectPackage}
            className={`w-full py-3.5 px-4 rounded-xl text-xs font-bold active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer ${
              selectionMode === 'package'
                ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm'
                : 'bg-[#2563EB] hover:bg-blue-500 text-white shadow-[0_8px_25px_-4px_rgba(37,99,235,0.6)]'
            }`}
          >
            {selectionMode === 'package' ? (
              <>
                <MessageCircle className="w-3.5 h-3.5" />
                <span>Confirm Suite on WhatsApp (₹{admissionPackage.price})</span>
              </>
            ) : (
              <>
                <span>Select Complete Package (₹{admissionPackage.price})</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </div>

        {/* INDIVIDUAL SERVICES SELECTION (CLEAN LIGHT SURFACE, ZERO TRUNCATION) */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-5 sm:p-6 shadow-[0_10px_30px_-10px_rgba(15,23,42,0.08)]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100 mb-4">
            <div>
              <h3 className="font-['Outfit'] font-bold text-base sm:text-lg text-[#0F172A]">
                Or Pick Individual Admission Items
              </h3>
              <p className="text-xs text-slate-500">
                Select only the specific deliverables you need right now
              </p>
            </div>

            {selectionMode === 'individual' && selectedIndividualServices.length > 0 && (
              <div className="flex items-center gap-1.5 bg-blue-50 px-3 py-1 rounded-lg self-start sm:self-auto">
                <span className="text-[11px] font-semibold text-[#2563EB]">
                  {selectedIndividualServices.length} selected:
                </span>
                <span className="font-['Outfit'] font-extrabold text-xs text-[#0F172A] tabular-nums">
                  ₹{individualTotal}
                </span>
              </div>
            )}
          </div>

          <div className="space-y-2.5">
            {individualServicesList.map((service) => {
              const isSelected = selectedIndividualIds.includes(service.id);

              return (
                <div
                  key={service.id}
                  onClick={() => handleToggleService(service.id)}
                  className={`p-3.5 sm:p-4 rounded-xl transition-all duration-150 cursor-pointer flex items-start sm:items-center justify-between gap-3 ${
                    isSelected
                      ? 'bg-blue-50/70 ring-2 ring-[#2563EB]'
                      : 'bg-[#F4F6FB] hover:bg-slate-100/90'
                  }`}
                >
                  <div className="flex items-start gap-3 min-w-0 flex-1">
                    <div
                      className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                        isSelected
                          ? 'bg-[#2563EB] border-[#2563EB] text-white'
                          : 'border-slate-300 bg-white'
                      }`}
                    >
                      {isSelected && <Check className="w-3 h-3" />}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="font-['Outfit'] font-bold text-xs sm:text-sm text-[#0F172A] leading-snug">
                        {service.name}
                      </div>
                      <div className="text-[11px] sm:text-xs text-slate-500 leading-relaxed mt-0.5">
                        {service.description || 'Standard institutional turnaround'}
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="font-['Outfit'] font-extrabold text-sm sm:text-base text-[#0F172A] tabular-nums">
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

          {selectionMode === 'individual' && selectedIndividualServices.length > 0 && (
            <div className="pt-4 mt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="text-xs text-slate-600">
                <span className="font-bold text-[#0F172A]">{selectedIndividualServices.length} items</span> added to order
              </div>
              <button
                type="button"
                onClick={handleProceedWhatsApp}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl font-bold text-xs text-white bg-[#2563EB] hover:bg-[#1D4ED8] active:scale-98 transition-all cursor-pointer"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>Enquire Selected (₹{individualTotal})</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  if (embedded) {
    return innerContent;
  }

  return (
    <section className="py-12 sm:py-16 bg-[#F4F6FB] text-[#0F172A] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {innerContent}
      </div>
    </section>
  );
};
