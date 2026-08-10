# Vercel AI Accelerator
## Built by Cherry Shanaley (Chan) | AI Solutions Engineer

A showcase of advanced Vercel features: Edge Functions, ISR, AI SDK, and real-time capabilities.

**Live:** https://vercel-showcase.lazermermicorn.com

---

## What This Demonstrates

### Edge Runtime
- Edge Functions for sub-50ms cold starts
- Edge Middleware for auth/routing
- Edge Config for feature flags

### AI SDK Integration
- Vercel AI SDK with streaming responses
- Multi-provider fallback (OpenAI → Groq)
- Structured output with zod validation

### Performance
- Incremental Static Regeneration (ISR)
- Image optimization with next/image
- Font optimization with next/font

### DX Features
- TypeScript throughout
- GitHub integration with preview deploys
- Vercel Analytics + Speed Insights

---

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Runtime:** Edge Runtime
- **AI:** Vercel AI SDK + OpenAI/Groq
- **Database:** Vercel Postgres
- **Cache:** Vercel KV (Redis)
- **Styling:** Tailwind CSS
- **Deployment:** Vercel (Edge)

---

## Getting Started

```bash
# Install dependencies
npm install

# Set up environment
cp .env.example .env.local
# Add your API keys

# Run development
npm run dev

# Deploy to Vercel
vercel --prod
```

---

## Features

### 1. AI Chat with Streaming
Real-time streaming responses with the Vercel AI SDK.

### 2. ISR Data Fetching
Static generation with automatic revalidation.

### 3. Edge Middleware
Authentication and routing at the edge.

### 4. Real-time Updates
WebSocket connections for live data.

### 5. Image Optimization
Automatic image optimization and lazy loading.

---

## Architecture

```
┌─────────────────────────────────────────────┐
│                  Vercel                      │
├─────────────────────────────────────────────┤
│  Edge Middleware (Auth, Routing)             │
├─────────────────────────────────────────────┤
│  Edge Functions (< 50ms cold start)         │
├─────────────────────────────────────────────┤
│  ISR Pages (Static + Revalidation)          │
├─────────────────────────────────────────────┤
│  AI SDK (Streaming, Multi-provider)         │
├─────────────────────────────────────────────┤
│  Vercel Postgres + KV (Cache)               │
└─────────────────────────────────────────────┘
```

---

## Why I Built This

I've deployed 9 production platforms on Vercel. This repo showcases the advanced features I use daily:

- **Edge Functions** for performance
- **AI SDK** for streaming responses
- **ISR** for dynamic content
- **Analytics** for monitoring

---

## Contact

**Cherry Shanaley (Chan)** — cyber.lazer.mermicorn@gmail.com

*AI Solutions Engineer | 9 Production Platforms | Vercel Power User*