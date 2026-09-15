import React, { useState } from 'react';
import { Plus, Trash2, Check, Star, AlertCircle, ArrowUp, ArrowDown } from 'lucide-react';
import { useContent } from '../../../context/ContentContext';
import { AdminSectionHeader } from '../AdminSectionHeader';
import type { WebsitePlanConfig } from '../../../types';

export const WebsitePlansEditor: React.FC<{ onPreview: () => void }> = ({ onPreview }) => {
  const { content, saveSection, isSaving } = useContent();
  const [plans, setPlans] = useState<WebsitePlanConfig[]>(() =>
    JSON.parse(JSON.stringify(content.websitePlans))
  );
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const hasChanges = JSON.stringify(plans) !== JSON.stringify(content.websitePlans);

  const handleSave = async () => {
    try {
      setSaveStatus('idle');
      const ok = await saveSection('websitePlans', plans);
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
    setPlans(JSON.parse(JSON.stringify(content.websitePlans)));
    setSaveStatus('idle');
  };

  const handleAddFeature = (planIndex: number) => {
    const next = [...plans];
    next[planIndex].features.push('New Feature Item');
    setPlans(next);
  };

  const handleRemoveFeature = (planIndex: number, featureIndex: number) => {
    const next = [...plans];
    next[planIndex].features.splice(featureIndex, 1);
    setPlans(next);
  };

  const handleFeatureChange = (planIndex: number, featureIndex: number, value: string) => {
    const next = [...plans];
    next[planIndex].features[featureIndex] = value;
    setPlans(next);
  };

  const handleAddNewPlan = () => {
    const newPlan: WebsitePlanConfig = {
      id: `plan-${Date.now()}`,
      name: 'Custom Website Plan',
      badge: 'NEW',
      price: '₹2,499',
      priceNumber: 2499,
      currency: '₹',
      billingCycle: '/year',
      shortDescription: 'Custom website tier with tailored features.',
      features: ['Institutional Domain', 'Responsive Layout', 'WhatsApp Integration'],
      ctaLabel: 'Choose Plan',
      isPopular: false,
      isAvailable: true,
      order: plans.length + 1,
    };
    setPlans([...plans, newPlan]);
  };

  const handleDeletePlan = (index: number) => {
    if (window.confirm('Are you sure you want to delete this website plan?')) {
      const next = plans.filter((_, i) => i !== index);
      setPlans(next);
    }
  };

  const movePlan = (index: number, direction: 'up' | 'down') => {
    const target = direction === 'up' ? index - 1 : index + 1;
    if (target < 0 || target >= plans.length) return;
    const next = [...plans];
    const temp = next[index];
    next[index] = next[target];
    next[target] = temp;
    setPlans(next);
  };

  return (
    <div className="space-y-6">
      <AdminSectionHeader
        title="Website Plans & Pricing"
        description="Control pricing, features, billing cycles, popularity badges, and availability status for all website packages."
        isSaving={isSaving}
        hasChanges={hasChanges}
        saveStatus={saveStatus}
        onSave={handleSave}
        onCancel={handleCancel}
        onPreview={onPreview}
      />

      <div className="flex justify-between items-center mb-2">
        <p className="text-xs text-slate-400">
          Plans are immediately reflected in the public website comparison grid and WhatsApp enquiry builder.
        </p>
        <button
          type="button"
          onClick={handleAddNewPlan}
          className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Website Plan</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {plans.map((plan, pIdx) => (
          <div
            key={plan.id}
            className={`bg-slate-900/90 border rounded-3xl p-6 relative flex flex-col justify-between transition-all ${
              plan.isPopular
                ? 'border-blue-500/60 ring-1 ring-blue-500/30'
                : plan.isAvailable
                ? 'border-slate-800'
                : 'border-slate-800/40 opacity-75'
            }`}
          >
            <div>
              {/* Header & Controls */}
              <div className="flex items-center justify-between gap-2 pb-4 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      disabled={pIdx === 0}
                      onClick={() => movePlan(pIdx, 'up')}
                      className="p-1 rounded bg-slate-800 text-slate-400 hover:text-white disabled:opacity-30 cursor-pointer"
                    >
                      <ArrowUp className="w-3 h-3" />
                    </button>
                    <button
                      type="button"
                      disabled={pIdx === plans.length - 1}
                      onClick={() => movePlan(pIdx, 'down')}
                      className="p-1 rounded bg-slate-800 text-slate-400 hover:text-white disabled:opacity-30 cursor-pointer"
                    >
                      <ArrowDown className="w-3 h-3" />
                    </button>
                  </div>
                  <input
                    type="text"
                    value={plan.name}
                    onChange={(e) => {
                      const next = [...plans];
                      next[pIdx].name = e.target.value;
                      setPlans(next);
                    }}
                    className="bg-transparent text-white font-bold text-base font-['Outfit'] border-b border-transparent focus:border-blue-500 outline-none"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => handleDeletePlan(pIdx)}
                  className="p-1 text-slate-500 hover:text-red-400 cursor-pointer transition-colors"
                  title="Delete Plan"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Status Toggles */}
              <div className="flex flex-wrap items-center gap-3 my-4 text-xs">
                <label className="flex items-center gap-1.5 cursor-pointer text-slate-300">
                  <input
                    type="checkbox"
                    checked={plan.isAvailable}
                    onChange={(e) => {
                      const next = [...plans];
                      next[pIdx].isAvailable = e.target.checked;
                      setPlans(next);
                    }}
                    className="sr-only peer"
                  />
                  <div className="w-7 h-3.5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[1px] after:left-[1px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-emerald-600"></div>
                  <span className={plan.isAvailable ? 'text-emerald-400 font-bold' : 'text-slate-500'}>
                    {plan.isAvailable ? 'Available' : 'Unavailable'}
                  </span>
                </label>

                <label className="flex items-center gap-1.5 cursor-pointer text-slate-300">
                  <input
                    type="checkbox"
                    checked={plan.isPopular}
                    onChange={(e) => {
                      const next = [...plans];
                      next[pIdx].isPopular = e.target.checked;
                      setPlans(next);
                    }}
                    className="sr-only peer"
                  />
                  <div className="w-7 h-3.5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[1px] after:left-[1px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-blue-600"></div>
                  <span className={plan.isPopular ? 'text-blue-400 font-bold' : 'text-slate-500'}>
                    Popular Badge
                  </span>
                </label>
              </div>

              {/* Pricing row */}
              <div className="grid grid-cols-2 gap-3 mb-4 text-xs">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Display Price</label>
                  <input
                    type="text"
                    value={plan.price}
                    onChange={(e) => {
                      const next = [...plans];
                      next[pIdx].price = e.target.value;
                      const num = parseInt(e.target.value.replace(/\D/g, ''), 10);
                      if (!isNaN(num)) next[pIdx].priceNumber = num;
                      setPlans(next);
                    }}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-emerald-400 font-bold text-sm outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Billing Cycle</label>
                  <input
                    type="text"
                    value={plan.billingCycle}
                    onChange={(e) => {
                      const next = [...plans];
                      next[pIdx].billingCycle = e.target.value;
                      setPlans(next);
                    }}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 text-sm outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Badge & CTA */}
              <div className="grid grid-cols-2 gap-3 mb-4 text-xs">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Pill Badge</label>
                  <input
                    type="text"
                    value={plan.badge}
                    onChange={(e) => {
                      const next = [...plans];
                      next[pIdx].badge = e.target.value;
                      setPlans(next);
                    }}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Button CTA</label>
                  <input
                    type="text"
                    value={plan.ctaLabel}
                    onChange={(e) => {
                      const next = [...plans];
                      next[pIdx].ctaLabel = e.target.value;
                      setPlans(next);
                    }}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Short Description */}
              <div className="mb-4 text-xs">
                <label className="block text-slate-400 font-semibold mb-1">Short Description</label>
                <textarea
                  rows={2}
                  value={plan.shortDescription}
                  onChange={(e) => {
                    const next = [...plans];
                    next[pIdx].shortDescription = e.target.value;
                    setPlans(next);
                  }}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 outline-none focus:border-blue-500"
                />
              </div>

              {/* Unavailable Settings */}
              {!plan.isAvailable && (
                <div className="p-3 mb-4 rounded-xl bg-amber-950/30 border border-amber-800/40 text-xs space-y-2">
                  <div className="flex items-center gap-1.5 text-amber-400 font-bold">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>Unavailable Display Settings</span>
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1">Status Label</label>
                    <input
                      type="text"
                      value={plan.unavailableStatus || 'Currently Not Available'}
                      onChange={(e) => {
                        const next = [...plans];
                        next[pIdx].unavailableStatus = e.target.value;
                        setPlans(next);
                      }}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-amber-300 text-xs outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1">Notice Description</label>
                    <input
                      type="text"
                      value={plan.unavailableDescription || 'Our premium website option will be available soon.'}
                      onChange={(e) => {
                        const next = [...plans];
                        next[pIdx].unavailableDescription = e.target.value;
                        setPlans(next);
                      }}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 text-xs outline-none"
                    />
                  </div>
                </div>
              )}

              {/* Features List */}
              <div className="pt-3 border-t border-slate-800">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Included Features ({plan.features.length})
                  </span>
                  <button
                    type="button"
                    onClick={() => handleAddFeature(pIdx)}
                    className="text-[11px] text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Add</span>
                  </button>
                </div>

                <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
                  {plan.features.map((feat, fIdx) => (
                    <div key={fIdx} className="flex items-center gap-1.5">
                      <Check className="w-3 h-3 text-blue-400 shrink-0" />
                      <input
                        type="text"
                        value={feat}
                        onChange={(e) => handleFeatureChange(pIdx, fIdx, e.target.value)}
                        className="flex-1 px-2 py-1 rounded bg-slate-950 border border-slate-800/80 text-[11px] text-slate-300 outline-none focus:border-blue-500"
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
    </div>
  );
};
