'use client';

// Self-service GDPR deletion (DELETE /api/me) by result link or e-mail.

import { useState } from 'react';

export default function DeleteMyData() {
  const [input, setInput] = useState('');
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);

  async function remove() {
    setBusy(true);
    try {
      const value = input.trim();
      const token = value.includes('@') ? undefined : value.split('/').pop();
      const email = value.includes('@') ? value : undefined;
      await fetch('/api/me', {
        method: 'DELETE',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ token, email }),
      });
      setDone(true);
    } finally {
      setBusy(false);
    }
  }

  if (done) {
    return <p role="status">Sofern Daten zu deiner Angabe existierten, wurden sie gelöscht. ✓</p>;
  }

  return (
    <div>
      <label htmlFor="delete-input" style={{ fontWeight: 600, fontSize: '0.95rem' }}>
        Ergebnis-Link oder E-Mail-Adresse
      </label>
      <input
        id="delete-input"
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="https://…/ergebnis/… oder du@example.com"
      />
      <button className="btn btn-secondary" style={{ marginTop: 10 }} disabled={busy || !input.trim()} onClick={remove}>
        Meine Daten löschen
      </button>
    </div>
  );
}
