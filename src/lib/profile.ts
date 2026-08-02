// Turns a decoded payload into the full profile the result page renders.
// Runs in the browser — the answers never leave the device.

import {
  assignBand,
  attachmentStyleFromScores,
  computePercentiles,
  computeScaleScores,
  computeWellbeing,
  evaluateValidity,
  resolveArchetype,
} from '@/lib/engine/scoring';
import type { AttachmentStyle, BandLabel, ValidityFlags } from '@/lib/engine/types';
import { ITEMS, LOADINGS, PHQ9_ITEM_IDS, GAD7_ITEM_IDS } from '@/lib/seed/items';
import { NORMS } from '@/lib/seed/norms';
import { ARCHETYPES, ARCHETYPE_BY_ID } from '@/lib/seed/archetypes';
import type { ArchetypeDef } from '@/lib/engine/types';
import { detectPatterns, type DetectedPattern } from '@/lib/content/patterns';

export interface Profile {
  scores: Record<string, number>;
  percentiles: Record<string, number>;
  bands: Record<string, BandLabel>;
  validity: ValidityFlags;
  attachmentStyle: AttachmentStyle;
  archetype: ArchetypeDef;
  patterns: DetectedPattern[];
  wellbeing: { phq9Sum: number; gad7Sum: number; crisis: boolean } | null;
  crisis: boolean;
}

/** Scales that are internal machinery rather than something to report. */
const HIDDEN = new Set(['sd', 'phq9', 'gad7']);

export function buildProfile(
  answers: Record<string, number>,
  responseTimesMs: number[] = [],
): Profile {
  const scaleScores = computeScaleScores(answers, ITEMS, LOADINGS);

  const scores: Record<string, number> = {};
  const bands: Record<string, BandLabel> = {};
  for (const s of scaleScores) {
    scores[s.scaleId] = s.score100;
    bands[s.scaleId] = assignBand(s.score100);
  }

  const percentiles = computePercentiles(scaleScores, NORMS);

  const validity = evaluateValidity({
    responses: answers,
    items: ITEMS,
    responseTimesMs,
    sdScore100: scores['sd'],
  });

  const wellbeingRaw = computeWellbeing(answers, PHQ9_ITEM_IDS, GAD7_ITEM_IDS);

  const reportable: Record<string, number> = {};
  for (const [id, v] of Object.entries(percentiles)) {
    if (!HIDDEN.has(id)) reportable[id] = v;
  }
  const archetypeResult = resolveArchetype(reportable, ARCHETYPES);
  const archetype = ARCHETYPE_BY_ID.get(archetypeResult.id) ?? ARCHETYPES[ARCHETYPES.length - 1];

  const attachmentStyle = attachmentStyleFromScores(scores);

  return {
    scores,
    percentiles,
    bands,
    validity,
    attachmentStyle,
    archetype,
    patterns: detectPatterns(scores, attachmentStyle),
    wellbeing: wellbeingRaw
      ? { phq9Sum: wellbeingRaw.phq9Sum, gad7Sum: wellbeingRaw.gad7Sum, crisis: wellbeingRaw.crisis }
      : null,
    crisis: wellbeingRaw?.crisis ?? false,
  };
}
