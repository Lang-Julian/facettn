// Item pool (Blueprint Deliverable 1) + dramaturgy order (Deliverable 8).
// NOTE: The Blueprint header says "58 Items" but enumerates 57 (i01–i57) — known
// upstream inconsistency, documented in the README. We implement the 57 enumerated items.
// This module is CLIENT-SAFE: it contains item texts only. Loadings live in loadings.ts
// and must never be imported by client components (business IP + anti-tampering).

import type { ItemDef } from '@/lib/engine/types';

interface RawItem {
  id: string;
  textDe: string;
  isAttentionCheck?: boolean;
  isSocialDesirability?: boolean;
  expectedValue?: number;
  module?: 'core' | 'wellbeing';
  responseFormat?: 'likert5' | 'phq4';
}

const CORE: RawItem[] = [
  // Block A — Big Five (Mini-IPIP constructs, own German translations; IPIP public domain)
  { id: 'i01', textDe: 'Ich gehe gern auf andere Menschen zu.' },
  { id: 'i02', textDe: 'Ich halte mich im Hintergrund.' },
  { id: 'i03', textDe: 'Ich habe Mitgefühl mit anderen.' },
  { id: 'i04', textDe: 'Ich interessiere mich wenig für die Probleme anderer.' },
  { id: 'i05', textDe: 'Ich erledige Aufgaben zuverlässig.' },
  { id: 'i06', textDe: 'Ich lasse Dinge oft liegen.' },
  { id: 'i07', textDe: 'Ich mache mir schnell Sorgen.' },
  { id: 'i08', textDe: 'Ich bleibe auch unter Druck ruhig.' },
  { id: 'i09', textDe: 'Ich habe eine lebhafte Vorstellungskraft.' },
  { id: 'i10', textDe: 'Ich interessiere mich für neue Ideen und Perspektiven.' },
  // Block B — ADHS (ASRS-v1.1 constructs; WHO copyright notice shown in the app footer)
  { id: 'i11', textDe: 'Ich habe Probleme, die letzten Details einer Aufgabe abzuschließen.' },
  { id: 'i12', textDe: 'Ich habe Schwierigkeiten, Dinge zu ordnen, wenn Organisation gefragt ist.' },
  { id: 'i13', textDe: 'Ich vergesse Termine oder Verpflichtungen.' },
  { id: 'i14', textDe: 'Ich schiebe Aufgaben auf, die viel Nachdenken erfordern.' },
  { id: 'i15', textDe: 'Ich bin zappelig, wenn ich lange sitzen muss.' },
  { id: 'i16', textDe: 'Ich lasse mich leicht durch Geräusche oder meine Umgebung ablenken.' },
  { id: 'i17', textDe: 'Ich rede in Gesprächen manchmal zu viel oder unterbreche andere.' },
  // Block C — Autismus-Züge (own items, construct-inspired, no protected wording)
  { id: 'i18', textDe: 'Soziale Signale wie Andeutungen oder Ironie entgehen mir oft.' },
  { id: 'i19', textDe: 'Mir fallen Details auf, die andere übersehen.' },
  { id: 'i20', textDe: 'Feste Routinen geben mir Halt; Veränderungen stressen mich.' },
  { id: 'i21', textDe: 'Bestimmte Geräusche, Licht oder Stoffe empfinde ich als überwältigend.' },
  { id: 'i22', textDe: 'In ein Thema, das mich fesselt, tauche ich stundenlang ein.' },
  { id: 'i23', textDe: 'Ich verstehe Aussagen oft wörtlich.' },
  { id: 'i24', textDe: 'Small Talk fällt mir schwer und strengt mich an.' },
  { id: 'i25', textDe: 'Nach viel Kontakt mit Menschen bin ich völlig erschöpft.' },
  // Block D — Masking (own items)
  { id: 'i26', textDe: 'In Gesellschaft spiele ich eine Rolle, statt ich selbst zu sein.' },
  { id: 'i27', textDe: 'Ich beobachte andere genau, um zu kopieren, wie man sich „richtig“ verhält.' },
  { id: 'i28', textDe: 'Ich zwinge mich zu Blickkontakt, obwohl es mir unangenehm ist.' },
  { id: 'i29', textDe: 'Nach sozialen Situationen bin ich erschöpft vom Sich-Zusammenreißen.' },
  // Block E — Dark Traits (own items, TriPM/LSRP constructs, responsible framing)
  { id: 'i30', textDe: 'Ich weiß, wie ich Menschen dazu bringe, das zu tun, was ich will.' },
  { id: 'i31', textDe: 'Das Leid anderer berührt mich weniger als die meisten Menschen.' },
  { id: 'i32', textDe: 'Risiken oder gefährliche Situationen reizen mich eher, als dass sie mir Angst machen.' },
  { id: 'i33', textDe: 'Ich handle oft im Moment, ohne an Konsequenzen zu denken.' },
  { id: 'i34', textDe: 'Ich fühle mich vielen Menschen überlegen.' },
  { id: 'i35', textDe: 'In fremden Situationen trete ich selbstsicher und dominant auf.' },
  { id: 'i36', textDe: 'Regeln sehe ich eher als Vorschlag denn als Verpflichtung.' },
  { id: 'i37', textDe: 'Ich setze meine Interessen durch, auch wenn andere dabei zu kurz kommen.' },
  // Block F — Empathie kognitiv vs. affektiv (own items)
  { id: 'i38', textDe: 'Ich erkenne meist schnell, was in anderen vorgeht.' },
  { id: 'i39', textDe: 'Ich kann mich gut in die Gedanken anderer hineinversetzen.' },
  { id: 'i40', textDe: 'Wenn jemand traurig ist, fühle ich seinen Schmerz körperlich mit.' },
  { id: 'i41', textDe: 'Die Gefühle anderer stecken mich stark an.' },
  // Block G — Bindungsstil (ECR-RS constructs, public domain; harmonized to 5-point Likert)
  { id: 'i42', textDe: 'Ich habe Angst, die Liebe einer nahestehenden Person zu verlieren.' },
  { id: 'i43', textDe: 'Ich sorge mich, dass andere mich nicht so mögen, wie ich sie mag.' },
  { id: 'i44', textDe: 'Ich rede nicht gern mit Partner:innen über meine tiefsten Gefühle.' },
  { id: 'i45', textDe: 'Ich verlasse mich lieber auf mich selbst als auf andere.' },
  { id: 'i46', textDe: 'Es fällt mir leicht, mich emotional auf andere einzulassen.' },
  // Block H — Love Styles (own 6-factor model; deliberately NOT "5 Love Languages"®)
  { id: 'i47', textDe: 'Ehrliche, liebevolle Worte bedeuten mir am meisten.' },
  { id: 'i48', textDe: 'Ungeteilte gemeinsame Zeit ist für mich der Kern von Nähe.' },
  { id: 'i49', textDe: 'Ich zeige Liebe, indem ich anderen praktisch den Rücken freihalte.' },
  { id: 'i50', textDe: 'Körperliche Nähe ist für mich eine wichtige Sprache der Liebe.' },
  { id: 'i51', textDe: 'Ich blühe auf, wenn wir zusammen wachsen und uns weiterentwickeln.' },
  { id: 'i52', textDe: 'Durchdachte kleine Geschenke sagen mehr als große Worte.' },
  // Block I — HSP, Rejection Sensitivity, emotionale Selbstwahrnehmung (own items)
  { id: 'i53', textDe: 'Reize wie Lärm, Gerüche oder Hektik überfordern mich schneller als andere.' },
  { id: 'i54', textDe: 'Ich nehme feine Stimmungen im Raum sofort wahr.' },
  { id: 'i55', textDe: 'Bei Kritik oder Zurückweisung reagiere ich sehr empfindlich.' },
  { id: 'i56', textDe: 'Ich erwarte oft, dass andere mich ablehnen könnten.' },
  { id: 'i57', textDe: 'Es fällt mir schwer, meine eigenen Gefühle in Worte zu fassen.' },
];

