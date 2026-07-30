import { prisma } from './db';
import {
  fetchCommodities,
  fetchTerminals,
  fetchAllPrices,
  fetchCommodityAverage,
  fetchCommodityRoutes,
  fetchVehicles,
  fetchCommodityTerminalPrices,
  type UexCommodity,
  type UexTerminal,
  type UexPriceAll,
} from './uex';
import { getZhName } from './commodity-zh';
import { getTerminalZh } from './terminal-zh';
import { getLocationZh } from './location-zh';

function toBool(n: number | undefined): boolean {
  return n === 1;
}

export async function syncCommodities(): Promise<number> {
  const data: UexCommodity[] = await fetchCommodities();
  let count = 0;
  for (const c of data) {
    await prisma.commodity.upsert({
      where: { id: c.id },
      update: {
        name: getZhName(c.name),
        nameEn: c.name,
        code: c.code,
        kind: c.kind,
        weightScu: c.weight_scu,
        isBuyable: toBool(c.is_buyable),
        isSellable: toBool(c.is_sellable),
        isIllegal: toBool(c.is_illegal),
        isRaw: toBool(c.is_raw),
        isRefined: toBool(c.is_refined),
        dateAdded: c.date_added,
        dateModified: c.date_modified,
      },
      create: {
        id: c.id,
        name: getZhName(c.name),
        nameEn: c.name,
        code: c.code,
        kind: c.kind,
        weightScu: c.weight_scu,
        isBuyable: toBool(c.is_buyable),
        isSellable: toBool(c.is_sellable),
        isIllegal: toBool(c.is_illegal),
        isRaw: toBool(c.is_raw),
        isRefined: toBool(c.is_refined),
        dateAdded: c.date_added,
        dateModified: c.date_modified,
      },
    });
    count++;
  }
  console.log(`[sync] Upserted ${count} commodities`);
  return count;
}

export async function syncTerminals(): Promise<number> {
  const data: UexTerminal[] = await fetchTerminals();
  let count = 0;
  for (const t of data) {
    const zhName = getTerminalZh(t.name);
    const zhCity = getLocationZh(t.city_name);
    const zhStation = getLocationZh(t.space_station_name);
    const zhSystem = getLocationZh(t.star_system_name);
    const zhPlanet = getLocationZh(t.planet_name);

    await prisma.terminal.upsert({
      where: { id: t.id },
      update: {
        name: zhName,
        nameEn: t.name,
        code: t.code,
        type: t.type,
        starSystemName: zhSystem,
        starSystemNameEn: t.star_system_name || '',
        planetName: zhPlanet,
        planetNameEn: t.planet_name || '',
        moonName: getLocationZh(t.moon_name),
        moonNameEn: t.moon_name || '',
        cityName: zhCity,
        cityNameEn: t.city_name || '',
        spaceStationName: zhStation,
        spaceStationNameEn: t.space_station_name || '',
        hasCargoCenter: toBool(t.has_cargo_center),
        hasDockingPort: toBool(t.has_docking_port),
        hasFreightElevator: toBool(t.has_freight_elevator),
        isAutoLoad: toBool(t.is_auto_load),
      },
      create: {
        id: t.id,
        name: zhName,
        nameEn: t.name,
        code: t.code,
        type: t.type,
        starSystemName: zhSystem,
        starSystemNameEn: t.star_system_name || '',
        planetName: zhPlanet,
        planetNameEn: t.planet_name || '',
        moonName: getLocationZh(t.moon_name),
        moonNameEn: t.moon_name || '',
        cityName: zhCity,
        cityNameEn: t.city_name || '',
        spaceStationName: zhStation,
        spaceStationNameEn: t.space_station_name || '',
        hasCargoCenter: toBool(t.has_cargo_center),
        hasDockingPort: toBool(t.has_docking_port),
        hasFreightElevator: toBool(t.has_freight_elevator),
        isAutoLoad: toBool(t.is_auto_load),
      },
    });
    count++;
  }
  console.log(`[sync] Upserted ${count} terminals`);
  return count;
}

