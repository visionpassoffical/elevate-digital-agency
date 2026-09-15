import type { ClientInstitution, PartnerInstitution } from '../types';

export const STORAGE_KEY_CLIENTS = 'elevate_client_institutions';
export const STORAGE_KEY_PARTNERS = 'elevate_partner_institutions';

// High-resolution, clean SVG logo generators for authentic institutional presentation
const createSvgEmblem = (
  bgGradStart: string,
  bgGradEnd: string,
  accentColor: string,
  symbolPath: string,
  monogram: string
): string => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
    <defs>
      <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${bgGradStart}" />
        <stop offset="100%" stop-color="${bgGradEnd}" />
      </linearGradient>
    </defs>
    <rect width="120" height="120" rx="28" fill="url(#grad)" />
    <rect x="4" y="4" width="112" height="112" rx="24" fill="none" stroke="${accentColor}" stroke-opacity="0.25" stroke-width="2" />
    ${symbolPath}
    <text x="60" y="98" font-family="system-ui, -apple-system, sans-serif" font-weight="800" font-size="13" fill="#FFFFFF" text-anchor="middle" letter-spacing="1.5">${monogram}</text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};

export const DEFAULT_PARTNER_INSTITUTIONS: PartnerInstitution[] = [
  {
    id: 'partner-al-huda',
    name: 'Al-Huda Islamic Academy',
    logo: createSvgEmblem(
      '#064e3b',
      '#047857',
      '#34d399',
      `<path d="M40 38 C40 38, 52 48, 60 48 C68 48, 80 38, 80 38 V66 C80 66, 68 76, 60 76 C52 76, 40 66, 40 66 Z" fill="none" stroke="#FFFFFF" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
       <path d="M60 48 V76" stroke="#34d399" stroke-width="3" stroke-linecap="round" />
       <circle cx="60" cy="30" r="5" fill="#facc15" />`,
      'AL-HUDA'
    ),
    enabled: true,
    order: 1,
    location: 'Kerala',
  },
  {
    id: 'partner-markaz-college',
    name: 'Markaz Arts & Science College',
    logo: createSvgEmblem(
      '#1e3a8a',
      '#2563eb',
      '#60a5fa',
      `<path d="M38 68 L60 32 L82 68 Z" fill="none" stroke="#FFFFFF" stroke-width="4" stroke-linejoin="round" />
       <line x1="46" y1="56" x2="74" y2="56" stroke="#60a5fa" stroke-width="3" />
       <circle cx="60" cy="46" r="4" fill="#60a5fa" />`,
      'MASC'
    ),
    enabled: true,
    order: 2,
    location: 'Kozhikode',
  },
  {
    id: 'partner-darul-huda',
    name: 'Darul Huda Islamic Complex',
    logo: createSvgEmblem(
      '#0f172a',
      '#1e293b',
      '#38bdf8',
      `<path d="M40 70 C40 44, 80 44, 80 70 Z" fill="none" stroke="#38bdf8" stroke-width="4" />
       <path d="M52 70 V56 C52 52, 68 52, 68 56 V70" fill="none" stroke="#FFFFFF" stroke-width="3" />
       <circle cx="60" cy="34" r="4" fill="#38bdf8" />`,
      'DHIC'
    ),
    enabled: true,
    order: 3,
    location: 'Malappuram',
  },
  {
    id: 'partner-crescent-school',
    name: 'Crescent International School',
    logo: createSvgEmblem(
      '#312e81',
      '#4338ca',
      '#818cf8',
      `<path d="M48 36 A20 20 0 1 0 74 68 A24 24 0 1 1 48 36 Z" fill="#818cf8" opacity="0.9" />
       <polygon points="68,36 71,44 80,44 73,49 76,57 68,52 61,57 63,49 57,44 65,44" fill="#fbbf24" />`,
      'CRESCENT'
    ),
    enabled: true,
    order: 4,
    location: 'Campus Network',
  },
  {
    id: 'partner-grace-public',
    name: 'Grace Public School',
    logo: createSvgEmblem(
      '#14532d',
      '#166534',
      '#86efac',
      `<path d="M60 28 L78 38 V58 C78 72, 60 82, 60 82 C60 82, 42 72, 42 58 V38 Z" fill="none" stroke="#FFFFFF" stroke-width="4" stroke-linejoin="round" />
       <path d="M50 54 L57 61 L71 47" fill="none" stroke="#86efac" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />`,
      'GRACE'
    ),
    enabled: true,
    order: 5,
    location: 'Higher Secondary',
  },
  {
    id: 'partner-ihsan-academy',
    name: 'Ihsan Higher Secondary School',
    logo: createSvgEmblem(
      '#701a75',
      '#86198f',
      '#e879f9',
      `<polygon points="60,32 86,44 60,56 34,44" fill="none" stroke="#FFFFFF" stroke-width="4" stroke-linejoin="round" />
       <path d="M42 50 V66 C42 72, 78 72, 78 66 V50" fill="none" stroke="#e879f9" stroke-width="3" />
       <path d="M84 46 V64" stroke="#facc15" stroke-width="2.5" stroke-linecap="round" />
       <circle cx="84" cy="66" r="3" fill="#facc15" />`,
      'IHSAN'
    ),
    enabled: true,
    order: 6,
    location: 'Education Trust',
  },
];

export const DEFAULT_CLIENT_INSTITUTIONS: ClientInstitution[] = DEFAULT_PARTNER_INSTITUTIONS;

export function getClientInstitutions(): ClientInstitution[] {
  if (typeof window === 'undefined') return DEFAULT_CLIENT_INSTITUTIONS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_CLIENTS) || localStorage.getItem(STORAGE_KEY_PARTNERS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_CLIENTS, JSON.stringify(DEFAULT_CLIENT_INSTITUTIONS));
      return DEFAULT_CLIENT_INSTITUTIONS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    }
  } catch (e) {
    console.error('Failed to parse client institutions from localStorage', e);
  }
  return DEFAULT_CLIENT_INSTITUTIONS;
}

export function saveClientInstitutions(list: ClientInstitution[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY_CLIENTS, JSON.stringify(list));
    localStorage.setItem(STORAGE_KEY_PARTNERS, JSON.stringify(list));
    // Dispatch custom events so all open components/listeners update reactively
    window.dispatchEvent(new Event('elevate_clients_updated'));
    window.dispatchEvent(new Event('elevate_partners_updated'));
  } catch (e) {
    console.error('Failed to save client institutions to localStorage', e);
  }
}

export function resetClientInstitutions(): ClientInstitution[] {
  saveClientInstitutions(DEFAULT_CLIENT_INSTITUTIONS);
  return DEFAULT_CLIENT_INSTITUTIONS;
}

// Backwards compatibility aliases
export const getPartnerInstitutions = getClientInstitutions;
export const savePartnerInstitutions = saveClientInstitutions;
export const resetPartnerInstitutions = resetClientInstitutions;
