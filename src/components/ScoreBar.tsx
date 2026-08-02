// A single score bar. Percentile context is only shown where real published norms
// exist (currently the Big Five domains) — inventing a population comparison for a
// scale that has none would be the exact kind of false precision this test avoids.

const BAND_LABEL: Record<string, string> = {
  gering: 'gering',
  moderat: 'moderat',
  deutlich: 'deutlich',
  stark: 'stark',
};

export default function ScoreBar({
  label,
  blurb,
  score,
  band,
  percentile,
  showPercentile = false,
  rawLabel,
  emphasis = false,
}: {
  label: string;
  blurb?: string;
  score: number;
  band?: string;
  percentile?: number;
  showPercentile?: boolean;
  rawLabel?: string;
  emphasis?: boolean;
}) {
  const value = Math.round(score);
  const pct = percentile !== undefined ? Math.round(percentile) : undefined;

  return (
    <div className={`score-bar-row${emphasis ? ' emphasis' : ''}`}>
      <div className="score-bar-label">
        <span className="score-bar-name">{label}</span>
        <span className="score-bar-value">
          {rawLabel ?? value}
          {band ? <span className="band-chip">{BAND_LABEL[band] ?? band}</span> : null}
        </span>
      </div>
      <div
        className="score-bar-track"
        role="img"
        aria-label={`${label}: ${value} von 100${
          showPercentile && pct !== undefined ? `, höher als etwa ${pct} % der Vergleichsgruppe` : ''
        }`}
      >
        <div className="score-bar-fill" style={{ width: `${Math.max(1, value)}%` }} />
      </div>
      {blurb ? <p className="score-bar-blurb">{blurb}</p> : null}
      {showPercentile && pct !== undefined ? (
        <p className="score-bar-blurb">
          Höher als etwa {pct} % der deutschen Vergleichsstichprobe.
        </p>
      ) : null}
    </div>
  );
}