export async function syncPrices(): Promise<number> {
  const fetchedAt = new Date();

  // Skip if this timestamp already has snapshots (prevents double-insert on rapid cron calls)
  const existing = await prisma.priceSnapshot.findFirst({
    where: { fetchedAt },
    select: { id: true },
  });
  if (existing) {
    console.log(`[sync] Skipping prices: snapshots already exist at ${fetchedAt.toISOString()}`);
    return 0;
  }

  const data: UexPriceAll[] = await fetchAllPrices();
  const batch: Array<{
    commodityId: number;
    terminalId: number;
    priceBuy: number | null;
    priceBuyAvg: number | null;
    priceSell: number | null;
    priceSellAvg: number | null;
    scuBuyStock: number | null;
    scuSellStock: number | null;
    scuSellMax: number | null;
    uexModifiedAt?: number | null;
    fetchedAt: Date;
  }> = [];

  const seen = new Set<string>();
  for (const p of data) {
    if (!p.id_commodity || !p.id_terminal) continue;
    const key = `${p.id_commodity}-${p.id_terminal}`;
    if (seen.has(key)) continue;
    seen.add(key);
    batch.push({
      commodityId: p.id_commodity,
      terminalId: p.id_terminal,
      priceBuy: p.price_buy,
      priceBuyAvg: p.price_buy_avg,
      priceSell: p.price_sell,
      priceSellAvg: p.price_sell_avg,
      scuBuyStock: p.scu_buy,
      scuSellStock: p.scu_sell_stock,
      scuSellMax: p.scu_sell,
      uexModifiedAt: p.date_modified,
      fetchedAt,
    });
  }

  const chunkSize = 1000;
  for (let i = 0; i < batch.length; i += chunkSize) {
    const chunk = batch.slice(i, i + chunkSize);
    await prisma.priceSnapshot.createMany({ data: chunk });
  }

  console.log(`[sync] Inserted ${batch.length} price snapshots at ${fetchedAt.toISOString()}`);
  return batch.length;
}

export async function syncCommodityAverages(): Promise<number> {
  const commodities = await prisma.commodity.findMany({ select: { id: true } });
  const fetchedAt = new Date();
  let count = 0;

  for (const c of commodities) {
    try {
      const a = await fetchCommodityAverage(c.id);
      await prisma.commodityAverage.upsert({
        where: { commodityId: c.id },
        update: {
          priceBuyAvg: a.price_buy_avg,
          priceSellAvg: a.price_sell_avg,
          scuBuyMax: a.scu_buy_max,
          scuBuyAvg: a.scu_buy_avg,
          scuSellMax: a.scu_sell_max,
          scuSellAvg: a.scu_sell_avg,
          statusBuyAvg: a.status_buy_avg,
          statusSellAvg: a.status_sell_avg,
          caxScore: a.cax_score,
          gameVersion: a.game_version,
          dateModified: a.date_modified,
          fetchedAt,
        },
        create: {
          commodityId: c.id,
          priceBuyAvg: a.price_buy_avg,
          priceSellAvg: a.price_sell_avg,
          scuBuyMax: a.scu_buy_max,
          scuBuyAvg: a.scu_buy_avg,
          scuSellMax: a.scu_sell_max,
          scuSellAvg: a.scu_sell_avg,
          statusBuyAvg: a.status_buy_avg,
          statusSellAvg: a.status_sell_avg,
          caxScore: a.cax_score,
          gameVersion: a.game_version,
          dateModified: a.date_modified,
          fetchedAt,
        },
      });
      count++;
    } catch (err) {
      console.warn(`[sync] Failed to fetch averages for commodity ${c.id}:`, String(err));
    }
    // small delay to avoid rate-limiting
    await new Promise((r) => setTimeout(r, 100));
  }

  console.log(`[sync] Upserted ${count} commodity averages`);
  return count;
}

