import {
  getRequestToken,
  validateToken,
  parseBody,
  saveSiteContent,
  loadSiteContent,
  sendJson,
} from '../_lib.js';

export default async function handler(req: any, res: any) {
  if (req.method === 'OPTIONS') {
    return sendJson(res, 200, { ok: true });
  }

  // Session authentication check
  const token = getRequestToken(req);
  const session = validateToken(token);
  if (!session) {
    return sendJson(res, 401, {
      success: false,
      error: 'Unauthorized: Session expired or invalid',
    });
  }

  if (req.method === 'GET') {
    try {
      const content = loadSiteContent();
      return sendJson(res, 200, { success: true, content });
    } catch (err: any) {
      return sendJson(res, 500, { success: false, error: err?.message || 'Failed to load content' });
    }
  }

  if (req.method === 'PUT' || req.method === 'POST') {
    try {
      const newContent = parseBody(req);
      if (!newContent || typeof newContent !== 'object') {
        return sendJson(res, 400, {
          success: false,
          error: 'Invalid content data payload',
        });
      }

      const updated = saveSiteContent(newContent);
      return sendJson(res, 200, {
        success: true,
        message: 'Content updated successfully',
        content: updated,
      });
    } catch (err: any) {
      console.error('Content update error:', err);
      return sendJson(res, 500, {
        success: false,
        error: err?.message || 'Failed to save content',
      });
    }
  }

  return sendJson(res, 405, { success: false, error: 'Method Not Allowed' });
}
