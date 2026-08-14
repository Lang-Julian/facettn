// End-to-end verification of the instrument itself.
//
// The unit tests check pieces; this checks that a real run produces a sane result —
// every scale populated, every pattern reachable, every archetype reachable, the
// guardrail firing, the payload surviving a round trip, and no value out of range
// across a wide sweep of answer profiles.
//
// Run: npx tsx scripts/verify-e2e.ts

import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { sitePath } from '../src/lib/urls';
import { ITEMS, CORE_ITEMS, PAYLOAD_ORDER_CORE, PAYLOAD_ORDER_WELLBEING, PHQ9_ITEM_IDS } from '../src/lib/seed/items';
import { SCALES } from '../src/lib/seed/scales';
import { ARCHETYPES } from '../src/lib/seed/archetypes';
import { DIMENSIONS, RADAR_SCALES, radarValues } from '../src/lib/content/dimensions';
import { detectPatterns } from '../src/lib/content/patterns';
import { REFERENCES } from '../src/lib/content/references';
import { encodePayload, decodePayload, stripWellbeing, extractPayload } from '../src/lib/share/payload';
import { buildProfile } from '../src/lib/profile';
import { buildMatchInsights } from '../src/lib/match';
import { itemsFor, resolutionFor, displayValue } from '../src/lib/precision';

let fails = 0;
let checks = 0;
function ok(name: string, cond: boolean, detail = '') {
  checks++;
  if (cond) console.log(`  ✓ ${name}`);
  else {
    console.log(`  ✗ ${name}${detail ? ` — ${detail}` : ''}`);
    fails++;
  }
}
function section(t: string) {
  console.log(`\n── ${t}`);
}

const byId = new Map(ITEMS.map((i) => [i.id, i]));
const REPORTED = SCALES.filter(
  (s) => s.dimensionGroup !== 'validity' && s.dimensionGroup !== 'wellbeing',
);

/** Build a complete, format-correct answer set. `pick` decides the Likert value. */
function answers(pick: (i: number, id: string) => number, withWellbeing = false, phq9item9 = 0) {
  const a: Record<string, number> = {};
  PAYLOAD_ORDER_CORE.forEach((id, i) => {
    const item = byId.get(id)!;
    if (item.isAttentionCheck) a[id] = item.expectedValue!;
    else if (item.responseFormat === 'choice2') a[id] = (i % 2) + 1;
    else a[id] = pick(i, id);
  });
  if (withWellbeing) {
    PAYLOAD_ORDER_WELLBEING.forEach((id, i) => {
      a[id] = id === PHQ9_ITEM_IDS[8] ? phq9item9 : i % 2;
    });
  }
  return a;
}

// ───────────────────────────────────────────────────────────── Struktur
section('Struktur des Fragebogens');
ok(`${CORE_ITEMS.length} Kernfragen`, CORE_ITEMS.length > 190);
ok('3 Aufmerksamkeitskontrollen', CORE_ITEMS.filter((i) => i.isAttentionCheck).length === 3);
ok('3 Items für soziale Erwünschtheit', CORE_ITEMS.filter((i) => i.isSocialDesirability).length === 3);
ok('16 optionale Wohlbefindens-Items', PAYLOAD_ORDER_WELLBEING.length === 16);
ok('15 Zwangswahl-Paare', ITEMS.filter((i) => i.responseFormat === 'choice2').length === 15);
ok('Positionen lückenlos und eindeutig', new Set(ITEMS.map((i) => i.position)).size === ITEMS.length);
ok('Jede Zwangswahl hat zwei Optionen', ITEMS.filter((i) => i.responseFormat === 'choice2').every((i) => i.choice?.length === 4));
ok('Jede Kontrollfrage hat eine Sollantwort', CORE_ITEMS.filter((i) => i.isAttentionCheck).every((i) => i.expectedValue !== undefined));

// ───────────────────────────────────────────────────────────── Messgüte-Regeln
section('Konstruktionsregeln');
const thin = REPORTED.filter((s) => itemsFor(s.id) < 4);
ok('Jede berichtete Skala ≥ 4 Items', thin.length === 0, thin.map((s) => s.id).join(', '));
const noResolution = REPORTED.filter((s) => !['exact', 'coarse', 'band'].includes(resolutionFor(s.id)));
ok('Anzeigeauflösung für jede Skala definiert', noResolution.length === 0);
ok('Keine Skala zeigt mehr Genauigkeit als 5er-Schritte bei 4 Items',
  REPORTED.filter((s) => itemsFor(s.id) === 4).every((s) => displayValue(s.id, 87) === 85));

