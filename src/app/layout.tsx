import type { Metadata, Viewport } from 'next';
import Link from 'next/link';
import './globals.css';
import { DISCLAIMER_FOOTER } from '@/lib/content/copy';

// No analytics script, no font CDN, no third-party embed anywhere in this tree.
// The page loads exactly what it needs from its own origin — that is what makes the
// privacy claim on /transparenz checkable rather than merely stated.

export const metadata: Metadata = {
  title: {
    default: 'Facettn — der Persönlichkeitstest, der nichts von dir speichert',
    template: '%s · Facettn',
  },
  description:
    'Multidimensionaler Selbsttest: ADHS-Züge, autistische Züge, Big Five mit Facetten, Bindungsstil, Empathie und Love Styles in einem Profil. Ohne E-Mail, ohne Konto, ohne Datenbank — die Auswertung läuft in deinem Browser.',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#fcfcfb',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de">
      <body>
        <header className="site-header">
          <Link href="/" className="wordmark">Facettn</Link>
          <nav aria-label="Hauptnavigation">
            <Link href="/transparenz">Transparenz</Link>
            <Link href="/test">Test</Link>
          </nav>
        </header>
        {children}
        <footer className="site-footer">
          <p>{DISCLAIMER_FOOTER}</p>
          <p style={{ marginTop: 12 }}>
            Kein Konto, keine Datenbank, keine Cookies. Deine Antworten verlassen dein Gerät nicht —{' '}
            <Link href="/transparenz">so funktioniert das</Link>.
          </p>
          <nav aria-label="Rechtliches">
            <Link href="/transparenz">Transparenz</Link>
            <Link href="/datenschutz">Datenschutz</Link>
            <Link href="/impressum">Impressum</Link>
          </nav>
        </footer>
      </body>
    </html>
  );
}
