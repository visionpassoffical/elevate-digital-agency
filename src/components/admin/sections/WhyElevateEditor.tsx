import React, { useState } from 'react';
import { Plus, Trash2, ArrowUp, ArrowDown, ShieldCheck } from 'lucide-react';
import { useContent } from '../../../context/ContentContext';
import { AdminSectionHeader } from '../AdminSectionHeader';
import type { WhyElevateConfig, WhyElevateBenefitConfig } from '../../../types';

export const WhyElevateEditor: React.FC<{ onPreview: () => void }> = ({ onPreview }) => {
  const { content, saveSection, isSaving } = useContent();
  const [data, setData] = useState<WhyElevateConfig>(() =>
    JSON.parse(JSON.stringify(content.whyElevate))
  );
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const hasChanges = JSON.stringify(data) !== JSON.stringify(content.whyElevate);

  const handleSave = async () => {
    try {
      setSaveStatus('idle');
      const ok = await saveSection('whyElevate', data);
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
    setData(JSON.parse(JSON.stringify(content.whyElevate)));
    setSaveStatus('idle');
  };

  const handleAddBenefit = () => {
    const nextNum = String(data.benefits.length + 1).padStart(2, '0');
    const newBenefit: WhyElevateBenefitConfig = {
      id: `benefit-${Date.now()}`,
      title: 'New Value Proposition',
      description: 'Describe the key differentiator or operational advantage.',
      number: nextNum,
      icon: 'ShieldCheck',
      enabled: true,
    };
    setData({ ...data, benefits: [...data.benefits, newBenefit] });
  };

  const handleDeleteBenefit = (idx: number) => {
    if (window.confirm('Delete this benefit card?')) {
      const next = data.benefits.filter((_, i) => i !== idx);
      setData({ ...data, benefits: next });
    }
  };

  const moveBenefit = (idx: number, direction: 'up' | 'down') => {
    const target = direction === 'up' ? idx - 1 : idx + 1;
    if (target < 0 || target >= data.benefits.length) return;
    const next = [...data.benefits];
    const temp = next[idx];
    next[idx] = next[target];
    next[target] = temp;
    setData({ ...data, benefits: next });
  };

  return (
    <div className="space-y-6">
      <AdminSectionHeader
        title="Why ELEVATE (Value Pillars)"
        description="Edit the key reasons institutions choose ELEVATE, including transparent pricing, 24-48h turnaround, and WhatsApp workflow."
        isSaving={isSaving}
        hasChanges={hasChanges}
        saveStatus={saveStatus}
        onSave={handleSave}
        onCancel={handleCancel}
        onPreview={onPreview}
      />

      {/* Section Headings */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6">
        <h3 className="text-base font-bold font-['Outfit'] text-white mb-4">Section Header Content</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div>
            <label className="block text-slate-400 font-semibold mb-1">Section Badge</label>
            <input
              type="text"
              value={data.sectionBadge}
              onChange={(e) => setData({ ...data, sectionBadge: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-slate-400 font-semibold mb-1">Section Title</label>
            <input
              type="text"
              value={data.sectionTitle}
              onChange={(e) => setData({ ...data, sectionTitle: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-semibold outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-slate-400 font-semibold mb-1">Section Subtitle</label>
            <input
              type="text"
              value={data.sectionSubtitle}
              onChange={(e) => setData({ ...data, sectionSubtitle: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 outline-none focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Benefits List */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold font-['Outfit'] text-white">
              Pillars & Benefits ({data.benefits.length})
            </h3>
            <p className="text-xs text-slate-400">Pillar number, title, and explanation</p>
          </div>
          <button
            type="button"
            onClick={handleAddBenefit}
            className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Pillar</span>
          </button>
        </div>

        <div className="space-y-3">
          {data.benefits.map((item, idx) => (
            <div
              key={item.id || idx}
              className={`p-4 rounded-2xl bg-slate-950/70 border flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs transition-all ${
                item.enabled ? 'border-slate-800' : 'border-slate-800/40 opacity-50'
              }`}
            >
              <div className="flex items-center gap-3 flex-1">
                <input
                  type="text"
                  value={item.number}
                  onChange={(e) => {
                    const next = [...data.benefits];
                    next[idx].number = e.target.value;
                    setData({ ...data, benefits: next });
                  }}
                  className="w-12 text-center font-mono font-bold text-blue-400 bg-slate-900 px-2 py-1.5 rounded-lg border border-slate-800"
                />

                <div className="space-y-1.5 flex-1">
                  <input
                    type="text"
                    value={item.title}
                    onChange={(e) => {
                      const next = [...data.benefits];
                      next[idx].title = e.target.value;
                      setData({ ...data, benefits: next });
                    }}
                    className="font-bold text-white text-sm bg-transparent border-b border-transparent focus:border-blue-500 outline-none w-full"
                  />
                  <input
                    type="text"
                    value={item.description}
                    onChange={(e) => {
                      const next = [...data.benefits];
                      next[idx].description = e.target.value;
                      setData({ ...data, benefits: next });
                    }}
                    className="text-slate-400 text-xs bg-transparent border-b border-transparent focus:border-blue-500 outline-none w-full"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    disabled={idx === 0}
                    onClick={() => moveBenefit(idx, 'up')}
                    className="p-1 rounded bg-slate-800 text-slate-400 hover:text-white disabled:opacity-30 cursor-pointer"
                  >
                    <ArrowUp className="w-3 h-3" />
                  </button>
                  <button
                    type="button"
                    disabled={idx === data.benefits.length - 1}
                    onClick={() => moveBenefit(idx, 'down')}
                    className="p-1 rounded bg-slate-800 text-slate-400 hover:text-white disabled:opacity-30 cursor-pointer"
                  >
                    <ArrowDown className="w-3 h-3" />
                  </button>
                </div>

                <label className="inline-flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={item.enabled}
                    onChange={(e) => {
                      const next = [...data.benefits];
                      next[idx].enabled = e.target.checked;
                      setData({ ...data, benefits: next });
                    }}
                    className="sr-only peer"
                  />
                  <div className="w-7 h-3.5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[1px] after:left-[1px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-blue-600"></div>
                  <span className="text-slate-400 text-xs">
                    {item.enabled ? 'Active' : 'Hidden'}
                  </span>
                </label>

                <button
                  type="button"
                  onClick={() => handleDeleteBenefit(idx)}
                  className="p-1.5 text-slate-500 hover:text-red-400 cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
