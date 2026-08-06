"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defineExtension = exports.NullsOrder = exports.QueryMode = exports.SortOrder = exports.MarketIndexScalarFieldEnum = exports.TerminalDistanceScalarFieldEnum = exports.TerminalCommodityMaxScalarFieldEnum = exports.CommodityAverageScalarFieldEnum = exports.VehicleScalarFieldEnum = exports.CargoRouteScalarFieldEnum = exports.PriceSnapshotScalarFieldEnum = exports.TerminalScalarFieldEnum = exports.CommodityScalarFieldEnum = exports.TransactionIsolationLevel = exports.ModelName = exports.AnyNull = exports.JsonNull = exports.DbNull = exports.NullTypes = exports.prismaVersion = exports.getExtensionContext = exports.Decimal = exports.Sql = exports.raw = exports.join = exports.empty = exports.sql = exports.PrismaClientValidationError = exports.PrismaClientInitializationError = exports.PrismaClientRustPanicError = exports.PrismaClientUnknownRequestError = exports.PrismaClientKnownRequestError = void 0;
const runtime = require("@prisma/client/runtime/client");
exports.PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError;
exports.PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError;
exports.PrismaClientRustPanicError = runtime.PrismaClientRustPanicError;
exports.PrismaClientInitializationError = runtime.PrismaClientInitializationError;
exports.PrismaClientValidationError = runtime.PrismaClientValidationError;
exports.sql = runtime.sqltag;
exports.empty = runtime.empty;
exports.join = runtime.join;
exports.raw = runtime.raw;
exports.Sql = runtime.Sql;
exports.Decimal = runtime.Decimal;
exports.getExtensionContext = runtime.Extensions.getExtensionContext;
exports.prismaVersion = {
    client: "7.9.1",
    engine: "e922089b7d7502aff4249d5da3420f6fa55fc6ad"
};
exports.NullTypes = {
    DbNull: runtime.NullTypes.DbNull,
    JsonNull: runtime.NullTypes.JsonNull,
    AnyNull: runtime.NullTypes.AnyNull,
};
exports.DbNull = runtime.DbNull;
exports.JsonNull = runtime.JsonNull;
exports.AnyNull = runtime.AnyNull;
exports.ModelName = {
    Commodity: 'Commodity',
    Terminal: 'Terminal',
    PriceSnapshot: 'PriceSnapshot',
    CargoRoute: 'CargoRoute',
    Vehicle: 'Vehicle',
    CommodityAverage: 'CommodityAverage',
    TerminalCommodityMax: 'TerminalCommodityMax',
    TerminalDistance: 'TerminalDistance',
    MarketIndex: 'MarketIndex'
};
exports.TransactionIsolationLevel = runtime.makeStrictEnum({
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
});
exports.CommodityScalarFieldEnum = {
    id: 'id',
    name: 'name',
    nameEn: 'nameEn',
    code: 'code',
    kind: 'kind',
    weightScu: 'weightScu',
    isBuyable: 'isBuyable',
    isSellable: 'isSellable',
    isIllegal: 'isIllegal',
    isRaw: 'isRaw',
    isRefined: 'isRefined',
    dateAdded: 'dateAdded',
    dateModified: 'dateModified',
    prevBuyAvg: 'prevBuyAvg',
    changePercent: 'changePercent',
    profitMargin: 'profitMargin',
    profitChange: 'profitChange',
    maxProfitMargin: 'maxProfitMargin'
};
exports.TerminalScalarFieldEnum = {
    id: 'id',
    name: 'name',
    nameEn: 'nameEn',
    code: 'code',
    type: 'type',
    starSystemName: 'starSystemName',
    starSystemNameEn: 'starSystemNameEn',
    planetName: 'planetName',
    planetNameEn: 'planetNameEn',
    moonName: 'moonName',
    moonNameEn: 'moonNameEn',
    cityName: 'cityName',
    cityNameEn: 'cityNameEn',
    spaceStationName: 'spaceStationName',
    spaceStationNameEn: 'spaceStationNameEn',
    hasCargoCenter: 'hasCargoCenter',
    hasDockingPort: 'hasDockingPort',
    hasFreightElevator: 'hasFreightElevator',
    hasLoadingDock: 'hasLoadingDock',
    isAutoLoad: 'isAutoLoad',
    isRefinery: 'isRefinery',
    isMedical: 'isMedical',
    isFood: 'isFood',
    isRefuel: 'isRefuel',
    isRepair: 'isRepair',
    isHabitation: 'isHabitation',
    locationType: 'locationType'
};
exports.PriceSnapshotScalarFieldEnum = {
    id: 'id',
    commodityId: 'commodityId',
    terminalId: 'terminalId',
    priceBuy: 'priceBuy',
    priceBuyAvg: 'priceBuyAvg',
    priceSell: 'priceSell',
    priceSellAvg: 'priceSellAvg',
    scuBuyStock: 'scuBuyStock',
    scuSellStock: 'scuSellStock',
    scuSellMax: 'scuSellMax',
    uexModifiedAt: 'uexModifiedAt',
    fetchedAt: 'fetchedAt'
};
exports.CargoRouteScalarFieldEnum = {
    commodityId: 'commodityId',
    originTerminalId: 'originTerminalId',
    destTerminalId: 'destTerminalId',
    distance: 'distance',
    containerSizesOrigin: 'containerSizesOrigin',
    containerSizesDest: 'containerSizesDest'
};
exports.VehicleScalarFieldEnum = {
    id: 'id',
    name: 'name',
    scu: 'scu',
    companyName: 'companyName',
    isCargo: 'isCargo',
    padType: 'padType',
    updatedAt: 'updatedAt'
};
exports.CommodityAverageScalarFieldEnum = {
    commodityId: 'commodityId',
    priceBuyAvg: 'priceBuyAvg',
    priceSellAvg: 'priceSellAvg',
    scuBuyMax: 'scuBuyMax',
    scuBuyAvg: 'scuBuyAvg',
    scuSellMax: 'scuSellMax',
    scuSellAvg: 'scuSellAvg',
    statusBuyAvg: 'statusBuyAvg',
    statusSellAvg: 'statusSellAvg',
    caxScore: 'caxScore',
    gameVersion: 'gameVersion',
    dateModified: 'dateModified',
    fetchedAt: 'fetchedAt'
};
exports.TerminalCommodityMaxScalarFieldEnum = {
    commodityId: 'commodityId',
    terminalId: 'terminalId',
    scuBuyMax: 'scuBuyMax',
    scuSellMax: 'scuSellMax',
    scuBuyMaxLocal: 'scuBuyMaxLocal',
    scuSellMaxLocal: 'scuSellMaxLocal',
    scuBuyStockAvg24h: 'scuBuyStockAvg24h',
    scuSellStockAvg24h: 'scuSellStockAvg24h',
    scuBuyAvg: 'scuBuyAvg',
    scuSellAvg: 'scuSellAvg',
    priceBuyAvg: 'priceBuyAvg',
    priceSellAvg: 'priceSellAvg',
    containerSizes: 'containerSizes',
    dateModified: 'dateModified',
    fetchedAt: 'fetchedAt'
};
exports.TerminalDistanceScalarFieldEnum = {
    originTerminalId: 'originTerminalId',
    destTerminalId: 'destTerminalId',
    distanceGm: 'distanceGm'
};
exports.MarketIndexScalarFieldEnum = {
    id: 'id',
    value: 'value',
    commodityCount: 'commodityCount',
    fetchedAt: 'fetchedAt'
};
exports.SortOrder = {
    asc: 'asc',
    desc: 'desc'
};
exports.QueryMode = {
    default: 'default',
    insensitive: 'insensitive'
};
exports.NullsOrder = {
    first: 'first',
    last: 'last'
};
exports.defineExtension = runtime.Extensions.defineExtension;
//# sourceMappingURL=prismaNamespace.js.map