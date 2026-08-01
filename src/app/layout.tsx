import type { Metadata, Viewport } from 'next';
import Script from 'next/script';
import Link from 'next/link';
import './globals.css';
import { ATTRIBUTIONS, DISCLAIMER_FOOTER } from '@/lib/content/copy';

export const metadata: Metadata = {
  title: {
    default: 'Facettn — Wie viele Facetten hast du?',
    template: '%s · Facettn',
  },
  description:
    'Der multidimensionale Selbsttest: ADHS-Züge, Autismus-Züge, Big Five, Bindungsstil, Love Styles & mehr in einem Profil. Zur Unterhaltung und Selbstreflexion — keine Diagnose.',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#4f46e5',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const plausibleDomain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;
  return (
    <html lang="de">
      <body>
        {children}
        <footer className="site-footer">
          <p>{DISCLAIMER_FOOTER}</p>
          <details>
            <summary style={{ cursor: 'pointer', minHeight: 44, display: 'flex', alignItems: 'center' }}>
              Quellen & Instrumente
            </summary>
            {ATTRIBUTIONS.map((a) => (
              <p key={a.slice(0, 24)}>{a}</p>
            ))}
          </details>
          <nav aria-label="Rechtliches">
            <Link href="/impressum">Impressum</Link>
            <Link href="/datenschutz">Datenschutz</Link>
          </nav>
        </footer>
        {plausibleDomain ? (
          <Script
            defer
            data-domain={plausibleDomain}
            src="https://plausible.io/js/script.js"
            strategy="afterInteractive"
          />
        ) : null}
      </body>
    </html>
  );
}
