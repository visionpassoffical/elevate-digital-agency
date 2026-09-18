import { getRequestToken, validateToken, resetSiteContent, sendJson } from '../_lib';

export default async function handler(req: any, res: any) {
  if (req.method === 'OPTIONS') {
    return sendJson(res, 200, { ok: true });
  }

  if (req.method !== 'POST') {
    return sendJson(res, 405, { success: false, error: 'Method Not Allowed' });
  }

  const token = getRequestToken(req);
  const session = validateToken(token);
  if (!session) {
    return sendJson(res, 401, {
      success: false,
      error: 'Unauthorized: Session expired or invalid',
    });
  }

  try {
    const fresh = resetSiteContent();
    return sendJson(res, 200, {
      success: true,
      message: 'Content reset to defaults successfully',
      content: fresh,
    });
  } catch (err: any) {
    console.error('Reset content error:', err);
    return sendJson(res, 500, {
      success: false,
      error: err?.message || 'Failed to reset content',
    });
  }
}
