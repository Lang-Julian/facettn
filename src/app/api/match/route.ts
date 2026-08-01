// POST /api/match — token-based comparison. 403 unless BOTH results carry an
// active consent (d). Result stored for analytics-free reference (no PII).

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getStore } from '@/lib/store';
import { clientIp, rateLimit } from '@/lib/server/ratelimit';
import { buildMatchInsights } from '@/lib/server/matchInsights';

const schema = z.object({
  tokenA: z.string().regex(/^[a-f0-9]{32}$/),
  tokenB: z.string().regex(/^[a-f0-9]{32}$/),
});

export async function POST(req: NextRequest) {
  if (!rateLimit(`match:${clientIp(req)}`, 10, 60_000)) {
    return NextResponse.json({ error: 'rate_limited' }, { status: 429 });
  }

  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: 'invalid_body' }, { status: 400 });
  }
  const { tokenA, tokenB } = parsed.data;
  if (tokenA === tokenB) {
    return NextResponse.json({ error: 'same_token' }, { status: 400 });
  }

  const store = getStore();
  const a = await store.getResultByToken(tokenA);
  const b = await store.getResultByToken(tokenB);
  if (!a || !b) return NextResponse.json({ error: 'not_found' }, { status: 404 });
  if (a.expired || b.expired) return NextResponse.json({ error: 'expired' }, { status: 410 });

  const [consentA, consentB] = await Promise.all([
    store.hasActiveConsent(a.result.sessionId, 'd'),
    store.hasActiveConsent(b.result.sessionId, 'd'),
  ]);
  if (!consentA || !consentB) {
    return NextResponse.json(
      { error: 'consent_d_required', detail: 'Beide Profile müssen dem Vergleich ausdrücklich zugestimmt haben.' },
      { status: 403 },
    );
  }

  const insights = buildMatchInsights(a.result.scores, b.result.scores);
  await store.createMatch(a.result.id, b.result.id, { total: insights.total });

  return NextResponse.json(insights);
}
