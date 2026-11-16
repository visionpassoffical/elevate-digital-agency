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
  embedded?: boolean;
}

export const BulkServicesSection: React.FC<BulkServicesSectionProps> = ({
  onSelectBulkQuote,
  embedded = false,
}) => {
  const { content, openWhatsAppMessage, formatWhatsAppTemplate } = useContent();
  const idCardsInputId = useId();
  const certsInputId = useId();

  const idCardsConfig = content.bulkPricing?.idCards;
  const certificatesConfig = content.bulkPricing?.certificates;

  const [idCardsQty, setIdCardsQty] = useState<number>(50);
  const [certsQty, setCertsQty] = useState<number>(50);
  const [includeCertDesign, setIncludeCertDesign] = useState<boolean>(true);

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

  const innerContent = (
    <div id="bulk" className="scroll-mt-24 pt-2">
      {!embedded && (
        <div className="max-w-3xl mb-8">
          <h2 className="font-['Outfit'] font-extrabold text-2xl sm:text-3xl text-[#0F172A] tracking-tight">
            Volume ID Cards &amp; Certificates
          </h2>
          <p className="mt-1.5 text-sm text-slate-600">
            Tiered volume pricing — pick your quantity below for instant calculation.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6 items-stretch">
        {/* ID CARDS MODULE */}
        <div className="bg-white rounded-2xl p-6 sm:p-7 shadow-[0_10px_30px_-10px_rgba(15,23,42,0.08)] flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-[#F4F6FB] flex items-center justify-center text-[#2563EB] shrink-0">
                <CreditCard className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-['Outfit'] font-bold text-lg text-[#0F172A]">
                  Student &amp; Staff ID Cards
                </h3>
                <p className="text-xs text-slate-500">
                  High-definition PVC cards &amp; custom student layouts
                </p>
              </div>
            </div>

            {/* Volume Tiers Shortcuts */}
            <div className="grid grid-cols-3 gap-2 mb-5">
              {(idCardsConfig?.tiers || []).map((tier) => {
                const isTierActive = idCardTier.tierLabel === tier.rangeLabel;
                return (
                  <button
                    key={tier.rangeLabel}
                    type="button"
                    onClick={() => setIdCardsQty(tier.min)}
                    className={`p-2.5 rounded-xl text-center transition-all cursor-pointer ${
                      isTierActive
                        ? 'bg-[#0F172A] text-white shadow-sm'
                        : 'bg-[#F4F6FB] hover:bg-slate-200/70 text-slate-700'
                    }`}
                  >
                    <div
                      className={`text-[10px] font-bold tracking-wider uppercase ${
                        isTierActive ? 'text-blue-300' : 'text-slate-500'
                      }`}
                    >
                      {tier.rangeLabel} cards
                    </div>
                    <div
                      className={`font-['Outfit'] font-extrabold text-sm mt-0.5 tabular-nums ${
                        isTierActive ? 'text-white' : 'text-[#0F172A]'
                      }`}
                    >
                      ₹{tier.unitPrice}/card
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Quantity Selector & Price */}
            <div className="bg-[#F4F6FB] rounded-xl p-4 flex items-center justify-between gap-3 mb-5">
              <div>
                <label
                  htmlFor={idCardsInputId}
                  className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5"
                >
                  Quantity
                </label>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleIdQtyChange(idCardsQty - 10)}
                    className="w-8 h-8 rounded-lg bg-white hover:bg-slate-50 flex items-center justify-center text-slate-700 shadow-2xs transition-colors cursor-pointer"
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
                    className="w-20 text-center font-['Outfit'] font-extrabold text-base text-[#0F172A] bg-white rounded-lg py-1 shadow-2xs focus:outline-none focus:ring-2 focus:ring-[#2563EB] tabular-nums"
                  />
                  <button
                    type="button"
                    onClick={() => handleIdQtyChange(idCardsQty + 10)}
                    className="w-8 h-8 rounded-lg bg-white hover:bg-slate-50 flex items-center justify-center text-slate-700 shadow-2xs transition-colors cursor-pointer"
                    title="Increase by 10"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="text-right">
                <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                  Total
                </div>
                <div className="font-['Outfit'] font-extrabold text-2xl text-[#0F172A] tabular-nums">
                  ₹{idCardsTotal.toLocaleString('en-IN')}
                </div>
                <div className="text-[11px] text-slate-500 tabular-nums">
                  {idCardsQty} × ₹{idCardTier.unitPrice}
                </div>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleRequestIdCardsQuote}
            className="w-full py-3.5 px-4 rounded-xl font-bold text-xs bg-[#2563EB] hover:bg-[#1D4ED8] text-white active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>
              Order {idCardsQty} ID Cards (₹{idCardsTotal.toLocaleString('en-IN')})
            </span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* CERTIFICATES MODULE */}
        <div className="bg-white rounded-2xl p-6 sm:p-7 shadow-[0_10px_30px_-10px_rgba(15,23,42,0.08)] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-3 mb-5 flex-wrap">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#F4F6FB] flex items-center justify-center text-[#2563EB] shrink-0">
                  <Award className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-['Outfit'] font-bold text-lg text-[#0F172A]">
                    Institutional Certificates
                  </h3>
                  <p className="text-xs text-slate-500">
                    Merit, graduation &amp; event certificates
                  </p>
                </div>
              </div>

              <label className="inline-flex items-center gap-1.5 cursor-pointer select-none bg-[#F4F6FB] px-3 py-1.5 rounded-lg shrink-0">
                <input
                  type="checkbox"
                  checked={includeCertDesign}
                  onChange={(e) => setIncludeCertDesign(e.target.checked)}
                  className="w-3.5 h-3.5 rounded text-[#2563EB] focus:ring-[#2563EB] border-slate-300"
                />
                <span className="text-[11px] font-semibold text-slate-700">
                  +₹{baseDesignFee} Design
                </span>
              </label>
            </div>

            {/* Volume Tiers Shortcuts */}
            <div className="grid grid-cols-3 gap-2 mb-5">
              {(certificatesConfig?.tiers || []).map((tier) => {
                const isTierActive = certTier.tierLabel === tier.rangeLabel;
                return (
                  <button
                    key={tier.rangeLabel}
                    type="button"
                    onClick={() => setCertsQty(tier.min)}
                    className={`p-2.5 rounded-xl text-center transition-all cursor-pointer ${
                      isTierActive
                        ? 'bg-[#0F172A] text-white shadow-sm'
                        : 'bg-[#F4F6FB] hover:bg-slate-200/70 text-slate-700'
                    }`}
                  >
                    <div
                      className={`text-[10px] font-bold tracking-wider uppercase ${
                        isTierActive ? 'text-blue-300' : 'text-slate-500'
                      }`}
                    >
                      {tier.rangeLabel} certs
                    </div>
                    <div
                      className={`font-['Outfit'] font-extrabold text-sm mt-0.5 tabular-nums ${
                        isTierActive ? 'text-white' : 'text-[#0F172A]'
                      }`}
                    >
                      ₹{tier.unitPrice}/cert
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Quantity Selector & Price */}
            <div className="bg-[#F4F6FB] rounded-xl p-4 flex items-center justify-between gap-3 mb-5">
              <div>
                <label
                  htmlFor={certsInputId}
                  className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5"
                >
                  Quantity
                </label>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleCertQtyChange(certsQty - 10)}
                    className="w-8 h-8 rounded-lg bg-white hover:bg-slate-50 flex items-center justify-center text-slate-700 shadow-2xs transition-colors cursor-pointer"
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
                    className="w-20 text-center font-['Outfit'] font-extrabold text-base text-[#0F172A] bg-white rounded-lg py-1 shadow-2xs focus:outline-none focus:ring-2 focus:ring-[#2563EB] tabular-nums"
                  />
                  <button
                    type="button"
                    onClick={() => handleCertQtyChange(certsQty + 10)}
                    className="w-8 h-8 rounded-lg bg-white hover:bg-slate-50 flex items-center justify-center text-slate-700 shadow-2xs transition-colors cursor-pointer"
                    title="Increase by 10"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="text-right">
                <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                  Total
                </div>
                <div className="font-['Outfit'] font-extrabold text-2xl text-[#0F172A] tabular-nums">
                  ₹{certsTotal.toLocaleString('en-IN')}
                </div>
                <div className="text-[11px] text-slate-500 tabular-nums">
                  {certsQty} × ₹{certTier.unitPrice}{' '}
                  {includeCertDesign ? `+ ₹${baseDesignFee}` : ''}
                </div>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleRequestCertsQuote}
            className="w-full py-3.5 px-4 rounded-xl font-bold text-xs bg-[#2563EB] hover:bg-[#1D4ED8] text-white active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>
              Order {certsQty} Certificates (₹{certsTotal.toLocaleString('en-IN')})
            </span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );

  if (embedded) {
    return innerContent;
  }

  return (
    <section className="py-12 sm:py-16 bg-[#FFFFFF] text-[#0F172A] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {innerContent}
      </div>
    </section>
  );
};
