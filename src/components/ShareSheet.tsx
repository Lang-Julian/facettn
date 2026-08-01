'use client';

// Share/compare CTA: native share where available, copy-link fallback, story image.

import { useState } from 'react';
import { track } from '@/lib/analytics';

export default function ShareSheet({ token, archetypeName }: { token: string; archetypeName: string }) {
  const [copied, setCopied] = useState(false);
  const url = typeof window !== 'undefined' ? `${window.location.origin}/ergebnis/${token}` : '';

  async function share() {
    track('share_clicked');
    const text = `Mein Archetyp: ${archetypeName} — wie viele Facetten hast du?`;
    if (navigator.share) {
      try {
        await navigator.share({ title: 'Facettn', text, url });
        return;
      } catch {
        /* user cancelled */
      }
    }
    await navigator.clipboard.writeText(`${text} ${url}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="card" style={{ textAlign: 'center' }}>
      <h2 style={{ marginTop: 0 }}>Teilen & vergleichen</h2>
      <p style={{ color: 'var(--ink-soft)' }}>
        Teile deinen Archetyp oder lade jemanden ein, das eigene Profil mit deinem zu vergleichen.
      </p>
      <button className="btn" onClick={share}>
        {copied ? 'Link kopiert ✓' : 'Ergebnis teilen'}
      </button>
      <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
        <a
          className="btn btn-secondary"
          href={`/api/og/${token}?format=story`}
          target="_blank"
          rel="noopener"
          onClick={() => track('share_clicked', { format: 'story' })}
        >
          Story-Bild
        </a>
        <a
          className="btn btn-secondary"
          href={`/vergleich/${token}`}
          onClick={() => track('compare_initiated')}
        >
          Profil vergleichen
        </a>
      </div>
    </div>
  );
}
