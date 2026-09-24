import React, { useState, useEffect } from 'react';
import { ElevateLogo } from './ElevateLogo';
import { MessageCircle, Menu, X, ArrowUpRight, ChevronRight, Phone } from 'lucide-react';
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
  { label: 'Monthly', href: '#creative', description: 'Monthly creative retainers (from ₹499/mo)' },
  { label: 'How It Works', href: '#how-it-works', description: 'Simple 4-step workflow' },
  { label: 'FAQ', href: '#faq', description: 'Common questions & answers' },
];

const MOBILE_NAV_ITEMS: NavItem[] = [
  { label: 'Services Overview', href: '#services', description: 'Core digital capabilities' },
  { label: 'Client Institutions', href: '#clients', description: 'Schools, colleges & academies' },
  { label: 'Websites & Portals', href: '#websites', description: 'Institutional plans from ₹999/yr' },
  { label: 'Admission Solutions', href: '#admission', description: 'Admission forms & ID cards' },
  { label: 'Exam Solutions', href: '#exam', description: 'Question papers & timetables' },
  { label: 'Monthly Creative', href: '#creative', description: 'Retainers from ₹499/mo' },
  { label: 'Bulk ID & Certificates', href: '#bulk', description: 'Volume ID cards & certificates' },
  { label: 'Custom Institutional Setup', href: '#madrasa-solutions', description: 'Comprehensive madrasa & school setup' },
  { label: 'How It Works', href: '#how-it-works', description: 'Transparent 4-step process' },
  { label: 'FAQ', href: '#faq', description: 'Common questions & answers' },
  { label: 'Direct WhatsApp Contact', href: '#contact', description: 'Direct WhatsApp line: +91 94971 22397' },
];

