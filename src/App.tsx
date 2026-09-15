import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { QuickValueStrip } from './components/QuickValueStrip';
import { ServicesGrid } from './components/ServicesGrid';
import { PartnerInstitutionsSection } from './components/PartnerInstitutionsSection';
import { AdminInstitutionsModal } from './components/AdminInstitutionsModal';
import { WebsitePlansSection } from './components/WebsitePlansSection';
import { AdmissionSolutionsSection } from './components/AdmissionSolutionsSection';
import { ExamSolutionsSection } from './components/ExamSolutionsSection';
import { MonthlyCreativeSection } from './components/MonthlyCreativeSection';
import { BulkServicesSection } from './components/BulkServicesSection';
import { CustomServicesSection } from './components/CustomServicesSection';
import { HowItWorks } from './components/HowItWorks';
import { WhyElevate } from './components/WhyElevate';
import { FaqSection } from './components/FaqSection';
import { CompleteMadrasaCta } from './components/CompleteMadrasaCta';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { SelectionDockBar } from './components/SelectionDockBar';
import { QuoteModal } from './components/QuoteModal';
import { MobileStickyBar } from './components/MobileStickyBar';
import { WhatsAppToast } from './components/WhatsAppToast';
import { AdminPage } from './components/admin/AdminPage';
import type { SelectedWebsitePlan, SelectedServiceItem, SelectedMonthlyPlan, SelectedBulkQuote } from './types';

