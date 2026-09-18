import { makeSessionCookie, sendJson } from '../_lib';

export default async function handler(req: any, res: any) {
  if (req.method === 'OPTIONS') {
    return sendJson(res, 200, { ok: true });
  }

  // Clear cookie with Max-Age=0
  const cookie = makeSessionCookie('', 0);
  res.setHeader('Set-Cookie', cookie);

  return sendJson(res, 200, {
    success: true,
    message: 'Logged out successfully',
  });
}
