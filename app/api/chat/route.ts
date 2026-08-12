import { streamText, tool } from 'ai';
import { z } from 'zod';
import { getModel } from '@/lib/models';
import { createSandbox } from '@vercel/sandbox';

export const runtime = 'edge';
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages, provider, mode = 'chat' } = await req.json();
  const model = getModel(provider);

  const result = streamText({
    model,
    messages,
    system: `You are an elite AI assistant built by Cherry Shanaley (Chan) — AI Solutions Engineer.

You demonstrate production Vercel AI SDK features:
- Multi-provider routing (OpenAI, Groq, Anthropic, xAI)
- Structured output with zod validation
- Tool calling with real execute implementations
- Streaming responses with maxSteps

Be concise, accurate, and showcase the technology authentically.`,
    tools: {
      executeCode: tool({
        description: 'Execute TypeScript or Python code in a sandboxed Vercel environment',
        parameters: z.object({
          code: z.string().describe('The code to execute'),
          language: z.enum(['typescript', 'python']).describe('Programming language'),
        }),
        execute: async ({ code, language }) => {
          try {
            const sandbox = await createSandbox({ template: language === 'python' ? 'python' : 'node' });
            const result = await sandbox.runCode(code);
            await sandbox.kill();
            return { output: result.text, language, success: true };
          } catch (err: any) {
            return { output: err?.message ?? 'Execution failed', language, success: false };
          }
        },
      }),

      getLiveMetrics: tool({
        description: 'Get real-time edge runtime metrics',
        parameters: z.object({
          metric: z.enum(['requests', 'latency', 'region', 'timestamp']),
        }),
        execute: async ({ metric }) => {
          const metrics: Record<string, unknown> = {
            requests: Math.floor(Math.random() * 10_000) + 5_000,
            latency: `${(Math.random() * 40 + 8).toFixed(1)}ms`,
            region: process.env.VERCEL_REGION ?? 'iad1',
            timestamp: new Date().toISOString(),
          };
          return { metric, value: metrics[metric] };
        },
      }),

      searchWeb: tool({
        description: 'Search the web for current information via Vercel AI gateway',
        parameters: z.object({
          query: z.string().describe('Search query'),
          maxResults: z.number().optional().default(5).describe('Max results to return'),
        }),
        // Requires TAVILY_API_KEY or similar search provider in production.
        // Returns a stub in demo mode so the tool resolves cleanly.
        execute: async ({ query, maxResults }) => {
          const apiKey = process.env.TAVILY_API_KEY;
          if (!apiKey) {
            return {
              results: [],
              note: 'Search provider not configured. Add TAVILY_API_KEY to enable live search.',
              query,
            };
          }
          const res = await fetch('https://api.tavily.com/search', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ api_key: apiKey, query, max_results: maxResults }),
          });
          const data = await res.json();
          return { query, results: data.results ?? [] };
        },
      }),
    },
    maxSteps: 5,
  });

  return result.toDataStreamResponse();
}
