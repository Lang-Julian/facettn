'use client';

// E-mail gate AFTER the last question, BEFORE the full result (Dev-Spec §4/§10 C1):
// blur teaser with archetype name + radar silhouette, granular consents b/c/d, and
// — in EVERY variant, no dark pattern — the secondary "nur hier ansehen" link.

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CONSENTS, CONSENT_TEXT_VERSION, GATE_HEADLINE, GATE_SKIP_LABEL, GATE_SUB } from '@/lib/content/copy';
import { track } from '@/lib/analytics';
import { radarPolygonPoints, radarGridPoints } from '@/lib/radar';
import CrisisBanner from './CrisisBanner';

interface Teaser {
  archetypeNameDe: string;
  archetypeNameEn: string;
  radar: number[];
  crisis: boolean;
}

export default function EmailGate() {
  const router = useRouter();
  const params = useSearchParams();
  const token = params.get('t') ?? '';
  const sessionId = params.get('s') ?? '';

  const [teaser, setTeaser] = useState<Teaser | null>(null);
  const [email, setEmail] = useState('');
  const [consentB, setConsentB] = useState(true);
  const [consentC, setConsentC] = useState(false);
  const [consentD, setConsentD] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    track('gate_viewed');
    if (!token) return;
    fetch(`/api/result/${token}?teaser=1`)
      .then((r) => (r.ok ? r.json() : null))
      .then((t: Teaser | null) => setTeaser(t))
      .catch(() => {});
  }, [token]);

  async function submit(withEmail: boolean) {
    setBusy(true);
    setError(null);
    try {
      const consents = [
        { type: 'b' as const, granted: withEmail && consentB, textVersion: CONSENT_TEXT_VERSION },
        { type: 'c' as const, granted: withEmail && consentC, textVersion: CONSENT_TEXT_VERSION },
        { type: 'd' as const, granted: consentD, textVersion: CONSENT_TEXT_VERSION },
      ];
      const res = await fetch('/api/email-gate', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          email: withEmail && email ? email : undefined,
          resultToken: token,
          consents,
        }),
      });
      if (!res.ok && res.status !== 401) throw new Error(`status ${res.status}`);
      track(withEmail ? 'email_submitted' : 'gate_skipped');
      router.push(`/ergebnis/${token}`);
    } catch {
      setError('Das hat nicht geklappt — du kommst trotzdem direkt zu deinem Ergebnis.');
      setBusy(false);
    }
  }

  if (!token) {
    return (
      <div className="card">
        <h1>Kein Ergebnis gefunden</h1>
        <p>
          Starte den Test neu — deine Antworten werden unterwegs automatisch gesichert.
        </p>
        <a className="btn" href="/test">Zum Test</a>
      </div>
    );
  }

  const size = 220;

  return (
    <div>
      {teaser?.crisis ? <CrisisBanner /> : null}

      <div className="blur-teaser card" aria-hidden>
        <div className="blurred" style={{ display: 'flex', justifyContent: 'center', padding: 12 }}>
          <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
            {[100, 66, 33].map((lvl) => (
              <polygon
                key={lvl}
                points={radarGridPoints(size / 2, size / 2, ((size / 2 - 10) * lvl) / 100, teaser?.radar.length ?? 10)}
                fill="none"
                stroke="#c7c3dd"
              />
            ))}
            <polygon
              points={radarPolygonPoints(teaser?.radar ?? Array(10).fill(50), size / 2, size / 2, size / 2 - 10)}
              fill="rgba(79,70,229,0.35)"
              stroke="#4f46e5"
              strokeWidth={2}
            />
          </svg>
        </div>
        <div className="teaser-overlay">
          <p style={{ margin: 0, color: 'var(--ink-soft)' }}>Dein Archetyp:</p>
          <h2 style={{ margin: '4px 0' }}>{teaser?.archetypeNameDe ?? '…'}</h2>
          <p style={{ margin: 0, color: 'var(--accent)' }}>{teaser?.archetypeNameEn ?? ''}</p>
        </div>
      </div>

      <div className="card">
        <h1 style={{ fontSize: '1.4rem' }}>{GATE_HEADLINE}</h1>
        <p>{GATE_SUB}</p>
        <label htmlFor="gate-email" style={{ fontWeight: 600, fontSize: '0.95rem' }}>
          Deine E-Mail
        </label>
        <input
          id="gate-email"
          type="email"
          autoComplete="email"
          inputMode="email"
          placeholder="du@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <label className="consent-row">
          <input type="checkbox" checked={consentB} onChange={(e) => setConsentB(e.target.checked)} />
          <span>{CONSENTS.b}</span>
        </label>
        <label className="consent-row">
          <input type="checkbox" checked={consentC} onChange={(e) => setConsentC(e.target.checked)} />
          <span>{CONSENTS.c}</span>
        </label>
        <label className="consent-row">
          <input type="checkbox" checked={consentD} onChange={(e) => setConsentD(e.target.checked)} />
          <span>{CONSENTS.d}</span>
        </label>
        {error ? <p role="alert" style={{ color: 'var(--danger)' }}>{error}</p> : null}
        <button
          className="btn"
          disabled={busy || !email || !(consentB || consentC)}
          onClick={() => void submit(true)}
        >
          {busy ? 'Einen Moment …' : 'Ergebnis freischalten & senden'}
        </button>
        <div style={{ textAlign: 'center' }}>
          <button className="link-quiet" disabled={busy} onClick={() => void submit(false)}>
            {GATE_SKIP_LABEL}
          </button>
        </div>
      </div>
    </div>
  );
}
