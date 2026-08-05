"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uexFetch = uexFetch;
const API_BASE = process.env.UEX_API_BASE || 'https://api.uexcorp.uk/2.0';
function uexHeaders() {
    const token = process.env.UEX_API_TOKEN;
    if (!token)
        return {};
    return { Authorization: `Bearer ${token}` };
}
async function uexFetch(path) {
    const url = `${API_BASE}${path}`;
    const res = await fetch(url, { headers: uexHeaders(), cache: 'no-store' });
    if (!res.ok)
        throw new Error(`UEX API error: ${res.status} ${res.statusText} for ${url}`);
    const json = await res.json();
    if (json.status !== 'ok')
        throw new Error(`UEX API non-ok: ${JSON.stringify(json)}`);
    return json.data;
}
//# sourceMappingURL=uex.js.map