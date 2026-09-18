import express from 'express';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import dotenv from 'dotenv';
import { INITIAL_SITE_CONTENT } from '../data/defaultSiteContent';
import type { SiteContent } from '../types';

dotenv.config();

// Determine writable data and uploads directories
function getDataDir(): string {
  // On Vercel serverless, root fs is read-only, /tmp is writable
  if (process.env.VERCEL) {
    const tmp = path.join('/tmp', 'elevate-data');
    if (!fs.existsSync(tmp)) {
      try {
        fs.mkdirSync(tmp, { recursive: true });
      } catch (e) {
        // ignore
      }
    }
    return tmp;
  }
  const local = path.join(process.cwd(), 'data');
  if (!fs.existsSync(local)) {
    try {
      fs.mkdirSync(local, { recursive: true });
    } catch (e) {
      // ignore
    }
  }
  return local;
}

const DATA_DIR = getDataDir();
const CONTENT_FILE = path.join(DATA_DIR, 'site-content.json');
const ADMIN_CONFIG_FILE = path.join(DATA_DIR, 'admin-config.json');
const SESSIONS_FILE = path.join(DATA_DIR, 'sessions.json');
const UPLOADS_DIR = process.env.VERCEL
  ? path.join('/tmp', 'elevate-uploads')
  : path.join(process.cwd(), 'public', 'uploads');

if (!fs.existsSync(UPLOADS_DIR)) {
  try {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
  } catch (e) {
    // ignore
  }
}

// Global cached in-memory content
let currentSiteContent: SiteContent;

function loadSiteContent(): SiteContent {
  // Try dynamic data file first, then fallback to initial local file if in Vercel
  const possiblePaths = [
    CONTENT_FILE,
    path.join(process.cwd(), 'data', 'site-content.json'),
  ];

  for (const filePath of possiblePaths) {
    try {
      if (fs.existsSync(filePath)) {
        const raw = fs.readFileSync(filePath, 'utf-8');
        const parsed = JSON.parse(raw);
        return {
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
      }
    } catch (err) {
      console.error(`Error reading ${filePath}:`, err);
    }
  }

  return INITIAL_SITE_CONTENT;
}

function saveSiteContent(content: SiteContent): void {
  try {
    currentSiteContent = {
      ...content,
      lastUpdated: new Date().toISOString(),
    };
    const tmpPath = `${CONTENT_FILE}.tmp`;
    fs.writeFileSync(tmpPath, JSON.stringify(currentSiteContent, null, 2), 'utf-8');
    fs.renameSync(tmpPath, CONTENT_FILE);
  } catch (err) {
    console.warn('Could not write site content to disk (read-only filesystem):', err);
  }
}

currentSiteContent = loadSiteContent();

// Admin credentials helper
interface AdminConfig {
  username: string;
  passwordHash: string; // sha256
  salt: string;
}

function hashPassword(password: string, salt: string): string {
  return crypto.createHmac('sha256', salt).update(password).digest('hex');
}

function getAdminConfig(): AdminConfig {
  const defaultUsername = process.env.ADMIN_USERNAME || 'mfalahudheenpa';
  const defaultPassword = process.env.ADMIN_PASSWORD || 'HAFIZfalah$2003';

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
    } catch (e) {
      // ignore
    }
  }

  const salt = 'bac4124e3d6c47cb04746f990d286e3b';
  return {
    username: defaultUsername,
    salt,
    passwordHash: hashPassword(defaultPassword, salt),
  };
}

// Session signing with secret for serverless reliability
const SESSION_SECRET = process.env.ADMIN_SESSION_SECRET || 'elevate-digital-agency-secure-secret-2025';

interface SessionRecord {
  token: string;
  username: string;
  createdAt: number;
  expiresAt: number;
}

const activeSessions: Map<string, SessionRecord> = new Map();

function loadSessions(): void {
  try {
    if (fs.existsSync(SESSIONS_FILE)) {
      const raw = fs.readFileSync(SESSIONS_FILE, 'utf-8');
      const list: SessionRecord[] = JSON.parse(raw);
      const now = Date.now();
      for (const s of list) {
        if (s.expiresAt > now) {
          activeSessions.set(s.token, s);
        }
      }
    }
  } catch (e) {
    // ignore
  }
}

function saveSessions(): void {
  try {
    const list = Array.from(activeSessions.values()).filter((s) => s.expiresAt > Date.now());
    fs.writeFileSync(SESSIONS_FILE, JSON.stringify(list, null, 2), 'utf-8');
  } catch (e) {
    // ignore
  }
}

loadSessions();

function createSession(username: string): SessionRecord {
  const now = Date.now();
  const expiresAt = now + 7 * 24 * 60 * 60 * 1000; // 7 days

  // Cryptographically sign token so any serverless instance can validate it statelessly
  const payload = Buffer.from(
    JSON.stringify({
      u: username,
      exp: expiresAt,
      rnd: crypto.randomBytes(8).toString('hex'),
    })
  ).toString('base64url');

  const sig = crypto.createHmac('sha256', SESSION_SECRET).update(payload).digest('base64url');
  const token = `${payload}.${sig}`;

  const session: SessionRecord = {
    token,
    username,
    createdAt: now,
    expiresAt,
  };

  activeSessions.set(token, session);
  saveSessions();
  return session;
}

