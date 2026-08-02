import type { Metadata } from 'next';
import Link from 'next/link';
import { PAYLOAD_ORDER_CORE } from '@/lib/seed/items';
import { ATTRIBUTIONS } from '@/lib/content/copy';
import { SCALES } from '@/lib/seed/scales';

export const metadata: Metadata = {
  title: 'Transparenz',
  description:
    'Wie Facettn funktioniert: kein Konto, keine Datenbank, keine Cookies. Die Auswertung läuft im Browser, das Ergebnis steckt im Link. Offener Quellcode.',
};

const facetCount = SCALES.filter((s) => s.parent).length;
const scaleCount = SCALES.filter((s) => s.dimensionGroup !== 'validity' && s.dimensionGroup !== 'wellbeing').length;

export default function TransparenzPage() {
  return (
    <main>
      <section className="hero" style={{ paddingTop: 32 }}>
        <span className="kicker">Transparenz</span>
        <h1 style={{ fontSize: '2.4rem' }}>Warum dieser Test nichts von dir will</h1>
        <p className="sub">
          Die meisten Persönlichkeitstests im Netz sind Formulare zur Adressgewinnung mit
          Psychologie als Dekoration. Erst die E-Mail, dann das Ergebnis — und die Antworten
          liegen anschließend in einer Datenbank, deren Zweck du nicht kennst. Dieser Test
          ist die Gegenprobe: Er zeigt, dass es auch ohne das geht.
        </p>
      </section>

      <div className="card">
        <h2 style={{ marginTop: 0 }}>Was hier nicht passiert</h2>
        <ul className="tight-list">
          <li><strong>Keine E-Mail-Abfrage.</strong> Das vollständige Ergebnis erscheint sofort, ohne Gegenleistung.</li>
          <li><strong>Kein Konto, keine Registrierung.</strong> Es gibt nichts anzulegen.</li>
          <li><strong>Keine Datenbank.</strong> Dieses Projekt hat keinen Datenspeicher — nicht einen leeren, sondern gar keinen.</li>
          <li><strong>Keine Cookies, kein Tracking.</strong> Keine Analyse-Skripte, keine Pixel, kein Consent-Banner, weil es nichts zuzustimmen gibt.</li>
          <li><strong>Keine Werbung, kein Weiterverkauf.</strong> Es gibt keine Daten, die man verkaufen könnte.</li>
        </ul>
      </div>

      <div className="card">
        <h2 style={{ marginTop: 0 }}>Wie das technisch geht</h2>
        <p>
          Der entscheidende Trick ist unspektakulär und über dreißig Jahre alt: das
          <strong> URL-Fragment</strong> — der Teil einer Adresse hinter dem <code>#</code>.
        </p>
        <p>
          Browser behandeln diesen Teil grundsätzlich anders als den Rest: Er wird
          <strong> niemals an den Server gesendet</strong>. Er steht nicht in der HTTP-Anfrage,
          nicht in Server-Logfiles, nicht im Referer-Header, wenn du weiterklickst. Er
          existiert ausschließlich in deinem Browser.
        </p>
        <p>Dein Ergebnis-Link sieht deshalb so aus:</p>
        <pre className="code-block">
          <code>
            facettn.de/ergebnis<span className="hl">#v1.4315224…</span>
            {'\n'}
            <span className="code-note">└─ nur bis hier sieht der Server</span>
          </code>
        </pre>
        <p>
          Hinter dem <code>#</code> steht deine Antwortfolge — eine Ziffer pro Frage, in fester
          Reihenfolge, insgesamt {PAYLOAD_ORDER_CORE.length} Ziffern für den Hauptteil. Bewusst
          nicht verschlüsselt und nicht verschleiert: Du kannst deine eigenen Antworten im Link
          nachlesen. Ein System, dessen Datenhaltung man von Hand prüfen kann, muss man nicht
          glauben.
        </p>
        <p>
          Beim Öffnen liest die Seite diese Ziffern, rechnet die Auswertung{' '}
          <strong>in deinem Browser</strong> und zeigt sie an. Es gibt keinen Server-Aufruf, weil
          es nichts zu holen gibt. Du kannst nach dem Laden sogar das WLAN abschalten und die
          Seite neu berechnen lassen.
        </p>
      </div>

      <div className="card">
        <h2 style={{ marginTop: 0 }}>Was das für dich bedeutet</h2>
        <ul className="tight-list">
          <li>
            <strong>Der Link ist dein Ergebnis.</strong> Speichere ihn als Lesezeichen, dann kannst
            du jederzeit zurückkommen. Verlierst du ihn, ist das Ergebnis weg — auch für uns, weil
            es nie woanders existiert hat.
          </li>
          <li>
            <strong>Teilen heißt wirklich teilen.</strong> Wer deinen Link hat, sieht dein Profil.
            Behandle ihn so vertraulich, wie du das Ergebnis behandeln würdest.
          </li>
          <li>
            <strong>Das Wohlbefindens-Modul bleibt draußen.</strong> Der Teilen-Link enthält den
            optionalen Teil zu Stimmung und Anspannung grundsätzlich nicht — dort steht auch die
            Frage nach Suizidgedanken, und die gehört in keinen weitergegebenen Link.
          </li>
          <li>
            <strong>Vergleiche laufen lokal.</strong> Fügst du den Link einer anderen Person ein,
            werden beide Profile in deinem Browser verglichen. Auch dabei geht nichts hinaus.
          </li>
        </ul>
      </div>

      <div className="card">
        <h2 style={{ marginTop: 0 }}>Der Test selbst</h2>
        <p>
          {PAYLOAD_ORDER_CORE.length} Fragen im Hauptteil, {scaleCount} ausgewertete Skalen,
          davon {facetCount} Facetten unterhalb der Hauptdimensionen. Der Test ist absichtlich
          lang: Mit zwanzig Fragen lässt sich nicht unterscheiden, ob jemand unordentlich
          <em> und</em> unzuverlässig ist oder unordentlich <em>aber</em> grundsolide — und genau
          solche Unterschiede sind das Interessante.
        </p>
        <p>
          Viele Fragen zählen bewusst auf mehrere Skalen gleichzeitig. Das ist kein Trick zur
          Verkürzung, sondern bildet ab, dass Persönlichkeitsmerkmale sich real überlappen: Wer
          impulsiv handelt, kann das aus ADHS-typischer Impulskontrolle heraus tun oder aus einer
          bewussten Geringschätzung von Regeln. Die umgebenden Fragen entscheiden, welche Deutung
          trägt.
        </p>
        <p>
          <strong>Was dieser Test nicht ist:</strong> ein Diagnose- oder Screening-Instrument. Er
          beschreibt Ausprägungen von Persönlichkeit — Tendenzen, keine Krankheiten. Für Klarheit
          bei echtem Leidensdruck braucht es Menschen, keine Website.
        </p>
      </div>

      <div className="card">
        <h2 style={{ marginTop: 0 }}>Quellen und Lizenzen</h2>
        {ATTRIBUTIONS.map((a) => (
          <p key={a.slice(0, 30)} style={{ fontSize: '0.92rem' }}>{a}</p>
        ))}
      </div>

      <div className="card">
        <h2 style={{ marginTop: 0 }}>Offener Quellcode</h2>
        <p>
          Alles hier ist nachprüfbar: die Fragen, die Gewichtung jeder einzelnen Antwort, die
          Formeln, die Texte. Datenschutz-Versprechen sind wenig wert, wenn niemand sie
          kontrollieren kann — deshalb liegt der vollständige Quellcode offen und steht unter
          der MIT-Lizenz. Wer will, kann diesen Test selbst hosten oder auseinandernehmen.
        </p>
        <p style={{ marginBottom: 0 }}>
          Wenn du einen Fehler findest — ein schiefes Item, eine fragwürdige Gewichtung, einen
          Denkfehler in der Auswertung —, ist das ein willkommener Beitrag und kein Ärgernis.
        </p>
      </div>

      <div style={{ textAlign: 'center', margin: '32px 0' }}>
        <div style={{ maxWidth: 340, margin: '0 auto' }}>
          <Link className="btn" href="/test">Test starten</Link>
        </div>
      </div>
    </main>
  );
}
