import Link from 'next/link';
import { ARCHETYPES } from '@/lib/seed/archetypes';
import { BLOCK_META } from '@/lib/content/copy';
import { PAYLOAD_ORDER_CORE } from '@/lib/seed/items';
import { SCALES } from '@/lib/seed/scales';
import { radarGridPoints, radarPolygonPoints } from '@/lib/radar';

const HERO_VALUES = [72, 58, 45, 66, 88, 74, 62, 38, 70, 55];
const SCALE_COUNT = SCALES.filter(
  (s) => s.dimensionGroup !== 'validity' && s.dimensionGroup !== 'wellbeing',
).length;
const MINUTES = Math.round((PAYLOAD_ORDER_CORE.length * 7) / 60);

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
            ADHS-Züge, autistische Züge, Big Five mit Facetten, Bindungsstil, Empathie und
            Love Styles — in einem gemeinsamen Profil statt in zwölf Schubladen.
          </p>
          <p className="sub" style={{ fontWeight: 600, color: 'var(--ink)' }}>
            Ohne E-Mail. Ohne Konto. Ohne Datenbank.
          </p>
          <div style={{ maxWidth: 340, margin: '26px 0 10px' }}>
            <Link href="/test" className="btn">
              Test starten — {MINUTES} Minuten
            </Link>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--ink-faint)' }}>
            Das vollständige Ergebnis erscheint sofort · nichts wird gespeichert ·{' '}
            <Link href="/transparenz">warum das geht</Link>
          </p>
        </div>
        <div className="hero-figure">
          <HeroRadar />
        </div>
      </section>

      <div className="stat-row">
        {[
          [String(PAYLOAD_ORDER_CORE.length), 'Fragen'],
          [String(SCALE_COUNT), 'Skalen'],
          ['14', 'Archetypen'],
          ['0', 'gespeicherte Daten'],
        ].map(([num, label]) => (
          <div className="stat-cell" key={label}>
            <div className="num">{num}</div>
            <div className="lbl">{label}</div>
          </div>
        ))}
      </div>

      <section className="card manifesto">
        <h2 style={{ marginTop: 0 }}>Der Deal, den es hier nicht gibt</h2>
        <p>
          Die meisten Persönlichkeitstests im Netz funktionieren nach demselben Muster: Du
          beantwortest vierzig Fragen, siehst einen Teaser — und dann kommt die Wand. E-Mail
          eintragen, um „dein vollständiges Ergebnis freizuschalten“. Der Test war nie das
          Produkt. Du warst es.
        </p>
        <p>
          Hier gibt es diese Wand nicht. Das vollständige Ergebnis erscheint sofort, in voller
          Tiefe. Es gibt keine E-Mail-Abfrage, weil es keine Liste gibt. Es gibt keine
          Löschfunktion, weil es keine Datenbank gibt. Die Auswertung wird in deinem Browser
          gerechnet, und dein Ergebnis steckt anschließend im Link selbst — in einem Teil der
          Adresse, den Browser prinzipbedingt nie an einen Server senden.
        </p>
        <p style={{ marginBottom: 0 }}>
          Das ist überprüfbar statt versprochen: Der komplette Quellcode ist offen.{' '}
          <Link href="/transparenz">Hier steht, wie es funktioniert →</Link>
        </p>
      </section>

      <section className="card">
        <h2 style={{ marginTop: 0 }}>So läuft es ab</h2>
        <ol className="steps">
          <li>
            <strong>Sechs Abschnitte beantworten.</strong> Eine Frage pro Bildschirm, Fortschritt
            wird lokal gesichert — du kannst jederzeit pausieren.
            <div className="facet-preview">
              {[1, 2, 3, 4, 5, 6].map((b) => (
                <span key={b} className="facet-chip">
                  <span className="idx">{BLOCK_META[b].num}</span> {BLOCK_META[b].name}
                </span>
              ))}
            </div>
          </li>
          <li>
            <strong>Tiefenauswertung erhalten.</strong> Nicht nur Gesamtwerte, sondern Facetten
            darunter — plus die Muster, die sich aus deren Zusammenspiel ergeben. Mit Stärken
            zuerst und einem klaren „was das nicht bedeutet“.
          </li>
          <li>
            <strong>Behalten oder vergleichen.</strong> Der Link ist dein Ergebnis: als Lesezeichen
            speichern, weitergeben oder mit dem Profil einer anderen Person überlagern.
          </li>
        </ol>
      </section>

      <section className="card">
        <h2 style={{ marginTop: 0 }}>Warum {PAYLOAD_ORDER_CORE.length} Fragen und nicht 20</h2>
        <p>
          Weil kurze Tests genau das verlieren, was interessant ist. Ein mittlerer Wert bei
          Gewissenhaftigkeit kann heißen, dass alles im Mittelfeld liegt — oder dass maximale
          Verlässlichkeit auf völliges Ordnungschaos trifft. Dieselbe Zahl, zwei grundverschiedene
          Menschen.
        </p>
        <p style={{ marginBottom: 0 }}>
          Deshalb liegt unter jeder Hauptdimension die Facettenebene, und deshalb dauert das hier
          ein Viertelstündchen statt drei Minuten. Fragen zählen dabei bewusst auf mehrere Skalen
          gleichzeitig — so, wie sich Persönlichkeitsmerkmale auch in der Realität überlappen.
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
