'use client';

// Match/compare (Epic F2): both tokens required, server enforces mutual consent (d).
// Output: total %, shared strengths, friction points with tips, overlay radar.
// Honest framing: orientation, not prognosis.

import { useState } from 'react';
import { track } from '@/lib/analytics';
import ResultRadar from './ResultRadar';

interface MatchInsights {
  total: number;
  sharedStrengths: string[];
  frictions: { point: string; tip: string }[];
  overlay: { axis: string; a: number; b: number }[];
}

export default function CompareView({ ownToken }: { ownToken: string }) {
  const [otherToken, setOtherToken] = useState('');
  const [insights, setInsights] = useState<MatchInsights | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function compare() {
    setBusy(true);
    setError(null);
    try {
      const cleaned = otherToken.trim().split('/').pop() ?? '';
      const res = await fetch('/api/match', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ tokenA: ownToken, tokenB: cleaned }),
      });
      if (res.status === 403) {
        setError(
          'Beide Profile müssen dem Vergleich ausdrücklich zugestimmt haben (Einwilligung „Matching“). ' +
            'Die Zustimmung kann beim Abschluss des Tests gegeben werden.',
        );
        return;
      }
      if (res.status === 404) {
        setError('Dieses Profil wurde nicht gefunden. Prüfe den Link oder Code.');
        return;
      }
      if (res.status === 410) {
        setError('Eines der Profile ist abgelaufen (Links gelten 90 Tage).');
        return;
      }
      if (!res.ok) throw new Error(`status ${res.status}`);
      const data = (await res.json()) as MatchInsights;
      setInsights(data);
      track('match_completed');
    } catch {
      setError('Der Vergleich hat nicht geklappt. Bitte versuche es erneut.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <h1>Profile vergleichen</h1>
      {!insights ? (
        <div className="card">
          <p>
            Füge den Ergebnis-Link (oder Code) der anderen Person ein. Der Vergleich funktioniert
            nur, wenn <strong>beide</strong> beim Test dem Matching zugestimmt haben.
          </p>
          <label htmlFor="other-token" style={{ fontWeight: 600, fontSize: '0.95rem' }}>
            Link oder Code des anderen Profils
          </label>
          <input
            id="other-token"
            type="text"
            value={otherToken}
            onChange={(e) => setOtherToken(e.target.value)}
            placeholder="https://…/ergebnis/abc123…"
          />
          {error ? <p role="alert" style={{ color: 'var(--danger)' }}>{error}</p> : null}
          <button className="btn" style={{ marginTop: 12 }} disabled={busy || !otherToken.trim()} onClick={compare}>
            {busy ? 'Vergleiche …' : 'Vergleichen'}
          </button>
        </div>
      ) : (
        <>
          <div className="card" style={{ textAlign: 'center' }}>
            <p style={{ margin: 0, color: 'var(--ink-soft)' }}>Euer Match</p>
            <div className="match-total">{insights.total} %</div>
            <p style={{ fontSize: '0.9rem', color: 'var(--ink-soft)' }}>
              Eine unterhaltsame Orientierung, keine Prognose. Kein Algorithmus ersetzt echtes Kennenlernen.
            </p>
          </div>
          <div className="card">
            <h2 style={{ marginTop: 0 }}>Eure Profile übereinander</h2>
            <ResultRadar
              data={insights.overlay.map((o) => ({ axis: o.axis, value: o.a, compare: o.b }))}
              compareLabel="Anderes Profil"
            />
          </div>
          {insights.sharedStrengths.length > 0 ? (
            <div className="card">
              <h2 style={{ marginTop: 0 }}>Gemeinsame Stärken</h2>
              <ul className="pill-list">
                {insights.sharedStrengths.map((s) => <li key={s}>{s}</li>)}
              </ul>
            </div>
          ) : null}
          {insights.frictions.length > 0 ? (
            <div className="card">
              <h2 style={{ marginTop: 0 }}>Mögliche Reibungspunkte</h2>
              {insights.frictions.map((f) => (
                <div key={f.point.slice(0, 24)} style={{ marginBottom: 12 }}>
                  <p style={{ margin: '4px 0', fontWeight: 600 }}>{f.point}</p>
                  <p style={{ margin: 0, color: 'var(--ink-soft)' }}>💡 {f.tip}</p>
                </div>
              ))}
            </div>
          ) : null}
        </>
      )}
    </div>
  );
}
