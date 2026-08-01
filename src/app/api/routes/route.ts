import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import type { TradeRoute } from '@/types';
import { getZhKind } from '@/lib/commodity-zh';

// Ships that can ONLY dock at space stations (cannot land on ground)
const SPACE_ONLY_SHIP_IDS = new Set([102, 104, 105, 106, 286]); // Hull A, C, D, E + Odin

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
  const commodityId = searchParams.get('commodityId')
    ? parseInt(searchParams.get('commodityId')!, 10) : undefined;
  const originSystem = searchParams.get('originSystem') || undefined;
  const destSystem = searchParams.get('destSystem') || undefined;
  const originLocation = searchParams.get('originLocation') || undefined;
  const destLocation = searchParams.get('destLocation') || undefined;
  const maxInvestment = searchParams.get('maxInvestment')
    ? parseFloat(searchParams.get('maxInvestment')!) : undefined;
  const maxDistance = searchParams.get('maxDistance')
    ? parseFloat(searchParams.get('maxDistance')!) : undefined;
  const commodityType = searchParams.get('commodityType') as 'major' | 'minor' | null;
  const autoLoadType = searchParams.get('autoLoadType') as 'full' | 'half' | 'manual' | null;
  const sortBy = searchParams.get('sortBy') || 'profit';
  const sortOrder = searchParams.get('sortOrder') || 'desc';
  const roundTrip = searchParams.get('roundTrip') === '1';
  const shipId = searchParams.get('shipId')
    ? parseInt(searchParams.get('shipId')!, 10) : 0;

  let shipScu = 0;
  let spaceOnly = false;
  if (shipId > 0) {
    const ship = await prisma.vehicle.findUnique({
      where: { id: shipId },
      select: { id: true, scu: true },
    });
    if (ship) {
      shipScu = ship.scu;
      if (SPACE_ONLY_SHIP_IDS.has(ship.id)) spaceOnly = true;
    }
  }

  const latest = await prisma.priceSnapshot.findFirst({
    orderBy: { fetchedAt: 'desc' },
    select: { fetchedAt: true },
  });

  if (!latest) {
    return NextResponse.json([]);
  }

  // Fetch buy-side snapshots
  const buySnapshots = await prisma.priceSnapshot.findMany({
    where: {
      fetchedAt: latest.fetchedAt,
      priceBuy: { gt: 0 },
      ...(commodityId ? { commodityId } : {}),
      ...(originLocation ? { terminal: { OR: [{ cityName: originLocation }, { spaceStationName: originLocation }] } } : {}),
      ...(!originLocation && spaceOnly ? { terminal: { AND: [{ spaceStationName: { not: null } }, { spaceStationName: { not: '' } }] } } : {}),
    },
    include: {
      commodity: { select: { id: true, name: true, nameEn: true, kind: true, isIllegal: true } },
      terminal: { select: { id: true, name: true, nameEn: true, starSystemName: true, starSystemNameEn: true, planetName: true, planetNameEn: true, moonName: true, moonNameEn: true, cityName: true, cityNameEn: true, spaceStationName: true, spaceStationNameEn: true, isAutoLoad: true } },
    },
  });

  // Fetch sell-side snapshots
  const sellSnapshots = await prisma.priceSnapshot.findMany({
    where: {
      fetchedAt: latest.fetchedAt,
      priceSell: { gt: 0 },
      ...(commodityId ? { commodityId } : {}),
      ...(destLocation ? { terminal: { OR: [{ cityName: destLocation }, { spaceStationName: destLocation }] } } : {}),
      ...(!destLocation && spaceOnly ? { terminal: { AND: [{ spaceStationName: { not: null } }, { spaceStationName: { not: '' } }] } } : {}),
    },
    include: {
      terminal: { select: { id: true, name: true, nameEn: true, starSystemName: true, starSystemNameEn: true, planetName: true, planetNameEn: true, moonName: true, moonNameEn: true, cityName: true, cityNameEn: true, spaceStationName: true, spaceStationNameEn: true, isAutoLoad: true } },
    },
  });

  // Index sell side by commodityId
  const sellByCommodity: Record<number, typeof sellSnapshots> = {};
  for (const s of sellSnapshots) {
    if (!sellByCommodity[s.commodityId]) sellByCommodity[s.commodityId] = [];
    sellByCommodity[s.commodityId].push(s);
  }

  // Fetch commodity averages for max stock values (progress bar reference)
  const allAverages = await prisma.commodityAverage.findMany({
    select: { commodityId: true, scuBuyMax: true, scuSellMax: true, scuBuyAvg: true, scuSellAvg: true },
  });
  const avgByCommodity: Record<number, { scuBuyMax: number | null; scuSellMax: number | null; scuBuyAvg: number | null; scuSellAvg: number | null }> = {};
  for (const a of allAverages) {
    avgByCommodity[a.commodityId] = { scuBuyMax: a.scuBuyMax, scuSellMax: a.scuSellMax, scuBuyAvg: a.scuBuyAvg, scuSellAvg: a.scuSellAvg };
  }

  // Fetch per-terminal max stock for relevant commodities only
  const relevantCommodityIds = [...new Set([
    ...buySnapshots.map((s) => s.commodityId),
    ...sellSnapshots.map((s) => s.commodityId),
  ])];
  const termMaxRows = await prisma.terminalCommodityMax.findMany({
    where: { commodityId: { in: relevantCommodityIds } },
    select: { commodityId: true, terminalId: true, scuBuyMax: true, scuSellMax: true, scuBuyAvg: true, scuSellAvg: true, priceBuyAvg: true, priceSellAvg: true },
  });
  const terminalMaxStock: Record<string, { scuBuyMax: number; scuSellMax: number; scuBuyAvg: number; scuSellAvg: number; priceBuyAvg: number | null; priceSellAvg: number | null }> = {};
  for (const t of termMaxRows) {
    terminalMaxStock[`${t.commodityId}-${t.terminalId}`] = {
      scuBuyMax: t.scuBuyMax ?? 0,
      scuSellMax: t.scuSellMax ?? 0,
      scuBuyAvg: t.scuBuyAvg ?? 0,
      scuSellAvg: t.scuSellAvg ?? 0,
      priceBuyAvg: t.priceBuyAvg ?? null,
      priceSellAvg: t.priceSellAvg ?? null,
    };
  }

  // Fetch cargo routes for distance + container sizes (only for relevant commodities)
  const allCargoRoutes = await prisma.cargoRoute.findMany({
    where: { commodityId: { in: relevantCommodityIds } },
    select: {
      commodityId: true,
      originTerminalId: true,
      destTerminalId: true,
      distance: true,
      containerSizesOrigin: true,
      containerSizesDest: true,
    },
  });
  const cargoRouteMap = new Map<string, { distance: number | null; containerSizesOrigin: string | null; containerSizesDest: string | null }>();
  for (const cr of allCargoRoutes) {
    cargoRouteMap.set(`${cr.commodityId}-${cr.originTerminalId}-${cr.destTerminalId}`, {
      distance: cr.distance,
      containerSizesOrigin: cr.containerSizesOrigin,
      containerSizesDest: cr.containerSizesDest,
    });
  }

  const routes: TradeRoute[] = [];

  for (const buy of buySnapshots) {
    const sells = sellByCommodity[buy.commodityId];
    if (!sells) continue;

    for (const sell of sells) {
      if (buy.terminalId === sell.terminalId) continue;

      if (originSystem && buy.terminal.starSystemName !== originSystem) continue;
      if (destSystem && sell.terminal.starSystemName !== destSystem) continue;
      // Auto-load filter
      if (autoLoadType) {
        const origAuto = buy.terminal.isAutoLoad;
        const destAuto = sell.terminal.isAutoLoad;
        if (autoLoadType === 'full' && !(origAuto && destAuto)) continue;
        if (autoLoadType === 'half' && !((origAuto && !destAuto) || (!origAuto && destAuto))) continue;
        if (autoLoadType === 'manual' && (origAuto || destAuto)) continue;
      }

      // 大宗: both must be space stations. 小宗: at least one must NOT be a space station.
      if (commodityType) {
        const originIsStation = !!(buy.terminal.spaceStationName);
        const destIsStation = !!(sell.terminal.spaceStationName);
        if (commodityType === 'major' && !(originIsStation && destIsStation)) continue;
        if (commodityType === 'minor' && (originIsStation && destIsStation)) continue;
      }

      // Look up terminal-level averages
      const originTerm = terminalMaxStock[`${buy.commodityId}-${buy.terminalId}`];
      const destTerm = terminalMaxStock[`${sell.commodityId}-${sell.terminalId}`];

      const buyPrice = originTerm?.priceBuyAvg ?? buy.priceBuy ?? 0;
      const sellPrice = destTerm?.priceSellAvg ?? sell.priceSell ?? 0;

      if (!buyPrice || !sellPrice || buyPrice <= 0 || sellPrice <= 0) continue;
      if (sellPrice <= buyPrice) continue;

      const profitPerScu = sellPrice - buyPrice;

      // Strip prefix from terminal name for cleaner location display
      const originLocFromName = buy.terminal.name.replace(/^(管理中心|白金湾)\s*[-—]\s*/, '');
      const destLocFromName = sell.terminal.name.replace(/^(管理中心|白金湾)\s*[-—]\s*/, '');
      // English versions — strip prefix same way
      const originLocEnFromName = buy.terminal.nameEn.replace(/^(Admin|Platinum Bay)\s*[-—]\s*/, '');
      const destLocEnFromName = sell.terminal.nameEn.replace(/^(Admin|Platinum Bay)\s*[-—]\s*/, '');

      const cargoKey = `${buy.commodityId}-${buy.terminalId}-${sell.terminalId}`;
      const cargoInfo = cargoRouteMap.get(cargoKey);
      const commMax = avgByCommodity[buy.commodityId];
      const originMaxStock = originTerm?.scuBuyMax ?? commMax?.scuBuyMax ?? 0;
      const destMaxStock = destTerm?.scuSellMax ?? commMax?.scuSellMax ?? 0;
      // Load SCU = min(ship cargo, origin max buy stock)
      const loadScu = shipScu > 0 ? Math.min(shipScu, originMaxStock > 0 ? originMaxStock : 1) : 1;
      // Sell SCU = min(ship cargo, origin max buy stock, dest max sell stock)
      const sellScu = shipScu > 0
        ? Math.min(shipScu, originMaxStock > 0 ? originMaxStock : 1, destMaxStock > 0 ? destMaxStock : 1)
        : 1;

      routes.push({
        commodityId: buy.commodityId,
        commodityName: buy.commodity.nameEn || buy.commodity.name,
        commodityNameZh: buy.commodity.name,
        commodityKind: buy.commodity.kind,
        commodityKindZh: getZhKind(buy.commodity.kind),
        // Origin
        originTerminalId: buy.terminalId,
        originTerminalName: buy.terminal.name,
        originTerminalNameZh: buy.terminal.name,
        originTerminalNameEn: buy.terminal.nameEn,
        originLocation: buy.terminal.cityName || buy.terminal.spaceStationName || buy.terminal.name,
        originLocationZh: buy.terminal.cityName || buy.terminal.spaceStationName || originLocFromName,
        originLocationEn: buy.terminal.cityNameEn || buy.terminal.spaceStationNameEn || originLocEnFromName,
        originSystemName: buy.terminal.starSystemName || '',
        originSystemNameEn: buy.terminal.starSystemNameEn || '',
        originPlanetName: buy.terminal.planetName || '',
        originPlanetNameEn: buy.terminal.planetNameEn || '',
        originMoonName: buy.terminal.moonName || '',
        originMoonNameEn: buy.terminal.moonNameEn || '',
        buyPrice,
        // Dest
        destTerminalId: sell.terminalId,
        destTerminalName: sell.terminal.name,
        destTerminalNameZh: sell.terminal.name,
        destTerminalNameEn: sell.terminal.nameEn,
        destLocation: sell.terminal.cityName || sell.terminal.spaceStationName || sell.terminal.name,
        destLocationZh: sell.terminal.cityName || sell.terminal.spaceStationName || destLocFromName,
        destLocationEn: sell.terminal.cityNameEn || sell.terminal.spaceStationNameEn || destLocEnFromName,
        destSystemName: sell.terminal.starSystemName || '',
        destSystemNameEn: sell.terminal.starSystemNameEn || '',
        destPlanetName: sell.terminal.planetName || '',
        destPlanetNameEn: sell.terminal.planetNameEn || '',
        destMoonName: sell.terminal.moonName || '',
        destMoonNameEn: sell.terminal.moonNameEn || '',
        sellPrice,
        // Computed
        profitPerScu,
        roi: Math.round((profitPerScu / buyPrice) * 1000) / 10,
        distanceGm: cargoInfo?.distance ?? null,
        totalProfit: profitPerScu * sellScu,
        totalInvestment: buyPrice * sellScu,
        loadScu,
        sellScu,
        shipScu,
        originStock: Math.round(originTerm?.scuBuyAvg ?? 0),
        destStock: Math.round(destTerm?.scuSellAvg ?? 0),
        originStockMax: Math.round(originMaxStock),
        destStockMax: Math.round(destMaxStock),
        originUpdatedAt: buy.uexModifiedAt
          ? new Date(buy.uexModifiedAt * 1000).toISOString()
          : buy.fetchedAt.toISOString(),
        destUpdatedAt: sell.uexModifiedAt
          ? new Date(sell.uexModifiedAt * 1000).toISOString()
          : sell.fetchedAt.toISOString(),
        isAutoLoadOrigin: buy.terminal.isAutoLoad,
        isAutoLoadDest: sell.terminal.isAutoLoad,
        containerSizesOrigin: cargoInfo?.containerSizesOrigin ?? null,
        containerSizesDest: cargoInfo?.containerSizesDest ?? null,
        isIllegal: buy.commodity.isIllegal,
      });
    }
  }

  // Round-trip: pair routes by terminal pair, return paired result
  if (roundTrip) {
    // Build reverse lookup map: "destTerminalId-originTerminalId" → route
    const revMap = new Map<string, TradeRoute>();
    for (const r of routes) {
      const revKey = `${r.destTerminalId}-${r.originTerminalId}`;
      if (!revMap.has(revKey)) revMap.set(revKey, r);
    }

    // Filter by maxInvestment / maxDistance
    const qualified = routes.filter((r) => {
      if (maxInvestment && maxInvestment > 0 && r.totalInvestment > maxInvestment) return false;
      if (maxDistance && maxDistance > 0 && (r.distanceGm == null || r.distanceGm > maxDistance)) return false;
      return true;
    });

    // Pair: match each route with its reverse
    const used = new Set<string>();
    const pairs: Array<{ outward: TradeRoute; return_: TradeRoute; roundTripProfit: number; roundTripInvestment: number }> = [];

    for (const r of qualified) {
      const key = `${r.originTerminalId}-${r.destTerminalId}`;
      const revKey = `${r.destTerminalId}-${r.originTerminalId}`;
      if (used.has(key) || used.has(revKey)) continue;

      const rev = revMap.get(key);
      if (rev) {
        used.add(key);
        used.add(revKey);
        // Also apply investment/distance filter to reverse
        let revOk = true;
        if (maxInvestment && maxInvestment > 0 && rev.totalInvestment > maxInvestment) revOk = false;
        if (maxDistance && maxDistance > 0 && (rev.distanceGm == null || rev.distanceGm > maxDistance)) revOk = false;
        if (revOk) {
          pairs.push({
            outward: r,
            return_: rev,
            roundTripProfit: r.totalProfit + rev.totalProfit,
            roundTripInvestment: r.totalInvestment + rev.totalInvestment,
          });
        }
      }
    }

    // Sort pairs by combined profit
    pairs.sort((a, b) => {
      if (sortBy === 'profit') return (b.roundTripProfit - a.roundTripProfit);
      if (sortBy === 'roi') {
        const roiA = a.roundTripInvestment > 0 ? a.roundTripProfit / a.roundTripInvestment : 0;
        const roiB = b.roundTripInvestment > 0 ? b.roundTripProfit / b.roundTripInvestment : 0;
        return roiB - roiA;
      }
      // distance: use outward distance
      if (sortBy === 'distance') {
        const dA = a.outward.distanceGm ?? Infinity;
        const dB = b.outward.distanceGm ?? Infinity;
        return dA - dB;
      }
      return b.roundTripProfit - a.roundTripProfit;
    });

    return NextResponse.json({ roundTrip: true, pairs: pairs.slice(0, 25) });
  }

  // Non-round-trip: normal route list
  // Filter by maxInvestment (total budget)
  let filtered = routes;
  if (maxInvestment && maxInvestment > 0) {
    filtered = filtered.filter((r) => r.totalInvestment <= maxInvestment);
  }
  // Filter by maxDistance
  if (maxDistance && maxDistance > 0) {
    filtered = filtered.filter((r) => r.distanceGm != null && r.distanceGm <= maxDistance);
  }

  // Sort
  filtered.sort((a, b) => {
    const multiplier = sortOrder === 'asc' ? 1 : -1;
    if (sortBy === 'profit') return (a.totalProfit - b.totalProfit) * multiplier;
    if (sortBy === 'roi') return (a.roi - b.roi) * multiplier;
    if (sortBy === 'distance') {
      // Push null distances to the end regardless of sort order
      if (a.distanceGm == null && b.distanceGm == null) return 0;
      if (a.distanceGm == null) return 1;
      if (b.distanceGm == null) return -1;
      return (a.distanceGm - b.distanceGm) * multiplier;
    }
    return (a.totalProfit - b.totalProfit) * multiplier;
  });

  return NextResponse.json(filtered.slice(0, 50));
  } catch (err) {
    console.error('[routes] Error:', err);
    return NextResponse.json(
      { error: 'Failed to compute routes' },
      { status: 500 }
    );
  }
}
