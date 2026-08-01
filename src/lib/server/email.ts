// Transactional e-mail via Brevo (EU data residency, default DPA). Without an API
// key (local dev) mails are logged to the server console instead.
// Privacy rule: result mails contain ONLY the token link — never scores or archetype
// details (e-mail is an unencrypted transport).

const BREVO_API = 'https://api.brevo.com/v3/smtp/email';

interface Mail {
  to: string;
  subject: string;
  html: string;
}

async function send(mail: Mail): Promise<void> {
  const key = process.env.BREVO_API_KEY;
  if (!key) {
    console.log(`[email:dev] to=${mail.to} subject="${mail.subject}"\n${mail.html}`);
    return;
  }
  const res = await fetch(BREVO_API, {
    method: 'POST',
    headers: { 'api-key': key, 'content-type': 'application/json' },
    body: JSON.stringify({
      sender: { email: process.env.EMAIL_FROM ?? 'no-reply@example.com', name: 'Facettn' },
      to: [{ email: mail.to }],
      subject: mail.subject,
      htmlContent: mail.html,
    }),
  });
  if (!res.ok) {
    console.error(`[email] Brevo error ${res.status}: ${await res.text()}`);
  }
}

const baseUrl = () => process.env.APP_BASE_URL ?? 'http://localhost:3000';

export async function sendResultEmail(to: string, token: string): Promise<void> {
  const link = `${baseUrl()}/ergebnis/${token}`;
  await send({
    to,
    subject: 'Dein Facettn-Ergebnis ist bereit 🎉',
    html: `<p>Hi!</p>
<p>Dein persönliches Profil wartet auf dich:</p>
<p><a href="${link}">${link}</a></p>
<p>Der Link ist 90 Tage gültig. Du kannst dein Ergebnis jederzeit über
<a href="${baseUrl()}/datenschutz">unsere Datenschutzseite</a> löschen lassen.</p>
<p>– Facettn</p>
<p style="color:#888;font-size:12px">Dieser Test dient ausschließlich der Unterhaltung und Selbstreflexion.
Er ist kein medizinisches Diagnose- oder Screening-Instrument.</p>`,
  });
}

export async function sendDoubleOptIn(to: string, confirmToken: string): Promise<void> {
  const link = `${baseUrl()}/api/confirm?token=${confirmToken}`;
  await send({
    to,
    subject: 'Bitte bestätige deine Anmeldung',
    html: `<p>Hi!</p>
<p>Du möchtest gelegentlich Tipps und Angebote von Facettn erhalten. Bitte bestätige das mit einem Klick:</p>
<p><a href="${link}">Anmeldung bestätigen</a></p>
<p>Wenn du das nicht warst, ignoriere diese Mail einfach — ohne Bestätigung passiert nichts.</p>
<p>– Facettn</p>`,
  });
}
