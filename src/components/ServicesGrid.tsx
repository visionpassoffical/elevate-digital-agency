import React from 'react';
import { Globe, UserCheck, CheckSquare, Palette, FileText, ArrowRight, CheckCircle2 } from 'lucide-react';
import type { ServiceCardItem } from '../types';

interface ServicesGridProps {
  onSelectService: (serviceTitle: string) => void;
}

const SERVICES_DATA = [
  {
    id: 'websites',
    title: 'Websites & Portals',
    description: 'Modern, mobile-first responsive websites for institutions and businesses.',
    priceBadge: 'From ₹999/yr',
    deliverables: ['Custom institutional domain', 'Responsive parent & student UX', 'Direct WhatsApp integration'],
    ctaLabel: 'View Website Plans',
    icon: <Globe className="w-6 h-6 text-[#0B0F17]" />,
    span: 'md:col-span-2 lg:col-span-2',
    theme: 'light',
  },
  {
    id: 'admission',
    title: 'Admission Solutions',
    description: 'Complete student intake suite: announcement posters, online forms, and print-ready ID cards.',
    priceBadge: 'Package ₹449',
    deliverables: ['Admission launch poster', 'Online digital admission form', 'Printable student ID card design'],
    ctaLabel: 'View Suite',
    icon: <UserCheck className="w-5 h-5 text-white" />,
    span: 'md:col-span-1 lg:col-span-1',
    theme: 'dark',
  },
  {
    id: 'exam',
    title: 'Exam Solutions',
    description: 'Zero-error institutional exam materials: typed papers, formatted answer keys, and timetables.',
    priceBadge: 'Package ₹499',
    deliverables: ['Handwritten → Typed PDF paper', 'Answer key & scoring guide', 'Exam timetable layout'],
    ctaLabel: 'View Suite',
    icon: <CheckSquare className="w-5 h-5 text-[#0B0F17]" />,
    span: 'md:col-span-1 lg:col-span-1',
    theme: 'light',
  },
  {
    id: 'creative',
    title: 'Monthly Creatives',
    description: 'Dedicated monthly graphic design retainers for consistent circulars, posters, and social updates.',
    priceBadge: 'From ₹499/mo',
    deliverables: ['4 to 16 creatives/month', 'Bespoke branding', 'High-res output'],
    ctaLabel: 'View Retainers',
    icon: <Palette className="w-5 h-5 text-[#0B0F17]" />,
    span: 'md:col-span-1 lg:col-span-1',
    theme: 'light',
  },
  {
    id: 'documents',
    title: 'Bulk Documents',
    description: 'Volume production of verified student identity cards and authentic institutional certificates.',
    priceBadge: 'Volume Rates',
    deliverables: ['Tiered volume rates', 'QR ready', 'Batch data integration'],
    ctaLabel: 'Calculate Order',
    icon: <FileText className="w-5 h-5 text-[#0B0F17]" />,
    span: 'md:col-span-1 lg:col-span-1',
    theme: 'light',
  },
];

export const ServicesGrid: React.FC<ServicesGridProps> = ({ onSelectService }) => {
  return (
    <section id="services" className="py-16 sm:py-24 lg:py-28 bg-[#F8FAFC] border-b border-slate-200/80 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-12 sm:mb-16">
          <h2 className="font-['Outfit'] font-extrabold text-3xl sm:text-4xl md:text-5xl text-[#0B0F17] tracking-tight">
            Everything You Need to Go Digital.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed font-normal max-w-2xl">
            Turnkey digital solutions engineered for educational institutions, madrasas, and modern businesses. Choose any module below to configure or inquire directly.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-4 sm:gap-6">
          {SERVICES_DATA.map((service) => {
            const isDark = service.theme === 'dark';

            const handleCardClick = () => {
              const el = document.getElementById(service.id === 'creative' ? 'monthly' : service.id === 'documents' ? 'bulk' : service.id);
              if (el) {
                const offset = 80;
                const top = el.getBoundingClientRect().top + window.pageYOffset - offset;
                window.scrollTo({ top, behavior: 'smooth' });
                return;
              }
              onSelectService(service.title);
            };

            return (
              <div
                key={service.id}
                onClick={handleCardClick}
                className={`group relative rounded-3xl p-6 sm:p-8 transition-all duration-300 cursor-pointer flex flex-col justify-between border ${service.span} ${
                  isDark
                    ? 'bg-[#0B0F17] text-white border-slate-800 hover:border-slate-600 shadow-xl'
                    : 'bg-white hover:bg-slate-50 border-slate-200/90 hover:border-slate-300 shadow-xs hover:shadow-md'
                }`}
              >
                <div>
                  {/* Top Bar with Icon & Tag */}
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-8">
                    <div
                      className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-105 duration-300 ${
                        isDark
                          ? 'bg-slate-800 border border-slate-700'
                          : 'bg-slate-100 border border-slate-200'
                      }`}
                    >
                      {service.icon}
                    </div>

                    <span
                      className={`text-[11px] font-bold px-3 py-1.5 rounded-full tracking-wide uppercase self-start ${
                        isDark
                          ? 'bg-slate-800 text-slate-300'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {service.priceBadge}
                    </span>
                  </div>

                  {/* Service Title */}
                  <h3
                    className={`font-['Outfit'] font-extrabold text-2xl tracking-tight mb-3 transition-colors ${
                      isDark
                        ? 'text-white'
                        : 'text-[#0B0F17]'
                    }`}
                  >
                    {service.title}
                  </h3>

                  {/* Service Description */}
                  <p
                    className={`text-sm leading-relaxed mb-6 ${
                      isDark ? 'text-slate-400' : 'text-slate-600'
                    }`}
                  >
                    {service.description}
                  </p>

                  {/* Deliverables Checklist */}
                  <ul className="space-y-2.5 mb-8">
                    {service.deliverables.map((d, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-xs font-medium">
                        <CheckCircle2 className={`w-4 h-4 shrink-0 mt-0.5 ${isDark ? 'text-emerald-400' : 'text-[#0062EB]'}`} />
                        <span className={isDark ? 'text-slate-300' : 'text-slate-700'}>{d}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Card Action Link */}
                <div
                  className={`pt-5 flex items-center gap-2 border-t ${
                    isDark ? 'border-slate-800 text-white' : 'border-slate-100 text-[#0B0F17]'
                  }`}
                >
                  <span className="text-xs font-bold tracking-wide">
                    {service.ctaLabel}
                  </span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1 duration-300" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
