import Link from 'next/link';
import { ARCHETYPES } from '@/lib/seed/archetypes';
import { BLOCK_META } from '@/lib/content/copy';
import { radarGridPoints, radarPolygonPoints } from '@/lib/radar';

// Decorative hero radar (static sample profile, purely illustrative).
const HERO_VALUES = [72, 58, 45, 66, 88, 74, 62, 38, 70, 55];

function HeroRadar() {
  const size = 300;
  const c = size / 2;
  const r = size / 2 - 16;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden>
      {[100, 75, 50, 25].map((lvl) => (
        <polygon
          key={lvl}
          points={radarGridPoints(c, c, (r * lvl) / 100, HERO_VALUES.length)}
          fill="none"
          stroke="#e9e8ef"
          strokeWidth={1}
        />
      ))}
      {HERO_VALUES.map((_, i) => {
        const angle = (Math.PI * 2 * i) / HERO_VALUES.length - Math.PI / 2;
        return (
          <line
            key={i}
            x1={c}
            y1={c}
            x2={c + Math.cos(angle) * r}
            y2={c + Math.sin(angle) * r}
            stroke="#e9e8ef"
            strokeWidth={1}
          />
        );
      })}
      <polygon
        points={radarPolygonPoints(HERO_VALUES, c, c, r)}
        fill="rgba(68, 66, 200, 0.09)"
        stroke="#4442c8"
        strokeWidth={1.5}
      />
    </svg>
  );
}

export default function LandingPage() {
  return (
    <main className="wide">
      <section className="hero hero-grid">
        <div>
          <span className="kicker">Multidimensionaler Selbsttest</span>
          <h1>
            Ein Test.
            <br />
            Alle Facetten.
          </h1>
          <p className="sub">
            ADHS-Züge, Autismus-Züge, Big Five, Bindungsstil, Love Styles und Empathie —
            in einem gemeinsamen Profil statt in zwölf Schubladen. Wissenschaftlich
            fundiert, verständlich erklärt.
          </p>
          <div style={{ maxWidth: 340, margin: '26px 0 10px' }}>
            <Link href="/test" className="btn">
              Test starten — ca. 8 Minuten
            </Link>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--ink-faint)' }}>
            Kostenlos · anonym startbar · keine Diagnose, sondern Selbstreflexion
          </p>
        </div>
        <div className="hero-figure">
          <HeroRadar />
        </div>
      </section>

      <div className="stat-row">
        {[
          ['10', 'Dimensionen'],
          ['14', 'Archetypen'],
          ['~8', 'Minuten'],
        ].map(([num, label]) => (
          <div className="stat-cell" key={label}>
            <div className="num">{num}</div>
            <div className="lbl">{label}</div>
          </div>
        ))}
      </div>

      <section className="card">
        <h2 style={{ marginTop: 0 }}>So funktioniert’s</h2>
        <ol className="steps">
          <li>
            <strong>Fünf Facetten beantworten.</strong> Kurze Frageblöcke, eine Frage pro
            Screen, Fortschritt wird automatisch gesichert.
            <div className="facet-preview">
              {[1, 2, 3, 4, 5].map((b) => (
                <span key={b} className="facet-chip">
                  <span className="idx">{BLOCK_META[b].num}</span> {BLOCK_META[b].name}
                </span>
              ))}
            </div>
          </li>
          <li>
            <strong>Profil & Archetyp erhalten.</strong> Ein Radar über alle Dimensionen,
            Stärken zuerst, mit klarer Einordnung — was dein Ergebnis bedeutet und was nicht.
          </li>
          <li>
            <strong>Teilen & vergleichen.</strong> Lege dein Profil über das einer anderen
            Person — ausschließlich, wenn beide ausdrücklich zustimmen.
          </li>
        </ol>
      </section>

      <section className="card">
        <h2 style={{ marginTop: 0 }}>Warum ein Test statt zwölf</h2>
        <p>
          Persönlichkeit ist verwoben: ADHS- und Autismus-Züge überlappen sich, Sensibilität
          färbt Bindung, Empathie hat zwei Gesichter. Unsere Fragen laden deshalb bewusst auf
          mehrere Dimensionen gleichzeitig — psychometrisch modelliert statt schubladensortiert.
          So entsteht ein Gesamtbild, das Zusammenhänge zeigt, die Einzeltests nicht sehen können.
        </p>
        <p style={{ fontSize: '0.88rem', color: 'var(--ink-faint)' }}>
          Zur Unterhaltung und Selbstreflexion — kein Diagnose- oder Screening-Instrument.
        </p>
      </section>

      <section>
        <h2>Die 14 Archetypen</h2>
        <div className="archetype-grid">
          {ARCHETYPES.map((a) => (
            <Link key={a.id} href={`/archetyp/${a.id}`}>
              <span>{a.nameDe}</span>
              <span className="en">{a.nameEn}</span>
            </Link>
          ))}
        </div>
      </section>

      <section style={{ textAlign: 'center', margin: '40px 0 8px' }}>
        <div style={{ maxWidth: 340, margin: '0 auto' }}>
          <Link href="/test" className="btn">
            Jetzt Profil erstellen
          </Link>
        </div>
      </section>
    </main>
  );
}
