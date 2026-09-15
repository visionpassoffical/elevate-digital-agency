import React, { useState } from 'react';
import { Lock, User, ArrowLeft, Eye, EyeOff, ShieldCheck, AlertCircle, Sparkles } from 'lucide-react';
import { useContent } from '../../context/ContentContext';

interface AdminLoginProps {
  onBackToSite: () => void;
  onSuccess: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onBackToSite, onSuccess }) => {
  const { login } = useContent();
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password) {
      setError('Please enter both username and password.');
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      const res = await login(username.trim(), password);
      if (res.success) {
        onSuccess();
      } else {
        setError(res.error || 'Invalid credentials. Please verify your username and password.');
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected connection error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0F17] flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden text-slate-100">
      {/* Ambient background glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#0062EB]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top back button */}
      <div className="absolute top-6 left-6 z-20">
        <button
          type="button"
          onClick={onBackToSite}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white text-sm font-medium transition-all cursor-pointer shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to ELEVATE Website</span>
        </button>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4">
        {/* Brand emblem */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#0062EB]/10 border border-[#0062EB]/30 text-[#0062EB] shadow-lg mb-4">
            <ShieldCheck className="w-8 h-8 text-[#0062EB]" />
          </div>
          <h1 className="font-['Outfit'] font-extrabold text-2xl sm:text-3xl text-white tracking-tight">
            ELEVATE Control Center
          </h1>
          <p className="mt-2 text-sm text-slate-400">
            Secure administrative access for website content and pricing
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-3xl p-7 sm:p-9 shadow-2xl">
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-950/50 border border-red-800/80 text-red-200 text-sm flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                Administrator Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin"
                  required
                  autoComplete="username"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-950/70 border border-slate-700/80 focus:border-[#0062EB] focus:ring-2 focus:ring-[#0062EB]/20 text-white placeholder-slate-500 text-sm outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                  Admin Password
                </label>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  autoComplete="current-password"
                  className="w-full pl-10 pr-11 py-3 rounded-xl bg-slate-950/70 border border-slate-700/80 focus:border-[#0062EB] focus:ring-2 focus:ring-[#0062EB]/20 text-white placeholder-slate-500 text-sm outline-none transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-200 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 px-4 rounded-xl bg-[#0062EB] hover:bg-blue-600 active:scale-[0.99] text-white font-bold text-sm tracking-wide transition-all shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed mt-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Log In to Admin Dashboard</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-800 text-center">
            <div className="text-xs text-slate-500 flex items-center justify-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              <span>Full control over prices, services, WhatsApp templates & institutions.</span>
            </div>
          </div>
        </div>

        <div className="text-center mt-6 text-xs text-slate-500">
          ELEVATE Digital Solutions • Protected Administrative Gateway
        </div>
      </div>
    </div>
  );
};
