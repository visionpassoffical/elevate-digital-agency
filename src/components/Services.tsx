import React from 'react';
import { ServicesGrid } from './ServicesGrid';

interface ServicesProps {
  onSelectService?: (serviceTitle: string) => void;
}

export const Services: React.FC<ServicesProps> = ({ onSelectService = () => {} }) => {
  return <ServicesGrid onSelectService={onSelectService} />;
};

export default Services;
