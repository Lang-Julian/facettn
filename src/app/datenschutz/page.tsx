import type { Metadata } from 'next';
import DeleteMyData from '@/components/DeleteMyData';

export const metadata: Metadata = { title: 'Datenschutz' };

// ⚠️ TEMPLATE — a specialized law firm must review this before launch (Phase 0).
export default function DatenschutzPage() {
  return (
    <main>
      <h1>Datenschutzerklärung</h1>

      <div className="card">
        <h2 style={{ marginTop: 0 }}>Verantwortlicher</h2>
        <p>[TODO: Name, Anschrift, E-Mail des Verantwortlichen — vor Launch ergänzen]</p>
      </div>

      <div className="card">
        <h2 style={{ marginTop: 0 }}>Welche Daten wir verarbeiten</h2>
        <p>
          Deine Testantworten können Rückschlüsse auf Gesundheitsaspekte zulassen und gelten daher als
          besondere Kategorie personenbezogener Daten (Art. 9 DSGVO). Wir verarbeiten sie ausschließlich
          auf Grundlage deiner ausdrücklichen Einwilligung (Art. 9 Abs. 2 lit. a DSGVO), die du vor dem
          Teststart erteilst und jederzeit mit Wirkung für die Zukunft widerrufen kannst.
        </p>
        <ul>
          <li><strong>Testantworten & Ergebnis</strong> — pseudonym, ohne Namen, verknüpft nur über eine zufällige Sitzungs-ID.</li>
          <li><strong>E-Mail-Adresse</strong> — nur wenn du sie freiwillig angibst; getrennt von den Antworten gespeichert, verschlüsselt, verknüpft erst durch deine gesonderte Einwilligung.</li>
          <li><strong>Einwilligungen</strong> — revisionssicher protokolliert (Zeitpunkt, Textversion, gehashte IP).</li>
          <li><strong>Keine Cookies zu Marketingzwecken.</strong> Die Web-Analyse (Plausible) ist cookielos und ohne Personenbezug.</li>
        </ul>
      </div>

      <div className="card">
        <h2 style={{ marginTop: 0 }}>Speicherdauer & Löschung</h2>
        <p>
          Unvollständige, anonyme Sitzungen werden nach 30 Tagen automatisch gelöscht. Ergebnis-Links
          verfallen nach 90 Tagen. Du kannst deine Daten jederzeit selbst löschen:
        </p>
        <DeleteMyData />
      </div>

      <div className="card">
        <h2 style={{ marginTop: 0 }}>Auftragsverarbeiter & Datenstandorte</h2>
        <p>Alle Systeme laufen in EU-Rechenzentren (Region Frankfurt):</p>
        <ul>
          <li>Vercel Inc. (Hosting, Region fra1) — DPA/SCC</li>
          <li>Supabase Inc. (Datenbank, eu-central-1 Frankfurt) — DPA/SCC</li>
          <li>Brevo / Sendinblue SAS, Paris (E-Mail-Versand, EU-Hosting) — DPA</li>
          <li>Plausible Insights OÜ (cookielose Web-Analyse, EU-Hosting)</li>
        </ul>
        <p style={{ fontSize: '0.9rem', color: 'var(--ink-soft)' }}>
          Hinweis: Vercel und Supabase sind US-Unternehmen. Die Datenhaltung erfolgt in der EU;
          ein Restrisiko aus US-Jurisdiktion (CLOUD Act) besteht dennoch und ist über
          Standardvertragsklauseln bzw. das EU-US Data Privacy Framework abgesichert.
        </p>
      </div>

      <div className="card">
        <h2 style={{ marginTop: 0 }}>Deine Rechte</h2>
        <p>
          Du hast das Recht auf Auskunft, Berichtigung, Löschung, Einschränkung, Datenübertragbarkeit
          und Widerruf erteilter Einwilligungen (Art. 15–21 DSGVO) sowie das Recht auf Beschwerde bei
          einer Datenschutz-Aufsichtsbehörde.
        </p>
      </div>
    </main>
  );
}
