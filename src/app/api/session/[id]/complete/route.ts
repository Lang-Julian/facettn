// POST /api/session/:id/complete — server-side scoring (the ONLY place scores are
// computed). Idempotent: an already-completed session returns its existing token.

import { NextRequest, NextResponse } from 'next/server';
import { getStore } from '@/lib/store';
import { SESSION_COOKIE, verifySessionCookie } from '@/lib/server/security';
import { clientIp, rateLimit } from '@/lib/server/ratelimit';
import { missingCoreItems, scoreSession } from '@/lib/server/scoreSession';

export async function POST(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  if (!rateLimit(`complete:${clientIp(req)}`, 5, 60_000)) {
    return NextResponse.json({ error: 'rate_limited' }, { status: 429 });
  }

  const cookieId = verifySessionCookie(req.cookies.get(SESSION_COOKIE)?.value);
  if (!cookieId || cookieId !== id) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  const store = getStore();
  const session = await store.getSession(id);
  if (!session) return NextResponse.json({ error: 'not_found' }, { status: 404 });

  const rows = await store.getResponses(id);
  const missing = missingCoreItems(rows);
  if (missing.length > 0) {
    return NextResponse.json({ error: 'incomplete', missing }, { status: 400 });
  }

  const scored = scoreSession(rows);
  const { token } = await store.completeSession(id, {
    sessionId: id,
    scores: scored.scores,
    percentiles: scored.percentiles,
    bands: scored.bands,
    validity: scored.validity,
    crisis: scored.crisis,
    archetypeId: scored.archetypeId,
  });

  return NextResponse.json({ token, crisis: scored.crisis });
}
