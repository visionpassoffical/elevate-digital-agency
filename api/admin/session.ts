import { getRequestToken, validateToken, sendJson } from '../_lib.js';

export default async function handler(req: any, res: any) {
  if (req.method === 'OPTIONS') {
    return sendJson(res, 200, { ok: true });
  }

  if (req.method !== 'GET') {
    return sendJson(res, 405, { valid: false, error: 'Method Not Allowed' });
  }

  try {
    const token = getRequestToken(req);
    if (!token) {
      return sendJson(res, 401, {
        valid: false,
        error: 'No token or session provided',
      });
    }

    const session = validateToken(token);
    if (!session) {
      return sendJson(res, 401, {
        valid: false,
        error: 'Session expired or invalid',
      });
    }

    return sendJson(res, 200, {
      valid: true,
      user: {
        username: session.username,
        role: 'admin',
      },
      expiresAt: session.expiresAt,
    });
  } catch (err: any) {
    console.error('Session verification error:', err);
    return sendJson(res, 500, {
      valid: false,
      error: err?.message || 'Failed to verify session',
    });
  }
}
