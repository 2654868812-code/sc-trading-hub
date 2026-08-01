import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from '@/lib/auth';

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

// Stricter rate limiter for login endpoint (brute-force protection)
const loginRateMap = new Map<string, { count: number; resetAt: number }>();
const LOGIN_RATE_LIMIT = 5;      // attempts
const LOGIN_RATE_WINDOW = 60000; // 1 minute

function checkLoginRate(ip: string): boolean {
  const now = Date.now();
  const entry = loginRateMap.get(ip);
  if (!entry || now > entry.resetAt) {
    loginRateMap.set(ip, { count: 1, resetAt: now + LOGIN_RATE_WINDOW });
    return true;
  }
  if (entry.count >= LOGIN_RATE_LIMIT) return false;
  entry.count++;
  return true;
}

export async function proxy(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';

  // Strict rate limit for login endpoint
  if (request.nextUrl.pathname === '/api/reports/auth') {
    if (!checkLoginRate(ip)) {
      return NextResponse.json({ error: 'Too many login attempts, try again later' }, { status: 429 });
    }
  } else {
    // General rate limit
    if (!checkRate(ip)) {
      return NextResponse.json({ error: 'Too Many Requests' }, { status: 429 });
    }
  }

  // Protect /reports/edit — require valid signed auth token
  if (request.nextUrl.pathname === '/reports/edit') {
    const token = request.cookies.get('auth_token')?.value;
    const valid = await verifyToken(token);
    if (!valid) {
      const url = request.nextUrl.clone();
      url.pathname = '/reports/login';
      return NextResponse.redirect(url);
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
    for (const [ip, entry] of loginRateMap) { if (now > entry.resetAt) loginRateMap.delete(ip); }
  }, 300_000);
}
