import React, { useState } from 'react';
import {
  LayoutDashboard,
  Sparkles,
  Layers,
  Globe,
  GraduationCap,
  FileCheck,
  Palette,
  CreditCard,
  MessageSquare,
  School,
  GitBranch,
  ShieldCheck,
  HelpCircle,
  Phone,
  PanelBottom,
  MessageCircle,
  Settings,
  LogOut,
  ExternalLink,
  Menu,
  X,
  ChevronRight,
  ArrowLeft,
} from 'lucide-react';
import { useContent } from '../../context/ContentContext';

// Import Section Editors
import { DashboardOverview } from './sections/DashboardOverview';
import { HeroEditor } from './sections/HeroEditor';
import { ServicesEditor } from './sections/ServicesEditor';
import { WebsitePlansEditor } from './sections/WebsitePlansEditor';
import { AdmissionServicesEditor } from './sections/AdmissionServicesEditor';
import { ExamServicesEditor } from './sections/ExamServicesEditor';
import { MonthlyPlansEditor } from './sections/MonthlyPlansEditor';
import { BulkPricingEditor } from './sections/BulkPricingEditor';
import { CustomEnquiryEditor } from './sections/CustomEnquiryEditor';
import { ClientsEditor } from './sections/ClientsEditor';
import { HowItWorksEditor } from './sections/HowItWorksEditor';
import { WhyElevateEditor } from './sections/WhyElevateEditor';
import { FaqEditor } from './sections/FaqEditor';
import { ContactEditor } from './sections/ContactEditor';
import { FooterEditor } from './sections/FooterEditor';
import { WhatsAppEditor } from './sections/WhatsAppEditor';
import { GeneralEditor } from './sections/GeneralEditor';

export type AdminSectionKey =
  | 'dashboard'
  | 'hero'
  | 'services'
  | 'websitePlans'
  | 'admissionServices'
  | 'examServices'
  | 'monthlyPlans'
  | 'bulkPricing'
  | 'customEnquiry'
  | 'clientInstitutions'
  | 'howItWorks'
  | 'whyElevate'
  | 'faq'
  | 'contact'
  | 'footer'
  | 'whatsapp'
  | 'general';

interface NavItem {
  id: AdminSectionKey;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  category: 'Overview' | 'Commercial Services' | 'Brand & Narrative' | 'System & Settings';
}

const NAV_ITEMS: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, category: 'Overview' },
  { id: 'hero', label: 'Hero / Homepage', icon: Sparkles, category: 'Commercial Services' },
  { id: 'services', label: 'Services Overview', icon: Layers, category: 'Commercial Services' },
  { id: 'websitePlans', label: 'Website Plans', icon: Globe, category: 'Commercial Services' },
  { id: 'admissionServices', label: 'Admission Services', icon: GraduationCap, category: 'Commercial Services' },
  { id: 'examServices', label: 'Exam Services', icon: FileCheck, category: 'Commercial Services' },
  { id: 'monthlyPlans', label: 'Monthly Creative Plans', icon: Palette, category: 'Commercial Services' },
  { id: 'bulkPricing', label: 'Bulk Pricing', icon: CreditCard, category: 'Commercial Services' },
  { id: 'customEnquiry', label: 'Custom Enquiry', icon: MessageSquare, category: 'Commercial Services' },
  { id: 'clientInstitutions', label: 'Client Institutions', icon: School, category: 'Brand & Narrative' },
  { id: 'howItWorks', label: 'How It Works', icon: GitBranch, category: 'Brand & Narrative' },
  { id: 'whyElevate', label: 'Why ELEVATE', icon: ShieldCheck, category: 'Brand & Narrative' },
  { id: 'faq', label: 'FAQ', icon: HelpCircle, category: 'Brand & Narrative' },
  { id: 'contact', label: 'Contact Information', icon: Phone, category: 'System & Settings' },
  { id: 'footer', label: 'Footer & Links', icon: PanelBottom, category: 'System & Settings' },
  { id: 'whatsapp', label: 'WhatsApp Settings', icon: MessageCircle, category: 'System & Settings' },
  { id: 'general', label: 'General Settings', icon: Settings, category: 'System & Settings' },
];

