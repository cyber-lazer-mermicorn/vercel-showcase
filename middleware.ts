import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { get } from '@vercel/edge-config';

export const config = {
  matcher: '/api/:path*',
};

// Simple token-bucket rate limiter using Vercel KV.
// Falls back to pass-through when KV is not configured (local dev).
async function checkRateLimit(ip: string): Promise<boolean> {
  const kvUrl = process.env.KV_REST_API_URL;
  const kvToken = process.env.KV_REST_API_TOKEN;
  if (!kvUrl || !kvToken) return true; // pass-through in local dev

  const key = `rl:${ip}`;
  const window = 60;     // seconds
  const maxRequests = 60; // per window

  const res = await fetch(`${kvUrl}/incr/${key}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${kvToken}` },
  });
  const { result: count } = await res.json();

  if (count === 1) {
    // First request in window — set TTL
    await fetch(`${kvUrl}/expire/${key}/${window}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${kvToken}` },
    });
  }

  return count <= maxRequests;
}

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // Attach edge region and timestamp headers for observability
  response.headers.set('x-edge-region', process.env.VERCEL_REGION ?? 'local');
  response.headers.set('x-edge-time', new Date().toISOString());

  // Rate limiting
  const ip = request.ip ?? request.headers.get('x-forwarded-for') ?? 'unknown';
  const allowed = await checkRateLimit(ip);
  if (!allowed) {
    return new NextResponse(JSON.stringify({ error: 'Rate limit exceeded' }), {
      status: 429,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Feature flags via Edge Config (falls back gracefully)
  try {
    const showNewFeature = await get<boolean>('showNewFeature');
    response.headers.set('x-feature-new', String(showNewFeature ?? false));
  } catch {
    response.headers.set('x-feature-new', 'false');
  }

  return response;
}
