import React, { useState } from 'react';
import { Plus, Trash2, ArrowUp, ArrowDown, HelpCircle } from 'lucide-react';
import { useContent } from '../../../context/ContentContext';
import { AdminSectionHeader } from '../AdminSectionHeader';
import type { FaqConfig, FaqItemConfig } from '../../../types';

export const FaqEditor: React.FC<{ onPreview: () => void }> = ({ onPreview }) => {
  const { content, saveSection, isSaving } = useContent();
  const [data, setData] = useState<FaqConfig>(() => JSON.parse(JSON.stringify(content.faq)));
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const hasChanges = JSON.stringify(data) !== JSON.stringify(content.faq);

  const handleSave = async () => {
    try {
      setSaveStatus('idle');
      const ok = await saveSection('faq', data);
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
    setData(JSON.parse(JSON.stringify(content.faq)));
    setSaveStatus('idle');
  };

  const handleAddFaq = () => {
    const newFaq: FaqItemConfig = {
      id: `faq-${Date.now()}`,
      question: 'New Frequently Asked Question?',
      answer: 'Provide a clear, helpful explanation for prospective clients.',
      enabled: true,
      order: data.items.length + 1,
    };
    setData({ ...data, items: [...data.items, newFaq] });
  };

  const handleDeleteFaq = (idx: number) => {
    if (window.confirm('Delete this FAQ entry?')) {
      const next = data.items.filter((_, i) => i !== idx);
      setData({ ...data, items: next });
    }
  };

  const moveFaq = (idx: number, direction: 'up' | 'down') => {
    const target = direction === 'up' ? idx - 1 : idx + 1;
    if (target < 0 || target >= data.items.length) return;
    const next = [...data.items];
    const temp = next[idx];
    next[idx] = next[target];
    next[target] = temp;
    setData({ ...data, items: next });
  };

  return (
    <div className="space-y-6">
      <AdminSectionHeader
        title="Frequently Asked Questions (FAQ)"
        description="Manage questions and answers regarding turnaround times, pricing transparency, question paper typing, and bulk ID card policies."
        isSaving={isSaving}
        hasChanges={hasChanges}
        saveStatus={saveStatus}
        onSave={handleSave}
        onCancel={handleCancel}
        onPreview={onPreview}
      />

      {/* Header text */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6">
        <h3 className="text-base font-bold font-['Outfit'] text-white mb-4">FAQ Header Details</h3>
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

      {/* FAQ Items */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold font-['Outfit'] text-white">
              Questions & Answers ({data.items.length})
            </h3>
            <p className="text-xs text-slate-400">Order, edit, and toggle FAQ cards</p>
          </div>
          <button
            type="button"
            onClick={handleAddFaq}
            className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Question</span>
          </button>
        </div>

        <div className="space-y-4">
          {data.items.map((item, idx) => (
            <div
              key={item.id || idx}
              className={`p-5 rounded-2xl bg-slate-950/70 border text-xs space-y-3 transition-all ${
                item.enabled ? 'border-slate-800' : 'border-slate-800/40 opacity-50'
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 flex-1">
                  <span className="w-6 h-6 rounded bg-slate-900 text-blue-400 font-mono font-bold flex items-center justify-center text-[11px] shrink-0 border border-slate-800">
                    Q{idx + 1}
                  </span>
                  <input
                    type="text"
                    value={item.question}
                    onChange={(e) => {
                      const next = [...data.items];
                      next[idx].question = e.target.value;
                      setData({ ...data, items: next });
                    }}
                    className="font-bold text-white text-sm bg-transparent border-b border-transparent focus:border-blue-500 outline-none flex-1"
                    placeholder="Question heading"
                  />
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => moveFaq(idx, 'up')}
                      className="p-1 rounded bg-slate-800 text-slate-400 hover:text-white disabled:opacity-30 cursor-pointer"
                    >
                      <ArrowUp className="w-3 h-3" />
                    </button>
                    <button
                      type="button"
                      disabled={idx === data.items.length - 1}
                      onClick={() => moveFaq(idx, 'down')}
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
                        const next = [...data.items];
                        next[idx].enabled = e.target.checked;
                        setData({ ...data, items: next });
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
                    onClick={() => handleDeleteFaq(idx)}
                    className="p-1.5 text-slate-500 hover:text-red-400 cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div>
                <textarea
                  rows={3}
                  value={item.answer}
                  onChange={(e) => {
                    const next = [...data.items];
                    next[idx].answer = e.target.value;
                    setData({ ...data, items: next });
                  }}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800/80 text-slate-300 outline-none focus:border-blue-500"
                  placeholder="Answer explanation..."
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
