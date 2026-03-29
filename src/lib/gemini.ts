import { GoogleGenAI } from '@google/genai';

const apiKey = import.meta.env.VITE_GEMINI_API_KEY as string | undefined;
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

function normalizeInput(value: string) {
  return value.trim().replace(/\s+/g, ' ');
}

function buildFallbackListing(productName: string, features: string, platform: string) {
  const featureList = features
    .split('\n')
    .map(normalizeInput)
    .filter(Boolean)
    .slice(0, 5);

  const safeName = normalizeInput(productName);
  const title = `${safeName} | Premium ${platform} Ready Product`;
  const bullets = featureList.length > 0 ? featureList : ['High quality build', 'Marketplace ready', 'Fast moving catalog item'];

  return [
    `TITLE: ${title}`,
    '',
    'BULLET POINTS:',
    ...bullets.map((item, index) => `${index + 1}. ${item}`),
    '',
    'DESCRIPTION:',
    `Built for ${platform} sellers. ${safeName} is positioned for stronger conversion, clearer product storytelling, and better catalog visibility.`,
    '',
    'KEYWORDS:',
    safeName.split(' ').filter(Boolean).join(', '),
  ].join('\n');
}

function buildFallbackKeywords(productName: string, platform: string) {
  const base = normalizeInput(productName).toLowerCase();
  const keywords = [
    `${base} ${platform.toLowerCase()}`,
    `${base} online`,
    `${base} price`,
    `${base} buy`,
    `${base} best`,
    `${base} premium`,
    `${base} for ${platform.toLowerCase()}`,
    `${base} sale`,
  ];

  return [
    `HIGH VOLUME: ${keywords.slice(0, 4).join(', ')}`,
    `LONG TAIL: ${keywords.slice(4).join(', ')}`,
    `COMPETITOR STYLE: ${platform.toLowerCase()} ${base} listing, marketplace ${base}, ${base} catalog`,
  ].join('\n');
}

function buildFallbackShipping(origin: string, destination: string, weight: number) {
  const kmFactor = Math.max(origin.length + destination.length, 10);
  const estimatedCost = Math.round(45 + weight * 32 + kmFactor * 1.2);
  return {
    estimatedCost,
    estimatedDays: weight > 2 ? '4-6 days' : '2-4 days',
    riskLevel: weight > 3 ? 'Medium' : 'Low',
    recommendedCarrier: weight > 2 ? 'Blue Dart' : 'Delhivery',
    breakdown: [
      { label: 'Base Freight', cost: Math.round(estimatedCost * 0.45) },
      { label: 'Packaging', cost: Math.round(estimatedCost * 0.15) },
      { label: 'Fuel Surcharge', cost: Math.round(estimatedCost * 0.2) },
      { label: 'Handling', cost: Math.round(estimatedCost * 0.2) },
    ],
  };
}

export async function generateProductContent(productName: string, features: string, platform: string) {
  if (!ai) {
    return buildFallbackListing(productName, features, platform);
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: `Generate a professional product listing for ${platform}.
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
comma separated keywords`,
            },
          ],
        },
      ],
    });

    return response.text || buildFallbackListing(productName, features, platform);
  } catch (error) {
    console.error('Gemini Error:', error);
    return buildFallbackListing(productName, features, platform);
  }
}

export async function generateKeywords(productName: string, platform: string) {
  if (!ai) {
    return buildFallbackKeywords(productName, platform);
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: `Find relevant marketplace keywords for ${productName} on ${platform} India. Return grouped keywords for high volume, long-tail, and competitor-style queries.`,
            },
          ],
        },
      ],
    });

    return response.text || buildFallbackKeywords(productName, platform);
  } catch (error) {
    console.error('Gemini Error:', error);
    return buildFallbackKeywords(productName, platform);
  }
}

export async function generateShippingEstimate(origin: string, destination: string, weight: number) {
  if (!ai) {
    return buildFallbackShipping(origin, destination, weight);
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: `Predict shipping cost and time for a package from ${origin} to ${destination}. Weight: ${weight} kg. Return JSON with estimatedCost, estimatedDays, riskLevel, recommendedCarrier, and breakdown array.`,
            },
          ],
        },
      ],
      config: {
        responseMimeType: 'application/json',
      },
    });

    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error('Gemini Error:', error);
    return buildFallbackShipping(origin, destination, weight);
  }
}
