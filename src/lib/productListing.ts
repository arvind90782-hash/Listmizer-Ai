import { GoogleGenAI } from "@google/genai";
import { sanitizeAIText } from "./gemini";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export interface ProductListingInputs {
  title: string;
  brand: string;
  category: string;
  description: string;
  imageNotes: string;
  additionalContext: string;
}

export async function generateProductListingFromImage(inputs: ProductListingInputs) {
  const prompt = `
You are a professional e-commerce catalog generation AI.
Your task is to generate a complete Amazon / Flipkart / Meesho ready product listing using the image context and seller description.

Rules:
- Analyze the uploaded image to infer product type, category, color, material, and usage.
- Build realistic identifiers: SKU, Product ID, Item Code.
- Make titles SEO optimized for Indian marketplaces; keep them catchy yet keyword-forward.
- Write key features and benefits as bullet lists.
- If a field cannot be inferred, produce a plausible default and explain it in the JSON.
- Return the entire response strictly as JSON, with the sections below.

Use this seller input:
Title: ${inputs.title || "Untitled product"}
Brand: ${inputs.brand || "Independent Brand"}
Category hint: ${inputs.category || "General"}
Seller description: ${inputs.description || "High-quality product for everyday use."}
Additional context: ${inputs.additionalContext || "Image shows the product on a clean background."}
Image context: ${inputs.imageNotes || "Multiple angles, white background."}

Structure:
{
  "basicInformation": {
    "productTitle": "...",
    "brandName": "...",
    "category": "...",
    "subCategory": "...",
    "productType": "...",
    "modelName": "...",
    "productId": "...",
    "sku": "...",
    "itemCode": "...",
    "hsnCode": "...",
    "countryOfOrigin": "..."
  },
  "productAttributes": {
    "color": "...",
    "material": "...",
    "pattern": "...",
    "style": "...",
    "fitType": "...",
    "packSize": "...",
    "quantity": "...",
    "targetAudience": "..."
  },
  "variants": {
    "sizes": ["..."],
    "colors": ["..."],
    "packOptions": ["..."]
  },
  "description": {
    "shortDescription": "...",
    "longDescription": "..."
  },
  "keyFeatures": [
    "...",
    "..."
  ],
  "seo": {
    "searchKeywords": ["..."],
    "tags": ["..."],
    "seoTitle": "...",
    "seoDescription": "..."
  },
  "pricingSuggestion": {
    "estimatedMrp": "...",
    "suggestedSellingPrice": "...",
    "discountPercent": "..."
  },
  "inventory": {
    "stockQuantity": "..."
  },
  "packageDetails": {
    "weight": "...",
    "length": "...",
    "width": "...",
    "height": "..."
  },
  "shipping": {
    "dispatchTime": "...",
    "returnWindow": "..."
  },
  "media": {
    "imageTypeSuggestions": ["..."]
  }
}
`;

  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: [{ parts: [{ text: prompt }] }],
  });

  return sanitizeAIText(response.text);
}
