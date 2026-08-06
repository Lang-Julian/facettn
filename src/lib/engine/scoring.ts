// Pure, deterministic scoring engine. No DB, no framework. See Dev-Spec §5.

import type {
  ArchetypeDef,
  ArchetypeResult,
  AttachmentStyle,
  BandLabel,
  ItemDef,
  Loading,
  MatchProfile,
  MatchResult,
  NormEntry,
  ResponseSet,
  ScaleScore,
  ValidityFlags,
  WellbeingResult,
} from './types';

/** r' = 6 - r (5-point Likert). */
export function reverseCode(value: number): number {
  return 6 - value;
}

/**
 * Standard normal CDF, Abramowitz–Stegun 7.1.26 approximation.
 * Deterministic, |error| < 7.5e-8 — well inside the ±1 percentile tolerance.
 */
export function phi(z: number): number {
  const t = 1 / (1 + 0.2316419 * Math.abs(z));
  const d = 0.3989423 * Math.exp((-z * z) / 2);
  const p =
    d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
  return z > 0 ? 1 - p : p;
}

export function cosine(a: number[], b: number[]): number {
  const dot = a.reduce((s, v, i) => s + v * (b[i] ?? 0), 0);
  const na = Math.sqrt(a.reduce((s, v) => s + v * v, 0));
  const nb = Math.sqrt(b.reduce((s, v) => s + v * v, 0));
  return na && nb ? dot / (na * nb) : 0;
}

/**
 * Effective item value on the 1..5 metric after item-level reverse coding and
 * loading direction. direction -1 is equivalent to reverse coding for that scale.
 */
function effectiveValue(value: number, item: ItemDef | undefined, direction: 1 | -1): number {
  let v = item?.reverse ? reverseCode(value) : value;
  if (direction === -1) v = reverseCode(v);
  return v;
}

/**
 * Compute raw + normalized scores per scale.
 * raw  = Σ effectiveValue × weight        (over answered loadings)
 * min  = Σ 1 × |weight|,  max = Σ 5 × |weight|
 * score100 = 100 × (raw − min) / (max − min)
 * Loadings whose item was not answered are excluded from raw AND min/max, so a
 * partially answered scale still normalizes correctly.
 */
export function computeScaleScores(
  resp: ResponseSet,
  items: ItemDef[],
  loadings: Loading[],
): ScaleScore[] {
  const itemById = new Map(items.map((i) => [i.id, i]));
  const byScale = new Map<string, { raw: number; min: number; max: number; wSum: number }>();

  for (const l of loadings) {
    const value = resp[l.itemId];
    if (value === undefined) continue;
    const item = itemById.get(l.itemId);
    if (item && item.responseFormat !== 'likert5') continue; // wellbeing and forced choice are scored separately
    const v = effectiveValue(value, item, l.direction);
    const acc = byScale.get(l.scaleId) ?? { raw: 0, min: 0, max: 0, wSum: 0 };
    acc.raw += v * l.weight;
    acc.min += 1 * Math.abs(l.weight);
    acc.max += 5 * Math.abs(l.weight);
    acc.wSum += Math.abs(l.weight);
    byScale.set(l.scaleId, acc);
  }

  const out: ScaleScore[] = [];
  for (const [scaleId, acc] of byScale) {
    const range = acc.max - acc.min;
    const score100 = range > 0 ? (100 * (acc.raw - acc.min)) / range : 0;
    out.push({
      scaleId,
      raw: round2(acc.raw),
      score100: round2(clamp(score100, 0, 100)),
      userMean: round4(acc.wSum > 0 ? acc.raw / acc.wSum : 0),
    });
  }
  return out;
}

/** z = (userMean − normM) / normSD; percentile = Φ(z) × 100. */
export function toPercentile(userMean: number, normMean: number, normSd: number): number {
  if (normSd <= 0) return 50;
  return round2(phi((userMean - normMean) / normSd) * 100);
}

/**
 * Percentile per scale: percentile_table lookup > norm M/SD > fallback score100.
 * The fallback is provisional until own norm data exists (documented in README).
 */
export function computePercentiles(
  scores: ScaleScore[],
  norms: NormEntry[],
): Record<string, number> {
  const normByScale = new Map(norms.map((n) => [n.scaleId, n]));
  const out: Record<string, number> = {};
  for (const s of scores) {
    const norm = normByScale.get(s.scaleId);
    if (norm?.percentileTable) {
      const key = String(Math.round(s.raw));
      out[s.scaleId] = norm.percentileTable[key] ?? s.score100;
    } else if (norm) {
      out[s.scaleId] = toPercentile(s.userMean, norm.normMean, norm.normSd);
    } else {
      out[s.scaleId] = s.score100;
    }
  }
  return out;
}