function validateToken(token: string | undefined): SessionRecord | null {
  if (!token) return null;

  // 1. Check in-memory map
  const cached = activeSessions.get(token);
  if (cached && cached.expiresAt > Date.now()) {
    return cached;
  }

  // 2. Validate cryptographic signature (stateless for serverless instances)
  if (token.includes('.')) {
    const [payload, sig] = token.split('.');
    if (payload && sig) {
      const expectedSig = crypto.createHmac('sha256', SESSION_SECRET).update(payload).digest('base64url');
      if (sig === expectedSig) {
        try {
          const parsed = JSON.parse(Buffer.from(payload, 'base64url').toString('utf-8'));
          if (parsed.exp && parsed.exp > Date.now() && parsed.u) {
            const session: SessionRecord = {
              token,
              username: parsed.u,
              createdAt: Date.now(),
              expiresAt: parsed.exp,
            };
            activeSessions.set(token, session);
            return session;
          }
        } catch {
          // ignore
        }
      }
    }
  }

  return null;
}

function parseCookies(req: express.Request): Record<string, string> {
  const list: Record<string, string> = {};
  const cookieHeader = req.headers.cookie;
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

function getRequestToken(req: express.Request): string | undefined {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.split(' ')[1];
  }
  const cookies = parseCookies(req);
  return cookies['elevate_admin_session'];
}

function authenticateAdminMiddleware(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  const token = getRequestToken(req);
  if (!token) {
    return res.status(401).json({ success: false, error: 'Unauthorized: Missing or invalid token' });
  }

  const session = validateToken(token);
  if (!session) {
    return res.status(401).json({ success: false, error: 'Unauthorized: Session expired or invalid' });
  }

  (req as any).adminSession = session;
  next();
}

