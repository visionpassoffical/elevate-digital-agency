import { getRequestToken, validateToken, parseBody, sendJson } from '../_lib.js';

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
    const { image, base64, url } = parseBody(req);
    // If client sends a direct URL or base64 data uri
    const fileUrl = url || image || base64;
    if (!fileUrl) {
      return sendJson(res, 400, {
        success: false,
        error: 'No image data provided',
      });
    }

    return sendJson(res, 200, {
      success: true,
      url: fileUrl,
    });
  } catch (err: any) {
    return sendJson(res, 500, {
      success: false,
      error: err?.message || 'Upload processing failed',
    });
  }
}
