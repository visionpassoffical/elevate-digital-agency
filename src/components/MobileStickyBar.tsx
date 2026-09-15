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
      className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-[#0B0F17]/92 backdrop-blur-lg border-t border-slate-800/80 px-3 py-2 pb-[calc(0.5rem+env(safe-area-inset-bottom,0px))] shadow-xl transition-all duration-200"
    >
      <div className="flex items-center gap-2 max-w-md mx-auto">
        <button
          id="mobile-sticky-whatsapp-btn"
          type="button"
          onClick={handleWhatsAppClick}
          className="flex-1 min-h-[40px] px-3.5 py-2 rounded-lg text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 active:scale-[0.98] transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs select-none"
        >
          <MessageCircle className="w-4 h-4 fill-white/20 shrink-0" />
          <span className="truncate">WhatsApp ELEVATE</span>
        </button>

        <button
          id="mobile-sticky-quote-btn"
          type="button"
          onClick={onOpenQuote}
          className="flex-1 min-h-[40px] px-3.5 py-2 rounded-lg text-xs font-bold text-slate-200 bg-slate-800/90 hover:bg-slate-700 active:scale-[0.98] border border-slate-700/80 transition-all flex items-center justify-center gap-1 cursor-pointer shadow-xs select-none"
        >
          <span className="truncate">Get a Quote</span>
          <ArrowUpRight className="w-3.5 h-3.5 text-blue-400 shrink-0" />
        </button>
      </div>
    </aside>
  );
};
