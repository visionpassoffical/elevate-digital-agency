import React, { useState } from 'react';
import { Plus, Trash2, ArrowUp, ArrowDown, Check, Sparkles } from 'lucide-react';
import { useContent } from '../../../context/ContentContext';
import { AdminSectionHeader } from '../AdminSectionHeader';
import type { ServiceItemConfig } from '../../../types';

export const ServicesEditor: React.FC<{ onPreview: () => void }> = ({ onPreview }) => {
  const { content, saveSection, isSaving } = useContent();
  const [services, setServices] = useState<ServiceItemConfig[]>(() =>
    JSON.parse(JSON.stringify(content.services))
  );
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const hasChanges = JSON.stringify(services) !== JSON.stringify(content.services);

  const handleSave = async () => {
    try {
      setSaveStatus('idle');
      const ok = await saveSection('services', services);
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
    setServices(JSON.parse(JSON.stringify(content.services)));
    setSaveStatus('idle');
  };

  const handleAddDeliverable = (serviceIndex: number) => {
    const next = [...services];
    next[serviceIndex].deliverables.push('New deliverable point');
    setServices(next);
  };

  const handleRemoveDeliverable = (serviceIndex: number, deliverableIndex: number) => {
    const next = [...services];
    next[serviceIndex].deliverables.splice(deliverableIndex, 1);
    setServices(next);
  };

  const handleDeliverableChange = (serviceIndex: number, deliverableIndex: number, val: string) => {
    const next = [...services];
    next[serviceIndex].deliverables[deliverableIndex] = val;
    setServices(next);
  };

  const moveService = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= services.length) return;
    const next = [...services];
    const temp = next[index];
    next[index] = next[targetIndex];
    next[targetIndex] = temp;
    setServices(next);
  };

  const handleDeleteService = (index: number) => {
    if (window.confirm('Delete this service card from homepage?')) {
      const next = services.filter((_, i) => i !== index);
      setServices(next);
    }
  };

  const handleAddNewService = () => {
    const newService: ServiceItemConfig = {
      id: `service-${Date.now()}`,
      title: 'New Service Title',
      description: 'Describe what this service offers to institutions.',
      priceBadge: 'From ₹499',
      deliverables: ['Custom design or deliverable 1', 'Direct support and revision'],
      ctaLabel: 'Enquire on WhatsApp',
      tag: 'New Solution',
      category: 'General',
      icon: 'Sparkles',
      targetSection: 'enquiry',
      enabled: true,
      order: services.length + 1,
    };
    setServices([...services, newService]);
  };

  return (
    <div className="space-y-6">
      <AdminSectionHeader
        title="Services Grid (Homepage Cards)"
        description="Edit the primary service cards displayed on the homepage, including pricing badges, deliverables, and CTA destinations."
        isSaving={isSaving}
        hasChanges={hasChanges}
        saveStatus={saveStatus}
        onSave={handleSave}
        onCancel={handleCancel}
        onPreview={onPreview}
      />

      <div className="flex justify-between items-center mb-2">
        <p className="text-xs text-slate-400">
          Showing {services.length} services. Toggle switch controls whether a service is visible on the live site.
        </p>
        <button
          type="button"
          onClick={handleAddNewService}
          className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Service</span>
        </button>
      </div>

      <div className="space-y-4">
        {services.map((item, idx) => (
          <div
            key={item.id || idx}
            className={`bg-slate-900/80 border rounded-2xl p-5 sm:p-6 transition-all ${
              item.enabled ? 'border-slate-800' : 'border-slate-800/40 opacity-60'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-md bg-slate-800 text-slate-400 text-xs font-mono flex items-center justify-center font-bold">
                  {idx + 1}
                </span>
                <input
                  type="text"
                  value={item.title}
                  onChange={(e) => {
                    const next = [...services];
                    next[idx].title = e.target.value;
                    setServices(next);
                  }}
                  className="bg-transparent text-white font-bold text-base font-['Outfit'] border-b border-transparent focus:border-blue-500 outline-none px-1"
                />
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    disabled={idx === 0}
                    onClick={() => moveService(idx, 'up')}
                    className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-slate-300 cursor-pointer"
                    title="Move up"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    disabled={idx === services.length - 1}
                    onClick={() => moveService(idx, 'down')}
                    className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-slate-300 cursor-pointer"
                    title="Move down"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                </div>

                <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
                  <input
                    type="checkbox"
                    checked={item.enabled}
                    onChange={(e) => {
                      const next = [...services];
                      next[idx].enabled = e.target.checked;
                      setServices(next);
                    }}
                    className="sr-only peer"
                  />
                  <div className="w-8 h-4 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-blue-600"></div>
                  <span>{item.enabled ? 'Visible' : 'Hidden'}</span>
                </label>

                <button
                  type="button"
                  onClick={() => handleDeleteService(idx)}
                  className="p-1.5 rounded-lg text-red-400 hover:bg-red-500/10 cursor-pointer transition-colors"
                  title="Delete service"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 text-xs">
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Price Badge Text</label>
                <input
                  type="text"
                  value={item.priceBadge}
                  onChange={(e) => {
                    const next = [...services];
                    next[idx].priceBadge = e.target.value;
                    setServices(next);
                  }}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950/80 border border-slate-800 text-emerald-400 font-bold outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">CTA Button Label</label>
                <input
                  type="text"
                  value={item.ctaLabel}
                  onChange={(e) => {
                    const next = [...services];
                    next[idx].ctaLabel = e.target.value;
                    setServices(next);
                  }}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950/80 border border-slate-800 text-white outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Tag / Pill</label>
                <input
                  type="text"
                  value={item.tag}
                  onChange={(e) => {
                    const next = [...services];
                    next[idx].tag = e.target.value;
                    setServices(next);
                  }}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950/80 border border-slate-800 text-blue-400 font-semibold outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="mt-4 text-xs">
              <label className="block text-slate-400 font-semibold mb-1">Description</label>
              <textarea
                rows={2}
                value={item.description}
                onChange={(e) => {
                  const next = [...services];
                  next[idx].description = e.target.value;
                  setServices(next);
                }}
                className="w-full px-3 py-2 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-200 outline-none focus:border-blue-500"
              />
            </div>

            {/* Deliverables */}
            <div className="mt-4 pt-3 border-t border-slate-800/60">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Deliverables Checklist
                </span>
                <button
                  type="button"
                  onClick={() => handleAddDeliverable(idx)}
                  className="text-[11px] text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3 h-3" />
                  <span>Add Deliverable</span>
                </button>
              </div>

              <div className="space-y-2">
                {item.deliverables.map((deliv, dIdx) => (
                  <div key={dIdx} className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <input
                      type="text"
                      value={deliv}
                      onChange={(e) => handleDeliverableChange(idx, dIdx, e.target.value)}
                      className="flex-1 px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 outline-none focus:border-blue-500"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveDeliverable(idx, dIdx)}
                      className="text-slate-500 hover:text-red-400 p-1 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
