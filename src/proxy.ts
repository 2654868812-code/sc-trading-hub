import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// In-memory rate limiter (per-IP, sliding window)
const rateMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 60;     // requests
const RATE_WINDOW = 10000; // 10 seconds

function checkRate(ip: string): boolean {
  const now = Date.now();
  const entry = rateMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW });
    return true;
  }
  if (entry.count >= RATE_LIMIT) return false;
  entry.count++;
  return true;
}

export async function proxy(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';

  // General rate limit (NestJS backend has its own ThrottlerGuard)
  if (!checkRate(ip)) {
    return NextResponse.json({ error: 'Too Many Requests' }, { status: 429 });
  }

  // Protect /reports/edit page — require valid auth_token cookie
  if (request.nextUrl.pathname === '/reports/edit') {
    const token = request.cookies.get('auth_token')?.value;
    if (!token || !/^\d+:[a-f0-9]{64}$/.test(token)) {
      return NextResponse.redirect(new URL('/reports/login', request.url));
    }
    // Check token expiry
    const expiry = parseInt(token.split(':')[0], 10);
    if (Date.now() > expiry) {
      return NextResponse.redirect(new URL('/reports/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = { matcher: ['/reports/edit', '/api/:path*'] };

// Periodic cleanup of expired rate-limit entries (every 5 minutes)
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    for (const [ip, entry] of rateMap) { if (now > entry.resetAt) rateMap.delete(ip); }
  }, 300_000);
}
