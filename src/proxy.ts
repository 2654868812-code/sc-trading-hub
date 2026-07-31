import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from '@/lib/auth';

// In-memory rate limiter (per-IP, sliding window)
const rateMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 30;     // requests
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

  // Rate limit all requests
  if (!checkRate(ip)) {
    return new NextResponse('Too Many Requests', { status: 429 });
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
