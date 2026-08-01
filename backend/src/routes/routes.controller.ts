import { Controller, Get, Query } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Public } from '../common/decorators/public.decorator';
import { getZhKind } from '../lib/commodity-zh';

const SPACE_ONLY_SHIPS = new Set([102, 104, 105, 106, 286]); // Hull A, C, D, E + Odin

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
    @Query('roundTrip') roundTrip?: string,
  ) {
    const cid = commodityId ? parseInt(commodityId) : undefined;
    const sid = shipId ? parseInt(shipId) : 0;
    const roundTripFlag = roundTrip === '1';

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

    // Filter: use priceBuy (not avg) as gate; priceBuyAvg as preferred value with fallback
    const [buySnaps, sellSnaps] = await Promise.all([
      this.prisma.priceSnapshot.findMany({
        where: { fetchedAt: latest.fetchedAt, priceBuy: { gt: 0 }, ...(cid ? { commodityId: cid } : {}), ...(buyLocationFilters.length ? { AND: buyLocationFilters } : {}) },
        include: { commodity: { select: { id: true, name: true, nameEn: true, kind: true, isIllegal: true } }, terminal: { select: { id: true, name: true, nameEn: true, starSystemName: true, starSystemNameEn: true, planetName: true, planetNameEn: true, moonName: true, moonNameEn: true, cityName: true, cityNameEn: true, spaceStationName: true, spaceStationNameEn: true, isAutoLoad: true } } },
      }),
      this.prisma.priceSnapshot.findMany({
        where: { fetchedAt: latest.fetchedAt, priceSell: { gt: 0 }, ...(cid ? { commodityId: cid } : {}), ...(sellLocationFilters.length ? { AND: sellLocationFilters } : {}) },
        include: { terminal: { select: { id: true, name: true, nameEn: true, starSystemName: true, starSystemNameEn: true, planetName: true, planetNameEn: true, moonName: true, moonNameEn: true, cityName: true, cityNameEn: true, spaceStationName: true, spaceStationNameEn: true, isAutoLoad: true } } },
      }),
    ]);

    // Fetch cargo routes + terminal stock for accurate calculations
    const commodityIds = [...new Set([...buySnaps.map(s => s.commodityId), ...sellSnaps.map(s => s.commodityId)])];
    const [cargoRoutes, termMaxRows] = await Promise.all([
      this.prisma.cargoRoute.findMany({ where: { commodityId: { in: commodityIds } }, select: { commodityId: true, originTerminalId: true, destTerminalId: true, distance: true, containerSizesOrigin: true, containerSizesDest: true } }),
      this.prisma.terminalCommodityMax.findMany({ where: { commodityId: { in: commodityIds } }, select: { commodityId: true, terminalId: true, scuBuyMax: true, scuSellMax: true, scuBuyAvg: true, scuSellAvg: true, priceBuyAvg: true, priceSellAvg: true } }),
    ]);
    const cargoMap = new Map<string, typeof cargoRoutes[number]>();
    for (const cr of cargoRoutes) cargoMap.set(`${cr.commodityId}-${cr.originTerminalId}-${cr.destTerminalId}`, cr);
    const stockMap = new Map<string, typeof termMaxRows[number]>();
    for (const t of termMaxRows) stockMap.set(`${t.commodityId}-${t.terminalId}`, t);

    const sellByCommodity: Record<number, typeof sellSnaps> = {};
    for (const s of sellSnaps) { if (!sellByCommodity[s.commodityId]) sellByCommodity[s.commodityId] = []; sellByCommodity[s.commodityId].push(s); }

    const routes: any[] = [];
    for (const buy of buySnaps) {
      const sells = sellByCommodity[buy.commodityId]; if (!sells?.length) continue;
      for (const sell of sells) {
        if (buy.terminalId === sell.terminalId) continue;
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

        // Look up terminal-level averages
        const oStock = stockMap.get(`${buy.commodityId}-${buy.terminalId}`);
        const dStock = stockMap.get(`${sell.commodityId}-${sell.terminalId}`);

        const buyPrice = oStock?.priceBuyAvg ?? buy.priceBuy ?? 0;
        const sellPrice = dStock?.priceSellAvg ?? sell.priceSell ?? 0;
        if (!buyPrice || !sellPrice || buyPrice <= 0 || sellPrice <= 0 || sellPrice <= buyPrice) continue;

        const profitPerScu = sellPrice - buyPrice;
        const roi = Math.round((profitPerScu / buyPrice) * 1000) / 10;
        const originMax = oStock?.scuBuyMax ?? 0;
        const destMax = dStock?.scuSellMax ?? 0;
        const loadScu = shipScu > 0 ? Math.min(shipScu, originMax > 0 ? originMax : 1) : 1;
        const sellScu = shipScu > 0 ? Math.min(shipScu, originMax > 0 ? originMax : 1, destMax > 0 ? destMax : 1) : 1;
        const totalInvestment = buyPrice * sellScu;

        // Cargo route info
        const cargoKey = `${buy.commodityId}-${buy.terminalId}-${sell.terminalId}`;
        const cargo = cargoMap.get(cargoKey);

        routes.push({
          commodityId: buy.commodityId, commodityName: buy.commodity.nameEn || buy.commodity.name, commodityNameZh: buy.commodity.name, commodityKind: buy.commodity.kind, commodityKindZh: getZhKind(buy.commodity.kind),
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
          sellPrice, profitPerScu, roi,
          distanceGm: cargo?.distance ?? null,
          totalProfit: profitPerScu * sellScu, totalInvestment, loadScu, sellScu, shipScu,
          originStock: Math.round(oStock?.scuBuyAvg ?? 0), destStock: Math.round(dStock?.scuSellAvg ?? 0),
          originStockMax: Math.round(oStock?.scuBuyMax ?? 0), destStockMax: Math.round(dStock?.scuSellMax ?? 0),
          originUpdatedAt: buy.uexModifiedAt ? new Date(buy.uexModifiedAt * 1000).toISOString() : buy.fetchedAt.toISOString(),
          destUpdatedAt: sell.uexModifiedAt ? new Date(sell.uexModifiedAt * 1000).toISOString() : sell.fetchedAt.toISOString(),
          isAutoLoadOrigin: buy.terminal.isAutoLoad, isAutoLoadDest: sell.terminal.isAutoLoad,
          containerSizesOrigin: cargo?.containerSizesOrigin ?? null, containerSizesDest: cargo?.containerSizesDest ?? null, isIllegal: buy.commodity.isIllegal,
        });
      }
    }

    // Round-trip: pair routes by terminal pair, return paired result
    if (roundTripFlag) {
      const revMap = new Map<string, any>();
      for (const r of routes) {
        const revKey = `${r.destTerminalId}-${r.originTerminalId}`;
        if (!revMap.has(revKey)) revMap.set(revKey, r);
      }

      const maxInv = maxInvestment ? parseFloat(maxInvestment) : 0;
      const maxDist = maxDistance ? parseFloat(maxDistance) : 0;

      const qualified = routes.filter((r) => {
        if (maxInv > 0 && r.totalInvestment > maxInv) return false;
        if (maxDist > 0 && (r.distanceGm == null || r.distanceGm > maxDist)) return false;
        return true;
      });

      const used = new Set<string>();
      const pairs: any[] = [];

      for (const r of qualified) {
        const key = `${r.originTerminalId}-${r.destTerminalId}`;
        const revKey = `${r.destTerminalId}-${r.originTerminalId}`;
        if (used.has(key) || used.has(revKey)) continue;

        const rev = revMap.get(key);
        if (rev) {
          let revOk = true;
          if (maxInv > 0 && rev.totalInvestment > maxInv) revOk = false;
          if (maxDist > 0 && (rev.distanceGm == null || rev.distanceGm > maxDist)) revOk = false;
          if (revOk) {
            used.add(key);
            used.add(revKey);
            pairs.push({
              outward: r, return_: rev,
              roundTripProfit: r.totalProfit + rev.totalProfit,
              roundTripInvestment: r.totalInvestment + rev.totalInvestment,
            });
          }
        }
      }

      const sort = sortBy || 'profit';
      pairs.sort((a, b) => {
        if (sort === 'profit') return b.roundTripProfit - a.roundTripProfit;
        if (sort === 'roi') {
          const ra = a.roundTripInvestment > 0 ? a.roundTripProfit / a.roundTripInvestment : 0;
          const rb = b.roundTripInvestment > 0 ? b.roundTripProfit / b.roundTripInvestment : 0;
          return rb - ra;
        }
        if (sort === 'distance') {
          return (a.outward.distanceGm ?? Infinity) - (b.outward.distanceGm ?? Infinity);
        }
        return b.roundTripProfit - a.roundTripProfit;
      });

      return { roundTrip: true, pairs: pairs.slice(0, 25) };
    }

    // Non-round-trip: normal route list
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
