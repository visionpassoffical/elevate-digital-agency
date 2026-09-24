import React, { useState, useRef } from 'react';
import {
  Plus,
  Trash2,
  Upload,
  ArrowUp,
  ArrowDown,
  Eye,
  EyeOff,
  AlertCircle,
} from 'lucide-react';
import { useContent } from '../../../context/ContentContext';
import { AdminSectionHeader } from '../AdminSectionHeader';
import { saveClientInstitutions } from '../../../data/partnersData';
import { InstitutionLogoBadge } from '../../InstitutionLogoBadge';
import type { ClientInstitution } from '../../../types';

export const ClientsEditor: React.FC<{ onPreview?: () => void }> = ({ onPreview }) => {
  const { content, saveSection, uploadFile, isSaving } = useContent();

  const [data, setData] = useState(() => JSON.parse(JSON.stringify(content.clientInstitutions)));
  const [selectedFiles, setSelectedFiles] = useState<{ [key: number]: File }>({});
  const [uploadingIdx, setUploadingIdx] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const fileInputsRef = useRef<{ [key: number]: HTMLInputElement | null }>({});

  const hasChanges =
    JSON.stringify(data) !== JSON.stringify(content.clientInstitutions) ||
    Object.keys(selectedFiles).length > 0;

  const handleSave = async () => {
    try {
      setSaveStatus('idle');
      setErrorMessage('');

      // If any items have pending selected files, upload them first
      const nextList = [...data.list];
      for (const [key, selectedFile] of Object.entries(selectedFiles)) {
        const idx = Number(key);
        const file = selectedFile as File | undefined;
        if (file && nextList[idx]) {
          const safePrefix = (nextList[idx].name || 'institution')
            .toLowerCase()
            .replace(/[^a-z0-9]/g, '-');
          const ext = file.name ? file.name.split('.').pop() || 'png' : 'png';
          const filename = `${safePrefix}-logo.${ext}`;
          const res = await uploadFile(file, filename);
          if (res?.url) {
            nextList[idx] = { ...nextList[idx], logo: res.url };
          }
        }
      }

      const nextData = { ...data, list: nextList };
      setData(nextData);
      setSelectedFiles({});

      const ok = await saveSection('clientInstitutions', nextData);
      saveClientInstitutions(nextList);

      if (ok) {
        setSaveStatus('success');
        setTimeout(() => setSaveStatus('idle'), 3500);
      } else {
        setSaveStatus('error');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to save client institutions');
      setSaveStatus('error');
    }
  };

  const handleCancel = () => {
    setData(JSON.parse(JSON.stringify(content.clientInstitutions)));
    setSelectedFiles({});
    setErrorMessage('');
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
      setSelectedFiles((prev) => {
        const copy = { ...prev };
        delete copy[idx];
        return copy;
      });
    }
  };

  const moveInstitution = (idx: number, direction: 'up' | 'down') => {
    const target = direction === 'up' ? idx - 1 : idx + 1;
    if (target < 0 || target >= data.list.length) return;
    const next = [...data.list];
    const temp = next[idx];
    next[idx] = next[target];
    next[target] = temp;
    next.forEach((item, i) => {
      item.order = i + 1;
    });
    setData({ ...data, list: next });
  };

  // File Selection Handler: Validates max 3MB and allowed image types
  const handleFileSelect = (idx: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setErrorMessage('');

    // Max upload validation: 3MB
    if (file.size > 3 * 1024 * 1024) {
      setErrorMessage(`"${file.name}" exceeds 3MB. Please choose an image under 3MB.`);
      return;
    }

    const validExtensions = ['.png', '.jpg', '.jpeg', '.webp', '.svg'];
    const lowerName = file.name.toLowerCase();
    const hasValidExt = validExtensions.some((ext) => lowerName.endsWith(ext));
    const hasValidMime =
      file.type.startsWith('image/png') ||
      file.type.startsWith('image/jpeg') ||
      file.type.startsWith('image/jpg') ||
      file.type.startsWith('image/webp') ||
      file.type.startsWith('image/svg+xml');

    if (!hasValidExt && !hasValidMime) {
      setErrorMessage('Invalid image format. Allowed: PNG, JPG, WEBP, SVG');
      return;
    }

    // Store selected File object
    setSelectedFiles((prev) => ({ ...prev, [idx]: file }));

    // Immediate preview via FileReader
    const reader = new FileReader();
    reader.onload = (ev) => {
      const result = ev.target?.result as string;
      if (result) {
        const nextList = [...data.list];
        nextList[idx] = { ...nextList[idx], logo: result };
        setData({ ...data, list: nextList });
      }
    };
    reader.readAsDataURL(file);
  };

  // Upload Button Handler: Uploads new file or keeps existing logoUrl intact
  const handleUploadClick = async (idx: number) => {
    const selectedFile = selectedFiles[idx];
    const item = data.list[idx];

    // If no new file is selected:
    if (!selectedFile) {
      if (!item?.logo || !item.logo.trim()) {
        // No file and no existing logo -> trigger picker
        fileInputsRef.current[idx]?.click();
        return;
      }
      // Existing logo already present -> keep it intact without triggering upload
      setSaveStatus('success');
      setTimeout(() => setSaveStatus('idle'), 2000);
      return;
    }

    try {
      setUploadingIdx(idx);
      setErrorMessage('');
      const safePrefix = (item.name || 'institution')
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '-');
      const ext = selectedFile.name ? selectedFile.name.split('.').pop() || 'png' : 'png';
      const filename = `${safePrefix}-logo.${ext}`;

      const res = await uploadFile(selectedFile, filename);

      if (res?.url) {
        const nextList = data.list.map((it, i) =>
          i === idx ? { ...it, logo: res.url } : it
        );
        const nextData = { ...data, list: nextList };
        setData(nextData);

        // Clear uploaded file from selection state
        setSelectedFiles((prev) => {
          const copy = { ...prev };
          delete copy[idx];
          return copy;
        });

        // Persist immediately to backend & local storage
        await saveSection('clientInstitutions', nextData);
        saveClientInstitutions(nextList);
        setSaveStatus('success');
        setTimeout(() => setSaveStatus('idle'), 3500);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Image upload failed');
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

      {errorMessage && (
        <div className="p-4 rounded-2xl bg-red-950/40 border border-red-800 text-red-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Section Headings */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6">
        <h3 className="text-base font-bold font-['Outfit'] text-white mb-4">
          Section Header Content
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div>
            <label className="block text-slate-400 font-semibold mb-1">Section Badge</label>
            <input
              type="text"
              value={data.sectionBadge || ''}
              onChange={(e) => setData({ ...data, sectionBadge: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-slate-400 font-semibold mb-1">Section Title</label>
            <input
              type="text"
              value={data.sectionTitle || ''}
              onChange={(e) => setData({ ...data, sectionTitle: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-semibold outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-slate-400 font-semibold mb-1">Section Subtitle</label>
            <input
              type="text"
              value={data.sectionSubtitle || ''}
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
              Edit institution name, location, and emblem without breaking on file re-selection
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
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <div className="relative group shrink-0">
                  <InstitutionLogoBadge
                    name={item.name}
                    logo={item.logo}
                    size="lg"
                  />

                  <button
                    type="button"
                    onClick={() => fileInputsRef.current[idx]?.click()}
                    className="absolute inset-0 bg-black/65 rounded-xl opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition-opacity"
                    disabled={uploadingIdx === idx}
                    title="Choose new logo from device (Max 3MB)"
                  >
                    <Upload className="w-4 h-4 text-white pointer-events-none" />
                  </button>
                </div>

                <div className="space-y-1.5 flex-1 min-w-0">
                  <input
                    type="text"
                    value={item.name}
                    onChange={(e) => {
                      const next = [...data.list];
                      next[idx].name = e.target.value;
                      setData({ ...data, list: next });
                    }}
                    className="font-bold text-white text-sm bg-slate-900/60 hover:bg-slate-900 px-2 py-1 rounded-lg border border-transparent focus:border-blue-500 outline-none w-full"
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
                    className="text-slate-400 text-xs bg-slate-900/40 hover:bg-slate-900 px-2 py-0.5 rounded-lg border border-transparent focus:border-blue-500 outline-none w-full"
                    placeholder="Location (e.g. Malappuram, Kerala)"
                  />
                </div>
              </div>

              {/* Logo URL input or upload button */}
              <div className="flex-1 max-w-sm">
                <label className="block text-[10px] text-slate-500 uppercase font-semibold mb-1">
                  Logo Image (URL or Device Upload)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={item.logo || ''}
                    placeholder="https://... or upload file"
                    onChange={(e) => {
                      const next = [...data.list];
                      next[idx].logo = e.target.value;
                      setData({ ...data, list: next });
                    }}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 text-xs outline-none focus:border-blue-500"
                  />
                  <input
                    type="file"
                    ref={(el) => {
                      fileInputsRef.current[idx] = el;
                    }}
                    accept="image/png,image/jpeg,image/jpg,image/webp,image/svg+xml"
                    onChange={(e) => handleFileSelect(idx, e)}
                    className="hidden"
                    disabled={uploadingIdx === idx}
                  />
                  <button
                    type="button"
                    onClick={() => handleUploadClick(idx)}
                    disabled={uploadingIdx === idx}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer flex items-center gap-1 shrink-0 transition-colors disabled:opacity-50 ${
                      selectedFiles[idx]
                        ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-sm'
                        : 'bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white'
                    }`}
                    title={
                      selectedFiles[idx]
                        ? `Upload ${selectedFiles[idx].name}`
                        : item.logo
                        ? 'Keep existing logo or choose new'
                        : 'Choose and upload file'
                    }
                  >
                    <Upload className="w-3.5 h-3.5 pointer-events-none" />
                    <span className="text-[11px] pointer-events-none">
                      {uploadingIdx === idx
                        ? 'Uploading...'
                        : selectedFiles[idx]
                        ? 'Upload'
                        : 'Browse'}
                    </span>
                  </button>
                </div>
                {selectedFiles[idx] && (
                  <div className="text-[10px] text-blue-400 mt-1 flex items-center justify-between">
                    <span className="truncate max-w-[180px]">
                      Selected: {selectedFiles[idx].name}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedFiles((prev) => {
                          const copy = { ...prev };
                          delete copy[idx];
                          return copy;
                        });
                      }}
                      className="text-slate-500 hover:text-red-400 ml-1 cursor-pointer"
                    >
                      Clear
                    </button>
                  </div>
                )}
              </div>

              {/* Actions: Reorder, Visibility, Delete */}
              <div className="flex items-center gap-1.5 shrink-0 self-end md:self-auto">
                <button
                  type="button"
                  onClick={() => moveInstitution(idx, 'up')}
                  disabled={idx === 0}
                  className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white disabled:opacity-30 cursor-pointer"
                  title="Move Up"
                >
                  <ArrowUp className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => moveInstitution(idx, 'down')}
                  disabled={idx === data.list.length - 1}
                  className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white disabled:opacity-30 cursor-pointer"
                  title="Move Down"
                >
                  <ArrowDown className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const next = [...data.list];
                    next[idx].enabled = !next[idx].enabled;
                    setData({ ...data, list: next });
                  }}
                  className={`p-1.5 rounded-lg border text-xs font-semibold cursor-pointer ${
                    item.enabled
                      ? 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white'
                      : 'bg-amber-950/40 border-amber-800 text-amber-300'
                  }`}
                  title={item.enabled ? 'Hide from live site' : 'Show on live site'}
                >
                  {item.enabled ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                </button>
                <button
                  type="button"
                  onClick={() => handleDeleteInstitution(idx)}
                  className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-red-400 hover:border-red-900 cursor-pointer"
                  title="Delete institution"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const ClientsManager = ClientsEditor;
export default ClientsEditor;
