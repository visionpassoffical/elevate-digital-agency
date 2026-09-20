// api/_lib.ts
import crypto from "crypto";
import fs from "fs";
import path from "path";
var ADMIN_USERNAME = process.env.ADMIN_USERNAME || "mfalahudheenpa";
var ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "HAFIZfalah$2003";
var ADMIN_SESSION_SECRET = process.env.ADMIN_SESSION_SECRET || "elevate-digital-agency-secure-secret-2025";
function getDataDir() {
  if (process.env.VERCEL) {
    const tmp = path.join("/tmp", "elevate-data");
    if (!fs.existsSync(tmp)) {
      try {
        fs.mkdirSync(tmp, { recursive: true });
      } catch {
      }
    }
    return tmp;
  }
  const local = path.join(process.cwd(), "data");
  if (!fs.existsSync(local)) {
    try {
      fs.mkdirSync(local, { recursive: true });
    } catch {
    }
  }
  return local;
}
var DATA_DIR = getDataDir();
var CONTENT_FILE = path.join(DATA_DIR, "site-content.json");
var ADMIN_CONFIG_FILE = path.join(DATA_DIR, "admin-config.json");
var cachedSiteContent = null;
function loadSiteContent() {
  if (cachedSiteContent) {
    return cachedSiteContent;
  }
  const possiblePaths = [
    CONTENT_FILE,
    path.join(process.cwd(), "data", "site-content.json")
  ];
  for (const filePath of possiblePaths) {
    try {
      if (fs.existsSync(filePath)) {
        const raw = fs.readFileSync(filePath, "utf-8");
        cachedSiteContent = JSON.parse(raw);
        return cachedSiteContent;
      }
    } catch {
    }
  }
  cachedSiteContent = {};
  return cachedSiteContent;
}
function saveSiteContent(content) {
  cachedSiteContent = {
    ...content,
    version: (content.version || 1) + 1,
    lastUpdated: (/* @__PURE__ */ new Date()).toISOString()
  };
  try {
    const tmpPath = `${CONTENT_FILE}.tmp`;
    fs.writeFileSync(tmpPath, JSON.stringify(cachedSiteContent, null, 2), "utf-8");
    fs.renameSync(tmpPath, CONTENT_FILE);
  } catch {
  }
  return cachedSiteContent;
}
function resetSiteContent() {
  cachedSiteContent = null;
  const initial = loadSiteContent();
  try {
    fs.writeFileSync(CONTENT_FILE, JSON.stringify(initial, null, 2), "utf-8");
  } catch {
  }
  return initial;
}
function hashPassword(password, salt) {
  return crypto.createHmac("sha256", salt).update(password).digest("hex");
}
function getAdminConfig() {
  const possiblePaths = [
    ADMIN_CONFIG_FILE,
    path.join(process.cwd(), "data", "admin-config.json")
  ];
  for (const filePath of possiblePaths) {
    try {
      if (fs.existsSync(filePath)) {
        const raw = fs.readFileSync(filePath, "utf-8");
        return JSON.parse(raw);
      }
    } catch {
    }
  }
  const salt = "bac4124e3d6c47cb04746f990d286e3b";
  return {
    username: ADMIN_USERNAME,
    salt,
    passwordHash: hashPassword(ADMIN_PASSWORD, salt)
  };
}
function verifyAdminCredentials(usernameInput, passwordInput) {
  const cleanUser = String(usernameInput || "").trim().toLowerCase();
  const rawPass = String(passwordInput || "");
  if (!cleanUser || !rawPass) return false;
  const config = getAdminConfig();
  const providedHash = hashPassword(rawPass, config.salt);
  const envUser = ADMIN_USERNAME.toLowerCase();
  const envPass = ADMIN_PASSWORD;
  const matchesConfig = (cleanUser === config.username.toLowerCase() || cleanUser === "admin") && providedHash === config.passwordHash;
  const matchesEnv = (cleanUser === envUser || cleanUser === config.username.toLowerCase() || cleanUser === "admin" || cleanUser === "mfalahudheenpa") && rawPass === envPass;
  return matchesConfig || matchesEnv;
}
function createSession(username) {
  const now = Date.now();
  const expiresAt = now + 7 * 24 * 60 * 60 * 1e3;
  const payload = Buffer.from(
    JSON.stringify({
      u: username,
      exp: expiresAt,
      rnd: crypto.randomBytes(8).toString("hex")
    })
  ).toString("base64url");
  const sig = crypto.createHmac("sha256", ADMIN_SESSION_SECRET).update(payload).digest("base64url");
  const token = `${payload}.${sig}`;
  return {
    token,
    username,
    createdAt: now,
    expiresAt
  };
}
function validateToken(token) {
  if (!token || typeof token !== "string") return null;
  if (token.includes(".")) {
    const [payload, sig] = token.split(".");
    if (payload && sig) {
      const expectedSig = crypto.createHmac("sha256", ADMIN_SESSION_SECRET).update(payload).digest("base64url");
      if (sig === expectedSig) {
        try {
          const parsed = JSON.parse(Buffer.from(payload, "base64url").toString("utf-8"));
          if (parsed.exp && parsed.exp > Date.now() && parsed.u) {
            return {
              token,
              username: parsed.u,
              createdAt: Date.now(),
              expiresAt: parsed.exp
            };
          }
        } catch {
        }
      }
    }
  }
  return null;
}
function parseCookies(cookieHeader) {
  const list = {};
  if (!cookieHeader) return list;
  cookieHeader.split(";").forEach((cookie) => {
    const parts = cookie.split("=");
    const name = parts[0]?.trim();
    if (!name) return;
    const value = parts.slice(1).join("=").trim();
    list[name] = decodeURIComponent(value);
  });
  return list;
}
function getRequestToken(req) {
  const authHeader = req.headers?.authorization;
  if (authHeader && typeof authHeader === "string" && authHeader.startsWith("Bearer ")) {
    return authHeader.split(" ")[1];
  }
  const cookies = parseCookies(req.headers?.cookie);
  return cookies["elevate_admin_session"];
}
function makeSessionCookie(token, maxAgeSeconds = 7 * 24 * 60 * 60) {
  const isProd = process.env.NODE_ENV === "production" || !!process.env.VERCEL;
  const secureFlag = isProd ? "; Secure" : "";
  if (maxAgeSeconds <= 0) {
    return `elevate_admin_session=; HttpOnly; Path=/; SameSite=Lax; Max-Age=0; Expires=Thu, 01 Jan 1970 00:00:00 GMT${secureFlag}`;
  }
  return `elevate_admin_session=${token}; HttpOnly; Path=/; SameSite=Lax; Max-Age=${maxAgeSeconds}${secureFlag}`;
}
function parseBody(req) {
  if (!req.body) return {};
  if (typeof req.body === "string") {
    try {
      return JSON.parse(req.body);
    } catch {
      return {};
    }
  }
  return req.body;
}
function sendJson(res, status, data) {
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  if (typeof res.status === "function") {
    res.status(status);
  } else {
    res.statusCode = status;
  }
  if (typeof res.json === "function") {
    res.json(data);
  } else {
    res.end(JSON.stringify(data));
  }
}
export {
  ADMIN_PASSWORD,
  ADMIN_SESSION_SECRET,
  ADMIN_USERNAME,
  createSession,
  getAdminConfig,
  getRequestToken,
  hashPassword,
  loadSiteContent,
  makeSessionCookie,
  parseBody,
  parseCookies,
  resetSiteContent,
  saveSiteContent,
  sendJson,
  validateToken,
  verifyAdminCredentials
};
