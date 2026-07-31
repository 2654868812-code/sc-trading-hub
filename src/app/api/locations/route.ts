import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// Returns distinct trading locations including ground stations.
// Priority: cityName > spaceStationName > terminal name (for outposts without city/station)
export async function GET() {
  const terminals = await prisma.terminal.findMany({
    select: {
      name: true,
      cityName: true,
      spaceStationName: true,
      starSystemName: true,
      planetName: true,
      moonName: true,
    },
    orderBy: { name: 'asc' },
  });

  const seen = new Map<string, { name: string; system: string; planet: string | null; moon: string | null }>();
  for (const t of terminals) {
    const key = t.cityName || t.spaceStationName || t.name;
    if (!key || seen.has(key)) continue;
    seen.set(key, {
      name: key,
      system: t.starSystemName || '',
      planet: t.planetName || t.moonName,
      moon: t.moonName,
    });
  }

  return NextResponse.json(Array.from(seen.values()));
}
