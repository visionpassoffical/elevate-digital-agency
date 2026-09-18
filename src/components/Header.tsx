import React, { useState, useEffect } from 'react';
import { ElevateLogo } from './ElevateLogo';
import { MessageCircle, Menu, X, ArrowUpRight, ChevronRight } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useContent } from '../context/ContentContext';
import type { NavItem } from '../types';

interface HeaderProps {
  onOpenQuote: () => void;
  activeSection?: string;
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Services', href: '#services', description: 'Core digital capabilities' },
  { label: 'Clients', href: '#clients', description: 'Educational institutions we work with' },
  { label: 'Websites', href: '#websites', description: 'Institutional website plans (from ₹999/yr)' },
  { label: 'Admission', href: '#admission', description: 'Admission forms & ID cards' },
  { label: 'Exam', href: '#exam', description: 'Question papers & timetables' },
  { label: 'Monthly', href: '#monthly', description: 'Monthly creative retainers (from ₹499/mo)' },
  { label: 'How It Works', href: '#how-it-works', description: 'Simple 4-step workflow' },
  { label: 'FAQ', href: '#faq', description: 'Common questions & answers' },
];

const MOBILE_NAV_ITEMS: NavItem[] = [
  { label: 'Services', href: '#services', description: 'Core digital capabilities' },
  { label: 'Client Institutions', href: '#clients', description: 'Schools, colleges & academies' },
  { label: 'Websites', href: '#websites', description: 'Institutional website plans' },
  { label: 'Admission Solutions', href: '#admission', description: 'Admission forms & ID cards' },
  { label: 'Exam Solutions', href: '#exam', description: 'Question papers & timetables' },
  { label: 'Monthly Creative', href: '#monthly', description: 'Monthly creative retainers' },
  { label: 'Bulk Services', href: '#bulk', description: 'Volume ID cards & certificates' },
  { label: 'Have a Requirement?', href: '#enquiry', description: 'Direct WhatsApp requirement enquiry' },
  { label: 'How It Works', href: '#how-it-works', description: 'Simple 4-step process' },
  { label: 'FAQ', href: '#faq', description: 'Common questions & answers' },
  { label: 'Contact', href: '#contact', description: 'Direct WhatsApp line: +91 94971 22397' },
];

