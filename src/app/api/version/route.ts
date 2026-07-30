import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  // Pick the most common game version across all commodity averages
  const rows = await prisma.commodityAverage.findMany({
    where: { gameVersion: { not: null } },
    select: { gameVersion: true },
  });

  if (rows.length === 0) {
    return NextResponse.json({ gameVersion: null });
  }

  const counts: Record<string, number> = {};
  for (const r of rows) {
    const v = r.gameVersion!;
    counts[v] = (counts[v] || 0) + 1;
  }

  const best = Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0];
  return NextResponse.json({ gameVersion: best });
}