export async function syncCargoRoutes(): Promise<number> {
  const commodities = await prisma.commodity.findMany({ select: { id: true } });
  let total = 0;
  const allRows: Array<{
    commodityId: number;
    originTerminalId: number;
    destTerminalId: number;
    distance: number | null;
    containerSizesOrigin: string | null;
    containerSizesDest: string | null;
  }> = [];

  for (const c of commodities) {
    try {
      const routes = await fetchCommodityRoutes(c.id);
      for (const r of routes) {
        if (!r.id_terminal_origin || !r.id_terminal_destination) continue;
        allRows.push({
          commodityId: r.id_commodity,
          originTerminalId: r.id_terminal_origin,
          destTerminalId: r.id_terminal_destination,
          distance: r.distance,
          containerSizesOrigin: r.container_sizes_origin,
          containerSizesDest: r.container_sizes_destination,
        });
      }
    } catch (err) {
      console.warn(`[sync] Failed to fetch routes for commodity ${c.id}:`, String(err));
    }
    // delay to avoid rate-limiting
    await new Promise((r) => setTimeout(r, 50));
  }

  // Deduplicate by composite key
  const seen = new Map<string, typeof allRows[number]>();
  for (const row of allRows) {
    seen.set(`${row.commodityId}-${row.originTerminalId}-${row.destTerminalId}`, row);
  }
  const deduped = Array.from(seen.values());

  // Delete old data and bulk-insert new in a transaction
  await prisma.$transaction(async (tx) => {
    await tx.cargoRoute.deleteMany();
    for (let i = 0; i < deduped.length; i += 1000) {
      await tx.cargoRoute.createMany({
        data: deduped.slice(i, i + 1000),
      });
    }
  });

  console.log(`[sync] Inserted ${deduped.length} cargo routes (${allRows.length - deduped.length} dupes skipped)`);
  return deduped.length;
}

export async function syncVehicles(): Promise<number> {
  const data = await fetchVehicles();
  const fetchedAt = new Date();

  const cargoShips = data
    .filter((v) => (v.scu ?? 0) > 0 && v.is_spaceship === 1)
    .map((v) => ({
      id: v.id,
      name: v.name_full || v.name,
      scu: v.scu ?? 0,
      companyName: v.company_name || '',
      isCargo: v.is_cargo === 1,
      padType: v.pad_type || '',
      updatedAt: fetchedAt,
    }));

  // Delete old data and bulk-insert new in a transaction
  await prisma.$transaction(async (tx) => {
    await tx.vehicle.deleteMany();
    for (let i = 0; i < cargoShips.length; i += 500) {
      await tx.vehicle.createMany({
        data: cargoShips.slice(i, i + 500),
      });
    }
  });

  console.log(`[sync] Inserted ${cargoShips.length} vehicles`);
  return cargoShips.length;
}

export async function syncTerminalCommodityMax(): Promise<number> {
  const commodities = await prisma.commodity.findMany({ select: { id: true } });
  const fetchedAt = new Date();
  let total = 0;

  for (const c of commodities) {
    try {
      const data = await fetchCommodityTerminalPrices(c.id);
      for (const t of data) {
        await prisma.terminalCommodityMax.upsert({
          where: { commodityId_terminalId: { commodityId: t.id_commodity, terminalId: t.id_terminal } },
          update: {
            scuBuyMax: t.scu_buy_max,
            scuSellMax: t.scu_sell_max,
            scuBuyAvg: t.scu_buy_avg,
            scuSellAvg: t.scu_sell_avg,
            dateModified: t.date_modified,
            fetchedAt,
          },
          create: {
            commodityId: t.id_commodity,
            terminalId: t.id_terminal,
            scuBuyMax: t.scu_buy_max,
            scuSellMax: t.scu_sell_max,
            scuBuyAvg: t.scu_buy_avg,
            scuSellAvg: t.scu_sell_avg,
            dateModified: t.date_modified,
            fetchedAt,
          },
        });
        total++;
      }
    } catch (err) {
      console.warn(`[sync] Failed to fetch terminal prices for commodity ${c.id}:`, String(err));
    }
    // throttle to avoid rate limiting
    await new Promise((r) => setTimeout(r, 50));
  }

  console.log(`[sync] Upserted ${total} terminal-commodity max stock rows`);
  return total;
}

