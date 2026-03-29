import { GoogleGenAI } from '@google/genai';

function getClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('Missing GEMINI_API_KEY');
  }

  return new GoogleGenAI({ apiKey });
}

export async function generateText(prompt: string) {
  const ai = getClient();
  const response = await Promise.race([
    ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        {
          role: 'user',
          parts: [{ text: prompt }],
        },
      ],
    }),
    new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('Gemini request timed out')), 20000)
    ),
  ]);

  return (response as any).text ?? '';
}

export async function generateJson(prompt: string) {
  const ai = getClient();
  const response = await Promise.race([
    ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        {
          role: 'user',
          parts: [{ text: prompt }],
        },
      ],
      config: {
        responseMimeType: 'application/json',
      },
    }),
    new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('Gemini request timed out')), 20000)
    ),
  ]);

  const raw = (response as any).text ?? '{}';
  return JSON.parse(raw);
}
