// POST /api/email-gate — records granular consents (b/c/d) audit-proof, links the
// e-mail (hashed + encrypted, separate from responses) and triggers mails.
// Consent (a) was already collected at session start; without it -> 403.

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getStore } from '@/lib/store';
import {
  encryptEmail,
  hashEmail,
  hashIp,
  SESSION_COOKIE,
  verifySessionCookie,
} from '@/lib/server/security';
import { clientIp, rateLimit } from '@/lib/server/ratelimit';
import { sendDoubleOptIn, sendResultEmail } from '@/lib/server/email';
import { randomBytes } from 'node:crypto';

const schema = z.object({
  sessionId: z.string().uuid(),
  email: z.string().email().max(254).optional(),
  resultToken: z.string().regex(/^[a-f0-9]{32}$/).optional(),
  consents: z
    .array(
      z.object({
        type: z.enum(['b', 'c', 'd']),
        granted: z.boolean(),
        textVersion: z.string().min(1).max(50),
      }),
    )
    .max(3),
});

export async function POST(req: NextRequest) {
  const ip = clientIp(req);
  if (!rateLimit(`gate:${ip}`, 10, 60_000)) {
    return NextResponse.json({ error: 'rate_limited' }, { status: 429 });
  }

  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: 'invalid_body', details: parsed.error.flatten() }, { status: 400 });
  }
  const { sessionId, email, resultToken, consents } = parsed.data;

  const cookieId = verifySessionCookie(req.cookies.get(SESSION_COOKIE)?.value);
  if (!cookieId || cookieId !== sessionId) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  const store = getStore();
  if (!(await store.hasActiveConsent(sessionId, 'a'))) {
    return NextResponse.json({ error: 'consent_a_missing' }, { status: 403 });
  }

  const wantsB = consents.find((c) => c.type === 'b')?.granted ?? false;
  const wantsC = consents.find((c) => c.type === 'c')?.granted ?? false;
  if ((wantsB || wantsC) && !email) {
    return NextResponse.json({ error: 'email_required_for_consent' }, { status: 400 });
  }

  const ipHash = hashIp(ip);
  await store.saveConsents(
    consents.map((c) => ({
      sessionId,
      consentType: c.type,
      granted: c.granted,
      textVersion: c.textVersion,
      ipHash,
    })),
  );

  let doubleOptInSent = false;
  if (email && (wantsB || wantsC)) {
    const emailHash = hashEmail(email);
    await store.linkEmail(sessionId, emailHash, encryptEmail(email));
    if (wantsB && resultToken) {
      await sendResultEmail(email, resultToken);
    }
    if (wantsC) {
      const confirmToken = randomBytes(16).toString('hex');
      await store.setDoubleOptInToken(emailHash, confirmToken);
      await sendDoubleOptIn(email, confirmToken);
      doubleOptInSent = true;
    }
  }

  return NextResponse.json({ ok: true, doubleOptInSent });
}