export async function updatePriceChanges(): Promise<number> {
  // Get latest snapshot time (always compute margin)
  const latestTime = await prisma.priceSnapshot.findFirst({
    orderBy: { fetchedAt: 'desc' },
    select: { fetchedAt: true },
  });
  if (!latestTime) return 0;

  // Get previous snapshot time for change tracking (may not exist)
  const prevTime = await prisma.priceSnapshot.findFirst({
    orderBy: { fetchedAt: 'desc' },
    where: { fetchedAt: { lt: latestTime.fetchedAt } },
    select: { fetchedAt: true },
  });

  // Current avg prices — filter zeros
  const [curBuy, curSell] = await Promise.all([
    prisma.priceSnapshot.groupBy({
      by: ['commodityId'],
      where: { fetchedAt: latestTime.fetchedAt, priceBuy: { gt: 0 } },
      _avg: { priceBuy: true },
    }),
    prisma.priceSnapshot.groupBy({
      by: ['commodityId'],
      where: { fetchedAt: latestTime.fetchedAt, priceSell: { gt: 0 } },
      _avg: { priceSell: true },
    }),
  ]);

  // Previous avg prices for change tracking
  let prevBuy: typeof curBuy = [];
  let prevSell: typeof curSell = [];
  if (prevTime) {
    [prevBuy, prevSell] = await Promise.all([
      prisma.priceSnapshot.groupBy({
        by: ['commodityId'],
        where: { fetchedAt: prevTime.fetchedAt, priceBuy: { gt: 0 } },
        _avg: { priceBuy: true },
      }),
      prisma.priceSnapshot.groupBy({
        by: ['commodityId'],
        where: { fetchedAt: prevTime.fetchedAt, priceSell: { gt: 0 } },
        _avg: { priceSell: true },
      }),
    ]);
  }

  const curMap: Record<number, { buy: number | null; sell: number | null }> = {};
  for (const c of curBuy) curMap[c.commodityId] = { buy: c._avg.priceBuy, sell: null };
  for (const s of curSell) {
    if (curMap[s.commodityId]) curMap[s.commodityId].sell = s._avg.priceSell;
    else curMap[s.commodityId] = { buy: null, sell: s._avg.priceSell };
  }

  const prevMap: Record<number, { buy: number | null; sell: number | null }> = {};
  if (prevTime) {
    for (const p of prevBuy) prevMap[p.commodityId] = { buy: p._avg.priceBuy, sell: null };
    for (const s of prevSell) {
      if (prevMap[s.commodityId]) prevMap[s.commodityId].sell = s._avg.priceSell;
      else prevMap[s.commodityId] = { buy: null, sell: s._avg.priceSell };
    }
  }

  // Max profit margin: min buy price → max sell price across all terminals
  const [minBuyData, maxSellData] = await Promise.all([
    prisma.priceSnapshot.groupBy({
      by: ['commodityId'],
      where: { fetchedAt: latestTime.fetchedAt, priceBuy: { gt: 0 } },
      _min: { priceBuy: true },
    }),
    prisma.priceSnapshot.groupBy({
      by: ['commodityId'],
      where: { fetchedAt: latestTime.fetchedAt, priceSell: { gt: 0 } },
      _max: { priceSell: true },
    }),
  ]);

  const minBuyMap: Record<number, number> = {};
  for (const m of minBuyData) if (m._min.priceBuy != null) minBuyMap[m.commodityId] = m._min.priceBuy;
  const maxSellMap: Record<number, number> = {};
  for (const m of maxSellData) if (m._max.priceSell != null) maxSellMap[m.commodityId] = m._max.priceSell;

  let updated = 0;
  for (const commodityId of Object.keys(curMap)) {
    const id = parseInt(commodityId);
    const cur = curMap[id];
    const prv = prevMap[id];
    if (cur.sell == null || cur.buy == null || cur.buy <= 0) continue;

    // Profit margin = (sell - buy) / buy * 100 (%)
    const curMargin = Math.round(((cur.sell - cur.buy) / cur.buy) * 1000) / 10;
    const prevMargin = prv.sell != null && prv.buy != null && prv.buy > 0
      ? Math.round(((prv.sell - prv.buy) / prv.buy) * 1000) / 10
      : null;
    // Unit profit for change tracking
    const curProfit = Math.round(cur.sell - cur.buy);
    const prevProfit = prv?.sell != null && prv?.buy != null && prv.buy > 0
      ? Math.round(prv.sell - prv.buy)
      : null;

    // Get stored baseline
    const stored = await prisma.commodity.findUnique({
      where: { id },
      select: { profitMargin: true, prevBuyAvg: true, profitChange: true },
    });

    // Track profit change via unit profit (stored in prevBuyAvg as baseline)
    const lastUnitProfit = stored?.prevBuyAvg;
    // Default: keep existing profitChange if profit hasn't moved
    let profitChangeVal: number | null = stored?.profitChange ?? null;
    if (lastUnitProfit != null && curProfit !== lastUnitProfit) {
      profitChangeVal = Math.round(curProfit - lastUnitProfit);
    } else if (lastUnitProfit == null && prevProfit != null && curProfit !== prevProfit) {
      profitChangeVal = Math.round(curProfit - prevProfit);
    }

    // Max profit margin from best buy→sell pair
    let maxMargin: number | null = null;
    if (minBuyMap[id] != null && maxSellMap[id] != null && minBuyMap[id] > 0) {
      maxMargin = Math.round(((maxSellMap[id] - minBuyMap[id]) / minBuyMap[id]) * 1000) / 10;
    }

    await prisma.commodity.update({
      where: { id },
      data: {
        profitMargin: curMargin,
        profitChange: profitChangeVal,
        maxProfitMargin: maxMargin,
        prevBuyAvg: curProfit, // baseline for next comparison
      },
    });
    if (profitChangeVal != null) updated++;
  }

  console.log(`[sync] Updated profit changes for ${updated} commodities`);
  return updated;
}

