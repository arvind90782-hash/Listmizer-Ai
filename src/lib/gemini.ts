import { buildFallbackKeywords, buildFallbackListing, buildFallbackShipping } from './aiFallbacks';

type ListingResponse = {
  text?: string;
  fallback?: string;
  error?: string;
};

type ShippingResponse = {
  estimate?: unknown;
  fallback?: unknown;
  error?: string;
};

type ImageVariant = {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
};

type ImageGenerationResponse = {
  images?: ImageVariant[];
  fallback?: ImageVariant[];
  error?: string;
};

export type ShippingEstimate = {
  estimatedCost: number;
  estimatedDays: string;
  riskLevel: string;
  recommendedCarrier: string;
  breakdown: Array<{ label: string; cost: number }>;
};

export type GeneratedMarketplaceImage = ImageVariant;

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

async function requestJson<T>(url: string, body: Record<string, unknown>, timeoutMs = 20000): Promise<T> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
      signal: controller.signal,
    });

    const data = await response.json().catch(() => null);

    if (!data) {
      throw new Error(
        JSON.stringify({
          message: 'API did not return valid JSON. Check whether the /api route is running.',
        })
      );
    }

    if (!response.ok) {
      const message =
        isObject(data) && typeof data.error === 'string'
          ? data.error
          : `Request failed with status ${response.status}`;
      const fallback = isObject(data) && 'fallback' in data ? data.fallback : null;
      throw new Error(JSON.stringify({ message, fallback }));
    }

    return data as T;
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new Error('Request timed out. Please try again.');
    }

    throw error;
  } finally {
    clearTimeout(timer);
  }
}

function extractFallback(error: unknown) {
  if (!(error instanceof Error)) return null;

  try {
    const parsed = JSON.parse(error.message) as { fallback?: unknown };
    return parsed.fallback ?? null;
  } catch {
    return null;
  }
}

function extractMessage(error: unknown, fallbackMessage: string) {
  if (error instanceof Error && error.message) {
    try {
      const parsed = JSON.parse(error.message) as { message?: string };
      if (parsed.message) return parsed.message;
    } catch {
      return error.message;
    }
  }

  return fallbackMessage;
}

function isShippingEstimate(value: unknown): value is ShippingEstimate {
  if (!isObject(value)) return false;

  return (
    typeof value.estimatedCost === 'number' &&
    typeof value.estimatedDays === 'string' &&
    typeof value.riskLevel === 'string' &&
    typeof value.recommendedCarrier === 'string' &&
    Array.isArray(value.breakdown)
  );
}

export async function generateProductContent(productName: string, features: string, platform: string) {
  try {
    const data = await requestJson<ListingResponse>('/api/generate-listing', {
      productName,
      features,
      platform,
    });

    return data.text || buildFallbackListing(productName, features, platform);
  } catch (error) {
    console.error('Listing generation failed:', error);
    const fallback = extractFallback(error);
    if (typeof fallback === 'string') return fallback;
    return buildFallbackListing(productName, features, platform);
  }
}

export async function generateKeywords(productName: string, platform: string) {
  try {
    const data = await requestJson<ListingResponse>('/api/generate-keywords', {
      productName,
      platform,
    });

    return data.text || buildFallbackKeywords(productName, platform);
  } catch (error) {
    console.error('Keyword generation failed:', error);
    const fallback = extractFallback(error);
    if (typeof fallback === 'string') return fallback;
    return buildFallbackKeywords(productName, platform);
  }
}

export async function generateShippingEstimate(origin: string, destination: string, weight: number): Promise<ShippingEstimate> {
  try {
    const data = await requestJson<ShippingResponse>('/api/generate-shipping', {
      origin,
      destination,
      weight,
    });

    if (isShippingEstimate(data.estimate)) {
      return data.estimate;
    }

    if (isShippingEstimate(data.fallback)) {
      return data.fallback;
    }

    throw new Error(extractMessage(data.error, 'Invalid shipping response'));
  } catch (error) {
    console.error('Shipping estimate failed:', error);
    const fallback = extractFallback(error);
    if (isShippingEstimate(fallback)) return fallback;
    return buildFallbackShipping(origin, destination, weight);
  }
}

function createFallbackImageSvg({
  photo,
  accent,
}: {
  photo?: string | null;
  accent: string;
}) {
  const svg = `
  <svg xmlns="http://www.w3.org/2000/svg" width="1400" height="1400" viewBox="0 0 1400 1400">
    <defs>
      <linearGradient id="bg" x1="0" x2="1" y1="0" y2="1">
        <stop offset="0%" stop-color="#ffffff" />
        <stop offset="55%" stop-color="#f8fafc" />
        <stop offset="100%" stop-color="${accent}" stop-opacity="0.2" />
      </linearGradient>
      <radialGradient id="glow" cx="50%" cy="30%" r="60%">
        <stop offset="0%" stop-color="${accent}" stop-opacity="0.28" />
        <stop offset="100%" stop-color="#ffffff" stop-opacity="0" />
      </radialGradient>
    </defs>
    <rect width="1400" height="1400" fill="url(#bg)" />
    <rect width="1400" height="1400" fill="url(#glow)" />
    <rect x="110" y="110" width="1180" height="1180" rx="56" fill="#ffffff" stroke="#e2e8f0" stroke-width="4" />
    ${photo ? `<image href="${photo}" x="165" y="165" width="1070" height="1070" preserveAspectRatio="xMidYMid meet" />` : ''}
  </svg>`;

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

function buildFallbackMarketplaceImages(prompt: string, imagePreview: string | null): GeneratedMarketplaceImage[] {
  const trimmedPrompt = prompt.trim() || 'Professional product presentation';

  return [
    {
      id: 'front-hero',
      title: 'Front Hero Angle',
      description: `Straight front-facing ecommerce hero shot. Prompt: ${trimmedPrompt}`,
      imageUrl: createFallbackImageSvg({
        photo: imagePreview,
        accent: '#2563eb',
      }),
    },
    {
      id: 'angle-45',
      title: '45 Degree Angle',
      description: `Three-quarter product angle with premium studio styling. Prompt: ${trimmedPrompt}`,
      imageUrl: createFallbackImageSvg({
        photo: imagePreview,
        accent: '#0ea5e9',
      }),
    },
    {
      id: 'detail-closeup',
      title: 'Detail Close-Up',
      description: `Close-up image focused on finish, texture, and craftsmanship. Prompt: ${trimmedPrompt}`,
      imageUrl: createFallbackImageSvg({
        photo: imagePreview,
        accent: '#7c3aed',
      }),
    },
  ];
}

export async function generateMarketplaceImages(
  prompt: string,
  imageBase64: string,
  mimeType: string,
  imagePreview: string | null
): Promise<GeneratedMarketplaceImage[]> {
  try {
    const data = await requestJson<ImageGenerationResponse>(
      '/api/generate-images',
      {
        prompt,
        imageBase64,
        mimeType,
      },
      90000
    );

    if (Array.isArray(data.images) && data.images.length > 0) {
      return data.images;
    }

    if (Array.isArray(data.fallback) && data.fallback.length > 0) {
      return data.fallback;
    }

    return buildFallbackMarketplaceImages(prompt, imagePreview);
  } catch (error) {
    console.error('Image generation failed:', error);
    const fallback = extractFallback(error);
    if (Array.isArray(fallback) && fallback.length > 0) {
      return fallback as GeneratedMarketplaceImage[];
    }
    return buildFallbackMarketplaceImages(prompt, imagePreview);
  }
}
