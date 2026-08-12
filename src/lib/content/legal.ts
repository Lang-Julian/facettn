// Operator details for the Impressum (§ 5 DDG) and the privacy policy.
//
// These live in one typed place rather than being hardcoded into two pages, for a
// reason that matters more than tidiness: a German-language site that is publicly
// reachable without a complete Impressum is a real legal exposure for whoever runs
// it. So this file is paired with a build-time guard — `assertLegalReady()` throws
// when a production deployment is attempted with fields still empty (see
// scripts/check-legal.ts, which the Pages workflow runs before building).
//
// The result: the site cannot accidentally go live with placeholder legal pages.
// Filling this file in is the single step between a local build and a public one.

export interface Operator {
  /** Full name or registered company name. */
  name: string;
  street: string;
  postalCode: string;
  city: string;
  country: string;
  email: string;
  /** Optional — not required by § 5 DDG if e-mail is provided. */
  phone?: string;
  /** Optional — only if VAT-registered. */
  vatId?: string;
  /** Optional — required for legal entities, not for sole traders. */
  representedBy?: string;
}

/**
 * Fill these in before any public deployment. Empty strings are intentional:
 * inventing legal contact data would be worse than leaving it visibly unset.
 */
export const OPERATOR: Operator = {
  name: '',
  street: '',
  postalCode: '',
  city: '',
  country: 'Deutschland',
  email: '',
};

/** Hosting provider, named in the privacy policy as a processor. */
export const HOSTING = {
  provider: 'GitHub Pages (GitHub Inc., 88 Colin P. Kelly Jr. Street, San Francisco, CA 94107, USA)',
  note:
    'Die Seite besteht ausschließlich aus statischen Dateien. Beim Abruf fallen beim Hosting-Anbieter technisch bedingt Verbindungsdaten an (IP-Adresse, Zeitpunkt, abgerufene Adresse). Da Testantworten ausschließlich im Fragment der Adresse stehen und Fragmente von Browsern nicht übertragen werden, sind in diesen Protokollen keine Antworten und keine Ergebnisse enthalten.',
  transferNote:
    'GitHub Inc. ist ein US-Unternehmen. Die Übermittlung stützt sich auf Standardvertragsklauseln bzw. das EU-US Data Privacy Framework. Ein Restrisiko aus US-Jurisdiktion besteht und wird hier offen benannt.',
};

const REQUIRED: (keyof Operator)[] = ['name', 'street', 'postalCode', 'city', 'country', 'email'];

/** Which required fields are still empty. */
export function missingLegalFields(): string[] {
  return REQUIRED.filter((k) => !String(OPERATOR[k] ?? '').trim());
}

export function isLegalReady(): boolean {
  return missingLegalFields().length === 0;
}

/**
 * Hard gate for production builds. Called by scripts/check-legal.ts, which the
 * deployment workflow runs before `next build`, so a public deploy with an
 * incomplete Impressum fails loudly instead of shipping.
 */
export function assertLegalReady(): void {
  const missing = missingLegalFields();
  if (missing.length > 0) {
    throw new Error(
      `Impressum unvollständig — fehlende Felder: ${missing.join(', ')}.\n` +
        'Ein öffentlich erreichbares deutschsprachiges Angebot braucht ein vollständiges ' +
        'Impressum (§ 5 DDG). Bitte src/lib/content/legal.ts ausfüllen.',
    );
  }
}
