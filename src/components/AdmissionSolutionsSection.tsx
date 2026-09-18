import React, { useState } from 'react';
import {
  Check,
  ArrowRight,
  MessageCircle,
} from 'lucide-react';
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
      className="py-16 sm:py-20 lg:py-24 bg-[#F8FAFC] border-b border-slate-200/80 scroll-mt-20"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-start">
          
          {/* LEFT COLUMN: Editorial Intro & Package */}
          <div className="lg:sticky lg:top-28">
            <div className="mb-8">
              <div className="inline-flex items-center gap-2 mb-3">
                <span className="w-1.5 h-1.5 bg-[#2563EB] rounded-full" />
                <span className="text-[11px] font-bold tracking-widest uppercase text-slate-500">
                  ADMISSION SOLUTIONS
                </span>
              </div>
              <h2 className="font-['Outfit'] font-extrabold text-3xl sm:text-4xl lg:text-5xl text-[#0F172A] tracking-tight leading-tight mb-3">
                Make Admission Simple.
              </h2>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-md">
                Everything you need to present and manage your admission process digitally. Choose the complete solution or pick individual services.
              </p>
            </div>

            {/* Complete Package Editorial Card */}
            <div className={`rounded-2xl p-6 sm:p-7 transition-all duration-200 border bg-white ${
              selectionMode === 'package' 
                ? 'border-[#2563EB] ring-2 ring-[#2563EB]/15 shadow-sm'
                : 'border-slate-200/90 hover:border-slate-300 shadow-xs'
            }`}>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <span className="text-[10px] font-bold tracking-wider uppercase bg-blue-50 text-[#2563EB] px-2.5 py-0.5 rounded-full inline-block mb-2">
                    Turnkey Package
                  </span>
                  <h3 className="font-['Outfit'] font-extrabold text-xl sm:text-2xl text-[#0F172A]">
                    {admissionPackage.name}
                  </h3>
                </div>
                <span className="font-['Outfit'] font-extrabold text-2xl sm:text-3xl text-[#0F172A]">
                  ₹{admissionPackage.price}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 mb-6 leading-relaxed">
                {admissionPackage.description || 'Turnkey bundle covering visual outreach, digital application intake, and student credential templates.'}
              </p>
              
              <ul className="space-y-2.5 mb-6 border-t border-slate-100 pt-5">
                {admissionPackage.includes.map((feature, idx) => (
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
                return (
                  <div
                    key={service.id}
                    onClick={() => handleToggleService(service.id)}
                    className={`group rounded-xl p-4 sm:p-5 flex items-start gap-3.5 cursor-pointer transition-all duration-150 border ${
                      isChecked
                        ? 'bg-white border-[#2563EB] ring-1 ring-[#2563EB]/20 shadow-xs'
                        : 'bg-white/80 hover:bg-white border-slate-200/80 hover:border-slate-300 shadow-2xs'
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
