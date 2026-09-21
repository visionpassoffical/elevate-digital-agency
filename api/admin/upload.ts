import { getRequestToken, validateToken, parseBody, parseBodyAsync, sendJson } from '../_lib.js';

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
    const body = (await parseBodyAsync(req)) || {};
    // Extract image data from unified contract and legacy fields
    const rawImage =
      body.imageData ||
      body.dataUrl ||
      body.image ||
      body.base64 ||
      body.url ||
      body.file ||
      body.logo;

    if (!rawImage || typeof rawImage !== 'string' || !rawImage.trim()) {
      return sendJson(res, 400, {
        success: false,
        error: 'No image data provided',
      });
    }

    const trimmed = rawImage.trim();

    // Validate if it is a data URL or a valid web/asset URL
    const isDataUrl = trimmed.startsWith('data:image/');
    const isWebUrl =
      trimmed.startsWith('http://') ||
      trimmed.startsWith('https://') ||
      trimmed.startsWith('/uploads/') ||
      trimmed.startsWith('/');

    if (!isDataUrl && !isWebUrl) {
      return sendJson(res, 400, {
        success: false,
        error: 'Invalid image format. Must be an image file or valid image URL',
      });
    }

    // Size check for data URLs (5MB base64 ~ 7MB payload)
    if (isDataUrl && trimmed.length > 7.5 * 1024 * 1024) {
      return sendJson(res, 400, {
        success: false,
        error: 'Image file size cannot exceed 5MB',
      });
    }

    return sendJson(res, 200, {
      success: true,
      url: trimmed,
      filename: body.filename || 'uploaded-image.png',
      message: 'Image processed successfully',
    });
  } catch (err: any) {
    return sendJson(res, 500, {
      success: false,
      error: err?.message || 'Upload processing failed',
    });
  }
}
