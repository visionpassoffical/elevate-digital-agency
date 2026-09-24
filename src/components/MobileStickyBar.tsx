import React from 'react';
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
  // Hide if there is an active selection (SelectionDockBar takes over) or when quote modal is open
  if (hasActiveSelection || isQuoteModalOpen) {
    return null;
  }

  const handleWhatsAppClick = () => {
    openWhatsApp(formatGeneralInquiryMessage());
  };

  return (
    <aside
      id="mobile-sticky-action-bar"
      aria-label="Quick mobile enquiry actions"
      className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-slate-200/90 px-3 py-2.5 pb-[calc(0.6rem+env(safe-area-inset-bottom,0px))] shadow-lg transition-all duration-200"
    >
      <div className="flex items-center gap-2.5 max-w-md mx-auto">
        <button
          id="mobile-sticky-whatsapp-btn"
          type="button"
          onClick={handleWhatsAppClick}
          className="flex-1 min-h-[44px] px-3.5 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] hover:from-[#3B82F6] hover:to-[#2563EB] active:scale-[0.98] transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md select-none"
        >
          <MessageCircle className="w-4 h-4 shrink-0" />
          <span className="truncate">WhatsApp ELEVATE</span>
        </button>

        <button
          id="mobile-sticky-quote-btn"
          type="button"
          onClick={onOpenQuote}
          className="flex-1 min-h-[44px] px-3.5 py-2.5 rounded-xl text-xs font-bold text-[#0F172A] bg-[#F8FAFC] hover:bg-slate-100 active:scale-[0.98] border border-slate-200/90 transition-all flex items-center justify-center gap-1 cursor-pointer shadow-2xs select-none"
        >
          <span className="truncate">Get a Quote</span>
          <ArrowUpRight className="w-3.5 h-3.5 text-[#2563EB] shrink-0" />
        </button>
      </div>
    </aside>
  );
};
