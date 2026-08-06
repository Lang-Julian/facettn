// How precisely may a scale be reported?
//
// A score computed from two questions can land on exactly 100, which looks like a
// measurement and is really an artefact of a short scale. Reporting three
// significant digits from two items is the cheapest way to lose the trust of anyone
// who knows psychometrics — so the display resolution follows the item count
// instead of pretending it is uniform.
//
// This is a floor on honesty, not a substitute for reliability data: real precision
// needs Cronbach's alpha from a calibration sample. Until that exists, the rule is
// conservative by design.

import { ITEMS, LOADINGS } from '@/lib/seed/items';

export type Resolution = 'exact' | 'coarse' | 'band';

const primaryItemCount = (() => {
  const count = new Map<string, number>();
  for (const l of LOADINGS) {
    if (l.weight === 1) count.set(l.scaleId, (count.get(l.scaleId) ?? 0) + 1);
  }
  // Forced-choice scales carry no loadings; their items declare the scale directly.
  for (const item of ITEMS) {
    if (!item.choice) continue;
    for (const id of [item.choice[0], item.choice[2]]) {
      count.set(id, (count.get(id) ?? 0) + 1);
    }
  }
  return count;
})();

export function itemsFor(scaleId: string): number {
  return primaryItemCount.get(scaleId) ?? 0;
}

/**
 * ≥6 items: report the value as computed.
 * 4–5 items: round to steps of 5 — the honest resolution at that length.
 * ≤3 items: no number at all, only the band. Anything else overclaims.
 */
export function resolutionFor(scaleId: string): Resolution {
  const n = itemsFor(scaleId);
  if (n >= 6) return 'exact';
  if (n >= 4) return 'coarse';
  return 'band';
}

export function displayValue(scaleId: string, score: number): number | null {
  switch (resolutionFor(scaleId)) {
    case 'exact':
      return Math.round(score);
    case 'coarse':
      return Math.round(score / 5) * 5;
    case 'band':
      return null;
  }
}

/** Explains the display resolution to the reader, or null when nothing is hidden. */
export function precisionNote(scaleId: string): string | null {
  const n = itemsFor(scaleId);
  switch (resolutionFor(scaleId)) {
    case 'exact':
      return null;
    case 'coarse':
      return `Aus ${n} Fragen — auf Fünferschritte gerundet, feiner gibt die Skala es nicht her.`;
    case 'band':
      return `Aus ${n} Fragen — nur als Tendenz lesbar, eine Zahl wäre hier Scheingenauigkeit.`;
  }
}
