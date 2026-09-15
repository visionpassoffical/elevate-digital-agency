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
      className="py-20 sm:py-28 bg-[#F8FAFC] border-b border-slate-200 scroll-mt-20"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">
          
          {/* LEFT COLUMN: Editorial Intro & Package */}
          <div className="sticky top-32">
            <div className="mb-10">
              <div className="inline-flex items-center gap-2 mb-6">
                <span className="w-1.5 h-1.5 bg-[#0B0F17] rounded-full" />
                <span className="text-xs font-bold tracking-widest uppercase text-[#0B0F17]">
                  ADMISSION SOLUTIONS
                </span>
              </div>
              <h2 className="font-['Outfit'] font-extrabold text-4xl sm:text-5xl lg:text-6xl text-[#0B0F17] tracking-tight leading-tight mb-6">
                Make Admission Simple.
              </h2>
              <p className="text-lg text-slate-600 leading-relaxed max-w-md">
                Everything you need to present and manage your admission process digitally. Choose the complete solution or pick individual services.
              </p>
            </div>

            {/* Complete Package Editorial Card */}
            <div className={`mt-12 p-8 lg:p-10 transition-all duration-300 ${
              selectionMode === 'package' 
                ? 'bg-white border-l-4 border-[#0062EB] shadow-xl'
                : 'bg-white border-l-4 border-transparent border-slate-200/50 hover:shadow-lg'
            }`}>
              <div className="flex justify-between items-start mb-6">
                <h3 className="font-['Outfit'] font-extrabold text-2xl text-[#0B0F17]">
                  {admissionPackage.name}
                </h3>
                <span className="font-['Outfit'] font-extrabold text-2xl text-[#0B0F17]">
                  ₹{admissionPackage.price}
                </span>
              </div>
              <p className="text-slate-500 mb-8 leading-relaxed">
                {admissionPackage.description || 'Turnkey bundle covering visual outreach, digital application intake, and student credential templates.'}
              </p>
              
              <ul className="space-y-3 mb-10 border-t border-slate-100 pt-8">
                {admissionPackage.includes.map((feature, idx) => (
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
                return (
                  <div
                    key={service.id}
                    onClick={() => handleToggleService(service.id)}
                    className="group border-b border-slate-200 py-6 sm:py-8 flex items-start gap-5 cursor-pointer transition-colors hover:bg-white"
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
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Floating Individual Checkout Banner */}
            {selectionMode === 'individual' && selectedIndividualServices.length > 0 && (
              <div className="sticky bottom-8 mt-12 bg-[#0B0F17] text-white p-6 sm:p-8 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-6">
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
                  className="w-full sm:w-auto py-3.5 px-6 font-bold text-sm bg-white text-[#0B0F17] hover:bg-[#0062EB] hover:text-white transition-colors flex items-center justify-center gap-2"
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
