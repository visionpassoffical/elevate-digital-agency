import React, { useState } from 'react';
import { Plus, Trash2, Check, Package, Layers } from 'lucide-react';
import { useContent } from '../../../context/ContentContext';
import { AdminSectionHeader } from '../AdminSectionHeader';
import type { AdmissionServicesConfig } from '../../../types';

export const AdmissionServicesEditor: React.FC<{ onPreview: () => void }> = ({ onPreview }) => {
  const { content, saveSection, isSaving } = useContent();
  const [data, setData] = useState<AdmissionServicesConfig>(() =>
    JSON.parse(JSON.stringify(content.admissionServices))
  );
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const hasChanges = JSON.stringify(data) !== JSON.stringify(content.admissionServices);

  const handleSave = async () => {
    try {
      setSaveStatus('idle');
      const ok = await saveSection('admissionServices', data);
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
    setData(JSON.parse(JSON.stringify(content.admissionServices)));
    setSaveStatus('idle');
  };

  const handleAddInclude = () => {
    setData({
      ...data,
      package: {
        ...data.package,
        includes: [...data.package.includes, 'New package inclusion'],
      },
    });
  };

  const handleRemoveInclude = (idx: number) => {
    const next = [...data.package.includes];
    next.splice(idx, 1);
    setData({
      ...data,
      package: {
        ...data.package,
        includes: next,
      },
    });
  };

  const handleIncludeChange = (idx: number, val: string) => {
    const next = [...data.package.includes];
    next[idx] = val;
    setData({
      ...data,
      package: {
        ...data.package,
        includes: next,
      },
    });
  };

  const handleAddIndividualService = () => {
    const newService = {
      id: `admission-service-${Date.now()}`,
      name: 'New Admission Deliverable',
      price: 149,
      currency: '₹',
      unit: 'service',
      description: 'Describe this institutional admission deliverable.',
      isAvailable: true,
      order: data.individual.length + 1,
    };
    setData({
      ...data,
      individual: [...data.individual, newService],
    });
  };

  const handleDeleteIndividual = (idx: number) => {
    if (window.confirm('Delete this individual admission service?')) {
      const next = data.individual.filter((_, i) => i !== idx);
      setData({ ...data, individual: next });
    }
  };

  return (
    <div className="space-y-6">
      <AdminSectionHeader
        title="Admission Suite Services & Pricing"
        description="Configure package rates, included deliverables, and a la carte pricing for posters, admission forms, and ID cards."
        isSaving={isSaving}
        hasChanges={hasChanges}
        saveStatus={saveStatus}
        onSave={handleSave}
        onCancel={handleCancel}
        onPreview={onPreview}
      />

      {/* Complete Admission Package Card */}
      <div className="bg-slate-900/90 border border-emerald-500/30 rounded-3xl p-6 relative overflow-hidden shadow-xl">
        <div className="flex items-center gap-2 mb-4">
          <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Package className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold font-['Outfit'] text-white">
              Complete Admission Package
            </h3>
            <p className="text-xs text-slate-400">
              The flagship discounted bundled offer shown at the top of the Admission Suite
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 text-xs">
          <div>
            <label className="block text-slate-400 font-semibold mb-1">Package Title</label>
            <input
              type="text"
              value={data.package.name}
              onChange={(e) =>
                setData({
                  ...data,
                  package: { ...data.package, name: e.target.value },
                })
              }
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-semibold outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-slate-400 font-semibold mb-1">Package Price (₹)</label>
            <input
              type="number"
              value={data.package.price}
              onChange={(e) =>
                setData({
                  ...data,
                  package: { ...data.package, price: Number(e.target.value) || 0 },
                })
              }
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-emerald-400 font-bold text-sm outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-slate-400 font-semibold mb-1">Availability</label>
            <div className="pt-2">
              <label className="inline-flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={data.package.isAvailable}
                  onChange={(e) =>
                    setData({
                      ...data,
                      package: { ...data.package, isAvailable: e.target.checked },
                    })
                  }
                  className="sr-only peer"
                />
                <div className="w-8 h-4 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-emerald-600"></div>
                <span className="text-slate-300 text-xs font-semibold">
                  {data.package.isAvailable ? 'Available Live' : 'Disabled'}
                </span>
              </label>
            </div>
          </div>
        </div>

        <div className="mb-4 text-xs">
          <label className="block text-slate-400 font-semibold mb-1">Package Subtitle / Description</label>
          <textarea
            rows={2}
            value={data.package.description}
            onChange={(e) =>
              setData({
                ...data,
                package: { ...data.package, description: e.target.value },
              })
            }
            className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 outline-none focus:border-emerald-500"
          />
        </div>

        {/* Package Inclusions */}
        <div className="pt-3 border-t border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Package Inclusions Checklist
            </span>
            <button
              type="button"
              onClick={handleAddInclude}
              className="text-[11px] text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3 h-3" />
              <span>Add Inclusion</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {data.package.includes.map((inc, iIdx) => (
              <div key={iIdx} className="flex items-center gap-2 bg-slate-950 p-2 rounded-xl border border-slate-800">
                <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <input
                  type="text"
                  value={inc}
                  onChange={(e) => handleIncludeChange(iIdx, e.target.value)}
                  className="flex-1 bg-transparent text-xs text-slate-200 outline-none"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveInclude(iIdx)}
                  className="text-slate-500 hover:text-red-400 p-1 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Individual Services Section */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold font-['Outfit'] text-white">
                Individual Admission Services (A La Carte)
              </h3>
              <p className="text-xs text-slate-400">
                Standalone deliverables that clients can select individually or mix-and-match
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleAddIndividualService}
            className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Service</span>
          </button>
        </div>

        <div className="space-y-3">
          {data.individual.map((service, sIdx) => (
            <div
              key={service.id || sIdx}
              className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs"
            >
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    value={service.name}
                    onChange={(e) => {
                      const next = [...data.individual];
                      next[sIdx].name = e.target.value;
                      setData({ ...data, individual: next });
                    }}
                    className="font-bold text-white text-sm bg-transparent border-b border-transparent focus:border-blue-500 outline-none"
                  />
                  <label className="inline-flex items-center gap-1 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={service.isAvailable}
                      onChange={(e) => {
                        const next = [...data.individual];
                        next[sIdx].isAvailable = e.target.checked;
                        setData({ ...data, individual: next });
                      }}
                      className="sr-only peer"
                    />
                    <div className="w-7 h-3.5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[1px] after:left-[1px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-emerald-600"></div>
                    <span className="text-[11px] text-slate-400">
                      {service.isAvailable ? 'Active' : 'Disabled'}
                    </span>
                  </label>
                </div>

                <input
                  type="text"
                  value={service.description}
                  onChange={(e) => {
                    const next = [...data.individual];
                    next[sIdx].description = e.target.value;
                    setData({ ...data, individual: next });
                  }}
                  className="w-full text-slate-400 bg-transparent border-b border-transparent focus:border-blue-500 outline-none text-xs"
                />
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <div>
                  <label className="block text-slate-500 text-[10px] uppercase font-semibold">
                    Price (₹)
                  </label>
                  <input
                    type="number"
                    value={service.price}
                    onChange={(e) => {
                      const next = [...data.individual];
                      next[sIdx].price = Number(e.target.value) || 0;
                      setData({ ...data, individual: next });
                    }}
                    className="w-24 px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-emerald-400 font-bold text-sm outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-500 text-[10px] uppercase font-semibold">
                    Unit
                  </label>
                  <input
                    type="text"
                    value={service.unit}
                    onChange={(e) => {
                      const next = [...data.individual];
                      next[sIdx].unit = e.target.value;
                      setData({ ...data, individual: next });
                    }}
                    className="w-20 px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 text-xs outline-none focus:border-blue-500"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => handleDeleteIndividual(sIdx)}
                  className="p-2 text-slate-500 hover:text-red-400 rounded-lg hover:bg-red-500/10 transition-colors cursor-pointer self-end"
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