export const Header: React.FC<HeaderProps> = ({ onOpenQuote, activeSection = 'services' }) => {
  const { content, getWhatsAppUrl } = useContent();
  const whatsappUrl = getWhatsAppUrl(content.whatsappSettings?.templates?.generalEnquiry || 'Hello ELEVATE, I would like to enquire about your digital services.');
  const displayPhone = content.contact.whatsappNumber;

  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Prevent background scroll when mobile menu is open & listen to Escape key
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [mobileMenuOpen]);

  const handleNavClick = (href: string) => {
    setMobileMenuOpen(false);
    document.body.style.overflow = '';
    requestAnimationFrame(() => {
      const element = document.querySelector(href);
      if (element) {
        const headerOffset = 80;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth',
        });
      }
    });
  };

  return (
    <>
      <header
        id="main-header"
        className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-200 py-2.5 sm:py-3 ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-md shadow-[0_4px_20px_-4px_rgba(15,23,42,0.06)] border-b border-slate-200/80'
            : 'bg-[#F8FAFC]/95 backdrop-blur-sm border-b border-slate-200/60'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Brand Logo / Wordmark */}
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] rounded-lg p-0.5"
              aria-label="ELEVATE Home"
            >
              <ElevateLogo
                variant="default"
                size="md"
                showTagline={false}
              />
            </a>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1 lg:gap-1.5">
              {NAV_ITEMS.map((item) => {
                const sectionKey = item.href.replace('#', '');
                const isActive =
                  activeSection === sectionKey ||
                  (sectionKey === 'packages' && (activeSection === 'admission' || activeSection === 'exam'));

                return (
                  <a
                    key={item.label}
                    href={item.href}
                    onClick={(e) => {
                      e.preventDefault();
                      handleNavClick(item.href);
                    }}
                    className={`relative px-3 lg:px-3.5 py-1.5 text-xs lg:text-sm font-semibold rounded-lg transition-colors duration-150 ${
                      isActive
                        ? 'text-[#2563EB] bg-blue-50/80 font-bold'
                        : 'text-slate-600 hover:text-[#0F172A] hover:bg-slate-100/70'
                    }`}
                  >
                    {item.label}
                    {isActive && (
                      <span className="absolute bottom-1 left-3.5 right-3.5 h-0.5 bg-[#2563EB] rounded-full" />
                    )}
                  </a>
                );
              })}
            </nav>

            {/* Desktop CTAs: WhatsApp quick-link + Get a Quote button */}
            <div className="hidden md:flex items-center gap-2.5">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                id="header-whatsapp-cta"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:border-slate-300 hover:text-[#0F172A] hover:shadow-xs transition-all duration-200"
                title={`Direct WhatsApp Consultation: ${displayPhone}`}
              >
                <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                <span>WhatsApp</span>
              </a>

              <button
                id="header-quote-button"
                onClick={onOpenQuote}
                type="button"
                className="inline-flex items-center gap-2 px-4 py-2 text-xs lg:text-sm font-bold tracking-wide text-white bg-[#0F172A] hover:bg-[#2563EB] active:scale-[0.98] rounded-lg shadow-xs transition-all duration-200 cursor-pointer"
              >
                <span>Get a Quote</span>
                <ArrowUpRight className="w-4 h-4 opacity-80" />
              </button>
            </div>

            {/* Mobile Actions: WhatsApp quick icon + Hamburger button */}
            <div className="flex md:hidden items-center gap-2">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 text-emerald-600 bg-emerald-50 rounded-lg border border-emerald-200 active:scale-95 transition-transform"
                aria-label={`Contact via WhatsApp: ${displayPhone}`}
              >
                <MessageCircle className="w-5 h-5" />
              </a>

              <button
                id="mobile-menu-toggle"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                type="button"
                aria-expanded={mobileMenuOpen}
                aria-label={mobileMenuOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
                className="p-2.5 text-slate-800 bg-white rounded-lg border border-slate-200 active:scale-95 transition-transform cursor-pointer"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown Panel directly under the header */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              key="mobile-nav-panel"
              initial={{ opacity: 0, y: -6, scale: 0.99 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6, scale: 0.99 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
              className="md:hidden absolute top-full left-0 right-0 px-3 sm:px-6 pt-1.5 pb-3 pointer-events-auto"
            >
              <div
                id="mobile-dropdown-container"
                className="bg-white/98 backdrop-blur-xl border border-slate-200/90 rounded-2xl sm:rounded-3xl shadow-[0_20px_45px_-12px_rgba(11,15,23,0.14)] p-3 sm:p-4 overflow-hidden"
              >
                {/* Navigation Links in a compact, easy-to-scan layout */}
                <nav
                  id="mobile-nav-list"
                  className="max-h-[min(410px,calc(100vh-170px))] overflow-y-auto overscroll-contain pr-1 -mr-1"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-0.5 sm:gap-1">
                    {MOBILE_NAV_ITEMS.map((item) => {
                      const sectionKey = item.href.replace('#', '');
                      const isActive =
                        activeSection === sectionKey ||
                        (sectionKey === 'packages' &&
                          (activeSection === 'admission' || activeSection === 'exam'));

                      return (
                        <a
                          key={item.label}
                          href={item.href}
                          onClick={(e) => {
                            e.preventDefault();
                            handleNavClick(item.href);
                          }}
                          className={`flex items-center justify-between px-3 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-colors duration-150 group select-none ${
                            isActive
                              ? 'bg-blue-50/80 text-[#0062EB] font-bold'
                              : 'text-slate-700 hover:text-[#0062EB] hover:bg-slate-50'
                          }`}
                        >
                          <span className="truncate">{item.label}</span>
                          <ChevronRight
                            className={`w-3.5 h-3.5 shrink-0 transition-transform duration-150 ${
                              isActive
                                ? 'text-[#0062EB] translate-x-0.5'
                                : 'text-slate-300 group-hover:text-[#0062EB] group-hover:translate-x-0.5'
                            }`}
                          />
                        </a>
                      );
                    })}
                  </div>
                </nav>

                {/* Compact, accessible action bar (side-by-side) */}
                <div className="pt-2.5 mt-1.5 border-t border-slate-100 grid grid-cols-2 gap-2 shrink-0">
                  <a
                    id="mobile-nav-whatsapp"
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setMobileMenuOpen(false)}
                    className="py-2.5 px-3 rounded-xl text-xs font-bold text-slate-800 bg-slate-50 hover:bg-emerald-50 hover:text-emerald-700 border border-slate-200/90 hover:border-emerald-200 flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
                  >
                    <MessageCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>WhatsApp</span>
                  </a>

                  <button
                    id="mobile-quote-button"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onOpenQuote();
                    }}
                    type="button"
                    className="py-2.5 px-3 rounded-xl text-xs font-bold text-white bg-[#0F172A] hover:bg-[#2563EB] active:scale-[0.98] transition-all flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer"
                  >
                    <span>Get a Quote</span>
                    <ArrowUpRight className="w-3.5 h-3.5 opacity-80 shrink-0" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Subtle backdrop overlay outside the header */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            key="mobile-nav-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-40 bg-slate-950/20 backdrop-blur-[1.5px] md:hidden"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />
        )}
      </AnimatePresence>
    </>
  );
};