const CHECKS: RawItem[] = [
  { id: 'att01', textDe: 'Bitte wähle hier „trifft eher nicht zu“ aus.', isAttentionCheck: true, expectedValue: 2 },
  { id: 'att02', textDe: 'Um zu zeigen, dass du aufmerksam liest, wähle „trifft voll zu“.', isAttentionCheck: true, expectedValue: 5 },
  { id: 'att03', textDe: 'Ich lese diese Frage aufmerksam und wähle „teils/teils“.', isAttentionCheck: true, expectedValue: 3 },
  { id: 'sd01', textDe: 'Ich habe noch nie in meinem Leben gelogen.', isSocialDesirability: true },
  { id: 'sd02', textDe: 'Ich bin immer und ausnahmslos höflich, auch wenn man mich ärgert.', isSocialDesirability: true },
  { id: 'sd03', textDe: 'Ich habe nie im Leben etwas genommen, das mir nicht gehört.', isSocialDesirability: true },
];

// PHQ-9 / GAD-7 German (Löwe/Spitzer, Univ. Heidelberg translation; free of copyright
// restriction per Pfizer). Original 4-point format 0–3, scored separately.
const WELLBEING: RawItem[] = [
  { id: 'phq01', textDe: 'Wenig Interesse oder Freude an deinen Tätigkeiten.' },
  { id: 'phq02', textDe: 'Niedergeschlagenheit, Schwermut oder Hoffnungslosigkeit.' },
  { id: 'phq03', textDe: 'Schwierigkeiten, ein- oder durchzuschlafen, oder vermehrter Schlaf.' },
  { id: 'phq04', textDe: 'Müdigkeit oder Gefühl, keine Energie zu haben.' },
  { id: 'phq05', textDe: 'Verminderter Appetit oder übermäßiges Bedürfnis zu essen.' },
  { id: 'phq06', textDe: 'Schlechte Meinung von dir selbst; Gefühl, versagt oder die Familie enttäuscht zu haben.' },
  { id: 'phq07', textDe: 'Schwierigkeiten, dich auf etwas zu konzentrieren, z. B. beim Lesen oder Fernsehen.' },
  { id: 'phq08', textDe: 'Verlangsamte Bewegungen oder Sprache — oder das Gegenteil: Zappeligkeit und Ruhelosigkeit.' },
  { id: 'phq09', textDe: 'Gedanken, dass du lieber tot wärst oder dir Leid zufügen möchtest.' },
  { id: 'gad01', textDe: 'Nervosität, Ängstlichkeit oder Anspannung.' },
  { id: 'gad02', textDe: 'Unfähigkeit, Sorgen zu stoppen oder zu kontrollieren.' },
  { id: 'gad03', textDe: 'Übermäßige Sorgen bezüglich verschiedener Angelegenheiten.' },
  { id: 'gad04', textDe: 'Schwierigkeiten zu entspannen.' },
  { id: 'gad05', textDe: 'Rastlosigkeit, sodass Stillsitzen schwerfällt.' },
  { id: 'gad06', textDe: 'Schnelle Verärgerung oder Gereiztheit.' },
  { id: 'gad07', textDe: 'Gefühl der Angst, als würde etwas Schlimmes passieren.' },
];

