// Legal and UX copy.
//
// The MDR line is a language line, not a formality: the moment this product claims
// to detect, screen for or diagnose a condition, it becomes a regulated medical
// device. Everything here therefore speaks of "Züge" and "Tendenzen" and never of
// "Verdacht auf", "Screening" or "Diagnose". Changing these strings is a compliance
// decision, not a copy tweak.
//
// There is deliberately no consent copy: the app processes nothing on a server, so
// there is no processing to consent to. That is the whole point.

export const DISCLAIMER_FOOTER =
  'Dieser Test dient ausschließlich der Unterhaltung und Selbstreflexion (Edutainment). ' +
  'Er ist kein medizinisches Diagnose- oder Screening-Instrument und ersetzt keine ärztliche ' +
  'oder psychotherapeutische Beratung. Wenn du dich psychisch belastet fühlst, wende dich bitte an eine Fachperson.';

export const DISCLAIMER_PRE_TEST =
  'Die folgenden Fragen erzeugen ein persönliches Profil deiner Tendenzen — keine Diagnose. ' +
  'Es gibt keine richtigen oder falschen Antworten. Antworte spontan und ehrlich; der erste Impuls ist meist der treffendste.';

export const DISCLAIMER_RESULT =
  'Dein Ergebnis beschreibt Tendenzen, keine Krankheiten. Begriffe wie „Züge“ bedeuten Ausprägungen von ' +
  'Persönlichkeit, nicht „Verdacht auf“ eine Störung. Für echte Klarheit bei Leidensdruck: sprich mit einer ' +
  'Ärztin, einem Psychotherapeuten oder einer Beratungsstelle.';

export const PRIVACY_PROMISE = {
  headline: 'Deine Antworten verlassen dieses Gerät nicht.',
  points: [
    'Kein Konto, keine E-Mail-Adresse, kein Zwischenschritt vor dem Ergebnis.',
    'Die Auswertung wird in deinem Browser berechnet — nicht auf einem Server.',
    'Es gibt keine Datenbank. Es gibt nichts zu löschen, weil nichts gespeichert wird.',
    'Keine Cookies, kein Tracking, keine Analyse-Skripte.',
    'Dein Ergebnis-Link trägt das Ergebnis in sich. Browser senden den Teil nach dem #-Zeichen niemals an einen Server.',
  ],
};

export const CRISIS_BANNER = {
  title: 'Wenn es dir gerade sehr schlecht geht: Du bist nicht allein.',
  lines: [
    'TelefonSeelsorge — kostenlos, anonym, rund um die Uhr:',
    '0800 111 0 111 · 0800 111 0 222 · 116 123',
    'Auch per Chat und Mail: telefonseelsorge.de',
    'Für Menschen unter 25: krisenchat.de (WhatsApp/SMS, rund um die Uhr)',
    'In akuter, lebensbedrohlicher Gefahr: Notruf 112.',
  ],
};

export const WELLBEING_INTRO =
  'Die nächsten 16 Fragen betreffen dein seelisches Befinden in den letzten zwei Wochen. ' +
  'Dieser Teil ist freiwillig und du kannst ihn überspringen. Wenn du ihn beantwortest, ' +
  'bleiben diese Antworten aus deinem Teilen-Link automatisch heraus.';

export const ATTRIBUTIONS = [
  'Alle Fragen des Hauptteils sind eigenständige deutsche Formulierungen, die für diesen Test geschrieben wurden. ' +
    'Sie orientieren sich an publizierten Konstrukten — der Facettenstruktur des Fünf-Faktoren-Modells (IPIP/BFI-2), ' +
    'den Aufmerksamkeits- und Hyperaktivitätsdomänen des DSM-5, der Camouflaging-Forschung, dem triarchischen ' +
    'Psychopathie-Modell sowie den Bindungsdimensionen des ECR — übernehmen aber keinen Wortlaut aus geschützten Skalen.',
  'Das optionale Wohlbefindens-Modul nutzt PHQ-9 und GAD-7 in der deutschen Fassung (Löwe, Spitzer, Zipfel & Herzog; ' +
    'Übersetzung Medizinische Universitätsklinik Heidelberg). Diese beiden Instrumente wurden vom Rechteinhaber ' +
    'ausdrücklich zur freien Vervielfältigung freigegeben.',
  'Dieser Test ist nicht mit den Autorinnen und Autoren der genannten Original-Instrumente assoziiert.',
  'Perzentile der Big-Five-Domänen beziehen sich auf die deutsche BFI-2-Referenzstichprobe (Danner et al. 2019, N = 770). ' +
    'Für die übrigen Skalen liegen noch keine eigenen Normdaten vor — dort wird der Rohwert ohne Bevölkerungsvergleich ausgewiesen.',
];

export const MOTIVATORS: Record<number, string> = {
  1: 'Guter Start. Der Grundton steht.',
  2: 'Antrieb und Struktur sind erfasst.',
  3: 'Der längste Block liegt hinter dir.',
  4: 'Die schwierigen Fragen sind durch.',
  5: 'Nur noch ein kurzer Abschnitt.',
  6: 'Alle Facetten gesammelt.',
};

export const BLOCK_META: Record<number, { name: string; num: string; note: string }> = {
  1: { name: 'Dein Grundton', num: '01', note: 'Wie du auf Menschen zugehst.' },
  2: { name: 'Antrieb & Struktur', num: '02', note: 'Wie du mit Aufgaben und Belastung umgehst.' },
  3: { name: 'Fokus & Wahrnehmung', num: '03', note: 'Aufmerksamkeit, Reize, Detailtiefe.' },
  4: { name: 'Innenleben & Durchsetzung', num: '04', note: 'Empathie, Anpassung, Konfliktverhalten.' },
  5: { name: 'Nähe & Liebe', num: '05', note: 'Bindung und wie Zuneigung bei dir ankommt.' },
  6: { name: 'Feinfühligkeit', num: '06', note: 'Sensibilität und Selbstwahrnehmung.' },
  7: { name: 'Wohlbefinden', num: '07', note: 'Optional, freiwillig, nicht im Teilen-Link.' },
};

export const VALIDITY_NOTES = {
  attentionFail:
    'Mindestens eine Kontrollfrage wurde nicht wie angegeben beantwortet. Das kann Zufall sein — nimm dein Ergebnis trotzdem mit etwas Vorsicht.',
  fastResponding:
    'Deine Antwortzeiten waren im Schnitt sehr kurz. Bei schnellem Durchklicken werden die Werte unschärfer.',
  straightlining:
    'Du hast überwiegend dieselbe Antwortstufe gewählt. Dadurch lassen sich die Skalen weniger gut voneinander trennen.',
  sdHigh:
    'Einige Kontrollfragen deuten auf ein sehr positives Selbstbild hin. Das ist menschlich — dein Profil könnte an einzelnen Stellen etwas geschönt sein.',
};
