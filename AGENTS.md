# Vercel AI Edge Showcase — Agent Doctrine

## What this repo is
Production-grade Vercel deployment showcase: Edge Runtime, AI SDK streaming, ISR, and edge middleware.
By Cherry Shanaley (Chan), AI Solutions Engineer.

## Tech stack
- **Framework:** Next.js 15 (App Router)
- **AI:** Vercel AI SDK (streaming, tool calls)
- **Deployment:** Vercel Edge Network
- **Language:** TypeScript (strict)
- **Runtime:** Edge Runtime for AI routes, Node.js for data routes

## Coding rules
- TypeScript strict — no `any`
- AI streaming routes use Vercel AI SDK `streamText` / `streamObject` — never raw SSE
- Edge Runtime routes must not import Node.js built-ins
- Middleware in `middleware.ts` — keep it fast (no DB calls)
- ISR pages use `revalidate` export — document the reason for the chosen interval
- All environment variables validated at startup via `lib/env.ts`

## Commands
```bash
npm install
npm run dev
vercel dev         # Vercel-local with edge runtime
npm run build
npm run test
```

## Do not
- Use Node.js APIs in Edge Runtime routes
- Call databases directly from middleware
- Stream without error boundary handling
- Skip environment variable validation
