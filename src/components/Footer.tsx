import React from 'react';
import { ArrowUp, MessageCircle, Shield, Globe, Mail, Phone } from 'lucide-react';
import { useContent } from '../context/ContentContext';

interface FooterProps {
  onAdminClick: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onAdminClick }) => {
  const { content, openWhatsAppMessage } = useContent();
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const headerOffset = 80;
      const elPos = el.getBoundingClientRect().top;
      const offsetPos = elPos + window.pageYOffset - headerOffset;
      window.scrollTo({ top: offsetPos, behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-[#070A11] border-t border-white/10 text-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 pb-12 border-b border-white/10">
          
          {/* Brand Info (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-[#2563EB] to-[#1D4ED8] flex items-center justify-center font-['Outfit'] font-black text-white text-base shadow-[0_0_20px_-3px_rgba(37,99,235,0.7)]">
                E
              </div>
              <span className="font-['Outfit'] font-extrabold text-xl tracking-tight text-white">
                ELEVATE
              </span>
            </div>
            
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-sm">
              Digital engineering and creative studio built for schools, colleges, academies, and modern institutions. High performance, zero bloat.
            </p>

            <div className="pt-2 flex items-center gap-3">
              <button
                type="button"
                onClick={() => openWhatsAppMessage('Hello ELEVATE, I would like to enquire about your digital services.')}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-xs font-semibold text-slate-200 transition-colors cursor-pointer"
              >
                <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                <span>+91 94971 22397</span>
              </button>
            </div>
          </div>

          {/* Solutions Column (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Solutions & Services
            </div>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-400">
              <li>
                <button
                  type="button"
                  onClick={() => scrollToSection('websites')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Institutional Websites
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => scrollToSection('admission')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Admission Solutions
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => scrollToSection('exam')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Exam Solutions Desk
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => scrollToSection('creative')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Monthly Creative Retainers
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => scrollToSection('bulk')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Bulk ID Cards & Certificates
                </button>
              </li>
            </ul>
          </div>

          {/* Navigation Column (2 cols) */}
          <div className="lg:col-span-2 space-y-3">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Navigation
            </div>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-400">
              <li>
                <button
                  type="button"
                  onClick={() => scrollToSection('clients')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Client Institutions
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
                  Frequently Asked Questions
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => scrollToSection('contact')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Contact & WhatsApp
                </button>
              </li>
            </ul>
          </div>

          {/* Platform Management & Back to top (3 cols) */}
          <div className="lg:col-span-3 space-y-4">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Platform & Governance
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Protected administration interface for institutional catalog, pricing tiers, and client logos.
            </p>
            <div className="flex flex-col gap-2 pt-1">
              <button
                type="button"
                onClick={onAdminClick}
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-xs font-semibold text-slate-300 hover:text-white transition-all cursor-pointer text-left"
              >
                <Shield className="w-3.5 h-3.5 text-blue-400" />
                <span>Admin Control Desk</span>
              </button>
              
              <button
                type="button"
                onClick={scrollToTop}
                className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-white/[0.03] transition-colors cursor-pointer"
              >
                <ArrowUp className="w-3.5 h-3.5" />
                <span>Back to top</span>
              </button>
            </div>
          </div>

        </div>

        {/* Bottom Credits & Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div>
            &copy; {currentYear} ELEVATE Institutional Solutions. All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <span>Engineering for Schools, Colleges & Academies</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
