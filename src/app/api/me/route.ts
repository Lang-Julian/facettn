// DELETE /api/me — GDPR deletion by share token or e-mail (cascades everything).

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getStore } from '@/lib/store';
import { hashEmail } from '@/lib/server/security';
import { clientIp, rateLimit } from '@/lib/server/ratelimit';

const schema = z
  .object({
    token: z.string().regex(/^[a-f0-9]{32}$/).optional(),
    email: z.string().email().optional(),
  })
  .refine((d) => d.token || d.email, { message: 'token or email required' });

export async function DELETE(req: NextRequest) {
  if (!rateLimit(`delete:${clientIp(req)}`, 5, 60_000)) {
    return NextResponse.json({ error: 'rate_limited' }, { status: 429 });
  }

  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: 'invalid_body' }, { status: 400 });

  const store = getStore();
  let deleted = false;
  if (parsed.data.token) deleted = await store.deleteByToken(parsed.data.token);
  if (parsed.data.email) deleted = (await store.deleteByEmailHash(hashEmail(parsed.data.email))) || deleted;

  // Deliberately return 200 either way to avoid oracle behavior on e-mail existence.
  return NextResponse.json({ deleted });
}
