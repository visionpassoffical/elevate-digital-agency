import React, { useState } from 'react';
import { Settings, Lock, RotateCcw, ShieldAlert, Upload, Key, CheckCircle } from 'lucide-react';
import { useContent } from '../../../context/ContentContext';
import { AdminSectionHeader } from '../AdminSectionHeader';
import type { GeneralConfig } from '../../../types';

export const GeneralEditor: React.FC<{ onPreview: () => void }> = ({ onPreview }) => {
  const { content, saveSection, isSaving, uploadFile, resetContent } = useContent();
  const [data, setData] = useState<GeneralConfig>(() =>
    JSON.parse(JSON.stringify(content.general))
  );
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');

  // Password change state
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordStatus, setPasswordStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [passwordMsg, setPasswordMsg] = useState('');

  // Reset modal state
  const [isResetting, setIsResetting] = useState(false);

  const hasChanges = JSON.stringify(data) !== JSON.stringify(content.general);

  const handleSave = async () => {
    try {
      setSaveStatus('idle');
      const ok = await saveSection('general', data);
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
    setData(JSON.parse(JSON.stringify(content.general)));
    setSaveStatus('idle');
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const res = await uploadFile(file);
      if (res?.url) {
        setData({ ...data, logoUrl: res.url });
      }
    } catch (err: any) {
      alert(err.message || 'Logo upload failed');
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!oldPassword || !newPassword) {
      setPasswordStatus('error');
      setPasswordMsg('Please fill in both current and new passwords.');
      return;
    }
    if (newPassword.length < 6) {
      setPasswordStatus('error');
      setPasswordMsg('New password must be at least 6 characters long.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordStatus('error');
      setPasswordMsg('New passwords do not match.');
      return;
    }

    try {
      setPasswordStatus('loading');
      setPasswordMsg('');
      const token = localStorage.getItem('elevate_admin_token');
      const res = await fetch('/api/admin/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ oldPassword, newPassword }),
      });

      const json = await res.json();
      if (res.ok && json.success) {
        setPasswordStatus('success');
        setPasswordMsg('Admin password successfully updated!');
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setPasswordStatus('error');
        setPasswordMsg(json.message || 'Failed to update password.');
      }
    } catch (err: any) {
      setPasswordStatus('error');
      setPasswordMsg(err.message || 'Network error.');
    }
  };

  const handleFactoryReset = async () => {
    if (
      window.confirm(
        '⚠️ CRITICAL WARNING: This will reset all 17 website sections, pricing tiers, and custom text back to initial default values. Are you completely sure?'
      )
    ) {
      const confirmWord = window.prompt('Type "RESET" in capital letters to confirm:');
      if (confirmWord === 'RESET') {
        setIsResetting(true);
        const ok = await resetContent();
        setIsResetting(false);
        if (ok) {
          alert('Site successfully restored to factory defaults.');
          window.location.reload();
        } else {
          alert('Failed to reset content.');
        }
      }
    }
  };

  return (
    <div className="space-y-6">
      <AdminSectionHeader
        title="General Settings & Administrator Security"
        description="Configure core website branding, SEO metadata, update administrator credentials, or manage system backup resets."
        isSaving={isSaving}
        hasChanges={hasChanges}
        saveStatus={saveStatus}
        onSave={handleSave}
        onCancel={handleCancel}
        onPreview={onPreview}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Brand & SEO Settings */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold font-['Outfit'] text-white">
                Brand & SEO Configuration
              </h3>
              <p className="text-xs text-slate-400">Website title and metadata</p>
            </div>
          </div>

          <div className="text-xs space-y-4">
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Site Title</label>
              <input
                type="text"
                value={data.siteTitle}
                onChange={(e) => setData({ ...data, siteTitle: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-semibold outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1">SEO Description</label>
              <textarea
                rows={3}
                value={data.metaDescription}
                onChange={(e) => setData({ ...data, metaDescription: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1">Brand Logo URL or Upload</label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={data.logoUrl || ''}
                  onChange={(e) => setData({ ...data, logoUrl: e.target.value })}
                  placeholder="/assets/logo.png"
                  className="flex-1 px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-xs outline-none focus:border-blue-500"
                />
                <label className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white cursor-pointer flex items-center gap-1.5 shrink-0">
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload</span>
                  <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Change Admin Password */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold font-['Outfit'] text-white">
                Change Admin Password
              </h3>
              <p className="text-xs text-slate-400">Update credentials for /admin authentication</p>
            </div>
          </div>

          <form onSubmit={handlePasswordChange} className="text-xs space-y-3">
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Current Password</label>
              <input
                type="password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                placeholder="Enter current password"
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1">New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="At least 6 characters"
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1">Confirm New Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white outline-none focus:border-purple-500"
              />
            </div>

            {passwordMsg && (
              <div
                className={`p-2.5 rounded-xl text-xs flex items-center gap-2 ${
                  passwordStatus === 'success'
                    ? 'bg-emerald-950/40 text-emerald-300 border border-emerald-800/40'
                    : 'bg-red-950/40 text-red-300 border border-red-800/40'
                }`}
              >
                {passwordStatus === 'success' ? (
                  <CheckCircle className="w-4 h-4 shrink-0" />
                ) : (
                  <ShieldAlert className="w-4 h-4 shrink-0" />
                )}
                <span>{passwordMsg}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={passwordStatus === 'loading'}
              className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
            >
              <Key className="w-3.5 h-3.5" />
              <span>{passwordStatus === 'loading' ? 'Updating...' : 'Update Password'}</span>
            </button>
          </form>
        </div>
      </div>

      {/* Danger Zone: Factory Reset */}
      <div className="bg-red-950/20 border border-red-800/40 rounded-3xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-red-400 font-bold text-sm">
            <RotateCcw className="w-4 h-4" />
            <span>Reset Content to Factory Defaults</span>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            Reverts all packages, pricing numbers, FAQs, and WhatsApp templates back to the original ELEVATE baseline.
          </p>
        </div>

        <button
          type="button"
          onClick={handleFactoryReset}
          disabled={isResetting}
          className="px-4 py-2 rounded-xl bg-red-600/80 hover:bg-red-600 text-white text-xs font-bold transition-all cursor-pointer shrink-0 disabled:opacity-50"
        >
          {isResetting ? 'Restoring...' : 'Reset to Defaults'}
        </button>
      </div>
    </div>
  );
};
