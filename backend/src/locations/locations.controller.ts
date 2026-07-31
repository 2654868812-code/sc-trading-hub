import { Controller, Get, Param } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Public } from '../common/decorators/public.decorator';

@Controller('locations')
export class LocationsController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  @Public()
  async list() {
    const terminals = await this.prisma.terminal.findMany({
      select: { name: true, cityName: true, spaceStationName: true, starSystemName: true, planetName: true, moonName: true },
      orderBy: { name: 'asc' },
    });
    const seen = new Map<string, any>();
    for (const t of terminals) {
      const key = t.cityName || t.spaceStationName || t.name;
      if (!key || seen.has(key)) continue;
      seen.set(key, { name: key, system: t.starSystemName || '', planet: t.planetName || t.moonName });
    }
    return [...seen.values()];
  }

  @Get(':name')
  @Public()
  async detail(@Param('name') name: string) {
    const locationName = decodeURIComponent(name);
    const terminals = await this.prisma.terminal.findMany({
      where: { OR: [{ cityName: locationName }, { spaceStationName: locationName }, { name: locationName }] },
    });
    if (!terminals.length) return { error: 'location not found', status: 404 };

    const latest = await this.prisma.priceSnapshot.findFirst({ orderBy: { fetchedAt: 'desc' }, select: { fetchedAt: true } });
    if (!latest) return { location: { name: locationName, terminalCount: terminals.length }, terminals: [], commodities: [] };

    const ids = terminals.map(t => t.id);
    const snapshots = await this.prisma.priceSnapshot.findMany({
      where: { terminalId: { in: ids }, fetchedAt: latest.fetchedAt },
      include: { commodity: { select: { id: true, name: true, nameEn: true, code: true, kind: true, isIllegal: true, profitMargin: true } } },
    });

    const termMap = new Map<number, any>();
    for (const t of terminals) termMap.set(t.id, { id: t.id, name: t.name, nameEn: t.nameEn, type: t.type, hasCargoCenter: t.hasCargoCenter, hasDockingPort: t.hasDockingPort, hasFreightElevator: t.hasFreightElevator, isAutoLoad: t.isAutoLoad, buys: [], sells: [] });

    for (const s of snapshots) {
      const term = termMap.get(s.terminalId); if (!term) continue;
      const item = { id: s.commodityId, name: s.commodity.name, nameEn: s.commodity.nameEn, code: s.commodity.code, kind: s.commodity.kind, isIllegal: s.commodity.isIllegal, profitMargin: s.commodity.profitMargin, priceBuy: s.priceBuy, priceBuyAvg: null, priceBuyMax: null, priceBuyMin: null, scuBuyStock: s.scuBuyStock, priceSell: s.priceSell, priceSellAvg: null, priceSellMax: null, priceSellMin: null, scuSellStock: s.scuSellStock, updatedAt: s.fetchedAt.toISOString() };
      if (s.priceBuy && s.priceBuy > 0) term.buys.push(item);
      if (s.priceSell && s.priceSell > 0) term.sells.push(item);
    }

    return {
      location: { name: locationName, starSystemName: terminals[0].starSystemName, starSystemNameEn: terminals[0].starSystemNameEn, planetName: terminals[0].planetName, planetNameEn: terminals[0].planetNameEn, moonName: terminals[0].moonName, moonNameEn: terminals[0].moonNameEn, terminalCount: terminals.length },
      terminals: [...termMap.values()],
      gameVersion: null,
    };
  }
}
