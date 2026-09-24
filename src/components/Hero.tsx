import React, { useState } from 'react';
import { ArrowRight, ArrowDown, MessageCircle, Globe, FileText, Award, Palette, Sparkles, CheckCircle2, ShieldCheck, Zap } from 'lucide-react';
import { useContent } from '../context/ContentContext';

interface HeroProps {
  onOpenQuote: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenQuote }) => {
  const { content, getWhatsAppUrl } = useContent();
  const heroData = content.hero;
  const whatsappUrl = getWhatsAppUrl(
    content.whatsappSettings?.templates?.generalEnquiry ||
      'Hello ELEVATE, I would like to enquire about your digital services.'
  );

  const websiteStartPrice = content.websitePlans[0]?.price || '₹999/yr';
  const admissionPrice = content.admissionServices.package ? `₹${content.admissionServices.package.price}` : '₹449';
  const examPrice = content.examServices.package ? `₹${content.examServices.package.price}` : '₹499';
  const monthlyPrice = content.monthlyCreativePlans.plans[0] ? `₹${content.monthlyCreativePlans.plans[0].price}/mo` : '₹499/mo';

  const [activeInteractiveTab, setActiveInteractiveTab] = useState<'web' | 'admission' | 'exam'>('web');

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const headerOffset = 80;
      const elPos = el.getBoundingClientRect().top;
      const offsetPos = elPos + window.pageYOffset - headerOffset;
      window.scrollTo({ top: offsetPos, behavior: 'smooth' });
    }
  };

  return (
    <section className="relative pt-28 pb-16 sm:pt-36 sm:pb-24 lg:pt-40 lg:pb-32 bg-[#090D16] text-white border-b border-white/10 overflow-hidden">
      {/* Background Ambient Radial Glow & Architectural Grid */}
      <div 
        aria-hidden="true" 
        className="absolute inset-0 pointer-events-none overflow-hidden"
      >
        <div className="absolute -top-[300px] left-1/2 -translate-x-1/2 w-[1000px] h-[650px] bg-gradient-to-b from-[#2563EB]/20 via-[#1D4ED8]/10 to-transparent blur-[140px] rounded-full" />
        <div className="absolute top-[20%] right-[-150px] w-[500px] h-[500px] bg-[#38BDF8]/10 blur-[130px] rounded-full" />
        {/* Subtle grid mesh */}
        <div 
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, #FFFFFF 1px, transparent 0)`,
            backgroundSize: '32px 32px'
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        
        {/* Eyebrow Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/10 mb-8 mx-auto shadow-[0_0_20px_-5px_rgba(37,99,235,0.3)] backdrop-blur-sm transition-transform hover:scale-[1.02] cursor-default">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#3B82F6] opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#2563EB]" />
          </span>
          <span className="font-['Outfit'] font-bold text-[11px] text-slate-200 tracking-wider uppercase">
            High-Performance Institutional Portal
          </span>
          <span className="text-white/20">|</span>
          <span className="text-xs font-medium text-slate-400">
            {heroData.pillSubtitle || 'Turnkey Digital Engineering for Schools & Colleges'}
          </span>
        </div>

        {/* Display Headline */}
        <h1 className="font-['Outfit'] font-extrabold text-4xl sm:text-6xl lg:text-7xl xl:text-[80px] tracking-tight leading-[1.06] max-w-5xl mx-auto mb-6 text-white">
          Digital solutions that move your institution{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#60A5FA] via-[#3B82F6] to-[#93C5FD]">
            forward.
          </span>
        </h1>

        {/* Supporting Copy */}
        <p className="text-base sm:text-lg lg:text-xl text-slate-300 font-normal leading-relaxed max-w-3xl mx-auto mb-10 sm:mb-12">
          Websites, admission solutions, exam solutions and creative digital services built for modern institutions.
        </p>

        {/* Primary CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 mb-16 sm:mb-20">
          <a
            id="hero-whatsapp-direct-link"
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 text-sm font-bold text-white bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] hover:from-[#3B82F6] hover:to-[#2563EB] active:scale-[0.98] rounded-xl shadow-[0_0_30px_-5px_rgba(37,99,235,0.6)] border border-blue-400/30 transition-all cursor-pointer"
          >
            <MessageCircle className="w-4 h-4 text-emerald-300" />
            <span>WhatsApp ELEVATE</span>
          </a>

          <button
            type="button"
            onClick={() => scrollToSection('services')}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-4 text-sm font-bold text-slate-200 bg-white/[0.05] hover:bg-white/[0.09] hover:text-white border border-white/15 hover:border-white/25 active:scale-[0.98] rounded-xl transition-all cursor-pointer backdrop-blur-sm"
          >
            <span>Explore Services</span>
            <ArrowRight className="w-4 h-4 text-blue-200" />
          </button>
        </div>

        {/* ABSTRACT SOPHISTICATED INTERACTIVE DIGITAL VISUAL (Linear / Stripe level) */}
        <div className="max-w-5xl mx-auto mb-16 sm:mb-20 relative">
          {/* Subtle Ambient Blue Glow Behind Primary Card */}
          <div className="absolute -inset-2 sm:-inset-4 bg-gradient-to-r from-blue-600/30 via-indigo-500/25 to-sky-500/30 rounded-[32px] blur-2xl opacity-70 pointer-events-none -z-10" />

          <div className="relative rounded-2xl sm:rounded-3xl p-1 bg-gradient-to-b from-white/15 via-white/5 to-transparent shadow-[0_25px_80px_-20px_rgba(0,0,0,0.8)] border border-white/10 backdrop-blur-xl overflow-hidden">
            
            {/* Visual Canvas Interior */}
            <div className="rounded-[22px] sm:rounded-[26px] bg-[#070A11] p-4 sm:p-7 text-left border border-white/[0.06] overflow-hidden relative">
              {/* Subtle top toolbar */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-5 border-b border-white/10 mb-6">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                  <span className="ml-3 text-[11px] font-mono text-slate-400 uppercase tracking-widest">
                    elevate.institution.engine // v3.2
                  </span>
                </div>

                {/* Interactive mode selector tabs */}
                <div className="flex items-center gap-1 bg-white/[0.04] p-1 rounded-xl border border-white/10">
                  <button
                    type="button"
                    onClick={() => setActiveInteractiveTab('web')}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                      activeInteractiveTab === 'web'
                        ? 'bg-[#2563EB] text-white shadow-xs'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Web Architecture
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveInteractiveTab('admission')}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                      activeInteractiveTab === 'admission'
                        ? 'bg-[#2563EB] text-white shadow-xs'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Admission Flow
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveInteractiveTab('exam')}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                      activeInteractiveTab === 'exam'
                        ? 'bg-[#2563EB] text-white shadow-xs'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Exam Suite
                  </button>
                </div>
              </div>

              {/* Dynamic Interactive Stage Content */}
              {activeInteractiveTab === 'web' && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                  <div className="lg:col-span-7 space-y-4">
                    <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-blue-500/10 border border-blue-500/20 text-[#60A5FA] text-xs font-medium">
                      <Zap className="w-3.5 h-3.5" /> High-Performance Institutional Portal
                    </div>
                    <h3 className="font-['Outfit'] font-bold text-2xl sm:text-3xl text-white tracking-tight">
                      Fast, responsive web infrastructure tailored for campuses.
                    </h3>
                    <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                      Custom responsive layouts, fast CDN delivery, WhatsApp integration, and simple administrator management without recurring agency overheads.
                    </p>
                    <div className="grid grid-cols-3 gap-3 pt-2">
                      <div className="p-3 sm:p-3.5 rounded-xl bg-white/[0.03] border border-white/10 backdrop-blur-xs hover:border-white/20 transition-all">
                        <div className="text-[10px] sm:text-[11px] uppercase font-mono text-slate-400 font-semibold tracking-wider">Core Web Vitals</div>
                        <div className="text-base sm:text-lg font-bold text-emerald-400 mt-1 flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                          100 / 100
                        </div>
                      </div>
                      <div className="p-3 sm:p-3.5 rounded-xl bg-white/[0.03] border border-white/10 backdrop-blur-xs hover:border-white/20 transition-all">
                        <div className="text-[10px] sm:text-[11px] uppercase font-mono text-slate-400 font-semibold tracking-wider">Speed to Live</div>
                        <div className="text-base sm:text-lg font-bold text-[#60A5FA] mt-1 flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#60A5FA] shrink-0" />
                          48–72h
                        </div>
                      </div>
                      <div className="p-3 sm:p-3.5 rounded-xl bg-white/[0.03] border border-white/10 backdrop-blur-xs hover:border-white/20 transition-all">
                        <div className="text-[10px] sm:text-[11px] uppercase font-mono text-slate-400 font-semibold tracking-wider">Hosting & Domain</div>
                        <div className="text-base sm:text-lg font-bold text-slate-200 mt-1 flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0" />
                          Turnkey
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Interactive Institutional Portal Preview Card */}
                  <div className="lg:col-span-5 relative">
                    <div className="rounded-2xl bg-gradient-to-br from-[#0F172A] to-[#0A0F1D] p-4 sm:p-5 border border-white/10 shadow-2xl space-y-4">
                      {/* Top Header of the Mini Portal Preview */}
                      <div className="flex items-center justify-between gap-2 pb-3 border-b border-white/10">
                        <div className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-slate-600" />
                          <span className="w-2 h-2 rounded-full bg-slate-600" />
                          <span className="w-2 h-2 rounded-full bg-slate-600" />
                          <span className="text-[10px] font-mono text-slate-400 pl-1 uppercase tracking-wider">
                            portal.springfield.edu
                          </span>
                        </div>
                        {/* Status Tag */}
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shrink-0">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          LIVE ADMISSION PORTAL
                        </span>
                      </div>

                      {/* Campus Identity */}
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center shrink-0 text-blue-400 font-bold font-['Outfit'] text-base shadow-sm">
                          SIA
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-['Outfit'] font-bold text-white text-sm sm:text-base leading-snug truncate">
                            Springfield International Academy
                          </h4>
                          <p className="text-[11px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                            <span>Higher Secondary & Degree Campus</span>
                            <span className="text-white/20">•</span>
                            <span className="text-blue-400 font-medium">AY 2026–27</span>
                          </p>
                        </div>
                      </div>

                      {/* Mini Metric Pills */}
                      <div className="flex flex-wrap items-center gap-2 pt-0.5">
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/10 text-[11px] font-medium text-slate-300">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                          <span>99.9% Uptime</span>
                        </div>
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-[11px] font-medium text-emerald-400">
                          <MessageCircle className="w-3 h-3 text-emerald-400" />
                          <span>WhatsApp Direct Lead: Active</span>
                        </div>
                      </div>

                      {/* Institutional Dashboard Snippet / Mock Interactive Progress Bar */}
                      <div className="p-3.5 rounded-xl bg-slate-900/80 border border-white/10 space-y-2.5">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-slate-400 font-medium">Application Intake Progress</span>
                          <span className="text-white font-bold font-mono">
                            682 / 750 <span className="text-emerald-400 font-normal text-[11px]">(91%)</span>
                          </span>
                        </div>

                        {/* Interactive Progress Bar */}
                        <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden p-0.5">
                          <div className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-emerald-400 rounded-full transition-all duration-1000 w-[91%] shadow-[0_0_12px_rgba(59,130,246,0.5)]" />
                        </div>

                        {/* Recent Lead Dispatch Activity */}
                        <div className="pt-1 flex items-center justify-between text-[11px] text-slate-400">
                          <span className="flex items-center gap-1.5 truncate">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-ping" />
                            <span className="truncate">New inquiry: Grade 11 Science</span>
                          </span>
                          <span className="text-[10px] text-slate-500 font-mono shrink-0 ml-2">Just now</span>
                        </div>
                      </div>

                      {/* Mock Portal Actions */}
                      <div className="grid grid-cols-2 gap-2 pt-0.5">
                        <div className="px-3 py-2 rounded-lg bg-blue-600/20 border border-blue-500/30 text-center text-xs font-semibold text-blue-300">
                          Online Application
                        </div>
                        <div className="px-3 py-2 rounded-lg bg-white/[0.04] border border-white/10 text-center text-xs font-semibold text-slate-300">
                          Campus Brochure
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeInteractiveTab === 'admission' && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                  <div className="lg:col-span-7 space-y-4">
                    <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Frictionless Enrollment Pipeline
                    </div>
                    <h3 className="font-['Outfit'] font-bold text-2xl sm:text-3xl text-white tracking-tight">
                      Convert student inquiries into confirmed enrollments.
                    </h3>
                    <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                      Custom admission forms, automated application reference generation, printable formats, and instant staff WhatsApp alerts for new registrations.
                    </p>
                    <div className="flex flex-wrap gap-2 pt-1">
                      <span className="px-2.5 py-1 rounded-md bg-white/[0.04] text-xs text-slate-300 border border-white/10">Digital Application Form</span>
                      <span className="px-2.5 py-1 rounded-md bg-white/[0.04] text-xs text-slate-300 border border-white/10">Student ID Generation</span>
                      <span className="px-2.5 py-1 rounded-md bg-white/[0.04] text-xs text-slate-300 border border-white/10">Instant Notification</span>
                    </div>
                  </div>

                  <div className="lg:col-span-5">
                    <div className="rounded-xl bg-gradient-to-br from-[#0F172A] to-[#0A0F1D] p-5 border border-white/10 space-y-3">
                      <div className="flex items-center justify-between text-xs text-slate-300">
                        <span className="font-semibold">Admission Package</span>
                        <span className="font-bold text-emerald-400">₹449 Complete</span>
                      </div>
                      <div className="space-y-1.5 text-xs text-slate-400">
                        <div className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Online Registration Setup</div>
                        <div className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Printable Form Design</div>
                        <div className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> ID Card Template</div>
                        <div className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Direct WhatsApp Dispatch</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeInteractiveTab === 'exam' && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                  <div className="lg:col-span-7 space-y-4">
                    <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-medium">
                      <ShieldCheck className="w-3.5 h-3.5" /> Secure Academic Examination Desk
                    </div>
                    <h3 className="font-['Outfit'] font-bold text-2xl sm:text-3xl text-white tracking-tight">
                      Formatted question papers, answer keys & timetables.
                    </h3>
                    <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                      Precision typesetting in English, Malayalam, and Arabic with standardized institutional headers and print-ready PDF outputs.
                    </p>
                    <div className="flex flex-wrap gap-2 pt-1">
                      <span className="px-2.5 py-1 rounded-md bg-white/[0.04] text-xs text-slate-300 border border-white/10">Bilingual Question Papers</span>
                      <span className="px-2.5 py-1 rounded-md bg-white/[0.04] text-xs text-slate-300 border border-white/10">Answer Keys</span>
                      <span className="px-2.5 py-1 rounded-md bg-white/[0.04] text-xs text-slate-300 border border-white/10">Examination Timetable</span>
                    </div>
                  </div>

                  <div className="lg:col-span-5">
                    <div className="rounded-xl bg-gradient-to-br from-[#0F172A] to-[#0A0F1D] p-5 border border-white/10 space-y-3">
                      <div className="flex items-center justify-between text-xs text-slate-300">
                        <span className="font-semibold">Complete Exam Package</span>
                        <span className="font-bold text-purple-400">₹499 Complete</span>
                      </div>
                      <div className="space-y-1.5 text-xs text-slate-400">
                        <div className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-purple-400" /> Standard Question Paper</div>
                        <div className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-purple-400" /> Full Answer Key</div>
                        <div className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-purple-400" /> Timetable Layout</div>
                        <div className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-purple-400" /> Hall Ticket Format</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>

        {/* TRANSPARENT PRICING HIGHLIGHTS BAR */}
        <div className="max-w-4xl mx-auto pt-6 border-t border-white/10">
          <div className="text-[11px] font-bold tracking-widest text-slate-400 uppercase mb-5 flex items-center justify-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-[#60A5FA]" />
            <span>Transparent Starting Rates</span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            <button
              type="button"
              onClick={() => scrollToSection('websites')}
              className="p-4 rounded-2xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/10 hover:border-blue-500/50 transition-all cursor-pointer flex flex-col items-center justify-center text-center group active:scale-98"
            >
              <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1.5">
                <Globe className="w-3.5 h-3.5 text-[#60A5FA]" />
                <span className="font-medium">Websites</span>
              </div>
              <div className="font-['Outfit'] font-extrabold text-xl text-white group-hover:text-[#60A5FA] transition-colors">
                {websiteStartPrice}
              </div>
            </button>

            <button
              type="button"
              onClick={() => scrollToSection('admission')}
              className="p-4 rounded-2xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/10 hover:border-emerald-500/50 transition-all cursor-pointer flex flex-col items-center justify-center text-center group active:scale-98"
            >
              <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1.5">
                <FileText className="w-3.5 h-3.5 text-emerald-400" />
                <span className="font-medium">Admission</span>
              </div>
              <div className="font-['Outfit'] font-extrabold text-xl text-white group-hover:text-emerald-400 transition-colors">
                {admissionPrice}
              </div>
            </button>

            <button
              type="button"
              onClick={() => scrollToSection('exam')}
              className="p-4 rounded-2xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/10 hover:border-purple-500/50 transition-all cursor-pointer flex flex-col items-center justify-center text-center group active:scale-98"
            >
              <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1.5">
                <Award className="w-3.5 h-3.5 text-purple-400" />
                <span className="font-medium">Exams</span>
              </div>
              <div className="font-['Outfit'] font-extrabold text-xl text-white group-hover:text-purple-400 transition-colors">
                {examPrice}
              </div>
            </button>

            <button
              type="button"
              onClick={() => scrollToSection('creative')}
              className="p-4 rounded-2xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/10 hover:border-amber-500/50 transition-all cursor-pointer flex flex-col items-center justify-center text-center group active:scale-98"
            >
              <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1.5">
                <Palette className="w-3.5 h-3.5 text-amber-400" />
                <span className="font-medium">Creatives</span>
              </div>
              <div className="font-['Outfit'] font-extrabold text-xl text-white group-hover:text-amber-400 transition-colors">
                {monthlyPrice}
              </div>
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};
