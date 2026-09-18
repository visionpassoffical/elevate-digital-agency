import React from 'react';
import { Globe, UserCheck, CheckSquare, Palette, FileText, ArrowRight, CheckCircle2, Sparkles, HelpCircle } from 'lucide-react';
import { useContent } from '../context/ContentContext';

interface ServicesGridProps {
  onSelectService: (serviceTitle: string) => void;
}

const getServiceIcon = (iconName?: string) => {
  switch (iconName) {
    case 'Globe':
      return <Globe className="w-5 h-5 text-[#2563EB]" />;
    case 'UserCheck':
      return <UserCheck className="w-5 h-5 text-[#2563EB]" />;
    case 'CheckSquare':
      return <CheckSquare className="w-5 h-5 text-[#2563EB]" />;
    case 'Palette':
      return <Palette className="w-5 h-5 text-[#2563EB]" />;
    case 'FileText':
      return <FileText className="w-5 h-5 text-[#2563EB]" />;
    case 'Sparkles':
      return <Sparkles className="w-5 h-5 text-[#2563EB]" />;
    default:
      return <HelpCircle className="w-5 h-5 text-[#2563EB]" />;
  }
};

export const ServicesGrid: React.FC<ServicesGridProps> = ({ onSelectService }) => {
  const { content } = useContent();
  const servicesList = (content.services || []).filter((s) => s.enabled !== false);

  return (
    <section id="services" className="py-16 sm:py-20 lg:py-24 bg-[#F8FAFC] border-b border-slate-200/80 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-2 mb-3">
            <span className="w-1.5 h-1.5 bg-[#2563EB] rounded-full" />
            <span className="text-[11px] font-bold tracking-widest uppercase text-slate-500">
              SERVICES OVERVIEW
            </span>
          </div>
          <h2 className="font-['Outfit'] font-extrabold text-3xl sm:text-4xl md:text-5xl text-[#0F172A] tracking-tight">
            Everything You Need to Go Digital.
          </h2>
          <p className="mt-3 text-base sm:text-lg text-slate-600 leading-relaxed font-normal max-w-2xl">
            Turnkey digital solutions engineered for educational institutions, madrasas, and modern businesses. Choose any module below to configure or inquire directly.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-4 sm:gap-5">
          {servicesList.map((service, index) => {
            const handleCardClick = () => {
              const targetId = service.targetSection || (service.id === 'creative' ? 'monthly' : service.id === 'documents' ? 'bulk' : service.id);
              const el = document.getElementById(targetId);
              if (el) {
                const offset = 80;
                const top = el.getBoundingClientRect().top + window.pageYOffset - offset;
                window.scrollTo({ top, behavior: 'smooth' });
                return;
              }
              onSelectService(service.title);
            };

            const isWideCard = index === 0;

            return (
              <div
                key={service.id}
                onClick={handleCardClick}
                className={`group relative rounded-2xl p-6 sm:p-7 transition-all duration-200 cursor-pointer flex flex-col justify-between border bg-white hover:bg-slate-50/70 border-slate-200/90 hover:border-[#2563EB]/40 shadow-xs hover:shadow-sm ${
                  isWideCard ? 'md:col-span-2 lg:col-span-2' : 'md:col-span-1 lg:col-span-1'
                }`}
              >
                <div>
                  {/* Top Bar with Icon & Tag */}
                  <div className="flex items-center justify-between gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-blue-50/70 border border-blue-100 flex items-center justify-center transition-transform group-hover:scale-105 duration-200">
                      {getServiceIcon(service.icon)}
                    </div>

                    <span className="text-[11px] font-bold px-2.5 py-1 rounded-md tracking-wider uppercase bg-slate-100 text-slate-700">
                      {service.priceBadge}
                    </span>
                  </div>

                  {/* Service Title */}
                  <h3 className="font-['Outfit'] font-extrabold text-xl sm:text-2xl text-[#0F172A] tracking-tight mb-2 group-hover:text-[#2563EB] transition-colors">
                    {service.title}
                  </h3>

                  {/* Service Description */}
                  <p className="text-sm text-slate-600 leading-relaxed mb-6">
                    {service.description}
                  </p>

                  {/* Deliverables Checklist */}
                  <ul className="space-y-2 mb-6">
                    {(service.deliverables || []).map((d, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs font-medium text-slate-700">
                        <CheckCircle2 className="w-3.5 h-3.5 shrink-0 mt-0.5 text-[#2563EB]" />
                        <span>{d}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Card Action Link */}
                <div className="pt-4 flex items-center gap-2 border-t border-slate-100 text-[#0F172A] group-hover:text-[#2563EB] transition-colors">
                  <span className="text-xs font-bold tracking-wide">
                    {service.ctaLabel || 'Learn More'}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1 duration-200" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
