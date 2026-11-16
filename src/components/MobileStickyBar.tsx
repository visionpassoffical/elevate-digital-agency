import React, { useState, useEffect } from 'react';
import { MessageCircle, ArrowUpRight } from 'lucide-react';
import { openWhatsApp, formatGeneralInquiryMessage } from '../utils/whatsapp';

interface MobileStickyBarProps {
  hasActiveSelection: boolean;
  isQuoteModalOpen: boolean;
  onOpenQuote: () => void;
}

export const MobileStickyBar: React.FC<MobileStickyBarProps> = ({
  hasActiveSelection,
  isQuoteModalOpen,
  onOpenQuote,
}) => {
  const [isPastHero, setIsPastHero] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsPastHero(window.scrollY > 450);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Hide if user hasn't scrolled past Hero, or if there is an active selection (SelectionDockBar takes over), or when quote modal is open
  if (!isPastHero || hasActiveSelection || isQuoteModalOpen) {
    return null;
  }

  const handleWhatsAppClick = () => {
    openWhatsApp(formatGeneralInquiryMessage());
  };

  return (
    <aside
      id="mobile-sticky-action-bar"
      aria-label="Quick mobile enquiry actions"
      className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-slate-200/90 px-3 py-2 pb-[calc(0.5rem+env(safe-area-inset-bottom,0px))] shadow-lg animate-in fade-in slide-in-from-bottom-2 duration-200"
    >
      <div className="flex items-center gap-2 max-w-md mx-auto">
        <button
          id="mobile-sticky-whatsapp-btn"
          type="button"
          onClick={handleWhatsAppClick}
          className="flex-1 min-h-[40px] px-3 py-2 rounded-xl text-xs font-bold text-white bg-[#2563EB] hover:bg-blue-700 active:scale-[0.98] transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs select-none"
        >
          <MessageCircle className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate">WhatsApp ELEVATE</span>
        </button>

        <button
          id="mobile-sticky-quote-btn"
          type="button"
          onClick={onOpenQuote}
          className="flex-1 min-h-[40px] px-3 py-2 rounded-xl text-xs font-bold text-[#0F172A] bg-[#F8FAFC] hover:bg-slate-100 active:scale-[0.98] border border-slate-200/90 transition-all flex items-center justify-center gap-1 cursor-pointer select-none"
        >
          <span className="truncate">Get a Quote</span>
          <ArrowUpRight className="w-3.5 h-3.5 text-[#2563EB] shrink-0" />
        </button>
      </div>
    </aside>
  );
};
