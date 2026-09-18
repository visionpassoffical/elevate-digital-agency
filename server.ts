import express from 'express';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { INITIAL_SITE_CONTENT } from './src/data/defaultSiteContent';
import type { SiteContent } from './src/types';

dotenv.config();

const PORT = 3000;
const DATA_DIR = path.join(process.cwd(), 'data');
const CONTENT_FILE = path.join(DATA_DIR, 'site-content.json');
const ADMIN_CONFIG_FILE = path.join(DATA_DIR, 'admin-config.json');
const SESSIONS_FILE = path.join(DATA_DIR, 'sessions.json');
const UPLOADS_DIR = path.join(process.cwd(), 'public', 'uploads');

// Ensure data and uploads directories exist
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Global cached in-memory content
let currentSiteContent: SiteContent;

function loadSiteContent(): SiteContent {
  try {
    if (fs.existsSync(CONTENT_FILE)) {
      const raw = fs.readFileSync(CONTENT_FILE, 'utf-8');
      const parsed = JSON.parse(raw);
      // Merge with default initial content to ensure any missing fields are filled
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
    console.error('Error reading site-content.json, using defaults:', err);
  }

  // If file doesn't exist or failed to load, initialize with defaults and save
  saveSiteContent(INITIAL_SITE_CONTENT);
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
    console.error('Failed to save site content to file:', err);
    throw err;
  }
}

// Initialize content
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
  const defaultUsername = process.env.ADMIN_USERNAME || 'admin';
  const defaultPassword = process.env.ADMIN_PASSWORD || 'Elevate@Admin2025!';

  try {
    if (fs.existsSync(ADMIN_CONFIG_FILE)) {
      const raw = fs.readFileSync(ADMIN_CONFIG_FILE, 'utf-8');
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error('Could not read admin-config.json, generating default', e);
  }

  const salt = crypto.randomBytes(16).toString('hex');
  const config: AdminConfig = {
    username: defaultUsername,
    salt,
    passwordHash: hashPassword(defaultPassword, salt),
  };
  try {
    fs.writeFileSync(ADMIN_CONFIG_FILE, JSON.stringify(config, null, 2), 'utf-8');
  } catch (e) {
    console.error('Could not write admin-config.json', e);
  }
  return config;
}

// Persistent session management
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
    console.error('Could not load sessions', e);
  }
}

function saveSessions(): void {
  try {
    const list = Array.from(activeSessions.values()).filter((s) => s.expiresAt > Date.now());
    fs.writeFileSync(SESSIONS_FILE, JSON.stringify(list, null, 2), 'utf-8');
  } catch (e) {
    console.error('Could not save sessions', e);
  }
}

loadSessions();

function createSession(username: string): SessionRecord {
  const token = crypto.randomBytes(32).toString('hex');
  const now = Date.now();
  const session: SessionRecord = {
    token,
    username,
    createdAt: now,
    expiresAt: now + 7 * 24 * 60 * 60 * 1000, // 7 days
  };
  activeSessions.set(token, session);
  saveSessions();
  return session;
}

function validateToken(token: string | undefined): SessionRecord | null {
  if (!token) return null;
  const session = activeSessions.get(token);
  if (!session) return null;
  if (session.expiresAt < Date.now()) {
    activeSessions.delete(token);
    saveSessions();
    return null;
  }
  return session;
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

async function startServer() {
  const app = express();

  // Express middleware for JSON parsing with 15mb limit for uploads/logos
  app.use(express.json({ limit: '15mb' }));
  app.use(express.urlencoded({ extended: true, limit: '15mb' }));

  // Static serving for user uploads
  app.use('/uploads', express.static(UPLOADS_DIR));

  // ==========================================
  // PUBLIC API ROUTES
  // ==========================================

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      version: currentSiteContent.version,
      lastUpdated: currentSiteContent.lastUpdated,
    });
  });

  // Get full site content (public)
  app.get('/api/content', (req, res) => {
    res.json({
      success: true,
      content: currentSiteContent,
    });
  });

  // ==========================================
  // ADMIN AUTHENTICATION API ROUTES
  // ==========================================

  // Login
  app.post('/api/admin/login', (req, res) => {
    const { username, password } = req.body || {};
    if (!username || !password) {
      return res.status(400).json({ success: false, error: 'Username and password are required' });
    }

    const adminConfig = getAdminConfig();
    const cleanUsername = String(username).trim();
    const providedHash = hashPassword(String(password), adminConfig.salt);

    // Also support checking against raw env variables or default credentials
    const envUser = (process.env.ADMIN_USERNAME || 'admin').toLowerCase();
    const envPass = process.env.ADMIN_PASSWORD || 'Elevate@Admin2025!';

    const matchesConfig =
      (cleanUsername.toLowerCase() === adminConfig.username.toLowerCase() || cleanUsername.toLowerCase() === 'admin') &&
      providedHash === adminConfig.passwordHash;

    const matchesEnv =
      (cleanUsername.toLowerCase() === envUser || cleanUsername.toLowerCase() === adminConfig.username.toLowerCase() || cleanUsername.toLowerCase() === 'admin') &&
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
  app.get('/api/admin/session', (req, res) => {
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
  app.post('/api/admin/logout', (req, res) => {
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
  app.post('/api/admin/change-password', authenticateAdminMiddleware, (req, res) => {
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
    fs.writeFileSync(ADMIN_CONFIG_FILE, JSON.stringify(newConfig, null, 2), 'utf-8');

    res.json({ success: true, message: 'Password updated successfully' });
  });

  // ==========================================
  // PROTECTED ADMIN CONTENT API ROUTES
  // ==========================================

  // Save / Update Content
  app.put('/api/admin/content', authenticateAdminMiddleware, (req, res) => {
    try {
      const newContent = req.body;
      if (!newContent || typeof newContent !== 'object') {
        return res.status(400).json({ success: false, error: 'Invalid content payload' });
      }

      // Increment version
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
  app.post('/api/admin/reset-content', authenticateAdminMiddleware, (req, res) => {
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
  app.post('/api/admin/upload', authenticateAdminMiddleware, (req, res) => {
    try {
      const { filename, dataUrl } = req.body;
      if (!filename || !dataUrl) {
        return res.status(400).json({ success: false, error: 'Filename and dataUrl are required' });
      }

      // Validate data URL format
      const matches = dataUrl.match(/^data:([A-Za-z-+/]+);base64,(.+)$/);
      if (!matches || matches.length !== 3) {
        return res.status(400).json({ success: false, error: 'Invalid image data format' });
      }

      const mimeType = matches[1];
      const base64Data = matches[2];
      const buffer = Buffer.from(base64Data, 'base64');

      // Max 5MB
      if (buffer.length > 5 * 1024 * 1024) {
        return res.status(400).json({ success: false, error: 'Image file size cannot exceed 5MB' });
      }

      // Sanitize extension
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
      fs.writeFileSync(filePath, buffer);

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

  // ==========================================
  // VITE MIDDLEWARE (DEV) / STATIC HOSTING (PROD)
  // ==========================================
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`ELEVATE Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Fatal server startup error:', err);
  process.exit(1);
});
