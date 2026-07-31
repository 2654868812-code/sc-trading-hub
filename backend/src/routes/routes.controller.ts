import { Controller, Get, Query } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Public } from '../common/decorators/public.decorator';

const SPACE_ONLY_SHIPS = new Set([102, 104, 105, 106]); // Hull A, C, D, E

@Controller('routes')
export class RoutesController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  @Public()
  async findRoutes(
    @Query('commodityId') commodityId?: string,
    @Query('shipId') shipId?: string,
    @Query('originSystem') originSystem?: string,
    @Query('destSystem') destSystem?: string,
    @Query('originLocation') originLocation?: string,
    @Query('destLocation') destLocation?: string,
    @Query('maxInvestment') maxInvestment?: string,
    @Query('maxDistance') maxDistance?: string,
    @Query('commodityType') commodityType?: string,
    @Query('autoLoadType') autoLoadType?: string,
    @Query('sortBy') sortBy?: string,
    @Query('sortOrder') sortOrder?: string,
  ) {
    const cid = commodityId ? parseInt(commodityId) : undefined;
    const sid = shipId ? parseInt(shipId) : 0;

    let shipScu = 0, spaceOnly = false;
    if (sid > 0) {
      const ship = await this.prisma.vehicle.findUnique({ where: { id: sid }, select: { id: true, scu: true } });
      if (ship) { shipScu = ship.scu; spaceOnly = SPACE_ONLY_SHIPS.has(ship.id); }
    }

    const latest = await this.prisma.priceSnapshot.findFirst({ orderBy: { fetchedAt: 'desc' }, select: { fetchedAt: true } });
    if (!latest) return [];

    // Build terminal filter for location matching
    const buildLocationFilter = (loc: string | undefined, spaceOnlyFlag: boolean) => {
      const filters: any[] = [];
      if (loc) filters.push({ terminal: { OR: [{ cityName: loc }, { spaceStationName: loc }] } });
      if (!loc && spaceOnlyFlag) filters.push({ terminal: { spaceStationName: { not: null } } });
      return filters;
    };

    const buyLocationFilters = buildLocationFilter(originLocation, spaceOnly);
    const sellLocationFilters = buildLocationFilter(destLocation, spaceOnly);

    const [buySnaps, sellSnaps] = await Promise.all([
      this.prisma.priceSnapshot.findMany({
        where: { fetchedAt: latest.fetchedAt, priceBuyAvg: { gt: 0 }, ...(cid ? { commodityId: cid } : {}), ...(buyLocationFilters.length ? { AND: buyLocationFilters } : {}) },
        include: { commodity: { select: { id: true, name: true, kind: true, isIllegal: true } }, terminal: { select: { id: true, name: true, nameEn: true, starSystemName: true, starSystemNameEn: true, planetName: true, planetNameEn: true, moonName: true, moonNameEn: true, cityName: true, cityNameEn: true, spaceStationName: true, spaceStationNameEn: true, isAutoLoad: true } } },
      }),
      this.prisma.priceSnapshot.findMany({
        where: { fetchedAt: latest.fetchedAt, priceSellAvg: { gt: 0 }, ...(cid ? { commodityId: cid } : {}), ...(sellLocationFilters.length ? { AND: sellLocationFilters } : {}) },
        include: { terminal: { select: { id: true, name: true, nameEn: true, starSystemName: true, starSystemNameEn: true, planetName: true, planetNameEn: true, moonName: true, moonNameEn: true, cityName: true, cityNameEn: true, spaceStationName: true, spaceStationNameEn: true, isAutoLoad: true } } },
      }),
    ]);

    const sellByCommodity: Record<number, typeof sellSnaps> = {};
    for (const s of sellSnaps) { if (!sellByCommodity[s.commodityId]) sellByCommodity[s.commodityId] = []; sellByCommodity[s.commodityId].push(s); }

    const routes: any[] = [];
    for (const buy of buySnaps) {
      const sells = sellByCommodity[buy.commodityId]; if (!sells?.length) continue;
      for (const sell of sells) {
        if (buy.terminalId === sell.terminalId) continue;
        const buyPrice = buy.priceBuyAvg!, sellPrice = sell.priceSellAvg!;
        if (!buyPrice || !sellPrice || sellPrice <= buyPrice) continue;
        if (originSystem && buy.terminal.starSystemName !== originSystem) continue;
        if (destSystem && sell.terminal.starSystemName !== destSystem) continue;
        if (autoLoadType) {
          const oa = buy.terminal.isAutoLoad, da = sell.terminal.isAutoLoad;
          if (autoLoadType === 'full' && !(oa && da)) continue;
          if (autoLoadType === 'half' && !((oa && !da) || (!oa && da))) continue;
          if (autoLoadType === 'manual' && (oa || da)) continue;
        }
        if (commodityType) {
          const oSt = !!buy.terminal.spaceStationName, dSt = !!sell.terminal.spaceStationName;
          if (commodityType === 'major' && !(oSt && dSt)) continue;
          if (commodityType === 'minor' && (oSt && dSt)) continue;
        }

        const profitPerScu = sellPrice - buyPrice;
        const roi = Math.round((profitPerScu / buyPrice) * 1000) / 10;
        routes.push({
          commodityId: buy.commodityId, commodityName: buy.commodity.name, commodityNameZh: buy.commodity.name, commodityKind: buy.commodity.kind, commodityKindZh: '',
          originTerminalId: buy.terminalId, originTerminalName: buy.terminal.name, originTerminalNameZh: buy.terminal.name, originTerminalNameEn: buy.terminal.nameEn,
          originLocation: buy.terminal.cityName || buy.terminal.spaceStationName || buy.terminal.name,
          originLocationZh: buy.terminal.cityName || buy.terminal.spaceStationName || buy.terminal.name,
          originLocationEn: buy.terminal.cityNameEn || buy.terminal.spaceStationNameEn || buy.terminal.nameEn,
          originSystemName: buy.terminal.starSystemName || '', originSystemNameEn: buy.terminal.starSystemNameEn || '',
          originPlanetName: buy.terminal.planetName || '', originPlanetNameEn: buy.terminal.planetNameEn || '',
          originMoonName: buy.terminal.moonName || '', originMoonNameEn: buy.terminal.moonNameEn || '',
          buyPrice,
          destTerminalId: sell.terminalId, destTerminalName: sell.terminal.name, destTerminalNameZh: sell.terminal.name, destTerminalNameEn: sell.terminal.nameEn,
          destLocation: sell.terminal.cityName || sell.terminal.spaceStationName || sell.terminal.name,
          destLocationZh: sell.terminal.cityName || sell.terminal.spaceStationName || sell.terminal.name,
          destLocationEn: sell.terminal.cityNameEn || sell.terminal.spaceStationNameEn || sell.terminal.nameEn,
          destSystemName: sell.terminal.starSystemName || '', destSystemNameEn: sell.terminal.starSystemNameEn || '',
          destPlanetName: sell.terminal.planetName || '', destPlanetNameEn: sell.terminal.planetNameEn || '',
          destMoonName: sell.terminal.moonName || '', destMoonNameEn: sell.terminal.moonNameEn || '',
          sellPrice, profitPerScu, roi, distanceGm: null,
          totalProfit: profitPerScu, totalInvestment: buyPrice, loadScu: 1, sellScu: 1, shipScu,
          originStock: buy.scuBuyStock || 0, destStock: sell.scuSellStock || 0, originStockMax: 0, destStockMax: 0,
          originUpdatedAt: buy.uexModifiedAt ? new Date(buy.uexModifiedAt * 1000).toISOString() : buy.fetchedAt.toISOString(),
          destUpdatedAt: sell.uexModifiedAt ? new Date(sell.uexModifiedAt * 1000).toISOString() : sell.fetchedAt.toISOString(),
          isAutoLoadOrigin: buy.terminal.isAutoLoad, isAutoLoadDest: sell.terminal.isAutoLoad,
          containerSizesOrigin: null, containerSizesDest: null, isIllegal: buy.commodity.isIllegal,
        });
      }
    }

    // Filter by investment/distance
    let filtered = routes;
    const maxInv = maxInvestment ? parseFloat(maxInvestment) : 0;
    const maxDist = maxDistance ? parseFloat(maxDistance) : 0;
    if (maxInv > 0) filtered = filtered.filter(r => r.totalInvestment <= maxInv);
    if (maxDist > 0) filtered = filtered.filter(r => r.distanceGm != null && r.distanceGm <= maxDist);

    const sort = sortBy || 'profit';
    const order = sortOrder === 'asc' ? 1 : -1;
    filtered.sort((a, b) => {
      if (sort === 'profit') return (a.totalProfit - b.totalProfit) * order;
      if (sort === 'roi') return (a.roi - b.roi) * order;
      return ((a.distanceGm ?? 0) - (b.distanceGm ?? 0)) * order;
    });

    return filtered.slice(0, 50);
  }
}
