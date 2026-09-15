import React, { useState } from 'react';
import { MessageCircle, ExternalLink, Sparkles, Send } from 'lucide-react';
import { useContent } from '../../../context/ContentContext';
import { AdminSectionHeader } from '../AdminSectionHeader';
import type { WhatsAppTemplatesConfig } from '../../../types';

export const WhatsAppEditor: React.FC<{ onPreview: () => void }> = ({ onPreview }) => {
  const { content, saveSection, isSaving } = useContent();
  const [data, setData] = useState<WhatsAppTemplatesConfig>(() =>
    JSON.parse(JSON.stringify(content.whatsappSettings))
  );
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [testTemplate, setTestTemplate] = useState<keyof WhatsAppTemplatesConfig['templates']>('generalEnquiry');

  const hasChanges = JSON.stringify(data) !== JSON.stringify(content.whatsappSettings);

  const handleSave = async () => {
    try {
      setSaveStatus('idle');
      const cleanNumber = data.defaultNumber.replace(/\D/g, '');
      const payload: WhatsAppTemplatesConfig = {
        ...data,
        defaultNumber: cleanNumber || data.defaultNumber,
      };
      const ok = await saveSection('whatsappSettings', payload);
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
    setData(JSON.parse(JSON.stringify(content.whatsappSettings)));
    setSaveStatus('idle');
  };

  const templateKeys: { key: keyof WhatsAppTemplatesConfig['templates']; label: string; variables: string }[] = [
    { key: 'generalEnquiry', label: 'General / Navbar CTA', variables: 'None' },
    { key: 'websitePlan', label: 'Website Plan Enquiries', variables: '{planName}, {price}' },
    { key: 'admissionPackage', label: 'Complete Admission Package', variables: '{price}' },
    { key: 'admissionIndividual', label: 'Individual Admission Deliverable', variables: '{serviceName}, {price}' },
    { key: 'examPackage', label: 'Complete Exam Package', variables: '{price}' },
    { key: 'examIndividual', label: 'Individual Exam Deliverable', variables: '{serviceName}, {price}' },
    { key: 'monthlyPlan', label: 'Monthly Creative Retainer', variables: '{planName}, {price}' },
    { key: 'bulkIdCards', label: 'Student ID Cards Order', variables: '{quantity}, {price}, {total}' },
    { key: 'bulkCertificates', label: 'Certificates Order', variables: '{quantity}, {price}, {base_design}, {total}' },
    { key: 'customEnquiry', label: 'Custom Requirement Section', variables: 'None' },
  ];

  // Test link generator
  const getTestUrl = () => {
    const rawTemplate = data.templates[testTemplate] || '';
    const sampleMsg = rawTemplate
      .replace('{planName}', 'Standard Plan')
      .replace('{price}', '₹1,999/year')
      .replace('{serviceName}', 'Online Admission Form')
      .replace('{quantity}', '100')
      .replace('{base_design}', ' + ₹149 design')
      .replace('{total}', '₹2,000');

    const cleanNum = data.defaultNumber.replace(/\D/g, '');
    return `https://wa.me/${cleanNum}?text=${encodeURIComponent(sampleMsg)}`;
  };

  return (
    <div className="space-y-6">
      <AdminSectionHeader
        title="WhatsApp Integration & Dynamic Message Templates"
        description="Every button and interactive calculator across the website compiles a custom pre-filled message using these templates."
        isSaving={isSaving}
        hasChanges={hasChanges}
        saveStatus={saveStatus}
        onSave={handleSave}
        onCancel={handleCancel}
        onPreview={onPreview}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Number & Test Sandbox */}
        <div className="space-y-6">
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
              <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <MessageCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold font-['Outfit'] text-white">
                  Target WhatsApp Account
                </h3>
                <p className="text-xs text-slate-400">Recipient number for all website traffic</p>
              </div>
            </div>

            <div className="text-xs space-y-3">
              <div>
                <label className="block text-slate-400 font-semibold mb-1">
                  Phone Digits (with country code)
                </label>
                <input
                  type="text"
                  value={data.defaultNumber}
                  onChange={(e) => setData({ ...data, defaultNumber: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-emerald-400 font-mono font-bold text-sm outline-none focus:border-emerald-500"
                  placeholder="919497122397"
                />
              </div>
            </div>
          </div>

          {/* Live Simulator Card */}
          <div className="bg-emerald-950/20 border border-emerald-800/30 rounded-3xl p-6 space-y-4">
            <div className="flex items-center gap-2">
              <Send className="w-4 h-4 text-emerald-400" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                Live WhatsApp Link Tester
              </h4>
            </div>

            <div className="text-xs space-y-3">
              <div>
                <label className="block text-slate-400 mb-1">Select Template to Test</label>
                <select
                  value={testTemplate}
                  onChange={(e) => setTestTemplate(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white outline-none cursor-pointer"
                >
                  {templateKeys.map((t) => (
                    <option key={t.key} value={t.key}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-[11px] text-slate-300 break-words whitespace-pre-wrap max-h-36 overflow-y-auto">
                {data.templates[testTemplate] || ''}
              </div>

              <a
                href={getTestUrl()}
                target="_blank"
                rel="noreferrer"
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/30 transition-all cursor-pointer"
              >
                <span>Open Sample Link in WhatsApp</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>

        {/* Right Column: Template Editors */}
        <div className="lg:col-span-2 bg-slate-900/90 border border-slate-800 rounded-3xl p-6 space-y-4">
          <h3 className="text-base font-bold font-['Outfit'] text-white pb-3 border-b border-slate-800">
            Pre-Filled Message Templates ({templateKeys.length})
          </h3>

          <div className="space-y-4 max-h-[680px] overflow-y-auto pr-2">
            {templateKeys.map((item) => (
              <div key={item.key} className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-sm">{item.label}</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-blue-400 border border-slate-800">
                    Variables: {item.variables}
                  </span>
                </div>

                <textarea
                  rows={2}
                  value={data.templates[item.key] || ''}
                  onChange={(e) => {
                    setData({
                      ...data,
                      templates: {
                        ...data.templates,
                        [item.key]: e.target.value,
                      },
                    });
                  }}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 font-mono text-xs outline-none focus:border-blue-500"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