/** 0–30 gering / 31–60 moderat / 61–80 deutlich / 81–100 stark. Never diagnosis language. */
export function assignBand(score100: number): BandLabel {
  if (score100 <= 30) return 'gering';
  if (score100 <= 60) return 'moderat';
  if (score100 <= 80) return 'deutlich';
  return 'stark';
}

export interface ValidityInput {
  responses: ResponseSet;
  items: ItemDef[];
  responseTimesMs: number[];
  /** score100 of the social-desirability scale, if computed. */
  sdScore100?: number;
}

export function evaluateValidity(input: ValidityInput): ValidityFlags {
  const { responses, items, responseTimesMs, sdScore100 } = input;

  let attentionFail = false;
  for (const item of items) {
    if (!item.isAttentionCheck || item.expectedValue === undefined) continue;
    const v = responses[item.id];
    if (v !== undefined && v !== item.expectedValue) attentionFail = true;
  }

  const times = [...responseTimesMs].sort((a, b) => a - b);
  const median =
    times.length === 0
      ? Infinity
      : times.length % 2
        ? times[(times.length - 1) / 2]
        : (times[times.length / 2 - 1] + times[times.length / 2]) / 2;
  const fastResponding = median < 800;

  // Straightlining: share of the most common answer across substantive core items.
  const substantive = items.filter(
    (i) => i.module === 'core' && !i.isAttentionCheck && responses[i.id] !== undefined,
  );
  const counts = new Map<number, number>();
  for (const i of substantive) {
    const v = responses[i.id];
    counts.set(v, (counts.get(v) ?? 0) + 1);
  }
  const maxCount = Math.max(0, ...counts.values());
  const straightlining = substantive.length > 0 && maxCount / substantive.length > 0.6;

  const sdHigh = (sdScore100 ?? 0) > 80;

  return { attentionFail, fastResponding, straightlining, sdHigh };
}

/**
 * Archetype resolution (Blueprint Deliverable 4):
 * 1. Special rule AuDHD: ADHS > 65 AND Autismus > 65 -> pattern_weaver.
 * 2. No scale > 65 -> all_rounder.
 * 3. Otherwise: per archetype, sum of max(0, dominance − 65) over its key
 *    dimensions (dominance = percentile, inverted for `invert` dims).
 *    Highest sum wins; ties broken by lower `priority`.
 */
export function resolveArchetype(
  percentiles: Record<string, number>,
  archetypes: ArchetypeDef[],
): ArchetypeResult {
  const p = (id: string) => percentiles[id] ?? 0;
  const dominant = Object.entries(percentiles)
    .filter(([id, v]) => v > 65 && id !== 'sd')
    .sort((a, b) => b[1] - a[1])
    .map(([id]) => id);
  const topScales = dominant.slice(0, 3);

  const find = (id: string) => archetypes.find((a) => a.id === id);
  const asResult = (a: ArchetypeDef): ArchetypeResult => ({
    id: a.id,
    nameDe: a.nameDe,
    nameEn: a.nameEn,
    topScales,
  });

  const patternWeaver = find('pattern_weaver');
  if (patternWeaver && p('adhs') > 65 && p('autism') > 65) return asResult(patternWeaver);

  const allRounder = find('all_rounder');
  if (dominant.length === 0 && allRounder) return asResult(allRounder);

  let best: { def: ArchetypeDef; score: number } | null = null;
  for (const a of archetypes) {
    if (a.id === 'pattern_weaver' || a.id === 'all_rounder') continue;
    let score = 0;
    for (const dim of a.dims) {
      const dominance = dim.invert ? 100 - p(dim.scaleId) : p(dim.scaleId);
      score += Math.max(0, dominance - 65);
    }
    if (
      score > 0 &&
      (!best || score > best.score || (score === best.score && a.priority < best.def.priority))
    ) {
      best = { def: a, score };
    }
  }
  if (best) return asResult(best.def);
  if (allRounder) return asResult(allRounder);
  throw new Error('archetype set must contain all_rounder fallback');
}

/**
 * Attachment style from ECR-style dimensions (score100):
 * both < 50 -> sicher; otherwise the higher of anxiety/avoidance decides.
 * (Fearful-avoidant collapses onto the stronger pole — the match matrix has 3 styles.)
 */
