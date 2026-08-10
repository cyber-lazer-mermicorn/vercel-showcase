import { openai } from '@ai-sdk/openai';
import { groq } from '@ai-sdk/groq';
import { streamText } from 'ai';
import { z } from 'zod';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages, provider = 'openai' } = await req.json();

  // Multi-provider fallback with Vercel AI SDK
  const model = provider === 'groq' 
    ? groq('llama2-70b-4096')
    : openai('gpt-4-turbo-preview');

  const result = streamText({
    model,
    messages,
    system: `You are a helpful AI assistant built by Cherry Barton.
    
You demonstrate advanced Vercel features:
- Edge Runtime for fast responses
- AI SDK for streaming
- Multi-provider fallback (OpenAI → Groq)
- Structured output with zod

Be concise, helpful, and showcase the technology.`,
    tools: {
      getWeather: {
        description: 'Get the current weather for a location',
        parameters: z.object({
          location: z.string().describe('The city and state'),
        }),
        execute: async ({ location }) => {
          // Simulated weather data
          return {
            location,
            temperature: 72,
            condition: 'Sunny',
            humidity: 45,
          };
        },
      },
      searchProducts: {
        description: 'Search for products in the catalog',
        parameters: z.object({
          query: z.string().describe('Search query'),
          maxResults: z.number().optional().describe('Max results to return'),
        }),
        execute: async ({ query, maxResults = 5 }) => {
          // Simulated product search
          return {
            products: [
              { id: 1, name: 'AI Developer Toolkit', price: 99 },
              { id: 2, name: 'Vercel Mastery Course', price: 149 },
              { id: 3, name: 'Edge Functions Guide', price: 49 },
            ].slice(0, maxResults),
          };
        },
      },
    },
  });

  return result.toAIStreamResponse();
}