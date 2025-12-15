import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { apiKey } = await req.json();
    
    // Use client key -> server env Google -> server env OpenAI (fallback)
    const finalKey = apiKey || process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.OPENAI_API_KEY;

    if (!finalKey) {
        return NextResponse.json({ error: 'No API Key found' }, { status: 500 });
    }

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${finalKey}`);
    const data = await response.json();

    if (data.error) {
      return NextResponse.json(data, { status: 400 });
    }

    // Filter for generateContent supported models
    const models = (data.models || [])
      .filter((m: any) => m.supportedGenerationMethods?.includes('generateContent'))
      .map((m: any) => m.name.replace('models/', ''));

    return NextResponse.json({ 
        count: models.length,
        models: models 
    });

  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch models', details: String(error) }, { status: 500 });
  }
}
