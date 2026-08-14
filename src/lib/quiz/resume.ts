// Reconciling a saved quiz state with the current questionnaire.
//
// Progress is kept in localStorage so the test can be paused. That storage outlives
// deploys, which is the whole problem: if the item list changes while someone is
// halfway through, their saved index points into a flow that no longer exists. The
// old code trusted the stored index verbatim, so a mismatched state resumed happily
// and only failed at the very end — after the person had answered another twenty
// questions — because encoding the result requires an answer for every item.
//
// The invariant the quiz maintains while running is simple: the index only ever
// advances together with recording an answer, so position equals answer count. This
// module re-establishes that invariant against the item list as it exists *now*,
// keeping every answer that still refers to a real item and resuming at the first
// genuine gap. Nothing is discarded that can still be used.

export type Wellbeing = 'pending' | 'accepted' | 'skipped';
export type Phase = 'intro' | 'questions' | 'motivator' | 'wellbeing-optin';

export interface StoredQuizState {
  answers: Record<string, number>;
  times: Record<string, number>;
  index: number;
  wellbeing: Wellbeing;
  phase: Phase;
}

const WELLBEING_VALUES: Wellbeing[] = ['pending', 'accepted', 'skipped'];

function isPlainObject(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null && !Array.isArray(v);
}

/** Answers are one small integer per item; anything else is corruption. */
function cleanNumericMap(v: unknown, allowed: Set<string>, max: number): Record<string, number> {
  if (!isPlainObject(v)) return {};
  const out: Record<string, number> = {};
  for (const [key, value] of Object.entries(v)) {
    if (!allowed.has(key)) continue; // item no longer exists
    if (typeof value !== 'number' || !Number.isFinite(value)) continue;
    if (value < 0 || value > max) continue;
    out[key] = value;
  }
  return out;
}

/**
 * Returns a state safe to resume from, or null when there is nothing worth
 * restoring (no usable answers, unreadable storage, or a finished run).
 */
export function reconcileStoredState(
  raw: unknown,
  coreIds: string[],
  wellbeingIds: string[],
): StoredQuizState | null {
  if (!isPlainObject(raw)) return null;

  const wellbeing: Wellbeing = WELLBEING_VALUES.includes(raw.wellbeing as Wellbeing)
    ? (raw.wellbeing as Wellbeing)
    : 'pending';

  const flow = wellbeing === 'accepted' ? [...coreIds, ...wellbeingIds] : coreIds;
  if (flow.length === 0) return null;
  const known = new Set(flow);

  // Answers use a 1–5 Likert or a 1–2 forced choice; times are milliseconds.
  const answers = cleanNumericMap(raw.answers, known, 5);
  const times = cleanNumericMap(raw.times, known, Number.MAX_SAFE_INTEGER);

  // The real invariant is not that position equals answer count — the back button
  // moves the index backwards while keeping the answer — but that everything before
  // the index is answered. So the index may legitimately sit anywhere up to the
  // first gap, and only a position beyond it is corrupt.
  let index = flow.findIndex((id) => !(id in answers));
  const storedIndex = raw.index;
  if (
    index !== -1 &&
    typeof storedIndex === 'number' &&
    Number.isInteger(storedIndex) &&
    storedIndex >= 0 &&
    storedIndex <= index
  ) {
    // Coherent — keep exactly where the person was, including a step back.
    index = storedIndex;
  }

  // A completed core with the wellbeing question still open is not a finished run —
  // the person was sitting on the opt-in screen when they stopped. Send them back
  // there rather than re-asking the last item.
  const atWellbeingOptIn = index === -1 && wellbeing === 'pending';
  if (atWellbeingOptIn) {
    index = coreIds.length;
  } else if (index === -1) {
    // Every current item is answered — the run finished but the result was never
    // encoded. Re-ask the final item so the normal completion path runs.
    index = flow.length - 1;
    delete answers[flow[index]];
  }

  if (index === 0) return null; // nothing meaningful to restore

  const phase: Phase = atWellbeingOptIn ? 'wellbeing-optin' : 'questions';

  // Times without a matching answer would skew the median; drop them.
  for (const id of Object.keys(times)) {
    if (!(id in answers)) delete times[id];
  }

  return { answers, times, index, wellbeing, phase };
}
