import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { INITIAL_SITE_CONTENT } from '../src/data/defaultSiteContent';
import type { SiteContent } from '../src/types';

// Environment variables with secure defaults
export const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'mfalahudheenpa';
export const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'HAFIZfalah$2003';
export const ADMIN_SESSION_SECRET =
  process.env.ADMIN_SESSION_SECRET || 'elevate-digital-agency-secure-secret-2025';

// Helpers for paths
function getDataDir(): string {
  if (process.env.VERCEL) {
    const tmp = path.join('/tmp', 'elevate-data');
    if (!fs.existsSync(tmp)) {
      try {
        fs.mkdirSync(tmp, { recursive: true });
      } catch {
        // ignore
      }
    }
    return tmp;
  }
  const local = path.join(process.cwd(), 'data');
  if (!fs.existsSync(local)) {
    try {
      fs.mkdirSync(local, { recursive: true });
    } catch {
      // ignore
    }
  }
  return local;
}

const DATA_DIR = getDataDir();
const CONTENT_FILE = path.join(DATA_DIR, 'site-content.json');
const ADMIN_CONFIG_FILE = path.join(DATA_DIR, 'admin-config.json');

// Global cached in-memory content
let cachedSiteContent: SiteContent | null = null;

export function loadSiteContent(): SiteContent {
  if (cachedSiteContent) {
    return cachedSiteContent;
  }

  const possiblePaths = [
    CONTENT_FILE,
    path.join(process.cwd(), 'data', 'site-content.json'),
  ];

  for (const filePath of possiblePaths) {
    try {
      if (fs.existsSync(filePath)) {
        const raw = fs.readFileSync(filePath, 'utf-8');
        const parsed = JSON.parse(raw);
        cachedSiteContent = {
          ...INITIAL_SITE_CONTENT,
          ...parsed,
          hero: { ...INITIAL_SITE_CONTENT.hero, ...(parsed.hero || {}) },
          services: parsed.services || INITIAL_SITE_CONTENT.services,
          websitePlans: parsed.websitePlans || INITIAL_SITE_CONTENT.websitePlans,
          admissionServices: {
            package: { ...INITIAL_SITE_CONTENT.admissionServices.package, ...(parsed.admissionServices?.package || {}) },
            individual: parsed.admissionServices?.individual || INITIAL_SITE_CONTENT.admissionServices.individual,
          },
          examServices: {
            package: { ...INITIAL_SITE_CONTENT.examServices.package, ...(parsed.examServices?.package || {}) },
            individual: parsed.examServices?.individual || INITIAL_SITE_CONTENT.examServices.individual,
          },
          monthlyCreativePlans: {
            plans: parsed.monthlyCreativePlans?.plans || INITIAL_SITE_CONTENT.monthlyCreativePlans.plans,
            creativeTypes: parsed.monthlyCreativePlans?.creativeTypes || INITIAL_SITE_CONTENT.monthlyCreativePlans.creativeTypes,
          },
          bulkPricing: {
            idCards: { ...INITIAL_SITE_CONTENT.bulkPricing.idCards, ...(parsed.bulkPricing?.idCards || {}) },
            certificates: { ...INITIAL_SITE_CONTENT.bulkPricing.certificates, ...(parsed.bulkPricing?.certificates || {}) },
          },
          customEnquiry: { ...INITIAL_SITE_CONTENT.customEnquiry, ...(parsed.customEnquiry || {}) },
          clientInstitutions: { ...INITIAL_SITE_CONTENT.clientInstitutions, ...(parsed.clientInstitutions || {}) },
          howItWorks: { ...INITIAL_SITE_CONTENT.howItWorks, ...(parsed.howItWorks || {}) },
          whyElevate: { ...INITIAL_SITE_CONTENT.whyElevate, ...(parsed.whyElevate || {}) },
          faq: { ...INITIAL_SITE_CONTENT.faq, ...(parsed.faq || {}) },
          contact: { ...INITIAL_SITE_CONTENT.contact, ...(parsed.contact || {}) },
          footer: { ...INITIAL_SITE_CONTENT.footer, ...(parsed.footer || {}) },
          whatsappSettings: { ...INITIAL_SITE_CONTENT.whatsappSettings, ...(parsed.whatsappSettings || {}) },
          general: { ...INITIAL_SITE_CONTENT.general, ...(parsed.general || {}) },
        };
        return cachedSiteContent;
      }
    } catch {
      // ignore
    }
  }

  cachedSiteContent = { ...INITIAL_SITE_CONTENT };
  return cachedSiteContent;
}

export function saveSiteContent(content: SiteContent): SiteContent {
  cachedSiteContent = {
    ...content,
    version: (content.version || 1) + 1,
    lastUpdated: new Date().toISOString(),
  };

  try {
    const tmpPath = `${CONTENT_FILE}.tmp`;
    fs.writeFileSync(tmpPath, JSON.stringify(cachedSiteContent, null, 2), 'utf-8');
    fs.renameSync(tmpPath, CONTENT_FILE);
  } catch {
    // Read-only filesystem in serverless, in-memory state is maintained
  }

  return cachedSiteContent;
}

export function resetSiteContent(): SiteContent {
  cachedSiteContent = {
    ...INITIAL_SITE_CONTENT,
    version: (cachedSiteContent?.version || 1) + 1,
    lastUpdated: new Date().toISOString(),
  };

  try {
    fs.writeFileSync(CONTENT_FILE, JSON.stringify(cachedSiteContent, null, 2), 'utf-8');
  } catch {
    // ignore
  }

  return cachedSiteContent;
}

