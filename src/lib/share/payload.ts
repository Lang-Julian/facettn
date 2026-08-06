// The URL payload codec — this is where "nothing is stored" becomes literally true.
//
// A result lives entirely in the URL fragment (`/ergebnis#v2.4231…`). Browsers never
// transmit the fragment to a server: it is not in the HTTP request line, not in
// Referer headers, not in access logs. So the link is a complete, portable result
// that only ever exists on the devices that hold it.
//
// The encoding is deliberately boring and human-readable rather than clever: one
// digit per answer, in the canonical item order, prefixed by a format version.
// Anyone can decode their own link by hand and see exactly what it contains — which
// is the entire point of an auditable, open-source instrument.
//
//   v2.<core answers><.meta>[.<wellbeing answers>]
//
// `meta` is a single digit carrying the median response time as a coarse bucket.
// It exists so the "answered very fast" validity hint can actually fire: the result
// page rebuilds everything from the link, so anything it needs must travel in the
// link. A bucket rather than raw timings keeps it useless as a fingerprint.
//
// Version bumps are required whenever the item order or format changes, so an old
// link can never be silently reinterpreted against a newer questionnaire.

import { ITEMS, PAYLOAD_ORDER_CORE, PAYLOAD_ORDER_WELLBEING } from '@/lib/seed/items';

export const PAYLOAD_VERSION = 'v2';

/** Milliseconds per bucket step; bucket 1 means "under 500 ms per item". */
const RT_BUCKET_MS = 500;
const RT_UNKNOWN = 0;

export interface DecodedPayload {
  answers: Record<string, number>;
  hasWellbeing: boolean;
  /** Median milliseconds per answer, reconstructed from the bucket; null if absent. */
  medianResponseMs: number | null;
}

export class PayloadError extends Error {}

/** Allowed answer range per item: forced choice is 1–2, Likert 1–5. */
const RANGE = new Map<string, [number, number]>(
  ITEMS.filter((i) => i.module === 'core').map((i) => [
    i.id,
    i.responseFormat === 'choice2' ? ([1, 2] as [number, number]) : ([1, 5] as [number, number]),
  ]),
);

export function encodeResponseTimeBucket(medianMs: number | null | undefined): number {
  if (medianMs === null || medianMs === undefined || !Number.isFinite(medianMs) || medianMs <= 0) {
    return RT_UNKNOWN;
  }
  return Math.min(9, Math.max(1, Math.ceil(medianMs / RT_BUCKET_MS)));
}

function decodeResponseTimeBucket(bucket: number): number | null {
  if (bucket === RT_UNKNOWN) return null;
  // Mid-point of the bucket, so a value round-trips into the same bucket again.
  return bucket * RT_BUCKET_MS - RT_BUCKET_MS / 2;
}

/**
 * Encode answers into the fragment string. Core answers are required and must be
 * complete; the wellbeing block is optional and appended after the meta digit.
 */
export function encodePayload(
  answers: Record<string, number>,
  medianResponseMs?: number | null,
): string {
  const core = PAYLOAD_ORDER_CORE.map((id) => {
    const v = answers[id];
    if (v === undefined) throw new PayloadError(`missing answer for item ${id}`);
    const [lo, hi] = RANGE.get(id) ?? [1, 5];
    if (!Number.isInteger(v) || v < lo || v > hi) {
      throw new PayloadError(`answer for ${id} out of range: ${v}`);
    }
    return String(v);
  }).join('');

  const meta = String(encodeResponseTimeBucket(medianResponseMs));

  const wellbeingAnswered = PAYLOAD_ORDER_WELLBEING.every((id) => answers[id] !== undefined);
  if (!wellbeingAnswered) return `${PAYLOAD_VERSION}.${core}.${meta}`;

  const wellbeing = PAYLOAD_ORDER_WELLBEING.map((id) => {
    const v = answers[id];
    if (!Number.isInteger(v) || v < 0 || v > 3) {
      throw new PayloadError(`wellbeing answer for ${id} out of range: ${v}`);
    }
    return String(v);
  }).join('');

  return `${PAYLOAD_VERSION}.${core}.${meta}.${wellbeing}`;
}

export function decodePayload(raw: string): DecodedPayload {
  const payload = raw.replace(/^#/, '').trim();
  const parts = payload.split('.');
  if (parts.length < 3 || parts.length > 4) {
    throw new PayloadError('Der Link hat kein gültiges Format.');
  }
  const [version, core, meta, wellbeing] = parts;
  if (version !== PAYLOAD_VERSION) {
    throw new PayloadError(
      `Dieser Link stammt aus einer anderen Version des Tests (${version}) und kann nicht mehr eingelesen werden.`,
    );
  }
  if (core.length !== PAYLOAD_ORDER_CORE.length || !/^[1-5]+$/.test(core)) {
    throw new PayloadError('Die Antworten im Link sind unvollständig oder beschädigt.');
  }
  if (!/^[0-9]$/.test(meta)) {
    throw new PayloadError('Die Zusatzinformation im Link ist beschädigt.');
  }

  const answers: Record<string, number> = {};
  PAYLOAD_ORDER_CORE.forEach((id, i) => {
    const v = Number(core[i]);
    const [lo, hi] = RANGE.get(id) ?? [1, 5];
    if (v < lo || v > hi) {
      throw new PayloadError(`Die Antwort für Frage ${i + 1} passt nicht zum Antwortformat.`);
    }
    answers[id] = v;
  });

  let hasWellbeing = false;
  if (wellbeing !== undefined) {
    if (wellbeing.length !== PAYLOAD_ORDER_WELLBEING.length || !/^[0-3]+$/.test(wellbeing)) {
      throw new PayloadError('Der optionale Wohlbefindens-Teil des Links ist beschädigt.');
    }
    PAYLOAD_ORDER_WELLBEING.forEach((id, i) => {
      answers[id] = Number(wellbeing[i]);
    });
    hasWellbeing = true;
  }

  return {
    answers,
    hasWellbeing,
    medianResponseMs: decodeResponseTimeBucket(Number(meta)),
  };
}

/**
 * Drop the wellbeing block from a payload.
 *
 * Used for every *share* link: the wellbeing module contains the item about
 * self-harm, and a shared link must never carry that. The personal link keeps it,
 * the shared one cannot.
 */
export function stripWellbeing(payload: string): string {
  const parts = payload.replace(/^#/, '').split('.');
  return parts.slice(0, 3).join('.');
}

/** Pull a payload out of a full URL or accept a bare payload / fragment. */
export function extractPayload(input: string): string | null {
  const trimmed = input.trim();
  if (!trimmed) return null;
  const hash = trimmed.indexOf('#');
  const candidate = hash >= 0 ? trimmed.slice(hash + 1) : trimmed;
  return candidate.startsWith(`${PAYLOAD_VERSION}.`) ? candidate : null;
}
