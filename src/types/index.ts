export interface CommodityWithChange {
  id: number;
  name: string;
  code: string;
  kind: string | null;
  isBuyable: boolean;
  isSellable: boolean;
  isIllegal: boolean;
  isRaw: boolean;
  isRefined: boolean;
  changePercent: number | null;
  currentBuyAvg: number | null;
  currentSellAvg: number | null;
}

export interface PricePoint {
  fetchedAt: string;
  priceBuy: number | null;
  priceSell: number | null;
  terminalName: string;
}

export interface TradeRoute {
  commodityId: number;
  commodityName: string;
  commodityKind: string | null;
  originTerminalId: number;
  originTerminalName: string;
  originSystemName: string;
  buyPrice: number;
  destTerminalId: number;
  destTerminalName: string;
  destSystemName: string;
  sellPrice: number;
  profitPerScu: number;
  roi: number;
  distanceGm: number | null;
  isAutoLoadOrigin: boolean;
  isAutoLoadDest: boolean;
}

export interface RouteFilters {
  commodityId?: number;
  originSystem?: string;
  destSystem?: string;
  maxInvestment?: number;
  maxDistance?: number;
  autoLoadOnly?: boolean;
  excludeIllegal?: boolean;
  sortBy?: 'roi' | 'profit' | 'distance';
  sortOrder?: 'asc' | 'desc';
}

export interface TerminalInfo {
  id: number;
  name: string;
  starSystemName: string | null;
  cityName: string | null;
  spaceStationName: string | null;
  type: string | null;
  hasCargoCenter: boolean;
  hasDockingPort: boolean;
  hasFreightElevator: boolean;
  isAutoLoad: boolean;
}