export interface AdminDashboardProps {
  onBackToSite?: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onBackToSite }) => {
  const { logout, adminSession } = useContent();
  const user = adminSession?.user;
  const [activeSection, setActiveSection] = useState<AdminSectionKey>('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handlePreview = () => {
    window.open('/', '_blank');
  };

  const handleNavigate = (key: string) => {
    const map: Record<string, AdminSectionKey> = {
      websites: 'websitePlans',
      website: 'websitePlans',
      admission: 'admissionServices',
      exam: 'examServices',
      monthly: 'monthlyPlans',
      bulk: 'bulkPricing',
      clients: 'clientInstitutions',
      'custom-enquiry': 'customEnquiry',
      'how-it-works': 'howItWorks',
      'why-elevate': 'whyElevate',
    };
    const target = map[key] || (key as AdminSectionKey);
    setActiveSection(target);
    setMobileMenuOpen(false);
  };

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'dashboard':
        return <DashboardOverview onNavigate={handleNavigate} />;
      case 'hero':
        return <HeroEditor onPreview={handlePreview} />;
      case 'services':
        return <ServicesEditor onPreview={handlePreview} />;
      case 'websitePlans':
        return <WebsitePlansEditor onPreview={handlePreview} />;
      case 'admissionServices':
        return <AdmissionServicesEditor onPreview={handlePreview} />;
      case 'examServices':
        return <ExamServicesEditor onPreview={handlePreview} />;
      case 'monthlyPlans':
        return <MonthlyPlansEditor onPreview={handlePreview} />;
      case 'bulkPricing':
        return <BulkPricingEditor onPreview={handlePreview} />;
      case 'customEnquiry':
        return <CustomEnquiryEditor onPreview={handlePreview} />;
      case 'clientInstitutions':
        return <ClientsEditor onPreview={handlePreview} />;
      case 'howItWorks':
        return <HowItWorksEditor onPreview={handlePreview} />;
      case 'whyElevate':
        return <WhyElevateEditor onPreview={handlePreview} />;
      case 'faq':
        return <FaqEditor onPreview={handlePreview} />;
      case 'contact':
        return <ContactEditor onPreview={handlePreview} />;
      case 'footer':
        return <FooterEditor onPreview={handlePreview} />;
      case 'whatsapp':
        return <WhatsAppEditor onPreview={handlePreview} />;
      case 'general':
        return <GeneralEditor onPreview={handlePreview} />;
      default:
        return <DashboardOverview onNavigate={(sec) => setActiveSection(sec as AdminSectionKey)} />;
    }
  };

  const categories = ['Overview', 'Commercial Services', 'Brand & Narrative', 'System & Settings'] as const;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Header Bar */}
      <header className="h-16 bg-slate-900/95 border-b border-slate-800/80 sticky top-0 z-40 backdrop-blur-md flex items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shadow-md shadow-blue-500/20 font-bold font-['Outfit'] text-white text-base tracking-wider">
              E
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold tracking-tight text-white font-['Outfit'] text-base">
                  ELEVATE
                </span>
                <span className="px-1.5 py-0.5 rounded bg-blue-500/10 border border-blue-500/30 text-blue-400 text-[10px] font-mono font-bold">
                  ADMIN
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">Central Website Control Center</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {onBackToSite && (
            <button
              type="button"
              onClick={onBackToSite}
              className="px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer border border-slate-700/80"
              title="Return to ELEVATE public website"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Exit to Website</span>
              <span className="sm:hidden">Exit</span>
            </button>
          )}

          <button
            type="button"
            onClick={handlePreview}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer border border-slate-700"
            title="Open website in new tab"
          >
            <span className="hidden sm:inline">View Public Website</span>
            <span className="sm:hidden">Website</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={logout}
            className="px-3 py-1.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer border border-red-500/20"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar Desktop */}
        <aside className="w-64 bg-slate-900/60 border-r border-slate-800/80 hidden lg:flex flex-col shrink-0">
          <div className="p-4 flex-1 overflow-y-auto space-y-6 text-xs">
            {categories.map((cat) => (
              <div key={cat} className="space-y-1">
                <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  {cat}
                </div>
                {NAV_ITEMS.filter((n) => n.category === cat).map((item) => {
                  const Icon = item.icon;
                  const isActive = activeSection === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setActiveSection(item.id)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl font-medium transition-all cursor-pointer ${
                        isActive
                          ? 'bg-blue-600 text-white font-semibold shadow-sm'
                          : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                        <span>{item.label}</span>
                      </div>
                      {isActive && <ChevronRight className="w-3.5 h-3.5 text-blue-200" />}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>

          {/* User profile footer */}
          <div className="p-4 border-t border-slate-800/80 bg-slate-950/40 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 font-bold text-[11px]">
                {user?.username?.charAt(0).toUpperCase() || 'A'}
              </div>
              <div className="overflow-hidden">
                <p className="font-semibold text-slate-200 truncate">{user?.username || 'admin'}</p>
                <p className="text-[10px] text-emerald-400">Authenticated</p>
              </div>
            </div>
            <button
              type="button"
              onClick={logout}
              title="Logout"
              className="p-1.5 text-slate-400 hover:text-red-400 transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </aside>

        {/* Mobile Sidebar Overlay */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex">
            <div
              className="fixed inset-0 bg-black/70 backdrop-blur-sm"
              onClick={() => setMobileMenuOpen(false)}
            />
            <div className="relative w-72 bg-slate-900 border-r border-slate-800 flex flex-col z-10">
              <div className="p-4 border-b border-slate-800 flex items-center justify-between">
                <span className="font-bold text-white font-['Outfit']">Navigation</span>
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1 rounded bg-slate-800 text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-4 flex-1 overflow-y-auto space-y-5 text-xs">
                {categories.map((cat) => (
                  <div key={cat} className="space-y-1">
                    <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                      {cat}
                    </div>
                    {NAV_ITEMS.filter((n) => n.category === cat).map((item) => {
                      const Icon = item.icon;
                      const isActive = activeSection === item.id;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => {
                            setActiveSection(item.id);
                            setMobileMenuOpen(false);
                          }}
                          className={`w-full flex items-center justify-between px-3 py-2 rounded-xl font-medium transition-all ${
                            isActive
                              ? 'bg-blue-600 text-white font-semibold'
                              : 'text-slate-400 hover:text-white hover:bg-slate-800'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <Icon className="w-4 h-4" />
                            <span>{item.label}</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-8 lg:p-10 max-w-7xl mx-auto w-full">
          {renderActiveSection()}
        </main>
      </div>
    </div>
  );
};
