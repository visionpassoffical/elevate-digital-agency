import React, { useState } from 'react';
import { Plus, Trash2, Check, Palette, Sparkles, ArrowUp, ArrowDown } from 'lucide-react';
import { useContent } from '../../../context/ContentContext';
import { AdminSectionHeader } from '../AdminSectionHeader';
import type { MonthlyCreativesConfig, MonthlyCreativePlanConfig } from '../../../types';

export const MonthlyPlansEditor: React.FC<{ onPreview: () => void }> = ({ onPreview }) => {
  const { content, saveSection, isSaving } = useContent();
  const [data, setData] = useState<MonthlyCreativesConfig>(() =>
    JSON.parse(JSON.stringify(content.monthlyCreativePlans))
  );
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const hasChanges = JSON.stringify(data) !== JSON.stringify(content.monthlyCreativePlans);

  const handleSave = async () => {
    try {
      setSaveStatus('idle');
      const ok = await saveSection('monthlyCreativePlans', data);
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
    setData(JSON.parse(JSON.stringify(content.monthlyCreativePlans)));
    setSaveStatus('idle');
  };

  const handleAddFeature = (pIdx: number) => {
    const next = [...data.plans];
    next[pIdx].features.push('New creative plan feature');
    setData({ ...data, plans: next });
  };

  const handleRemoveFeature = (pIdx: number, fIdx: number) => {
    const next = [...data.plans];
    next[pIdx].features.splice(fIdx, 1);
    setData({ ...data, plans: next });
  };

  const handleFeatureChange = (pIdx: number, fIdx: number, val: string) => {
    const next = [...data.plans];
    next[pIdx].features[fIdx] = val;
    setData({ ...data, plans: next });
  };

  const handleAddPlan = () => {
    const newPlan: MonthlyCreativePlanConfig = {
      id: `monthly-plan-${Date.now()}`,
      name: 'Custom Creative Retainer',
      price: 1999,
      currency: '₹',
      billingCycle: '/month',
      creativesCount: 20,
      creativesCountLabel: '20 creatives',
      description: 'Expanded creative design retainer for active institutions.',
      badge: 'ENTERPRISE',
      isPopular: false,
      isAvailable: true,
      ctaLabel: 'Choose Enterprise',
      features: ['20 custom creatives/mo', 'Priority delivery', 'WhatsApp coordination'],
      order: data.plans.length + 1,
    };
    setData({ ...data, plans: [...data.plans, newPlan] });
  };

  const handleDeletePlan = (idx: number) => {
    if (window.confirm('Delete this monthly creative plan?')) {
      const next = data.plans.filter((_, i) => i !== idx);
      setData({ ...data, plans: next });
    }
  };

  const handleAddCreativeType = () => {
    const label = window.prompt('Enter new creative deliverable type (e.g., Annual Day Invitation):');
    if (label && label.trim()) {
      const newType = {
        id: `type-${Date.now()}`,
        label: label.trim(),
        category: 'Custom',
      };
      setData({
        ...data,
        creativeTypes: [...data.creativeTypes, newType],
      });
    }
  };

  const handleDeleteCreativeType = (idx: number) => {
    const next = [...data.creativeTypes];
    next.splice(idx, 1);
    setData({ ...data, creativeTypes: next });
  };

  return (
    <div className="space-y-6">
      <AdminSectionHeader
        title="Monthly Creative Retainer Plans"
        description="Configure monthly graphic design packages, design quotas (5, 10, 15 creatives), pricing, and eligible deliverable categories."
        isSaving={isSaving}
        hasChanges={hasChanges}
        saveStatus={saveStatus}
        onSave={handleSave}
        onCancel={handleCancel}
        onPreview={onPreview}
      />

      <div className="flex justify-between items-center mb-2">
        <p className="text-xs text-slate-400">
          Monthly plans provide institutions with a predictable ongoing creative pipeline for circulars, posters, and notices.
        </p>
        <button
          type="button"
          onClick={handleAddPlan}
          className="px-3.5 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-sm"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add New Monthly Plan</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {data.plans.map((plan, pIdx) => (
          <div
            key={plan.id}
            className={`bg-slate-900/90 border rounded-3xl p-6 relative flex flex-col justify-between transition-all ${
              plan.isPopular
                ? 'border-amber-500/60 ring-1 ring-amber-500/30'
                : 'border-slate-800'
            }`}
          >
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <input
                  type="text"
                  value={plan.name}
                  onChange={(e) => {
                    const next = [...data.plans];
                    next[pIdx].name = e.target.value;
                    setData({ ...data, plans: next });
                  }}
                  className="font-bold text-white text-base font-['Outfit'] bg-transparent border-b border-transparent focus:border-amber-500 outline-none"
                />
                <button
                  type="button"
                  onClick={() => handleDeletePlan(pIdx)}
                  className="p-1 text-slate-500 hover:text-red-400 cursor-pointer"
                  title="Delete Plan"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Status Toggles */}
              <div className="flex items-center gap-4 my-3 text-xs">
                <label className="flex items-center gap-1.5 cursor-pointer text-slate-300">
                  <input
                    type="checkbox"
                    checked={plan.isPopular}
                    onChange={(e) => {
                      const next = [...data.plans];
                      next[pIdx].isPopular = e.target.checked;
                      setData({ ...data, plans: next });
                    }}
                    className="sr-only peer"
                  />
                  <div className="w-7 h-3.5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[1px] after:left-[1px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-amber-600"></div>
                  <span className={plan.isPopular ? 'text-amber-400 font-bold' : 'text-slate-500'}>
                    Popular Tag
                  </span>
                </label>
              </div>

              {/* Pricing & Quota */}
              <div className="grid grid-cols-2 gap-3 mb-4 text-xs">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Monthly Fee (₹)</label>
                  <input
                    type="number"
                    value={plan.price}
                    onChange={(e) => {
                      const next = [...data.plans];
                      next[pIdx].price = Number(e.target.value) || 0;
                      setData({ ...data, plans: next });
                    }}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-amber-400 font-bold text-sm outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Creatives Count</label>
                  <input
                    type="number"
                    value={plan.creativesCount}
                    onChange={(e) => {
                      const next = [...data.plans];
                      const val = Number(e.target.value) || 0;
                      next[pIdx].creativesCount = val;
                      next[pIdx].creativesCountLabel = `${val} creatives`;
                      setData({ ...data, plans: next });
                    }}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Badge & CTA */}
              <div className="grid grid-cols-2 gap-3 mb-4 text-xs">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Badge</label>
                  <input
                    type="text"
                    value={plan.badge}
                    onChange={(e) => {
                      const next = [...data.plans];
                      next[pIdx].badge = e.target.value;
                      setData({ ...data, plans: next });
                    }}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">CTA Button</label>
                  <input
                    type="text"
                    value={plan.ctaLabel}
                    onChange={(e) => {
                      const next = [...data.plans];
                      next[pIdx].ctaLabel = e.target.value;
                      setData({ ...data, plans: next });
                    }}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Description */}
              <div className="mb-4 text-xs">
                <label className="block text-slate-400 font-semibold mb-1">Description</label>
                <textarea
                  rows={2}
                  value={plan.description}
                  onChange={(e) => {
                    const next = [...data.plans];
                    next[pIdx].description = e.target.value;
                    setData({ ...data, plans: next });
                  }}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 outline-none focus:border-amber-500"
                />
              </div>

              {/* Features List */}
              <div className="pt-3 border-t border-slate-800">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Plan Deliverables
                  </span>
                  <button
                    type="button"
                    onClick={() => handleAddFeature(pIdx)}
                    className="text-[11px] text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Add</span>
                  </button>
                </div>

                <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                  {plan.features.map((feat, fIdx) => (
                    <div key={fIdx} className="flex items-center gap-1.5">
                      <Check className="w-3 h-3 text-amber-400 shrink-0" />
                      <input
                        type="text"
                        value={feat}
                        onChange={(e) => handleFeatureChange(pIdx, fIdx, e.target.value)}
                        className="flex-1 px-2 py-1 rounded bg-slate-950 border border-slate-800 text-[11px] text-slate-300 outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveFeature(pIdx, fIdx)}
                        className="text-slate-600 hover:text-red-400 p-0.5 cursor-pointer"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Eligible Creative Types Taxonomy */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold font-['Outfit'] text-white">
              Eligible Creative Deliverable Types ({data.creativeTypes.length})
            </h3>
            <p className="text-xs text-slate-400">
              The design formats eligible under monthly retainers shown in the service detail pills
            </p>
          </div>
          <button
            type="button"
            onClick={handleAddCreativeType}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 border border-slate-700 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Creative Type</span>
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          {data.creativeTypes.map((type, tIdx) => (
            <div
              key={type.id || tIdx}
              className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 flex items-center gap-2"
            >
              <span>{type.label}</span>
              <button
                type="button"
                onClick={() => handleDeleteCreativeType(tIdx)}
                className="text-slate-500 hover:text-red-400 cursor-pointer"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
