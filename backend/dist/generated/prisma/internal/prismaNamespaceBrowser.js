"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NullsOrder = exports.QueryMode = exports.SortOrder = exports.TerminalCommodityMaxScalarFieldEnum = exports.CommodityAverageScalarFieldEnum = exports.VehicleScalarFieldEnum = exports.CargoRouteScalarFieldEnum = exports.PriceSnapshotScalarFieldEnum = exports.TerminalScalarFieldEnum = exports.CommodityScalarFieldEnum = exports.TransactionIsolationLevel = exports.ModelName = exports.AnyNull = exports.JsonNull = exports.DbNull = exports.NullTypes = exports.Decimal = void 0;
const runtime = require("@prisma/client/runtime/index-browser");
exports.Decimal = runtime.Decimal;
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
    TerminalCommodityMax: 'TerminalCommodityMax'
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
    isAutoLoad: 'isAutoLoad'
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
    scuBuyAvg: 'scuBuyAvg',
    scuSellAvg: 'scuSellAvg',
    priceBuyAvg: 'priceBuyAvg',
    priceSellAvg: 'priceSellAvg',
    dateModified: 'dateModified',
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
//# sourceMappingURL=prismaNamespaceBrowser.js.map