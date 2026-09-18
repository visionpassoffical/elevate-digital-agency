import { sendJson } from './_lib';

export default async function handler(req: any, res: any) {
  return sendJson(res, 200, {
    status: 'ok',
    message: 'ELEVATE Digital Agency API',
    endpoints: [
      '/api/health',
      '/api/content',
      '/api/admin/login',
      '/api/admin/session',
      '/api/admin/logout',
      '/api/admin/change-password',
      '/api/admin/content',
      '/api/admin/reset-content',
    ],
  });
}