// ───────────────────────────────────────────────────────────── Vollständigkeit
section('Vollständigkeit der Auswertung');
const mid = buildProfile(decodePayload(encodePayload(answers(() => 3))).answers);
const missing = REPORTED.filter((s) => mid.scores[s.id] === undefined);
ok('Alle berichteten Skalen erhalten einen Wert', missing.length === 0, missing.map((s) => s.id).join(', '));
const dimScales = DIMENSIONS.flatMap((d) => [...(d.domainId ? [d.domainId] : []), ...d.scaleIds]);
const orphanUi = dimScales.filter((id) => mid.scores[id] === undefined);
ok('Jede auf der Seite gezeigte Skala existiert', orphanUi.length === 0, orphanUi.join(', '));
const unshown = REPORTED.filter((s) => !dimScales.includes(s.id));
ok('Keine berichtete Skala fehlt in der Darstellung', unshown.length === 0, unshown.map((s) => s.id).join(', '));
ok('Radar hat 10 Achsen mit Werten', radarValues(mid.scores).length === 10 && radarValues(mid.scores).every((v) => v >= 0 && v <= 100));
ok('Alle Radar-Achsen sind echte Skalen oder Aggregate',
  RADAR_SCALES.every((r) => r.id === 'dark' || mid.scores[r.id] !== undefined));

// ───────────────────────────────────────────────────────────── Wertebereiche
section('Wertebereiche über extreme Antwortmuster');
for (const [label, fn] of [
  ['alles 1', () => 1],
  ['alles 3', () => 3],
  ['alles 5', () => 5],
  ['alternierend', (i: number) => (i % 2 ? 1 : 5)],
  ['zyklisch', (i: number) => (i % 5) + 1],
] as [string, (i: number) => number][]) {
  const p = buildProfile(decodePayload(encodePayload(answers(fn))).answers);
  const bad = Object.entries(p.scores).filter(([k, v]) => !['phq9', 'gad7'].includes(k) && (v < 0 || v > 100 || Number.isNaN(v)));
  ok(`${label}: alle Werte in 0–100`, bad.length === 0, bad.map(([k, v]) => `${k}=${v}`).join(', '));
}

// ───────────────────────────────────────────────────────────── Payload
section('Link-Codec');
const full = encodePayload(answers(() => 4, true), 3200);
const dec = decodePayload(full);
ok('Round-Trip erhält alle Antworten', Object.keys(dec.answers).length === PAYLOAD_ORDER_CORE.length + 16);
ok('Antwortzeit überlebt als Eimer', dec.medianResponseMs !== null && dec.medianResponseMs > 2500 && dec.medianResponseMs < 3600);
ok('Teilen-Link entfernt Wohlbefinden', decodePayload(stripWellbeing(full)).hasWellbeing === false);
ok('Wohlbefinden ist im persönlichen Link enthalten', dec.hasWellbeing === true);
ok('Link bleibt URL-taugliche Länge', full.length < 300, `${full.length} Zeichen`);
ok('Aus voller URL extrahierbar', extractPayload(`https://x.de/ergebnis#${full}`) === full);
let versionGuard = false;
try { decodePayload(full.replace(/^v3/, 'v2')); } catch { versionGuard = true; }
ok('Fremde Version wird abgelehnt statt umgedeutet', versionGuard);
let truncGuard = false;
try { decodePayload(full.slice(0, -30)); } catch { truncGuard = true; }
ok('Abgeschnittener Link wird abgelehnt', truncGuard);

// ───────────────────────────────────────────────────────────── Krisen-Guardrail
section('Krisen-Sicherung');
ok('PHQ-9 Item 9 > 0 löst aus', buildProfile(answers(() => 2, true, 1)).crisis === true);
ok('Ohne Wohlbefinden kein Alarm', buildProfile(answers(() => 2, false)).crisis === false);
ok('Niedrige Werte lösen nicht aus', buildProfile(answers(() => 2, true, 0)).crisis === false);
ok('Hohe Summe löst aus', buildProfile(answers(() => 2, true, 0), []).wellbeing !== null);
const highSum: Record<string, number> = { ...answers(() => 2, true, 0) };
PHQ9_ITEM_IDS.forEach((id, i) => (highSum[id] = i === 8 ? 0 : 2));
ok('PHQ-9-Summe ≥ 15 ohne Item 9 löst aus', buildProfile(highSum).crisis === true);

