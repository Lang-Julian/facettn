'use client';

// Comparison without a server and without a consent database: both results arrive
// as links, both are decoded locally, the match is computed in the browser. Consent
// is not a checkbox here — it is the act of handing someone your link.

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { buildProfile } from '@/lib/profile';
import { decodePayload, extractPayload } from '@/lib/share/payload';
import { buildMatchInsights, type MatchInsights } from '@/lib/match';
import ResultRadar from './ResultRadar';
import { sitePath } from '@/lib/urls';

export default function CompareView() {
  const [ownPayload, setOwnPayload] = useState<string | null>(null);
  const [otherInput, setOtherInput] = useState('');
  const [otherPayload, setOtherPayload] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const hash = window.location.hash.replace(/^#/, '');
    if (hash) setOwnPayload(hash);
  }, []);

  const insights: MatchInsights | null = useMemo(() => {
    if (!ownPayload || !otherPayload) return null;
    try {
      const a = buildProfile(decodePayload(ownPayload).answers);
      const b = buildProfile(decodePayload(otherPayload).answers);
      return buildMatchInsights(a, b);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Der Vergleich hat nicht geklappt.');
      return null;
    }
  }, [ownPayload, otherPayload]);

  function submit() {
    setError(null);
    const extracted = extractPayload(otherInput);
    if (!extracted) {
      setError('Das sieht nicht nach einem Facettn-Ergebnis-Link aus. Er enthält ein #-Zeichen, gefolgt von „v3.“ und einer langen Ziffernfolge.');
      return;
    }
    if (extracted === ownPayload) {
      setError('Das ist dein eigener Link — du brauchst den einer anderen Person.');
      return;
    }
    setOtherPayload(extracted);
  }

  if (!ownPayload) {
    return (
      <div className="card">
        <h1>Profile vergleichen</h1>
        <p>
          Für einen Vergleich brauchst du zuerst dein eigenes Ergebnis. Öffne deinen
          Ergebnis-Link und wähle dort „Mit jemandem vergleichen“ — oder mach den Test.
        </p>
        <Link className="btn" href="/test">Test starten</Link>
      </div>
    );
  }

  if (!insights) {
    return (
      <div>
        <h1>Profile vergleichen</h1>
        <div className="card">
          <p>
            Füge den Ergebnis-Link der anderen Person ein. Beide Profile werden{' '}
            <strong>in deinem Browser</strong> verglichen — die Daten gehen nirgendwohin.
          </p>
          <label htmlFor="other-link">Ergebnis-Link der anderen Person</label>
          <input
            id="other-link"
            type="text"
            value={otherInput}
            onChange={(e) => setOtherInput(e.target.value)}
            placeholder="https://…/ergebnis/#v3.43125…"
          />
          {error ? <p role="alert" style={{ color: 'var(--danger)' }}>{error}</p> : null}
          <button className="btn" style={{ marginTop: 12 }} disabled={!otherInput.trim()} onClick={submit}>
            Vergleichen
          </button>
          <p className="inset-note" style={{ marginTop: 18 }}>
            Eine Einwilligung musst du hier nicht anklicken: Wer seinen Link weitergibt,
            entscheidet damit selbst. Ohne Link kein Vergleich.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1>Euer Vergleich</h1>

      <div className="card" style={{ textAlign: 'center' }}>
        <span className="kicker">Passungs-Einschätzung</span>
        <div className="match-total">{insights.total} %</div>
        <p style={{ fontSize: '0.9rem', color: 'var(--ink-soft)', margin: '4px 0 0' }}>
          Das ist <strong>kein Ähnlichkeitswert</strong>. Nur zwei der fünf Bestandteile
          vergleichen euch miteinander; die anderen drei bewerten Eigenschaften, die die
          Forschung unabhängig von Ähnlichkeit mit Beziehungszufriedenheit verknüpft —
          gemeinsame Gelassenheit, Verträglichkeit und Bindungspassung.
        </p>
        <p style={{ fontSize: '0.9rem', color: 'var(--ink-soft)' }}>
          Deshalb kann ein sehr ähnliches Paar niedriger liegen als ein ungleiches: Zwei
          Menschen mit demselben unsicheren Bindungsmuster haben es real schwerer als zwei
          verschiedene, von denen einer sicher gebunden ist. Die Aufschlüsselung unten zeigt,
          woher der Wert kommt.
        </p>
        <p style={{ fontSize: '0.9rem', color: 'var(--ink-faint)', marginBottom: 0 }}>
          Eine Orientierung, keine Prognose. Die Forschung zu Partnerpassung findet reale,
          aber kleine Effekte — kein Algorithmus ersetzt echtes Kennenlernen.
        </p>
      </div>

      <div className="card">
        <h2 style={{ marginTop: 0 }}>Eure Profile übereinander</h2>
        <ResultRadar
          data={insights.overlay.map((o) => ({ axis: o.axis, value: o.a, compare: o.b }))}
          compareLabel="Anderes Profil"
        />
      </div>

      <div className="card">
        <h2 style={{ marginTop: 0 }}>Woraus sich der Wert zusammensetzt</h2>
        <ul className="tight-list">
          {insights.breakdown.map((b) => (
            <li key={b.label}>
              <strong>{b.label}:</strong> {b.value} von 100 — {b.note}
            </li>
          ))}
        </ul>
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
            <div key={f.point.slice(0, 24)} style={{ marginBottom: 16 }}>
              <p style={{ margin: '4px 0', fontWeight: 600 }}>{f.point}</p>
              <p style={{ margin: 0, color: 'var(--ink-soft)' }}>{f.tip}</p>
            </div>
          ))}
        </div>
      ) : null}

      <div style={{ textAlign: 'center', marginTop: 24 }}>
        <a className="link-quiet" href={`${sitePath('/ergebnis')}#${ownPayload}`}>← Zurück zu deinem Ergebnis</a>
      </div>
    </div>
  );
}
