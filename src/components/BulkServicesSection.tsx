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
      className="py-20 sm:py-28 bg-white border-b border-slate-200 scroll-mt-20"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">
          
          {/* LEFT COLUMN: Editorial Intro */}
          <div className="sticky top-32">
            <div className="mb-10">
              <div className="inline-flex items-center gap-2 mb-6">
                <span className="w-1.5 h-1.5 bg-[#0B0F17] rounded-full" />
                <span className="text-xs font-bold tracking-widest uppercase text-[#0B0F17]">
                  BULK ORDERS
                </span>
              </div>
              <h2 className="font-['Outfit'] font-extrabold text-4xl sm:text-5xl lg:text-6xl text-[#0B0F17] tracking-tight leading-tight mb-6">
                Institutional Scale Pricing.
              </h2>
              <p className="text-lg text-slate-600 leading-relaxed max-w-md">
                Get premium quality student ID cards and certificates at transparent, volume-based pricing. The more you order, the less you pay per unit.
              </p>
            </div>
            
            <div className="bg-[#F8FAFC] border border-slate-200 rounded-2xl p-8 shadow-sm">
              <h3 className="font-bold text-[#0B0F17] mb-2">How it works</h3>
              <p className="text-sm text-slate-500 leading-relaxed mb-6">
                1. Select your desired quantity.<br/>
                2. Our system automatically applies the best volume discount.<br/>
                3. Click to continue on WhatsApp and we will guide you through data submission and delivery.
              </p>
            </div>
          </div>

          {/* RIGHT COLUMN: Interactive Modules */}
          <div className="pt-8 lg:pt-0 space-y-16">
            
            {/* ID CARDS MODULE */}
            <div className="group border-b border-slate-200 pb-12">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-[#0B0F17]">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-['Outfit'] font-bold text-2xl text-[#0B0F17]">
                    Premium ID Cards
                  </h3>
                  <p className="text-sm text-slate-500">
                    PVC cards with crisp printing and lanyards.
                  </p>
                </div>
              </div>

              {/* Volume Tiers */}
              <div className="grid grid-cols-3 gap-3 mb-8">
                {(idCardsConfig?.tiers || []).map((tier) => {
                  const isTierActive = idCardTier.tierLabel === tier.rangeLabel;
                  return (
                    <button
                      key={tier.rangeLabel}
                      type="button"
                      onClick={() => setIdCardsQty(tier.min)}
                      className={`p-4 rounded-xl text-center border transition-all cursor-pointer ${
                        isTierActive
                          ? 'bg-[#0B0F17] border-[#0B0F17] shadow-xl text-white'
                          : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <div className={`text-xs font-bold ${isTierActive ? 'text-slate-300' : 'text-slate-500'}`}>
                        {tier.rangeLabel}
                      </div>
                      <div className={`font-['Outfit'] font-extrabold text-base sm:text-lg mt-1 ${isTierActive ? 'text-white' : 'text-[#0B0F17]'}`}>
                        ₹{tier.unitPrice}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Quantity Selector */}
              <div className="bg-slate-50 rounded-xl border border-slate-200 p-6 flex flex-col sm:flex-row items-center justify-between gap-6 mb-8">
                <div className="w-full sm:w-auto">
                  <label htmlFor={idCardsInputId} className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                    Specify Quantity
                  </label>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => handleIdQtyChange(idCardsQty - 10)}
                      className="w-12 h-12 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 flex items-center justify-center text-slate-700 transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <div className="relative w-32">
                      <input
                        id={idCardsInputId}
                        type="number"
                        min={1}
                        max={5000}
                        value={idCardsQty}
                        onChange={(e) => handleIdQtyChange(parseInt(e.target.value, 10))}
                        className="w-full text-center font-['Outfit'] font-extrabold text-2xl text-[#0B0F17] bg-white border border-slate-200 rounded-lg py-2.5 focus:outline-none focus:ring-2 focus:ring-[#0B0F17]"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => handleIdQtyChange(idCardsQty + 10)}
                      className="w-12 h-12 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 flex items-center justify-center text-slate-700 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                <div className="text-right w-full sm:w-auto pt-4 sm:pt-0 border-t sm:border-t-0 sm:border-l border-slate-200 sm:pl-6">
                  <div className="text-xs text-slate-500 mb-1 font-semibold uppercase tracking-wider">Estimated Total</div>
                  <div className="font-['Outfit'] font-extrabold text-3xl text-[#0B0F17]">
                    ₹{idCardsTotal.toLocaleString('en-IN')}
                  </div>
                  <div className="text-sm text-slate-500 mt-1">
                    {idCardsQty} × ₹{idCardTier.unitPrice}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={handleRequestIdCardsQuote}
                className="w-full py-4 px-6 rounded-xl font-bold text-sm bg-white text-[#0B0F17] border border-[#0B0F17] hover:bg-[#0062EB] hover:text-white hover:border-[#0062EB] transition-colors flex items-center justify-center gap-3"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Continue on WhatsApp</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* CERTIFICATES MODULE */}
            <div>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-[#0B0F17]">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-['Outfit'] font-bold text-2xl text-[#0B0F17]">
                    Certificates
                  </h3>
                  <p className="text-sm text-slate-500">
                    Course completion, appreciation and merit certificates.
                  </p>
                </div>
              </div>

              <div className="mb-8 p-4 rounded-xl bg-white border border-slate-200 flex items-center justify-between gap-4">
                <div className="text-sm text-slate-700">
                  <span className="font-bold text-[#0B0F17]">Certificate Design:</span> ₹{baseDesignFee} (one-time)
                </div>
                <label className="inline-flex items-center gap-3 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={includeCertDesign}
                    onChange={(e) => setIncludeCertDesign(e.target.checked)}
                    className="w-4 h-4 rounded text-[#0B0F17] focus:ring-[#0B0F17] border-slate-300"
                  />
                  <span className="text-sm font-semibold text-slate-700">Include Design</span>
                </label>
              </div>

              {/* Volume Tiers */}
              <div className="grid grid-cols-3 gap-3 mb-8">
                {(certificatesConfig?.tiers || []).map((tier) => {
                  const isTierActive = certTier.tierLabel === tier.rangeLabel;
                  return (
                    <button
                      key={tier.rangeLabel}
                      type="button"
                      onClick={() => setCertsQty(tier.min)}
                      className={`p-4 rounded-xl text-center border transition-all cursor-pointer ${
                        isTierActive
                          ? 'bg-[#0B0F17] border-[#0B0F17] shadow-xl text-white'
                          : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <div className={`text-xs font-bold ${isTierActive ? 'text-slate-300' : 'text-slate-500'}`}>
                        {tier.rangeLabel}
                      </div>
                      <div className={`font-['Outfit'] font-extrabold text-base sm:text-lg mt-1 ${isTierActive ? 'text-white' : 'text-[#0B0F17]'}`}>
                        ₹{tier.unitPrice}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Quantity Selector */}
              <div className="bg-slate-50 rounded-xl border border-slate-200 p-6 flex flex-col sm:flex-row items-center justify-between gap-6 mb-8">
                <div className="w-full sm:w-auto">
                  <label htmlFor={certsInputId} className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                    Specify Quantity
                  </label>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => handleCertQtyChange(certsQty - 10)}
                      className="w-12 h-12 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 flex items-center justify-center text-slate-700 transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <div className="relative w-32">
                      <input
                        id={certsInputId}
                        type="number"
                        min={1}
                        max={5000}
                        value={certsQty}
                        onChange={(e) => handleCertQtyChange(parseInt(e.target.value, 10))}
                        className="w-full text-center font-['Outfit'] font-extrabold text-2xl text-[#0B0F17] bg-white border border-slate-200 rounded-lg py-2.5 focus:outline-none focus:ring-2 focus:ring-[#0B0F17]"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCertQtyChange(certsQty + 10)}
                      className="w-12 h-12 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 flex items-center justify-center text-slate-700 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                <div className="text-right w-full sm:w-auto pt-4 sm:pt-0 border-t sm:border-t-0 sm:border-l border-slate-200 sm:pl-6">
                  <div className="text-xs text-slate-500 mb-1 font-semibold uppercase tracking-wider">Estimated Total</div>
                  <div className="font-['Outfit'] font-extrabold text-3xl text-[#0B0F17]">
                    ₹{certsTotal.toLocaleString('en-IN')}
                  </div>
                  <div className="text-sm text-slate-500 mt-1">
                    {certsQty} × ₹{certTier.unitPrice} {includeCertDesign ? `+ ₹${baseDesignFee}` : ''}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={handleRequestCertsQuote}
                className="w-full py-4 px-6 rounded-xl font-bold text-sm bg-white text-[#0B0F17] border border-[#0B0F17] hover:bg-[#0062EB] hover:text-white hover:border-[#0062EB] transition-colors flex items-center justify-center gap-3"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Continue on WhatsApp</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};
