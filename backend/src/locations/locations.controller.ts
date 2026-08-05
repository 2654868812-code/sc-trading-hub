import { Controller, Get, Param, Res } from '@nestjs/common';
import { Response } from 'express';
import { PrismaService } from '../prisma/prisma.service';
import { Public } from '../common/decorators/public.decorator';
import { getZhKind } from '../lib/commodity-zh';

@Controller('locations')
export class LocationsController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  @Public()
  async list() {
    const terminals = await this.prisma.terminal.findMany({
      select: { name: true, nameEn: true, cityName: true, cityNameEn: true, spaceStationName: true, spaceStationNameEn: true, starSystemName: true, planetName: true, moonName: true },
      orderBy: { name: 'asc' },
    });
    const seen = new Map<string, any>();
    for (const t of terminals) {
      const key = t.cityName || t.spaceStationName || t.name;
      if (!key || seen.has(key)) continue;
      const en = t.cityNameEn || t.spaceStationNameEn || t.nameEn;
      seen.set(key, { name: key, nameEn: en || '', system: t.starSystemName || '', planet: t.planetName || t.moonName });
    }
    return [...seen.values()];
  }

  @Get(':name')
  @Public()
  async detail(@Param('name') name: string, @Res({ passthrough: true }) res: Response) {
    let locationName: string;
    try { locationName = decodeURIComponent(name); } catch { locationName = name; }
    const terminals = await this.prisma.terminal.findMany({
      where: { OR: [{ cityName: locationName }, { spaceStationName: locationName }, { name: locationName }] },
    });
    if (!terminals.length) { res.status(404); return { error: 'location not found' }; }

    const latest = await this.prisma.priceSnapshot.findFirst({ orderBy: { fetchedAt: 'desc' }, select: { fetchedAt: true } });
    if (!latest) return { location: { name: locationName, terminalCount: terminals.length, terminalTypes: [...new Set(terminals.map(t => t.type).filter(Boolean))] }, terminals: [], commodities: [] };

    const ids = terminals.map(t => t.id);

    // 3-day price stats
    const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);
    const [snapshots, buyStats, sellStats, termMax, gameVer] = await Promise.all([
      this.prisma.priceSnapshot.findMany({
        where: { terminalId: { in: ids }, fetchedAt: latest.fetchedAt },
        include: { commodity: { select: { id: true, name: true, nameEn: true, code: true, kind: true, isIllegal: true, profitMargin: true } } },
      }),
      (this.prisma as any).priceSnapshot.groupBy({ by: ['terminalId', 'commodityId'], where: { terminalId: { in: ids }, priceBuy: { gt: 0 }, fetchedAt: { gte: threeDaysAgo } }, _avg: { priceBuy: true }, _max: { priceBuy: true }, _min: { priceBuy: true } }),
      (this.prisma as any).priceSnapshot.groupBy({ by: ['terminalId', 'commodityId'], where: { terminalId: { in: ids }, priceSell: { gt: 0 }, fetchedAt: { gte: threeDaysAgo } }, _avg: { priceSell: true }, _max: { priceSell: true }, _min: { priceSell: true } }),
      this.prisma.terminalCommodityMax.findMany({ where: { terminalId: { in: ids } }, select: { terminalId: true, commodityId: true, scuBuyMax: true, scuSellMax: true } }),
      this.prisma.commodityAverage.findFirst({ where: { gameVersion: { not: null } }, select: { gameVersion: true }, orderBy: { fetchedAt: 'desc' } }),
    ]);

    const buyStatMap = new Map<string, any>();
    for (const b of buyStats) buyStatMap.set(`${b.terminalId}-${b.commodityId}`, { avg: b._avg.priceBuy, max: b._max.priceBuy, min: b._min.priceBuy });
    const sellStatMap = new Map<string, any>();
    for (const s of sellStats) sellStatMap.set(`${s.terminalId}-${s.commodityId}`, { avg: s._avg.priceSell, max: s._max.priceSell, min: s._min.priceSell });
    const stockMaxMap = new Map<string, any>();
    for (const m of termMax) stockMaxMap.set(`${m.terminalId}-${m.commodityId}`, { scuBuyMax: m.scuBuyMax ?? 0, scuSellMax: m.scuSellMax ?? 0 });

    const termMap = new Map<number, any>();
    for (const t of terminals) termMap.set(t.id, { id: t.id, name: t.name, nameEn: t.nameEn, type: t.type, hasCargoCenter: t.hasCargoCenter, hasDockingPort: t.hasDockingPort, hasFreightElevator: t.hasFreightElevator, hasLoadingDock: t.hasLoadingDock, isAutoLoad: t.isAutoLoad, isRefinery: t.isRefinery, isMedical: t.isMedical, isFood: t.isFood, isRefuel: t.isRefuel, isRepair: t.isRepair, isHabitation: t.isHabitation, buys: [], sells: [] });

    for (const s of snapshots) {
      const term = termMap.get(s.terminalId); if (!term) continue;
      const bStat = buyStatMap.get(`${s.terminalId}-${s.commodityId}`);
      const sStat = sellStatMap.get(`${s.terminalId}-${s.commodityId}`);
      const sm = stockMaxMap.get(`${s.terminalId}-${s.commodityId}`);
      const item = {
        id: s.commodityId, name: s.commodity.name, nameEn: s.commodity.nameEn, code: s.commodity.code,
        kind: s.commodity.kind, kindZh: getZhKind(s.commodity.kind), isIllegal: s.commodity.isIllegal,
        profitMargin: s.commodity.profitMargin,
        priceBuy: s.priceBuy, priceBuyAvg: bStat?.avg ?? null, priceBuyMax: bStat?.max ?? null, priceBuyMin: bStat?.min ?? null,
        priceSell: s.priceSell, priceSellAvg: sStat?.avg ?? null, priceSellMax: sStat?.max ?? null, priceSellMin: sStat?.min ?? null,
        scuBuyStock: s.scuBuyStock, scuSellStock: s.scuSellStock,
        scuBuyMax: sm?.scuBuyMax ?? null, scuSellMax: sm?.scuSellMax ?? null,
        updatedAt: s.uexModifiedAt ? new Date(s.uexModifiedAt * 1000).toISOString() : s.fetchedAt.toISOString(),
      };
      if (s.priceBuy && s.priceBuy > 0) term.buys.push(item);
      if (s.priceSell && s.priceSell > 0) term.sells.push(item);
    }

    return {
      location: { name: locationName, starSystemName: terminals[0].starSystemName, starSystemNameEn: terminals[0].starSystemNameEn, planetName: terminals[0].planetName, planetNameEn: terminals[0].planetNameEn, moonName: terminals[0].moonName, moonNameEn: terminals[0].moonNameEn, terminalCount: terminals.length, terminalTypes: [...new Set(terminals.map(t => t.type).filter(Boolean))] },
      terminals: [...termMap.values()],
      gameVersion: gameVer?.gameVersion ?? null,
    };
  }
}
