import React from 'react';
import { Globe, FileText, Award, Palette, CreditCard } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { WebsitePlansSection } from './WebsitePlansSection';
import { AdmissionSolutionsSection } from './AdmissionSolutionsSection';
import { ExamSolutionsSection } from './ExamSolutionsSection';
import { MonthlyCreativeSection } from './MonthlyCreativeSection';
import { BulkServicesSection } from './BulkServicesSection';
import { useContent } from '../context/ContentContext';
import { ensureRupee } from '../utils/whatsapp';
import type { ServiceTabKey } from './Header';
import type {
  SelectedWebsitePlan,
  SelectedServiceItem,
  SelectedMonthlyPlan,
  SelectedBulkQuote,
} from '../types';

interface TabbedServicesHubProps {
  activeTab: ServiceTabKey;
  onTabChange: (tab: ServiceTabKey) => void;
  selectedWebsitePlan: SelectedWebsitePlan | null;
  onSelectWebsitePlan: (plan: SelectedWebsitePlan | null) => void;
  admissionMode?: 'package' | 'individual' | 'none';
  admissionSelection?: {
    mode: 'package' | 'individual' | 'none';
    packageName?: string;
    packagePrice?: string;
    services: SelectedServiceItem[];
    total: number;
  };
  onAdmissionSelectionChange: (data: {
    mode: 'package' | 'individual' | 'none';
    packageName?: string;
    packagePrice?: string;
    services: SelectedServiceItem[];
    total: number;
  }) => void;
  examMode?: 'package' | 'individual' | 'none';
  examSelection?: {
    mode: 'package' | 'individual' | 'none';
    packageName?: string;
    packagePrice?: string;
    services: SelectedServiceItem[];
    total: number;
  };
  onExamSelectionChange: (data: {
    mode: 'package' | 'individual' | 'none';
    packageName?: string;
    packagePrice?: string;
    services: SelectedServiceItem[];
    total: number;
  }) => void;
  selectedMonthlyPlan: SelectedMonthlyPlan | null;
  onSelectMonthlyPlan: (plan: SelectedMonthlyPlan | null) => void;
  selectedBulkQuote?: SelectedBulkQuote | null;
  onSelectBulkQuote: (quote: SelectedBulkQuote) => void;
  onOpenQuote: (context?: string) => void;
}

