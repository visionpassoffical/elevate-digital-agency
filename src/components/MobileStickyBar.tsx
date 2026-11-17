import React, { useState, useEffect } from 'react';
import { MessageCircle } from 'lucide-react';
import { useContent } from '../context/ContentContext';

interface MobileStickyBarProps {
  hasActiveSelection: boolean;
  isQuoteModalOpen: boolean;
  onOpenQuote: () => void;
}

export const MobileStickyBar: React.FC<MobileStickyBarProps> = ({
  hasActiveSelection,
  isQuoteModalOpen,
}) => {
  const { openWhatsAppMessage, formatWhatsAppTemplate } = useContent();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 360);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Hide when cart has active items (SelectionDockBar is shown) or when modal is open
  if (!isVisible || hasActiveSelection || isQuoteModalOpen) {
    return null;
  }

  const handleWhatsAppClick = () => {
    const msg = formatWhatsAppTemplate('generalEnquiry', {});
    openWhatsAppMessage(msg);
  };

  return (
    <div className="fixed bottom-5 right-5 z-30 pointer-events-auto">
      <button
        id="mobile-sticky-whatsapp-btn"
        type="button"
        onClick={handleWhatsAppClick}
        aria-label="Chat on WhatsApp"
        className="inline-flex items-center gap-2 px-4 py-3 rounded-full text-xs font-bold text-white bg-[#0B0F19] hover:bg-[#2563EB] active:scale-95 transition-all shadow-[0_12px_28px_-6px_rgba(11,15,25,0.45)] ring-1 ring-white/15 cursor-pointer select-none"
      >
        <MessageCircle className="w-4 h-4 text-emerald-400 shrink-0" />
        <span>WhatsApp</span>
      </button>
    </div>
  );
};