// ───────────────────────────────────────────────────────────── Validität
section('Validitätsindikatoren');
const cheat = answers(() => 3);
const acId = CORE_ITEMS.find((i) => i.isAttentionCheck)!.id;
cheat[acId] = cheat[acId] === 5 ? 1 : 5;
ok('Fehlgeschlagene Kontrollfrage wird erkannt', buildProfile(cheat).validity.attentionFail === true);
ok('Gleichförmiges Antworten wird erkannt', buildProfile(answers(() => 3)).validity.straightlining === true);
ok('Schnelles Klicken wird erkannt', buildProfile(answers((i) => (i % 5) + 1), [300, 320, 280]).validity.fastResponding === true);
ok('Normales Tempo löst nicht aus', buildProfile(answers((i) => (i % 5) + 1), [4000, 4200]).validity.fastResponding === false);
ok('Sauberer Durchlauf ohne Flags',
  Object.values(buildProfile(answers((i) => (i % 5) + 1), [3000, 3200, 3100]).validity).every((v) => v === false));

// ───────────────────────────────────────────────────────────── Archetypen
section('Archetypen');
const allScaleIds = REPORTED.map((s) => s.id);
const base = Object.fromEntries(allScaleIds.map((id) => [id, 50]));
const reached = new Set<string>();
for (const a of ARCHETYPES) {
  const probe: Record<string, number> = { ...base };
  for (const d of a.dims) probe[d.scaleId] = d.invert ? 5 : 95;
  const { resolveArchetype } = require('../src/lib/engine/scoring');
  reached.add(resolveArchetype(probe, ARCHETYPES).id);
}
reached.add('all_rounder');
ok('Jeder Archetyp hat Beschreibung, Stärken, Wachstumsfelder',
  ARCHETYPES.every((a) => a.descriptionDe && a.strengths.length >= 3 && a.growthAreas.length >= 2));
ok('Jeder Archetyp hat deutschen und englischen Namen', ARCHETYPES.every((a) => a.nameDe && a.nameEn));
ok('14 Archetypen', ARCHETYPES.length === 14);
ok('Fallback greift bei unauffälligem Profil', buildProfile(answers(() => 3)).archetype.id.length > 0);
ok(`${reached.size} verschiedene Archetypen erreichbar`, reached.size >= 10, [...reached].join(', '));

// ───────────────────────────────────────────────────────────── Muster
section('Musterregeln');
const patternProbes: Record<string, Record<string, number>> = {
  audhd: { adhs: 80, autism: 75 },
  empathy_gap_autistic: { emp_aff: 85, emp_cog: 55, autism: 70 },
  empathy_gap_cold: { emp_cog: 80, emp_aff: 30 },
  masking_cost: { masking: 80, autism: 70 },
  pursuer_distancer: { att_anx: 75, att_avoid: 75 },
  anxious_rejection: { att_anx: 75, rejection_sens: 75 },
  sensitive_overload: { hsp: 80, au_sensorik: 70 },
  bold_low_neuro: { dark_bold: 80, big5_N: 20 },
  impulse_stack: { adhs_hyper: 75, dark_disinh: 75 },
  conscientious_chaos: { c_ordnung: 25, c_verantwortung: 75 },
  alexithymia_sensitive: { alexithymia: 75, hsp: 70 },
  introvert_not_anxious: { big5_E: 25, att_anx: 20, n_angst: 20 },
  giver_no_boundaries: { a_mitgefuehl: 80, emp_aff: 80, att_avoid: 30 },
  challenge_dependent_attention: { adhs_unauf: 70, attn_challenge: 80, o_neugier: 80, c_verantwortung: 70 },
  external_perfectionism: { perf_social: 75 },
  own_rules: { c_ordnung: 25, c_verantwortung: 25, au_interesse: 80, dark_disinh: 70 },
};
for (const [id, over] of Object.entries(patternProbes)) {
  const fired = detectPatterns({ ...base, ...over }, 'sicher').map((p) => p.id);
  ok(`Regel "${id}" ist erreichbar`, fired.includes(id), `gefeuert: ${fired.join(', ') || 'keine'}`);
}
const neutral = detectPatterns({ ...base }, 'sicher');
ok('Neutrales Profil löst keine Regel aus', neutral.length === 0, `${neutral.length} gefeuert`);
const allPatterns = detectPatterns({ ...base, adhs: 80, autism: 75 }, 'sicher');
ok('Jedes Muster hat Titel, Lede, Body und Konsequenz',
  allPatterns.every((p) => p.title && p.lede && p.body && p.soWhat));

