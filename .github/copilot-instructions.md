# GitHub Copilot Instructions — Vercel AI Edge Showcase

You are working on a Vercel deployment and AI SDK showcase by Cherry Shanaley.

## Always
- Use Vercel AI SDK for all streaming (`streamText`, `streamObject`, `useChat`)
- Mark Edge Runtime routes with `export const runtime = 'edge'`
- Validate env vars through `lib/env.ts` — never `process.env.X` inline
- Handle streaming errors with `onError` callback
- ISR: always document why the revalidation interval was chosen

## Never
- Import `fs`, `path`, or other Node built-ins in edge routes
- Make DB calls inside `middleware.ts`
- Leave `TODO` or empty `catch` blocks

## Pattern: AI streaming route
```typescript
import { streamText } from 'ai';
import { openai } from '@ai-sdk/openai';
export const runtime = 'edge';
export async function POST(req: Request) {
  const { messages } = await req.json();
  const result = streamText({ model: openai('gpt-4o'), messages });
  return result.toDataStreamResponse();
}
```
