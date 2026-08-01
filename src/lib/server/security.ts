// Session cookie signing (HMAC), email hashing/encryption (AES-256-GCM), IP hashing.
// SESSION_SECRET is required in production; a static dev fallback keeps local dev friction-free.

import { createCipheriv, createDecipheriv, createHmac, randomBytes, scryptSync } from 'node:crypto';

// Lazy so the check runs at request time, not at build-time module collection.
let cachedSecret: string | null = null;
function secret(): string {
  if (cachedSecret) return cachedSecret;
  const env = process.env.SESSION_SECRET;
  if (!env && process.env.NODE_ENV === 'production' && process.env.NEXT_PHASE !== 'phase-production-build') {
    throw new Error('SESSION_SECRET must be set in production');
  }
  cachedSecret = env ?? 'dev-only-secret-do-not-use-in-production';
  return cachedSecret;
}

export const SESSION_COOKIE = 'ftn_sid';

function hmac(value: string): string {
  return createHmac('sha256', secret()).update(value).digest('base64url');
}

export function signSessionId(id: string): string {
  return `${id}.${hmac(id)}`;
}

export function verifySessionCookie(cookie: string | undefined): string | null {
  if (!cookie) return null;
  const dot = cookie.lastIndexOf('.');
  if (dot < 0) return null;
  const id = cookie.slice(0, dot);
  const sig = cookie.slice(dot + 1);
  return sig === hmac(id) ? id : null;
}

export function hashEmail(email: string): string {
  return createHmac('sha256', secret()).update(email.trim().toLowerCase()).digest('hex');
}

export function hashIp(ip: string): string {
  return createHmac('sha256', secret()).update(ip).digest('hex');
}

let cachedAesKey: Buffer | null = null;
function aesKey(): Buffer {
  cachedAesKey ??= scryptSync(secret(), 'facettn-email-v1', 32);
  return cachedAesKey;
}

export function encryptEmail(email: string): string {
  const iv = randomBytes(12);
  const cipher = createCipheriv('aes-256-gcm', aesKey(), iv);
  const enc = Buffer.concat([cipher.update(email, 'utf8'), cipher.final()]);
  return `${iv.toString('base64url')}.${enc.toString('base64url')}.${cipher.getAuthTag().toString('base64url')}`;
}

export function decryptEmail(payload: string): string | null {
  try {
    const [iv, data, tag] = payload.split('.').map((p) => Buffer.from(p, 'base64url'));
    const decipher = createDecipheriv('aes-256-gcm', aesKey(), iv);
    decipher.setAuthTag(tag);
    return Buffer.concat([decipher.update(data), decipher.final()]).toString('utf8');
  } catch {
    return null;
  }
}
