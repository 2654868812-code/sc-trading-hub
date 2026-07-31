import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  const latest = await prisma.priceSnapshot.findFirst({
    orderBy: { fetchedAt: 'desc' },
    select: { fetchedAt: true },
  });
  return NextResponse.json({
    latestFetchedAt: latest?.fetchedAt?.toISOString() ?? null,
  });
}
