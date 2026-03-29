function normalizeInput(value: string) {
  return value.trim().replace(/\s+/g, ' ');
}

export function buildFallbackListing(productName: string, features: string, platform: string) {
  const featureList = features
    .split('\n')
    .map(normalizeInput)
    .filter(Boolean)
    .slice(0, 5);

  const safeName = normalizeInput(productName);
  const title = `${safeName} | Premium ${platform} Ready Product`;
  const bullets =
    featureList.length > 0
      ? featureList
      : ['High quality build', 'Marketplace ready', 'Fast moving catalog item'];

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

export function buildFallbackKeywords(productName: string, platform: string) {
  const base = normalizeInput(productName).toLowerCase() || 'product';
  const platformName = normalizeInput(platform).toLowerCase() || 'marketplace';
  const keywords = [
    `${base} ${platformName}`,
    `${base} online`,
    `${base} price`,
    `${base} buy`,
    `${base} best`,
    `${base} premium`,
    `${base} for ${platformName}`,
    `${base} sale`,
  ];

  return [
    `HIGH VOLUME: ${keywords.slice(0, 4).join(', ')}`,
    `LONG TAIL: ${keywords.slice(4).join(', ')}`,
    `COMPETITOR STYLE: ${platformName} ${base} listing, marketplace ${base}, ${base} catalog`,
  ].join('\n');
}

export function buildFallbackShipping(origin: string, destination: string, weight: number) {
  const kmFactor = Math.max(origin.length + destination.length, 10);
  const normalizedWeight = Number.isFinite(weight) && weight > 0 ? weight : 0.5;
  const estimatedCost = Math.round(45 + normalizedWeight * 32 + kmFactor * 1.2);

  return {
    estimatedCost,
    estimatedDays: normalizedWeight > 2 ? '4-6 days' : '2-4 days',
    riskLevel: normalizedWeight > 3 ? 'Medium' : 'Low',
    recommendedCarrier: normalizedWeight > 2 ? 'Blue Dart' : 'Delhivery',
    breakdown: [
      { label: 'Base Freight', cost: Math.round(estimatedCost * 0.45) },
      { label: 'Packaging', cost: Math.round(estimatedCost * 0.15) },
      { label: 'Fuel Surcharge', cost: Math.round(estimatedCost * 0.2) },
      { label: 'Handling', cost: Math.round(estimatedCost * 0.2) },
    ],
  };
}
