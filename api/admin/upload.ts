import { getRequestToken, validateToken, parseBody, parseBodyAsync, sendJson } from '../_lib.js';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '15mb',
    },
  },
};

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
    let rawImage: string = '';
    let filename: string = 'image.png';
    let existingLogoUrl: string = '';

    if (typeof body === 'string') {
      const trimmedBody = body.trim();
      if (trimmedBody.startsWith('{')) {
        try {
          const parsed = JSON.parse(trimmedBody);
          rawImage =
            parsed.imageData ||
            parsed.dataUrl ||
            parsed.image ||
            parsed.data ||
            parsed.file ||
            parsed.logo ||
            parsed.logoUrl ||
            parsed.url ||
            parsed.base64 ||
            '';
          existingLogoUrl = parsed.existingLogoUrl || parsed.currentLogo || parsed.logoUrl || '';
          filename = parsed.filename || filename;
        } catch {
          // ignore
        }
      }
      if (!rawImage && (trimmedBody.startsWith('data:image/') || trimmedBody.startsWith('http://') || trimmedBody.startsWith('https://') || trimmedBody.startsWith('/uploads/'))) {
        rawImage = trimmedBody;
      }
    } else if (typeof body === 'object' && body !== null) {
      rawImage =
        body.imageData ||
        body.dataUrl ||
        body.image ||
        body.data ||
        body.file ||
        body.logo ||
        body.logoUrl ||
        body.url ||
        body.base64 ||
        '';
      existingLogoUrl = body.existingLogoUrl || body.currentLogo || body.logoUrl || '';
      filename = body.filename || filename;
    }

    // If no new image provided but an existing logo URL is present, preserve existing logoUrl
    if ((!rawImage || !rawImage.trim()) && existingLogoUrl && existingLogoUrl.trim()) {
      return sendJson(res, 200, {
        success: true,
        url: existingLogoUrl.trim(),
        filename: filename || 'preserved-logo.png',
        message: 'Existing logo URL preserved',
      });
    }

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
        error: 'Invalid image format. Must be an image file (PNG, JPG, WEBP, SVG) or valid image URL',
      });
    }

    // Format validation: PNG, JPG, JPEG, WEBP, SVG
    if (isDataUrl) {
      const isAllowedFormat =
        trimmed.startsWith('data:image/png') ||
        trimmed.startsWith('data:image/jpeg') ||
        trimmed.startsWith('data:image/jpg') ||
        trimmed.startsWith('data:image/webp') ||
        trimmed.startsWith('data:image/svg+xml');

      if (!isAllowedFormat) {
        return sendJson(res, 400, {
          success: false,
          error: 'Unsupported image format. Allowed formats: PNG, JPG, WEBP, SVG',
        });
      }

      // Max upload validation: 3MB (~4.2MB in Base64 encoding)
      if (trimmed.length > 4.5 * 1024 * 1024) {
        return sendJson(res, 400, {
          success: false,
          error: 'Image file size cannot exceed 3MB',
        });
      }
    }

    return sendJson(res, 200, {
      success: true,
      url: trimmed,
      filename: filename || 'uploaded-image.png',
      message: 'Image processed successfully',
    });
  } catch (err: any) {
    return sendJson(res, 500, {
      success: false,
      error: err?.message || 'Upload processing failed',
    });
  }
}