export function createApp(): express.Application {
  const app = express();

  // Express middleware for JSON parsing with 15mb limit for uploads/logos
  app.use(express.json({ limit: '15mb' }));
  app.use(express.urlencoded({ extended: true, limit: '15mb' }));

  // Static serving for user uploads
  app.use('/uploads', express.static(UPLOADS_DIR));

  // Create API router
  const api = express.Router();

  // Guarantee all responses from this router have application/json Content-Type
  api.use((req, res, next) => {
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    next();
  });

  // Health check
  api.get('/health', (req, res) => {
    res.json({
      status: 'ok',
      version: currentSiteContent.version,
      lastUpdated: currentSiteContent.lastUpdated,
    });
  });

  // Get full site content (public)
  api.get('/content', (req, res) => {
    res.json({
      success: true,
      content: currentSiteContent,
    });
  });

  // Login
  api.post('/admin/login', (req, res) => {
    const { username, password } = req.body || {};
    if (!username || !password) {
      return res.status(400).json({ success: false, error: 'Username and password are required' });
    }

    const adminConfig = getAdminConfig();
    const cleanUsername = String(username).trim();
    const providedHash = hashPassword(String(password), adminConfig.salt);

    const envUser = (process.env.ADMIN_USERNAME || 'admin').toLowerCase();
    const envPass = process.env.ADMIN_PASSWORD || 'HAFIZfalah$2003';

    const matchesConfig =
      (cleanUsername.toLowerCase() === adminConfig.username.toLowerCase() || cleanUsername.toLowerCase() === 'admin') &&
      providedHash === adminConfig.passwordHash;

    const matchesEnv =
      (cleanUsername.toLowerCase() === envUser ||
        cleanUsername.toLowerCase() === adminConfig.username.toLowerCase() ||
        cleanUsername.toLowerCase() === 'admin' ||
        cleanUsername.toLowerCase() === 'mfalahudheenpa') &&
      String(password) === envPass;

    if (!matchesConfig && !matchesEnv) {
      return res.status(401).json({ success: false, error: 'Invalid username or password' });
    }

    const session = createSession(cleanUsername);

    // Set secure HTTP-only cookie
    res.setHeader('Set-Cookie', [
      `elevate_admin_session=${session.token}; HttpOnly; Path=/; SameSite=Lax; Max-Age=${7 * 24 * 60 * 60}`,
    ]);

    return res.json({
      success: true,
      token: session.token,
      expiresAt: session.expiresAt,
      user: {
        username: cleanUsername,
        role: 'admin',
      },
    });
  });

  // Verify Session
  api.get('/admin/session', (req, res) => {
    const token = getRequestToken(req);
    if (!token) {
      return res.status(401).json({ valid: false, error: 'No token or session provided' });
    }
    const session = validateToken(token);
    if (!session) {
      return res.status(401).json({ valid: false, error: 'Session expired or invalid' });
    }
    return res.json({
      valid: true,
      user: {
        username: session.username,
        role: 'admin',
      },
      expiresAt: session.expiresAt,
    });
  });

  // Logout
  api.post('/admin/logout', (req, res) => {
    const token = getRequestToken(req);
    if (token) {
      activeSessions.delete(token);
      saveSessions();
    }

    // Clear HTTP-only session cookie
    res.setHeader('Set-Cookie', [
      `elevate_admin_session=; HttpOnly; Path=/; SameSite=Lax; Max-Age=0; Expires=Thu, 01 Jan 1970 00:00:00 GMT`,
    ]);

    res.json({ success: true, message: 'Logged out successfully' });
  });

  // Change Password
  api.post('/admin/change-password', authenticateAdminMiddleware, (req, res) => {
    const currentPassword = req.body?.currentPassword || req.body?.oldPassword;
    const newPassword = req.body?.newPassword;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, error: 'Both current and new password are required' });
    }
    if (String(newPassword).length < 6) {
      return res.status(400).json({ success: false, error: 'New password must be at least 6 characters' });
    }

    const adminConfig = getAdminConfig();
    const currentHash = hashPassword(String(currentPassword), adminConfig.salt);
    if (currentHash !== adminConfig.passwordHash) {
      return res.status(400).json({ success: false, error: 'Current password is incorrect' });
    }

    const newSalt = crypto.randomBytes(16).toString('hex');
    const newConfig: AdminConfig = {
      username: adminConfig.username,
      salt: newSalt,
      passwordHash: hashPassword(String(newPassword), newSalt),
    };

    try {
      fs.writeFileSync(ADMIN_CONFIG_FILE, JSON.stringify(newConfig, null, 2), 'utf-8');
    } catch (e) {
      console.warn('Could not write admin-config file:', e);
    }

    res.json({ success: true, message: 'Password updated successfully' });
  });

  // Save / Update Content
  api.put('/admin/content', authenticateAdminMiddleware, (req, res) => {
    try {
      const newContent = req.body;
      if (!newContent || typeof newContent !== 'object') {
        return res.status(400).json({ success: false, error: 'Invalid content payload' });
      }

      const updated: SiteContent = {
        ...newContent,
        version: (currentSiteContent.version || 1) + 1,
        lastUpdated: new Date().toISOString(),
      };

      saveSiteContent(updated);

      res.json({
        success: true,
        message: 'Changes saved successfully.',
        content: currentSiteContent,
      });
    } catch (err: any) {
      console.error('Error saving content:', err);
      res.status(500).json({ success: false, error: err.message || 'Failed to save content' });
    }
  });

  // Reset Content to Default
  api.post('/admin/reset-content', authenticateAdminMiddleware, (req, res) => {
    try {
      saveSiteContent({
        ...INITIAL_SITE_CONTENT,
        version: (currentSiteContent.version || 1) + 1,
        lastUpdated: new Date().toISOString(),
      });
      res.json({
        success: true,
        message: 'Content successfully reset to default approved settings.',
        content: currentSiteContent,
      });
    } catch (err: any) {
      res.status(500).json({ success: false, error: 'Failed to reset content' });
    }
  });

  // Upload Image/Logo
  api.post('/admin/upload', authenticateAdminMiddleware, (req, res) => {
    try {
      const { filename, dataUrl } = req.body;
      if (!filename || !dataUrl) {
        return res.status(400).json({ success: false, error: 'Filename and dataUrl are required' });
      }

      const matches = dataUrl.match(/^data:([A-Za-z-+/]+);base64,(.+)$/);
      if (!matches || matches.length !== 3) {
        return res.status(400).json({ success: false, error: 'Invalid image data format' });
      }

      const mimeType = matches[1];
      const base64Data = matches[2];
      const buffer = Buffer.from(base64Data, 'base64');

      if (buffer.length > 5 * 1024 * 1024) {
        return res.status(400).json({ success: false, error: 'Image file size cannot exceed 5MB' });
      }

      let ext = path.extname(filename).toLowerCase();
      if (!ext) {
        if (mimeType.includes('png')) ext = '.png';
        else if (mimeType.includes('jpeg') || mimeType.includes('jpg')) ext = '.jpg';
        else if (mimeType.includes('svg')) ext = '.svg';
        else if (mimeType.includes('webp')) ext = '.webp';
        else ext = '.png';
      }

      const safeName = `${Date.now()}-${crypto.randomBytes(6).toString('hex')}${ext}`;
      const filePath = path.join(UPLOADS_DIR, safeName);
      try {
        fs.writeFileSync(filePath, buffer);
      } catch (e) {
        // If cannot write to uploads folder in serverless, return dataUrl directly as fallback
        return res.json({
          success: true,
          url: dataUrl,
          filename: safeName,
          message: 'File processed successfully',
        });
      }

      const publicUrl = `/uploads/${safeName}`;
      res.json({
        success: true,
        url: publicUrl,
        filename: safeName,
        message: 'File uploaded successfully',
      });
    } catch (err: any) {
      console.error('Upload error:', err);
      res.status(500).json({ success: false, error: 'Failed to process file upload' });
    }
  });

  // Mount API router on both '/api' AND '/' to guarantee matching regardless of rewrite URL format
  app.use('/api', api);
  app.use('/', api);

  return app;
}

export const defaultApp = createApp();
export default defaultApp;
