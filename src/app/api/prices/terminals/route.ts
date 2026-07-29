import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const commodityId = parseInt(searchParams.get('commodityId') || '0', 10);

  if (!commodityId) {
    return NextResponse.json({ error: 'commodityId required' }, { status: 400 });
  }

  const latest = await prisma.priceSnapshot.findFirst({
    orderBy: { fetchedAt: 'desc' },
    select: { fetchedAt: true },
  });

  if (!latest) return NextResponse.json([]);

  const snapshots = await prisma.priceSnapshot.findMany({
    where: {
      commodityId,
      fetchedAt: latest.fetchedAt,
    },
    include: {
      terminal: {
        select: {
          id: true,
          name: true,
          starSystemName: true,
          cityName: true,
          spaceStationName: true,
          type: true,
          hasCargoCenter: true,
          hasDockingPort: true,
          hasFreightElevator: true,
          isAutoLoad: true,
        },
      },
    },
  });

  const terminals = snapshots.map((s) => ({
    id: s.terminal.id,
    name: s.terminal.name,
    starSystemName: s.terminal.starSystemName,
    cityName: s.terminal.cityName,
    spaceStationName: s.terminal.spaceStationName,
    type: s.terminal.type,
    hasCargoCenter: s.terminal.hasCargoCenter,
    hasDockingPort: s.terminal.hasDockingPort,
    hasFreightElevator: s.terminal.hasFreightElevator,
    isAutoLoad: s.terminal.isAutoLoad,
  }));

  const seen = new Set<number>();
  const unique = terminals.filter((t) => {
    if (seen.has(t.id)) return false;
    seen.add(t.id);
    return true;
  });

  return NextResponse.json(unique);
}
