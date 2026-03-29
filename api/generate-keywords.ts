import { generateText } from './_ai';
import { buildFallbackKeywords } from '../src/lib/aiFallbacks';

function readJson(req: any) {
  if (!req?.body) return {};
  if (typeof req.body === 'object') return req.body;
  try {
    return JSON.parse(req.body);
  } catch {
    return {};
  }
}

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const body = readJson(req);
  const productName = String(body.productName || '').trim();
  const platform = String(body.platform || 'Amazon').trim();

  if (!productName) {
    res.status(400).json({ error: 'Missing productName' });
    return;
  }

  try {
    const text = await generateText(`Find relevant marketplace keywords for ${productName} on ${platform} India. Return grouped keywords for high volume, long-tail, and competitor-style queries.`);
    res.status(200).json({ text: text || buildFallbackKeywords(productName, platform) });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to generate keywords';
    res.status(message.includes('Missing GEMINI_API_KEY') ? 503 : 502).json({
      error: message,
      fallback: buildFallbackKeywords(productName, platform),
    });
  }
}
