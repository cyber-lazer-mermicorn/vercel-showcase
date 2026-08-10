import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Edge Middleware - runs at the edge, < 50ms
  const response = NextResponse.next();

  // Add custom headers
  response.headers.set('x-edge-region', process.env.VERCEL_REGION || 'unknown');
  response.headers.set('x-edge-time', new Date().toISOString());

  // Rate limiting at the edge
  const ip = request.ip || request.headers.get('x-forwarded-for') || 'unknown';
  const rateLimitKey = `ratelimit:${ip}`;
  
  // In production, use Vercel KV for rate limiting
  // For demo, we'll just pass through

  // Feature flags from Edge Config
  // In production, use @vercel/edge-config
  const showNewFeature = true;
  response.headers.set('x-feature-new', String(showNewFeature));

  return response;
}

export const config = {
  matcher: '/api/:path*',
};