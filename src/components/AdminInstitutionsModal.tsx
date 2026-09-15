import React, { useState, useRef } from 'react';
import {
  X,
  Plus,
  Trash2,
  Edit2,
  ChevronUp,
  ChevronDown,
  Upload,
  Check,
  Eye,
  EyeOff,
  RotateCcw,
  Sparkles,
  Building2,
  Save,
  Image as ImageIcon,
  AlertCircle,
} from 'lucide-react';
import type { ClientInstitution } from '../types';
import {
  getClientInstitutions,
  saveClientInstitutions,
  resetClientInstitutions,
} from '../data/partnersData';

interface AdminInstitutionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdated?: () => void;
}

export const AdminInstitutionsModal: React.FC<AdminInstitutionsModalProps> = ({
  isOpen,
  onClose,
  onUpdated,
}) => {
  const [institutions, setInstitutions] = useState<ClientInstitution[]>(() =>
    getClientInstitutions()
  );
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAddingNew, setIsAddingNew] = useState<boolean>(false);

  // Form states
  const [formName, setFormName] = useState('');
  const [formLocation, setFormLocation] = useState('');
  const [formLogo, setFormLogo] = useState('');
  const [formEnabled, setFormEnabled] = useState(true);
  const [formError, setFormError] = useState('');
  const [isDraggingFile, setIsDraggingFile] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Reload data whenever modal opens
  React.useEffect(() => {
    if (isOpen) {
      setInstitutions(getClientInstitutions());
      setEditingId(null);
      setIsAddingNew(false);
      setFormError('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const persistChanges = (newList: ClientInstitution[]) => {
    setInstitutions(newList);
    saveClientInstitutions(newList);
    if (onUpdated) onUpdated();
  };

  // Toggle enabled
  const handleToggleEnabled = (id: string) => {
    const next = institutions.map((item) =>
      item.id === id ? { ...item, enabled: !item.enabled } : item
    );
    persistChanges(next);
  };

  // Reorder: Move Up
  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const next = [...institutions];
    const temp = next[index - 1];
    next[index - 1] = next[index];
    next[index] = temp;
    // update order property
    next.forEach((item, idx) => {
      item.order = idx + 1;
    });
    persistChanges(next);
  };

  // Reorder: Move Down
  const handleMoveDown = (index: number) => {
    if (index === institutions.length - 1) return;
    const next = [...institutions];
    const temp = next[index + 1];
    next[index + 1] = next[index];
    next[index] = temp;
    next.forEach((item, idx) => {
      item.order = idx + 1;
    });
    persistChanges(next);
  };

  // Delete institution
  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to remove "${name}"?`)) {
      const next = institutions.filter((item) => item.id !== id);
      next.forEach((item, idx) => {
        item.order = idx + 1;
      });
      persistChanges(next);
      if (editingId === id) {
        setEditingId(null);
        setIsAddingNew(false);
      }
    }
  };

  // Start edit
  const handleStartEdit = (inst: ClientInstitution) => {
    setEditingId(inst.id);
    setIsAddingNew(false);
    setFormName(inst.name);
    setFormLocation(inst.location || '');
    setFormLogo(inst.logo);
    setFormEnabled(inst.enabled);
    setFormError('');
  };

  // Start add new
  const handleStartAdd = () => {
    setEditingId(null);
    setIsAddingNew(true);
    setFormName('');
    setFormLocation('');
    setFormLogo('');
    setFormEnabled(true);
    setFormError('');
  };

  // Handle Logo File Upload (Drag-and-Drop or File Picker)
  const processUploadedFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setFormError('Please upload a valid image file (PNG, JPG, SVG, WebP)');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (result) {
        setFormLogo(result);
        setFormError('');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processUploadedFile(file);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDraggingFile(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processUploadedFile(file);
    }
  };

  // Quick helper to generate a clean stylized SVG logo if no image is uploaded
  const handleGenerateFallbackLogo = () => {
    const trimmed = formName.trim();
    if (!trimmed) {
      setFormError('Enter an institution name first to generate a logo');
      return;
    }
    const words = trimmed.split(/\s+/);
    const initials = words.length === 1 ? words[0].slice(0, 3).toUpperCase() : words.slice(0, 3).map((w) => w[0]).join('').toUpperCase();
    const colors = [
      ['#064e3b', '#047857', '#34d399'],
      ['#1e3a8a', '#2563eb', '#60a5fa'],
      ['#0f172a', '#1e293b', '#38bdf8'],
      ['#312e81', '#4338ca', '#818cf8'],
      ['#701a75', '#86198f', '#e879f9'],
    ];
    const picked = colors[Math.floor(Math.random() * colors.length)];
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
      <defs>
        <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${picked[0]}" />
          <stop offset="100%" stop-color="${picked[1]}" />
        </linearGradient>
      </defs>
      <rect width="120" height="120" rx="28" fill="url(#g)" />
      <rect x="4" y="4" width="112" height="112" rx="24" fill="none" stroke="${picked[2]}" stroke-opacity="0.3" stroke-width="2" />
      <polygon points="60,32 86,44 60,56 34,44" fill="none" stroke="#FFFFFF" stroke-width="4" stroke-linejoin="round" />
      <path d="M42 50 V66 C42 72, 78 72, 78 66 V50" fill="none" stroke="${picked[2]}" stroke-width="3" />
      <text x="60" y="98" font-family="system-ui, -apple-system, sans-serif" font-weight="800" font-size="14" fill="#FFFFFF" text-anchor="middle" letter-spacing="1.5">${initials}</text>
    </svg>`;
    setFormLogo(`data:image/svg+xml;utf8,${encodeURIComponent(svg)}`);
    setFormError('');
  };

  // Save Form (Create or Update)
  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) {
      setFormError('Institution name is required');
      return;
    }
    if (!formLogo.trim()) {
      setFormError('Please upload an institution logo or generate a monogram logo');
      return;
    }

    if (isAddingNew) {
      const newInst: ClientInstitution = {
        id: `client-${Date.now()}`,
        name: formName.trim(),
        location: formLocation.trim() || undefined,
        logo: formLogo.trim(),
        enabled: formEnabled,
        order: institutions.length + 1,
      };
      const next = [...institutions, newInst];
      persistChanges(next);
      setIsAddingNew(false);
      setFormName('');
      setFormLogo('');
      setFormLocation('');
    } else if (editingId) {
      const next = institutions.map((item) =>
        item.id === editingId
          ? {
              ...item,
              name: formName.trim(),
              location: formLocation.trim() || undefined,
              logo: formLogo.trim(),
              enabled: formEnabled,
            }
          : item
      );
      persistChanges(next);
      setEditingId(null);
    }
    setFormError('');
  };

  const handleResetToDefaults = () => {
    if (window.confirm('Reset client institutions to starter list? Any custom entries will be replaced.')) {
      const list = resetClientInstitutions();
      setInstitutions(list);
      setEditingId(null);
      setIsAddingNew(false);
      if (onUpdated) onUpdated();
    }
  };

  const handleClearAll = () => {
    if (window.confirm('Clear all client institutions? This will test the empty state on the live site.')) {
      persistChanges([]);
      setEditingId(null);
      setIsAddingNew(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/70 backdrop-blur-sm overflow-y-auto animate-fadeIn">
      <div className="bg-white border border-slate-200 w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden my-auto flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 sm:p-6 bg-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/30 border border-blue-500/40 flex items-center justify-center text-blue-400">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-blue-400">
                ELEVATE Admin Panel
              </div>
              <h3 className="font-['Outfit'] font-bold text-lg sm:text-xl text-white">
                Manage Client Institutions
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Close Admin Panel"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6">
          {/* Action Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <div className="text-xs sm:text-sm text-slate-600">
              Total: <strong className="text-slate-900">{institutions.length}</strong> institutions (
              <strong className="text-emerald-600">
                {institutions.filter((i) => i.enabled).length} active
              </strong>
              )
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleStartAdd}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-[#0062EB] hover:bg-blue-600 active:scale-[0.98] rounded-xl transition-all shadow-xs cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add Institution</span>
              </button>

              <button
                type="button"
                onClick={handleResetToDefaults}
                className="inline-flex items-center gap-1 px-2.5 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
                title="Reset to default institutions"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Reset</span>
              </button>

              <button
                type="button"
                onClick={handleClearAll}
                className="inline-flex items-center gap-1 px-2.5 py-2 text-xs font-semibold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 rounded-xl transition-colors cursor-pointer"
                title="Clear all to test empty state"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Empty</span>
              </button>
            </div>
          </div>

          {/* Add / Edit Form Drawer */}
          {(isAddingNew || editingId) && (
            <form
              onSubmit={handleSaveForm}
              className="p-5 sm:p-6 rounded-2xl bg-blue-50/40 border border-blue-200/80 space-y-4"
            >
              <div className="flex items-center justify-between">
                <h4 className="font-['Outfit'] font-bold text-base text-[#0B0F17]">
                  {isAddingNew ? 'Add New Client Institution' : 'Edit Client Institution'}
                </h4>
                <button
                  type="button"
                  onClick={() => {
                    setIsAddingNew(false);
                    setEditingId(null);
                    setFormError('');
                  }}
                  className="text-xs text-slate-500 hover:text-slate-800"
                >
                  Cancel
                </button>
              </div>

              {formError && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Institution Name */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Institution / College Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="e.g., Crescent International Academy"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-[#0062EB] focus:ring-2 focus:ring-[#0062EB]/20 text-sm text-slate-900 bg-white"
                  />
                </div>

                {/* Subtitle / Location */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Location / Campus (Optional)
                  </label>
                  <input
                    type="text"
                    value={formLocation}
                    onChange={(e) => setFormLocation(e.target.value)}
                    placeholder="e.g., Kozhikode, Malappuram or Campus Trust"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-[#0062EB] focus:ring-2 focus:ring-[#0062EB]/20 text-sm text-slate-900 bg-white"
                  />
                </div>
              </div>

              {/* Logo Upload & Preview Area */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                  Institution Logo *
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                  {/* Logo Preview */}
                  <div className="sm:col-span-3 flex flex-col items-center justify-center p-3 rounded-2xl bg-white border border-slate-200">
                    {formLogo ? (
                      <img
                        src={formLogo}
                        alt="Logo preview"
                        className="w-16 h-16 object-contain rounded-xl shadow-2xs"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400">
                        <ImageIcon className="w-7 h-7" />
                      </div>
                    )}
                    <span className="text-[10px] font-semibold text-slate-500 mt-2">
                      {formLogo ? 'Preview' : 'No Logo'}
                    </span>
                  </div>

                  {/* Upload Controls */}
                  <div className="sm:col-span-9 space-y-2">
                    {/* Drag and Drop Zone */}
                    <div
                      onDragOver={(e) => {
                        e.preventDefault();
                        setIsDraggingFile(true);
                      }}
                      onDragLeave={() => setIsDraggingFile(false)}
                      onDrop={handleDrop}
                      onClick={() => fileInputRef.current?.click()}
                      className={`p-4 rounded-xl border-2 border-dashed text-center transition-colors cursor-pointer ${
                        isDraggingFile
                          ? 'border-[#0062EB] bg-blue-50'
                          : 'border-slate-300 hover:border-blue-400 bg-white'
                      }`}
                    >
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileInputChange}
                        className="hidden"
                      />
                      <Upload className="w-5 h-5 text-[#0062EB] mx-auto mb-1" />
                      <div className="text-xs font-bold text-slate-800">
                        Click to upload logo or drag and drop
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        PNG, JPG, SVG, WebP (Square recommended)
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      <button
                        type="button"
                        onClick={handleGenerateFallbackLogo}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold cursor-pointer"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-[#0062EB]" />
                        <span>Generate Stylized Logo from Name</span>
                      </button>

                      {formLogo && (
                        <button
                          type="button"
                          onClick={() => setFormLogo('')}
                          className="text-xs text-red-600 hover:underline px-2 py-1"
                        >
                          Remove Logo
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Status Toggle & Submit */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-3 border-t border-blue-200/60">
                <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formEnabled}
                    onChange={(e) => setFormEnabled(e.target.checked)}
                    className="w-4 h-4 rounded text-[#0062EB] focus:ring-[#0062EB]"
                  />
                  <span>Active & Visible on Public Website</span>
                </label>

                <div className="flex items-center gap-2 self-end sm:self-auto">
                  <button
                    type="button"
                    onClick={() => {
                      setIsAddingNew(false);
                      setEditingId(null);
                    }}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-200/60 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-[#0062EB] hover:bg-blue-600 shadow-sm transition-all"
                  >
                    <Save className="w-4 h-4" />
                    <span>{isAddingNew ? 'Save Institution' : 'Update Institution'}</span>
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* Institutions List Table / Cards */}
          <div className="space-y-2.5">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Institutions Order & Visibility (Drag / Reorder)
            </div>

            {institutions.length === 0 ? (
              <div className="p-8 text-center rounded-2xl bg-slate-50 border border-slate-200 text-slate-500 space-y-2">
                <Building2 className="w-8 h-8 mx-auto text-slate-400 opacity-60" />
                <div className="text-sm font-semibold">No institutions configured.</div>
                <p className="text-xs max-w-sm mx-auto">
                  The live website will show: <em>“Your institution could be featured here.”</em>
                </p>
                <button
                  type="button"
                  onClick={handleStartAdd}
                  className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-[#0062EB] rounded-xl"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add First Institution</span>
                </button>
              </div>
            ) : (
              institutions.map((inst, index) => (
                <div
                  key={inst.id}
                  className={`p-3.5 sm:p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                    inst.enabled
                      ? 'bg-white border-slate-200/90 shadow-2xs'
                      : 'bg-slate-50/70 border-slate-200 opacity-60'
                  }`}
                >
                  {/* Left: Reorder arrows, logo, info */}
                  <div className="flex items-center gap-3">
                    {/* Reorder Buttons */}
                    <div className="flex sm:flex-col items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleMoveUp(index)}
                        disabled={index === 0}
                        className="p-1 rounded-md text-slate-400 hover:text-slate-800 disabled:opacity-30 disabled:hover:text-slate-400 hover:bg-slate-100 cursor-pointer"
                        title="Move Up"
                      >
                        <ChevronUp className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleMoveDown(index)}
                        disabled={index === institutions.length - 1}
                        className="p-1 rounded-md text-slate-400 hover:text-slate-800 disabled:opacity-30 disabled:hover:text-slate-400 hover:bg-slate-100 cursor-pointer"
                        title="Move Down"
                      >
                        <ChevronDown className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Logo thumbnail */}
                    <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center p-1 overflow-hidden shrink-0">
                      <img
                        src={inst.logo}
                        alt={inst.name}
                        className="w-full h-full object-contain"
                      />
                    </div>

                    {/* Name and badge */}
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-['Outfit'] font-bold text-sm sm:text-base text-[#0B0F17]">
                          {inst.name}
                        </span>
                        {inst.enabled ? (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700">
                            Active
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 border border-slate-200 text-slate-500">
                            Hidden
                          </span>
                        )}
                      </div>
                      {inst.location && (
                        <span className="text-xs text-slate-500 block">
                          {inst.location}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div className="flex items-center gap-2 self-end sm:self-center">
                    {/* Toggle Visibility */}
                    <button
                      type="button"
                      onClick={() => handleToggleEnabled(inst.id)}
                      className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                        inst.enabled
                          ? 'text-slate-600 hover:bg-slate-100'
                          : 'text-emerald-700 bg-emerald-50 hover:bg-emerald-100'
                      }`}
                      title={inst.enabled ? 'Hide from public site' : 'Show on public site'}
                    >
                      {inst.enabled ? (
                        <>
                          <EyeOff className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">Disable</span>
                        </>
                      ) : (
                        <>
                          <Eye className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">Enable</span>
                        </>
                      )}
                    </button>

                    {/* Edit button */}
                    <button
                      type="button"
                      onClick={() => handleStartEdit(inst)}
                      className="p-2 rounded-lg text-slate-600 hover:text-[#0062EB] hover:bg-blue-50 transition-colors cursor-pointer"
                      title="Edit institution"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>

                    {/* Delete button */}
                    <button
                      type="button"
                      onClick={() => handleDelete(inst.id, inst.name)}
                      className="p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                      title="Delete institution"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Footer info */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2 shrink-0">
          <span className="text-[11px]">
            ⚡ Changes save instantly to localStorage and update on the public website.
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl font-bold text-xs text-slate-800 bg-white border border-slate-300 hover:bg-slate-100"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
