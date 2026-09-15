import React, { useState } from 'react';
import { MessageSquare, Sparkles } from 'lucide-react';
import { useContent } from '../../../context/ContentContext';
import { AdminSectionHeader } from '../AdminSectionHeader';
import type { CustomEnquiryConfig } from '../../../types';

export const CustomEnquiryEditor: React.FC<{ onPreview: () => void }> = ({ onPreview }) => {
  const { content, saveSection, isSaving } = useContent();
  const [data, setData] = useState<CustomEnquiryConfig>(() =>
    JSON.parse(JSON.stringify(content.customEnquiry))
  );
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const hasChanges = JSON.stringify(data) !== JSON.stringify(content.customEnquiry);

  const handleSave = async () => {
    try {
      setSaveStatus('idle');
      const ok = await saveSection('customEnquiry', data);
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
    setData(JSON.parse(JSON.stringify(content.customEnquiry)));
    setSaveStatus('idle');
  };

  return (
    <div className="space-y-6">
      <AdminSectionHeader
        title="Custom Enquiry Section"
        description="Edit the bespoke requirement section where clients who need tailored solutions can immediately submit their request."
        isSaving={isSaving}
        hasChanges={hasChanges}
        saveStatus={saveStatus}
        onSave={handleSave}
        onCancel={handleCancel}
        onPreview={onPreview}
      />

      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-7 max-w-3xl space-y-5 shadow-xl">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold font-['Outfit'] text-white">
                Custom Requirement Parameters
              </h3>
              <p className="text-xs text-slate-400">Settings for bespoke client consultation</p>
            </div>
          </div>

          <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
            <input
              type="checkbox"
              checked={data.enabled}
              onChange={(e) => setData({ ...data, enabled: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-8 h-4 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-blue-600"></div>
            <span>{data.enabled ? 'Enabled' : 'Disabled'}</span>
          </label>
        </div>

        <div className="text-xs space-y-4">
          <div>
            <label className="block text-slate-400 font-semibold mb-1">Section Heading</label>
            <input
              type="text"
              value={data.heading}
              onChange={(e) => setData({ ...data, heading: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm font-semibold outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-slate-400 font-semibold mb-1">Description / Subtitle</label>
            <textarea
              rows={2}
              value={data.description}
              onChange={(e) => setData({ ...data, description: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-slate-400 font-semibold mb-1">CTA Button Label</label>
            <input
              type="text"
              value={data.buttonText}
              onChange={(e) => setData({ ...data, buttonText: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-slate-400 font-semibold mb-1">
              WhatsApp Prefilled Template Message
            </label>
            <textarea
              rows={4}
              value={data.whatsappTemplate}
              onChange={(e) => setData({ ...data, whatsappTemplate: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 font-mono text-xs outline-none focus:border-blue-500"
            />
            <p className="text-[11px] text-slate-500 mt-1">
              This message opens automatically in WhatsApp when visitors click &ldquo;{data.buttonText}&rdquo;.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
