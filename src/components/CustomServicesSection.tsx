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
      className="py-16 sm:py-24 bg-white border-b border-slate-100 scroll-mt-20 relative overflow-hidden"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        
        {/* Main Headings */}
        <h2 className="font-['Outfit'] font-extrabold text-3xl sm:text-4xl md:text-5xl text-[#0B0F17] tracking-tight mb-5">
          {enquiry?.heading || 'Have a Requirement?'}
        </h2>

        <p className="text-base sm:text-lg text-slate-600 font-normal leading-relaxed max-w-2xl mx-auto mb-10">
          {enquiry?.description || "Tell us what you need. We'll understand your requirement and provide the right solution."}
        </p>

        {/* Key trust bullets */}
        <div className="flex flex-wrap items-center justify-center gap-y-3 gap-x-8 text-xs sm:text-sm text-slate-700 font-medium mb-10">
          {trustBullets.map((bullet, idx) => (
            <span key={idx} className="inline-flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-[#0062EB]" />
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
            className="w-full sm:w-auto py-4 px-10 rounded-2xl font-bold text-base text-white bg-[#0B0F17] hover:bg-[#0062EB] active:scale-[0.98] transition-all duration-300 shadow-xl flex items-center justify-center gap-3 cursor-pointer group"
          >
            <MessageCircle className="w-5 h-5 opacity-80" />
            <span>{enquiry?.buttonText || 'Send Enquiry on WhatsApp'}</span>
            <ArrowRight className="w-5 h-5 opacity-80 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

      </div>
    </section>
  );
};

