import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export function sanitizeAIText(text = "") {
  return text
    .replace(/^#{1,6}\s*/gm, "")
    .replace(/^\s*[-*]\s*/gm, "")
    .trim();
}

export async function generateProductContent(productName: string, features: string, platform: string) {
  const model = "gemini-3-flash-preview";
  const prompt = `Generate a professional, high-converting product listing for ${platform}.
  Product Name: ${productName}
  Key Features: ${features}
  
  Please provide:
  1. Optimized Title (max 200 chars)
  2. 5 Bullet Points (highlighting benefits)
  3. Detailed Product Description
  4. 10 High-volume Keywords/Tags
  
  Format the output clearly with headings.`;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: [{ parts: [{ text: prompt }] }],
    });
    return sanitizeAIText(response.text);
  } catch (error) {
    console.error("Gemini Error:", error);
    throw new Error("Failed to generate content. Please try again.");
  }
}

export async function generateKeywords(productName: string, platform: string) {
  const model = "gemini-3-flash-preview";
  const prompt = `Find the most relevant, high-volume search keywords for ${productName} on ${platform} India.
  Provide a list of 20 keywords, categorized by:
  - High Volume
  - Long-tail
  - Competitor-based
  
  Return only the keywords in a structured format.`;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: [{ parts: [{ text: prompt }] }],
    });
    return sanitizeAIText(response.text);
  } catch (error) {
    console.error("Gemini Error:", error);
    throw new Error("Failed to fetch keywords.");
  }
}
