// PATCH /api/session/:id/responses — debounced batch autosave (Dev-Spec §3).
// localStorage is the primary autosave on the client; this is the server backup.

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getStore } from '@/lib/store';
import { SESSION_COOKIE, verifySessionCookie } from '@/lib/server/security';
import { clientIp, rateLimit } from '@/lib/server/ratelimit';
import { ITEMS } from '@/lib/seed/items';

const VALID_ITEM_IDS = new Set(ITEMS.map((i) => i.id));

const schema = z.object({
  responses: z
    .array(
      z.object({
        itemId: z.string(),
        value: z.number().int().min(0).max(5),
        responseTimeMs: z.number().int().nonnegative(),
      }),
    )
    .min(1)
    .max(80),
});

export async function PATCH(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  if (!rateLimit(`resp:${clientIp(req)}`, 60, 60_000)) {
    return NextResponse.json({ error: 'rate_limited' }, { status: 429 });
  }

  const cookieId = verifySessionCookie(req.cookies.get(SESSION_COOKIE)?.value);
  if (!cookieId || cookieId !== id) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: 'invalid_body', details: parsed.error.flatten() }, { status: 400 });
  }

  const store = getStore();
  const session = await store.getSession(id);
  if (!session) return NextResponse.json({ error: 'not_found' }, { status: 404 });
  if (session.status === 'completed') {
    return NextResponse.json({ error: 'already_completed' }, { status: 409 });
  }

  // Validate item ids and value ranges per response format.
  const itemById = new Map(ITEMS.map((i) => [i.id, i]));
  for (const r of parsed.data.responses) {
    if (!VALID_ITEM_IDS.has(r.itemId)) {
      return NextResponse.json({ error: `unknown_item:${r.itemId}` }, { status: 400 });
    }
    const item = itemById.get(r.itemId)!;
    const [lo, hi] = item.responseFormat === 'phq4' ? [0, 3] : [1, 5];
    if (r.value < lo || r.value > hi) {
      return NextResponse.json({ error: `value_out_of_range:${r.itemId}` }, { status: 400 });
    }
  }

  const saved = await store.saveResponses(id, parsed.data.responses);
  return NextResponse.json({ saved });
}
