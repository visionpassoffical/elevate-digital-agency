import React from 'react';
import { WebsitePlansSection } from './WebsitePlansSection';
import type { SelectedWebsitePlan } from '../types';

interface PricingProps {
  selectedPlan?: SelectedWebsitePlan | null;
  onSelectPlan?: (plan: SelectedWebsitePlan | null) => void;
  onOpenCustomQuote?: () => void;
}

export const Pricing: React.FC<PricingProps> = ({
  selectedPlan,
  onSelectPlan,
  onOpenCustomQuote = () => {},
}) => {
  return (
    <WebsitePlansSection
      selectedPlan={selectedPlan}
      onSelectPlan={onSelectPlan}
      onOpenCustomQuote={onOpenCustomQuote}
    />
  );
};

export default Pricing;
