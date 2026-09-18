import React, { useState, useId } from 'react';
import {
  CreditCard,
  Award,
  Minus,
  Plus,
  ArrowRight,
  MessageCircle,
} from 'lucide-react';
import type { SelectedBulkQuote } from '../types';
import { useContent } from '../context/ContentContext';

interface BulkServicesSectionProps {
  onSelectBulkQuote?: (quote: SelectedBulkQuote) => void;
}

export const BulkServicesSection: React.FC<BulkServicesSectionProps> = ({
  onSelectBulkQuote,
}) => {
  const { content, openWhatsAppMessage, formatWhatsAppTemplate } = useContent();
  const idCardsInputId = useId();
  const certsInputId = useId();

  const idCardsConfig = content.bulkPricing?.idCards;
  const certificatesConfig = content.bulkPricing?.certificates;

  // ID Cards state
  const [idCardsQty, setIdCardsQty] = useState<number>(50);

  // Certificates state
  const [certsQty, setCertsQty] = useState<number>(50);
  const [includeCertDesign, setIncludeCertDesign] = useState<boolean>(true);

  // Dynamic tier calculation for ID cards
  const getIdCardTier = (qty: number) => {
    const tiers = idCardsConfig?.tiers || [];
    for (const t of tiers) {
      if (t.max === null && qty >= t.min) {
        return { tierLabel: t.rangeLabel, unitPrice: t.unitPrice, formatted: `₹${t.unitPrice} / card` };
      }
      if (t.max !== null && qty >= t.min && qty <= t.max) {
        return { tierLabel: t.rangeLabel, unitPrice: t.unitPrice, formatted: `₹${t.unitPrice} / card` };
      }
    }
    return { tierLabel: 'Standard', unitPrice: 25, formatted: '₹25 / card' };
  };

  const idCardTier = getIdCardTier(idCardsQty);
  const idCardsTotal = idCardsQty * idCardTier.unitPrice;

  // Dynamic tier calculation for certificates
  const getCertTier = (qty: number) => {
    const tiers = certificatesConfig?.tiers || [];
    for (const t of tiers) {
      if (t.max === null && qty >= t.min) {
        return { tierLabel: t.rangeLabel, unitPrice: t.unitPrice, formatted: `₹${t.unitPrice} / cert` };
      }
      if (t.max !== null && qty >= t.min && qty <= t.max) {
        return { tierLabel: t.rangeLabel, unitPrice: t.unitPrice, formatted: `₹${t.unitPrice} / cert` };
      }
    }
    return { tierLabel: 'Standard', unitPrice: 15, formatted: '₹15 / cert' };
  };

  const certTier = getCertTier(certsQty);
  const baseDesignFee = certificatesConfig?.baseDesignFee?.price ?? 149;
  const certDesignFee = includeCertDesign ? baseDesignFee : 0;
  const certsTotal = certsQty * certTier.unitPrice + certDesignFee;

  // Quantity helpers
  const handleIdQtyChange = (val: number) => {
    const valid = Math.max(1, Math.min(5000, isNaN(val) ? 1 : val));
    setIdCardsQty(valid);
  };

  const handleCertQtyChange = (val: number) => {
    const valid = Math.max(1, Math.min(5000, isNaN(val) ? 1 : val));
    setCertsQty(valid);
  };

  const handleRequestIdCardsQuote = () => {
    if (onSelectBulkQuote) {
      onSelectBulkQuote({
        serviceId: 'bulk-id-cards',
        serviceTitle: idCardsConfig?.title || 'Bulk ID Cards',
        quantity: idCardsQty,
        unitPrice: idCardTier.unitPrice,
        estimatedTotal: idCardsTotal,
      });
    }
    const msg = formatWhatsAppTemplate('bulkIdCards', {
      quantity: idCardsQty,
      price: `₹${idCardTier.unitPrice}`,
      total: `₹${idCardsTotal}`,
    });
    openWhatsAppMessage(msg);
  };

  const handleRequestCertsQuote = () => {
    if (onSelectBulkQuote) {
      onSelectBulkQuote({
        serviceId: 'bulk-certificates',
        serviceTitle: certificatesConfig?.title || 'Bulk Certificates',
        quantity: certsQty,
        unitPrice: certTier.unitPrice,
        estimatedTotal: certsTotal,
      });
    }
    const msg = formatWhatsAppTemplate('bulkCertificates', {
      quantity: certsQty,
      price: `₹${certTier.unitPrice}`,
      designFee: includeCertDesign ? `₹${baseDesignFee}` : 'Waived',
      total: `₹${certsTotal}`,
    });
    openWhatsAppMessage(msg);
  };

  return (
    <section
      id="bulk"
      className="py-16 sm:py-20 lg:py-24 bg-white border-b border-slate-200/80 scroll-mt-20"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-start">
          
          {/* LEFT COLUMN: Editorial Intro */}
          <div className="lg:sticky lg:top-28">
            <div className="mb-8">
              <div className="inline-flex items-center gap-2 mb-3">
                <span className="w-1.5 h-1.5 bg-[#2563EB] rounded-full" />
                <span className="text-[11px] font-bold tracking-widest uppercase text-slate-500">
                  BULK DOCUMENT PRODUCTION
                </span>
              </div>
              <h2 className="font-['Outfit'] font-extrabold text-3xl sm:text-4xl lg:text-5xl text-[#0F172A] tracking-tight leading-tight mb-3">
                Institutional Scale Pricing.
              </h2>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-md">
                Get premium quality student ID cards and certificates at transparent, volume-based pricing. The more you order, the less you pay per unit.
              </p>
            </div>
            
            <div className="bg-[#F8FAFC] border border-slate-200/90 rounded-2xl p-6 shadow-2xs">
              <h3 className="font-bold text-sm text-[#0F172A] mb-1.5">How it works</h3>
              <ul className="text-xs text-slate-600 space-y-2 leading-relaxed">
                <li className="flex items-start gap-2">
                  <span className="w-1 h-1 rounded-full bg-[#2563EB] mt-1.5 shrink-0" />
                  <span>Select your desired volume or quick-select a tier.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1 h-1 rounded-full bg-[#2563EB] mt-1.5 shrink-0" />
                  <span>Our dynamic engine automatically applies optimal volume discounts.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1 h-1 rounded-full bg-[#2563EB] mt-1.5 shrink-0" />
                  <span>Continue on WhatsApp to submit student photos, data sheets, and receive print-ready proofs.</span>
                </li>
              </ul>
            </div>
          </div>

          {/* RIGHT COLUMN: Interactive Modules */}
          <div className="space-y-8">
            
            {/* ID CARDS MODULE */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-7 shadow-xs">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[#2563EB]">
                  <CreditCard className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-['Outfit'] font-bold text-xl text-[#0F172A]">
                    Premium ID Cards
                  </h3>
                  <p className="text-xs text-slate-500">
                    PVC cards with high-definition thermal printing and lanyards.
                  </p>
                </div>
              </div>

              {/* Volume Tiers */}
              <div className="grid grid-cols-3 gap-2.5 mb-6">
                {(idCardsConfig?.tiers || []).map((tier) => {
                  const isTierActive = idCardTier.tierLabel === tier.rangeLabel;
                  return (
                    <button
                      key={tier.rangeLabel}
                      type="button"
                      onClick={() => setIdCardsQty(tier.min)}
                      className={`p-3 rounded-xl text-center border transition-all cursor-pointer ${
                        isTierActive
                          ? 'bg-[#2563EB] border-[#2563EB] text-white shadow-xs'
                          : 'bg-[#F8FAFC] border-slate-200 hover:border-slate-300 hover:bg-white text-slate-700'
                      }`}
                    >
                      <div className={`text-[10px] font-bold tracking-wider uppercase ${isTierActive ? 'text-blue-100' : 'text-slate-500'}`}>
                        {tier.rangeLabel}
                      </div>
                      <div className={`font-['Outfit'] font-extrabold text-base mt-0.5 ${isTierActive ? 'text-white' : 'text-[#0F172A]'}`}>
                        ₹{tier.unitPrice}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Quantity Selector & Price */}
              <div className="bg-[#F1F5F9]/70 rounded-xl border border-slate-200/80 p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
                <div className="w-full sm:w-auto">
                  <label htmlFor={idCardsInputId} className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">
                    Specify Quantity
                  </label>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleIdQtyChange(idCardsQty - 10)}
                      className="w-9 h-9 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 flex items-center justify-center text-slate-700 transition-colors cursor-pointer"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <div className="relative w-24">
                      <input
                        id={idCardsInputId}
                        type="number"
                        min={1}
                        max={5000}
                        value={idCardsQty}
                        onChange={(e) => handleIdQtyChange(parseInt(e.target.value, 10))}
                        className="w-full text-center font-['Outfit'] font-extrabold text-xl text-[#0F172A] bg-white border border-slate-200 rounded-lg py-1.5 focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => handleIdQtyChange(idCardsQty + 10)}
                      className="w-9 h-9 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 flex items-center justify-center text-slate-700 transition-colors cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                
                <div className="text-right w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 sm:border-l border-slate-200 sm:pl-5">
                  <div className="text-[10px] text-slate-500 mb-0.5 font-bold uppercase tracking-wider">Estimated Total</div>
                  <div className="font-['Outfit'] font-extrabold text-2xl text-[#0F172A]">
                    ₹{idCardsTotal.toLocaleString('en-IN')}
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">
                    {idCardsQty} × ₹{idCardTier.unitPrice}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={handleRequestIdCardsQuote}
                className="w-full py-3 px-5 rounded-xl font-bold text-xs bg-[#2563EB] hover:bg-blue-700 text-white shadow-xs active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>Continue on WhatsApp</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* CERTIFICATES MODULE */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-7 shadow-xs">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[#2563EB]">
                  <Award className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-['Outfit'] font-bold text-xl text-[#0F172A]">
                    Institutional Certificates
                  </h3>
                  <p className="text-xs text-slate-500">
                    Course completion, appreciation and verified merit certificates.
                  </p>
                </div>
              </div>

              <div className="mb-5 p-3 rounded-xl bg-[#F8FAFC] border border-slate-200 flex items-center justify-between gap-4">
                <div className="text-xs text-slate-700">
                  <span className="font-bold text-[#0F172A]">Certificate Design:</span> ₹{baseDesignFee} (one-time)
                </div>
                <label className="inline-flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={includeCertDesign}
                    onChange={(e) => setIncludeCertDesign(e.target.checked)}
                    className="w-3.5 h-3.5 rounded text-[#2563EB] focus:ring-[#2563EB] border-slate-300"
                  />
                  <span className="text-xs font-semibold text-slate-700">Include Design</span>
                </label>
              </div>

              {/* Volume Tiers */}
              <div className="grid grid-cols-3 gap-2.5 mb-6">
                {(certificatesConfig?.tiers || []).map((tier) => {
                  const isTierActive = certTier.tierLabel === tier.rangeLabel;
                  return (
                    <button
                      key={tier.rangeLabel}
                      type="button"
                      onClick={() => setCertsQty(tier.min)}
                      className={`p-3 rounded-xl text-center border transition-all cursor-pointer ${
                        isTierActive
                          ? 'bg-[#2563EB] border-[#2563EB] text-white shadow-xs'
                          : 'bg-[#F8FAFC] border-slate-200 hover:border-slate-300 hover:bg-white text-slate-700'
                      }`}
                    >
                      <div className={`text-[10px] font-bold tracking-wider uppercase ${isTierActive ? 'text-blue-100' : 'text-slate-500'}`}>
                        {tier.rangeLabel}
                      </div>
                      <div className={`font-['Outfit'] font-extrabold text-base mt-0.5 ${isTierActive ? 'text-white' : 'text-[#0F172A]'}`}>
                        ₹{tier.unitPrice}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Quantity Selector & Price */}
              <div className="bg-[#F1F5F9]/70 rounded-xl border border-slate-200/80 p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
                <div className="w-full sm:w-auto">
                  <label htmlFor={certsInputId} className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">
                    Specify Quantity
                  </label>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleCertQtyChange(certsQty - 10)}
                      className="w-9 h-9 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 flex items-center justify-center text-slate-700 transition-colors cursor-pointer"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <div className="relative w-24">
                      <input
                        id={certsInputId}
                        type="number"
                        min={1}
                        max={5000}
                        value={certsQty}
                        onChange={(e) => handleCertQtyChange(parseInt(e.target.value, 10))}
                        className="w-full text-center font-['Outfit'] font-extrabold text-xl text-[#0F172A] bg-white border border-slate-200 rounded-lg py-1.5 focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCertQtyChange(certsQty + 10)}
                      className="w-9 h-9 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 flex items-center justify-center text-slate-700 transition-colors cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                
                <div className="text-right w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 sm:border-l border-slate-200 sm:pl-5">
                  <div className="text-[10px] text-slate-500 mb-0.5 font-bold uppercase tracking-wider">Estimated Total</div>
                  <div className="font-['Outfit'] font-extrabold text-2xl text-[#0F172A]">
                    ₹{certsTotal.toLocaleString('en-IN')}
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">
                    {certsQty} × ₹{certTier.unitPrice} {includeCertDesign ? `+ ₹${baseDesignFee}` : ''}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={handleRequestCertsQuote}
                className="w-full py-3 px-5 rounded-xl font-bold text-xs bg-[#2563EB] hover:bg-blue-700 text-white shadow-xs active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>Continue on WhatsApp</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};
