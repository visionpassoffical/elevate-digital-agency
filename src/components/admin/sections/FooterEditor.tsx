import React, { useState } from 'react';
import { Globe } from 'lucide-react';
import { useContent } from '../../../context/ContentContext';
import { AdminSectionHeader } from '../AdminSectionHeader';
import type { FooterConfig } from '../../../types';

export const FooterEditor: React.FC<{ onPreview: () => void }> = ({ onPreview }) => {
  const { content, saveSection, isSaving } = useContent();
  const [data, setData] = useState<FooterConfig>(() => JSON.parse(JSON.stringify(content.footer)));
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const hasChanges = JSON.stringify(data) !== JSON.stringify(content.footer);

  const handleSave = async () => {
    try {
      setSaveStatus('idle');
      const ok = await saveSection('footer', data);
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
    setData(JSON.parse(JSON.stringify(content.footer)));
    setSaveStatus('idle');
  };

  return (
    <div className="space-y-6">
      <AdminSectionHeader
        title="Footer & Navigation Links"
        description="Edit footer brand description, copyright notices, and custom labels for navigation links."
        isSaving={isSaving}
        hasChanges={hasChanges}
        saveStatus={saveStatus}
        onSave={handleSave}
        onCancel={handleCancel}
        onPreview={onPreview}
      />

      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-7 max-w-3xl space-y-5 shadow-xl">
        <h3 className="text-base font-bold font-['Outfit'] text-white pb-3 border-b border-slate-800">
          Footer Brand Copy & Legal
        </h3>

        <div className="text-xs space-y-4">
          <div>
            <label className="block text-slate-400 font-semibold mb-1">
              Footer Brand Mission & Description
            </label>
            <textarea
              rows={3}
              value={data.brandDescription}
              onChange={(e) => setData({ ...data, brandDescription: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-slate-400 font-semibold mb-1">Copyright Line</label>
            <input
              type="text"
              value={data.copyrightText}
              onChange={(e) => setData({ ...data, copyrightText: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 outline-none focus:border-blue-500"
            />
            <p className="text-[11px] text-slate-500 mt-1">
              Use &ldquo;&#123;year&#125;&rdquo; to automatically display the current calendar year.
            </p>
          </div>
        </div>

        <h3 className="text-base font-bold font-['Outfit'] text-white pt-4 pb-2 border-b border-slate-800">
          Navigation Labels
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block text-slate-400 font-semibold mb-1">Website Plans Link</label>
            <input
              type="text"
              value={data.navigationLabels.websites}
              onChange={(e) =>
                setData({
                  ...data,
                  navigationLabels: { ...data.navigationLabels, websites: e.target.value },
                })
              }
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-slate-400 font-semibold mb-1">Admission Suite Link</label>
            <input
              type="text"
              value={data.navigationLabels.admission}
              onChange={(e) =>
                setData({
                  ...data,
                  navigationLabels: { ...data.navigationLabels, admission: e.target.value },
                })
              }
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-slate-400 font-semibold mb-1">Exam Suite Link</label>
            <input
              type="text"
              value={data.navigationLabels.exam}
              onChange={(e) =>
                setData({
                  ...data,
                  navigationLabels: { ...data.navigationLabels, exam: e.target.value },
                })
              }
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-slate-400 font-semibold mb-1">Monthly Creatives Link</label>
            <input
              type="text"
              value={data.navigationLabels.monthly}
              onChange={(e) =>
                setData({
                  ...data,
                  navigationLabels: { ...data.navigationLabels, monthly: e.target.value },
                })
              }
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-slate-400 font-semibold mb-1">Bulk Pricing Link</label>
            <input
              type="text"
              value={data.navigationLabels.bulk}
              onChange={(e) =>
                setData({
                  ...data,
                  navigationLabels: { ...data.navigationLabels, bulk: e.target.value },
                })
              }
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-slate-400 font-semibold mb-1">Client Institutions Link</label>
            <input
              type="text"
              value={data.navigationLabels.clients}
              onChange={(e) =>
                setData({
                  ...data,
                  navigationLabels: { ...data.navigationLabels, clients: e.target.value },
                })
              }
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white outline-none focus:border-blue-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
