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
      <head>
        {/*
          CSP as a meta tag, not only as a header.
          A static export cannot send headers, and GitHub Pages ignores the _headers
          file entirely — so without this the policy would simply not exist on the
          live site while the privacy pages claim it does. The meta form enforces
          everything except frame-ancestors, which is header-only; that one is noted
          as a known limitation rather than silently claimed.
        */}
        <meta
          httpEquiv="Content-Security-Policy"
          content={[
            "default-src 'self'",
            // 'unsafe-eval' is dev-only: React Fast Refresh evaluates code at
            // runtime and the dev server is unusable without it. The production
            // build never carries it — keep this conditional, do not flatten it.
            `script-src 'self' 'unsafe-inline'${
              process.env.NODE_ENV === 'development' ? " 'unsafe-eval'" : ''
            }`,
            "style-src 'self' 'unsafe-inline'",
            "img-src 'self' data:",
            "connect-src 'self'",
            "font-src 'self'",
            "form-action 'none'",
            "base-uri 'self'",
            "object-src 'none'",
          ].join('; ')}
        />
        <meta name="referrer" content="strict-origin-when-cross-origin" />
      </head>
      <body>
        <a href="#inhalt" className="skip-link">Zum Inhalt springen</a>
        <header className="site-header">
          <Link href="/" className="wordmark">Facettn</Link>
          <nav aria-label="Hauptnavigation">
            <Link href="/transparenz">Transparenz</Link>
            <Link href="/test">Test</Link>
          </nav>
        </header>
        <div id="inhalt" tabIndex={-1}>{children}</div>
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
