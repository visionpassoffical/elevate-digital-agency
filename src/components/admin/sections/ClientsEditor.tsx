import React, { useState } from 'react';
import { Plus, Trash2, ArrowUp, ArrowDown, School, Upload, Image } from 'lucide-react';
import { useContent } from '../../../context/ContentContext';
import { AdminSectionHeader } from '../AdminSectionHeader';
import type { ClientInstitutionsConfig, ClientInstitution } from '../../../types';

export const ClientsEditor: React.FC<{ onPreview: () => void }> = ({ onPreview }) => {
  const { content, saveSection, isSaving, uploadFile } = useContent();
  const [data, setData] = useState<ClientInstitutionsConfig>(() =>
    JSON.parse(JSON.stringify(content.clientInstitutions))
  );
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [uploadingIdx, setUploadingIdx] = useState<number | null>(null);

  const hasChanges = JSON.stringify(data) !== JSON.stringify(content.clientInstitutions);

  const handleSave = async () => {
    try {
      setSaveStatus('idle');
      const ok = await saveSection('clientInstitutions', data);
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
    setData(JSON.parse(JSON.stringify(content.clientInstitutions)));
    setSaveStatus('idle');
  };

  const handleAddInstitution = () => {
    const newInst: ClientInstitution = {
      id: `client-${Date.now()}`,
      name: 'New Educational Institution',
      logo: '',
      location: 'Kerala, India',
      enabled: true,
      order: data.list.length + 1,
    };
    setData({ ...data, list: [...data.list, newInst] });
  };

  const handleDeleteInstitution = (idx: number) => {
    if (window.confirm('Delete this client institution?')) {
      const next = data.list.filter((_, i) => i !== idx);
      setData({ ...data, list: next });
    }
  };

  const moveInstitution = (idx: number, direction: 'up' | 'down') => {
    const target = direction === 'up' ? idx - 1 : idx + 1;
    if (target < 0 || target >= data.list.length) return;
    const next = [...data.list];
    const temp = next[idx];
    next[idx] = next[target];
    next[target] = temp;
    setData({ ...data, list: next });
  };

  const handleFileUpload = async (idx: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingIdx(idx);
      const res = await uploadFile(file);
      if (res?.url) {
        const next = [...data.list];
        next[idx].logo = res.url;
        setData({ ...data, list: next });
      }
    } catch (err: any) {
      alert(err.message || 'Image upload failed');
    } finally {
      setUploadingIdx(null);
    }
  };

  return (
    <div className="space-y-6">
      <AdminSectionHeader
        title="Client Institutions & Partners"
        description="Add, edit, reorder, or upload logos for partner educational institutions and schools showcased on the website."
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

      {/* Institutions List */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold font-['Outfit'] text-white">
              Institutional Partners ({data.list.length})
            </h3>
            <p className="text-xs text-slate-400">
              Control partner names, emblems, and live visibility
            </p>
          </div>
          <button
            type="button"
            onClick={handleAddInstitution}
            className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Institution</span>
          </button>
        </div>

        <div className="space-y-3">
          {data.list.map((item, idx) => (
            <div
              key={item.id || idx}
              className={`p-4 rounded-2xl bg-slate-950/70 border flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs transition-all ${
                item.enabled ? 'border-slate-800' : 'border-slate-800/40 opacity-50'
              }`}
            >
              {/* Logo preview / upload */}
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center shrink-0 overflow-hidden relative group">
                  {item.logo ? (
                    <img
                      src={item.logo}
                      alt={item.name}
                      className="w-full h-full object-contain p-1"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                  ) : (
                    <School className="w-6 h-6 text-slate-500" />
                  )}

                  <label className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition-opacity">
                    <Upload className="w-4 h-4 text-white" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload(idx, e)}
                      className="hidden"
                    />
                  </label>
                </div>

                <div className="space-y-1 flex-1">
                  <input
                    type="text"
                    value={item.name}
                    onChange={(e) => {
                      const next = [...data.list];
                      next[idx].name = e.target.value;
                      setData({ ...data, list: next });
                    }}
                    className="font-bold text-white text-sm bg-transparent border-b border-transparent focus:border-blue-500 outline-none w-full"
                    placeholder="Institution Name"
                  />
                  <input
                    type="text"
                    value={item.location || ''}
                    onChange={(e) => {
                      const next = [...data.list];
                      next[idx].location = e.target.value;
                      setData({ ...data, list: next });
                    }}
                    className="text-slate-400 text-xs bg-transparent border-b border-transparent focus:border-blue-500 outline-none w-full"
                    placeholder="Location (e.g. Malappuram, Kerala)"
                  />
                </div>
              </div>

              {/* Logo URL input or upload button */}
              <div className="flex-1 max-w-xs">
                <label className="block text-[10px] text-slate-500 uppercase font-semibold mb-1">
                  Logo Image URL or Local Upload
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={item.logo}
                    placeholder="https://... or upload"
                    onChange={(e) => {
                      const next = [...data.list];
                      next[idx].logo = e.target.value;
                      setData({ ...data, list: next });
                    }}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 text-xs outline-none"
                  />
                  <label className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white cursor-pointer flex items-center gap-1 shrink-0">
                    <Upload className="w-3.5 h-3.5" />
                    <span className="text-[11px]">Upload</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload(idx, e)}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3 shrink-0">
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    disabled={idx === 0}
                    onClick={() => moveInstitution(idx, 'up')}
                    className="p-1 rounded bg-slate-800 text-slate-400 hover:text-white disabled:opacity-30 cursor-pointer"
                  >
                    <ArrowUp className="w-3 h-3" />
                  </button>
                  <button
                    type="button"
                    disabled={idx === data.list.length - 1}
                    onClick={() => moveInstitution(idx, 'down')}
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
                      const next = [...data.list];
                      next[idx].enabled = e.target.checked;
                      setData({ ...data, list: next });
                    }}
                    className="sr-only peer"
                  />
                  <div className="w-7 h-3.5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[1px] after:left-[1px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-blue-600"></div>
                  <span className="text-slate-400 text-xs">
                    {item.enabled ? 'Visible' : 'Hidden'}
                  </span>
                </label>

                <button
                  type="button"
                  onClick={() => handleDeleteInstitution(idx)}
                  className="p-1.5 text-slate-500 hover:text-red-400 cursor-pointer"
                  title="Delete institution"
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
