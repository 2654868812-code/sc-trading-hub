import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// Returns distinct trading locations including ground stations.
// Priority: cityName > spaceStationName > terminal name (for outposts without city/station)
export async function GET() {
  const terminals = await prisma.terminal.findMany({
    select: {
      name: true,
      nameEn: true,
      cityName: true,
      cityNameEn: true,
      spaceStationName: true,
      spaceStationNameEn: true,
      starSystemName: true,
      planetName: true,
      moonName: true,
    },
    orderBy: { name: 'asc' },
  });

  const seen = new Map<string, { name: string; nameEn: string; system: string; planet: string | null; moon: string | null }>();
  for (const t of terminals) {
    const key = t.cityName || t.spaceStationName || t.name;
    if (!key || seen.has(key)) continue;
    seen.set(key, {
      name: key,
      nameEn: t.cityNameEn || t.spaceStationNameEn || t.nameEn,
      system: t.starSystemName || '',
      planet: t.planetName || t.moonName,
      moon: t.moonName,
    });
  }

  return NextResponse.json(Array.from(seen.values()));
}
