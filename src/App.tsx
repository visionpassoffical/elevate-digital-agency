import React, { useState, useEffect } from 'react';
import { Header, type ServiceTabKey } from './components/Header';
import { Hero } from './components/Hero';
import { PortfolioSection } from './components/PortfolioSection';
import { TabbedServicesHub } from './components/TabbedServicesHub';
import { PartnerInstitutionsSection } from './components/PartnerInstitutionsSection';
import { AdminInstitutionsModal } from './components/AdminInstitutionsModal';
import { HowItWorks } from './components/HowItWorks';
import { FaqSection } from './components/FaqSection';
import { Footer } from './components/Footer';
import { SelectionDockBar } from './components/SelectionDockBar';
import { QuoteModal } from './components/QuoteModal';
import { MobileStickyBar } from './components/MobileStickyBar';
import { WhatsAppToast } from './components/WhatsAppToast';
import { AdminPage } from './components/admin/AdminPage';
import type { AdminSectionKey } from './components/admin/AdminDashboard';
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

  const [adminInitialSection, setAdminInitialSection] = useState<AdminSectionKey>('dashboard');
  const [activeServiceTab, setActiveServiceTab] = useState<ServiceTabKey>('websites');
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

  const handleSelectServiceTab = (tab: ServiceTabKey) => {
    setActiveServiceTab(tab);
    setActiveSection(tab);
  };

  const handleOpenAdmin = (section: AdminSectionKey = 'dashboard') => {
    setAdminInitialSection(section);
    setIsAdminRoute(true);
    try {
      window.history.pushState(null, '', '#admin');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch {
      // ignore history errors inside restricted iframes
    }
  };

  const handleExitAdmin = () => {
    setIsAdminRoute(false);
    try {
      window.history.pushState(null, '', window.location.pathname);
    } catch {
      // ignore history errors
    }
  };

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
          try {
            if (next) {
              window.history.pushState(null, '', '#admin');
            } else {
              window.history.pushState(null, '', window.location.pathname);
            }
          } catch {
            // ignore
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
      const sections = ['portfolio', 'services', 'clients', 'process', 'faq', 'contact'];
      const scrollPos = window.scrollY + 200;

      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(sectionId === 'services' ? activeServiceTab : sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [activeServiceTab]);

  const handleClearAll = () => {
    setSelectedWebsitePlan(null);
    setAdmissionSelection({ mode: 'none', services: [], total: 0 });
    setExamSelection({ mode: 'none', services: [], total: 0 });
    setSelectedMonthlyPlan(null);
    setSelectedBulkQuote(null);
  };

  if (isAdminRoute) {
    return (
      <AdminPage
        initialSection={adminInitialSection}
        onExitToSite={handleExitAdmin}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#FFFFFF] text-[#09090B] flex flex-col">
      {/* 1. STUDIO HEADER */}
      <Header
        onOpenQuote={() => handleOpenQuote()}
        activeSection={activeSection}
        onSelectServiceTab={handleSelectServiceTab}
      />

      {/* Full-Bleed Alternating Architectural Surfaces (#FFFFFF / #F5F5F7 / #09090B) */}
      <main className="flex-1">
        {/* 2. EDITORIAL AGENCY HERO + HAIRLINE KPI STRIP (#FFFFFF) */}
        <Hero
          onOpenQuote={() => handleOpenQuote()}
          onSelectServiceTab={handleSelectServiceTab}
        />

        {/* 3. GALLERY-GRADE SELECTED WORK / PORTFOLIO CASE STUDIES (#F5F5F7) */}
        <PortfolioSection
          onOpenAdminPortfolio={() => handleOpenAdmin('portfolio')}
          onRequestQuote={(context) => handleOpenQuote(context)}
        />

        {/* 4. STUDIO CAPABILITIES & RATE CARD HUB (#FFFFFF) */}
        <TabbedServicesHub
          activeTab={activeServiceTab}
          onTabChange={handleSelectServiceTab}
          selectedWebsitePlan={selectedWebsitePlan}
          onSelectWebsitePlan={(plan) => setSelectedWebsitePlan(plan)}
          admissionMode={admissionSelection.mode}
          admissionSelection={admissionSelection}
          onAdmissionSelectionChange={(data) => setAdmissionSelection(data)}
          examMode={examSelection.mode}
          examSelection={examSelection}
          onExamSelectionChange={(data) => setExamSelection(data)}
          selectedMonthlyPlan={selectedMonthlyPlan}
          onSelectMonthlyPlan={(plan) => setSelectedMonthlyPlan(plan)}
          selectedBulkQuote={selectedBulkQuote}
          onSelectBulkQuote={(quote) => setSelectedBulkQuote(quote)}
          onOpenQuote={(context) => handleOpenQuote(context)}
        />

        {/* 5. CLIENT NETWORK MARQUEE (#F5F5F7) */}
        <PartnerInstitutionsSection />

        {/* 6. 3-STEP ARCHITECTURAL PROCESS (#FFFFFF) */}
        <HowItWorks />

        {/* 7. MINIMAL HAIRLINE FAQ ACCORDION (#F5F5F7) */}
        <FaqSection />
      </main>

      {/* 8. UNIFIED FULL-BLEED STUDIO FINALE (CTA + FOOTER IN #09090B) */}
      <Footer
        onAdminClick={() => handleOpenAdmin('dashboard')}
        onOpenQuote={(context) => handleOpenQuote(context)}
        onSelectServiceTab={handleSelectServiceTab}
      />

      {/* Persistent Floating Selection Dock Bar (Only visible when items are selected) */}
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

      {/* Sleek Floating WhatsApp Pill Button (When cart is empty) */}
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
