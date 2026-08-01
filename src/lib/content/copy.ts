// Legal/UX copy (Blueprint Deliverable 7) — VERBATIM where specified. Changing any
// of these texts toward "Screening/Diagnose/Verdacht" is MDR-relevant, not cosmetic.

export const CONSENT_TEXT_VERSION = 'v1-2026-08';

export const DISCLAIMER_FOOTER =
  'Dieser Test dient ausschließlich der Unterhaltung und Selbstreflexion (Edutainment). ' +
  'Er ist kein medizinisches Diagnose- oder Screening-Instrument und ersetzt keine ärztliche ' +
  'oder psychotherapeutische Beratung. Wenn du dich psychisch belastet fühlst, wende dich bitte an eine Fachperson.';

export const DISCLAIMER_PRE_TEST =
  'Bevor’s losgeht: Die folgenden Fragen erzeugen ein persönliches Profil deiner Tendenzen — keine Diagnose. ' +
  'Es gibt keine richtigen oder falschen Antworten. Antworte spontan und ehrlich. Du kannst jederzeit abbrechen.';

export const DISCLAIMER_RESULT =
  'Dein Ergebnis beschreibt Tendenzen, keine Krankheiten. Begriffe wie „Züge“ bedeuten Ausprägungen von ' +
  'Persönlichkeit, nicht „Verdacht auf“ eine Störung. Für echte Klarheit bei Leidensdruck: sprich mit einer ' +
  'Ärztin, einem Psychotherapeuten oder einer Beratungsstelle.';

export const CONSENTS = {
  a:
    'Ich willige ausdrücklich ein, dass meine Testantworten — die Rückschlüsse auf Gesundheitsaspekte ' +
    'zulassen können (Art. 9 Abs. 2 lit. a DSGVO) — zur Berechnung und Anzeige meines Ergebnisses ' +
    'verarbeitet werden. Ohne diese Einwilligung ist der Test nicht nutzbar. Ich kann sie jederzeit mit ' +
    'Wirkung für die Zukunft widerrufen.',
  b:
    'Ich möchte mein Ergebnis zusätzlich per E-Mail erhalten. Dafür darf meine E-Mail-Adresse mit meinem ' +
    'Ergebnis verknüpft gespeichert werden.',
  c:
    'Ich möchte gelegentlich Tipps und Angebote per E-Mail erhalten. Mir ist bekannt, dass ich dies per ' +
    'Bestätigungslink aktiviere (Double-Opt-in) und jederzeit abbestellen kann.',
  d:
    'Ich möchte mein Profil mit anderen vergleichen können (Matching). Der Vergleich erfolgt ausschließlich, ' +
    'wenn beide Seiten ausdrücklich zustimmen.',
} as const;

export const GATE_HEADLINE = 'Wohin sollen wir dein Ergebnis schicken? 📬';
export const GATE_SUB =
  'Trag deine E-Mail ein und wir senden dir dein vollständiges Profil + deine Archetyp-Karte zum Teilen.';
export const GATE_SKIP_LABEL = 'Ergebnis lieber nur hier ansehen';

export const CRISIS_BANNER = {
  title: 'Wenn es dir gerade sehr schlecht geht: Du bist nicht allein.',
  lines: [
    'TelefonSeelsorge – kostenlos, anonym, rund um die Uhr:',
    '0800 111 0 111 · 0800 111 0 222 · 116 123',
    'Auch per Chat/Mail: telefonseelsorge.de',
    'Für Menschen unter 25: krisenchat.de (WhatsApp/SMS, 24/7)',
    'In akuter, lebensbedrohlicher Gefahr: Notruf 112.',
  ],
};

export const WELLBEING_INTRO =
  'Die nächsten Fragen betreffen dein seelisches Wohlbefinden in den letzten zwei Wochen. ' +
  'Dieser Teil ist freiwillig — du kannst ihn überspringen.';

export const ATTRIBUTIONS = [
  'ADHS-Fragen: Konstrukte der Adult ADHD Self-Report Scale (ASRS-v1.1). © 2003 World Health Organization (WHO). ' +
    'Reprinted with permission of WHO. All rights reserved. Kurzform-Konzept: Ronald C. Kessler / NYU.',
  'Big-Five-Fragen: eigene deutsche Übersetzungen von IPIP-Konstrukten (International Personality Item Pool, public domain).',
  'Bindungs-Fragen: angelehnt an ECR-RS-Konstrukte (Fraley et al. 2000; dt. Ehrenthal et al. 2009), public domain, ' +
    'auf 5-stufige Skala harmonisiert.',
  'Wohlbefindens-Modul: PHQ-9 & GAD-7 (Löwe, Spitzer, Zipfel & Herzog; dt. Übersetzung Med. Universitätsklinik Heidelberg). ' +
    'Frei nutzbar; Rechte durch Pfizer freigegeben.',
  'Dieser Test ist NICHT assoziiert mit den Autor:innen der genannten Original-Instrumente. Alle übrigen Fragen ' +
    'sind eigenständige, forschungs-inspirierte Formulierungen ohne Wortlaut geschützter Skalen.',
];

export const MOTIVATORS: Record<number, string> = {
  1: 'Super Start! Deine erste Facette steht.',
  2: 'Stark — gleich wird’s persönlicher.',
  3: 'Halbzeit geschafft! Die spannendsten Facetten sind gesammelt.',
  4: 'Fast am Ziel — nur noch ein kurzer Block.',
  5: 'Alle Facetten gesammelt!',
};

/**
 * Facet-unlock mechanic: each block "collects" a named facet of the profile.
 * Shown in the segmented progress bar and celebrated on the motivator screens —
 * loss aversion + visible collection keeps completion up.
 */
export const BLOCK_META: Record<number, { name: string; num: string }> = {
  1: { name: 'Dein Grundton', num: '01' },
  2: { name: 'Fokus & Wahrnehmung', num: '02' },
  3: { name: 'Innenleben & Durchsetzung', num: '03' },
  4: { name: 'Nähe & Liebe', num: '04' },
  5: { name: 'Feinfühligkeit', num: '05' },
  6: { name: 'Wohlbefinden', num: '06' },
};

export const VALIDITY_NOTES = {
  attentionFail: 'Mindestens eine Kontrollfrage wurde nicht wie erwartet beantwortet — interpretiere dein Ergebnis mit Vorsicht.',
  fastResponding: 'Deine Antwortzeiten waren sehr kurz — das Ergebnis könnte weniger zuverlässig sein.',
  straightlining: 'Deine Antworten waren sehr gleichförmig — das Ergebnis könnte weniger differenziert sein.',
  sdHigh: 'Deine Antworten könnten positiv verzerrt sein (soziale Erwünschtheit).',
};
