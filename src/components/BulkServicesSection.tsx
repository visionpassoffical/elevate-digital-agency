import React, { useState, useId } from 'react';
import {
  CreditCard,
  Award,
  Minus,
  Plus,
  ArrowRight,
  MessageCircle,
  Sparkles,
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
      className="py-20 sm:py-28 bg-[#FFFFFF] text-[#0F172A] border-b border-slate-200/80 scroll-mt-20 relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          
          {/* LEFT COLUMN: Editorial Intro (5 cols) */}
          <div className="lg:col-span-5 lg:sticky lg:top-28">
            <div className="mb-8">
              <div className="inline-flex items-center gap-2 mb-3">
                <span className="w-1.5 h-1.5 bg-[#2563EB] rounded-full" />
                <span className="text-[11px] font-bold tracking-widest uppercase text-slate-500">
                  BULK DOCUMENT PRODUCTION
                </span>
              </div>
              <h2 className="font-['Outfit'] font-extrabold text-3xl sm:text-4xl lg:text-5xl text-[#0F172A] tracking-tight leading-tight mb-3">
                Volume Institutional Pricing.
              </h2>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-md">
                Get premium quality student ID cards and merit certificates at transparent volume-tiered pricing. The more you produce, the lower your per-unit cost.
              </p>
            </div>
            
            <div className="bg-[#F8FAFC] border border-slate-200/90 rounded-2xl p-6 shadow-2xs">
              <h3 className="font-['Outfit'] font-bold text-sm text-[#0F172A] mb-2 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#2563EB]" />
                <span>How Volume Discounting Works</span>
              </h3>
              <ul className="text-xs text-slate-600 space-y-2 leading-relaxed">
                <li className="flex items-start gap-2">
                  <span className="w-1 h-1 rounded-full bg-[#2563EB] mt-1.5 shrink-0" />
                  <span>Choose your required quantity or click a tier shortcut.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1 h-1 rounded-full bg-[#2563EB] mt-1.5 shrink-0" />
                  <span>The live calculator automatically applies the optimal tier price.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1 h-1 rounded-full bg-[#2563EB] mt-1.5 shrink-0" />
                  <span>Click WhatsApp to submit your student spreadsheet and photos.</span>
                </li>
              </ul>
            </div>
          </div>

          {/* RIGHT COLUMN: Interactive Production Modules (7 cols) */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* ID CARDS MODULE */}
            <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs hover:border-slate-300 transition-all">
              <div className="flex items-center gap-3.5 mb-6">
                <div className="w-10 h-10 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[#2563EB] shrink-0">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-['Outfit'] font-bold text-xl text-[#0F172A]">
                    Student & Staff ID Cards
                  </h3>
                  <p className="text-xs text-slate-500">
                    High-definition PVC thermal cards with barcodes & custom lanyards.
                  </p>
                </div>
              </div>

              {/* Volume Tiers Shortcuts */}
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 mb-6">
                {(idCardsConfig?.tiers || []).map((tier) => {
                  const isTierActive = idCardTier.tierLabel === tier.rangeLabel;
                  return (
                    <button
                      key={tier.rangeLabel}
                      type="button"
                      onClick={() => setIdCardsQty(tier.min)}
                      className={`p-2.5 rounded-xl text-center border transition-all cursor-pointer ${
                        isTierActive
                          ? 'bg-[#2563EB] border-[#2563EB] text-white shadow-xs'
                          : 'bg-[#F8FAFC] border-slate-200 hover:border-slate-300 hover:bg-slate-100/60 text-slate-700'
                      }`}
                    >
                      <div className={`text-[10px] font-bold tracking-wider uppercase ${isTierActive ? 'text-blue-100' : 'text-slate-500'}`}>
                        {tier.rangeLabel}
                      </div>
                      <div className={`font-['Outfit'] font-extrabold text-sm mt-0.5 ${isTierActive ? 'text-white' : 'text-[#0F172A]'}`}>
                        ₹{tier.unitPrice}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Quantity Selector & Price */}
              <div className="bg-[#F8FAFC] rounded-2xl border border-slate-200/90 p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
                <div className="w-full sm:w-auto">
                  <label htmlFor={idCardsInputId} className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">
                    Enter Exact Quantity
                  </label>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleIdQtyChange(idCardsQty - 10)}
                      className="w-9 h-9 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 flex items-center justify-center text-slate-700 transition-colors cursor-pointer"
                      title="Decrease by 10"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <input
                      id={idCardsInputId}
                      type="number"
                      min={1}
                      max={5000}
                      value={idCardsQty}
                      onChange={(e) => handleIdQtyChange(parseInt(e.target.value, 10))}
                      className="w-24 text-center font-['Outfit'] font-extrabold text-xl text-[#0F172A] bg-white border border-slate-200 rounded-xl py-1.5 focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                    />
                    <button
                      type="button"
                      onClick={() => handleIdQtyChange(idCardsQty + 10)}
                      className="w-9 h-9 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 flex items-center justify-center text-slate-700 transition-colors cursor-pointer"
                      title="Increase by 10"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                
                <div className="text-right w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 sm:border-l border-slate-200 sm:pl-6">
                  <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Estimated Total</div>
                  <div className="font-['Outfit'] font-extrabold text-2xl sm:text-3xl text-[#0F172A]">
                    ₹{idCardsTotal.toLocaleString('en-IN')}
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">
                    {idCardsQty} cards × ₹{idCardTier.unitPrice}/card
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={handleRequestIdCardsQuote}
                className="w-full py-3.5 px-5 rounded-xl font-bold text-xs sm:text-sm bg-[#2563EB] hover:bg-blue-700 text-white shadow-xs active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Continue on WhatsApp ({idCardsQty} Cards • ₹{idCardsTotal})</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* CERTIFICATES MODULE */}
            <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs hover:border-slate-300 transition-all">
              <div className="flex items-center gap-3.5 mb-6">
                <div className="w-10 h-10 rounded-2xl bg-cyan-50 border border-cyan-100 flex items-center justify-center text-cyan-600 shrink-0">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-['Outfit'] font-bold text-xl text-[#0F172A]">
                    Institutional Certificates
                  </h3>
                  <p className="text-xs text-slate-500">
                    Graduation, course completion, merit awards & event certificates.
                  </p>
                </div>
              </div>

              <div className="mb-5 p-3.5 rounded-2xl bg-[#F8FAFC] border border-slate-200/90 flex items-center justify-between gap-4">
                <div className="text-xs text-slate-700">
                  <span className="font-bold text-[#0F172A]">One-time Master Layout Fee:</span> ₹{baseDesignFee}
                </div>
                <label className="inline-flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={includeCertDesign}
                    onChange={(e) => setIncludeCertDesign(e.target.checked)}
                    className="w-4 h-4 rounded text-[#2563EB] focus:ring-[#2563EB] border-slate-300"
                  />
                  <span className="text-xs font-semibold text-slate-700">Include Design Fee</span>
                </label>
              </div>

              {/* Volume Tiers Shortcuts */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-6">
                {(certificatesConfig?.tiers || []).map((tier) => {
                  const isTierActive = certTier.tierLabel === tier.rangeLabel;
                  return (
                    <button
                      key={tier.rangeLabel}
                      type="button"
                      onClick={() => setCertsQty(tier.min)}
                      className={`p-2.5 rounded-xl text-center border transition-all cursor-pointer ${
                        isTierActive
                          ? 'bg-[#2563EB] border-[#2563EB] text-white shadow-xs'
                          : 'bg-[#F8FAFC] border-slate-200 hover:border-slate-300 hover:bg-slate-100/60 text-slate-700'
                      }`}
                    >
                      <div className={`text-[10px] font-bold tracking-wider uppercase ${isTierActive ? 'text-blue-100' : 'text-slate-500'}`}>
                        {tier.rangeLabel}
                      </div>
                      <div className={`font-['Outfit'] font-extrabold text-sm mt-0.5 ${isTierActive ? 'text-white' : 'text-[#0F172A]'}`}>
                        ₹{tier.unitPrice}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Quantity Selector & Price */}
              <div className="bg-[#F8FAFC] rounded-2xl border border-slate-200/90 p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
                <div className="w-full sm:w-auto">
                  <label htmlFor={certsInputId} className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">
                    Enter Exact Quantity
                  </label>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleCertQtyChange(certsQty - 10)}
                      className="w-9 h-9 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 flex items-center justify-center text-slate-700 transition-colors cursor-pointer"
                      title="Decrease by 10"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <input
                      id={certsInputId}
                      type="number"
                      min={1}
                      max={5000}
                      value={certsQty}
                      onChange={(e) => handleCertQtyChange(parseInt(e.target.value, 10))}
                      className="w-24 text-center font-['Outfit'] font-extrabold text-xl text-[#0F172A] bg-white border border-slate-200 rounded-xl py-1.5 focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                    />
                    <button
                      type="button"
                      onClick={() => handleCertQtyChange(certsQty + 10)}
                      className="w-9 h-9 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 flex items-center justify-center text-slate-700 transition-colors cursor-pointer"
                      title="Increase by 10"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                
                <div className="text-right w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 sm:border-l border-slate-200 sm:pl-6">
                  <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Estimated Total</div>
                  <div className="font-['Outfit'] font-extrabold text-2xl sm:text-3xl text-[#0F172A]">
                    ₹{certsTotal.toLocaleString('en-IN')}
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">
                    {certsQty} certs × ₹{certTier.unitPrice}/cert {includeCertDesign ? `+ ₹${baseDesignFee} design` : ''}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={handleRequestCertsQuote}
                className="w-full py-3.5 px-5 rounded-xl font-bold text-xs sm:text-sm bg-[#2563EB] hover:bg-blue-700 text-white shadow-xs active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Continue on WhatsApp ({certsQty} Certs • ₹{certsTotal})</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};
