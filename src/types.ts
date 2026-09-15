export interface NavItem {
  label: string;
  href: string;
  description?: string;
}

export interface QuickValuePoint {
  id: string;
  title: string;
  description: string;
  iconName: string;
}

export interface ServiceCardItem {
  id: string;
  title: string;
  description: string;
  ctaLabel: string;
  isCustomAction?: boolean;
  tag?: string;
  accentColor: string;
  accentPlacement: 'top' | 'left' | 'corner';
}

export interface WhyElevatePoint {
  id: string;
  title: string;
  description: string;
  number: string;
}

export interface DisciplinePillar {
  id: string;
  title: string;
  subtitle: string;
  tag: string;
  description: string;
  capabilities: string[];
  accentColor: string;
}

export interface SectorArchetype {
  id: string;
  title: string;
  tag: string;
  summary: string;
  highlights: string[];
}

export interface ColorToken {
  name: string;
  role: string;
  hex: string;
  twClass: string;
  textColor: string;
  border?: string;
}

export interface QuoteFormState {
  organizationType: string;
  organizationName: string;
  contactName: string;
  whatsappNumber: string;
  email: string;
  selectedServices: string[];
  projectTimeline: string;
  notes: string;
}

export interface WebsitePlan {
  id: string;
  name: string;
  badge: string;
  price: string;
  billingCycle: string;
  shortDescription: string;
  features: string[];
  ctaLabel: string;
  isPopular?: boolean;
  isAvailable: boolean;
  unavailableStatus?: string;
  unavailableDescription?: string;
}

export interface SelectedWebsitePlan {
  id: string;
  name: string;
  price: string;
  billingCycle: string;
  priceNumber?: number;
}

export interface AdmissionPackage {
  id: string;
  name: string;
  price: number;
  formattedPrice: string;
  includes: string[];
}

export interface AdmissionIndividualService {
  id: string;
  name: string;
  price: number;
  formattedPrice: string;
  description?: string;
}

export interface ExamPackage {
  id: string;
  name: string;
  price: number;
  formattedPrice: string;
  includes: string[];
}

export interface ExamIndividualService {
  id: string;
  name: string;
  price: number;
  formattedPrice: string;
  unitLabel?: string;
  description?: string;
  note?: string;
  allowsQuantity?: boolean;
}

export interface SelectedServiceItem {
  id: string;
  name: string;
  price: number;
  quantity?: number;
  category: 'admission' | 'exam';
  unitLabel?: string;
}

export interface SolutionSelection {
  category: 'admission' | 'exam';
  mode: 'package' | 'individual' | 'none';
  package?: {
    name: string;
    price: number;
    formattedPrice: string;
  };
  individualServices: SelectedServiceItem[];
  estimatedTotal: number;
}

export interface MonthlyCreativePlan {
  id: string;
  name: string;
  price: number;
  formattedPrice: string;
  billingCycle: string;
  creativesCount: number;
  creativesCountLabel: string;
  isPopular?: boolean;
  ctaLabel: string;
  description: string;
}

export interface SelectedMonthlyPlan {
  id: string;
  name: string;
  price: string;
  monthlyPriceNumber: number;
  creativesCount: number;
  creativesCountLabel: string;
  category: 'Monthly Creative';
}

export interface BulkServiceTier {
  rangeLabel: string;
  min: number;
  max: number | null;
  unitPrice: number;
  formattedUnitPrice: string;
}

export interface BulkServiceConfig {
  id: string;
  title: string;
  description: string;
  unitLabel: string;
  defaultQty: number;
  minQty: number;
  maxQty: number;
  tiers: BulkServiceTier[];
  baseDesignFee?: {
    label: string;
    price: number;
    formattedPrice: string;
  };
}

export interface SelectedBulkQuote {
  serviceId: string;
  serviceTitle: string;
  quantity: number;
  unitPrice: number;
  includeBaseDesign?: boolean;
  baseDesignFee?: number;
  estimatedTotal: number;
}

export interface ClientInstitution {
  id: string;
  name: string;
  logo: string;
  enabled: boolean;
  order: number;
  location?: string;
}

export type PartnerInstitution = ClientInstitution;

// ==========================================
// CENTRAL SITE CONTENT ARCHITECTURE & TYPES
// ==========================================

export interface HeroHighlightItem {
  enabled: boolean;
  title: string;
  label: string;
  price: string;
  suffix: string;
  targetSection: string;
}

export interface HeroConfig {
  heading: string;
  headingHighlight: string;
  pillElevateText: string;
  pillSubtitle: string;
  description: string;
  ctaWhatsAppText: string;
  ctaQuoteText: string;
  heroImage?: string;
  highlights: {
    websites: HeroHighlightItem;
    admission: HeroHighlightItem;
    exam: HeroHighlightItem;
    creatives: HeroHighlightItem;
  };
}

export interface ServiceItemConfig {
  id: string;
  title: string;
  description: string;
  priceBadge: string;
  deliverables: string[];
  ctaLabel: string;
  tag: string;
  category: string;
  icon: string;
  isCustomAction?: boolean;
  targetSection: string;
  enabled: boolean;
  order: number;
}

export interface WebsitePlanConfig {
  id: string;
  name: string;
  badge: string;
  price: string;
  priceNumber: number;
  currency: string;
  billingCycle: string;
  shortDescription: string;
  features: string[];
  ctaLabel: string;
  isPopular: boolean;
  isAvailable: boolean;
  unavailableStatus?: string;
  unavailableDescription?: string;
  order: number;
}

export interface AdmissionPackageConfig {
  id: string;
  name: string;
  price: number;
  currency: string;
  description: string;
  includes: string[];
  isAvailable: boolean;
}

