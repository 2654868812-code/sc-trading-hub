import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getShipZh } from '@/lib/ship-zh';

const SPACE_ONLY_IDS = new Set([102, 104, 105, 106, 286]); // Hull A, C, D, E + Odin

export async function GET() {
  const vehicles = await prisma.vehicle.findMany({
    select: { id: true, name: true, scu: true, companyName: true, padType: true },
    orderBy: { scu: 'desc' },
  });
  return NextResponse.json(
    vehicles.map((v) => ({
      id: v.id,
      name: getShipZh(v.name),
      nameEn: v.name,
      scu: v.scu,
      companyName: v.companyName,
      padType: v.padType,
      spaceOnly: SPACE_ONLY_IDS.has(v.id),
    }))
  );
}
