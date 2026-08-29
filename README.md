# Vercel Full-Stack AI Showcase

**What this proves:** Deployable full-stack AI application on Vercel — AI SDK
streaming, edge vs serverless runtime decisions, typed API routes, and
environment-based configuration. Built to deploy, not just run locally.

**Portfolio:** [cyber-lazer-mermicorn](https://github.com/cyber-lazer-mermicorn) · Cherry Shanaley

---

## Key patterns

| Pattern | What it proves |
|---|---|
| AI SDK streaming | `streamText` with `useChat` hook — chunked, not buffered |
| Edge runtime | `export const runtime = 'edge'` on latency-critical routes |
| Serverless runtime | Node.js runtime for routes needing full Node APIs |
| Typed API routes | `NextRequest` / `NextResponse` with Zod body validation |
| Env configuration | `NEXT_PUBLIC_*` vs server-only keys — no leakage |

## Run locally

```bash
npm install
cp .env.example .env.local   # add OPENAI_API_KEY
npm run dev                  # http://localhost:3000
npm test
```

## Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/cyber-lazer-mermicorn/vercel-showcase)

Add `OPENAI_API_KEY` in the Vercel environment variable settings.

## Evidence

- Streaming route returns chunks in real time — visible in browser network tab
- Edge route cold-start is measurably faster than serverless — logged in Vercel dashboard
- API routes reject malformed bodies with typed error responses

## Honest scope

Showcase-grade: deployment patterns are correct. No production auth, database,
or multi-region configuration included.
