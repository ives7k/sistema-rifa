// Web Crypto API compatible version for Edge Runtime

export const ADMIN_COOKIE_NAME = '__Host-admin_session';

function getSecret(): string {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) {
    throw new Error('ADMIN_SESSION_SECRET não configurado. Defina no ambiente.');
  }
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

function fromBase64Url(input: string): Uint8Array {
  const pad = input.length % 4 === 0 ? '' : '='.repeat(4 - (input.length % 4));
  const b64 = input.replace(/-/g, '+').replace(/_/g, '/') + pad;
  const binary = atob(b64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

function fromBase64UrlToString(input: string): string {
  const bytes = fromBase64Url(input);
  return new TextDecoder().decode(bytes);
}

export type AdminSessionPayload = {
  iat: number; // issued at (unix seconds)
  exp: number; // expiration (unix seconds)
  role: 'admin';
};

async function getHmacKey(): Promise<CryptoKey> {
  const secret = getSecret();
  const encoder = new TextEncoder();
  return crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify']
  );
}

/**
 * Cria um token assinado (HMAC-SHA256) contendo iat/exp.
 */
export async function createAdminSessionToken(maxAgeSeconds: number): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  const payload: AdminSessionPayload = { iat: now, exp: now + maxAgeSeconds, role: 'admin' };
  const payloadJson = JSON.stringify(payload);
  const payloadB64 = stringToBase64Url(payloadJson);

  const key = await getHmacKey();
  const encoder = new TextEncoder();
  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(payloadB64));
  const sigB64 = toBase64Url(signature);

  return `${payloadB64}.${sigB64}`;
}

export async function verifyAdminSessionToken(token: string): Promise<AdminSessionPayload | null> {
  try {
    const [payloadB64, sigB64] = token.split('.', 2);
    if (!payloadB64 || !sigB64) return null;

    const key = await getHmacKey();
    const encoder = new TextEncoder();
    const signature = fromBase64Url(sigB64);

    const signatureBuffer = new Uint8Array(signature).buffer as ArrayBuffer;
    const isValid = await crypto.subtle.verify(
      'HMAC',
      key,
      signatureBuffer,
      encoder.encode(payloadB64)
    );

    if (!isValid) return null;

    const payload = JSON.parse(fromBase64UrlToString(payloadB64)) as AdminSessionPayload;
    const now = Math.floor(Date.now() / 1000);
    if (payload.role !== 'admin' || payload.exp <= now) return null;
    return payload;
  } catch {
    return null;
  }
}

export function getAdminTokenFromRequest(request: Request): string | null {
  const cookieHeader = request.headers.get('cookie') || '';
  const parts = cookieHeader.split(';');
  for (const part of parts) {
    const [rawName, ...rest] = part.trim().split('=');
    if (rawName === ADMIN_COOKIE_NAME) {
      return rest.join('=');
    }
  }
  return null;
}

export async function isAdminRequest(request: Request): Promise<boolean> {
  const token = getAdminTokenFromRequest(request);
  if (!token) return false;
  return (await verifyAdminSessionToken(token)) !== null;
}
