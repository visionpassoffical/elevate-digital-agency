import { loadSiteContent, sendJson } from './_lib';

export default async function handler(req: any, res: any) {
  try {
    const content = loadSiteContent();
    return sendJson(res, 200, {
      status: 'ok',
      version: content.version || 1,
      lastUpdated: content.lastUpdated,
    });
  } catch (err: any) {
    return sendJson(res, 500, {
      status: 'error',
      error: err?.message || 'Failed to check health',
    });
  }
}
