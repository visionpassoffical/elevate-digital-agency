import React, { useState } from 'react';
import { Phone, Mail, MapPin, Clock, Zap, MessageCircle } from 'lucide-react';
import { useContent } from '../../../context/ContentContext';
import { AdminSectionHeader } from '../AdminSectionHeader';
import type { ContactConfig } from '../../../types';

export const ContactEditor: React.FC<{ onPreview: () => void }> = ({ onPreview }) => {
  const { content, saveSection, isSaving } = useContent();
  const [data, setData] = useState<ContactConfig>(() =>
    JSON.parse(JSON.stringify(content.contact))
  );
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const hasChanges = JSON.stringify(data) !== JSON.stringify(content.contact);

  const handleSave = async () => {
    try {
      setSaveStatus('idle');
      // Sync whatsappDigits automatically if formatted number changed
      const cleanDigits = data.whatsappNumber.replace(/\D/g, '');
      const payload: ContactConfig = {
        ...data,
        whatsappDigits: cleanDigits || data.whatsappDigits,
      };
      const ok = await saveSection('contact', payload);
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
    setData(JSON.parse(JSON.stringify(content.contact)));
    setSaveStatus('idle');
  };

  return (
    <div className="space-y-6">
      <AdminSectionHeader
        title="Contact Information & Channels"
        description="Configure the primary institutional WhatsApp number (+91 94971 22397), official email notices, operating hours, and turnaround commitments."
        isSaving={isSaving}
        hasChanges={hasChanges}
        saveStatus={saveStatus}
        onSave={handleSave}
        onCancel={handleCancel}
        onPreview={onPreview}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Primary Contact Channels */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 space-y-5">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Phone className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold font-['Outfit'] text-white">
                Primary WhatsApp & Direct Phone
              </h3>
              <p className="text-xs text-slate-400">
                The single number used for all client enquiries and automated links
              </p>
            </div>
          </div>

          <div className="text-xs space-y-4">
            <div>
              <label className="block text-slate-400 font-semibold mb-1">
                WhatsApp Display Number
              </label>
              <input
                type="text"
                value={data.whatsappNumber}
                onChange={(e) => {
                  const val = e.target.value;
                  const digits = val.replace(/\D/g, '');
                  setData({
                    ...data,
                    whatsappNumber: val,
                    whatsappDigits: digits,
                    phoneNumber: val,
                  });
                }}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-emerald-400 font-bold text-sm outline-none focus:border-emerald-500"
                placeholder="+91 94971 22397"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1">
                Clean Phone Digits (for wa.me links, country code included)
              </label>
              <input
                type="text"
                value={data.whatsappDigits}
                onChange={(e) => setData({ ...data, whatsappDigits: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 font-mono outline-none focus:border-blue-500"
                placeholder="919497122397"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1">Direct Calling Phone</label>
              <input
                type="text"
                value={data.phoneNumber}
                onChange={(e) => setData({ ...data, phoneNumber: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1">Contact Section CTA Text</label>
              <input
                type="text"
                value={data.ctaText}
                onChange={(e) => setData({ ...data, ctaText: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white outline-none focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Email & Support Guidelines */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 space-y-5">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold font-['Outfit'] text-white">
                Email & Operational Commitment
              </h3>
              <p className="text-xs text-slate-400">Institutional address, hours, and response SLAs</p>
            </div>
          </div>

          <div className="text-xs space-y-4">
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Official Email Address</label>
              <input
                type="email"
                value={data.email}
                onChange={(e) => setData({ ...data, email: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1">Email Notice Note</label>
              <textarea
                rows={2}
                value={data.emailNote}
                onChange={(e) => setData({ ...data, emailNote: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1">Physical Location / Region</label>
              <input
                type="text"
                value={data.address}
                onChange={(e) => setData({ ...data, address: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1">Support Operating Hours</label>
              <input
                type="text"
                value={data.supportHours}
                onChange={(e) => setData({ ...data, supportHours: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1">
                Turnaround SLA Commitment
              </label>
              <input
                type="text"
                value={data.turnaroundTarget}
                onChange={(e) => setData({ ...data, turnaroundTarget: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white outline-none focus:border-blue-500"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
