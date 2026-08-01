// Pure engine types — no framework, no DB. The engine receives everything as arguments.

export type ScaleId = string;

export type ResponseFormat = 'likert5' | 'phq4';
export type ItemModule = 'core' | 'wellbeing';

export interface ItemDef {
  id: string;
  /** 1-based screen position in the questionnaire flow. */
  position: number;
  textDe: string;
  /** Dramaturgy block 1..5, 6 = optional wellbeing module. */
  block: number;
  isAttentionCheck: boolean;
  isSocialDesirability: boolean;
  module: ItemModule;
  responseFormat: ResponseFormat;
  /**
   * Item-level reverse coding (r' = 6 - r). NOTE: Blueprint reversals of the
   * Big-Five items (2, 4, 6, 8) are encoded via loading `direction: -1`, not
   * via this flag, to avoid double negation. Keep `reverse` for future items
   * that need it independently of the loading matrix.
   */
  reverse: boolean;
  /** For attention checks: the answer the instruction asks for. */
  expectedValue?: number;
}

export interface Loading {
  itemId: string;
  scaleId: ScaleId;
  /** 1.0 primary, 0.3–0.7 secondary. */
  weight: number;
  /** -1 means the item counts inverted for this scale (equivalent to reverse coding). */
  direction: 1 | -1;
}

/** Raw answers keyed by item id. Likert 1..5; wellbeing (phq4) 0..3. */
export type ResponseSet = Record<string, number>;

export interface ScaleScore {
  scaleId: ScaleId;
  raw: number;
  /** Normalized 0..100. */
  score100: number;
  /** Weighted mean of effective item values (1..5 metric) — used for norm comparison. */
  userMean: number;
}

export interface NormEntry {
  scaleId: ScaleId;
  population: string;
  normMean: number;
  normSd: number;
  /** Optional raw-score -> percentile lookup (e.g. ASRS Prozentränge). Keys are raw scores. */
  percentileTable?: Record<string, number> | null;
  source: string;
}

export type BandLabel = 'gering' | 'moderat' | 'deutlich' | 'stark';

export interface ValidityFlags {
  attentionFail: boolean;
  fastResponding: boolean;
  straightlining: boolean;
  sdHigh: boolean;
}

export interface ArchetypeDim {
  scaleId: ScaleId;
  /** If true, LOW percentile on this scale counts as dominant (e.g. "niedriger Neurotizismus"). */
  invert?: boolean;
}

export interface ArchetypeDef {
  id: string;
  nameDe: string;
  nameEn: string;
  descriptionDe: string;
  strengths: string[];
  growthAreas: string[];
  /** Lower number = wins ties. */
  priority: number;
  /** Key dimensions; empty for the fallback archetype. */
  dims: ArchetypeDim[];
}

export interface ArchetypeResult {
  id: string;
  nameDe: string;
  nameEn: string;
  topScales: ScaleId[];
}

export type AttachmentStyle = 'sicher' | 'aengstlich' | 'vermeidend';

export interface MatchProfile {
  /** score100 per scale (needs big5_O, big5_C, big5_A, big5_N). */
  scores: Record<ScaleId, number>;
  attachmentStyle: AttachmentStyle;
  /** [klartext, momente, anpacken, naehe, wachstum, zeichen] as score100. */
  loveVector: number[];
}

export interface MatchResult {
  total: number;
  similarity: number;
  neuroBase: number;
  agreeBase: number;
  attachScore: number;
  loveOverlap: number;
}

export interface WellbeingResult {
  phq9Sum: number;
  gad7Sum: number;
  phq9Item9: number;
  /** PHQ-9 item 9 > 0 OR PHQ-9 sum >= 15 — triggers the non-dismissable crisis banner. */
  crisis: boolean;
}
