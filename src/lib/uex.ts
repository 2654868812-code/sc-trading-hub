const API_BASE = process.env.UEX_API_BASE || 'https://api.uexcorp.uk/2.0';

async function uexFetch<T>(path: string): Promise<T> {
  const url = `${API_BASE}${path}`;
  const res = await fetch(url, { cache: 'no-store' });
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
