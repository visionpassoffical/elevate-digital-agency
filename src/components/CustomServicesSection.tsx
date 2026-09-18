import React from 'react';
import { MessageCircle, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useContent } from '../context/ContentContext';

interface CustomServicesSectionProps {
  onRequestQuote?: (context: string) => void;
}

export const CustomServicesSection: React.FC<CustomServicesSectionProps> = ({
  onRequestQuote,
}) => {
  const { content, openWhatsAppMessage, formatWhatsAppTemplate } = useContent();
  const enquiry = content.customEnquiry;

  if (enquiry && enquiry.enabled === false) {
    return null;
  }

  const handleSendEnquiry = () => {
    const msg = formatWhatsAppTemplate('customEnquiry', {
      serviceTitle: 'Bespoke Custom Requirement',
    });
    openWhatsAppMessage(msg);
  };

  const trustBullets = [
    'Direct consultation',
    'Transparent upfront pricing',
    'Fast turnkey turnaround',
  ];

  return (
    <section
      id="custom-services"
      className="py-14 sm:py-20 bg-[#F8FAFC] border-b border-slate-200/80 scroll-mt-20 relative overflow-hidden"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        
        <div className="inline-flex items-center gap-2 mb-3">
          <span className="w-1.5 h-1.5 bg-[#2563EB] rounded-full" />
          <span className="text-[11px] font-bold tracking-widest uppercase text-slate-500">
            BESPOKE SCOPING
          </span>
        </div>

        {/* Main Headings */}
        <h2 className="font-['Outfit'] font-extrabold text-2xl sm:text-3xl md:text-4xl text-[#0F172A] tracking-tight mb-3">
          {enquiry?.heading || 'Have a Custom Requirement?'}
        </h2>

        <p className="text-sm sm:text-base text-slate-600 font-normal leading-relaxed max-w-xl mx-auto mb-8">
          {enquiry?.description || "Tell us what you need. We'll understand your requirement and provide the right solution."}
        </p>

        {/* Key trust bullets */}
        <div className="flex flex-wrap items-center justify-center gap-y-2.5 gap-x-6 text-xs sm:text-sm text-slate-700 font-medium mb-8">
          {trustBullets.map((bullet, idx) => (
            <span key={idx} className="inline-flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#2563EB]" />
              <span>{bullet}</span>
            </span>
          ))}
        </div>

        {/* Main Action Button */}
        <div className="flex justify-center">
          <button
            id="btn-send-enquiry-whatsapp"
            type="button"
            onClick={handleSendEnquiry}
            className="w-full sm:w-auto py-3 px-6 rounded-xl font-bold text-xs sm:text-sm text-white bg-[#2563EB] hover:bg-blue-700 active:scale-[0.98] transition-all shadow-xs flex items-center justify-center gap-2.5 cursor-pointer group"
          >
            <MessageCircle className="w-4 h-4" />
            <span>{enquiry?.buttonText || 'Send Enquiry on WhatsApp'}</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

      </div>
    </section>
  );
};

