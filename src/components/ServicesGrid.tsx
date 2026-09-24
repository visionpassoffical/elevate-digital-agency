import React, { useState } from 'react';
import { Globe, UserCheck, CheckSquare, Palette, FileText, ArrowRight, CheckCircle2, Sparkles, HelpCircle, Zap, ShieldCheck, Layers, ExternalLink, Lock, Menu, Download } from 'lucide-react';
import { useContent } from '../context/ContentContext';

interface ServicesGridProps {
  onSelectService: (serviceTitle: string) => void;
}

const getServiceIcon = (iconName?: string) => {
  switch (iconName) {
    case 'Globe':
      return <Globe className="w-5 h-5 text-[#3B82F6]" />;
    case 'UserCheck':
      return <UserCheck className="w-5 h-5 text-emerald-400" />;
    case 'CheckSquare':
      return <CheckSquare className="w-5 h-5 text-purple-400" />;
    case 'Palette':
      return <Palette className="w-5 h-5 text-amber-400" />;
    case 'FileText':
      return <FileText className="w-5 h-5 text-cyan-400" />;
    default:
      return <Sparkles className="w-5 h-5 text-[#3B82F6]" />;
  }
};

export const ServicesGrid: React.FC<ServicesGridProps> = ({ onSelectService }) => {
  const { content } = useContent();
  const servicesList = (content.services || []).filter((s) => s.enabled !== false);

  const [activeDeviceView, setActiveDeviceView] = useState<'desktop' | 'mobile'>('desktop');

  const scrollToTarget = (targetId: string, title: string) => {
    const el = document.getElementById(targetId);
    if (el) {
      const offset = 80;
      const top = el.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top, behavior: 'smooth' });
      return;
    }
    onSelectService(title);
  };

  return (
    <section id="services" className="py-20 sm:py-28 bg-[#090D16] text-white border-b border-white/10 scroll-mt-20 relative overflow-hidden">
      {/* Background glow accent */}
      <div 
        aria-hidden="true" 
        className="absolute top-1/3 left-1/4 w-[600px] h-[600px] bg-blue-600/[0.07] blur-[150px] rounded-full pointer-events-none" 
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-14 sm:mb-18">
          <div className="inline-flex items-center gap-2 mb-3">
            <span className="w-1.5 h-1.5 bg-[#3B82F6] rounded-full shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
            <span className="text-[11px] font-bold tracking-widest uppercase text-slate-400">
              SERVICES & SOLUTIONS ECOSYSTEM
            </span>
          </div>
          <h2 className="font-['Outfit'] font-extrabold text-3xl sm:text-4xl md:text-5xl text-white tracking-tight leading-tight">
            Engineered Specifically for Modern Institutions.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed font-normal max-w-2xl">
            Choose complete turnkey modules or individual service components. Designed for institutions, madrasas, and educational organizations that require speed, dignity, and reliability.
          </p>
        </div>

        {/* Asymmetric Bento Showcase */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 sm:gap-6">
          
          {/* Card 1: Web Solutions (Large Featured Bento Card - 7 cols) */}
          <div 
            onClick={() => scrollToTarget('websites', 'Institutional Websites')}
            className="md:col-span-12 lg:col-span-7 group rounded-3xl p-5 sm:p-7 md:p-8 bg-gradient-to-br from-white/[0.05] to-white/[0.02] border border-white/10 hover:border-blue-500/50 transition-all duration-300 cursor-pointer shadow-[0_20px_50px_-20px_rgba(0,0,0,0.7)] flex flex-col justify-between"
          >
            <div>
              <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-[#60A5FA] group-hover:scale-105 transition-transform">
                    <Globe className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider block">Flagship Solution</span>
                    <h3 className="font-['Outfit'] font-extrabold text-2xl sm:text-3xl text-white tracking-tight group-hover:text-blue-300 transition-colors">
                      Institutional Websites
                    </h3>
                  </div>
                </div>

                <span className="text-xs font-bold px-3 py-1 rounded-full bg-blue-500/15 text-blue-300 border border-blue-400/30">
                  From ₹999/yr
                </span>
              </div>

              <p className="text-sm text-slate-300 leading-relaxed mb-6 max-w-xl">
                High-performance, mobile-first institutional portals designed to establish trust, handle admissions, publish notices, and represent your campus with modern clarity.
              </p>

              {/* Interactive Preview Device Widget */}
              <div className="rounded-2xl bg-[#070A11] border border-white/10 p-3 sm:p-4 mb-6 shadow-inner">
                {/* Simulation Control Header */}
                <div className="flex items-center justify-between mb-3 text-xs text-slate-400 pb-2.5 border-b border-white/10">
                  <div className="flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="font-mono text-[11px] text-slate-300 font-medium">Live Device Simulation</span>
                  </div>
                  {/* Desktop / Mobile Toggle */}
                  <div className="flex items-center gap-1 bg-white/[0.06] p-0.5 rounded-lg border border-white/10">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveDeviceView('desktop');
                      }}
                      className={`px-2.5 py-1 rounded-md text-[10px] font-bold transition-all cursor-pointer ${
                        activeDeviceView === 'desktop' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Desktop
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveDeviceView('mobile');
                      }}
                      className={`px-2.5 py-1 rounded-md text-[10px] font-bold transition-all cursor-pointer ${
                        activeDeviceView === 'mobile' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Mobile
                    </button>
                  </div>
                </div>

                {/* Simulation Canvas with Smooth Width Transition */}
                <div className={`transition-all duration-300 ease-in-out mx-auto ${activeDeviceView === 'mobile' ? 'max-w-[240px]' : 'w-full'}`}>
                  {activeDeviceView === 'desktop' ? (
                    /* Desktop Mockup */
                    <div className="rounded-xl bg-[#090D18] border border-white/10 shadow-lg overflow-hidden transition-all duration-300">
                      {/* Top Bar: macOS 3 dots + URL pill */}
                      <div className="flex items-center justify-between px-3 py-2 bg-slate-950/80 border-b border-white/10 gap-2">
                        <div className="flex items-center gap-1.5 shrink-0">
                          <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                          <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                        </div>
                        {/* URL Pill */}
                        <div className="px-3 py-0.5 rounded-full bg-white/[0.04] border border-white/10 text-[10px] font-mono text-slate-300 flex items-center gap-1.5 mx-auto">
                          <Lock className="w-2.5 h-2.5 text-emerald-400" />
                          <span>portal.academy.edu</span>
                        </div>
                        <div className="w-8 shrink-0 text-right">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-pulse" />
                        </div>
                      </div>

                      {/* Mini Campus Website Content */}
                      <div className="p-3.5 bg-gradient-to-b from-[#0B1120] to-[#070A11] space-y-3">
                        {/* Mini Campus Navbar */}
                        <div className="flex items-center justify-between pb-2 border-b border-white/10 text-xs">
                          <div className="flex items-center gap-2">
                            <div className="w-5 h-5 rounded-md bg-blue-600/30 border border-blue-500/40 flex items-center justify-center font-bold text-blue-400 text-[10px]">
                              A
                            </div>
                            <span className="font-['Outfit'] font-bold text-white text-xs tracking-tight">
                              Apex Academy
                            </span>
                          </div>
                          <div className="hidden sm:flex items-center gap-3 text-[10px] text-slate-400 font-medium">
                            <span>Academics</span>
                            <span>Admissions</span>
                            <span>Notices</span>
                          </div>
                          <button
                            type="button"
                            className="px-2 py-0.5 rounded bg-blue-600 hover:bg-blue-500 text-[10px] font-bold text-white shadow-xs pointer-events-none"
                          >
                            Apply Now
                          </button>
                        </div>

                        {/* Mini Hero Announcement & Metrics */}
                        <div className="space-y-2 pt-0.5">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            {/* Hero Announcement with subtle glowing pulse tag */}
                            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-blue-500/15 border border-blue-500/30 text-blue-300 text-[10px] font-bold">
                              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                              <span>Admissions 2026-27 Open</span>
                            </div>

                            {/* Fast CTA Button */}
                            <button
                              type="button"
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-white/[0.08] hover:bg-white/[0.15] border border-white/15 text-slate-200 text-[10px] font-semibold transition-colors pointer-events-none"
                            >
                              <Download className="w-3 h-3 text-blue-400" />
                              <span>Download Prospectus</span>
                            </button>
                          </div>

                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1">
                            <p className="font-['Outfit'] font-extrabold text-sm text-white tracking-tight leading-snug">
                              Empowering Future Leaders with Modern Campus Infrastructure
                            </p>

                            {/* Two Mini Metric Chips */}
                            <div className="flex items-center gap-2 shrink-0">
                              <div className="px-2 py-1 rounded-md bg-white/[0.04] border border-white/10 text-[10px] font-bold text-emerald-400 flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                                <span>98% Pass Rate</span>
                              </div>
                              <div className="px-2 py-1 rounded-md bg-white/[0.04] border border-white/10 text-[10px] font-bold text-blue-300 flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                                <span>NAAC A++</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* Mobile Mockup (Centered Vertical Phone Frame) */
                    <div className="rounded-[22px] bg-[#090D18] border-[2px] border-slate-700/80 p-2.5 shadow-2xl space-y-2.5 transition-all duration-300">
                      {/* Phone Speaker Notch */}
                      <div className="w-12 h-1 bg-slate-700 rounded-full mx-auto" />

                      {/* Mini URL pill */}
                      <div className="px-2 py-0.5 rounded-full bg-black/50 border border-white/10 text-[9px] font-mono text-slate-300 flex items-center justify-center gap-1 mx-auto">
                        <Lock className="w-2 h-2 text-emerald-400" />
                        <span>portal.academy.edu</span>
                      </div>

                      {/* Mini Campus Mobile Navbar with Hamburger */}
                      <div className="flex items-center justify-between pb-1.5 border-b border-white/10">
                        <div className="flex items-center gap-1.5">
                          <div className="w-4 h-4 rounded bg-blue-600/30 border border-blue-500/40 flex items-center justify-center font-bold text-blue-400 text-[9px]">
                            A
                          </div>
                          <span className="font-['Outfit'] font-bold text-white text-[11px]">Apex Academy</span>
                        </div>
                        <Menu className="w-3.5 h-3.5 text-slate-400" />
                      </div>

                      {/* Stacked Mobile Campus View */}
                      <div className="space-y-2 text-left">
                        {/* Hero Announcement with subtle glowing pulse tag */}
                        <div className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-blue-500/15 border border-blue-500/30 text-blue-300 text-[8px] font-bold">
                          <span className="w-1 h-1 rounded-full bg-blue-400 animate-pulse" />
                          <span>Admissions 2026-27 Open</span>
                        </div>

                        <p className="font-['Outfit'] font-bold text-xs text-white leading-tight">
                          Empowering Future Leaders
                        </p>

                        {/* Two Mini Metric Chips Stacked */}
                        <div className="grid grid-cols-2 gap-1 text-[9px] font-semibold">
                          <div className="px-1.5 py-0.5 rounded bg-white/[0.04] border border-white/10 text-emerald-400 text-center">
                            98% Pass Rate
                          </div>
                          <div className="px-1.5 py-0.5 rounded bg-white/[0.04] border border-white/10 text-blue-300 text-center">
                            NAAC A++
                          </div>
                        </div>

                        {/* Fast CTA Button */}
                        <button
                          type="button"
                          className="w-full py-1 rounded bg-blue-600 hover:bg-blue-500 text-white text-[9px] font-bold flex items-center justify-center gap-1 shadow-xs pointer-events-none"
                        >
                          <Download className="w-2.5 h-2.5" />
                          <span>Download Prospectus</span>
                        </button>
                      </div>

                      {/* Phone Home Indicator */}
                      <div className="w-12 h-0.5 bg-slate-700 rounded-full mx-auto mt-1" />
                    </div>
                  )}
                </div>
              </div>

              {/* Deliverables Checklist */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-6">
                <div className="flex items-center gap-2 text-xs font-medium text-slate-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                  <span>Custom modern domain integration</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-medium text-slate-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                  <span>Mobile & tablet touch optimization</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-medium text-slate-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                  <span>Direct WhatsApp inquiry triggers</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-medium text-slate-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                  <span>Turnkey live delivery in 48-72h</span>
                </div>
              </div>
            </div>

            <div className="pt-4 flex items-center justify-between border-t border-white/10 text-blue-400 group-hover:text-blue-300 transition-colors">
              <span className="text-xs font-bold tracking-wide">
                Configure Website Plans (Basic, Standard, Pro)
              </span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </div>
          </div>

          {/* Card 2: Admission Solutions (5 cols) */}
          <div 
            onClick={() => scrollToTarget('admission', 'Admission Solutions')}
            className="md:col-span-12 lg:col-span-5 group rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-white/[0.05] to-white/[0.02] border border-white/10 hover:border-emerald-500/50 transition-all duration-300 cursor-pointer shadow-[0_20px_50px_-20px_rgba(0,0,0,0.7)] flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-3 mb-6">
                <div className="w-11 h-11 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:scale-105 transition-transform">
                  <UserCheck className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-400/30">
                  Package ₹449
                </span>
              </div>

              <h3 className="font-['Outfit'] font-extrabold text-2xl text-white tracking-tight mb-2 group-hover:text-emerald-300 transition-colors">
                Admission Solutions
              </h3>

              <p className="text-sm text-slate-300 leading-relaxed mb-6">
                Automate your entire student enrollment pipeline. Capture leads, generate printable admission forms, and dispatch ID cards with zero friction.
              </p>

              {/* Workflow highlight badge */}
              <div className="rounded-2xl bg-emerald-950/30 border border-emerald-500/20 p-4 mb-6 space-y-2">
                <div className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" /> High-Conversion Pipeline
                </div>
                <div className="text-xs text-slate-300 leading-snug">
                  Online Registration Form + Printable Application + Student ID Template in one synchronized bundle.
                </div>
              </div>

              <div className="space-y-2 mb-6">
                <div className="flex items-center gap-2 text-xs font-medium text-slate-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Digital Admission Registration Link</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-medium text-slate-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Official Printable Application Form</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-medium text-slate-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Custom Student ID Card Layout</span>
                </div>
              </div>
            </div>

            <div className="pt-4 flex items-center justify-between border-t border-white/10 text-emerald-400 group-hover:text-emerald-300 transition-colors">
              <span className="text-xs font-bold tracking-wide">
                Explore Admission Suite
              </span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </div>
          </div>

          {/* Card 3: Exam Solutions (6 cols) */}
          <div 
            onClick={() => scrollToTarget('exam', 'Exam Solutions')}
            className="md:col-span-12 lg:col-span-6 group rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-white/[0.05] to-white/[0.02] border border-white/10 hover:border-purple-500/50 transition-all duration-300 cursor-pointer shadow-[0_20px_50px_-20px_rgba(0,0,0,0.7)] flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-3 mb-6">
                <div className="w-11 h-11 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 group-hover:scale-105 transition-transform">
                  <CheckSquare className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-purple-500/15 text-purple-300 border border-purple-400/30">
                  Package ₹499
                </span>
              </div>

              <h3 className="font-['Outfit'] font-extrabold text-2xl text-white tracking-tight mb-2 group-hover:text-purple-300 transition-colors">
                Exam Solutions
              </h3>

              <p className="text-sm text-slate-300 leading-relaxed mb-6">
                Dignified, bilingual question paper typesetting, comprehensive answer keys, exam timetables, and hall tickets engineered for academic standards.
              </p>

              <div className="rounded-2xl bg-purple-950/30 border border-purple-500/20 p-4 mb-6 space-y-2">
                <div className="text-[11px] font-bold text-purple-400 uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5" /> Secure Academic Typesetting
                </div>
                <div className="text-xs text-slate-300">
                  Formatted in English, Malayalam, or Arabic with strict institutional header hierarchy.
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-6">
                <div className="flex items-center gap-2 text-xs font-medium text-slate-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                  <span>Question Paper Formatting</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-medium text-slate-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                  <span>Answer Key Generation</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-medium text-slate-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                  <span>Official Exam Timetable</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-medium text-slate-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                  <span>Hall Ticket Templates</span>
                </div>
              </div>
            </div>

            <div className="pt-4 flex items-center justify-between border-t border-white/10 text-purple-400 group-hover:text-purple-300 transition-colors">
              <span className="text-xs font-bold tracking-wide">
                Configure Exam Package or Single Papers
              </span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </div>
          </div>

          {/* Card 4: Monthly Creative Retainers & Bulk Services (6 cols) */}
          <div 
            onClick={() => scrollToTarget('creative', 'Monthly Creative Retainers')}
            className="md:col-span-12 lg:col-span-6 group rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-white/[0.05] to-white/[0.02] border border-white/10 hover:border-amber-500/50 transition-all duration-300 cursor-pointer shadow-[0_20px_50px_-20px_rgba(0,0,0,0.7)] flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-3 mb-6">
                <div className="w-11 h-11 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 group-hover:scale-105 transition-transform">
                  <Palette className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-500/15 text-amber-300 border border-amber-400/30">
                  From ₹499/mo
                </span>
              </div>

              <h3 className="font-['Outfit'] font-extrabold text-2xl text-white tracking-tight mb-2 group-hover:text-amber-300 transition-colors">
                Monthly Creatives & Bulk Services
              </h3>

              <p className="text-sm text-slate-300 leading-relaxed mb-6">
                Keep your campus social media active and professional with fixed-price creative quotas, plus high-volume student ID cards and event certificates.
              </p>

              {/* Service Pills */}
              <div className="flex flex-wrap gap-2 mb-6">
                <span className="px-3 py-1 rounded-xl bg-white/[0.04] border border-white/10 text-xs font-semibold text-slate-200">
                  5 Creatives • ₹499
                </span>
                <span className="px-3 py-1 rounded-xl bg-white/[0.04] border border-white/10 text-xs font-semibold text-slate-200">
                  12 Creatives • ₹999
                </span>
                <span className="px-3 py-1 rounded-xl bg-white/[0.04] border border-white/10 text-xs font-semibold text-slate-200">
                  25 Creatives • ₹1,799
                </span>
                <span className="px-3 py-1 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs font-semibold text-amber-300">
                  Bulk IDs from ₹14/card
                </span>
                <span className="px-3 py-1 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-xs font-semibold text-cyan-300">
                  Certs from ₹8/cert
                </span>
              </div>

              <div className="space-y-2 mb-6">
                <div className="flex items-center gap-2 text-xs font-medium text-slate-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>Social announcements, event posters, festival greetings</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-medium text-slate-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>Tiered bulk volume discounts with instant recalculation</span>
                </div>
              </div>
            </div>

            <div className="pt-4 flex items-center justify-between border-t border-white/10 text-amber-400 group-hover:text-amber-300 transition-colors">
              <span className="text-xs font-bold tracking-wide">
                View Retainer Quotas & Bulk Calculator
              </span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
