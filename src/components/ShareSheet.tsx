'use client';

// Sharing without a server: the link *is* the result. Two distinct links exist —
// the personal one (everything, including the wellbeing module) and the share one
// (core answers only). The wellbeing block contains the item about self-harm and
// must never travel in a link handed to someone else.

import { useState } from 'react';
import { sitePath, siteUrl } from '@/lib/urls';

export default function ShareSheet({
  payload,
  shareLink,
  archetypeName,
  hasWellbeing,
}: {
  payload: string;
  shareLink: string;
  archetypeName: string;
  hasWellbeing: boolean;
}) {
  const [copied, setCopied] = useState<'own' | 'share' | null>(null);
  const ownUrl = siteUrl('/ergebnis', payload);
  const shareUrl = siteUrl('/ergebnis', shareLink);

  async function copy(url: string, which: 'own' | 'share') {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(which);
      setTimeout(() => setCopied(null), 2200);
    } catch {
      /* clipboard blocked — the input below still allows manual copying */
    }
  }

  async function share() {
    const text = `Mein Archetyp: ${archetypeName}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: 'Facettn', text, url: shareUrl });
        return;
      } catch {
        /* cancelled */
      }
    }
    void copy(shareUrl, 'share');
  }

  return (
    <div className="card">
      <h2 style={{ marginTop: 0 }}>Ergebnis behalten und teilen</h2>
      <p style={{ color: 'var(--ink-soft)' }}>
        Es gibt kein Konto und keine Datenbank — dein Ergebnis lebt ausschließlich in diesem Link.
        Speichere ihn als Lesezeichen, wenn du später noch einmal draufschauen willst.
      </p>

      <h3>Dein persönlicher Link</h3>
      <input
        type="text"
        readOnly
        value={ownUrl}
        onFocus={(e) => e.currentTarget.select()}
        aria-label="Dein persönlicher Ergebnis-Link"
      />
      <button className="btn btn-secondary" style={{ marginTop: 10 }} onClick={() => copy(ownUrl, 'own')}>
        {copied === 'own' ? 'Kopiert ✓' : 'Persönlichen Link kopieren'}
      </button>

      <h3 style={{ marginTop: 26 }}>Zum Teilen</h3>
      <p style={{ fontSize: '0.9rem', color: 'var(--ink-soft)', marginTop: 0 }}>
        {hasWellbeing
          ? 'Dieser Link enthält deinen Hauptteil — die Fragen zum Wohlbefinden sind bewusst entfernt.'
          : 'Dieser Link enthält deine Antworten aus dem Hauptteil.'}{' '}
        Wer ihn öffnet, sieht dein vollständiges Profil.
      </p>
      <button className="btn" onClick={share}>
        {copied === 'share' ? 'Kopiert ✓' : 'Ergebnis teilen'}
      </button>
      <div style={{ textAlign: 'center' }}>
        <a className="link-quiet" href={`${sitePath('/vergleich')}#${shareLink}`}>
          Mit jemandem vergleichen
        </a>
      </div>
    </div>
  );
}
