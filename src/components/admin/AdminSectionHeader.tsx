import React from 'react';
import { Save, RefreshCw, Eye, CheckCircle2, AlertCircle } from 'lucide-react';

interface AdminSectionHeaderProps {
  title: string;
  description: string;
  isSaving: boolean;
  hasChanges: boolean;
  saveStatus: 'idle' | 'success' | 'error';
  onSave: () => void;
  onCancel: () => void;
  onPreview?: () => void;
}

export const AdminSectionHeader: React.FC<AdminSectionHeaderProps> = ({
  title,
  description,
  isSaving,
  hasChanges,
  saveStatus,
  onSave,
  onCancel,
  onPreview,
}) => {
  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 mb-6 sticky top-4 z-20 shadow-xl backdrop-blur-md">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold font-['Outfit'] text-white tracking-tight">{title}</h2>
            {hasChanges && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                Unsaved Changes
              </span>
            )}
            {saveStatus === 'success' && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 animate-fade-in">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Changes saved successfully.
              </span>
            )}
            {saveStatus === 'error' && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-red-500/10 text-red-400 border border-red-500/20">
                <AlertCircle className="w-3.5 h-3.5" />
                Failed to save changes
              </span>
            )}
          </div>
          <p className="text-xs text-slate-400 mt-1">{description}</p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          {onPreview && (
            <button
              type="button"
              onClick={onPreview}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold transition-all flex items-center gap-1.5 border border-slate-700 cursor-pointer"
              title="Preview changes on website"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Preview</span>
            </button>
          )}

          <button
            type="button"
            onClick={onCancel}
            disabled={!hasChanges || isSaving}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold transition-all flex items-center gap-1.5 border border-slate-700 cursor-pointer disabled:cursor-not-allowed"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Cancel</span>
          </button>

          <button
            type="button"
            onClick={onSave}
            disabled={isSaving}
            className="px-4 py-2 rounded-xl bg-[#0062EB] hover:bg-blue-600 active:scale-[0.98] text-white text-xs font-bold transition-all shadow-md shadow-blue-500/20 flex items-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="w-3.5 h-3.5" />
                <span>Save Changes</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
