const API_BASE = process.env.UEX_API_BASE || 'https://api.uexcorp.uk/2.0';

function uexHeaders(): Record<string, string> {
  const token = process.env.UEX_API_TOKEN;
  if (!token) return {};
  return { Authorization: `Bearer ${token}` };
}

export async function uexFetch<T>(path: string, timeoutMs = 120_000): Promise<T> {
  const url = `${API_BASE}${path}`;
  const res = await fetch(url, { headers: uexHeaders(), cache: 'no-store', signal: AbortSignal.timeout(timeoutMs) });
  if (!res.ok) throw new Error(`UEX API error: ${res.status} ${res.statusText} for ${url}`);
  const json = await res.json();
  if (json.status !== 'ok') throw new Error(`UEX API non-ok: ${JSON.stringify(json)}`);
  return json.data as T;
}
