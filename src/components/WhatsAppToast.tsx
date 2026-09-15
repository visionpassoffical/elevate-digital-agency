import React, { useEffect, useState } from 'react';
import { AlertCircle, MessageCircle, X } from 'lucide-react';
import { WHATSAPP_DISPLAY, WHATSAPP_PHONE } from '../utils/whatsapp';

interface ErrorDetail {
  message: string;
  fallbackNumber: string;
  fallbackUrl: string;
}

export const WhatsAppToast: React.FC = () => {
  const [errorInfo, setErrorInfo] = useState<ErrorDetail | null>(null);

  useEffect(() => {
    const handleError = (e: Event) => {
      const customEvent = e as CustomEvent<ErrorDetail>;
      setErrorInfo(
        customEvent.detail || {
          message: "We couldn't prepare the WhatsApp message. Please try again.",
          fallbackNumber: WHATSAPP_DISPLAY,
          fallbackUrl: `https://wa.me/${WHATSAPP_PHONE}`,
        }
      );
    };

    window.addEventListener('elevate:whatsapp-error', handleError);
    return () => {
      window.removeEventListener('elevate:whatsapp-error', handleError);
    };
  }, []);

  if (!errorInfo) return null;

  return (
    <div
      role="alert"
      className="fixed top-20 left-1/2 -translate-x-1/2 z-50 w-11/12 max-w-md bg-slate-900 text-white p-4 rounded-2xl shadow-2xl border border-slate-700 animate-in fade-in slide-in-from-top-4 duration-300"
    >
      <div className="flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div className="flex-1 space-y-2">
          <p className="text-xs sm:text-sm font-medium text-slate-200">
            {errorInfo.message}
          </p>
          <div className="flex items-center gap-3 pt-1">
            <a
              href={errorInfo.fallbackUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white transition-colors"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>WhatsApp: {errorInfo.fallbackNumber}</span>
            </a>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setErrorInfo(null)}
          className="text-slate-400 hover:text-white p-1 rounded-md transition-colors"
          aria-label="Dismiss error"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
