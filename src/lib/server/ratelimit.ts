// In-memory sliding-window rate limiter — sufficient for a single Node instance
// (local dev / one Vercel function instance). For multi-instance production traffic,
// swap for @upstash/ratelimit + Upstash Redis in middleware (documented in README).

const windows = new Map<string, number[]>();

export function rateLimit(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const hits = (windows.get(key) ?? []).filter((t) => now - t < windowMs);
  if (hits.length >= limit) {
    windows.set(key, hits);
    return false;
  }
  hits.push(now);
  windows.set(key, hits);
  if (windows.size > 10_000) windows.clear(); // crude memory guard
  return true;
}

export function clientIp(req: Request): string {
  const fwd = req.headers.get('x-forwarded-for');
  return fwd?.split(',')[0].trim() || 'unknown';
}
