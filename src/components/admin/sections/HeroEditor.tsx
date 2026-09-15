import React, { useState } from 'react';
import { useContent } from '../../../context/ContentContext';
import { AdminSectionHeader } from '../AdminSectionHeader';
import type { HeroConfig } from '../../../types';

export const HeroEditor: React.FC<{ onPreview: () => void }> = ({ onPreview }) => {
  const { content, saveSection, isSaving } = useContent();
  const [form, setForm] = useState<HeroConfig>(() => JSON.parse(JSON.stringify(content.hero)));
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const hasChanges = JSON.stringify(form) !== JSON.stringify(content.hero);

  const handleSave = async () => {
    try {
      setSaveStatus('idle');
      const ok = await saveSection('hero', form);
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
    setForm(JSON.parse(JSON.stringify(content.hero)));
    setSaveStatus('idle');
  };

  return (
    <div className="space-y-6">
      <AdminSectionHeader
        title="Hero / Homepage Header"
        description="Configure main headlines, promotional highlight pills, intro descriptions, and primary CTA buttons."
        isSaving={isSaving}
        hasChanges={hasChanges}
        saveStatus={saveStatus}
        onSave={handleSave}
        onCancel={handleCancel}
        onPreview={onPreview}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Main Headings */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 space-y-5">
          <h3 className="text-base font-bold font-['Outfit'] text-white">Main Headline & Tagline</h3>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Leading Heading Text
            </label>
            <input
              type="text"
              value={form.heading}
              onChange={(e) => setForm({ ...form, heading: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 focus:border-[#0062EB] text-white text-sm outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Highlighted Heading Accent
            </label>
            <input
              type="text"
              value={form.headingHighlight}
              onChange={(e) => setForm({ ...form, headingHighlight: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 focus:border-[#0062EB] text-white text-sm outline-none"
            />
            <p className="text-[11px] text-slate-500 mt-1">
              Renders as prominent blue text: &ldquo;{form.heading} {form.headingHighlight}&rdquo;
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Top Pill Brand Label
            </label>
            <input
              type="text"
              value={form.pillElevateText}
              onChange={(e) => setForm({ ...form, pillElevateText: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 focus:border-[#0062EB] text-white text-sm outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Top Pill Subtitle
            </label>
            <input
              type="text"
              value={form.pillSubtitle}
              onChange={(e) => setForm({ ...form, pillSubtitle: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 focus:border-[#0062EB] text-white text-sm outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Hero Introductory Description
            </label>
            <textarea
              rows={3}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 focus:border-[#0062EB] text-white text-sm outline-none"
            />
          </div>
        </div>

        {/* CTA Buttons & Actions */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 space-y-5">
          <h3 className="text-base font-bold font-['Outfit'] text-white">Call to Action (CTA) Buttons</h3>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Primary Button Text (WhatsApp Direct)
            </label>
            <input
              type="text"
              value={form.ctaWhatsAppText}
              onChange={(e) => setForm({ ...form, ctaWhatsAppText: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 focus:border-[#0062EB] text-white text-sm outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Secondary Button Text (Interactive Quote)
            </label>
            <input
              type="text"
              value={form.ctaQuoteText}
              onChange={(e) => setForm({ ...form, ctaQuoteText: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 focus:border-[#0062EB] text-white text-sm outline-none"
            />
          </div>

          {/* Quick preview card */}
          <div className="mt-6 p-4 rounded-2xl bg-slate-950/90 border border-slate-800/80">
            <div className="text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider">
              Live CTA Preview
            </div>
            <div className="flex flex-wrap gap-2.5">
              <span className="px-4 py-2 rounded-xl bg-[#0062EB] text-white text-xs font-bold shadow-md">
                {form.ctaWhatsAppText || 'Continue on WhatsApp'}
              </span>
              <span className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-medium border border-slate-700">
                {form.ctaQuoteText || 'Get a Quote'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Starting Price Highlights Pill Strip */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6">
        <h3 className="text-base font-bold font-['Outfit'] text-white mb-2">
          Hero Starting-Price Highlights Pill Strip
        </h3>
        <p className="text-xs text-slate-400 mb-6">
          These quick tags appear directly underneath the hero CTA buttons to provide immediate pricing
          clarity for visitors.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {(['websites', 'admission', 'exam', 'creatives'] as const).map((key) => {
            const item = form.highlights[key];
            return (
              <div
                key={key}
                className={`p-4 rounded-2xl border transition-all ${
                  item.enabled
                    ? 'bg-slate-950/70 border-slate-700'
                    : 'bg-slate-950/30 border-slate-800/40 opacity-50'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                    {item.title}
                  </span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={item.enabled}
                      onChange={(e) => {
                        const updated = { ...form.highlights };
                        updated[key].enabled = e.target.checked;
                        setForm({ ...form, highlights: updated });
                      }}
                      className="sr-only peer"
                    />
                    <div className="w-8 h-4 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block text-slate-400 mb-1">Prefix Label</label>
                    <input
                      type="text"
                      value={item.label}
                      onChange={(e) => {
                        const updated = { ...form.highlights };
                        updated[key].label = e.target.value;
                        setForm({ ...form, highlights: updated });
                      }}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-white outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1">Price Tag</label>
                    <input
                      type="text"
                      value={item.price}
                      onChange={(e) => {
                        const updated = { ...form.highlights };
                        updated[key].price = e.target.value;
                        setForm({ ...form, highlights: updated });
                      }}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-emerald-400 font-bold outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1">Suffix (e.g. /year, /month)</label>
                    <input
                      type="text"
                      value={item.suffix}
                      onChange={(e) => {
                        const updated = { ...form.highlights };
                        updated[key].suffix = e.target.value;
                        setForm({ ...form, highlights: updated });
                      }}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 outline-none"
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
