import React from 'react';
import { useContent } from '../context/ContentContext';

export const PartnerInstitutionsSection: React.FC = () => {
  const { content } = useContent();
  const institutionsData = content.clientInstitutions;
  const activeInstitutions = (institutionsData.list || []).filter((inst) => inst.enabled);

  if (activeInstitutions.length === 0) return null;

  return (
    <section className="py-12 bg-white border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-sm font-bold tracking-widest uppercase text-slate-400 mb-2">
          Trusted by over 40+ institutions across India
        </p>
      </div>
    </section>
  );
};
