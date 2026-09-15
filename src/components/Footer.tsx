import React from 'react';
import { ElevateLogo } from './ElevateLogo';
import { MessageCircle, ArrowUpRight } from 'lucide-react';
import { BRAND_CONFIG } from '../data/brandConfig';

interface FooterProps {
  onOpenQuote: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenQuote }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavClick = (href: string) => {
    const el = document.querySelector(href);
    if (el) {
      const headerOffset = 80;
      const elementPosition = el.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  const FOOTER_LINKS = [
    { label: 'Services', href: '#services' },
    { label: 'Client Institutions', href: '#clients' },
    { label: 'Websites', href: '#websites' },
    { label: 'Admission', href: '#admission' },
    { label: 'Exam', href: '#exam' },
    { label: 'Monthly', href: '#monthly' },
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'FAQ', href: '#faq' },
  ];

  return (
    <footer className="bg-[#0B0F17] text-white pt-16 sm:pt-24 pb-24 md:pb-12 border-t-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-16 border-b border-white/10">
          
          {/* Brand Column */}
          <div className="md:col-span-6 space-y-6">
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                scrollToTop();
              }}
              className="inline-block focus:outline-none"
              aria-label="ELEVATE Home"
            >
              <ElevateLogo variant="white" size="md" showTagline={false} />
            </a>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              Professional, affordable digital engineering, exam solutions, and monthly creative services for institutions, schools, and organizations.
            </p>
          </div>

          {/* Quick Links Column */}
          <div className="md:col-span-3 space-y-4">
            <h4 className="font-['Outfit'] font-bold text-xs uppercase tracking-widest text-slate-500">
              Navigation
            </h4>
            <ul className="space-y-3 text-sm text-slate-300">
              {FOOTER_LINKS.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    onClick={(e) => {
                      e.preventDefault();
                      handleNavClick(link.href);
                    }}
                    className="hover:text-white transition-colors block"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* WhatsApp Direct Column */}
          <div className="md:col-span-3 space-y-4">
            <h4 className="font-['Outfit'] font-bold text-xs uppercase tracking-widest text-slate-500">
              WhatsApp
            </h4>
            <a
              href="https://wa.me/919497122397"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/10 hover:border-emerald-500/50 transition-colors group w-full"
            >
              <div className="text-emerald-400 shrink-0">
                <MessageCircle className="w-5 h-5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors">
                  {BRAND_CONFIG.whatsappNumber}
                </div>
              </div>
              <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-white shrink-0" />
            </a>
            <button
              type="button"
              onClick={onOpenQuote}
              className="w-full py-3.5 px-4 text-sm font-bold text-slate-300 bg-white/5 hover:bg-white/10 hover:text-white border border-white/10 rounded-xl transition-colors cursor-pointer text-center mt-2"
            >
              Get a Custom Quote
            </button>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            <span>© {new Date().getFullYear()} ELEVATE. Digital Solutions & Creative Services.</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
