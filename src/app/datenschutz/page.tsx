import type { Metadata } from 'next';
import Link from 'next/link';
import { HOSTING, isLegalReady, OPERATOR } from '@/lib/content/legal';

export const metadata: Metadata = { title: 'Datenschutz' };

export default function DatenschutzPage() {
  return (
    <main>
      <h1>Datenschutzerklärung</h1>

      <div className="card">
        <h2 style={{ marginTop: 0 }}>Kurzfassung</h2>
        <p>
          Diese Anwendung verarbeitet <strong>keine</strong> personenbezogenen Daten. Es gibt
          keine Registrierung, keine E-Mail-Abfrage, keine Datenbank, keine Cookies und keine
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
        {isLegalReady() ? (
          <p>
            {OPERATOR.name}
            <br />
            {OPERATOR.street}
            <br />
            {OPERATOR.postalCode} {OPERATOR.city}
            <br />
            {OPERATOR.country}
            <br />
            <a href={`mailto:${OPERATOR.email}`}>{OPERATOR.email}</a>
          </p>
        ) : (
          <p style={{ color: 'var(--ink-soft)' }}>
            Noch nicht konfiguriert (lokale Entwicklungsansicht) — siehe{' '}
            <Link href="/impressum">Impressum</Link>.
          </p>
        )}
      </div>

      <div className="card">
        <h2 style={{ marginTop: 0 }}>Testantworten und Ergebnis</h2>
        <p>
          Die Auswertung wird vollständig im Browser berechnet. Antworten und Ergebnis werden
          nicht an einen Server gesendet und nirgendwo gespeichert. Während des Tests liegt dein
          Zwischenstand im lokalen Speicher deines Browsers (<code>localStorage</code>), damit du
          pausieren kannst; er wird nach Abschluss des Tests automatisch gelöscht und verlässt
          dein Gerät zu keinem Zeitpunkt. Diese Speicherung ist für die von dir angeforderte
          Funktion unbedingt erforderlich und daher nach § 25 Abs. 2 TDDDG einwilligungsfrei.
        </p>
        <p>
          Dein Ergebnis wird im Fragment deiner Ergebnis-Adresse kodiert — dem Teil hinter dem{' '}
          <code>#</code>. Dieser Teil wird von Browsern spezifikationsgemäß nicht an Server
          übermittelt und erscheint daher in keinem Serverprotokoll.
        </p>
      </div>

      <div className="card">
        <h2 style={{ marginTop: 0 }}>Hosting und Server-Logfiles</h2>
        <p>{HOSTING.note}</p>
        <p>
          <strong>Anbieter:</strong> {HOSTING.provider}
        </p>
        <p>
          Rechtsgrundlage für die Verarbeitung dieser Verbindungsdaten ist das berechtigte
          Interesse an einem sicheren und funktionsfähigen Betrieb (Art. 6 Abs. 1 lit. f DSGVO).
        </p>
        <p style={{ fontSize: '0.9rem', color: 'var(--ink-soft)', marginBottom: 0 }}>
          {HOSTING.transferNote}
        </p>
      </div>

      <div className="card">
        <h2 style={{ marginTop: 0 }}>Keine Cookies, kein Tracking</h2>
        <p>
          Es werden keine Cookies gesetzt, kein Web-Analyse-Dienst eingebunden, keine
          Tracking-Pixel geladen und keine Inhalte von Drittanbietern nachgeladen. Deshalb gibt
          es auch kein Einwilligungsbanner: Es gibt nichts, wozu einzuwilligen wäre. Die
          Content-Security-Policy dieser Seite erlaubt ausschließlich Inhalte von der eigenen
          Domain — das lässt sich in den Antwort-Headern nachprüfen.
        </p>
      </div>

      <div className="card">
        <h2 style={{ marginTop: 0 }}>Deine Rechte</h2>
        <p>
          Dir stehen die Rechte aus Art. 15–21 DSGVO zu — Auskunft, Berichtigung, Löschung,
          Einschränkung, Datenübertragbarkeit und Widerspruch — sowie das Recht auf Beschwerde
          bei einer Aufsichtsbehörde. In der Praxis läuft ein Auskunfts- oder Löschersuchen zu
          Testergebnissen ins Leere: Es liegen keine Daten vor, auf die es sich beziehen könnte.
          Deinen eigenen Ergebnis-Link löschst du, indem du ihn aus deinen Lesezeichen entfernst.
        </p>
      </div>
    </main>
  );
}
