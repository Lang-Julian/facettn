// Result page — the 8 sections (Dev-Spec §4/§5): archetype reveal, radar, dimension
// deep-dives, overlap explanations, myths/facts (inside deep-dives), tips, resources,
// share/compare CTA. Crisis banner is rendered ABOVE everything when triggered.

import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getStore } from '@/lib/store';
import { ARCHETYPE_BY_ID } from '@/lib/seed/archetypes';
import { SCALE_LABELS } from '@/lib/seed/scales';
import { DIMENSIONS, OVERLAPS, RADAR_SCALES, radarValues } from '@/lib/content/dimensions';
import { DISCLAIMER_RESULT, VALIDITY_NOTES } from '@/lib/content/copy';
import CrisisBanner from '@/components/CrisisBanner';
import ResultRadar from '@/components/ResultRadar';
import ScoreBar from '@/components/ScoreBar';
import ShareSheet from '@/components/ShareSheet';

export const dynamic = 'force-dynamic';

export async function generateMetadata(props: { params: Promise<{ token: string }> }): Promise<Metadata> {
  const { token } = await props.params;
  return {
    title: 'Dein Ergebnis',
    robots: { index: false }, // personal result pages are never indexed
    openGraph: { images: [`/api/og/${token}`] },
  };
}

export default async function ResultPage(props: { params: Promise<{ token: string }> }) {
  const { token } = await props.params;
  if (!/^[a-f0-9]{32}$/.test(token)) notFound();

  const found = await getStore().getResultByToken(token);
  if (!found) notFound();
  if (found.expired) {
    return (
      <main>
        <div className="card" style={{ textAlign: 'center' }}>
          <h1>Dieser Link ist abgelaufen</h1>
          <p>Ergebnis-Links sind 90 Tage gültig. Mach den Test einfach neu — er entwickelt sich weiter.</p>
          <Link className="btn" href="/test">Test neu starten</Link>
        </div>
      </main>
    );
  }

  const { result } = found;
  const archetype = ARCHETYPE_BY_ID.get(result.archetypeId);
  const radarData = RADAR_SCALES.map((s, i) => ({
    axis: s.short,
    value: radarValues(result.scores)[i],
  }));

  const validityMessages = (
    Object.entries(VALIDITY_NOTES) as [keyof typeof VALIDITY_NOTES, string][]
  )
    .filter(([key]) => result.validity?.[key])
    .map(([, msg]) => msg);

  return (
    <main>
      {result.crisis ? <CrisisBanner /> : null}

      {validityMessages.length > 0 ? (
        <div className="validity-banner" role="status">
          {validityMessages.map((m) => (
            <p key={m.slice(0, 20)} style={{ margin: '2px 0' }}>{m}</p>
          ))}
        </div>
      ) : null}

      {/* 1 — Archetype reveal */}
      <section className="archetype-hero">
        <span className="kicker">Dein Archetyp</span>
        <h1>{archetype?.nameDe}</h1>
        <div className="en">{archetype?.nameEn}</div>
        <p className="hook">{archetype?.descriptionDe}</p>
        <div className="rule-sm" aria-hidden />
      </section>

      <div className="card">
        <h2 style={{ marginTop: 0 }}>Deine Stärken</h2>
        <ul className="pill-list">
          {archetype?.strengths.map((s) => <li key={s}>{s}</li>)}
        </ul>
        <h3>Wachstumsfelder</h3>
        <ul>
          {archetype?.growthAreas.map((g) => <li key={g}>{g}</li>)}
        </ul>
      </div>

      {/* 2 — Radar */}
      <div className="card">
        <h2 style={{ marginTop: 0 }}>Dein Gesamtprofil</h2>
        <ResultRadar data={radarData} />
        <p style={{ fontSize: '0.85rem', color: 'var(--ink-soft)' }}>
          Werte 0–100 je Dimension. Kein Wert ist „gut“ oder „schlecht“ — das Muster zählt.
        </p>
      </div>

      {/* 3 — Dimension deep-dives (myths, tips, resources inside) */}
      <h2>Deine Dimensionen im Detail</h2>
      {DIMENSIONS.map((dim) => (
        <details className="dim" key={dim.key}>
          <summary>{dim.title}</summary>
          <div className="dim-body">
            {dim.scaleIds.map((id) => (
              <ScoreBar
                key={id}
                label={SCALE_LABELS[id] ?? id}
                score={result.scores[id] ?? 0}
                band={result.bands[id]}
                percentile={
                  // Show percentile context only where real published norms exist.
                  id.startsWith('big5_') ? result.percentiles[id] : undefined
                }
              />
            ))}
            <p>{dim.explanation}</p>
            {dim.strengths.length > 0 ? (
              <>
                <h3>Stärken zuerst</h3>
                <ul className="pill-list">
                  {dim.strengths.map((s) => <li key={s}>{s}</li>)}
                </ul>
              </>
            ) : null}
            {dim.means ? (
              <p>
                <strong>Was das bedeutet:</strong> {dim.means}
                <br />
                <strong>Was das NICHT bedeutet:</strong> {dim.meansNot}
              </p>
            ) : null}
            {dim.myths?.map((m) => (
              <div className="myth-card" key={m.myth.slice(0, 20)}>
                <div className="m">Mythos: „{m.myth}“</div>
                <div className="f">Fakt: {m.fact}</div>
              </div>
            ))}
            {dim.tips && dim.tips.length > 0 ? (
              <>
                <h3>Alltagstipps</h3>
                <ul>{dim.tips.map((t) => <li key={t.slice(0, 20)}>{t}</li>)}</ul>
              </>
            ) : null}
            {dim.resources ? (
              <p style={{ fontSize: '0.9rem', color: 'var(--ink-soft)' }}>
                <strong>Ressourcen:</strong> {dim.resources}
              </p>
            ) : null}
          </div>
        </details>
      ))}

      {/* 4 — Overlap explanations */}
      <h2>Warum sich Dimensionen überlappen</h2>
      {OVERLAPS.map((o) => (
        <div className="card" key={o.title}>
          <h3 style={{ marginTop: 0 }}>{o.title}</h3>
          <p>{o.text}</p>
        </div>
      ))}

      {/* 8 — Share & compare */}
      <ShareSheet token={token} archetypeName={archetype?.nameDe ?? 'Facettn'} />

      <p style={{ fontSize: '0.9rem', color: 'var(--ink-soft)' }}>{DISCLAIMER_RESULT}</p>
    </main>
  );
}
