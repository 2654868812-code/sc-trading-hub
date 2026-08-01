import * as crypto from 'crypto';

const TOKEN_TTL = 30 * 60 * 1000; // 30 minutes

function getSecret(): string {
  const pwd = process.env.ADMIN_PASSWORD;
  if (!pwd) throw new Error('ADMIN_PASSWORD environment variable is required');
  return pwd;
}

function hmacSign(data: string): string {
  return crypto.createHmac('sha256', getSecret()).update(data).digest('hex');
}

export function signToken(): string {
  const expiry = Date.now() + TOKEN_TTL;
  const sig = hmacSign(String(expiry));
  return `${expiry}:${sig}`;
}

export function verifyToken(token: string | undefined): boolean {
  if (!token) return false;
  const [expiryStr, sig] = token.split(':');
  if (!expiryStr || !sig) return false;
  if (Date.now() > parseInt(expiryStr, 10)) return false;
  const expected = hmacSign(expiryStr);
  return sig === expected;
}
