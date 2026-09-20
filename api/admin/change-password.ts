import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import {
  getRequestToken,
  validateToken,
  getAdminConfig,
  hashPassword,
  parseBody,
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
    const token = getRequestToken(req);
    const session = validateToken(token);
    if (!session) {
      return sendJson(res, 401, {
        success: false,
        error: 'Unauthorized: Session expired or invalid',
      });
    }

    const { currentPassword, oldPassword, newPassword } = parseBody(req);
    const curPass = currentPassword || oldPassword;

    if (!curPass || !newPassword) {
      return sendJson(res, 400, {
        success: false,
        error: 'Both current and new password are required',
      });
    }

    if (String(newPassword).length < 6) {
      return sendJson(res, 400, {
        success: false,
        error: 'New password must be at least 6 characters',
      });
    }

    const adminConfig = getAdminConfig();
    const currentHash = hashPassword(String(curPass), adminConfig.salt);

    if (currentHash !== adminConfig.passwordHash) {
      return sendJson(res, 400, {
        success: false,
        error: 'Current password is incorrect',
      });
    }

    const newSalt = crypto.randomBytes(16).toString('hex');
    const newConfig = {
      username: adminConfig.username,
      salt: newSalt,
      passwordHash: hashPassword(String(newPassword), newSalt),
    };

    const configPath = path.join(process.cwd(), 'data', 'admin-config.json');
    try {
      fs.writeFileSync(configPath, JSON.stringify(newConfig, null, 2), 'utf-8');
    } catch {
      // In serverless, if root is read-only, try /tmp
      try {
        fs.writeFileSync(path.join('/tmp', 'admin-config.json'), JSON.stringify(newConfig, null, 2), 'utf-8');
      } catch {
        // ignore
      }
    }

    return sendJson(res, 200, {
      success: true,
      message: 'Password updated successfully',
    });
  } catch (err: any) {
    console.error('Change password error:', err);
    return sendJson(res, 500, {
      success: false,
      error: err?.message || 'Failed to update password',
    });
  }
}
