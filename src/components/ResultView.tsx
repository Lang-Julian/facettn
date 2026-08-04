'use client';

// The evaluation. Reads the answers out of the URL fragment, scores them in the
// browser and renders the full report — no server round-trip, no gate, no e-mail.

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { buildProfile, type Profile } from '@/lib/profile';
import { decodePayload, stripWellbeing } from '@/lib/share/payload';
import { DISCLAIMER_RESULT, PRIVACY_PROMISE, VALIDITY_NOTES } from '@/lib/content/copy';
import { DIMENSIONS, OVERLAPS, RADAR_SCALES, radarValues } from '@/lib/content/dimensions';
import { SCALE_BY_ID, SCALES } from '@/lib/seed/scales';
import { PAYLOAD_ORDER_CORE } from '@/lib/seed/items';
import { REFERENCES } from '@/lib/content/references';
import CrisisBanner from './CrisisBanner';
import ReportToolbar from './ReportToolbar';
import ResultRadar from './ResultRadar';
import ScoreBar from './ScoreBar';
import ShareSheet from './ShareSheet';

const reportedScaleCount = SCALES.filter(
  (s) => s.dimensionGroup !== 'validity' && s.dimensionGroup !== 'wellbeing',
).length;

const BAND_COPY: Record<string, string> = {
  gering: 'gering ausgeprägt',
  moderat: 'moderat ausgeprägt',
  deutlich: 'deutlich ausgeprägt',
  stark: 'stark ausgeprägt',
};

