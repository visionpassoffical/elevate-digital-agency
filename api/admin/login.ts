import {
  parseBody,
  verifyAdminCredentials,
  createSession,
  makeSessionCookie,
  sendJson,
} from '../_lib.js';

export default async function handler(req: any, res: any) {
  if (req.method === 'OPTIONS') {
    return sendJson(res, 200, { ok: true });
  }

  if (req.method !== 'POST') {
    return sendJson(res, 405, { success: false, error: 'Method Not Allowed' });
  }

  try {
    const { username, password } = parseBody(req);

    if (!username || !password) {
      return sendJson(res, 400, {
        success: false,
        error: 'Username and password are required',
      });
    }

    const isValid = verifyAdminCredentials(username, password);

    if (!isValid) {
      return sendJson(res, 401, {
        success: false,
        error: 'Invalid username or password',
      });
    }

    const cleanUsername = String(username).trim();
    const session = createSession(cleanUsername);

    // Set secure HTTP-only session cookie
    const cookie = makeSessionCookie(session.token);
    res.setHeader('Set-Cookie', cookie);

    return sendJson(res, 200, {
      success: true,
      token: session.token,
      expiresAt: session.expiresAt,
      user: {
        username: cleanUsername,
        role: 'admin',
      },
    });
  } catch (err: any) {
    console.error('Login error:', err);
    return sendJson(res, 500, {
      success: false,
      error: err?.message || 'Authentication processing failed',
    });
  }
}
