# Architecture

## Overview
Vercel AI Edge Showcase demonstrates edge-native AI streaming, ISR, and middleware patterns on Next.js 15.

## Layers

| Layer | Path | Responsibility |
|---|---|---|
| AI Routes | `app/api/ai/` | Edge Runtime streaming endpoints using Vercel AI SDK |
| Middleware | `middleware.ts` | Auth checks, redirects — no DB, no heavy computation |
| Library | `lib/` | Env validation, typed AI helpers, shared utilities |
| Tests | `__tests__/` | Unit and integration tests |

## Key patterns

### Streaming
All AI responses use `streamText` or `streamObject` from the Vercel AI SDK. Client components use `useChat` or `useCompletion` hooks. Never implement raw SSE.

### Edge vs Node split
Routes under `app/api/ai/` run on Edge Runtime. Routes touching Supabase or Stripe run on Node.js runtime. The split is explicit via `export const runtime`.

### Environment validation
`lib/env.ts` uses zod to parse all required env vars at module load time. Missing vars throw at startup, not at runtime.
