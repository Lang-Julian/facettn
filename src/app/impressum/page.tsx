import type { Metadata } from 'next';
import { isLegalReady, missingLegalFields, OPERATOR } from '@/lib/content/legal';

export const metadata: Metadata = { title: 'Impressum' };

// The operator details come from src/lib/content/legal.ts. A production deploy with
// missing fields is blocked by scripts/check-legal.ts, so the incomplete state below
// can only ever be seen locally.
export default function ImpressumPage() {
  if (!isLegalReady()) {
    return (
      <main>
        <h1>Impressum</h1>
        <div className="validity-banner" role="status">
          <strong style={{ display: 'block', marginBottom: 6 }}>
            Noch nicht konfiguriert — lokale Entwicklungsansicht
          </strong>
          <p style={{ margin: '2px 0' }}>
            Die Betreiberangaben sind in <code>src/lib/content/legal.ts</code> zu hinterlegen.
            Fehlende Felder: {missingLegalFields().join(', ')}.
          </p>
          <p style={{ margin: '8px 0 0' }}>
            Ein Deployment mit unvollständigem Impressum wird vom Build abgelehnt — eine
            öffentlich erreichbare deutschsprachige Seite braucht nach § 5 DDG vollständige
            Angaben.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main>
      <h1>Impressum</h1>
      <div className="card">
        <h2 style={{ marginTop: 0 }}>Angaben gemäß § 5 DDG</h2>
        <p>
          {OPERATOR.name}
          <br />
          {OPERATOR.street}
          <br />
          {OPERATOR.postalCode} {OPERATOR.city}
          <br />
          {OPERATOR.country}
        </p>
        <h3>Kontakt</h3>
        <p>
          E-Mail: <a href={`mailto:${OPERATOR.email}`}>{OPERATOR.email}</a>
          {OPERATOR.phone ? (
            <>
              <br />
              Telefon: {OPERATOR.phone}
            </>
          ) : null}
        </p>
        {OPERATOR.vatId ? (
          <>
            <h3>Umsatzsteuer-Identifikationsnummer</h3>
            <p>{OPERATOR.vatId}</p>
          </>
        ) : null}
        {OPERATOR.representedBy ? (
          <>
            <h3>Vertreten durch</h3>
            <p>{OPERATOR.representedBy}</p>
          </>
        ) : null}
        <h3>Verantwortlich für den Inhalt</h3>
        <p>{OPERATOR.name}</p>
      </div>

      <div className="card">
        <h2 style={{ marginTop: 0 }}>Haftung für Inhalte</h2>
        <p>
          Dieses Angebot dient der Unterhaltung und Selbstreflexion. Es stellt keine
          medizinische, psychologische oder therapeutische Beratung dar und ersetzt keine
          fachliche Abklärung. Für Entscheidungen, die auf Grundlage der angezeigten Ergebnisse
          getroffen werden, wird keine Haftung übernommen.
        </p>
      </div>

      <div className="card">
        <h2 style={{ marginTop: 0 }}>Urheberrecht und Lizenz</h2>
        <p>
          Der Quellcode dieses Angebots steht unter der MIT-Lizenz und ist öffentlich
          einsehbar. Die Fragen des Hauptteils sind eigenständige Formulierungen; die
          verwendeten Fremdinstrumente sind auf der Transparenz-Seite mit Quelle und
          Lizenzstatus ausgewiesen.
        </p>
      </div>
    </main>
  );
}
