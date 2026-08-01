// Custom SVG radar. Replaces Recharts on the result page: its ResponsiveContainer
// clips axis labels at the left/right extremes on narrow viewports (recharts
// #2301/#2450) and it costs ~90 KB of JS for one chart. Pure SVG scales cleanly via
// viewBox, anchors each label by its angle, and renders server-side.
// Series colors validated with the dataviz six checks: #4442c8 / #0d9488.

export interface RadarDatum {
  axis: string;
  value: number;
  compare?: number;
}

const SIZE = 340;
const CENTER = SIZE / 2;
const RADIUS = 108; // leaves room for labels inside the viewBox
const RINGS = [25, 50, 75, 100];

const SERIES_A = '#4442c8';
const SERIES_B = '#0d9488';

function point(i: number, n: number, value: number, radius = RADIUS) {
  const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
  const r = (Math.max(0, Math.min(100, value)) / 100) * radius;
  return { x: CENTER + Math.cos(angle) * r, y: CENTER + Math.sin(angle) * r, angle };
}

function polygon(values: number[], radius = RADIUS) {
  return values
    .map((v, i) => {
      const p = point(i, values.length, v, radius);
      return `${p.x.toFixed(1)},${p.y.toFixed(1)}`;
    })
    .join(' ');
}

export default function ResultRadar({
  data,
  compareLabel,
  selfLabel = 'Du',
}: {
  data: RadarDatum[];
  compareLabel?: string;
  selfLabel?: string;
}) {
  const n = data.length;
  const values = data.map((d) => d.value);
  const compares = data.map((d) => d.compare ?? 0);
  const hasCompare = !!compareLabel;

  const summary = data
    .map((d) => `${d.axis} ${Math.round(d.value)}${hasCompare ? ` gegenüber ${Math.round(d.compare ?? 0)}` : ''}`)
    .join('; ');

  return (
    <figure style={{ margin: '8px 0 0' }}>
      <svg
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        width="100%"
        style={{ display: 'block', maxWidth: 460, margin: '0 auto', overflow: 'visible' }}
        role="img"
        aria-label={`Radarprofil über ${n} Dimensionen: ${summary}. Werte von 0 bis 100.`}
      >
        {RINGS.map((lvl) => (
          <polygon
            key={lvl}
            points={polygon(Array(n).fill(lvl))}
            fill="none"
            stroke="#e9e8ef"
            strokeWidth={1}
          />
        ))}
        {data.map((_, i) => {
          const p = point(i, n, 100);
          return <line key={i} x1={CENTER} y1={CENTER} x2={p.x} y2={p.y} stroke="#e9e8ef" strokeWidth={1} />;
        })}

        {hasCompare ? (
          <polygon
            points={polygon(compares)}
            fill={SERIES_B}
            fillOpacity={0.1}
            stroke={SERIES_B}
            strokeWidth={2}
            strokeLinejoin="round"
          />
        ) : null}
        <polygon
          points={polygon(values)}
          fill={SERIES_A}
          fillOpacity={hasCompare ? 0.1 : 0.13}
          stroke={SERIES_A}
          strokeWidth={2}
          strokeLinejoin="round"
        />

        {values.map((v, i) => {
          const p = point(i, n, v);
          return <circle key={i} cx={p.x} cy={p.y} r={2.5} fill={SERIES_A} />;
        })}
        {hasCompare
          ? compares.map((v, i) => {
              const p = point(i, n, v);
              return <circle key={i} cx={p.x} cy={p.y} r={2.5} fill={SERIES_B} />;
            })
          : null}

        {data.map((d, i) => {
          const p = point(i, n, 100, RADIUS + 14);
          // Anchor by horizontal position so labels grow away from the chart.
          const dx = p.x - CENTER;
          const anchor = Math.abs(dx) < 6 ? 'middle' : dx > 0 ? 'start' : 'end';
          const dy = p.y < CENTER - RADIUS * 0.75 ? -2 : p.y > CENTER + RADIUS * 0.75 ? 10 : 4;
          return (
            <text
              key={d.axis}
              x={p.x}
              y={p.y + dy}
              textAnchor={anchor}
              fontSize={10.5}
              fill="#5d5c6e"
              fontFamily="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
            >
              {d.axis}
            </text>
          );
        })}
      </svg>

      {hasCompare ? (
        <figcaption
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: 22,
            fontSize: '0.85rem',
            color: 'var(--ink-soft)',
            marginTop: 10,
          }}
        >
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7 }}>
            <span
              aria-hidden
              style={{ width: 11, height: 11, borderRadius: 2, background: SERIES_A, display: 'inline-block' }}
            />
            {selfLabel}
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7 }}>
            <span
              aria-hidden
              style={{ width: 11, height: 11, borderRadius: 2, background: SERIES_B, display: 'inline-block' }}
            />
            {compareLabel}
          </span>
        </figcaption>
      ) : null}
    </figure>
  );
}
