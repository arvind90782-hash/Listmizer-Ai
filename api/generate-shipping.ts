import { generateJson } from './_ai';
import { buildFallbackShipping } from '../src/lib/aiFallbacks';

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
  const origin = String(body.origin || '').trim();
  const destination = String(body.destination || '').trim();
  const weight = Number(body.weight);

  if (!origin || !destination) {
    res.status(400).json({ error: 'Missing origin or destination' });
    return;
  }

  const safeWeight = Number.isFinite(weight) && weight > 0 ? weight : 0.5;

  try {
    const estimate = await generateJson(`Predict shipping cost and time for a package from ${origin} to ${destination}. Weight: ${safeWeight} kg. Return JSON with estimatedCost, estimatedDays, riskLevel, recommendedCarrier, and breakdown array.`);
    res.status(200).json({ estimate });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to generate shipping estimate';
    res.status(message.includes('Missing GEMINI_API_KEY') ? 503 : 502).json({
      error: message,
      fallback: buildFallbackShipping(origin, destination, safeWeight),
    });
  }
}
