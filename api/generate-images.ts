import { GoogleGenAI } from '@google/genai';

type GeneratedImage = {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
};

function readJson(req: any) {
  if (!req?.body) return {};
  if (typeof req.body === 'object') return req.body;
  try {
    return JSON.parse(req.body);
  } catch {
    return {};
  }
}

function getClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('Missing GEMINI_API_KEY');
  }

  return new GoogleGenAI({ apiKey });
}

function buildFallbackImages(prompt: string): GeneratedImage[] {
  const description = prompt.trim() || 'Professional ecommerce product image modification';

  return [
    {
      id: 'front-hero',
      title: 'Front Hero Angle',
      description: `Straight-on professional ecommerce hero shot. Prompt: ${description}`,
      imageUrl: '',
    },
    {
      id: 'angle-45',
      title: '45 Degree Angle',
      description: `Three-quarter perspective with premium studio lighting. Prompt: ${description}`,
      imageUrl: '',
    },
    {
      id: 'detail-closeup',
      title: 'Detail Close-Up',
      description: `Close-up angle focused on finish, texture, and product quality. Prompt: ${description}`,
      imageUrl: '',
    },
  ];
}

function extractGeneratedImage(output: any) {
  if (output?.inlineData?.data && output?.inlineData?.mimeType) {
    return `data:${output.inlineData.mimeType};base64,${output.inlineData.data}`;
  }
  if (output?.inline_data?.data && output?.inline_data?.mime_type) {
    return `data:${output.inline_data.mime_type};base64,${output.inline_data.data}`;
  }
  if (output?.type === 'image' && output?.data && output?.mime_type) {
    return `data:${output.mime_type};base64,${output.data}`;
  }
  return null;
}

async function generateVariant(
  ai: GoogleGenAI,
  base64Image: string,
  mimeType: string,
  userPrompt: string,
  variant: { id: string; title: string; description: string; direction: string }
) {
  const response = await Promise.race([
    ai.models.generateContent({
      model: 'gemini-3-pro-image-preview',
      contents: [
        {
          text: `You are a premium ecommerce product retouching expert.
Modify the uploaded product image according to the user's prompt and create one final image variant.

User prompt:
${userPrompt}

Variant to create:
${variant.direction}

Hard requirements:
- The uploaded image is the source image and must be visibly transformed, not simply returned unchanged
- Preserve the same product identity, category, silhouette, and major design details
- Apply the requested background, lighting, framing, and catalog treatment from the user's prompt when specified
- If the user asks for a pure white background, replace the original background with pure white (#FFFFFF)
- If the user asks for no shadows, reflections, props, text, logos, or watermark, remove or avoid them
- Keep the result photorealistic, commercially realistic, and suitable for ecommerce listings
- Keep the full product visible unless the variant explicitly asks for a close crop
- Return only a professional product image, no text panel or collage
- This output must look meaningfully different from the input photo while still being the same product`,
        },
        {
          inlineData: {
            mimeType,
            data: base64Image,
          },
        },
      ],
      config: {
        responseModalities: ['TEXT', 'IMAGE'],
      },
    } as any),
    new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('Gemini image request timed out')), 60000)
    ),
  ]);

  const imageUrl =
    response && Array.isArray((response as any).candidates)
      ? (response as any).candidates
          .flatMap((candidate: any) => candidate?.content?.parts || [])
          .map(extractGeneratedImage)
          .find(Boolean)
      : null;

  if (!imageUrl) {
    throw new Error(`No image returned for variant: ${variant.id}`);
  }

  return {
    id: variant.id,
    title: variant.title,
    description: variant.description,
    imageUrl,
  };
}

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const body = readJson(req);
  const prompt = String(body.prompt || '').trim();
  const imageBase64 = String(body.imageBase64 || '').trim();
  const mimeType = String(body.mimeType || 'image/png').trim();

  if (!prompt || !imageBase64) {
    res.status(400).json({ error: 'Missing prompt or imageBase64' });
    return;
  }

  const variants = [
    {
      id: 'front-hero',
      title: 'Front Hero Angle',
      description: 'Straight front-facing hero shot with clean framing for a professional product listing.',
      direction:
        'Modify the uploaded image into a straight-on front hero shot with the product centered, sharp, premium, and professionally composed for ecommerce use.',
    },
    {
      id: 'angle-45',
      title: '45 Degree Angle',
      description: 'Three-quarter product angle with premium studio lighting and polished retail presentation.',
      direction:
        'Modify the uploaded image into a 45-degree three-quarter angle style that shows depth and shape with premium studio lighting and a clean ecommerce composition.',
    },
    {
      id: 'detail-closeup',
      title: 'Detail Close-Up',
      description: 'Tight detail-focused composition highlighting finish, texture, and craftsmanship.',
      direction:
        'Modify the uploaded image into a premium close-up style that highlights texture, finish, materials, and product quality with luxurious studio lighting.',
    },
  ];

  try {
    const ai = getClient();
    const images = await Promise.all(
      variants.map((variant) => generateVariant(ai, imageBase64, mimeType, prompt, variant))
    );

    res.status(200).json({ images });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to generate images';
    res.status(message.includes('Missing GEMINI_API_KEY') ? 503 : 502).json({
      error: message,
      fallback: buildFallbackImages(prompt),
    });
  }
}