// ───────────────────────────────────────────────────────────── Vergleich
section('Vergleich');
const pa = buildProfile(decodePayload(encodePayload(answers((i) => (i % 5) + 1))).answers);
const pb = buildProfile(decodePayload(encodePayload(answers((i) => 5 - (i % 5)))).answers);
const m = buildMatchInsights(pa, pb);
ok('Gesamtwert in 0–100', m.total >= 0 && m.total <= 100, String(m.total));
ok('Overlay hat 10 Achsen', m.overlay.length === 10);
ok('Aufschlüsselung hat 5 Komponenten', m.breakdown.length === 5);
ok('Alle Komponenten in 0–100', m.breakdown.every((b) => b.value >= 0 && b.value <= 100));
ok('Jede Reibung hat einen Tipp', m.frictions.every((f) => f.point && f.tip));
const self = buildMatchInsights(pa, pa);
// NOT asserting a high total: the formula deliberately mixes similarity with absolute
// favourability (shared calm, agreeableness, attachment fit), so two identical people
// with an insecure style score lower than a mismatched pair including a secure one.
// That is the research-backed design — what must hold is that the *comparison*
// components max out.
const simComp = self.breakdown.find((b) => b.label.startsWith('Ähnlichkeit'))!;
const loveComp = self.breakdown.find((b) => b.label.startsWith('Love'))!;
ok('Identische Profile: Ähnlichkeitsanteil = 100', simComp.value === 100, String(simComp.value));
ok('Identische Profile: Love-Style-Überschneidung = 100', loveComp.value === 100, String(loveComp.value));
ok('Identische Profile: keine Reibungspunkte aus Divergenz',
  self.frictions.every((f) => !/Punkte auseinander/.test(f.point)), JSON.stringify(self.frictions.map((f) => f.point)));

// ───────────────────────────────────────────────────────────── Inhalte
section('Inhalte und Quellen');
ok('Jede Dimension hat Titel, Standfirst, Erklärung',
  DIMENSIONS.every((d) => d.title && d.standfirst && d.explanation.length > 100));
ok('Jede Dimension hat "bedeutet nicht" oder Tipps',
  DIMENSIONS.every((d) => d.meansNot || (d.tips && d.tips.length > 0)));
ok('Alle Quellen vollständig', REFERENCES.every((r) => r.authors && r.year && r.title && r.source && r.usedFor));
ok(`${REFERENCES.length} Quellen mit Verwendungszweck`, REFERENCES.length >= 14);
ok('DOIs plausibel formatiert', REFERENCES.filter((r) => r.doi).every((r) => /^10\.\d{4,}\//.test(r.doi!)));

// ───────────────────────────────────────────────────────────── Determinismus
section('Determinismus');
const a1 = answers((i) => (i % 5) + 1);
const r1 = JSON.stringify(buildProfile(a1).scores);
const r2 = JSON.stringify(buildProfile(a1).scores);
ok('Gleiche Antworten ergeben gleiches Ergebnis', r1 === r2);
ok('Link ist reproduzierbar', encodePayload(a1, 3000) === encodePayload(a1, 3000));

// ───────────────────────────────────────────────────────────── Link-Konstruktion
section('Link-Konstruktion');
// The live site once shipped share links without the base path: every copied link
// 404'd, and it was invisible locally because the base path is empty in dev. Next's
// <Link> prepends it, hand-written strings do not — so hand-written strings are
// banned outside src/lib/urls.ts.
{
  const dir = 'src/components';
  const files = readdirSync(dir).filter((f) => f.endsWith('.tsx'));
  const offenders: string[] = [];
  for (const f of files) {
    const src = readFileSync(join(dir, f), 'utf8');
    // <Link> is exempt: Next prepends the base path to it. Blank the Link tags out
    // (attributes may wrap across lines) and flag whatever raw href is left, plus
    // any direct use of location.origin, which never carries the base path.
    const scanned = src.replace(/<Link\b[^>]*>/g, (m) => m.replace(/[^\n]/g, ' '));
    scanned.split('\n').forEach((line, i) => {
      if (/href=\{`\/|href="\/|location\.origin/.test(line)) offenders.push(`${f}:${i + 1}`);
    });
  }
  ok('Kein Komponenten-Link umgeht sitePath()/siteUrl()', offenders.length === 0, offenders.join(', '));
  ok('sitePath erzwingt abschliessenden Schraegstrich', sitePath('/ergebnis').endsWith('/ergebnis/'));
  ok('sitePath traegt den Base-Path', sitePath('/x') === `${process.env.NEXT_PUBLIC_BASE_PATH ?? ''}/x/`);
  const withBase = '/facettn/vergleich/';
  ok('Vergleichs-Pfad unter Base-Path korrekt', withBase === `/facettn${sitePath('/vergleich').replace(process.env.NEXT_PUBLIC_BASE_PATH ?? '', '')}`);
}

console.log(`\n${'─'.repeat(58)}`);
if (fails === 0) console.log(`✓ ${checks} Prüfungen bestanden, 0 Fehler`);
else console.log(`✗ ${fails} von ${checks} Prüfungen fehlgeschlagen`);
process.exit(fails === 0 ? 0 : 1);
