import React, { useState } from 'react';
import { Check, ArrowUpRight, MessageCircle } from 'lucide-react';
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
    <div id="admission" className="scroll-mt-24">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
        {/* FLAGSHIP DEEP CARBON (#09090B) BUNDLE CARD */}
        <div className="lg:col-span-5 bg-[#09090B] text-white rounded-2xl p-6 sm:p-8 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-2 mb-3">
              <span className="text-[10px] font-bold tracking-[0.14em] uppercase text-[#2563EB]">
                ALL-IN-ONE CAMPAIGN KIT
              </span>
              {packageSavings > 0 && (
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 tabular-nums">
                  Save ₹{packageSavings}
                </span>
              )}
            </div>

            <h3 className="font-['Outfit'] font-extrabold text-2xl text-white tracking-[-0.02em] mb-3">
              Complete Admission Suite
            </h3>

            <div className="mb-4 flex items-baseline">
              <span className="font-['Outfit'] font-extrabold text-3xl sm:text-4xl text-white tracking-[-0.03em] tabular-nums">
                ₹{admissionPackage.price}
              </span>
              <span className="ml-2 text-xs font-medium text-slate-400 line-through tabular-nums">
                ₹{separateSum} separate
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-6 pb-6 border-b border-white/10">
              Everything required to launch and manage student admissions for the upcoming academic session.
            </p>

            <div className="space-y-3 mb-8">
              {(
                admissionPackage.includes || [
                  'Admission Poster / Announcement',
                  'Online Admission Form',
                  'ID Card Design / Template',
                ]
              ).map((item, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-200">
                  <Check className="w-4 h-4 text-[#2563EB] shrink-0 mt-0.5" />
                  <span className="font-medium leading-snug">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={handleSelectPackage}
            className={`w-full py-3.5 px-5 rounded-full text-xs font-bold active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer ${
              selectionMode === 'package'
                ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                : 'bg-[#2563EB] hover:bg-blue-500 text-white'
            }`}
          >
            {selectionMode === 'package' ? (
              <>
                <MessageCircle className="w-3.5 h-3.5" />
                <span>Confirm Suite on WhatsApp (₹{admissionPackage.price})</span>
              </>
            ) : (
              <>
                <span>Select Complete Suite (₹{admissionPackage.price})</span>
                <ArrowUpRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>

        {/* INDIVIDUAL DELIVERABLES (ARCHITECTURAL HAIRLINE LIST) */}
        <div className="lg:col-span-7">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-200/80 mb-3">
            <div>
              <h3 className="font-['Outfit'] font-extrabold text-lg sm:text-xl text-[#09090B]">
                Individual Admission Deliverables
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Or select standalone items to build a custom scope
              </p>
            </div>

            {selectionMode === 'individual' && selectedIndividualServices.length > 0 && (
              <div className="text-xs font-bold text-[#2563EB] tabular-nums">
                {selectedIndividualServices.length} selected · ₹{individualTotal}
              </div>
            )}
          </div>

          <div className="divide-y divide-slate-200/80 border-b border-slate-200/80">
            {individualServicesList.map((service) => {
              const isSelected = selectedIndividualIds.includes(service.id);

              return (
                <div
                  key={service.id}
                  onClick={() => handleToggleService(service.id)}
                  className={`py-4 px-3 -mx-3 rounded-xl transition-colors cursor-pointer flex items-start sm:items-center justify-between gap-4 ${
                    isSelected ? 'bg-blue-50/60' : 'hover:bg-[#F5F5F7]'
                  }`}
                >
                  <div className="flex items-start gap-3.5 min-w-0 flex-1">
                    <div
                      className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                        isSelected
                          ? 'bg-[#09090B] border-[#09090B] text-white'
                          : 'border-slate-300 bg-white'
                      }`}
                    >
                      {isSelected && <Check className="w-3 h-3" />}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="font-['Outfit'] font-bold text-sm sm:text-base text-[#09090B] leading-snug">
                        {service.name}
                      </div>
                      <div className="text-xs text-slate-500 leading-relaxed mt-0.5">
                        {service.description || 'Turnkey institutional design & setup'}
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="font-['Outfit'] font-extrabold text-base text-[#09090B] tabular-nums">
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
            <div className="pt-5 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="text-xs text-slate-600">
                <span className="font-bold text-[#09090B]">{selectedIndividualServices.length} items</span> selected
              </div>
              <button
                type="button"
                onClick={handleProceedWhatsApp}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full font-bold text-xs text-white bg-[#09090B] hover:bg-[#2563EB] transition-colors cursor-pointer"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>Send Scope on WhatsApp (₹{individualTotal})</span>
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
    <section className="py-14 sm:py-20 bg-[#FFFFFF] text-[#09090B] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 relative z-10">
        {innerContent}
      </div>
    </section>
  );
};
