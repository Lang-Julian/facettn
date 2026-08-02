// Scale + facet definitions. A facet is a narrow sub-construct that rolls up into a
// domain (e.g. "Geselligkeit" -> Extraversion). The result page reports both levels:
// domains for the overview, facets for the depth.
//
// `sd` is a validity scale and never shown as a result.

export type DimensionGroup =
  | 'big5'
  | 'neuro'
  | 'dark'
  | 'empathy'
  | 'attachment'
  | 'love'
  | 'sensitivity'
  | 'validity'
  | 'wellbeing';

export interface ScaleDef {
  id: string;
  nameDe: string;
  dimensionGroup: DimensionGroup;
  /** Parent domain for facet scales; undefined for domains themselves. */
  parent?: string;
  /** One-line plain-German explanation, shown next to the facet bar. */
  blurb?: string;
  normSource?: string;
}

export const SCALES: ScaleDef[] = [
  // ---------- Big Five domains ----------
  { id: 'big5_E', nameDe: 'Extraversion', dimensionGroup: 'big5', normSource: 'BFI2_Danner2019' },
  { id: 'big5_A', nameDe: 'Verträglichkeit', dimensionGroup: 'big5', normSource: 'BFI2_Danner2019' },
  { id: 'big5_C', nameDe: 'Gewissenhaftigkeit', dimensionGroup: 'big5', normSource: 'BFI2_Danner2019' },
  { id: 'big5_N', nameDe: 'Emotionale Sensibilität', dimensionGroup: 'big5', normSource: 'BFI2_Danner2019' },
  { id: 'big5_O', nameDe: 'Offenheit', dimensionGroup: 'big5', normSource: 'BFI2_Danner2019' },

  // ---------- Big Five facets ----------
  { id: 'e_gesellig', nameDe: 'Geselligkeit', dimensionGroup: 'big5', parent: 'big5_E', blurb: 'Wie sehr dich die Gesellschaft anderer auflädt.' },
  { id: 'e_durchsetzung', nameDe: 'Durchsetzung', dimensionGroup: 'big5', parent: 'big5_E', blurb: 'Wie selbstverständlich du das Wort ergreifst und führst.' },
  { id: 'e_energie', nameDe: 'Tatendrang', dimensionGroup: 'big5', parent: 'big5_E', blurb: 'Dein Grundtempo — Aktivität und Begeisterungsfähigkeit.' },

  { id: 'a_mitgefuehl', nameDe: 'Mitgefühl', dimensionGroup: 'big5', parent: 'big5_A', blurb: 'Wie stark dich das Wohl anderer beschäftigt.' },
  { id: 'a_respekt', nameDe: 'Rücksicht', dimensionGroup: 'big5', parent: 'big5_A', blurb: 'Wie höflich und konfliktschonend du auftrittst.' },
  { id: 'a_vertrauen', nameDe: 'Vertrauen', dimensionGroup: 'big5', parent: 'big5_A', blurb: 'Ob du bei Menschen erst mal das Gute annimmst.' },

  { id: 'c_ordnung', nameDe: 'Ordnung', dimensionGroup: 'big5', parent: 'big5_C', blurb: 'Struktur, Planung und Übersicht im Alltag.' },
  { id: 'c_fleiss', nameDe: 'Beharrlichkeit', dimensionGroup: 'big5', parent: 'big5_C', blurb: 'Dranbleiben, bis eine Sache wirklich fertig ist.' },
  { id: 'c_verantwortung', nameDe: 'Verlässlichkeit', dimensionGroup: 'big5', parent: 'big5_C', blurb: 'Zusagen einhalten, auch wenn es unbequem wird.' },

  { id: 'n_angst', nameDe: 'Sorgenneigung', dimensionGroup: 'big5', parent: 'big5_N', blurb: 'Wie schnell dein System auf Bedrohung schaltet.' },
  { id: 'n_nieder', nameDe: 'Niedergeschlagenheit', dimensionGroup: 'big5', parent: 'big5_N', blurb: 'Wie tief und wie lange Stimmungstiefs gehen.' },
  { id: 'n_labil', nameDe: 'Emotionale Schwankung', dimensionGroup: 'big5', parent: 'big5_N', blurb: 'Wie stark deine Gefühlslage innerhalb eines Tages ausschlägt.' },

  { id: 'o_neugier', nameDe: 'Intellektuelle Neugier', dimensionGroup: 'big5', parent: 'big5_O', blurb: 'Lust an Ideen, Theorien und Warum-Fragen.' },
  { id: 'o_aesthetik', nameDe: 'Ästhetisches Empfinden', dimensionGroup: 'big5', parent: 'big5_O', blurb: 'Wie sehr dich Kunst, Musik und Schönheit berühren.' },
  { id: 'o_fantasie', nameDe: 'Vorstellungskraft', dimensionGroup: 'big5', parent: 'big5_O', blurb: 'Wie lebhaft dein inneres Kino ist.' },

  // ---------- ADHS ----------
  { id: 'adhs', nameDe: 'ADHS-Züge', dimensionGroup: 'neuro' },
  { id: 'adhs_unauf', nameDe: 'Unaufmerksamkeit', dimensionGroup: 'neuro', parent: 'adhs', blurb: 'Fokus halten, Details abschließen, Dinge wiederfinden.' },
  { id: 'adhs_hyper', nameDe: 'Innere Unruhe & Impulsivität', dimensionGroup: 'neuro', parent: 'adhs', blurb: 'Bewegungsdrang, Ungeduld, Handeln vor Denken.' },

  // ---------- Autismus ----------
  { id: 'autism', nameDe: 'Autistische Züge', dimensionGroup: 'neuro' },
  // Named for what a HIGH score means — the items measure difficulty, not ability,
  // so calling this "Soziale Intuition" would invert the reading of the bar.
  { id: 'au_sozial', nameDe: 'Mühe mit Zwischentönen', dimensionGroup: 'neuro', parent: 'autism', blurb: 'Wie viel Aufwand ungeschriebene Regeln, Ironie und Andeutungen kosten.' },
  { id: 'au_detail', nameDe: 'Detailfokus', dimensionGroup: 'neuro', parent: 'autism', blurb: 'Der Blick fürs Kleine, das andere überlesen.' },
  { id: 'au_routine', nameDe: 'Routinebedarf', dimensionGroup: 'neuro', parent: 'autism', blurb: 'Wie sehr Struktur trägt und Veränderung kostet.' },
  { id: 'au_sensorik', nameDe: 'Sensorische Empfindlichkeit', dimensionGroup: 'neuro', parent: 'autism', blurb: 'Reizverarbeitung bei Geräusch, Licht, Textur.' },
  { id: 'au_interesse', nameDe: 'Tiefeninteressen', dimensionGroup: 'neuro', parent: 'autism', blurb: 'Die Fähigkeit, in ein Thema komplett einzutauchen.' },
  { id: 'au_woertlich', nameDe: 'Wörtliches Verstehen', dimensionGroup: 'neuro', parent: 'autism', blurb: 'Direktheit statt Zwischenton — gesagt ist gemeint.' },

  { id: 'masking', nameDe: 'Masking', dimensionGroup: 'neuro', blurb: 'Der bewusste Aufwand, sozial „normal“ zu wirken.' },

  // ---------- Dark Traits ----------
  { id: 'dark_bold', nameDe: 'Furchtlosigkeit', dimensionGroup: 'dark', blurb: 'Ruhe unter Druck, Lust am Risiko, souveränes Auftreten.' },
  { id: 'dark_mean', nameDe: 'Kühle Durchsetzung', dimensionGroup: 'dark', blurb: 'Eigene Ziele auch dann, wenn andere dabei verlieren.' },
  { id: 'dark_disinh', nameDe: 'Impulsivität & Regelferne', dimensionGroup: 'dark', blurb: 'Spontan handeln, Regeln als Vorschlag lesen.' },
  { id: 'dark_grand', nameDe: 'Grandiosität', dimensionGroup: 'dark', blurb: 'Das Gefühl, über dem Durchschnitt zu stehen.' },

  // ---------- Empathie ----------
  { id: 'emp_cog', nameDe: 'Kognitive Empathie', dimensionGroup: 'empathy', blurb: 'Verstehen, was in anderen vorgeht — der Kopf-Anteil.' },
  { id: 'emp_aff', nameDe: 'Affektive Empathie', dimensionGroup: 'empathy', blurb: 'Mitfühlen, was andere fühlen — der Bauch-Anteil.' },

  // ---------- Bindung ----------
  { id: 'att_anx', nameDe: 'Bindungsangst', dimensionGroup: 'attachment', blurb: 'Sorge vor Verlust und Zurückweisung in engen Beziehungen.' },
  { id: 'att_avoid', nameDe: 'Bindungsvermeidung', dimensionGroup: 'attachment', blurb: 'Der Reflex, bei Nähe auf Abstand zu gehen.' },
  { id: 'att_secure', nameDe: 'Bindungssicherheit', dimensionGroup: 'attachment', blurb: 'Nähe zulassen können, ohne dich zu verlieren.' },

  // ---------- Love Styles ----------
  { id: 'love_klartext', nameDe: 'Klartext', dimensionGroup: 'love', blurb: 'Zuneigung in Worten — gesagt, nicht vorausgesetzt.' },
  { id: 'love_momente', nameDe: 'Momente', dimensionGroup: 'love', blurb: 'Ungeteilte gemeinsame Zeit als Kern von Nähe.' },
  { id: 'love_anpacken', nameDe: 'Anpacken', dimensionGroup: 'love', blurb: 'Liebe zeigen, indem du anderen den Rücken freihältst.' },
  { id: 'love_naehe', nameDe: 'Nähe', dimensionGroup: 'love', blurb: 'Körperliche Nähe als Sprache.' },
  { id: 'love_wachstum', nameDe: 'Wachstum', dimensionGroup: 'love', blurb: 'Gemeinsam größer werden als allein.' },
  { id: 'love_zeichen', nameDe: 'Zeichen', dimensionGroup: 'love', blurb: 'Kleine durchdachte Gesten mit Bedeutung.' },

  // ---------- Sensibilität ----------
  { id: 'hsp', nameDe: 'Hochsensibilität', dimensionGroup: 'sensitivity', blurb: 'Intensivere Verarbeitung von Reizen und Stimmungen.' },
  { id: 'rejection_sens', nameDe: 'Zurückweisungs-Sensibilität', dimensionGroup: 'sensitivity', blurb: 'Wie stark (vermutete) Ablehnung dich trifft.' },
  { id: 'alexithymia', nameDe: 'Mühe beim Benennen von Gefühlen', dimensionGroup: 'sensitivity', blurb: 'Wie schwer es fällt, eigene Emotionen zu erkennen und in Worte zu fassen.' },

  // ---------- Validität & Wellbeing ----------
  { id: 'sd', nameDe: 'Soziale Erwünschtheit', dimensionGroup: 'validity' },
  { id: 'phq9', nameDe: 'Stimmung', dimensionGroup: 'wellbeing', normSource: 'Kocalevent2013' },
  { id: 'gad7', nameDe: 'Anspannung', dimensionGroup: 'wellbeing', normSource: 'Loewe2008' },
];

export const SCALE_BY_ID = new Map(SCALES.map((s) => [s.id, s]));
export const SCALE_LABELS: Record<string, string> = Object.fromEntries(
  SCALES.map((s) => [s.id, s.nameDe]),
);

/** Facet scale ids belonging to a domain, in declaration order. */
export function facetsOf(domainId: string): ScaleDef[] {
  return SCALES.filter((s) => s.parent === domainId);
}
