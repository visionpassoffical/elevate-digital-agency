import React, { useState, useEffect } from 'react';
import { Header, type ServiceTabKey } from './components/Header';
import { Hero } from './components/Hero';
import { QuickValueStrip } from './components/QuickValueStrip';
import { PortfolioSection } from './components/PortfolioSection';
import { TabbedServicesHub } from './components/TabbedServicesHub';
import { PartnerInstitutionsSection } from './components/PartnerInstitutionsSection';
import { AdminInstitutionsModal } from './components/AdminInstitutionsModal';
import { HowItWorks } from './components/HowItWorks';
import { FaqSection } from './components/FaqSection';
import { ContactSection } from './components/ContactSection';
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
      const sections = ['portfolio', 'services', 'clients', 'how-it-works', 'faq', 'contact'];
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
    <div className="min-h-screen bg-[#FFFFFF] text-[#0F172A] flex flex-col">
      {/* 1. CLEAN LIGHT HEADER */}
      <Header
        onOpenQuote={() => handleOpenQuote()}
        activeSection={activeSection}
        onSelectServiceTab={handleSelectServiceTab}
      />

      {/* Main Content Layout (Low-Scroll Clean Light Architecture) */}
      <main className="flex-1">
        {/* 2. COMPACT SINGLE-SCREEN HERO */}
        <Hero
          onOpenQuote={() => handleOpenQuote()}
          onSelectServiceTab={handleSelectServiceTab}
        />

        {/* 3. QUICK TRUST / VALUE STRIP */}
        <QuickValueStrip />

        {/* 4. BUILT WEBSITES / LIVE PORTFOLIO SHOWCASE (Horizontal Swipe on Mobile) */}
        <PortfolioSection
          onOpenAdminPortfolio={() => handleOpenAdmin('portfolio')}
          onRequestQuote={(context) => handleOpenQuote(context)}
        />

        {/* 5. UNIFIED TABBED SERVICES & PACKAGES HUB (Websites, Admission, Exams, Creatives, Bulk) */}
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

        {/* 6. PARTNER INSTITUTIONS MARQUEE */}
        <PartnerInstitutionsSection />

        {/* 7. MERGED HOW IT WORKS & WHY ELEVATE (4-Card Compact Grid) */}
        <HowItWorks />

        {/* 8. COMPACT FAQ ACCORDION */}
        <FaqSection />

        {/* 9. MERGED CUSTOM / MADRASA BUNDLES & DIRECT WHATSAPP CONSULTATION DESK */}
        <ContactSection onOpenQuote={(context) => handleOpenQuote(context)} />
      </main>

      {/* 10. DARK NAVY FOOTER */}
      <Footer
        onAdminClick={() => handleOpenAdmin('dashboard')}
        onOpenQuote={() => handleOpenQuote()}
        onSelectServiceTab={handleSelectServiceTab}
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

      {/* Mobile Sticky Quick Action Bar (only visible after scrolling past Hero when no items are selected) */}
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
