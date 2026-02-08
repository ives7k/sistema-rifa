// Web Crypto API compatible version for Edge Runtime

const COOKIE_NAME = 'client_session';

function getSecret(): string {
  const secret = process.env.CLIENT_SESSION_SECRET;
  if (!secret) throw new Error('CLIENT_SESSION_SECRET não configurado.');
  return secret;
}

function toBase64Url(buffer: ArrayBuffer | Uint8Array): string {
  const bytes = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
}

function stringToBase64Url(str: string): string {
  return btoa(str).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
}

function fromBase64UrlToString(input: string): string {
  const pad = input.length % 4 === 0 ? '' : '='.repeat(4 - (input.length % 4));
  const b64 = input.replace(/-/g, '+').replace(/_/g, '/') + pad;
  return atob(b64);
}

export type ClientSessionPayload = { cid: string; exp: number };

async function getHmacKey(): Promise<CryptoKey> {
  const secret = getSecret();
  const encoder = new TextEncoder();
  return crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
}

export async function signSession(payload: ClientSessionPayload): Promise<string> {
  const p64 = stringToBase64Url(JSON.stringify(payload));
  const key = await getHmacKey();
  const encoder = new TextEncoder();
  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(p64));
  return `${p64}.${toBase64Url(signature)}`;
}

export async function verifySession(token: string | undefined | null): Promise<ClientSessionPayload | null> {
  try {
    if (!token) return null;
    const [p64, sigb64] = token.split('.');
    if (!p64 || !sigb64) return null;

    const key = await getHmacKey();
    const encoder = new TextEncoder();
    const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(p64));
    const expected = toBase64Url(signature);

    if (expected !== sigb64) return null;

    const payload = JSON.parse(fromBase64UrlToString(p64)) as ClientSessionPayload;
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

export async function getClientIdFromRequest(req: Request): Promise<string | null> {
  const raw = req.headers.get('cookie');
  const jar = parseCookie(raw);
  const token = jar[COOKIE_NAME];
  const payload = await verifySession(token);
  return payload?.cid ?? null;
}

export async function buildLoginCookie(cid: string, days = 180): Promise<string> {
  const exp = Date.now() + days * 24 * 60 * 60 * 1000;
  const token = await signSession({ cid, exp });
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
