import React, { useState } from 'react';
import { Plus, Trash2, CreditCard, Award } from 'lucide-react';
import { useContent } from '../../../context/ContentContext';
import { AdminSectionHeader } from '../AdminSectionHeader';
import type { BulkPricingConfig } from '../../../types';

export const BulkPricingEditor: React.FC<{ onPreview: () => void }> = ({ onPreview }) => {
  const { content, saveSection, isSaving } = useContent();
  const [data, setData] = useState<BulkPricingConfig>(() =>
    JSON.parse(JSON.stringify(content.bulkPricing))
  );
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const hasChanges = JSON.stringify(data) !== JSON.stringify(content.bulkPricing);

  const handleSave = async () => {
    try {
      setSaveStatus('idle');
      const ok = await saveSection('bulkPricing', data);
      if (ok) {
        setSaveStatus('success');
        setTimeout(() => setSaveStatus('idle'), 3500);
      } else {
        setSaveStatus('error');
      }
    } catch {
      setSaveStatus('error');
    }
  };

  const handleCancel = () => {
    setData(JSON.parse(JSON.stringify(content.bulkPricing)));
    setSaveStatus('idle');
  };

  const handleAddIdCardTier = () => {
    const next = [...data.idCards.tiers];
    const lastTier = next[next.length - 1];
    const newMin = (lastTier?.max || 100) + 1;
    next.push({
      rangeLabel: `${newMin}+`,
      min: newMin,
      max: null,
      unitPrice: 18,
    });
    setData({
      ...data,
      idCards: { ...data.idCards, tiers: next },
    });
  };

  const handleDeleteIdCardTier = (idx: number) => {
    const next = data.idCards.tiers.filter((_, i) => i !== idx);
    setData({
      ...data,
      idCards: { ...data.idCards, tiers: next },
    });
  };

  const handleAddCertTier = () => {
    const next = [...data.certificates.tiers];
    const lastTier = next[next.length - 1];
    const newMin = (lastTier?.max || 100) + 1;
    next.push({
      rangeLabel: `${newMin}+`,
      min: newMin,
      max: null,
      unitPrice: 8,
    });
    setData({
      ...data,
      certificates: { ...data.certificates, tiers: next },
    });
  };

  const handleDeleteCertTier = (idx: number) => {
    const next = data.certificates.tiers.filter((_, i) => i !== idx);
    setData({
      ...data,
      certificates: { ...data.certificates, tiers: next },
    });
  };

  return (
    <div className="space-y-6">
      <AdminSectionHeader
        title="Bulk Pricing & Volume Tier Rules"
        description="Configure tiered quantity pricing for student ID cards and institutional achievement certificates."
        isSaving={isSaving}
        hasChanges={hasChanges}
        saveStatus={saveStatus}
        onSave={handleSave}
        onCancel={handleCancel}
        onPreview={onPreview}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ID Cards Section */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 space-y-5">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold font-['Outfit'] text-white">Student ID Cards Pricing</h3>
              <p className="text-xs text-slate-400">Volume tiers for identity cards</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 text-xs">
            <div>
              <label className="block text-slate-400 mb-1">Default Qty</label>
              <input
                type="number"
                value={data.idCards.defaultQty}
                onChange={(e) =>
                  setData({
                    ...data,
                    idCards: { ...data.idCards, defaultQty: Number(e.target.value) || 1 },
                  })
                }
                className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white outline-none"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1">Min Qty</label>
              <input
                type="number"
                value={data.idCards.minQty}
                onChange={(e) =>
                  setData({
                    ...data,
                    idCards: { ...data.idCards, minQty: Number(e.target.value) || 1 },
                  })
                }
                className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white outline-none"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1">Max Qty</label>
              <input
                type="number"
                value={data.idCards.maxQty}
                onChange={(e) =>
                  setData({
                    ...data,
                    idCards: { ...data.idCards, maxQty: Number(e.target.value) || 1000 },
                  })
                }
                className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white outline-none"
              />
            </div>
          </div>

          {/* Tiers List */}
          <div className="pt-3 border-t border-slate-800">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Volume Rate Tiers
              </span>
              <button
                type="button"
                onClick={handleAddIdCardTier}
                className="text-[11px] text-purple-400 hover:text-purple-300 font-semibold flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3 h-3" />
                <span>Add Tier</span>
              </button>
            </div>

            <div className="space-y-2">
              {data.idCards.tiers.map((tier, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs"
                >
                  <div className="w-24">
                    <label className="block text-[10px] text-slate-500">Range Label</label>
                    <input
                      type="text"
                      value={tier.rangeLabel}
                      onChange={(e) => {
                        const next = [...data.idCards.tiers];
                        next[idx].rangeLabel = e.target.value;
                        setData({ ...data, idCards: { ...data.idCards, tiers: next } });
                      }}
                      className="w-full bg-transparent text-white font-semibold outline-none"
                    />
                  </div>

                  <div className="w-20">
                    <label className="block text-[10px] text-slate-500">Min Qty</label>
                    <input
                      type="number"
                      value={tier.min}
                      onChange={(e) => {
                        const next = [...data.idCards.tiers];
                        next[idx].min = Number(e.target.value) || 0;
                        setData({ ...data, idCards: { ...data.idCards, tiers: next } });
                      }}
                      className="w-full bg-transparent text-slate-300 outline-none"
                    />
                  </div>

                  <div className="w-20">
                    <label className="block text-[10px] text-slate-500">Max Qty</label>
                    <input
                      type="text"
                      value={tier.max === null ? '' : tier.max}
                      placeholder="∞"
                      onChange={(e) => {
                        const next = [...data.idCards.tiers];
                        const val = e.target.value.trim();
                        next[idx].max = val === '' ? null : Number(val);
                        setData({ ...data, idCards: { ...data.idCards, tiers: next } });
                      }}
                      className="w-full bg-transparent text-slate-300 outline-none"
                    />
                  </div>

                  <div className="flex-1">
                    <label className="block text-[10px] text-slate-500">Rate / Card (₹)</label>
                    <input
                      type="number"
                      value={tier.unitPrice}
                      onChange={(e) => {
                        const next = [...data.idCards.tiers];
                        next[idx].unitPrice = Number(e.target.value) || 0;
                        setData({ ...data, idCards: { ...data.idCards, tiers: next } });
                      }}
                      className="w-full bg-transparent text-emerald-400 font-bold outline-none"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDeleteIdCardTier(idx)}
                    className="p-1 text-slate-500 hover:text-red-400 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Certificates Section */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 space-y-5">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold font-['Outfit'] text-white">Certificates Pricing</h3>
              <p className="text-xs text-slate-400">Base design template fee + volume rates</p>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
            <div>
              <span className="font-semibold text-white">Base Certificate Design Template Fee</span>
              <p className="text-[11px] text-slate-500">Fixed one-time creation charge</p>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-slate-400 font-bold">₹</span>
              <input
                type="number"
                value={data.certificates.baseDesignFee.price}
                onChange={(e) =>
                  setData({
                    ...data,
                    certificates: {
                      ...data.certificates,
                      baseDesignFee: {
                        ...data.certificates.baseDesignFee,
                        price: Number(e.target.value) || 0,
                      },
                    },
                  })
                }
                className="w-20 px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-amber-400 font-bold text-sm outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 text-xs">
            <div>
              <label className="block text-slate-400 mb-1">Default Qty</label>
              <input
                type="number"
                value={data.certificates.defaultQty}
                onChange={(e) =>
                  setData({
                    ...data,
                    certificates: { ...data.certificates, defaultQty: Number(e.target.value) || 1 },
                  })
                }
                className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white outline-none"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1">Min Qty</label>
              <input
                type="number"
                value={data.certificates.minQty}
                onChange={(e) =>
                  setData({
                    ...data,
                    certificates: { ...data.certificates, minQty: Number(e.target.value) || 1 },
                  })
                }
                className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white outline-none"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1">Max Qty</label>
              <input
                type="number"
                value={data.certificates.maxQty}
                onChange={(e) =>
                  setData({
                    ...data,
                    certificates: { ...data.certificates, maxQty: Number(e.target.value) || 1000 },
                  })
                }
                className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white outline-none"
              />
            </div>
          </div>

          {/* Certificate Tiers List */}
          <div className="pt-3 border-t border-slate-800">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Volume Rate Tiers
              </span>
              <button
                type="button"
                onClick={handleAddCertTier}
                className="text-[11px] text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3 h-3" />
                <span>Add Tier</span>
              </button>
            </div>

            <div className="space-y-2">
              {data.certificates.tiers.map((tier, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs"
                >
                  <div className="w-24">
                    <label className="block text-[10px] text-slate-500">Range Label</label>
                    <input
                      type="text"
                      value={tier.rangeLabel}
                      onChange={(e) => {
                        const next = [...data.certificates.tiers];
                        next[idx].rangeLabel = e.target.value;
                        setData({ ...data, certificates: { ...data.certificates, tiers: next } });
                      }}
                      className="w-full bg-transparent text-white font-semibold outline-none"
                    />
                  </div>

                  <div className="w-20">
                    <label className="block text-[10px] text-slate-500">Min Qty</label>
                    <input
                      type="number"
                      value={tier.min}
                      onChange={(e) => {
                        const next = [...data.certificates.tiers];
                        next[idx].min = Number(e.target.value) || 0;
                        setData({ ...data, certificates: { ...data.certificates, tiers: next } });
                      }}
                      className="w-full bg-transparent text-slate-300 outline-none"
                    />
                  </div>

                  <div className="w-20">
                    <label className="block text-[10px] text-slate-500">Max Qty</label>
                    <input
                      type="text"
                      value={tier.max === null ? '' : tier.max}
                      placeholder="∞"
                      onChange={(e) => {
                        const next = [...data.certificates.tiers];
                        const val = e.target.value.trim();
                        next[idx].max = val === '' ? null : Number(val);
                        setData({ ...data, certificates: { ...data.certificates, tiers: next } });
                      }}
                      className="w-full bg-transparent text-slate-300 outline-none"
                    />
                  </div>

                  <div className="flex-1">
                    <label className="block text-[10px] text-slate-500">Rate / Cert (₹)</label>
                    <input
                      type="number"
                      value={tier.unitPrice}
                      onChange={(e) => {
                        const next = [...data.certificates.tiers];
                        next[idx].unitPrice = Number(e.target.value) || 0;
                        setData({ ...data, certificates: { ...data.certificates, tiers: next } });
                      }}
                      className="w-full bg-transparent text-emerald-400 font-bold outline-none"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDeleteCertTier(idx)}
                    className="p-1 text-slate-500 hover:text-red-400 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