export default function ResultView() {
  const [payload, setPayload] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const read = () => {
      const hash = window.location.hash.replace(/^#/, '');
      if (!hash) {
        setError('Dieser Link enthält kein Ergebnis.');
        setPayload(null);
        return;
      }
      setPayload(hash);
      setError(null);
    };
    read();
    window.addEventListener('hashchange', read);
    return () => window.removeEventListener('hashchange', read);
  }, []);

  const profile: Profile | null = useMemo(() => {
    if (!payload) return null;
    try {
      const { answers } = decodePayload(payload);
      return buildProfile(answers);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Der Link konnte nicht gelesen werden.');
      return null;
    }
  }, [payload]);

  if (error || !profile) {
    return (
      <div className="card" style={{ textAlign: 'center' }}>
        <h1>Kein Ergebnis in diesem Link</h1>
        <p style={{ color: 'var(--ink-soft)' }}>
          {error ?? 'Der Link scheint unvollständig zu sein.'} Da nichts gespeichert wird, lässt
          sich ein verlorenes Ergebnis leider nicht wiederherstellen — dafür weiß auch niemand
          sonst davon.
        </p>
        <div style={{ maxWidth: 320, margin: '18px auto 0' }}>
          <Link className="btn" href="/test">Test starten</Link>
        </div>
      </div>
    );
  }

  const { scores, percentiles, bands, validity, archetype, patterns, wellbeing } = profile;
  const radarData = RADAR_SCALES.map((s, i) => ({
    axis: s.short,
    value: radarValues(scores)[i],
  }));

  const validityMessages = (
    Object.entries(VALIDITY_NOTES) as [keyof typeof VALIDITY_NOTES, string][]
  )
    .filter(([key]) => validity[key])
    .map(([, msg]) => msg);

  const shareLink = stripWellbeing(payload ?? '');

  // Highest and lowest reported domains, for the "kurz gesagt" summary.
  const domainIds = RADAR_SCALES.map((s) => s.id).filter((id) => id !== 'dark');
  const ranked = domainIds
    .map((id) => ({ id, v: scores[id] ?? 0, label: RADAR_SCALES.find((r) => r.id === id)!.label }))
    .sort((a, b) => b.v - a.v);

  return (
    <>
      {profile.crisis ? <CrisisBanner /> : null}

      <header className="report-head">
        <div>
          <span className="kicker">Persönlichkeitsprofil</span>
          <p className="report-meta">
            {PAYLOAD_ORDER_CORE.length} beantwortete Fragen · {reportedScaleCount} ausgewertete Skalen
            {wellbeing ? ' · inkl. Wohlbefindens-Modul' : ''}
          </p>
        </div>
        <p className="report-meta report-meta-right">
          Kein Datensatz angelegt.<br />Berechnet in deinem Browser.
        </p>
      </header>

      <section className="archetype-hero">
        <span className="kicker">Dein Archetyp</span>
        <h1>{archetype.nameDe}</h1>
        <div className="en">{archetype.nameEn}</div>
        <p className="hook">{archetype.descriptionDe}</p>
        <div className="rule-sm" aria-hidden />
      </section>

      <div className="card">
        <h2 style={{ marginTop: 0 }}><span className="sec-num">01</span>Kurz gesagt</h2>
        <p>
          Am stärksten ausgeprägt ist bei dir <strong>{ranked[0].label}</strong>, am schwächsten{' '}
          <strong>{ranked[ranked.length - 1].label}</strong>.{' '}
          {patterns.length > 0
            ? `Interessanter als die Einzelwerte sind allerdings ${patterns.length === 1 ? 'das Muster' : `die ${patterns.length} Muster`}, ${patterns.length === 1 ? 'das' : 'die'} sich aus ihrer Kombination ergeben — weiter unten im Abschnitt „Was in deinem Profil zusammenspielt“.`
            : 'Dein Profil ist vergleichsweise ausgeglichen — es gibt keine ausgeprägten Wechselwirkungen zwischen den Dimensionen.'}
        </p>
        <div className="strength-grid">
          <div>
            <h3>Stärken</h3>
            <ul className="pill-list">
              {archetype.strengths.map((s) => <li key={s}>{s}</li>)}
            </ul>
          </div>
          <div>
            <h3>Wachstumsfelder</h3>
            <ul className="tight-list">
              {archetype.growthAreas.map((g) => <li key={g}>{g}</li>)}
            </ul>
          </div>
        </div>
      </div>

      {validityMessages.length > 0 ? (
        <div className="validity-banner" role="status">
          <strong style={{ display: 'block', marginBottom: 4 }}>Zur Einordnung</strong>
          {validityMessages.map((m) => (
            <p key={m.slice(0, 20)} style={{ margin: '2px 0' }}>{m}</p>
          ))}
        </div>
      ) : null}

      <ReportToolbar />

      <div className="card">
        <h2 style={{ marginTop: 0 }}><span className="sec-num">02</span>Gesamtprofil</h2>
        <ResultRadar data={radarData} />
        <p style={{ fontSize: '0.85rem', color: 'var(--ink-faint)', marginTop: 4 }}>
          Werte von 0 bis 100 je Dimension. Kein Wert ist „gut“ oder „schlecht“ — das Muster zählt.
        </p>
      </div>

      {patterns.length > 0 ? (
        <section>
          <h2><span className="sec-num">03</span>Was in deinem Profil zusammenspielt</h2>
          <p style={{ color: 'var(--ink-soft)', marginTop: 0 }}>
            Diese Beobachtungen entstehen aus Kombinationen mehrerer Skalen — sie sind der Teil,
            den eine reine Werteliste nicht zeigen kann.
          </p>
          {patterns.map((p) => (
            <article className="card pattern" key={p.id}>
              <h3 className="pattern-title">{p.title}</h3>
              <p className="pattern-lede">{p.lede}</p>
              <p>{p.body}</p>
              <p className="pattern-sowhat">
                <strong>Was das praktisch heißt:</strong> {p.soWhat}
              </p>
            </article>
          ))}
        </section>
      ) : null}

      <section>
        <h2><span className="sec-num">04</span>Alle Dimensionen im Detail</h2>
        <p style={{ color: 'var(--ink-soft)', marginTop: 0 }}>
          Unter jeder Dimension stehen ihre Facetten. Dort wird sichtbar, was ein Gesamtwert
          verschluckt — zwei Menschen mit derselben Zahl können völlig verschieden aussehen.
        </p>

        {DIMENSIONS.map((dim) => {
          const domainScore = dim.domainId ? scores[dim.domainId] : undefined;
          const domainBand = dim.domainId ? bands[dim.domainId] : undefined;
          const showLowNote = dim.lowNote && domainScore !== undefined && domainScore < 40;

          return (
            <details className="dim" key={dim.key}>
              <summary>
                <span>
                  {dim.title}
                  {domainScore !== undefined && domainBand ? (
                    <span className="summary-band">{BAND_COPY[domainBand]}</span>
                  ) : null}
                </span>
              </summary>
              <div className="dim-body">
                <p className="standfirst">{dim.standfirst}</p>

                {dim.domainId ? (
                  <ScoreBar
                    label={SCALE_BY_ID.get(dim.domainId)?.nameDe ?? dim.title}
                    score={scores[dim.domainId] ?? 0}
                    band={bands[dim.domainId]}
                    percentile={percentiles[dim.domainId]}
                    showPercentile={!!SCALE_BY_ID.get(dim.domainId)?.normSource}
                    emphasis
                  />
                ) : null}

                <div className="facet-block">
                  {dim.domainId ? <h3>Facetten</h3> : null}
                  {dim.scaleIds.map((id) => (
                    <ScoreBar
                      key={id}
                      label={SCALE_BY_ID.get(id)?.nameDe ?? id}
                      blurb={SCALE_BY_ID.get(id)?.blurb}
                      score={scores[id] ?? 0}
                      band={bands[id]}
                    />
                  ))}
                </div>

                <p>{dim.explanation}</p>

                {showLowNote ? (
                  <p className="inset-note">
                    <strong>Bei niedrigen Werten:</strong> {dim.lowNote}
                  </p>
                ) : null}

                {dim.strengths && dim.strengths.length > 0 ? (
                  <>
                    <h3>Stärken dieser Dimension</h3>
                    <ul className="pill-list">
                      {dim.strengths.map((s) => <li key={s}>{s}</li>)}
                    </ul>
                  </>
                ) : null}

                {dim.means ? (
                  <div className="means-grid">
                    <div>
                      <h3>Bedeutet</h3>
                      <p style={{ margin: 0 }}>{dim.means}</p>
                    </div>
                    <div>
                      <h3>Bedeutet nicht</h3>
                      <p style={{ margin: 0 }}>{dim.meansNot}</p>
                    </div>
                  </div>
                ) : null}

                {dim.myths?.map((m) => (
                  <div className="myth-card" key={m.myth.slice(0, 20)}>
                    <div className="m">Mythos: „{m.myth}“</div>
                    <div className="f">Fakt: {m.fact}</div>
                  </div>
                ))}

                {dim.tips && dim.tips.length > 0 ? (
                  <>
                    <h3>Praktisch</h3>
                    <ul className="tight-list">
                      {dim.tips.map((t) => <li key={t.slice(0, 20)}>{t}</li>)}
                    </ul>
                  </>
                ) : null}

                {dim.resources ? (
                  <p className="inset-note">
                    <strong>Weiterführend:</strong> {dim.resources}
                  </p>
                ) : null}
              </div>
            </details>
          );
        })}
      </section>

      {wellbeing ? (
        <div className="card">
          <h2 style={{ marginTop: 0 }}><span className="sec-num">05</span>Wohlbefinden</h2>
          <p style={{ color: 'var(--ink-soft)', marginTop: 0 }}>
            Diese beiden Werte beschreiben die letzten zwei Wochen — eine Momentaufnahme, keine
            Eigenschaft. Sie sind bewusst <strong>nicht</strong> Teil deines Teilen-Links.
          </p>
          <ScoreBar label="Stimmung (PHQ-9)" score={(wellbeing.phq9Sum / 27) * 100} rawLabel={`${wellbeing.phq9Sum} von 27`} />
          <ScoreBar label="Anspannung (GAD-7)" score={(wellbeing.gad7Sum / 21) * 100} rawLabel={`${wellbeing.gad7Sum} von 21`} />
          <p className="inset-note">
            Diese Fragebögen sind in der Forschung etabliert, hier aber ausdrücklich kein Screening.
            Wenn dich die Werte beunruhigen oder du seit Wochen leidest, ist ein Gespräch mit einer
            Hausärztin oder einer psychotherapeutischen Sprechstunde der nächste sinnvolle Schritt.
          </p>
        </div>
      ) : null}

      <section>
        <h2><span className="sec-num">06</span>Warum sich Dimensionen überlappen</h2>
        {OVERLAPS.map((o) => (
          <div className="card" key={o.title}>
            <h3 style={{ marginTop: 0, textTransform: 'none', letterSpacing: 0, fontSize: '1.05rem', color: 'var(--ink)' }}>
              {o.title}
            </h3>
            <p style={{ marginBottom: 0 }}>{o.text}</p>
          </div>
        ))}
      </section>

      <section>
        <h2><span className="sec-num">07</span>Methode und Quellen</h2>
        <div className="card">
          <p style={{ marginTop: 0 }}>
            Jede Frage zählt mit einem festgelegten Gewicht auf eine oder mehrere Skalen. Die
            Rohwerte werden auf eine Skala von 0 bis 100 normiert; ein Bevölkerungsvergleich wird
            nur dort ausgewiesen, wo veröffentlichte deutsche Normwerte vorliegen — für die übrigen
            Skalen wäre er erfunden. Die Gewichte sind theoriegeleitete Startwerte und noch nicht
            empirisch kalibriert; die eigens formulierten Fragen sind noch nicht validiert. Beides
            steht offen im Quellcode.
          </p>
          <ol className="ref-list">
            {REFERENCES.map((r) => (
              <li key={r.id}>
                <span className="ref-cite">
                  {r.authors} ({r.year}). <em>{r.title}</em>. {r.source}.
                  {r.doi ? (
                    <>
                      {' '}
                      <a href={`https://doi.org/${r.doi}`} rel="noopener noreferrer" target="_blank">
                        doi:{r.doi}
                      </a>
                    </>
                  ) : null}
                </span>
                <span className="ref-use">{r.usedFor}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <ShareSheet payload={payload ?? ''} shareLink={shareLink} archetypeName={archetype.nameDe} hasWellbeing={!!wellbeing} />

      <div className="card promise">
        <h2 style={{ marginTop: 0, fontSize: '1.15rem' }}>{PRIVACY_PROMISE.headline}</h2>
        <ul className="promise-list">
          {PRIVACY_PROMISE.points.map((p) => <li key={p.slice(0, 24)}>{p}</li>)}
        </ul>
        <p style={{ fontSize: '0.88rem', color: 'var(--ink-faint)', marginBottom: 0 }}>
          <Link href="/transparenz">Wie das technisch funktioniert →</Link>
        </p>
      </div>

      <p style={{ fontSize: '0.88rem', color: 'var(--ink-faint)' }}>{DISCLAIMER_RESULT}</p>
    </>
  );
}
