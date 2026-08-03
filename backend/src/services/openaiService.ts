import OpenAI from 'openai';
import dotenv from 'dotenv';
import { analyzeFounderQuery } from './aiEngine';
import { buildSystemContextString } from './searchService';

dotenv.config();

const apiKey = process.env.OPENAI_API_KEY || '';
const model = process.env.OPENAI_MODEL || 'gpt-4o-mini';

export const isOpenAIConfigured = (): boolean => {
  return Boolean(
    apiKey && 
    !apiKey.includes('your-openai-api-key') && 
    apiKey.startsWith('sk-')
  );
};

export const openaiClient: OpenAI | null = isOpenAIConfigured()
  ? new OpenAI({ apiKey })
  : null;

const BASE_SYSTEM_PROMPT = `You are FounderOS AI, an intelligent executive assistant for SaaS founders and startup leaders. 
Your goal is to provide concise, actionable insights on MRR, churn, customer success, team tasks, investor meetings, and financial health based on live database data.
Be direct, professional, and clear. Format responses nicely using Markdown formatted text when helpful.`;

export async function generateOpenAIResponse(
  userPrompt: string, 
  conversationHistory: Array<{ role: 'user' | 'assistant'; content: string }> = []
): Promise<{ text: string; suggestedAction?: any }> {
  const localFallback = await analyzeFounderQuery(userPrompt);
  const liveDbContext = await buildSystemContextString(userPrompt);

  if (!isOpenAIConfigured() || !openaiClient) {
    return {
      text: localFallback.replyText,
      suggestedAction: localFallback.suggestedAction
    };
  }

  try {
    const systemPromptWithContext = BASE_SYSTEM_PROMPT + liveDbContext;

    const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
      { role: 'system', content: systemPromptWithContext },
      ...conversationHistory.map(item => ({
        role: item.role,
        content: item.content
      })),
      { role: 'user', content: userPrompt }
    ];

    const response = await openaiClient.chat.completions.create({
      model,
      messages,
      temperature: 0.7,
      max_tokens: 800
    });

    const replyText = response.choices[0]?.message?.content || localFallback.replyText;
    return {
      text: replyText,
      suggestedAction: localFallback.suggestedAction
    };
  } catch (err: any) {
    console.warn('⚠️ OpenAI API call failed, using FounderOS local AI fallback:', err.message);
    return {
      text: localFallback.replyText,
      suggestedAction: localFallback.suggestedAction
    };
  }
}

export async function streamOpenAIResponse(
  userPrompt: string,
  conversationHistory: Array<{ role: 'user' | 'assistant'; content: string }> = [],
  onChunk: (deltaText: string) => void
): Promise<{ fullText: string; suggestedAction?: any }> {
  const localFallback = await analyzeFounderQuery(userPrompt);
  const liveDbContext = await buildSystemContextString(userPrompt);

  if (!isOpenAIConfigured() || !openaiClient) {
    // Simulated smooth streaming chunking for local AI engine
    const words = localFallback.replyText.split(' ');

    for (const word of words) {
      const chunk = word + ' ';
      onChunk(chunk);
      // Small 25ms delay between tokens for smooth streaming effect
      await new Promise(resolve => setTimeout(resolve, 25));
    }

    return {
      fullText: localFallback.replyText,
      suggestedAction: localFallback.suggestedAction
    };
  }

  try {
    const systemPromptWithContext = BASE_SYSTEM_PROMPT + liveDbContext;

    const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
      { role: 'system', content: systemPromptWithContext },
      ...conversationHistory.map(item => ({
        role: item.role,
        content: item.content
      })),
      { role: 'user', content: userPrompt }
    ];

    const stream = await openaiClient.chat.completions.create({
      model,
      messages,
      temperature: 0.7,
      max_tokens: 800,
      stream: true
    });

    let fullText = '';
    for await (const chunk of stream) {
      const delta = chunk.choices[0]?.delta?.content || '';
      if (delta) {
        fullText += delta;
        onChunk(delta);
      }
    }

    return {
      fullText: fullText || localFallback.replyText,
      suggestedAction: localFallback.suggestedAction
    };
  } catch (err: any) {
    console.warn('⚠️ OpenAI streaming failed, falling back to FounderOS local AI engine:', err.message);
    
    const words = localFallback.replyText.split(' ');
    for (const word of words) {
      const chunk = word + ' ';
      onChunk(chunk);
      await new Promise(resolve => setTimeout(resolve, 25));
    }

    return {
      fullText: localFallback.replyText,
      suggestedAction: localFallback.suggestedAction
    };
  }
}
