// A single score bar.
//
// Two honesty rules are enforced here rather than left to the caller:
// 1. The displayed number never has more resolution than the scale supports
//    (see lib/precision.ts). A short scale shows a rounded value or none at all.
// 2. Percentile context appears only where real published norms exist. Inventing a
//    population comparison for a scale that has none is exactly the false precision
//    this instrument is trying not to commit.

import { displayValue, precisionNote, resolutionFor } from '@/lib/precision';

const BAND_LABEL: Record<string, string> = {
  gering: 'gering',
  moderat: 'moderat',
  deutlich: 'deutlich',
  stark: 'stark',
};

export default function ScoreBar({
  scaleId,
  label,
  blurb,
  score,
  band,
  percentile,
  showPercentile = false,
  rawLabel,
  emphasis = false,
}: {
  scaleId?: string;
  label: string;
  blurb?: string;
  score: number;
  band?: string;
  percentile?: number;
  showPercentile?: boolean;
  rawLabel?: string;
  emphasis?: boolean;
}) {
  const shown = scaleId ? displayValue(scaleId, score) : Math.round(score);
  const note = scaleId ? precisionNote(scaleId) : null;
  const bandOnly = scaleId ? resolutionFor(scaleId) === 'band' : false;
  const pct = percentile !== undefined ? Math.round(percentile) : undefined;

  return (
    <div className={`score-bar-row${emphasis ? ' emphasis' : ''}`}>
      <div className="score-bar-label">
        <span className="score-bar-name">{label}</span>
        <span className="score-bar-value">
          {rawLabel ?? (shown !== null ? shown : null)}
          {band ? <span className="band-chip">{BAND_LABEL[band] ?? band}</span> : null}
        </span>
      </div>
      <div
        className={`score-bar-track${bandOnly ? ' approximate' : ''}`}
        role="img"
        aria-label={`${label}: ${
          shown !== null ? `${shown} von 100` : `${band ?? 'ohne Wert'} ausgeprägt`
        }${
          showPercentile && pct !== undefined ? `, höher als etwa ${pct} % der Vergleichsgruppe` : ''
        }`}
      >
        <div className="score-bar-fill" style={{ width: `${Math.max(1, Math.round(score))}%` }} />
      </div>
      {blurb ? <p className="score-bar-blurb">{blurb}</p> : null}
      {showPercentile && pct !== undefined ? (
        <p className="score-bar-blurb">
          Höher als etwa {pct} % der deutschen Vergleichsstichprobe.
        </p>
      ) : null}
      {note ? <p className="score-bar-precision">{note}</p> : null}
    </div>
  );
}
