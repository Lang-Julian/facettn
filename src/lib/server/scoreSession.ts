// Glue between seed data, engine and store: turns a completed session's responses
// into a persisted result. Runs SERVER-SIDE ONLY (the client is never source of truth).

import {
  assignBand,
  attachmentStyleFromScores,
  computePercentiles,
  computeScaleScores,
  computeWellbeing,
  evaluateValidity,
  resolveArchetype,
} from '@/lib/engine/scoring';
import type { ResponseSet } from '@/lib/engine/types';
import { ITEMS, PHQ9_ITEM_IDS, GAD7_ITEM_IDS } from '@/lib/seed/items';
import { LOADINGS } from '@/lib/seed/loadings';
import { NORMS } from '@/lib/seed/norms';
import { ARCHETYPES } from '@/lib/seed/archetypes';
import type { ResponseRow } from '@/lib/store/types';

export interface ScoredSession {
  scores: Record<string, number>;
  percentiles: Record<string, number>;
  bands: Record<string, string>;
  validity: ReturnType<typeof evaluateValidity>;
  crisis: boolean;
  archetypeId: string;
  wellbeing: { phq9Sum: number; gad7Sum: number } | null;
  attachmentStyle: ReturnType<typeof attachmentStyleFromScores>;
}

const SUBSTANTIVE_CORE = ITEMS.filter(
  (i) => i.module === 'core' && !i.isAttentionCheck,
);

export function missingCoreItems(rows: ResponseRow[]): string[] {
  const answered = new Set(rows.map((r) => r.itemId));
  return SUBSTANTIVE_CORE.filter((i) => !answered.has(i.id)).map((i) => i.id);
}

export function scoreSession(rows: ResponseRow[]): ScoredSession {
  const resp: ResponseSet = Object.fromEntries(rows.map((r) => [r.itemId, r.value]));
  const times = rows.map((r) => r.responseTimeMs).filter((t) => t > 0);

  const scaleScores = computeScaleScores(resp, ITEMS, LOADINGS);
  const scores: Record<string, number> = {};
  for (const s of scaleScores) scores[s.scaleId] = s.score100;

  const percentiles = computePercentiles(scaleScores, NORMS);
  const bands: Record<string, string> = {};
  for (const s of scaleScores) bands[s.scaleId] = assignBand(s.score100);

  const validity = evaluateValidity({
    responses: resp,
    items: ITEMS,
    responseTimesMs: times,
    sdScore100: scores['sd'],
  });

  const wellbeing = computeWellbeing(resp, PHQ9_ITEM_IDS, GAD7_ITEM_IDS);
  if (wellbeing) {
    scores['phq9'] = wellbeing.phq9Sum;
    scores['gad7'] = wellbeing.gad7Sum;
    // PHQ-9/GAD-7 percentiles from published norms on the SUM metric.
    const phqNorm = NORMS.find((n) => n.scaleId === 'phq9');
    const gadNorm = NORMS.find((n) => n.scaleId === 'gad7');
    if (phqNorm) {
      percentiles['phq9'] = Math.round(
        100 *
          (0.5 +
            0.5 *
              erfApprox((wellbeing.phq9Sum - phqNorm.normMean) / (phqNorm.normSd * Math.SQRT2))),
      );
    }
    if (gadNorm) {
      percentiles['gad7'] = Math.round(
        100 *
          (0.5 +
            0.5 *
              erfApprox((wellbeing.gad7Sum - gadNorm.normMean) / (gadNorm.normSd * Math.SQRT2))),
      );
    }
  }

  // Archetype from percentiles of the display scales only (exclude validity/wellbeing).
  const displayPercentiles: Record<string, number> = {};
  for (const [k, v] of Object.entries(percentiles)) {
    if (k !== 'sd' && k !== 'phq9' && k !== 'gad7') displayPercentiles[k] = v;
  }
  const archetype = resolveArchetype(displayPercentiles, ARCHETYPES);

  return {
    scores,
    percentiles,
    bands,
    validity,
    crisis: wellbeing?.crisis ?? false,
    archetypeId: archetype.id,
    wellbeing: wellbeing ? { phq9Sum: wellbeing.phq9Sum, gad7Sum: wellbeing.gad7Sum } : null,
    attachmentStyle: attachmentStyleFromScores(scores),
  };
}

// Abramowitz–Stegun erf approximation (matches engine phi within tolerance).
function erfApprox(x: number): number {
  const sign = x < 0 ? -1 : 1;
  const ax = Math.abs(x);
  const t = 1 / (1 + 0.3275911 * ax);
  const y =
    1 -
    ((((1.061405429 * t - 1.453152027) * t + 1.421413741) * t - 0.284496736) * t + 0.254829592) *
      t *
      Math.exp(-ax * ax);
  return sign * y;
}
