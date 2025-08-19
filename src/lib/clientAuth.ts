import crypto from 'crypto';

const COOKIE_NAME = 'client_session';

function getSecret(): string {
  const secret = process.env.CLIENT_SESSION_SECRET;
  if (!secret) throw new Error('CLIENT_SESSION_SECRET não configurado.');
  return secret;
}

function base64url(input: Buffer | string): string {
  const buf = Buffer.isBuffer(input) ? input : Buffer.from(input);
  return buf.toString('base64').replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
}

export type ClientSessionPayload = { cid: string; exp: number };

export function signSession(payload: ClientSessionPayload): string {
  const secret = getSecret();
  const p64 = base64url(JSON.stringify(payload));
  const sig = crypto.createHmac('sha256', secret).update(p64).digest();
  return `${p64}.${base64url(sig)}`;
}

export function verifySession(token: string | undefined | null): ClientSessionPayload | null {
  try {
    if (!token) return null;
    const [p64, sigb64] = token.split('.');
    if (!p64 || !sigb64) return null;
    const secret = getSecret();
    const expected = base64url(crypto.createHmac('sha256', secret).update(p64).digest());
    if (expected !== sigb64) return null;
    const payload = JSON.parse(Buffer.from(p64.replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString()) as ClientSessionPayload;
    if (!payload?.cid || !payload?.exp) return null;
    if (Date.now() > payload.exp) return null;
    return payload;
  } catch {
    return null;
  }
}

export function parseCookie(header: string | null): Record<string, string> {
  const out: Record<string, string> = {};
  if (!header) return out;
  header.split(';').forEach((part) => {
    const [k, v] = part.split('=').map((s) => s.trim());
    if (k) out[k] = decodeURIComponent(v || '');
  });
  return out;
}

export function getClientIdFromRequest(req: Request): string | null {
  const raw = req.headers.get('cookie');
  const jar = parseCookie(raw);
  const token = jar[COOKIE_NAME];
  const payload = verifySession(token);
  return payload?.cid ?? null;
}

export function buildLoginCookie(cid: string, days = 180): string {
  const exp = Date.now() + days * 24 * 60 * 60 * 1000;
  const token = signSession({ cid, exp });
  const attrs = [
    `${COOKIE_NAME}=${encodeURIComponent(token)}`,
    'Path=/',
    'HttpOnly',
    'SameSite=Lax',
  ];
  if (process.env.NODE_ENV !== 'development') attrs.push('Secure');
  attrs.push(`Max-Age=${Math.floor((exp - Date.now()) / 1000)}`);
  return attrs.join('; ');
}

export function buildLogoutCookie(): string {
  const attrs = [
    `${COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`,
  ];
  if (process.env.NODE_ENV !== 'development') attrs.push('Secure');
  return attrs.join('; ');
}


