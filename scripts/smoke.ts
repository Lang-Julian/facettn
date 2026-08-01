// End-to-end API smoke test against a running server (npm start).
// Covers: session start (consent a), batch autosave, idempotent complete, result,
// teaser, OG image, crisis guardrail path, match consent enforcement, GDPR delete.
// Usage: BASE=http://localhost:3100 npx tsx scripts/smoke.ts

import { ITEMS } from '../src/lib/seed/items';

const BASE = process.env.BASE ?? 'http://localhost:3100';
let failures = 0;

function check(name: string, cond: boolean, detail = '') {
  if (cond) console.log(`  ✓ ${name}`);
  else {
    console.error(`  ✗ ${name} ${detail}`);
    failures++;
  }
}

interface Session {
  sessionId: string;
  cookie: string;
}

async function startSession(): Promise<Session> {
  const res = await fetch(`${BASE}/api/session`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ consentA: true, textVersion: 'v1-2026-08' }),
  });
  const cookie = res.headers.get('set-cookie')?.split(';')[0] ?? '';
  const { sessionId } = (await res.json()) as { sessionId: string };
  return { sessionId, cookie };
}

async function answerAll(s: Session, opts: { wellbeing?: boolean; phq9Item9?: number } = {}) {
  const items = ITEMS.filter((i) => (opts.wellbeing ? true : i.module === 'core'));
  const responses = items.map((i) => {
    if (i.isAttentionCheck) return { itemId: i.id, value: i.expectedValue!, responseTimeMs: 2100 };
    if (i.module === 'wellbeing') {
      const value = i.id === 'phq09' ? (opts.phq9Item9 ?? 0) : 1;
      return { itemId: i.id, value, responseTimeMs: 1800 };
    }
    // Varied answers to avoid the straightlining flag.
    const value = (i.position % 4) + 1;
    return { itemId: i.id, value, responseTimeMs: 1500 + (i.position % 7) * 300 };
  });
  for (let off = 0; off < responses.length; off += 20) {
    const res = await fetch(`${BASE}/api/session/${s.sessionId}/responses`, {
      method: 'PATCH',
      headers: { 'content-type': 'application/json', cookie: s.cookie },
      body: JSON.stringify({ responses: responses.slice(off, off + 20) }),
    });
    if (!res.ok) throw new Error(`batch save failed: ${res.status} ${await res.text()}`);
  }
}

async function complete(s: Session): Promise<{ token: string; crisis: boolean; status: number }> {
  const res = await fetch(`${BASE}/api/session/${s.sessionId}/complete`, {
    method: 'POST',
    headers: { cookie: s.cookie },
  });
  const body = res.ok ? await res.json() : {};
  return { ...(body as { token: string; crisis: boolean }), status: res.status };
}

async function gate(s: Session, token: string, consentD: boolean) {
  const res = await fetch(`${BASE}/api/email-gate`, {
    method: 'POST',
    headers: { 'content-type': 'application/json', cookie: s.cookie },
    body: JSON.stringify({
      sessionId: s.sessionId,
      resultToken: token,
      consents: [
        { type: 'b', granted: false, textVersion: 'v1-2026-08' },
        { type: 'c', granted: false, textVersion: 'v1-2026-08' },
        { type: 'd', granted: consentD, textVersion: 'v1-2026-08' },
      ],
    }),
  });
  return res.status;
}

async function main() {
  console.log(`Smoke test against ${BASE}\n`);

  console.log('1. Happy path (core only)');
  const s1 = await startSession();
  check('session created', /^[0-9a-f-]{36}$/.test(s1.sessionId));
  check('signed cookie set', s1.cookie.includes('ftn_sid='));

  const early = await complete(s1);
  check('complete before answers -> 400 incomplete', early.status === 400);

  await answerAll(s1);
  const c1 = await complete(s1);
  check('complete -> token', c1.status === 200 && /^[a-f0-9]{32}$/.test(c1.token));
  check('no crisis without wellbeing', c1.crisis === false);

  const c1again = await complete(s1);
  check('complete is idempotent (same token)', c1again.token === c1.token);

  const result = await fetch(`${BASE}/api/result/${c1.token}`).then((r) => r.json());
  check('result has archetype', !!result.archetype?.nameDe, JSON.stringify(result).slice(0, 120));
  check('result has 10 radar axes', result.radarAxes?.length === 10);
  check(
    'scores within 0..100',
    Object.entries(result.scores as Record<string, number>)
      .filter(([k]) => !['phq9', 'gad7'].includes(k))
      .every(([, v]) => v >= 0 && v <= 100),
  );
  check('validity flags clean', result.validity?.attentionFail === false);

  const teaser = await fetch(`${BASE}/api/result/${c1.token}?teaser=1`).then((r) => r.json());
  check('teaser has archetype + coarse radar', !!teaser.archetypeNameDe && teaser.radar?.length === 10);
  check('teaser radar is coarse (steps of 5)', (teaser.radar as number[]).every((v) => v % 5 === 0));

  const og = await fetch(`${BASE}/api/og/${c1.token}`);
  check('OG image renders', og.ok && (og.headers.get('content-type') ?? '').startsWith('image/'));
  const story = await fetch(`${BASE}/api/og/${c1.token}?format=story`);
  check('story image renders', story.ok);

  const bad = await fetch(`${BASE}/api/result/${'0'.repeat(32)}`);
  check('unknown token -> 404', bad.status === 404);

  console.log('\n2. Crisis guardrail (wellbeing, PHQ-9 item 9 > 0)');
  const s2 = await startSession();
  await answerAll(s2, { wellbeing: true, phq9Item9: 2 });
  const c2 = await complete(s2);
  check('crisis flag set', c2.crisis === true);
  const teaser2 = await fetch(`${BASE}/api/result/${c2.token}?teaser=1`).then((r) => r.json());
  check('crisis visible in teaser (gate shows banner)', teaser2.crisis === true);

  console.log('\n3. Match consent enforcement');
  const gate1 = await gate(s1, c1.token, true);
  check('gate accepts consents', gate1 === 200);
  const noConsent = await fetch(`${BASE}/api/match`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ tokenA: c1.token, tokenB: c2.token }),
  });
  check('match without mutual consent -> 403', noConsent.status === 403);

  await gate(s2, c2.token, true);
  const match = await fetch(`${BASE}/api/match`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ tokenA: c1.token, tokenB: c2.token }),
  });
  const matchBody = (await match.json()) as { total: number; overlay: unknown[] };
  check('match with mutual consent -> 200', match.status === 200);
  check('match total 0..100', matchBody.total >= 0 && matchBody.total <= 100);
  check('overlay has 10 axes', matchBody.overlay?.length === 10);

  console.log('\n4. Auth boundaries');
  const stolen = await fetch(`${BASE}/api/session/${s1.sessionId}/responses`, {
    method: 'PATCH',
    headers: { 'content-type': 'application/json' }, // no cookie
    body: JSON.stringify({ responses: [{ itemId: 'i01', value: 5, responseTimeMs: 1000 }] }),
  });
  check('responses without cookie -> 401', stolen.status === 401);

  console.log('\n5. GDPR delete');
  const del = await fetch(`${BASE}/api/me`, {
    method: 'DELETE',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ token: c2.token }),
  });
  check('delete by token -> 200', del.status === 200);
  const gone = await fetch(`${BASE}/api/result/${c2.token}`);
  check('deleted result -> 404', gone.status === 404);

  console.log(failures === 0 ? '\nAll smoke checks passed ✓' : `\n${failures} CHECKS FAILED ✗`);
  process.exit(failures === 0 ? 0 : 1);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
