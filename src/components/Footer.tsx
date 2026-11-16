import React from 'react';
import { ArrowUp, MessageCircle } from 'lucide-react';
import { useContent } from '../context/ContentContext';
import type { ServiceTabKey } from './Header';

interface FooterProps {
  onAdminClick: () => void;
  onOpenQuote?: () => void;
  onSelectServiceTab?: (tab: ServiceTabKey) => void;
}

export const Footer: React.FC<FooterProps> = ({ onAdminClick, onSelectServiceTab }) => {
  const { openWhatsAppMessage } = useContent();
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToSection = (id: string) => {
    const serviceTabs: Record<string, ServiceTabKey> = {
      websites: 'websites',
      admission: 'admission',
      exam: 'exam',
      creative: 'creative',
      bulk: 'bulk',
    };

    if (serviceTabs[id] && onSelectServiceTab) {
      onSelectServiceTab(serviceTabs[id]);
      const servicesEl = document.getElementById('services');
      if (servicesEl) {
        const headerOffset = 72;
        const elPos = servicesEl.getBoundingClientRect().top;
        const offsetPos = elPos + window.pageYOffset - headerOffset;
        window.scrollTo({ top: offsetPos, behavior: 'smooth' });
        return;
      }
    }

    const el = document.getElementById(id);
    if (el) {
      const headerOffset = 72;
      const elPos = el.getBoundingClientRect().top;
      const offsetPos = elPos + window.pageYOffset - headerOffset;
      window.scrollTo({ top: offsetPos, behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-[#0F172A] border-t border-slate-800/80 text-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-10 border-b border-slate-800/80">
          {/* Brand Info (5 cols) */}
          <div className="md:col-span-5 space-y-3.5">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-xl bg-[#2563EB] flex items-center justify-center font-['Outfit'] font-black text-white text-sm shadow-sm">
                E
              </div>
              <span className="font-['Outfit'] font-extrabold text-lg tracking-tight text-white">
                ELEVATE
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-sm">
              Digital engineering and creative studio built for schools, madrasas, colleges, and modern institutions.
            </p>

            <div className="pt-1 flex items-center gap-3">
              <button
                type="button"
                onClick={() =>
                  openWhatsAppMessage(
                    'Hello ELEVATE, I would like to enquire about your digital services.'
                  )
                }
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] border border-white/10 text-xs font-semibold text-slate-200 transition-colors cursor-pointer"
              >
                <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                <span>+91 94971 22397</span>
              </button>
            </div>
          </div>

          {/* Solutions Column (4 cols) */}
          <div className="md:col-span-4 space-y-2.5">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Solutions &amp; Packages
            </div>
            <ul className="space-y-1.5 text-xs sm:text-sm text-slate-400">
              <li>
                <button
                  type="button"
                  onClick={() => scrollToSection('websites')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Institutional Websites (₹999/yr)
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => scrollToSection('admission')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Admission Campaign Kit (₹449)
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => scrollToSection('exam')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Exam Controller Pack (₹499)
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => scrollToSection('creative')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Monthly Creative Plans (₹499+)
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => scrollToSection('bulk')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Bulk ID Cards &amp; Certificates
                </button>
              </li>
            </ul>
          </div>

          {/* Navigation Column (3 cols) */}
          <div className="md:col-span-3 space-y-2.5">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Navigation
            </div>
            <ul className="space-y-1.5 text-xs sm:text-sm text-slate-400">
              <li>
                <button
                  type="button"
                  onClick={() => scrollToSection('portfolio')}
                  className="hover:text-white transition-colors cursor-pointer font-medium text-blue-400"
                >
                  Built Websites (Our Work)
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => scrollToSection('clients')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Partner Institutions
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => scrollToSection('how-it-works')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  How ELEVATE Works
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => scrollToSection('faq')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Common Questions
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={scrollToTop}
                  className="inline-flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors cursor-pointer pt-1"
                >
                  <ArrowUp className="w-3.5 h-3.5" />
                  <span>Back to top</span>
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Copyright Row with Discreet Admin Link */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
          <div>
            &copy; {currentYear} ELEVATE Institutional Solutions. All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <span>Schools, Madrasas &amp; Businesses</span>
            <span aria-hidden="true" className="text-slate-700">
              ·
            </span>
            <button
              type="button"
              onClick={onAdminClick}
              className="text-slate-500 hover:text-slate-300 transition-colors cursor-pointer"
            >
              Admin
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
