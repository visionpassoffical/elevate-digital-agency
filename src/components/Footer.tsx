import React, { useState } from 'react';
import { MessageCircle, ArrowUpRight, Lock, Sparkles } from 'lucide-react';
import { ElevateLogo } from './ElevateLogo';
import { useContent } from '../context/ContentContext';
import type { ServiceTabKey } from './Header';

interface FooterProps {
  onAdminClick?: () => void;
  onOpenQuote?: (context?: string) => void;
  onSelectServiceTab?: (tab: ServiceTabKey) => void;
}

const QUICK_TOPICS = [
  'Website Development',
  'Digital Marketing & Creatives',
  'Madrasa / School Setup',
  'Custom Project',
];

export const Footer: React.FC<FooterProps> = ({
  onAdminClick,
  onOpenQuote,
  onSelectServiceTab,
}) => {
  const { content, openWhatsAppMessage } = useContent();
  const [selectedTopic, setSelectedTopic] = useState<string>('Website Development');

  const scrollToServicesWithTab = (tab: ServiceTabKey) => {
    onSelectServiceTab?.(tab);
    const el = document.getElementById('services');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleQuickTopicClick = (topic: string) => {
    setSelectedTopic(topic);
    openWhatsAppMessage(
      `Hello ELEVATE Studio! I would like to discuss *${topic}*. Please share package details, timeline, and next steps.`
    );
  };

  const handleDirectWhatsApp = () => {
    openWhatsAppMessage(
      `Hello ELEVATE Studio! I'm interested in *${selectedTopic}*. Let's discuss how we can get started.`
    );
  };

  const displayPhone = content.contact?.whatsappNumber || '+91 94971 22397';
  const displayEmail = content.contact?.email || 'hello@elevatedigital.in';
  const brandName = content.general?.brandName || 'ELEVATE';

  return (
    <footer
      id="contact"
      className="bg-[#09090B] text-white relative overflow-hidden"
    >
      {/* Subtle electric-blue studio ambient glow */}
      <div className="pointer-events-none absolute top-0 left-1/4 w-[620px] h-[340px] bg-[#2563EB]/15 blur-[130px] rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* TOP STUDIO FINALE CTA BLOCK */}
        <div className="py-16 sm:py-24 border-b border-white/10">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-blue-400 mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              <span>06 / START A PROJECT</span>
            </div>

            <h2 className="font-['Outfit'] font-extrabold text-3xl sm:text-5xl lg:text-6xl text-white tracking-[-0.03em] leading-[1.05] mb-6">
              Ready to elevate your digital presence?
            </h2>

            <p className="text-slate-400 text-base sm:text-lg max-w-2xl leading-relaxed mb-8">
              Select a topic below to pre-fill your WhatsApp inquiry, or build a custom multi-service package with instant transparent pricing.
            </p>

            {/* Interactive Quick-Topic Pills (Pre-fills WhatsApp on click) */}
            <div className="mb-8">
              <span className="block text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400 mb-3">
                Quick-Launch Topic (Tap to Open WhatsApp):
              </span>
              <div className="flex flex-wrap gap-2.5">
                {QUICK_TOPICS.map((topic) => {
                  const isActive = selectedTopic === topic;
                  return (
                    <button
                      key={topic}
                      type="button"
                      onClick={() => handleQuickTopicClick(topic)}
                      className={`px-4 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer inline-flex items-center gap-2 ${
                        isActive
                          ? 'bg-white text-[#09090B] shadow-sm'
                          : 'bg-white/[0.06] hover:bg-white/[0.12] text-slate-200 border border-white/15'
                      }`}
                    >
                      <span>{topic}</span>
                      <ArrowUpRight className="w-3.5 h-3.5 opacity-75" />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Primary & Secondary Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
              <button
                type="button"
                onClick={handleDirectWhatsApp}
                className="inline-flex items-center justify-center gap-2.5 bg-[#2563EB] hover:bg-blue-500 text-white font-bold px-7 py-4 rounded-full text-sm sm:text-base transition-all shadow-[0_14px_34px_-10px_rgba(37,99,235,0.65)] cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Chat on WhatsApp ({displayPhone})</span>
              </button>

              {onOpenQuote && (
                <button
                  type="button"
                  onClick={() => onOpenQuote(selectedTopic)}
                  className="inline-flex items-center justify-center gap-2 bg-transparent hover:bg-white/[0.07] text-white font-bold px-7 py-4 rounded-full text-sm sm:text-base border border-white/20 transition-all cursor-pointer"
                >
                  <span>Build Custom Quote</span>
                  <ArrowUpRight className="w-4 h-4 text-slate-300" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* BOTTOM MULTI-COLUMN FOOTER NAVIGATION */}
        <div className="py-12 sm:py-16 grid grid-cols-1 md:grid-cols-12 gap-10 border-b border-white/10">
          {/* Brand Column */}
          <div className="md:col-span-5">
            <div className="mb-4">
              <ElevateLogo size="md" theme="dark" />
            </div>
            <p className="text-slate-400 text-sm max-w-sm leading-relaxed mb-6">
              {content.footer?.brandDescription ||
                'Boutique digital agency & institutional technology studio crafting high-converting websites, admission funnels, and brand identities.'}
            </p>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-slate-400 font-medium">
              <a
                href={`tel:${displayPhone.replace(/\s+/g, '')}`}
                className="hover:text-white transition-colors"
              >
                {displayPhone}
              </a>
              <span className="text-white/20">•</span>
              <a
                href={`mailto:${displayEmail}`}
                className="hover:text-white transition-colors"
              >
                {displayEmail}
              </a>
            </div>
          </div>

          {/* Capabilities Links */}
          <div className="md:col-span-4">
            <h4 className="font-['Outfit'] font-bold text-white mb-4 text-xs uppercase tracking-[0.16em]">
              Studio Capabilities
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li>
                <button
                  type="button"
                  onClick={() => scrollToServicesWithTab('websites')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Turnkey Websites (from ₹999/yr)
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => scrollToServicesWithTab('creative')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Digital Marketing & Monthly Creatives
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => scrollToServicesWithTab('admission')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Admission Campaign Funnels
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => scrollToServicesWithTab('exam')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Exam & Result Automation Portals
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => scrollToServicesWithTab('bulk')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Bulk Institutional Print & Kits
                </button>
              </li>
            </ul>
          </div>

          {/* Navigation Links */}
          <div className="md:col-span-3">
            <h4 className="font-['Outfit'] font-bold text-white mb-4 text-xs uppercase tracking-[0.16em]">
              Index
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li>
                <a href="#portfolio" className="hover:text-white transition-colors">
                  01 / Selected Work
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-white transition-colors">
                  02 / Capabilities & Rate Card
                </a>
              </li>
              <li>
                <a href="#clients" className="hover:text-white transition-colors">
                  03 / Client Network
                </a>
              </li>
              <li>
                <a href="#process" className="hover:text-white transition-colors">
                  04 / 48h Execution Model
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-white transition-colors">
                  05 / Common Questions
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* COPYRIGHT & DISCREET ADMIN LINK */}
        <div className="py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>
            © {new Date().getFullYear()} {brandName}. Crafted for modern institutions & ambitious brands.
          </p>
          <div className="flex items-center gap-5">
            <span>100% Transparent Rate Card</span>
            {onAdminClick && (
              <button
                type="button"
                onClick={onAdminClick}
                className="inline-flex items-center gap-1.5 text-slate-500 hover:text-slate-300 transition-colors cursor-pointer"
                title="Studio Admin Portal"
              >
                <Lock className="w-3 h-3" />
                <span>Admin</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
};
