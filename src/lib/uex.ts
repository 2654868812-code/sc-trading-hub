const API_BASE = process.env.UEX_API_BASE || 'https://api.uexcorp.uk/2.0';

function uexHeaders(): Record<string, string> {
  const token = process.env.UEX_API_TOKEN;
  if (!token) return {};
  return { Authorization: `Bearer ${token}` };
}

async function uexFetch<T>(path: string): Promise<T> {
  const url = `${API_BASE}${path}`;
  const res = await fetch(url, { cache: 'no-store', headers: uexHeaders() });
  if (!res.ok) {
    throw new Error(`UEX API error: ${res.status} ${res.statusText} for ${url}`);
  }
  const json = await res.json();
  if (json.status !== 'ok') {
    throw new Error(`UEX API returned non-ok status: ${JSON.stringify(json)}`);
  }
  return json.data as T;
}

export interface UexCommodity {
  id: number;
  name: string;
  code: string;
  kind: string | null;
  weight_scu: number | null;
  is_buyable: number;
  is_sellable: number;
  is_illegal: number;
  is_raw: number;
  is_refined: number;
  date_added: number | null;
  date_modified: number | null;
}

export interface UexTerminal {
  id: number;
  name: string;
  code: string | null;
  type: string | null;
  star_system_name: string | null;
  planet_name: string | null;
  moon_name: string | null;
  city_name: string | null;
  space_station_name: string | null;
  has_cargo_center: number;
  has_docking_port: number;
  has_freight_elevator: number;
  is_auto_load: number;
}

export interface UexPriceAll {
  id_commodity: number;
  id_terminal: number;
  price_buy: number | null;
  price_buy_avg: number | null;
  price_sell: number | null;
  price_sell_avg: number | null;
  scu_buy: number | null;
  scu_buy_avg: number | null;
  scu_sell_stock: number | null;
  scu_sell_stock_avg: number | null;
  scu_sell: number | null;
  scu_sell_avg: number | null;
  date_modified: number | null;
  commodity_name: string;
  terminal_name: string;
}

export async function fetchCommodities(): Promise<UexCommodity[]> {
  return uexFetch<UexCommodity[]>('/commodities');
}

export async function fetchTerminals(): Promise<UexTerminal[]> {
  return uexFetch<UexTerminal[]>('/terminals?type=commodity');
}

export async function fetchAllPrices(): Promise<UexPriceAll[]> {
  return uexFetch<UexPriceAll[]>('/commodities_prices_all');
}

export interface UexCommodityAverage {
  id: number;
  id_commodity: number;
  // buy prices
  price_buy: number | null;
  price_buy_avg: number | null;
  price_buy_min: number | null;
  price_buy_max: number | null;
  // sell prices
  price_sell: number | null;
  price_sell_avg: number | null;
  price_sell_min: number | null;
  price_sell_max: number | null;
  // buy stock
  scu_buy: number | null;
  scu_buy_avg: number | null;
  scu_buy_min: number | null;
  scu_buy_max: number | null;
  // sell stock
  scu_sell: number | null;
  scu_sell_avg: number | null;
  scu_sell_min: number | null;
  scu_sell_max: number | null;
  // inventory status
  status_buy_avg: number | null;
  status_sell_avg: number | null;
  // score
  cax_score: number | null;
  // meta
  commodity_name: string;
  commodity_code: string;
  game_version: string | null;
  date_modified: number | null;
}

export async function fetchCommodityAverage(id_commodity: number): Promise<UexCommodityAverage> {
  const data = await uexFetch<UexCommodityAverage[]>(`/commodities_averages?id_commodity=${id_commodity}`);
  if (!data || data.length === 0) throw new Error(`No average data for commodity ${id_commodity}`);
  return data[0];
}

export interface UexCargoRoute {
  id_commodity: number;
  id_terminal_origin: number;
  id_terminal_destination: number;
  distance: number | null;
  container_sizes_origin: string | null;
  container_sizes_destination: string | null;
}

export async function fetchCommodityRoutes(id_commodity: number): Promise<UexCargoRoute[]> {
  return uexFetch<UexCargoRoute[]>(`/commodities_routes?id_commodity=${id_commodity}`);
}

export interface UexVehicle {
  id: number;
  name: string;
  name_full: string | null;
  scu: number | null;
  id_company: number | null;
  company_name: string | null;
  is_cargo: number;
  is_spaceship: number;
  pad_type: string | null;
}

export async function fetchVehicles(): Promise<UexVehicle[]> {
  return uexFetch<UexVehicle[]>('/vehicles');
}

export interface UexTerminalCommodityPrice {
  id_commodity: number;
  id_terminal: number;
  price_buy_avg: number | null;
  price_sell_avg: number | null;
  scu_buy_max: number | null;
  scu_sell_max: number | null;
  scu_buy_avg: number | null;
  scu_sell_avg: number | null;
  date_modified: number | null;
}

export async function fetchCommodityTerminalPrices(id_commodity: number): Promise<UexTerminalCommodityPrice[]> {
  return uexFetch<UexTerminalCommodityPrice[]>(`/commodities_prices?id_commodity=${id_commodity}`);
}
