import React, { useState, useEffect } from 'react';
import { ElevateLogo } from './ElevateLogo';
import { MessageCircle, Menu, X, ArrowUpRight, ChevronRight } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useContent } from '../context/ContentContext';
import type { NavItem } from '../types';

export type ServiceTabKey = 'websites' | 'admission' | 'exam' | 'creative' | 'bulk';

interface HeaderProps {
  onOpenQuote: () => void;
  activeSection?: string;
  onSelectServiceTab?: (tab: ServiceTabKey) => void;
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Our Work', href: '#portfolio', description: 'Live websites & portals built by ELEVATE' },
  { label: 'Websites', href: '#websites', description: 'Institutional website plans (from ₹999/yr)' },
  { label: 'Admission', href: '#admission', description: 'Admission forms & ID cards (₹449)' },
  { label: 'Exams', href: '#exam', description: 'Question papers & timetables (₹499)' },
  { label: 'Creatives', href: '#creative', description: 'Monthly creative retainers (from ₹499/mo)' },
  { label: 'Bulk ID & Certs', href: '#bulk', description: 'Volume ID cards & certificates' },
  { label: 'Clients', href: '#clients', description: 'Educational institutions we work with' },
  { label: 'FAQ', href: '#faq', description: 'Common questions & answers' },
];

const MOBILE_NAV_ITEMS: NavItem[] = [
  { label: 'Our Work (Built Websites)', href: '#portfolio', description: 'Live websites & portals built by ELEVATE' },
  { label: 'Websites & Portals (₹999+)', href: '#websites', description: 'Institutional plans from ₹999/yr' },
  { label: 'Admission Suite (₹449)', href: '#admission', description: 'Poster, online form & ID card template' },
  { label: 'Exam Solutions (₹499)', href: '#exam', description: 'Question papers, keys & timetables' },
  { label: 'Monthly Creatives (₹499+)', href: '#creative', description: '5 to 15 custom creatives per month' },
  { label: 'Bulk ID & Certificates', href: '#bulk', description: 'Volume ID cards (from ₹20) & certificates' },
  { label: 'Client Institutions', href: '#clients', description: 'Schools, colleges & academies' },
  { label: 'How It Works & Why Us', href: '#how-it-works', description: 'Transparent 4-step workflow' },
  { label: 'FAQ', href: '#faq', description: 'Common questions & answers' },
  { label: 'Custom & Madrasa Setup', href: '#contact', description: 'Direct WhatsApp line: +91 94971 22397' },
];

const SERVICE_TAB_HASHES: Record<string, ServiceTabKey> = {
  '#websites': 'websites',
  '#admission': 'admission',
  '#exam': 'exam',
  '#creative': 'creative',
  '#monthly': 'creative',
  '#bulk': 'bulk',
};

export const Header: React.FC<HeaderProps> = ({
  onOpenQuote,
  activeSection = 'services',
  onSelectServiceTab,
}) => {
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
      setIsScrolled(window.scrollY > 16);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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

    const mappedTab = SERVICE_TAB_HASHES[href];
    if (mappedTab && onSelectServiceTab) {
      onSelectServiceTab(mappedTab);
    }

    requestAnimationFrame(() => {
      const targetSelector = mappedTab ? '#services' : href;
      const element = document.querySelector(targetSelector) || document.querySelector(href);
      if (element) {
        const headerOffset = 72;
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
    <header
      id="main-header"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 py-2.5 sm:py-3 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-xl border-b border-slate-200/90 shadow-xs'
          : 'bg-white/90 backdrop-blur-md border-b border-slate-200/60'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Brand Wordmark */}
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
              variant="default"
              size="sm"
              showTagline={false}
            />
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {NAV_ITEMS.map((item) => {
              const sectionKey = item.href.replace('#', '');
              const isActive =
                activeSection === sectionKey ||
                (SERVICE_TAB_HASHES[item.href] && activeSection === 'services');

              return (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick(item.href);
                  }}
                  className={`relative px-2.5 py-1.5 text-xs font-semibold transition-colors duration-150 rounded-lg whitespace-nowrap ${
                    activeSection === sectionKey
                      ? 'text-[#2563EB] bg-blue-50/80'
                      : 'text-slate-600 hover:text-[#0F172A] hover:bg-slate-100/70'
                  }`}
                >
                  {item.label}
                </a>
              );
            })}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden sm:flex items-center gap-2">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              id="header-whatsapp-cta"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 border border-slate-200/80 hover:border-emerald-200 rounded-xl transition-all duration-150 active:scale-98 whitespace-nowrap"
              title={`Direct WhatsApp Consultation: ${displayPhone}`}
            >
              <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
              <span>WhatsApp</span>
            </a>

            <button
              id="header-quote-button"
              onClick={onOpenQuote}
              type="button"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-white bg-[#2563EB] hover:bg-blue-700 active:scale-98 rounded-xl shadow-2xs transition-all duration-150 cursor-pointer whitespace-nowrap"
            >
              <span>Get a Quote</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-blue-100" />
            </button>
          </div>

          {/* Mobile Actions: WhatsApp quick icon + Hamburger toggle */}
          <div className="flex lg:hidden items-center gap-2">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-emerald-700 bg-emerald-50 rounded-xl border border-emerald-200/80 active:scale-95 transition-transform"
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
              className="p-2 text-slate-700 bg-slate-100 hover:bg-slate-200/70 rounded-xl border border-slate-200 active:scale-95 transition-transform cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-[#0F172A]" /> : <Menu className="w-5 h-5 text-[#0F172A]" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Sheet (Clean Light Theme) */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            key="mobile-nav-panel"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.16, ease: 'easeOut' }}
            className="lg:hidden absolute top-full left-0 right-0 px-3 sm:px-6 pt-2 pb-4 pointer-events-auto max-w-lg mx-auto"
          >
            <div
              id="mobile-dropdown-container"
              className="bg-white border border-slate-200 rounded-2xl shadow-xl p-3 overflow-hidden"
            >
              <nav
                id="mobile-nav-list"
                className="max-h-[min(380px,calc(100vh-150px))] overflow-y-auto overscroll-contain pr-1 space-y-0.5"
              >
                {MOBILE_NAV_ITEMS.map((item) => {
                  const sectionKey = item.href.replace('#', '');
                  const isActive = activeSection === sectionKey;

                  return (
                    <a
                      key={item.label}
                      href={item.href}
                      onClick={(e) => {
                        e.preventDefault();
                        handleNavClick(item.href);
                      }}
                      className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-colors duration-150 group select-none ${
                        isActive
                          ? 'bg-blue-50 text-[#2563EB] font-bold border border-blue-200/60'
                          : 'text-slate-700 hover:text-[#0F172A] hover:bg-slate-50'
                      }`}
                    >
                      <div className="min-w-0 pr-2">
                        <div className="font-semibold truncate">{item.label}</div>
                        {item.description && (
                          <div className="text-[10px] text-slate-500 truncate">
                            {item.description}
                          </div>
                        )}
                      </div>
                      <ChevronRight
                        className={`w-4 h-4 shrink-0 transition-transform duration-150 ${
                          isActive
                            ? 'text-[#2563EB] translate-x-0.5'
                            : 'text-slate-400 group-hover:text-slate-600 group-hover:translate-x-0.5'
                        }`}
                      />
                    </a>
                  );
                })}
              </nav>

              <div className="pt-2.5 mt-2 border-t border-slate-100 grid grid-cols-2 gap-2">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 active:scale-98 transition-all"
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
                  className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-bold text-white bg-[#2563EB] hover:bg-blue-700 active:scale-98 transition-all cursor-pointer"
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
  );
};
