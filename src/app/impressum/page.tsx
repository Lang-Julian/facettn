import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Impressum' };

// ⚠️ TEMPLATE — fill in the responsible entity before launch (§5 TMG/DDG).
export default function ImpressumPage() {
  return (
    <main>
      <h1>Impressum</h1>
      <div className="card">
        <p>[TODO: Name / Firma]</p>
        <p>[TODO: Anschrift]</p>
        <p>[TODO: E-Mail, ggf. Telefon]</p>
        <p>[TODO: ggf. USt-IdNr., Vertretungsberechtigte]</p>
        <p style={{ fontSize: '0.9rem', color: 'var(--ink-soft)' }}>
          Angaben gemäß § 5 DDG. Verantwortlich für den Inhalt: [TODO].
        </p>
      </div>
    </main>
  );
}
