import React from 'react';
import {
  Globe,
  UserCheck,
  CheckSquare,
  Palette,
  FileText,
  School,
  Phone,
  MessageCircle,
  TrendingUp,
  Settings,
  ArrowUpRight,
  ShieldCheck,
  Clock,
  RotateCcw,
} from 'lucide-react';
import { useContent } from '../../../context/ContentContext';

interface DashboardOverviewProps {
  onNavigate: (sectionId: string) => void;
  onPreview: () => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({ onNavigate, onPreview }) => {
  const { content, resetContent } = useContent();

  const handleReset = async () => {
    if (
      window.confirm(
        'WARNING: Are you sure you want to reset all site content and pricing to the initial approved defaults? This will overwrite your custom modifications.'
      )
    ) {
      const ok = await resetContent();
      if (ok) {
        alert('All site content has been reset to defaults.');
      } else {
        alert('Failed to reset content.');
      }
    }
  };

  const statCards = [
    {
      title: 'Website Plans',
      count: content.websitePlans.length,
      detail: `${content.websitePlans.filter((p) => p.isAvailable).length} Active`,
      icon: Globe,
      color: 'from-blue-500/20 to-blue-600/10 text-blue-400 border-blue-500/30',
      sectionId: 'websites',
    },
    {
      title: 'Admission Suite',
      count: content.admissionServices.individual.length + 1,
      detail: `Package at ₹${content.admissionServices.package.price}`,
      icon: UserCheck,
      color: 'from-emerald-500/20 to-emerald-600/10 text-emerald-400 border-emerald-500/30',
      sectionId: 'admission',
    },
    {
      title: 'Exam Suite',
      count: content.examServices.individual.length + 1,
      detail: `Package at ₹${content.examServices.package.price}`,
      icon: CheckSquare,
      color: 'from-indigo-500/20 to-indigo-600/10 text-indigo-400 border-indigo-500/30',
      sectionId: 'exam',
    },
    {
      title: 'Monthly Creatives',
      count: content.monthlyCreativePlans.plans.length,
      detail: `From ₹${content.monthlyCreativePlans.plans[0]?.price || 499}/mo`,
      icon: Palette,
      color: 'from-amber-500/20 to-amber-600/10 text-amber-400 border-amber-500/30',
      sectionId: 'monthly',
    },
    {
      title: 'Bulk Publishing',
      count: 2,
      detail: 'ID Cards & Certificates',
      icon: FileText,
      color: 'from-purple-500/20 to-purple-600/10 text-purple-400 border-purple-500/30',
      sectionId: 'bulk',
    },
    {
      title: 'Partner Institutions',
      count: content.clientInstitutions.list.length,
      detail: `${content.clientInstitutions.list.filter((c) => c.enabled).length} Displayed`,
      icon: School,
      color: 'from-cyan-500/20 to-cyan-600/10 text-cyan-400 border-cyan-500/30',
      sectionId: 'clients',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-blue-950/40 border border-slate-800 rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#0062EB]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0062EB]/15 border border-[#0062EB]/30 text-blue-400 text-xs font-semibold mb-3">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Central Admin Control Center</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold font-['Outfit'] text-white tracking-tight">
              Welcome to the ELEVATE Command Center
            </h1>
            <p className="text-slate-400 text-sm max-w-2xl mt-2 leading-relaxed">
              Manage all editable public website content from one central dashboard. Update pricing,
              services, feature lists, WhatsApp response templates, client institutions, and general
              settings in real time.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={onPreview}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold flex items-center gap-2 border border-slate-700 shadow-md transition-all cursor-pointer"
            >
              <span>View Public Website</span>
              <ArrowUpRight className="w-4 h-4 text-slate-400" />
            </button>
            <button
              type="button"
              onClick={() => onNavigate('general')}
              className="px-4 py-2.5 rounded-xl bg-[#0062EB] hover:bg-blue-600 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-blue-500/25 transition-all cursor-pointer"
            >
              <Settings className="w-4 h-4" />
              <span>General Settings</span>
            </button>
          </div>
        </div>

        {/* System Meta Row */}
        <div className="mt-6 pt-5 border-t border-slate-800/80 flex flex-wrap items-center justify-between text-xs text-slate-400 gap-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-slate-500" />
              <span>Last Content Update: {new Date(content.lastUpdated).toLocaleString()}</span>
            </div>
            <span className="text-slate-600">•</span>
            <span>Version: v{content.version}</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-emerald-400 font-medium">Live Storage Synchronized</span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.title}
              onClick={() => onNavigate(card.sectionId)}
              className="bg-slate-900/80 hover:bg-slate-800/80 border border-slate-800 rounded-2xl p-5 transition-all cursor-pointer group hover:border-slate-700 shadow-lg"
            >
              <div className="flex items-start justify-between">
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${card.color} border flex items-center justify-center`}
                >
                  <Icon className="w-6 h-6" />
                </div>
                <span className="text-xs text-slate-400 group-hover:text-blue-400 flex items-center gap-1 transition-colors">
                  <span>Edit</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </span>
              </div>
              <div className="mt-4">
                <div className="text-2xl font-bold font-['Outfit'] text-white">{card.count}</div>
                <div className="text-sm font-semibold text-slate-200 mt-0.5">{card.title}</div>
                <div className="text-xs text-slate-400 mt-1">{card.detail}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Live Rate Card Matrix */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-xl">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-lg font-bold font-['Outfit'] text-white">Current Live Pricing Matrix</h3>
            <p className="text-xs text-slate-400 mt-1">
              Real-time prices currently shown across the public website components
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('whatsapp')}
            className="text-xs text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1 cursor-pointer"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>WhatsApp Target: {content.contact.whatsappNumber}</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/60 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Service / Package</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Current Public Price</th>
                <th className="py-3 px-4">Availability</th>
                <th className="py-3 px-4 text-right">Quick Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-medium">
              {content.websitePlans.map((plan) => (
                <tr key={plan.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-4 font-semibold text-white">{plan.name}</td>
                  <td className="py-3 px-4 text-slate-400">Website</td>
                  <td className="py-3 px-4 text-emerald-400 font-semibold">
                    {plan.price} {plan.billingCycle}
                  </td>
                  <td className="py-3 px-4">
                    {plan.isAvailable ? (
                      <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 text-[11px] font-bold">
                        Live / Available
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-400 text-[11px] font-bold">
                        {plan.unavailableStatus || 'Unavailable'}
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      type="button"
                      onClick={() => onNavigate('websites')}
                      className="text-blue-400 hover:underline cursor-pointer"
                    >
                      Edit Plan
                    </button>
                  </td>
                </tr>
              ))}

              <tr className="hover:bg-slate-800/40 transition-colors">
                <td className="py-3 px-4 font-semibold text-white">
                  {content.admissionServices.package.name}
                </td>
                <td className="py-3 px-4 text-slate-400">Admission Suite</td>
                <td className="py-3 px-4 text-emerald-400 font-semibold">
                  ₹{content.admissionServices.package.price}
                </td>
                <td className="py-3 px-4">
                  <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 text-[11px] font-bold">
                    Live Package
                  </span>
                </td>
                <td className="py-3 px-4 text-right">
                  <button
                    type="button"
                    onClick={() => onNavigate('admission')}
                    className="text-blue-400 hover:underline cursor-pointer"
                  >
                    Edit Package
                  </button>
                </td>
              </tr>

              <tr className="hover:bg-slate-800/40 transition-colors">
                <td className="py-3 px-4 font-semibold text-white">
                  {content.examServices.package.name}
                </td>
                <td className="py-3 px-4 text-slate-400">Exam Suite</td>
                <td className="py-3 px-4 text-emerald-400 font-semibold">
                  ₹{content.examServices.package.price}
                </td>
                <td className="py-3 px-4">
                  <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 text-[11px] font-bold">
                    Live Package
                  </span>
                </td>
                <td className="py-3 px-4 text-right">
                  <button
                    type="button"
                    onClick={() => onNavigate('exam')}
                    className="text-blue-400 hover:underline cursor-pointer"
                  >
                    Edit Package
                  </button>
                </td>
              </tr>

              {content.monthlyCreativePlans.plans.map((p) => (
                <tr key={p.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-4 font-semibold text-white">{p.name}</td>
                  <td className="py-3 px-4 text-slate-400">Design Retainer</td>
                  <td className="py-3 px-4 text-emerald-400 font-semibold">
                    ₹{p.price}/mo ({p.creativesCount} creatives)
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 text-[11px] font-bold">
                      {p.badge || 'Available'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      type="button"
                      onClick={() => onNavigate('monthly')}
                      className="text-blue-400 hover:underline cursor-pointer"
                    >
                      Edit Retainer
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Launchpad to all 17 Admin Sections */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-xl">
        <h3 className="text-lg font-bold font-['Outfit'] text-white mb-2">Admin Section Navigation</h3>
        <p className="text-xs text-slate-400 mb-5">
          Select any section below to customize its headlines, prices, toggle visibility, and adjust messaging.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {[
            { id: 'hero', label: 'Hero / Homepage', icon: Globe },
            { id: 'services', label: 'Services Grid', icon: TrendingUp },
            { id: 'websites', label: 'Website Plans', icon: Globe },
            { id: 'admission', label: 'Admission Suite', icon: UserCheck },
            { id: 'exam', label: 'Exam Suite', icon: CheckSquare },
            { id: 'monthly', label: 'Monthly Creatives', icon: Palette },
            { id: 'bulk', label: 'Bulk ID & Certs', icon: FileText },
            { id: 'custom-enquiry', label: 'Custom Requirement', icon: MessageCircle },
            { id: 'clients', label: 'Client Institutions', icon: School },
            { id: 'how-it-works', label: 'How It Works', icon: Clock },
            { id: 'why-elevate', label: 'Why ELEVATE', icon: ShieldCheck },
            { id: 'faq', label: 'FAQ Section', icon: MessageCircle },
            { id: 'contact', label: 'Contact Details', icon: Phone },
            { id: 'footer', label: 'Footer Links', icon: FileText },
            { id: 'whatsapp', label: 'WhatsApp Templates', icon: MessageCircle },
            { id: 'general', label: 'General & Password', icon: Settings },
          ].map((sec) => {
            const Icon = sec.icon;
            return (
              <button
                key={sec.id}
                type="button"
                onClick={() => onNavigate(sec.id)}
                className="p-3.5 rounded-xl bg-slate-950/60 hover:bg-slate-800 border border-slate-800/80 hover:border-blue-500/40 text-left transition-all group flex items-center gap-3 cursor-pointer"
              >
                <div className="w-8 h-8 rounded-lg bg-slate-800 group-hover:bg-[#0062EB]/20 text-slate-300 group-hover:text-blue-400 flex items-center justify-center shrink-0 transition-colors">
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-xs font-semibold text-slate-200 group-hover:text-white truncate">
                  {sec.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Dangerous Operations Zone */}
      <div className="bg-red-950/20 border border-red-900/40 rounded-3xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h4 className="text-sm font-bold text-red-300 flex items-center gap-2">
            <RotateCcw className="w-4 h-4 text-red-400" />
            <span>Reset Content to Factory Baseline</span>
          </h4>
          <p className="text-xs text-red-400/80 mt-1 max-w-xl">
            Reset all prices, service items, client institutions, and configurations back to the initial
            approved ELEVATE defaults.
          </p>
        </div>
        <button
          type="button"
          onClick={handleReset}
          className="px-4 py-2 rounded-xl bg-red-900/40 hover:bg-red-900/70 border border-red-700/60 text-red-200 text-xs font-bold transition-all cursor-pointer shrink-0"
        >
          Reset Content to Defaults
        </button>
      </div>
    </div>
  );
};
