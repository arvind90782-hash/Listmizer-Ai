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

export type ShippingEstimate = {
  estimatedCost: number;
  estimatedDays: string;
  riskLevel: string;
  recommendedCarrier: string;
  breakdown: Array<{ label: string; cost: number }>;
};

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
