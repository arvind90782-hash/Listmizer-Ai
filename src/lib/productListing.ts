export interface ProductListingInputs {
  title: string;
  brand: string;
  category: string;
  description: string;
  imageNotes: string;
  additionalContext: string;
}

function normalize(value: string) {
  return value.trim().replace(/\s+/g, ' ');
}

function slug(value: string) {
  return normalize(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export async function generateProductListingFromImage(inputs: ProductListingInputs) {
  const title = normalize(inputs.title) || 'Untitled product';
  const brand = normalize(inputs.brand) || 'Independent Brand';
  const category = normalize(inputs.category) || 'General';
  const description = normalize(inputs.description) || 'High-quality product for everyday use.';
  const additionalContext = normalize(inputs.additionalContext) || 'Image shows the product on a clean background.';
  const imageNotes = normalize(inputs.imageNotes) || 'Multiple angles, white background.';

  const productId = `PRD-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
  const sku = `SKU-${slug(title).slice(0, 10).toUpperCase() || 'ITEM'}`;

  const structured = {
    basicInformation: {
      productTitle: title,
      brandName: brand,
      category,
      subCategory: category,
      productType: category,
      modelName: title,
      productId,
      sku,
      itemCode: sku,
      hsnCode: '000000',
      countryOfOrigin: 'India',
    },
    productAttributes: {
      color: 'Not specified',
      material: 'Not specified',
      pattern: 'Solid',
      style: 'Marketplace ready',
      fitType: 'Universal',
      packSize: '1',
      quantity: '1',
      targetAudience: 'General audience',
    },
    variants: {
      sizes: ['One size'],
      colors: ['Default'],
      packOptions: ['Single pack'],
    },
    description: {
      shortDescription: description,
      longDescription: `${description} Additional context: ${additionalContext}. Visual notes: ${imageNotes}.`,
    },
    keyFeatures: [
      'Marketplace-ready presentation',
      'Consistent catalog structure',
      'Optimized for conversion and clarity',
    ],
    seo: {
      searchKeywords: [title, brand, category, 'online', 'buy now'],
      tags: [slug(title), slug(brand), slug(category)],
      seoTitle: `${title} | ${brand}`,
      seoDescription: description,
    },
    pricingSuggestion: {
      estimatedMrp: '₹999',
      suggestedSellingPrice: '₹799',
      discountPercent: '20%',
    },
    inventory: {
      stockQuantity: '100',
    },
    packageDetails: {
      weight: '0.5 kg',
      length: '10 cm',
      width: '10 cm',
      height: '10 cm',
    },
    shipping: {
      dispatchTime: '1-2 business days',
      returnWindow: '7 days',
    },
    media: {
      imageTypeSuggestions: ['Front view', 'Lifestyle shot', 'Detail close-up'],
    },
  };

  return JSON.stringify(structured, null, 2);
}
