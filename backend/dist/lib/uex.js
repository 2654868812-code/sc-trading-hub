"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchCommodities = fetchCommodities;
exports.fetchTerminals = fetchTerminals;
exports.fetchAllPrices = fetchAllPrices;
exports.fetchCommodityAverage = fetchCommodityAverage;
exports.fetchCommodityRoutes = fetchCommodityRoutes;
exports.fetchVehicles = fetchVehicles;
exports.fetchCommodityTerminalPrices = fetchCommodityTerminalPrices;
const API_BASE = process.env.UEX_API_BASE || 'https://api.uexcorp.uk/2.0';
function uexHeaders() {
    const token = process.env.UEX_API_TOKEN;
    if (!token)
        return {};
    return { Authorization: `Bearer ${token}` };
}
async function uexFetch(path) {
    const url = `${API_BASE}${path}`;
    const res = await fetch(url, { cache: 'no-store', headers: uexHeaders() });
    if (!res.ok) {
        throw new Error(`UEX API error: ${res.status} ${res.statusText} for ${url}`);
    }
    const json = await res.json();
    if (json.status !== 'ok') {
        throw new Error(`UEX API returned non-ok status: ${JSON.stringify(json)}`);
    }
    return json.data;
}
async function fetchCommodities() {
    return uexFetch('/commodities');
}
async function fetchTerminals() {
    return uexFetch('/terminals?type=commodity');
}
async function fetchAllPrices() {
    return uexFetch('/commodities_prices_all');
}
async function fetchCommodityAverage(id_commodity) {
    const data = await uexFetch(`/commodities_averages?id_commodity=${id_commodity}`);
    if (!data || data.length === 0)
        throw new Error(`No average data for commodity ${id_commodity}`);
    return data[0];
}
async function fetchCommodityRoutes(id_commodity) {
    return uexFetch(`/commodities_routes?id_commodity=${id_commodity}`);
}
async function fetchVehicles() {
    return uexFetch('/vehicles');
}
async function fetchCommodityTerminalPrices(id_commodity) {
    return uexFetch(`/commodities_prices?id_commodity=${id_commodity}`);
}
//# sourceMappingURL=uex.js.map