export interface AdmissionIndividualServiceConfig {
  id: string;
  name: string;
  price: number;
  currency: string;
  unit: string;
  description: string;
  isAvailable: boolean;
  order: number;
}

export interface AdmissionServicesConfig {
  package: AdmissionPackageConfig;
  individual: AdmissionIndividualServiceConfig[];
}

export interface ExamPackageConfig {
  id: string;
  name: string;
  price: number;
  currency: string;
  description: string;
  includes: string[];
  isAvailable: boolean;
}

export interface ExamIndividualServiceConfig {
  id: string;
  name: string;
  price: number;
  currency: string;
  unit: string;
  allowsQuantity?: boolean;
  description: string;
  note?: string;
  isAvailable: boolean;
  order: number;
}

export interface ExamServicesConfig {
  package: ExamPackageConfig;
  individual: ExamIndividualServiceConfig[];
}

export interface MonthlyCreativePlanConfig {
  id: string;
  name: string;
  price: number;
  currency: string;
  billingCycle: string;
  creativesCount: number;
  creativesCountLabel: string;
  description: string;
  badge: string;
  isPopular: boolean;
  isAvailable: boolean;
  ctaLabel: string;
  features: string[];
  order: number;
}

export interface MonthlyCreativesConfig {
  plans: MonthlyCreativePlanConfig[];
  creativeTypes: Array<{
    id: string;
    label: string;
    category: string;
  }>;
}

export interface BulkIdCardsConfig {
  id: string;
  title: string;
  description: string;
  unitLabel: string;
  defaultQty: number;
  minQty: number;
  maxQty: number;
  tiers: Array<{
    rangeLabel: string;
    min: number;
    max: number | null;
    unitPrice: number;
  }>;
}

export interface BulkCertificatesConfig {
  id: string;
  title: string;
  description: string;
  unitLabel: string;
  defaultQty: number;
  minQty: number;
  maxQty: number;
  baseDesignFee: {
    label: string;
    price: number;
  };
  tiers: Array<{
    rangeLabel: string;
    min: number;
    max: number | null;
    unitPrice: number;
  }>;
}

export interface BulkPricingConfig {
  idCards: BulkIdCardsConfig;
  certificates: BulkCertificatesConfig;
}

export interface CustomEnquiryConfig {
  heading: string;
  description: string;
  buttonText: string;
  whatsappTemplate: string;
  enabled: boolean;
}

export interface ClientInstitutionsConfig {
  sectionBadge: string;
  sectionTitle: string;
  sectionSubtitle: string;
  list: ClientInstitution[];
}

export interface WorkflowStepConfig {
  step: string;
  title: string;
  description: string;
  icon: string;
  enabled: boolean;
}

export interface HowItWorksConfig {
  sectionBadge: string;
  sectionTitle: string;
  sectionSubtitle: string;
  steps: WorkflowStepConfig[];
}

export interface WhyElevateBenefitConfig {
  id: string;
  title: string;
  description: string;
  number: string;
  icon: string;
  enabled: boolean;
}

export interface WhyElevateConfig {
  sectionBadge: string;
  sectionTitle: string;
  sectionSubtitle: string;
  benefits: WhyElevateBenefitConfig[];
}

export interface FaqItemConfig {
  id: string;
  question: string;
  answer: string;
  enabled: boolean;
  order: number;
}

export interface FaqConfig {
  sectionBadge: string;
  sectionTitle: string;
  sectionSubtitle: string;
  items: FaqItemConfig[];
}

export interface ContactConfig {
  whatsappNumber: string;
  whatsappDigits: string;
  phoneNumber: string;
  email: string;
  emailNote: string;
  address: string;
  supportHours: string;
  turnaroundTarget: string;
  ctaText: string;
  socialLinks: {
    whatsapp: string;
    instagram?: string;
    facebook?: string;
    twitter?: string;
    linkedin?: string;
  };
}

export interface FooterConfig {
  brandDescription: string;
  copyrightText: string;
  navigationLabels: {
    websites: string;
    admission: string;
    exam: string;
    monthly: string;
    bulk: string;
    clients: string;
    faq: string;
    contact: string;
  };
}

export interface WhatsAppTemplatesConfig {
  defaultNumber: string;
  templates: {
    websitePlan: string;
    admissionPackage: string;
    admissionIndividual: string;
    examPackage: string;
    examIndividual: string;
    monthlyPlan: string;
    bulkIdCards: string;
    bulkCertificates: string;
    customEnquiry: string;
    generalEnquiry: string;
  };
}

export interface GeneralConfig {
  brandName: string;
  tagline: string;
  websiteTitle: string;
  metaDescription: string;
  defaultCurrency: string;
  logoText: string;
  logoSubtext: string;
  logoImage: string;
  favicon: string;
}

export interface SiteContent {
  version: number;
  lastUpdated: string;
  general: GeneralConfig;
  contact: ContactConfig;
  hero: HeroConfig;
  services: ServiceItemConfig[];
  websitePlans: WebsitePlanConfig[];
  admissionServices: AdmissionServicesConfig;
  examServices: ExamServicesConfig;
  monthlyCreativePlans: MonthlyCreativesConfig;
  bulkPricing: BulkPricingConfig;
  customEnquiry: CustomEnquiryConfig;
  clientInstitutions: ClientInstitutionsConfig;
  howItWorks: HowItWorksConfig;
  whyElevate: WhyElevateConfig;
  faq: FaqConfig;
  footer: FooterConfig;
  whatsappSettings: WhatsAppTemplatesConfig;
}

export interface AdminUser {
  username: string;
  role: 'admin';
}

export interface AdminSession {
  token: string;
  user: AdminUser;
  expiresAt: number;
}


