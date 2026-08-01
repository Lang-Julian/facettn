// Score bar with band chip and percentile context. Server-renderable.

const BAND_LABEL: Record<string, string> = {
  gering: 'gering ausgeprägt',
  moderat: 'moderat ausgeprägt',
  deutlich: 'deutlich ausgeprägt',
  stark: 'stark ausgeprägt',
};

export default function ScoreBar({
  label,
  score,
  band,
  percentile,
}: {
  label: string;
  score: number;
  band?: string;
  percentile?: number;
}) {
  return (
    <div className="score-bar-row">
      <div className="score-bar-label">
        <span>{label}</span>
        {band ? <span className="band-chip">{BAND_LABEL[band] ?? band}</span> : null}
      </div>
      <div
        className="score-bar-track"
        role="img"
        aria-label={`${label}: ${Math.round(score)} von 100${
          percentile !== undefined ? `, höher als etwa ${Math.round(percentile)} % der Vergleichsgruppe` : ''
        }`}
      >
        <div className="score-bar-fill" style={{ width: `${Math.round(score)}%` }} />
      </div>
      {percentile !== undefined ? (
        <p style={{ fontSize: '0.82rem', color: 'var(--ink-soft)', margin: '3px 0 0' }}>
          Höher als etwa {Math.round(percentile)} % der Vergleichsgruppe
        </p>
      ) : null}
    </div>
  );
}