export async function cleanupOldSnapshots(retentionDays: number = 30): Promise<number> {
  const cutoff = new Date(Date.now() - retentionDays * 24 * 60 * 60 * 1000);
  const result = await prisma.priceSnapshot.deleteMany({
    where: { fetchedAt: { lt: cutoff } },
  });
  console.log(`[sync] Deleted ${result.count} old snapshots before ${cutoff.toISOString()}`);
  return result.count;
}

export async function fullSync(): Promise<void> {
  console.log('[sync] Starting full sync...');
  try {
    // Critical: commodities and terminals must succeed
    await syncCommodities();
    await syncTerminals();
    await syncPrices();
    await updatePriceChanges();

    // Non-critical: these can fail without breaking core functionality
    try { await syncCommodityAverages(); } catch (err) {
      console.error('[sync] syncCommodityAverages failed:', err);
    }
    try { await syncCargoRoutes(); } catch (err) {
      console.error('[sync] syncCargoRoutes failed:', err);
    }
    try { await syncVehicles(); } catch (err) {
      console.error('[sync] syncVehicles failed:', err);
    }
    try { await syncTerminalCommodityMax(); } catch (err) {
      console.error('[sync] syncTerminalCommodityMax failed:', err);
    }

    await cleanupOldSnapshots(
      parseInt(process.env.PRICE_RETENTION_DAYS || '30', 10)
    );
    console.log('[sync] Full sync complete');
  } catch (err) {
    console.error('[sync] Full sync failed:', err);
    throw err;
  }
}
