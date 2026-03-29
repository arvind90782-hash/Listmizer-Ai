import { generateText } from './_ai';
import { buildFallbackListing } from '../src/lib/aiFallbacks';

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
  const features = String(body.features || '').trim();
  const platform = String(body.platform || 'Amazon').trim();

  if (!productName || !features) {
    res.status(400).json({ error: 'Missing productName or features' });
    return;
  }

  try {
    const text = await generateText(`Generate a professional product listing for ${platform}.
Product Name: ${productName}
Key Features:
${features}

Return exactly this format:
TITLE:
...

BULLET POINTS:
1. ...
2. ...
3. ...
4. ...
5. ...

DESCRIPTION:
...

KEYWORDS:
comma separated keywords`);

    res.status(200).json({ text: text || buildFallbackListing(productName, features, platform) });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to generate listing';
    res.status(message.includes('Missing GEMINI_API_KEY') ? 503 : 502).json({
      error: message,
      fallback: buildFallbackListing(productName, features, platform),
    });
  }
}