/**
 * Dramaturgy (Deliverable 8): warm-up first, sensitive items mid/late, never more
 * than 3 items of the same scale in a row (ADHS/Autism interleaved), attention
 * checks at ~33/66 %, SD items spread through block 3.
 */
const ORDER: { block: number; ids: string[] }[] = [
  { block: 1, ids: ['i01', 'i02', 'i03', 'i04', 'i05', 'i06', 'i07', 'i08', 'i09', 'i10'] },
  {
    block: 2,
    ids: ['i11', 'i18', 'i12', 'i19', 'i13', 'i20', 'i14', 'att01', 'i21', 'i15', 'i22', 'i16', 'i23', 'i17', 'i24'],
  },
  {
    block: 3,
    ids: ['i25', 'i26', 'i38', 'i30', 'i27', 'sd01', 'i31', 'i39', 'i32', 'i28', 'i40', 'i33', 'sd02', 'i34', 'i41', 'i29', 'i35', 'att02', 'i36', 'sd03', 'i37'],
  },
  { block: 4, ids: ['i42', 'i47', 'i43', 'i48', 'i44', 'i49', 'i45', 'i50', 'att03', 'i46', 'i51', 'i52'] },
  { block: 5, ids: ['i53', 'i54', 'i55', 'i56', 'i57'] },
  {
    block: 6,
    ids: ['phq01', 'phq02', 'phq03', 'phq04', 'phq05', 'phq06', 'phq07', 'phq08', 'phq09', 'gad01', 'gad02', 'gad03', 'gad04', 'gad05', 'gad06', 'gad07'],
  },
];

const RAW_BY_ID = new Map<string, RawItem>(
  [...CORE, ...CHECKS, ...WELLBEING].map((r) => [r.id, r]),
);

function build(): ItemDef[] {
  const out: ItemDef[] = [];
  let position = 1;
  for (const { block, ids } of ORDER) {
    for (const id of ids) {
      const raw = RAW_BY_ID.get(id);
      if (!raw) throw new Error(`unknown item in ORDER: ${id}`);
      const isWellbeing = block === 6;
      out.push({
        id: raw.id,
        position: position++,
        textDe: raw.textDe,
        block,
        isAttentionCheck: raw.isAttentionCheck ?? false,
        isSocialDesirability: raw.isSocialDesirability ?? false,
        module: isWellbeing ? 'wellbeing' : 'core',
        responseFormat: isWellbeing ? 'phq4' : 'likert5',
        reverse: false, // Big-Five reversals are encoded as loading direction -1 (see loadings.ts)
        expectedValue: raw.expectedValue,
      });
    }
  }
  return out;
}

export const ITEMS: ItemDef[] = build();
export const CORE_ITEMS = ITEMS.filter((i) => i.module === 'core');
export const WELLBEING_ITEMS = ITEMS.filter((i) => i.module === 'wellbeing');
export const PHQ9_ITEM_IDS = WELLBEING_ITEMS.filter((i) => i.id.startsWith('phq')).map((i) => i.id);
export const GAD7_ITEM_IDS = WELLBEING_ITEMS.filter((i) => i.id.startsWith('gad')).map((i) => i.id);

export const LIKERT_OPTIONS = [
  { value: 1, label: 'trifft gar nicht zu' },
  { value: 2, label: 'trifft eher nicht zu' },
  { value: 3, label: 'teils/teils' },
  { value: 4, label: 'trifft eher zu' },
  { value: 5, label: 'trifft voll zu' },
];

export const PHQ4_OPTIONS = [
  { value: 0, label: 'Überhaupt nicht' },
  { value: 1, label: 'An einzelnen Tagen' },
  { value: 2, label: 'An mehr als der Hälfte der Tage' },
  { value: 3, label: 'Beinahe jeden Tag' },
];
