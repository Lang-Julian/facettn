import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = { title: 'Datenschutz' };

// ⚠️ The controller details below are placeholders. German law requires a real
// name and address here before this site is publicly reachable.
export default function DatenschutzPage() {
  return (
    <main>
      <h1>Datenschutzerklärung</h1>

      <div className="card">
        <h2 style={{ marginTop: 0 }}>Kurzfassung</h2>
        <p>
          Diese Anwendung verarbeitet <strong>keine</strong> personenbezogenen Daten. Es gibt keine
          Registrierung, keine E-Mail-Abfrage, keine Datenbank, keine Cookies und keine
          Analyse-Werkzeuge. Deine Testantworten werden ausschließlich in deinem Browser
          verarbeitet und niemals an einen Server übertragen.
        </p>
        <p style={{ marginBottom: 0 }}>
          Die technischen Hintergründe stehen ausführlich auf der{' '}
          <Link href="/transparenz">Transparenz-Seite</Link>.
        </p>
      </div>

      <div className="card">
        <h2 style={{ marginTop: 0 }}>Verantwortlicher</h2>
        <p>[TODO vor Veröffentlichung: Name, Anschrift, Kontakt-E-Mail]</p>
      </div>

      <div className="card">
        <h2 style={{ marginTop: 0 }}>Testantworten und Ergebnis</h2>
        <p>
          Die Auswertung wird vollständig im Browser berechnet. Antworten und Ergebnis werden
          nicht an einen Server gesendet und nirgendwo gespeichert. Während des Tests liegt dein
          Zwischenstand im lokalen Speicher deines Browsers (<code>localStorage</code>), damit du
          pausieren kannst; er wird nach Abschluss des Tests automatisch gelöscht und verlässt
          dein Gerät zu keinem Zeitpunkt.
        </p>
        <p>
          Dein Ergebnis wird im Fragment deiner Ergebnis-Adresse kodiert — dem Teil hinter dem
          <code>#</code>. Dieser Teil wird nach der Spezifikation des Web-Standards von Browsern
          nicht an Server übermittelt und erscheint daher auch in keinem Serverprotokoll.
        </p>
      </div>

      <div className="card">
        <h2 style={{ marginTop: 0 }}>Server-Logfiles</h2>
        <p>
          Beim Abruf der Seiten fallen beim Hosting-Anbieter technisch bedingt Zugriffsdaten an
          (IP-Adresse, Zeitpunkt, abgerufene Adresse, Browsertyp). Diese Verarbeitung stützt sich
          auf das berechtigte Interesse an einem sicheren und funktionsfähigen Betrieb
          (Art. 6 Abs. 1 lit. f DSGVO). Da Ergebnisse ausschließlich im Fragment stehen, sind in
          diesen Protokollen <strong>keine</strong> Testantworten und keine Ergebnisse enthalten.
        </p>
        <p>[TODO vor Veröffentlichung: Hosting-Anbieter, Serverstandort und Speicherdauer eintragen.]</p>
      </div>

      <div className="card">
        <h2 style={{ marginTop: 0 }}>Keine Cookies, kein Tracking</h2>
        <p>
          Es werden keine Cookies gesetzt, kein Web-Analyse-Dienst eingebunden, keine
          Tracking-Pixel geladen und keine Inhalte von Drittanbietern nachgeladen. Deshalb gibt es
          auch kein Einwilligungsbanner: Es gibt nichts, wozu einzuwilligen wäre.
        </p>
      </div>

      <div className="card">
        <h2 style={{ marginTop: 0 }}>Deine Rechte</h2>
        <p>
          Dir stehen die Rechte aus Art. 15–21 DSGVO zu — Auskunft, Berichtigung, Löschung,
          Einschränkung, Datenübertragbarkeit und Widerspruch — sowie das Recht auf Beschwerde bei
          einer Aufsichtsbehörde. In der Praxis läuft ein Auskunfts- oder Löschersuchen zu
          Testergebnissen allerdings ins Leere: Es liegen schlicht keine Daten vor, auf die es sich
          beziehen könnte. Deinen eigenen Ergebnis-Link löschst du, indem du ihn aus deinen
          Lesezeichen entfernst.
        </p>
      </div>
    </main>
  );
}
