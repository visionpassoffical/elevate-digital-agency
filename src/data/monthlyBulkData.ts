import type {
  MonthlyCreativePlan,
  BulkServiceConfig,
} from '../types';

export const MONTHLY_CREATIVE_PLANS: MonthlyCreativePlan[] = [
  {
    id: 'monthly-basic',
    name: 'Basic Monthly Creative Plan',
    price: 499,
    formattedPrice: '₹499',
    billingCycle: '/month',
    creativesCount: 5,
    creativesCountLabel: '5 creatives',
    ctaLabel: 'Choose Basic',
    description: 'Essential monthly visual updates for regular notices and announcements.',
  },
  {
    id: 'monthly-standard',
    name: 'Standard Monthly Creative Plan',
    price: 899,
    formattedPrice: '₹899',
    billingCycle: '/month',
    creativesCount: 10,
    creativesCountLabel: '10 creatives',
    isPopular: true,
    ctaLabel: 'Choose Standard',
    description: 'Ideal for institutions maintaining an active social media presence and circular cadence.',
  },
  {
    id: 'monthly-premium',
    name: 'Premium Monthly Creative Plan',
    price: 1299,
    formattedPrice: '₹1,299',
    billingCycle: '/month',
    creativesCount: 15,
    creativesCountLabel: '15 creatives',
    ctaLabel: 'Choose Premium',
    description: 'Comprehensive digital creative support for multi-stream communication and campaigns.',
  },
];

export const INCLUDED_CREATIVE_TYPES = [
  { id: 'poster', label: 'Poster Design', category: 'Announcement' },
  { id: 'invitation', label: 'Invitation Design', category: 'Events' },
  { id: 'notice', label: 'Notice Design', category: 'Administrative' },
  { id: 'circular', label: 'Circular Design', category: 'Administrative' },
  { id: 'social-post', label: 'Social Media Post Design', category: 'Digital' },
  { id: 'whatsapp-status', label: 'WhatsApp Status Design', category: 'Digital' },
  { id: 'admission-announcement', label: 'Admission Announcement Design', category: 'Academic' },
  { id: 'exam-announcement', label: 'Exam Announcement Design', category: 'Academic' },
  { id: 'holiday-notice', label: 'Holiday Notice Design', category: 'Administrative' },
  { id: 'event-announcement', label: 'Event Announcement Design', category: 'Events' },
  { id: 'madrasa-content', label: 'Madrasa Social Media Content', category: 'Specialized' },
  { id: 'custom-digital', label: 'Custom Digital Design', category: 'Bespoke' },
];

export const BULK_SERVICES_CONFIG: Record<'idCards' | 'certificates', BulkServiceConfig> = {
  idCards: {
    id: 'bulk-id-cards',
    title: 'ID Cards',
    description: 'Need multiple student or staff identity cards? Take advantage of volume rates.',
    unitLabel: 'card',
    defaultQty: 50,
    minQty: 1,
    maxQty: 1000,
    tiers: [
      {
        rangeLabel: '1–49',
        min: 1,
        max: 49,
        unitPrice: 30,
        formattedUnitPrice: '₹30 / card',
      },
      {
        rangeLabel: '50+',
        min: 50,
        max: 99,
        unitPrice: 25,
        formattedUnitPrice: '₹25 / card',
      },
      {
        rangeLabel: '100+',
        min: 100,
        max: null,
        unitPrice: 20,
        formattedUnitPrice: '₹20 / card',
      },
    ],
  },
  certificates: {
    id: 'bulk-certificates',
    title: 'Certificates',
    description: 'Course completion, annual awards, event merit and achievement certificates.',
    unitLabel: 'certificate',
    defaultQty: 50,
    minQty: 1,
    maxQty: 1000,
    baseDesignFee: {
      label: 'Certificate Design',
      price: 149,
      formattedPrice: '₹149',
    },
    tiers: [
      {
        rangeLabel: '1–49',
        min: 1,
        max: 49,
        unitPrice: 20,
        formattedUnitPrice: '₹20 / certificate',
      },
      {
        rangeLabel: '50–99',
        min: 50,
        max: 99,
        unitPrice: 15,
        formattedUnitPrice: '₹15 / certificate',
      },
      {
        rangeLabel: '100+',
        min: 100,
        max: null,
        unitPrice: 10,
        formattedUnitPrice: '₹10 / certificate',
      },
    ],
  },
};

export const CUSTOM_DIGITAL_SERVICES = [
  {
    id: 'custom-design',
    name: 'Custom Digital Design',
    startingPrice: '₹99+',
    startingPriceNumber: 99,
    description: 'Bespoke banners, badges, brochures, flyers, or specialized social media graphics tailored to exact specifications.',
  },
  {
    id: 'custom-pdf',
    name: 'Custom PDF / Document Design',
    startingPrice: '₹149+',
    startingPriceNumber: 149,
    description: 'Institutional brochures, reports, rules booklets, guides, or multi-page digital documents prepared cleanly for distribution.',
  },
];