export const Header: React.FC<HeaderProps> = ({ onOpenQuote, activeSection = 'services' }) => {
  const { content, getWhatsAppUrl } = useContent();
  const whatsappUrl = getWhatsAppUrl(
    content.whatsappSettings?.templates?.generalEnquiry ||
      'Hello ELEVATE, I would like to enquire about your digital services.'
  );
  const displayPhone = content.contact.whatsappNumber || '+91 94971 22397';

  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
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
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 py-3 sm:py-3.5 ${
          isScrolled
            ? 'bg-[#090D16]/90 backdrop-blur-xl border-b border-white/10 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.5)]'
            : 'bg-[#090D16]/80 backdrop-blur-md border-b border-white/[0.08]'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Zone 1: Single element brand wordmark */}
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] rounded-lg p-0.5 transition-transform active:scale-95"
              aria-label="ELEVATE Home"
            >
              <ElevateLogo
                variant="white"
                size="md"
                showTagline={false}
              />
            </a>

            {/* Zone 2: Clean text navigation links with subtle active indicator */}
            <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
              {NAV_ITEMS.map((item) => {
                const sectionKey = item.href.replace('#', '');
                const isActive =
                  activeSection === sectionKey ||
                  (sectionKey === 'creative' && activeSection === 'monthly') ||
                  (sectionKey === 'packages' && (activeSection === 'admission' || activeSection === 'exam'));

                return (
                  <a
                    key={item.label}
                    href={item.href}
                    onClick={(e) => {
                      e.preventDefault();
                      handleNavClick(item.href);
                    }}
                    className={`relative px-3 py-1.5 text-xs xl:text-[13px] font-medium transition-colors duration-150 rounded-md whitespace-nowrap ${
                      isActive
                        ? 'text-white font-semibold'
                        : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
                    }`}
                  >
                    {item.label}
                    {isActive && (
                      <span className="absolute bottom-0 left-3 right-3 h-[2px] bg-[#3B82F6] rounded-full shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
                    )}
                  </a>
                );
              })}
            </nav>

            {/* Zone 3: Primary Actions */}
            <div className="hidden sm:flex items-center gap-2.5">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                id="header-whatsapp-cta"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-200 bg-white/[0.05] border border-white/10 rounded-xl hover:bg-white/[0.09] hover:text-white hover:border-white/20 transition-all duration-200 active:scale-98"
                title={`Direct WhatsApp Consultation: ${displayPhone}`}
              >
                <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                <span>Talk to ELEVATE</span>
              </a>

              <button
                id="header-quote-button"
                onClick={onOpenQuote}
                type="button"
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] hover:from-[#3B82F6] hover:to-[#2563EB] active:scale-98 rounded-xl shadow-[0_0_20px_-5px_rgba(37,99,235,0.5)] border border-blue-400/20 transition-all duration-200 cursor-pointer whitespace-nowrap"
              >
                <span>Get a Quote</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-blue-200" />
              </button>
            </div>

            {/* Mobile Actions: WhatsApp quick icon + Hamburger toggle */}
            <div className="flex lg:hidden items-center gap-2">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-emerald-400 bg-emerald-500/10 rounded-xl border border-emerald-500/20 active:scale-95 transition-transform"
                aria-label={`Contact via WhatsApp: ${displayPhone}`}
              >
                <MessageCircle className="w-4 h-4" />
              </a>

              <button
                id="mobile-menu-toggle"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                type="button"
                aria-expanded={mobileMenuOpen}
                aria-label={mobileMenuOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
                className="p-2 text-slate-200 bg-white/[0.06] rounded-xl border border-white/10 active:scale-95 transition-transform cursor-pointer"
              >
                {mobileMenuOpen ? <X className="w-5 h-5 text-white" /> : <Menu className="w-5 h-5 text-slate-200" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown Panel: High-end dark sheet directly anchored to header */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              key="mobile-nav-panel"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
              className="lg:hidden absolute top-full left-0 right-0 px-3 sm:px-6 pt-2 pb-4 pointer-events-auto max-w-lg mx-auto"
            >
              <div
                id="mobile-dropdown-container"
                className="bg-[#0D1322]/98 backdrop-blur-2xl border border-white/15 rounded-2xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] p-3 sm:p-4 overflow-hidden"
              >
                <nav
                  id="mobile-nav-list"
                  className="max-h-[min(420px,calc(100vh-160px))] overflow-y-auto overscroll-contain pr-1 space-y-1 divide-y divide-white/5"
                >
                  <div className="grid grid-cols-1 gap-1">
                    {MOBILE_NAV_ITEMS.map((item) => {
                      const sectionKey = item.href.replace('#', '');
                      const isActive =
                        activeSection === sectionKey ||
                        (sectionKey === 'creative' && activeSection === 'monthly') ||
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
                          className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs sm:text-sm transition-colors duration-150 group select-none ${
                            isActive
                              ? 'bg-blue-600/15 text-[#60A5FA] font-semibold border border-blue-500/30'
                              : 'text-slate-300 hover:text-white hover:bg-white/[0.05]'
                          }`}
                        >
                          <div className="min-w-0 pr-2">
                            <div className="font-medium truncate">{item.label}</div>
                            {item.description && (
                              <div className="text-[10px] text-slate-500 truncate mt-0.5">
                                {item.description}
                              </div>
                            )}
                          </div>
                          <ChevronRight
                            className={`w-4 h-4 shrink-0 transition-transform duration-150 ${
                              isActive
                                ? 'text-[#60A5FA] translate-x-0.5'
                                : 'text-slate-600 group-hover:text-slate-300 group-hover:translate-x-0.5'
                            }`}
                          />
                        </a>
                      );
                    })}
                  </div>
                </nav>

                {/* Mobile Drawer Quick Action Buttons */}
                <div className="pt-3 mt-2 border-t border-white/10 grid grid-cols-2 gap-2">
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 active:scale-98 transition-all"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </a>
                  <button
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onOpenQuote();
                    }}
                    className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-semibold text-white bg-[#2563EB] hover:bg-[#3B82F6] active:scale-98 transition-all"
                  >
                    <span>Get a Quote</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
};
