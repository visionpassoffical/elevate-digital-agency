import React, { useState, useEffect } from 'react';
import { X, MessageCircle, Send, CheckCircle2, Building, Shield } from 'lucide-react';
import type { QuoteFormState } from '../types';
import { openWhatsApp } from '../utils/whatsapp';

interface QuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedService?: string;
  preselectedSector?: string;
}

const ORGANIZATION_TYPES = [
  'Madrasa / Islamic Center',
  'School / Educational Academy',
  'Commercial Business / Enterprise',
  'Non-Profit / Community Organization',
  'Other Institution',
];

const SERVICE_OPTIONS = [
  'Standard Website Plan (₹1,999/yr)',
  'Basic Website Plan (₹999/yr)',
  'Standard Monthly Creative Plan (₹899/mo)',
  'Basic Monthly Creative Plan (₹499/mo)',
  'Premium Monthly Creative Plan (₹1,499/mo)',
  'Complete Admission Package (₹449)',
  'Individual Admission Services',
  'Complete Exam Package (₹499)',
  'Individual Exam Services',
  'Bulk ID Cards Solution',
  'Bulk Certificates Solution',
  'Custom Institutional Requirement',
];

export const QuoteModal: React.FC<QuoteModalProps> = ({
  isOpen,
  onClose,
  preselectedService,
  preselectedSector,
}) => {
  const [form, setForm] = useState<QuoteFormState>({
    organizationType: preselectedSector || ORGANIZATION_TYPES[0],
    organizationName: '',
    contactName: '',
    whatsappNumber: '',
    email: '',
    selectedServices: preselectedService ? [preselectedService] : [SERVICE_OPTIONS[0]],
    projectTimeline: 'Within 2-4 weeks',
    notes: '',
  });

  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setSubmitted(false);
      setForm((prev) => ({
        ...prev,
        organizationType: preselectedSector || prev.organizationType || ORGANIZATION_TYPES[0],
        selectedServices: preselectedService ? [preselectedService] : prev.selectedServices.length > 0 ? prev.selectedServices : [SERVICE_OPTIONS[0]],
      }));
    }
  }, [isOpen, preselectedService, preselectedSector]);

  if (!isOpen) return null;

  const toggleService = (service: string) => {
    setForm((prev) => {
      const exists = prev.selectedServices.includes(service);
      if (exists) {
        if (prev.selectedServices.length === 1) return prev; // keep at least one
        return {
          ...prev,
          selectedServices: prev.selectedServices.filter((s) => s !== service),
        };
      } else {
        return {
          ...prev,
          selectedServices: [...prev.selectedServices, service],
        };
      }
    });
  };

  const generateWhatsAppMessage = () => {
    return `*New Project Inquiry — ELEVATE Agency*
--------------------------------
*Organization:* ${form.organizationName || 'Not specified'}
*Type:* ${form.organizationType}
*Contact Person:* ${form.contactName || 'Not specified'}
*WhatsApp/Phone:* ${form.whatsappNumber || 'Not specified'}
*Email:* ${form.email || 'Not provided'}
*Services Required:* ${form.selectedServices.join(', ')}
*Timeline:* ${form.projectTimeline}
*Details:* ${form.notes || 'Looking for initial consultation'}
--------------------------------
Submitted via ELEVATE web platform.`;
  };

  const handleWhatsAppSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const message = generateWhatsAppMessage();
    openWhatsApp(message);
    setSubmitted(true);
  };

  const handleStandardSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#0B0F17]/60 backdrop-blur-xs overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="bg-[#0F172A] text-white p-6 sm:p-7 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-1.5 h-1.5 bg-[#2563EB] rounded-full" />
              <span className="font-['Outfit'] font-bold text-[11px] uppercase tracking-widest text-slate-300">
                ELEVATE Agency
              </span>
              <span className="text-slate-600">|</span>
              <span className="text-xs text-slate-400">Consultation & Quote</span>
            </div>
            <h3 className="font-['Outfit'] font-extrabold text-xl sm:text-2xl text-white">
              Tell us about your project.
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              Fast, transparent scoping with direct WhatsApp responses within 2 hours.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl bg-white/10 hover:bg-white/20 transition-colors cursor-pointer"
            aria-label="Close quote modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 sm:p-8 max-h-[calc(85vh-140px)] overflow-y-auto">
          {submitted ? (
            <div className="py-12 text-center space-y-4">
              <div className="w-14 h-14 rounded-full bg-blue-50 text-[#2563EB] flex items-center justify-center mx-auto border border-blue-100">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h4 className="font-['Outfit'] font-bold text-2xl text-[#0F172A]">
                Inquiry Generated Successfully
              </h4>
              <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                Thank you. Your project brief is prepared. You can now chat directly with our team on
                WhatsApp or await our follow-up email.
              </p>
              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                <a
                  href={`https://wa.me/919497122397?text=${generateWhatsAppMessage()}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 text-xs font-bold text-white bg-[#2563EB] hover:bg-blue-700 rounded-xl shadow-xs"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Open in WhatsApp</span>
                </a>
                <button
                  type="button"
                  onClick={() => {
                    setSubmitted(false);
                    onClose();
                  }}
                  className="w-full sm:w-auto px-6 py-3 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl cursor-pointer"
                >
                  Done
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleWhatsAppSubmit} className="space-y-6">
              {/* 1. Organization Type */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                  1. Organization / Institution Type
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {ORGANIZATION_TYPES.map((type) => (
                    <button
                      type="button"
                      key={type}
                      onClick={() => setForm({ ...form, organizationType: type })}
                      className={`p-3 text-left rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                        form.organizationType === type
                          ? 'bg-blue-50/80 border-[#2563EB] text-[#2563EB]'
                          : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. Services Needed */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                  2. Required Services (Select all that apply)
                </label>
                <div className="flex flex-wrap gap-2">
                  {Array.from(new Set([...form.selectedServices, ...SERVICE_OPTIONS])).map((service) => {
                    const isSelected = form.selectedServices.includes(service);
                    return (
                      <button
                        type="button"
                        key={service}
                        onClick={() => toggleService(service)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#0F172A] text-white'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {service}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 3. Organization & Contact Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 block">
                    Organization / Institution Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Al-Noor Academy / Apex Ltd"
                    value={form.organizationName}
                    onChange={(e) => setForm({ ...form, organizationName: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 block">
                    Your Name / Role
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Administrator / Director"
                    value={form.contactName}
                    onChange={(e) => setForm({ ...form, contactName: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 block">
                    WhatsApp Number (for direct quote)
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+1 (555) 000-0000"
                    value={form.whatsappNumber}
                    onChange={(e) => setForm({ ...form, whatsappNumber: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 block">
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="contact@institution.org"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]"
                  />
                </div>
              </div>

              {/* 4. Notes & Specific Requirements */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 block">
                  Project Notes or Target Launch Timeline
                </label>
                <textarea
                  rows={3}
                  placeholder="Share any specific requirements (e.g. need Arabic support, new admission portal, urgent event flyer)..."
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] resize-none"
                />
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-[11px] text-slate-500">
                  <Shield className="w-4 h-4 text-[#2563EB] shrink-0" />
                  <span>Direct consultation • No spam or aggressive follow-ups</span>
                </div>

                <div className="flex items-center gap-2.5 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={handleStandardSubmit}
                    className="flex-1 sm:flex-none px-4 py-2.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl cursor-pointer"
                  >
                    Save Brief
                  </button>
                  <button
                    type="submit"
                    className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-[#2563EB] hover:bg-blue-700 active:scale-[0.98] rounded-xl shadow-xs transition-all cursor-pointer"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Send via WhatsApp</span>
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
