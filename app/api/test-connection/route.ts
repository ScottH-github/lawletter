import { generateText } from 'ai';
import { google, createGoogleGenerativeAI } from '@ai-sdk/google';

export const maxDuration = 60;

export async function POST(req: Request) {
  try {
    const { modelName, apiKey, message } = await req.json();

    let languageModel;
    const cleanModelName = modelName.startsWith('models/') ? modelName.replace('models/', '') : modelName;

    if (cleanModelName.startsWith('gpt')) {
        // OpenAI
        const { createOpenAI } = require('@ai-sdk/openai');
        const openai = createOpenAI({
            apiKey: apiKey || process.env.OPENAI_API_KEY,
            compatibility: 'strict',
        });
        languageModel = openai(cleanModelName);

    } else if (cleanModelName.startsWith('grok')) {
        // xAI (Grok)
        const { createOpenAI } = require('@ai-sdk/openai');
        const xai = createOpenAI({
            baseURL: 'https://api.x.ai/v1',
            apiKey: apiKey || process.env.XAI_API_KEY,
        });
        languageModel = xai(cleanModelName);

    } else if (cleanModelName.startsWith('deepseek')) {
        // DeepSeek - use official 'openai' SDK directly
        const OpenAI = require('openai');
        const client = new OpenAI({
            baseURL: 'https://api.deepseek.com',
            apiKey: apiKey || process.env.DEEPSEEK_API_KEY,
        });
        
        const completion = await client.chat.completions.create({
            messages: [
                { role: 'user', content: message || "Hello, this is a connection test." }
            ],
            model: cleanModelName,
        });

        return Response.json({ success: true, message: completion.choices[0].message.content, model: cleanModelName });

    } else if (cleanModelName.startsWith('qwen')) {
        // Alibaba Cloud (Qwen)
        const { createOpenAI } = require('@ai-sdk/openai');
        const qwen = createOpenAI({
            baseURL: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
            apiKey: apiKey || process.env.DASHSCOPE_API_KEY,
        });
        languageModel = qwen(cleanModelName);

    } else {
        // Default to Google Gemini
        let googleModelName = cleanModelName;
        let googleProvider = google;
        if (apiKey) {
             const customGoogle = createGoogleGenerativeAI({
                apiKey: apiKey
            });
            googleProvider = customGoogle;
        }
        languageModel = googleProvider(`models/${googleModelName}`);
    }

    const { text } = await generateText({
      model: languageModel, 
      prompt: message || "Hello, this is a connection test.",
    });

    return Response.json({ success: true, message: text, model: cleanModelName });

  } catch (error: any) {
    console.error('Connection Test Error:', error);
    return Response.json({ 
        success: false, 
        error: error.message || 'Unknown error',
        details: JSON.stringify(error, Object.getOwnPropertyNames(error))
    }, { status: 500 });
  }
}