export default function App() {
  const [isAdminRoute, setIsAdminRoute] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const p = window.location.pathname;
      const q = window.location.search;
      const h = window.location.hash;
      return p === '/admin' || p.startsWith('/admin/') || q.includes('admin=true') || h === '#admin';
    }
    return false;
  });

  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<string | undefined>();
  const [selectedSector, setSelectedSector] = useState<string | undefined>();
  const [selectedWebsitePlan, setSelectedWebsitePlan] = useState<SelectedWebsitePlan | null>(null);
  const [selectedMonthlyPlan, setSelectedMonthlyPlan] = useState<SelectedMonthlyPlan | null>(null);
  const [selectedBulkQuote, setSelectedBulkQuote] = useState<SelectedBulkQuote | null>(null);
  
  // Admission & Exam solutions state (stores data structure for WhatsApp dispatch)
  const [admissionSelection, setAdmissionSelection] = useState<{
    mode: 'package' | 'individual' | 'none';
    packageName?: string;
    packagePrice?: string;
    services: SelectedServiceItem[];
    total: number;
  }>({
    mode: 'none',
    services: [],
    total: 0,
  });

  const [examSelection, setExamSelection] = useState<{
    mode: 'package' | 'individual' | 'none';
    packageName?: string;
    packagePrice?: string;
    services: SelectedServiceItem[];
    total: number;
  }>({
    mode: 'none',
    services: [],
    total: 0,
  });

  const [activeSection, setActiveSection] = useState<string>('services');

  const handleOpenQuote = (serviceOrSector?: string) => {
    if (serviceOrSector) {
      if (
        serviceOrSector.includes('Madrasa') ||
        serviceOrSector.includes('School') ||
        serviceOrSector.includes('Business') ||
        serviceOrSector.includes('Organization')
      ) {
        setSelectedSector(serviceOrSector);
        setSelectedService(undefined);
      } else {
        setSelectedService(serviceOrSector);
        setSelectedSector(undefined);
      }
    } else if (admissionSelection.mode === 'package') {
      setSelectedService(`${admissionSelection.packageName} (${admissionSelection.packagePrice})`);
      setSelectedSector(undefined);
    } else if (admissionSelection.mode === 'individual' && admissionSelection.services.length > 0) {
      const names = admissionSelection.services.map((s) => s.name).join(', ');
      setSelectedService(`Admission Services: ${names}`);
      setSelectedSector(undefined);
    } else if (examSelection.mode === 'package') {
      setSelectedService(`${examSelection.packageName} (${examSelection.packagePrice})`);
      setSelectedSector(undefined);
    } else if (examSelection.mode === 'individual' && examSelection.services.length > 0) {
      const names = examSelection.services.map((s) => s.name).join(', ');
      setSelectedService(`Exam Services: ${names}`);
      setSelectedSector(undefined);
    } else if (selectedMonthlyPlan) {
      setSelectedService(`${selectedMonthlyPlan.name} (${selectedMonthlyPlan.price} - ${selectedMonthlyPlan.creativesCountLabel})`);
      setSelectedSector(undefined);
    } else if (selectedBulkQuote) {
      setSelectedService(`${selectedBulkQuote.serviceTitle}: Qty ${selectedBulkQuote.quantity} = ₹${selectedBulkQuote.estimatedTotal}`);
      setSelectedSector(undefined);
    } else if (selectedWebsitePlan) {
      setSelectedService(`${selectedWebsitePlan.name} (${selectedWebsitePlan.price})`);
      setSelectedSector(undefined);
    } else {
      setSelectedService(undefined);
      setSelectedSector(undefined);
    }
    setIsQuoteModalOpen(true);
  };

  const handleCloseQuote = () => {
    setIsQuoteModalOpen(false);
  };

  // Admin panel access via URL (/admin, ?admin=true, or #admin) or shortcut (Ctrl/Cmd+Shift+A)
  useEffect(() => {
    const checkAdminAccess = () => {
      const p = window.location.pathname;
      const q = window.location.search;
      const h = window.location.hash;
      const isAdmin = p === '/admin' || p.startsWith('/admin/') || q.includes('admin=true') || h === '#admin';
      setIsAdminRoute(isAdmin);
    };

    checkAdminAccess();
    window.addEventListener('hashchange', checkAdminAccess);
    window.addEventListener('popstate', checkAdminAccess);

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        setIsAdminRoute((prev) => {
          const next = !prev;
          if (next) {
            window.history.pushState(null, '', '/admin');
          } else {
            window.history.pushState(null, '', '/');
          }
          return next;
        });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('hashchange', checkAdminAccess);
      window.removeEventListener('popstate', checkAdminAccess);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Track active section for header indicator
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['services', 'websites', 'admission', 'exam', 'monthly', 'bulk', 'custom-services', 'how-it-works', 'faq', 'contact'];
      const scrollPos = window.scrollY + 200;

      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleClearAll = () => {
    setSelectedWebsitePlan(null);
    setAdmissionSelection({ mode: 'none', services: [], total: 0 });
    setExamSelection({ mode: 'none', services: [], total: 0 });
    setSelectedMonthlyPlan(null);
    setSelectedBulkQuote(null);
  };

  if (isAdminRoute) {
    return <AdminPage />;
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0C1017] flex flex-col">
      {/* 1. HEADER */}
      <Header
        onOpenQuote={() => handleOpenQuote()}
        activeSection={activeSection}
      />

      {/* Main Content Layout in EXACT 16-Section Order */}
      <main className="flex-1">
        {/* 2. HERO */}
        <Hero onOpenQuote={() => handleOpenQuote()} />

        {/* 3. TRUST / VALUE STRIP */}
        <QuickValueStrip />

        {/* 4. SERVICES */}
        <ServicesGrid onSelectService={(serviceTitle) => handleOpenQuote(serviceTitle)} />

        {/* 4b. CLIENT INSTITUTIONS */}
        <PartnerInstitutionsSection />

        {/* 5. WEBSITE PLANS */}
        <WebsitePlansSection
          selectedPlan={selectedWebsitePlan}
          onSelectPlan={(plan) => setSelectedWebsitePlan(plan)}
          onOpenCustomQuote={() => handleOpenQuote(selectedWebsitePlan ? `${selectedWebsitePlan.name} (${selectedWebsitePlan.price})` : 'Custom Website Solution')}
        />

        {/* 6. ADMISSION SOLUTIONS */}
        <AdmissionSolutionsSection
          currentMode={admissionSelection.mode}
          onSelectionChange={(data) => setAdmissionSelection(data)}
          onRequestQuote={(context) => handleOpenQuote(context)}
        />

        {/* 7. EXAM SOLUTIONS */}
        <ExamSolutionsSection
          currentMode={examSelection.mode}
          onSelectionChange={(data) => setExamSelection(data)}
          onRequestQuote={(context) => handleOpenQuote(context)}
        />

        {/* 8. MONTHLY CREATIVE PLANS */}
        <MonthlyCreativeSection
          selectedPlan={selectedMonthlyPlan}
          onSelectPlan={(plan) => setSelectedMonthlyPlan(plan)}
        />

        {/* 9. BULK SERVICES */}
        <BulkServicesSection
          onSelectBulkQuote={(quote) => setSelectedBulkQuote(quote)}
        />

        {/* 10. CUSTOM SERVICES */}
        <CustomServicesSection
          onRequestQuote={(context) => handleOpenQuote(context)}
        />

        {/* 11. HOW IT WORKS */}
        <HowItWorks />

        {/* 12. WHY ELEVATE */}
        <WhyElevate />

        {/* 13. FAQ */}
        <FaqSection />

        {/* 14. COMPLETE MADRASA / CUSTOM WORK CTA */}
        <CompleteMadrasaCta
          onOpenQuote={(context) => handleOpenQuote(context)}
        />

        {/* 15. FINAL WHATSAPP CTA */}
        <ContactSection onOpenQuote={() => handleOpenQuote()} />
      </main>

      {/* 16. FOOTER */}
      <Footer
        onOpenQuote={() => handleOpenQuote()}
      />

      {/* Persistent Floating Selection Dock Bar (Desktop & Mobile) */}
      <SelectionDockBar
        websitePlan={selectedWebsitePlan}
        admissionData={admissionSelection}
        examData={examSelection}
        monthlyPlan={selectedMonthlyPlan}
        bulkQuote={selectedBulkQuote}
        onSendWhatsApp={(context) => handleOpenQuote(context)}
        onClearWebsite={() => setSelectedWebsitePlan(null)}
        onClearAdmission={() => setAdmissionSelection({ mode: 'none', services: [], total: 0 })}
        onClearExam={() => setExamSelection({ mode: 'none', services: [], total: 0 })}
        onClearMonthly={() => setSelectedMonthlyPlan(null)}
        onClearBulk={() => setSelectedBulkQuote(null)}
        onClearAll={handleClearAll}
      />

      {/* Mobile Sticky Quick Action Bar (shown when no items are selected in dock) */}
      <MobileStickyBar
        hasActiveSelection={
          Boolean(selectedWebsitePlan) ||
          admissionSelection.mode !== 'none' ||
          examSelection.mode !== 'none' ||
          Boolean(selectedMonthlyPlan) ||
          Boolean(selectedBulkQuote)
        }
        isQuoteModalOpen={isQuoteModalOpen}
        onOpenQuote={() => handleOpenQuote()}
      />

      {/* WhatsApp Toast / Error Fallback */}
      <WhatsAppToast />

      {/* Interactive Project Inquiry & WhatsApp Bridge Modal */}
      <QuoteModal
        isOpen={isQuoteModalOpen}
        onClose={handleCloseQuote}
        preselectedService={selectedService}
        preselectedSector={selectedSector}
      />

      {/* Admin Panel: Client Institutions Manager */}
      <AdminInstitutionsModal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
      />
    </div>
  );
}
