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
  ExternalLink,
  Star,
  Globe,
  Check,
  Edit3,
  X,
  Image as ImageIcon,
} from 'lucide-react';
import { useContent } from '../../../context/ContentContext';
import { AdminSectionHeader } from '../AdminSectionHeader';
import type { PortfolioItemConfig, PortfolioConfig } from '../../../types';

const PORTFOLIO_CATEGORIES = [
  'Madrasa & Islamic',
  'Schools & Colleges',
  'Business & Corporate',
  'Web Apps',
] as const;

const normalizeWebsiteUrl = (rawUrl: string): string => {
  const trimmed = (rawUrl || '').trim();
  if (!trimmed) return '';
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
};

export const PortfolioEditor: React.FC<{ onPreview?: () => void }> = ({ onPreview }) => {
  const { content, saveSection, uploadFile, isSaving } = useContent();

  const [data, setData] = useState<PortfolioConfig>(() =>
    JSON.parse(
      JSON.stringify(
        content.portfolio || {
          sectionBadge: 'BUILT BY ELEVATE',
          sectionTitle: 'Websites & Digital Portals We’ve Built',
          sectionSubtitle:
            'Explore live websites, institutional portals, admission engines, and custom web applications crafted for schools, madrasas, and modern organizations.',
          items: [],
        }
      )
    )
  );

  // Quick Add New Website Form State
  const [newTitle, setNewTitle] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [newCategory, setNewCategory] = useState<string>('Madrasa & Islamic');
  const [newLocation, setNewLocation] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newTagsText, setNewTagsText] = useState('Online Admissions, Responsive UI, WhatsApp Integration');
  const [newScreenshot, setNewScreenshot] = useState('');
  const [newFeatured, setNewFeatured] = useState(true);
  const [isDraggingNew, setIsDraggingNew] = useState(false);
  const [isUploadingNew, setIsUploadingNew] = useState(false);

  // Editing existing item state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [uploadingItemId, setUploadingItemId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const newFileInputRef = useRef<HTMLInputElement | null>(null);
  const itemFileInputsRef = useRef<{ [key: string]: HTMLInputElement | null }>({});

  const hasChanges = JSON.stringify(data) !== JSON.stringify(content.portfolio);

  const persistPortfolio = async (nextData: PortfolioConfig) => {
    try {
      setSaveStatus('idle');
      setErrorMessage('');
      setData(nextData);
      const ok = await saveSection('portfolio', nextData);
      if (ok) {
        setSaveStatus('success');
        setTimeout(() => setSaveStatus('idle'), 3000);
      } else {
        setSaveStatus('error');
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Failed to save portfolio links');
      setSaveStatus('error');
    }
  };

  const handleSave = async () => {
    await persistPortfolio(data);
  };

  const handleCancel = () => {
    setData(JSON.parse(JSON.stringify(content.portfolio)));
    setErrorMessage('');
    setSaveStatus('idle');
  };

  const validateAndProcessImage = async (file: File, prefix = 'website'): Promise<string | null> => {
    setErrorMessage('');
    if (file.size > 4 * 1024 * 1024) {
      setErrorMessage(`"${file.name}" exceeds 4MB. Please choose a screenshot under 4MB.`);
      return null;
    }

    const safePrefix = prefix.toLowerCase().replace(/[^a-z0-9]/g, '-') || 'website';
    const ext = file.name ? file.name.split('.').pop() || 'png' : 'png';
    const filename = `${safePrefix}-screenshot.${ext}`;

    const res = await uploadFile(file, filename);
    return res?.url || null;
  };

  // Upload handler for New Website Form
  const handleNewScreenshotFile = async (file?: File) => {
    if (!file) return;
    try {
      setIsUploadingNew(true);
      const url = await validateAndProcessImage(file, newTitle || 'new-site');
      if (url) {
        setNewScreenshot(url);
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Screenshot upload failed');
    } finally {
      setIsUploadingNew(false);
    }
  };

  // Upload handler for an existing website item
  const handleItemScreenshotUpload = async (itemId: string, file?: File) => {
    if (!file) return;
    const targetItem = data.items.find((i) => i.id === itemId);
    if (!targetItem) return;

    try {
      setUploadingItemId(itemId);
      const url = await validateAndProcessImage(file, targetItem.title);
      if (url) {
        const nextItems = data.items.map((it) =>
          it.id === itemId ? { ...it, screenshot: url } : it
        );
        const nextData = { ...data, items: nextItems };
        await persistPortfolio(nextData);
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Screenshot upload failed');
    } finally {
      setUploadingItemId(null);
    }
  };

  // Add new website link immediately and save
  const handleAddWebsite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newUrl.trim()) {
      setErrorMessage('Please enter both the Website Title and Live Website URL.');
      return;
    }

    const formattedUrl = normalizeWebsiteUrl(newUrl);
    const parsedTags = newTagsText
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const newItem: PortfolioItemConfig = {
      id: `portfolio-${Date.now()}`,
      title: newTitle.trim(),
      url: formattedUrl,
      category: newCategory,
      clientName: newTitle.trim(),
      location: newLocation.trim() || 'Kerala, India',
      description:
        newDescription.trim() ||
        'Custom responsive institutional website with online forms and direct WhatsApp integration.',
      tags: parsedTags.length > 0 ? parsedTags : ['Responsive UI', 'Fast Hosting', 'WhatsApp Ready'],
      screenshot: newScreenshot.trim(),
      featured: newFeatured,
      enabled: true,
      order: 1,
    };

    // Put newly added website at the top of the showcase
    const reorderedExisting = data.items.map((item, i) => ({
      ...item,
      order: i + 2,
    }));

    const nextData: PortfolioConfig = {
      ...data,
      items: [newItem, ...reorderedExisting],
    };

    await persistPortfolio(nextData);

    // Reset quick-add form
    setNewTitle('');
    setNewUrl('');
    setNewLocation('');
    setNewDescription('');
    setNewScreenshot('');
  };

  const handleDeleteItem = async (id: string) => {
    const nextItems = data.items
      .filter((item) => item.id !== id)
      .map((item, idx) => ({ ...item, order: idx + 1 }));
    await persistPortfolio({ ...data, items: nextItems });
  };

  const handleMoveItem = async (idx: number, direction: 'up' | 'down') => {
    const target = direction === 'up' ? idx - 1 : idx + 1;
    if (target < 0 || target >= data.items.length) return;
    const nextItems = [...data.items];
    const temp = nextItems[idx];
    nextItems[idx] = nextItems[target];
    nextItems[target] = temp;
    nextItems.forEach((it, i) => {
      it.order = i + 1;
    });
    await persistPortfolio({ ...data, items: nextItems });
  };

  const updateItemField = <K extends keyof PortfolioItemConfig>(
    id: string,
    field: K,
    value: PortfolioItemConfig[K]
  ) => {
    const nextItems = data.items.map((it) =>
      it.id === id ? { ...it, [field]: value } : it
    );
    setData({ ...data, items: nextItems });
  };

  return (
    <div className="space-y-6">
      <AdminSectionHeader
        title="Built Websites (Site Links & Portfolio)"
        description="Upload links, screenshots, categories, and tags for websites and digital portals you have built. Changes publish immediately to the Our Work section."
        isSaving={isSaving}
        hasChanges={hasChanges}
        saveStatus={saveStatus}
        onSave={handleSave}
        onCancel={handleCancel}
        onPreview={onPreview}
      />

      {errorMessage && (
        <div className="p-4 rounded-2xl bg-red-950/50 border border-red-800 text-red-200 text-xs flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
            <span>{errorMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => setErrorMessage('')}
            className="text-red-400 hover:text-white cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* QUICK UPLOAD NEW WEBSITE LINK CARD */}
      <form
        onSubmit={handleAddWebsite}
        className="bg-gradient-to-br from-slate-900 via-slate-900 to-blue-950/30 border border-blue-500/30 rounded-3xl p-6 sm:p-7 shadow-xl space-y-5"
      >
        <div className="flex items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold font-['Outfit'] text-white">
                Upload a New Built Website Link
              </h3>
              <p className="text-xs text-slate-400">
                Enter the website URL and details below — if you don&apos;t upload a screenshot, an architectural preview is generated automatically.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 text-xs">
          {/* Website Title */}
          <div className="md:col-span-5">
            <label className="block text-slate-300 font-semibold mb-1.5">
              Website / Project Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Darul Huda Islamic Academy"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white outline-none focus:border-blue-500"
            />
          </div>

          {/* Live Website URL */}
          <div className="md:col-span-4">
            <label className="block text-slate-300 font-semibold mb-1.5">
              Live Website URL *
            </label>
            <input
              type="text"
              required
              placeholder="https://your-website.com"
              value={newUrl}
              onChange={(e) => setNewUrl(e.target.value)}
              onBlur={() => {
                if (newUrl.trim()) setNewUrl(normalizeWebsiteUrl(newUrl));
              }}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-blue-300 font-mono outline-none focus:border-blue-500"
            />
          </div>

          {/* Category */}
          <div className="md:col-span-3">
            <label className="block text-slate-300 font-semibold mb-1.5">
              Category
            </label>
            <select
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white outline-none focus:border-blue-500"
            >
              {PORTFOLIO_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Client / Location */}
          <div className="md:col-span-4">
            <label className="block text-slate-300 font-semibold mb-1.5">
              Client / Location
            </label>
            <input
              type="text"
              placeholder="e.g. Malappuram, Kerala"
              value={newLocation}
              onChange={(e) => setNewLocation(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 outline-none focus:border-blue-500"
            />
          </div>

          {/* Feature Tags */}
          <div className="md:col-span-8">
            <label className="block text-slate-300 font-semibold mb-1.5">
              Feature Highlights (comma-separated)
            </label>
            <input
              type="text"
              placeholder="Online Admissions, Notice Board, Bilingual UI, Fast Hosting"
              value={newTagsText}
              onChange={(e) => setNewTagsText(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 outline-none focus:border-blue-500"
            />
          </div>

          {/* Description */}
          <div className="md:col-span-7">
            <label className="block text-slate-300 font-semibold mb-1.5">
              Short Project Description
            </label>
            <textarea
              rows={3}
              placeholder="Describe what was built for this institution or business..."
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 outline-none focus:border-blue-500 resize-none"
            />
          </div>

          {/* Screenshot Image Upload or URL */}
          <div className="md:col-span-5">
            <label className="block text-slate-300 font-semibold mb-1.5">
              Website Screenshot (Optional — Drag & Drop or Paste URL)
            </label>
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDraggingNew(true);
              }}
              onDragLeave={() => setIsDraggingNew(false)}
              onDrop={(e) => {
                e.preventDefault();
                setIsDraggingNew(false);
                const file = e.dataTransfer.files?.[0];
                if (file) handleNewScreenshotFile(file);
              }}
              className={`rounded-xl border border-dashed p-3 transition-colors ${
                isDraggingNew
                  ? 'border-blue-400 bg-blue-500/10'
                  : 'border-slate-700 bg-slate-950/70'
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                <input
                  type="text"
                  placeholder="Paste screenshot URL or click Upload..."
                  value={newScreenshot}
                  onChange={(e) => setNewScreenshot(e.target.value)}
                  className="flex-1 px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 text-xs outline-none focus:border-blue-500"
                />
                <input
                  type="file"
                  ref={newFileInputRef}
                  accept="image/png,image/jpeg,image/jpg,image/webp,image/svg+xml"
                  onChange={(e) => handleNewScreenshotFile(e.target.files?.[0])}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => newFileInputRef.current?.click()}
                  disabled={isUploadingNew}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 cursor-pointer shrink-0"
                >
                  <Upload className="w-3.5 h-3.5 text-blue-400" />
                  <span>{isUploadingNew ? 'Uploading...' : 'Browse'}</span>
                </button>
              </div>

              {newScreenshot ? (
                <div className="flex items-center justify-between gap-2 pt-1 text-[11px] text-emerald-400">
                  <span className="truncate">Screenshot ready for showcase</span>
                  <button
                    type="button"
                    onClick={() => setNewScreenshot('')}
                    className="text-slate-400 hover:text-red-400 underline cursor-pointer"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <p className="text-[10px] text-slate-500">
                  Leave empty to use an automatic architectural preview card.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Submit Bar */}
        <div className="pt-2 flex flex-wrap items-center justify-between gap-4 border-t border-slate-800/80">
          <label className="inline-flex items-center gap-2 text-xs text-slate-300 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={newFeatured}
              onChange={(e) => setNewFeatured(e.target.checked)}
              className="rounded border-slate-700 bg-slate-950 text-blue-600 focus:ring-blue-500"
            />
            <span>Mark as Featured Project</span>
          </label>

          <button
            type="submit"
            disabled={isSaving || isUploadingNew}
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-blue-600/25 cursor-pointer transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Add & Publish Website Link</span>
          </button>
        </div>
      </form>

      {/* EXISTING BUILT WEBSITES LIST */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold font-['Outfit'] text-white">
              Published Portfolio Websites ({data.items.length})
            </h3>
            <p className="text-xs text-slate-400">
              Click any field to edit, reorder with arrows, or upload a new screenshot
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {data.items.map((item, idx) => {
            const isEditing = editingId === item.id;

            return (
              <div
                key={item.id}
                className={`p-4 sm:p-5 rounded-2xl bg-slate-950/80 border transition-all text-xs ${
                  item.enabled ? 'border-slate-800' : 'border-slate-800/40 opacity-55'
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  {/* Left: Screenshot Preview & Primary Info */}
                  <div className="flex items-start sm:items-center gap-4 min-w-0 flex-1">
                    {/* Thumbnail */}
                    <div className="relative w-24 h-16 rounded-xl bg-slate-900 border border-slate-800 overflow-hidden shrink-0 group">
                      {item.screenshot ? (
                        <img
                          src={item.screenshot}
                          alt={item.title}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover object-top"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-slate-500 bg-gradient-to-br from-blue-950/50 to-slate-900">
                          <ImageIcon className="w-4 h-4 text-blue-400 mb-0.5" />
                          <span className="text-[9px] font-mono">Auto Preview</span>
                        </div>
                      )}
                      <input
                        type="file"
                        ref={(el) => {
                          itemFileInputsRef.current[item.id] = el;
                        }}
                        accept="image/png,image/jpeg,image/jpg,image/webp,image/svg+xml"
                        onChange={(e) =>
                          handleItemScreenshotUpload(item.id, e.target.files?.[0])
                        }
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => itemFileInputsRef.current[item.id]?.click()}
                        className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity cursor-pointer"
                        title="Upload screenshot image"
                      >
                        <Upload className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="min-w-0 flex-1 space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-sm text-white truncate">
                          {item.title}
                        </span>
                        <span className="text-slate-600">·</span>
                        <span className="text-blue-400 font-semibold">
                          {item.category}
                        </span>
                        {item.featured && (
                          <span className="text-amber-400 font-semibold flex items-center gap-1">
                            <Star className="w-3 h-3 fill-amber-400" />
                            Featured
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-3 text-slate-400">
                        <a
                          href={normalizeWebsiteUrl(item.url)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-mono text-blue-300 hover:underline inline-flex items-center gap-1 truncate max-w-xs"
                        >
                          <span className="truncate">{item.url}</span>
                          <ExternalLink className="w-3 h-3 shrink-0" />
                        </a>
                        {item.location && (
                          <>
                            <span className="text-slate-700">·</span>
                            <span className="truncate">{item.location}</span>
                          </>
                        )}
                      </div>

                      <p className="text-slate-400 line-clamp-1">{item.description}</p>
                    </div>
                  </div>

                  {/* Right Controls */}
                  <div className="flex items-center gap-1.5 shrink-0 self-end lg:self-center">
                    <button
                      type="button"
                      onClick={() => setEditingId(isEditing ? null : item.id)}
                      className={`px-3 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors ${
                        isEditing
                          ? 'bg-blue-600 border-blue-500 text-white'
                          : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white'
                      }`}
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>{isEditing ? 'Close' : 'Edit'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleMoveItem(idx, 'up')}
                      disabled={idx === 0}
                      className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white disabled:opacity-30 cursor-pointer"
                      title="Move Up"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleMoveItem(idx, 'down')}
                      disabled={idx === data.items.length - 1}
                      className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white disabled:opacity-30 cursor-pointer"
                      title="Move Down"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={async () => {
                        const nextItems = data.items.map((it) =>
                          it.id === item.id ? { ...it, enabled: !it.enabled } : it
                        );
                        await persistPortfolio({ ...data, items: nextItems });
                      }}
                      className={`p-1.5 rounded-lg border cursor-pointer ${
                        item.enabled
                          ? 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white'
                          : 'bg-amber-950/40 border-amber-800 text-amber-300'
                      }`}
                      title={item.enabled ? 'Visible on site (Click to hide)' : 'Hidden (Click to show)'}
                    >
                      {item.enabled ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDeleteItem(item.id)}
                      className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-red-400 hover:border-red-900 cursor-pointer"
                      title="Delete website"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Expanded Inline Editor */}
                {isEditing && (
                  <div className="mt-4 pt-4 border-t border-slate-800/80 grid grid-cols-1 md:grid-cols-12 gap-3">
                    <div className="md:col-span-4">
                      <label className="block text-slate-400 font-semibold mb-1">
                        Website Title
                      </label>
                      <input
                        type="text"
                        value={item.title}
                        onChange={(e) => updateItemField(item.id, 'title', e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white outline-none focus:border-blue-500"
                      />
                    </div>

                    <div className="md:col-span-4">
                      <label className="block text-slate-400 font-semibold mb-1">
                        Live URL
                      </label>
                      <input
                        type="text"
                        value={item.url}
                        onChange={(e) => updateItemField(item.id, 'url', e.target.value)}
                        onBlur={() =>
                          updateItemField(item.id, 'url', normalizeWebsiteUrl(item.url))
                        }
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-blue-300 font-mono outline-none focus:border-blue-500"
                      />
                    </div>

                    <div className="md:col-span-4">
                      <label className="block text-slate-400 font-semibold mb-1">
                        Category
                      </label>
                      <select
                        value={item.category}
                        onChange={(e) => updateItemField(item.id, 'category', e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white outline-none focus:border-blue-500"
                      >
                        {PORTFOLIO_CATEGORIES.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="md:col-span-4">
                      <label className="block text-slate-400 font-semibold mb-1">
                        Client / Location
                      </label>
                      <input
                        type="text"
                        value={item.location || ''}
                        onChange={(e) => updateItemField(item.id, 'location', e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 outline-none focus:border-blue-500"
                      />
                    </div>

                    <div className="md:col-span-8">
                      <label className="block text-slate-400 font-semibold mb-1">
                        Tags (comma-separated)
                      </label>
                      <input
                        type="text"
                        value={(item.tags || []).join(', ')}
                        onChange={(e) =>
                          updateItemField(
                            item.id,
                            'tags',
                            e.target.value
                              .split(',')
                              .map((t) => t.trim())
                              .filter(Boolean)
                          )
                        }
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 outline-none focus:border-blue-500"
                      />
                    </div>

                    <div className="md:col-span-6">
                      <label className="block text-slate-400 font-semibold mb-1">
                        Description
                      </label>
                      <textarea
                        rows={2}
                        value={item.description}
                        onChange={(e) =>
                          updateItemField(item.id, 'description', e.target.value)
                        }
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 outline-none focus:border-blue-500 resize-none"
                      />
                    </div>

                    <div className="md:col-span-6">
                      <label className="block text-slate-400 font-semibold mb-1">
                        Screenshot Image URL or Upload
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={item.screenshot || ''}
                          placeholder="https://... or upload file"
                          onChange={(e) =>
                            updateItemField(item.id, 'screenshot', e.target.value)
                          }
                          className="flex-1 px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 outline-none focus:border-blue-500"
                        />
                        <button
                          type="button"
                          onClick={() => itemFileInputsRef.current[item.id]?.click()}
                          disabled={uploadingItemId === item.id}
                          className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold flex items-center gap-1.5 cursor-pointer shrink-0"
                        >
                          <Upload className="w-3.5 h-3.5 text-blue-400" />
                          <span>
                            {uploadingItemId === item.id ? 'Uploading...' : 'Upload'}
                          </span>
                        </button>
                      </div>
                    </div>

                    <div className="md:col-span-12 flex items-center justify-between pt-2">
                      <label className="inline-flex items-center gap-2 text-slate-300 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={Boolean(item.featured)}
                          onChange={(e) =>
                            updateItemField(item.id, 'featured', e.target.checked)
                          }
                          className="rounded border-slate-700 bg-slate-900 text-blue-600"
                        />
                        <span>Featured Project</span>
                      </label>

                      <button
                        type="button"
                        onClick={async () => {
                          await persistPortfolio(data);
                          setEditingId(null);
                        }}
                        className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center gap-1.5 cursor-pointer"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Save Changes</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Section Headings */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6">
        <h3 className="text-base font-bold font-['Outfit'] text-white mb-4">
          Portfolio Section Headings
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
    </div>
  );
};

export default PortfolioEditor;
