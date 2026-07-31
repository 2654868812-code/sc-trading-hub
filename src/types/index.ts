export interface CommodityWithChange {
  id: number;
  name: string;
  nameZh: string;
  nameEn: string;
  code: string;
  kind: string | null;
  isBuyable: boolean;
  isSellable: boolean;
  isIllegal: boolean;
  isRaw: boolean;
  isRefined: boolean;
  kindZh: string;
  totalSellStock: number;
  totalBuyStock: number;
  changePercent: number | null;
  currentBuyAvg: number | null;
  currentSellAvg: number | null;
  profitMargin: number | null;
  profitChange: number | null;
  maxProfitMargin: number | null;
  isDazong: boolean;
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
  commodityNameZh: string;
  commodityKindZh: string;
  commodityKind: string | null;
  // Origin
  originTerminalId: number;
  originTerminalName: string;
  originTerminalNameZh: string;
  originTerminalNameEn: string;
  originLocation: string;
  originLocationZh: string;
  originLocationEn: string;
  originSystemName: string;
  originSystemNameEn: string;
  originPlanetName: string;
  originPlanetNameEn: string;
  originMoonName: string;
  originMoonNameEn: string;
  buyPrice: number;
  // Dest
  destTerminalId: number;
  destTerminalName: string;
  destTerminalNameZh: string;
  destTerminalNameEn: string;
  destLocation: string;
  destLocationZh: string;
  destLocationEn: string;
  destSystemName: string;
  destSystemNameEn: string;
  destPlanetName: string;
  destPlanetNameEn: string;
  destMoonName: string;
  destMoonNameEn: string;
  sellPrice: number;
  // Computed
  profitPerScu: number;
  roi: number;
  distanceGm: number | null;
  totalProfit: number;
  totalInvestment: number;
  loadScu: number;
  sellScu: number;
  shipScu: number;
  originStock: number;
  destStock: number;
  originStockMax: number;
  destStockMax: number;
  originUpdatedAt: string;
  destUpdatedAt: string;
  isAutoLoadOrigin: boolean;
  isAutoLoadDest: boolean;
  containerSizesOrigin: string | null;
  containerSizesDest: string | null;
  isIllegal: boolean;
}

export interface RouteFilters {
  commodityId?: number;
  shipId?: number;
  originSystem?: string;
  destSystem?: string;
  originLocation?: string;
  destLocation?: string;
  maxInvestment?: number;
  maxDistance?: number;
  commodityType?: 'major' | 'minor';
  autoLoadType?: 'full' | 'half' | 'manual';
  sortBy?: 'roi' | 'profit' | 'distance';
  sortOrder?: 'asc' | 'desc';
}

export interface ShipOption {
  id: number;
  name: string;
  nameEn: string;
  scu: number;
  companyName: string;
  spaceOnly: boolean;
}

export interface TerminalInfo {
  id: number;
  name: string;
  nameZh: string;
  nameEn: string;
  starSystemName: string | null;
  starSystemNameEn: string | null;
  planetName: string | null;
  planetNameEn: string | null;
  moonName: string | null;
  moonNameEn: string | null;
  cityName: string | null;
  cityNameEn: string | null;
  spaceStationName: string | null;
  spaceStationNameEn: string | null;
  type: string | null;
  hasCargoCenter: boolean;
  hasDockingPort: boolean;
  hasFreightElevator: boolean;
  isAutoLoad: boolean;
  scuBuyStock?: number | null;
  scuSellStock?: number | null;
}
