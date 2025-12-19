import { generateText } from 'ai';
import { google, createGoogleGenerativeAI } from '@ai-sdk/google';

export const maxDuration = 60; // Allow longer timeout for AI generation

export async function POST(req: Request) {
  try {
    const { senderName, receiverName, caseDetails, tone, modelName, apiKey, additionalInstructions } = await req.json();

    // Prioritize client-provided key, then server env vars
    // Check if API key is present (Vercel SDK uses GOOGLE_GENERATIVE_AI_API_KEY by default inside the provider, but we might need to configure it manually if passed dynamically)
    
    // NOTE: The google provider helper from @ai-sdk/google utilizes process.env.GOOGLE_GENERATIVE_AI_API_KEY automatically.
    // If we want to use a dynamic key, we need to pass it to the google() factory or configure the provider instance.
    // However, @ai-sdk/google 'google' factory DOES support an options object with apiKey!
    // NO, wait, checking docs... `google('model-name', { apiKey: ... })` ?
    // Actually, createGoogleGenerativeAI({ apiKey }) returns a provider instance.
    // The default `google` import is a pre-configured instance using process.env.
    
    // Strategies:
    // 1. If key provided, create a custom provider instance.
    
    let activeKey = apiKey || process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.OPENAI_API_KEY;
    
    if (!activeKey) {
       // If the user put the Google key in OPENAI_API_KEY variable, we can try to use it manually or just warn.
       // For now, let's assume they might stick with OPENAI_API_KEY var name but put Google key value.
       // But correct way is GOOGLE_GENERATIVE_AI_API_KEY.
       
       // Let's check: if we switched to Google provider, we expect GOOGLE_GENERATIVE_AI_API_KEY.
       if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY.startsWith('AIza')) {
           process.env.GOOGLE_GENERATIVE_AI_API_KEY = process.env.OPENAI_API_KEY;
       } else if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
           // Return simulated response code...
           // Return a simulated response for testing/demo purposes
           await new Promise((resolve) => setTimeout(resolve, 1500)); // Simulate delay
           
           let mockTonePrefix = "";
           if (tone === 'aggressive') mockTonePrefix = "（語氣：強硬）";
           if (tone === 'soft') mockTonePrefix = "（語氣：溫和）";

           const mockResponse = `查台端 ${receiverName} 向本人 ${senderName} 承租位於[租屋地址]之房屋... (此為模擬回應，請設定 OPENAI_API_KEY 以啟用完整功能)

${mockTonePrefix}
惟台端自民國[年份]年[月份]月起，即未依約給付租金，迄今已積欠租金達三個月...

茲特函通知台端，請於函到七日內，將上開積欠之租金全數匯入本人指定之帳戶。

若屆期仍未履行，本人將依民法第440條規定終止租賃契約，並請求遷讓房屋及依法追討積欠款項，希勿自誤，以免訟累。`;
           return Response.json({ text: mockResponse });
       }
    }

    const systemPrompt = `# Role
You are a senior lawyer in Taiwan (中華民國律師) with 20 years of experience in civil litigation. You specialize in drafting "Legal Attest Letters" (存證信函). Your tone is professional, objective, firm, and legally precise.

# Task
Your goal is to rewrite the user's informal, colloquial input into a formal "Legal Attest Letter" body text.

# Critical Instructions
1. **Terminology Conversion**: You must convert casual language into specific Taiwanese legal terminology:
   - "You" -> "台端" (Tai-duan)
   - "Me/I" -> "本人" (Ben-ren) or "本公司" (Ben-gong-si) if representing a company.
   - "Money" -> "款項" (Kuan-xiang) or "價金" (Jia-jin).
   - "Let you know" -> "特函通知" (Te-han-tong-zhi).
   - "Or else I will sue" -> "將依法追究其法律責任" (Jiang-yi-fa-zhui-jiu-qi-fa-lu-ze-ren) or "希勿自誤" (Xi-wu-zi-wu).

2. **Structure**: The output must follow the standard logic of a Legal Attest Letter:
   - **Section 1: The Facts (查...)**: Briefly state the background and the agreement/incident based solely on user input.
   - **Section 2: The Breach (惟...)**: Describe how the recipient failed to fulfill their obligation.
   - **Section 3: The Demand (茲...)**: Explicitly state what the recipient must do (pay, move out, reply).
   - **Section 4: The Ultimatum (限...)**: Set a deadline (if the user provided one, otherwise use a placeholder like "函到七日內") and state the legal consequences of non-compliance.

3. **Placeholder Handling**: If the user's input lacks specific details (like specific dates, amounts, or contract numbers), DO NOT INVENT THEM. Use placeholders like \`[日期]\`, \`[金額]\`, or \`[契約編號]\` for the user to fill in later.

4. **Formatting**:
   - Output ONLY the body of the letter. Do not include the sender/receiver addresses in the body unless necessary for context.
   - Use Traditional Chinese (繁體中文 - 台灣).
   - No markdown formatting (like bolding) inside the final text, as this will be printed on a physical grid layout.
   - Plain text only.

# Tone Adjustment
The user has requested the following tone: "${tone}".
- If "professional": Standard legal tone.
- If "aggressive": Use stronger warning language (e.g., "絕不寬貸", "希勿自誤").
- If "soft": Use firmer but polite language, focus on resolution.
`;

// ... (inside POST)

    // Fallback logic for key detection
    if (activeKey && activeKey !== apiKey && activeKey.startsWith('AIza')) {
       // It's a server env key, safe to rely on default behavior OR explicit pass
    }

    // Configure Provider based on Model Name
    let languageModel;

    // Detect provider based on model naming convention or selection
    // We will stick to a convention: 'provider/model-name' or just 'model-name' (defaulting)
    
    // Normalize model name (remove 'models/' prefix from Gemini legacy if present)
    const cleanModelName = modelName.startsWith('models/') ? modelName.replace('models/', '') : modelName;

    if (cleanModelName.startsWith('gpt')) {
        // OpenAI
        const { createOpenAI } = require('@ai-sdk/openai');
        const openai = createOpenAI({
            apiKey: apiKey || process.env.OPENAI_API_KEY,
            compatibility: 'strict', // Strict mode for official OpenAI
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
        // DeepSeek
        const { createOpenAI } = require('@ai-sdk/openai');
        const deepseek = createOpenAI({
            baseURL: 'https://api.deepseek.com',
            apiKey: apiKey || process.env.DEEPSEEK_API_KEY,
        });
        languageModel = deepseek(cleanModelName);

    } else if (cleanModelName.startsWith('qwen')) {
        // Alibaba Cloud (Qwen) - using DashScope compatible endpoint
        const { createOpenAI } = require('@ai-sdk/openai');
        const qwen = createOpenAI({
            baseURL: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
            apiKey: apiKey || process.env.DASHSCOPE_API_KEY,
        });
        languageModel = qwen(cleanModelName);

    } else {
        // Default to Google Gemini
        // Handle 'gemini' prefix or default
        let googleModelName = cleanModelName;
        // If it accidentally came in as 'google/gemini...', strip 'google/'? 
        // For now, assume cleanModelName is 'gemini-2.5-flash'.
        
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
      system: systemPrompt,
      prompt: `Sender: ${senderName}\nReceiver: ${receiverName}\nCase Details: ${caseDetails}\n\nAdditional Instructions from User: ${additionalInstructions || "None"}`,
    });

    return Response.json({ text });

  } catch (error) {
    console.error('AI Generation Error:', error);
    return Response.json({ error: 'Failed to generate letter.' }, { status: 500 });
  }
}