export function attachmentStyleFromScores(scores: Record<string, number>): AttachmentStyle {
  const anx = scores['att_anx'] ?? 0;
  const avoid = scores['att_avoid'] ?? 0;
  if (anx < 50 && avoid < 50) return 'sicher';
  return anx >= avoid ? 'aengstlich' : 'vermeidend';
}

const ATTACH_MATRIX: Record<AttachmentStyle, Record<AttachmentStyle, number>> = {
  sicher: { sicher: 95, aengstlich: 75, vermeidend: 75 },
  aengstlich: { sicher: 75, aengstlich: 55, vermeidend: 35 },
  vermeidend: { sicher: 75, aengstlich: 35, vermeidend: 45 },
};

/**
 * match = 0.25·similarity + 0.15·neuroBase + 0.15·agreeBase + 0.25·attachScore + 0.20·loveOverlap
 * (Blueprint Deliverable 6; Malouff 2010 / Heller 2004 / Mikulincer & Shaver 2007.)
 */
export function computeMatch(a: MatchProfile, b: MatchProfile): MatchResult {
  const s = (p: MatchProfile, id: string) => p.scores[id] ?? 50;

  const simOpen = 100 - Math.abs(s(a, 'big5_O') - s(b, 'big5_O'));
  const simConsc = 100 - Math.abs(s(a, 'big5_C') - s(b, 'big5_C'));
  const simValues = 100 - Math.abs(s(a, 'big5_A') - s(b, 'big5_A'));
  const similarity = (simOpen + simConsc + simValues) / 3;

  const neuroBase = 100 - (s(a, 'big5_N') + s(b, 'big5_N')) / 2;
  const agreeBase = (s(a, 'big5_A') + s(b, 'big5_A')) / 2;
  const attachScore = ATTACH_MATRIX[a.attachmentStyle][b.attachmentStyle];
  const loveOverlap = cosine(a.loveVector, b.loveVector) * 100;

  const total =
    0.25 * similarity + 0.15 * neuroBase + 0.15 * agreeBase + 0.25 * attachScore + 0.2 * loveOverlap;

  return {
    total: round2(total),
    similarity: round2(similarity),
    neuroBase: round2(neuroBase),
    agreeBase: round2(agreeBase),
    attachScore,
    loveOverlap: round2(loveOverlap),
  };
}

/**
 * Forced-choice scoring. Each pair is a head-to-head; a style's score is the share
 * of its duels that it won. With a full round robin every style is compared the
 * same number of times, so the result is an honest ranking rather than a set of
 * agreement ratings that all drift high.
 */
export function computeForcedChoice(
  resp: ResponseSet,
  items: ItemDef[],
): Record<string, number> {
  const wins = new Map<string, number>();
  const duels = new Map<string, number>();
  for (const item of items) {
    if (item.responseFormat !== 'choice2' || !item.choice) continue;
    const [scaleA, , scaleB] = item.choice;
    for (const id of [scaleA, scaleB]) duels.set(id, (duels.get(id) ?? 0) + 1);
    const answer = resp[item.id];
    if (answer !== 1 && answer !== 2) continue;
    const winner = answer === 1 ? scaleA : scaleB;
    wins.set(winner, (wins.get(winner) ?? 0) + 1);
  }
  const out: Record<string, number> = {};
  for (const [id, total] of duels) {
    out[id] = total > 0 ? round2((100 * (wins.get(id) ?? 0)) / total) : 0;
  }
  return out;
}

/** PHQ-9 / GAD-7 are scored as plain sums (0–3 metric), separate from the likert engine. */
export function computeWellbeing(
  resp: ResponseSet,
  phq9ItemIds: string[],
  gad7ItemIds: string[],
): WellbeingResult | null {
  const answered = (ids: string[]) => ids.every((id) => resp[id] !== undefined);
  if (!answered(phq9ItemIds) && !answered(gad7ItemIds)) return null;

  const sum = (ids: string[]) => ids.reduce((s, id) => s + (resp[id] ?? 0), 0);
  const phq9Sum = sum(phq9ItemIds);
  const gad7Sum = sum(gad7ItemIds);
  const phq9Item9 = resp[phq9ItemIds[8]] ?? 0;
  const crisis = phq9Item9 > 0 || phq9Sum >= 15;
  return { phq9Sum, gad7Sum, phq9Item9, crisis };
}

function clamp(v: number, lo: number, hi: number): number {
  return Math.min(hi, Math.max(lo, v));
}
function round2(v: number): number {
  return Math.round(v * 100) / 100;
}
function round4(v: number): number {
  return Math.round(v * 10000) / 10000;
}