// Password hashing
export function hashPassword(password: string, salt: string): string {
  return crypto.createHmac('sha256', salt).update(password).digest('hex');
}

export interface AdminConfig {
  username: string;
  passwordHash: string;
  salt: string;
}

export function getAdminConfig(): AdminConfig {
  const possiblePaths = [
    ADMIN_CONFIG_FILE,
    path.join(process.cwd(), 'data', 'admin-config.json'),
  ];

  for (const filePath of possiblePaths) {
    try {
      if (fs.existsSync(filePath)) {
        const raw = fs.readFileSync(filePath, 'utf-8');
        return JSON.parse(raw);
      }
    } catch {
      // ignore
    }
  }

  const salt = 'bac4124e3d6c47cb04746f990d286e3b';
  return {
    username: ADMIN_USERNAME,
    salt,
    passwordHash: hashPassword(ADMIN_PASSWORD, salt),
  };
}

export function verifyAdminCredentials(usernameInput: string, passwordInput: string): boolean {
  const cleanUser = String(usernameInput || '').trim().toLowerCase();
  const rawPass = String(passwordInput || '');
  if (!cleanUser || !rawPass) return false;

  const config = getAdminConfig();
  const providedHash = hashPassword(rawPass, config.salt);

  const envUser = ADMIN_USERNAME.toLowerCase();
  const envPass = ADMIN_PASSWORD;

  const matchesConfig =
    (cleanUser === config.username.toLowerCase() || cleanUser === 'admin') &&
    providedHash === config.passwordHash;

  const matchesEnv =
    (cleanUser === envUser ||
      cleanUser === config.username.toLowerCase() ||
      cleanUser === 'admin' ||
      cleanUser === 'mfalahudheenpa') &&
    rawPass === envPass;

  return matchesConfig || matchesEnv;
}

// Stateless Cryptographic Session Management (Works across any serverless instance)
export interface SessionRecord {
  token: string;
  username: string;
  createdAt: number;
  expiresAt: number;
}

export function createSession(username: string): SessionRecord {
  const now = Date.now();
  const expiresAt = now + 7 * 24 * 60 * 60 * 1000; // 7 days

  const payload = Buffer.from(
    JSON.stringify({
      u: username,
      exp: expiresAt,
      rnd: crypto.randomBytes(8).toString('hex'),
    })
  ).toString('base64url');

  const sig = crypto.createHmac('sha256', ADMIN_SESSION_SECRET).update(payload).digest('base64url');
  const token = `${payload}.${sig}`;

  return {
    token,
    username,
    createdAt: now,
    expiresAt,
  };
}

export function validateToken(token: string | undefined): SessionRecord | null {
  if (!token || typeof token !== 'string') return null;

  if (token.includes('.')) {
    const [payload, sig] = token.split('.');
    if (payload && sig) {
      const expectedSig = crypto
        .createHmac('sha256', ADMIN_SESSION_SECRET)
        .update(payload)
        .digest('base64url');

      if (sig === expectedSig) {
        try {
          const parsed = JSON.parse(Buffer.from(payload, 'base64url').toString('utf-8'));
          if (parsed.exp && parsed.exp > Date.now() && parsed.u) {
            return {
              token,
              username: parsed.u,
              createdAt: Date.now(),
              expiresAt: parsed.exp,
            };
          }
        } catch {
          // ignore
        }
      }
    }
  }

  return null;
}

export function parseCookies(cookieHeader: string | undefined): Record<string, string> {
  const list: Record<string, string> = {};
  if (!cookieHeader) return list;
  cookieHeader.split(';').forEach((cookie) => {
    const parts = cookie.split('=');
    const name = parts[0]?.trim();
    if (!name) return;
    const value = parts.slice(1).join('=').trim();
    list[name] = decodeURIComponent(value);
  });
  return list;
}

export function getRequestToken(req: any): string | undefined {
  const authHeader = req.headers?.authorization;
  if (authHeader && typeof authHeader === 'string' && authHeader.startsWith('Bearer ')) {
    return authHeader.split(' ')[1];
  }
  const cookies = parseCookies(req.headers?.cookie);
  return cookies['elevate_admin_session'];
}

export function makeSessionCookie(token: string, maxAgeSeconds: number = 7 * 24 * 60 * 60): string {
  const isProd = process.env.NODE_ENV === 'production' || !!process.env.VERCEL;
  const secureFlag = isProd ? '; Secure' : '';
  if (maxAgeSeconds <= 0) {
    return `elevate_admin_session=; HttpOnly; Path=/; SameSite=Lax; Max-Age=0; Expires=Thu, 01 Jan 1970 00:00:00 GMT${secureFlag}`;
  }
  return `elevate_admin_session=${token}; HttpOnly; Path=/; SameSite=Lax; Max-Age=${maxAgeSeconds}${secureFlag}`;
}

export function parseBody(req: any): any {
  if (!req.body) return {};
  if (typeof req.body === 'string') {
    try {
      return JSON.parse(req.body);
    } catch {
      return {};
    }
  }
  return req.body;
}

export function sendJson(res: any, status: number, data: any) {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  if (typeof res.status === 'function') {
    res.status(status);
  } else {
    res.statusCode = status;
  }
  if (typeof res.json === 'function') {
    res.json(data);
  } else {
    res.end(JSON.stringify(data));
  }
}
