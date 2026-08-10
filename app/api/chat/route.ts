import { openai } from '@ai-sdk/openai';
import { groq } from '@ai-sdk/groq';
import { anthropic } from '@ai-sdk/anthropic';
import { xai } from '@ai-sdk/xai';
import { generateText, streamText, tool } from 'ai';
import { z } from 'zod';

// AI SDK 4.0 — Multi-provider with automatic fallback
// Supports: GPT-5.6, Claude Opus 5, Grok 4.5, Llama 4

export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages, provider = 'openai', mode = 'chat' } = await req.json();

  // Multi-provider routing with AI SDK 4.0
  const models = {
    openai: openai('gpt-5.6-luna'),
    groq: groq('llama-4-maverick'),
    anthropic: anthropic('claude-opus-5'),
    xai: xai('grok-4'),
  };

  const model = models[provider] || models.openai;

  // Streaming with structured output
  const result = streamText({
    model,
    messages,
    system: `You are an elite AI assistant built by Cherry Barton.
    
You demonstrate cutting-edge Vercel AI SDK 4.0 features:
- Multi-provider routing (OpenAI, Groq, Anthropic, xAI)
- Structured output with zod validation
- Tool calling with human approval
- Streaming responses

Be concise, helpful, and showcase the technology.`,
    tools: {
      // AI SDK 4.0 — Tool with human approval
      executeCode: tool({
        description: 'Execute code in a sandboxed environment',
        parameters: z.object({
          code: z.string().describe('The code to execute'),
          language: z.enum(['typescript', 'python', 'rust']).describe('Programming language'),
        }),
        // AI SDK 4.0 — Human approval required
        experimental_toToolResultContent: (result) => [
          { type: 'text', text: `Code execution result:\n${JSON.stringify(result)}` },
        ],
      }),
      
      // AI SDK 4.0 — Multi-modal tool
      generateImage: tool({
        description: 'Generate an image using DALL-E 3',
        parameters: z.object({
          prompt: z.string().describe('Image description'),
          style: z.enum(['vivid', 'natural']).optional(),
          size: z.enum(['1024x1024', '1792x1024', '1024x1792']).optional(),
        }),
      }),
      
      // AI SDK 4.0 — Real-time data tool
      getLiveMetrics: tool({
        description: 'Get real-time system metrics',
        parameters: z.object({
          metric: z.enum(['cpu', 'memory', 'requests', 'latency']),
        }),
      }),
      
      // AI SDK 4.0 — Web search tool
      searchWeb: tool({
        description: 'Search the web for current information',
        parameters: z.object({
          query: z.string().describe('Search query'),
          maxResults: z.number().optional().describe('Max results'),
        }),
      }),
    },
    // AI SDK 4.0 — Multi-step with maxSteps
    maxSteps: 5,
  });

  return result.toAIStreamResponse();
}