export const TabbedServicesHub: React.FC<TabbedServicesHubProps> = ({
  activeTab,
  onTabChange,
  selectedWebsitePlan,
  onSelectWebsitePlan,
  admissionMode,
  admissionSelection,
  onAdmissionSelectionChange,
  examMode,
  examSelection,
  onExamSelectionChange,
  selectedMonthlyPlan,
  onSelectMonthlyPlan,
  selectedBulkQuote,
  onSelectBulkQuote,
  onOpenQuote,
}) => {
  const { content } = useContent();

  const currentAdmissionMode = admissionMode ?? admissionSelection?.mode ?? 'none';
  const currentExamMode = examMode ?? examSelection?.mode ?? 'none';

  const webStartPrice = ensureRupee(content.websitePlans?.[0]?.price || '₹999');
  const admissionPkgPrice = ensureRupee(content.admissionServices?.package?.price || 449);
  const examPkgPrice = ensureRupee(content.examServices?.package?.price || 499);
  const creativeStartPrice = ensureRupee(content.monthlyCreativePlans?.plans?.[0]?.price || 499);

  const tabs: Array<{
    id: ServiceTabKey;
    label: string;
    priceTag: string;
    icon: React.ReactNode;
    hasActiveSelection: boolean;
  }> = [
    {
      id: 'websites',
      label: 'Websites',
      priceTag: `${webStartPrice}+`,
      icon: <Globe className="w-3.5 h-3.5" />,
      hasActiveSelection: Boolean(selectedWebsitePlan),
    },
    {
      id: 'admission',
      label: 'Admission',
      priceTag: admissionPkgPrice,
      icon: <FileText className="w-3.5 h-3.5" />,
      hasActiveSelection: currentAdmissionMode !== 'none',
    },
    {
      id: 'exam',
      label: 'Exams',
      priceTag: examPkgPrice,
      icon: <Award className="w-3.5 h-3.5" />,
      hasActiveSelection: currentExamMode !== 'none',
    },
    {
      id: 'creative',
      label: 'Creatives',
      priceTag: `${creativeStartPrice}+`,
      icon: <Palette className="w-3.5 h-3.5" />,
      hasActiveSelection: Boolean(selectedMonthlyPlan),
    },
    {
      id: 'bulk',
      label: 'Bulk',
      priceTag: '₹10–₹30',
      icon: <CreditCard className="w-3.5 h-3.5" />,
      hasActiveSelection: Boolean(selectedBulkQuote),
    },
  ];

  return (
    <section
      id="services"
      className="py-14 sm:py-20 bg-[#F4F6FB] text-[#0F172A] border-t border-slate-200/70 scroll-mt-16 relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Editorial Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-7 sm:mb-9">
          <div className="text-[11px] font-bold tracking-[0.14em] uppercase text-[#2563EB] mb-2">
            SERVICES &amp; TRANSPARENT PRICING
          </div>
          <h2 className="font-['Outfit'] font-extrabold text-2xl sm:text-3xl lg:text-4xl text-[#0F172A] tracking-tight leading-tight">
            Packages Built for Modern Institutions
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-slate-600">
            Select a category below to compare tiers or build a custom WhatsApp order.
          </p>
        </div>

        {/* High-Craft Segmented Tab Bar */}
        <div className="flex items-center justify-start sm:justify-center overflow-x-auto pb-2 mb-7 sm:mb-9 -mx-4 px-4 sm:mx-0 sm:px-0 no-scrollbar">
          <div className="inline-flex items-center gap-1 p-1.5 rounded-2xl bg-white shadow-[0_8px_24px_-8px_rgba(15,23,42,0.08)]">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => onTabChange(tab.id)}
                  className={`relative px-3.5 sm:px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
                    isActive
                      ? 'bg-[#0F172A] text-white shadow-sm'
                      : 'text-slate-600 hover:text-[#0F172A] hover:bg-[#F4F6FB]'
                  }`}
                >
                  <span className={isActive ? 'text-blue-400' : 'text-[#2563EB]'}>
                    {tab.icon}
                  </span>
                  <span>{tab.label}</span>
                  <span
                    className={`text-[10px] font-mono px-1.5 py-0.5 rounded-md tabular-nums ${
                      isActive
                        ? 'bg-white/15 text-blue-200'
                        : 'bg-[#F4F6FB] text-slate-600'
                    }`}
                  >
                    {tab.priceTag}
                  </span>
                  {tab.hasActiveSelection && (
                    <span className="text-[10px] font-bold text-emerald-500">
                      ✓
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Active Tab Panel */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18 }}
          >
            {activeTab === 'websites' && (
              <WebsitePlansSection
                embedded
                selectedPlan={selectedWebsitePlan}
                onSelectPlan={onSelectWebsitePlan}
                onOpenCustomQuote={() =>
                  onOpenQuote(
                    selectedWebsitePlan
                      ? `${selectedWebsitePlan.name} (${selectedWebsitePlan.price})`
                      : 'Custom Website Solution'
                  )
                }
              />
            )}

            {activeTab === 'admission' && (
              <AdmissionSolutionsSection
                embedded
                currentMode={currentAdmissionMode}
                onSelectionChange={onAdmissionSelectionChange}
                onRequestQuote={onOpenQuote}
              />
            )}

            {activeTab === 'exam' && (
              <ExamSolutionsSection
                embedded
                currentMode={currentExamMode}
                onSelectionChange={onExamSelectionChange}
                onRequestQuote={onOpenQuote}
              />
            )}

            {activeTab === 'creative' && (
              <MonthlyCreativeSection
                embedded
                selectedPlan={selectedMonthlyPlan}
                onSelectPlan={onSelectMonthlyPlan}
              />
            )}

            {activeTab === 'bulk' && (
              <BulkServicesSection
                embedded
                onSelectBulkQuote={onSelectBulkQuote}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};
