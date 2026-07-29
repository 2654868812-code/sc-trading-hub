import { prisma } from './db';
import {
  fetchCommodities,
  fetchTerminals,
  fetchAllPrices,
  type UexCommodity,
  type UexTerminal,
  type UexPriceAll,
} from './uex';

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
        name: c.name,
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
        name: c.name,
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
    await prisma.terminal.upsert({
      where: { id: t.id },
      update: {
        name: t.name,
        code: t.code,
        type: t.type,
        starSystemName: t.star_system_name,
        planetName: t.planet_name,
        moonName: t.moon_name,
        cityName: t.city_name,
        spaceStationName: t.space_station_name,
        hasCargoCenter: toBool(t.has_cargo_center),
        hasDockingPort: toBool(t.has_docking_port),
        hasFreightElevator: toBool(t.has_freight_elevator),
        isAutoLoad: toBool(t.is_auto_load),
      },
      create: {
        id: t.id,
        name: t.name,
        code: t.code,
        type: t.type,
        starSystemName: t.star_system_name,
        planetName: t.planet_name,
        moonName: t.moon_name,
        cityName: t.city_name,
        spaceStationName: t.space_station_name,
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
  const data: UexPriceAll[] = await fetchAllPrices();
  const fetchedAt = new Date();
  const batch: Array<{
    commodityId: number;
    terminalId: number;
    priceBuy: number | null;
    priceSell: number | null;
    scuBuyStock: number | null;
    scuSellStock: number | null;
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
      priceSell: p.price_sell,
      scuBuyStock: p.scu_buy,
      scuSellStock: p.scu_sell_stock,
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
    await syncCommodities();
    await syncTerminals();
    await syncPrices();
    await cleanupOldSnapshots(
      parseInt(process.env.PRICE_RETENTION_DAYS || '30', 10)
    );
    console.log('[sync] Full sync complete');
  } catch (err) {
    console.error('[sync] Full sync failed:', err);
  }
}
