import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import type { TerminalInfo } from '@/types';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type');
  const distinctSystems = searchParams.get('distinctSystems');

  if (distinctSystems === 'true') {
    const systems = await prisma.terminal.findMany({
      where: { starSystemName: { not: null } },
      distinct: ['starSystemName'],
      select: { starSystemName: true },
      orderBy: { starSystemName: 'asc' },
    });
    return NextResponse.json(systems.map((s) => s.starSystemName));
  }

  const where: Record<string, unknown> = {};
  if (type) where.type = type;

  const terminals = await prisma.terminal.findMany({
    where,
    orderBy: { name: 'asc' },
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
  });

  const result: TerminalInfo[] = terminals.map((t) => ({
    id: t.id,
    name: t.name,
    nameZh: t.name,
    starSystemName: t.starSystemName,
    cityName: t.cityName,
    spaceStationName: t.spaceStationName,
    type: t.type,
    hasCargoCenter: t.hasCargoCenter,
    hasDockingPort: t.hasDockingPort,
    hasFreightElevator: t.hasFreightElevator,
    isAutoLoad: t.isAutoLoad,
  }));

  return NextResponse.json(result);
}
