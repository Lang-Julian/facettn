// POST /api/session — start a test session. Requires consent (a) — without it the
// test is not usable (Art. 9 GDPR). Sets a signed httpOnly session cookie.

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getStore } from '@/lib/store';
import { hashIp, SESSION_COOKIE, signSessionId } from '@/lib/server/security';
import { clientIp, rateLimit } from '@/lib/server/ratelimit';

const schema = z.object({
  consentA: z.literal(true),
  textVersion: z.string().min(1).max(50),
});

export async function POST(req: NextRequest) {
  const ip = clientIp(req);
  if (!rateLimit(`session:${ip}`, 10, 60_000)) {
    return NextResponse.json({ error: 'rate_limited' }, { status: 429 });
  }

  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: 'consent_a_required' }, { status: 403 });
  }

  const store = getStore();
  const session = await store.createSession();
  await store.saveConsents([
    {
      sessionId: session.id,
      consentType: 'a',
      granted: true,
      textVersion: parsed.data.textVersion,
      ipHash: hashIp(ip),
    },
  ]);

  const res = NextResponse.json({ sessionId: session.id });
  res.cookies.set(SESSION_COOKIE, signSessionId(session.id), {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
  });
  return res;
}
