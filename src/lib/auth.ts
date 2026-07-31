const TOKEN_TTL = 12 * 60 * 60 * 1000; // 12 hours

function getSecret(): string {
  const pwd = process.env.ADMIN_PASSWORD;
  if (!pwd) throw new Error('ADMIN_PASSWORD environment variable is required');
  return pwd;
}

async function hmacSign(data: string): Promise<string> {
  const secret = getSecret();
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw', enc.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']
  );
  const sig = await crypto.subtle.sign('HMAC', key, enc.encode(data));
  return Array.from(new Uint8Array(sig)).map(b => b.toString(16).padStart(2, '0')).join('');
}

export async function signToken(): Promise<string> {
  const expiry = Date.now() + TOKEN_TTL;
  const hmac = await hmacSign(String(expiry));
  return `${expiry}:${hmac}`;
}

export async function verifyToken(token: string | undefined): Promise<boolean> {
  if (!token) return false;
  const [expiryStr, hmac] = token.split(':');
  if (!expiryStr || !hmac) return false;
  if (Date.now() > parseInt(expiryStr, 10)) return false;
  const expected = await hmacSign(expiryStr);
  return hmac === expected;
}
