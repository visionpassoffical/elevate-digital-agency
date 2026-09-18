import { loadSiteContent, sendJson } from './_lib';

export default async function handler(req: any, res: any) {
  try {
    const content = loadSiteContent();
    return sendJson(res, 200, {
      success: true,
      content,
    });
  } catch (err: any) {
    return sendJson(res, 500, {
      success: false,
      error: err?.message || 'Failed to retrieve site content',
    });
  }
}
