import React from 'react';
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
    hasActiveSelection: boolean;
  }> = [
    {
      id: 'websites',
      label: 'Websites',
      priceTag: `${webStartPrice}+`,
      hasActiveSelection: Boolean(selectedWebsitePlan),
    },
    {
      id: 'creative',
      label: 'Marketing & Creatives',
      priceTag: `${creativeStartPrice}+`,
      hasActiveSelection: Boolean(selectedMonthlyPlan),
    },
    {
      id: 'admission',
      label: 'Admission Funnels',
      priceTag: admissionPkgPrice,
      hasActiveSelection: currentAdmissionMode !== 'none',
    },
    {
      id: 'exam',
      label: 'Exam Systems',
      priceTag: examPkgPrice,
      hasActiveSelection: currentExamMode !== 'none',
    },
    {
      id: 'bulk',
      label: 'Bulk Print',
      priceTag: '₹10–₹30',
      hasActiveSelection: Boolean(selectedBulkQuote),
    },
  ];

  return (
    <section
      id="services"
      className="py-14 sm:py-22 bg-[#FFFFFF] text-[#09090B] border-b border-slate-200/80 scroll-mt-16 relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 relative z-10">
        {/* Confident Left-Aligned Editorial Header */}
        <div className="max-w-3xl mb-8 sm:mb-10">
          <div className="text-[11px] font-bold tracking-[0.14em] uppercase text-[#2563EB] mb-2">
            02 / STUDIO CAPABILITIES &amp; RATE CARD
          </div>
          <h2 className="font-['Outfit'] font-extrabold text-3xl sm:text-4xl lg:text-5xl text-[#09090B] tracking-[-0.03em] leading-[1.08]">
            Transparent Scopes. Built to Perform.
          </h2>
          <p className="mt-2.5 text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl">
            Explore our core capabilities below. Select any tier or deliverable to build your structured WhatsApp project brief.
          </p>
        </div>

        {/* Clean Horizontal Category Pills (.no-scrollbar) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 sm:mb-10 border-b border-slate-200/80 -mx-5 px-5 sm:mx-0 sm:px-0 no-scrollbar">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => onTabChange(tab.id)}
                className={`px-4 sm:px-5 py-2.5 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 border ${
                  isActive
                    ? 'bg-[#09090B] text-white border-[#09090B]'
                    : 'bg-[#F5F5F7] text-slate-600 border-transparent hover:border-slate-300 hover:text-[#09090B]'
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`text-[10px] font-mono tabular-nums ${
                    isActive ? 'text-blue-400' : 'text-slate-400'
                  }`}
                >
                  {tab.priceTag}
                </span>
                {tab.hasActiveSelection && (
                  <span className="text-[10px] font-bold text-emerald-400">
                    ✓
                  </span>
                )}
              </button>
            );
          })}
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
