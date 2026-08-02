// The URL payload codec — this is where "nothing is stored" becomes literally true.
//
// A result lives entirely in the URL fragment (`/ergebnis#v1.4231…`). Browsers never
// transmit the fragment to a server: it is not in the HTTP request line, not in
// Referer headers, not in access logs. So the link is a complete, portable result
// that only ever exists on the devices that hold it.
//
// The encoding is deliberately boring and human-readable rather than clever: one
// digit per answer, in the canonical item order, prefixed by a format version.
// Anyone can decode their own link by hand and see exactly what it contains — which
// is the entire point of an auditable, open-source instrument.
//
//   v1.<core answers, 1 digit each><.wellbeing answers, 1 digit each>
//
// Version bumps are required whenever the item order changes, so an old link can
// never be silently reinterpreted against a newer questionnaire.

import { PAYLOAD_ORDER_CORE, PAYLOAD_ORDER_WELLBEING } from '@/lib/seed/items';

export const PAYLOAD_VERSION = 'v1';

export interface DecodedPayload {
  answers: Record<string, number>;
  hasWellbeing: boolean;
}

export class PayloadError extends Error {}

/**
 * Encode answers into the fragment string. Core answers are required and must be
 * complete; the wellbeing block is optional and appended after a dot.
 */
export function encodePayload(answers: Record<string, number>): string {
  const core = PAYLOAD_ORDER_CORE.map((id) => {
    const v = answers[id];
    if (v === undefined) throw new PayloadError(`missing answer for item ${id}`);
    if (!Number.isInteger(v) || v < 1 || v > 5) {
      throw new PayloadError(`answer for ${id} out of range: ${v}`);
    }
    return String(v);
  }).join('');

  const wellbeingAnswered = PAYLOAD_ORDER_WELLBEING.every((id) => answers[id] !== undefined);
  if (!wellbeingAnswered) return `${PAYLOAD_VERSION}.${core}`;

  const wellbeing = PAYLOAD_ORDER_WELLBEING.map((id) => {
    const v = answers[id];
    if (!Number.isInteger(v) || v < 0 || v > 3) {
      throw new PayloadError(`wellbeing answer for ${id} out of range: ${v}`);
    }
    return String(v);
  }).join('');

  return `${PAYLOAD_VERSION}.${core}.${wellbeing}`;
}

export function decodePayload(raw: string): DecodedPayload {
  const payload = raw.replace(/^#/, '').trim();
  const parts = payload.split('.');
  if (parts.length < 2 || parts.length > 3) {
    throw new PayloadError('Der Link hat kein gültiges Format.');
  }
  const [version, core, wellbeing] = parts;
  if (version !== PAYLOAD_VERSION) {
    throw new PayloadError(
      `Dieser Link stammt aus einer anderen Version des Tests (${version}) und kann nicht mehr eingelesen werden.`,
    );
  }
  if (core.length !== PAYLOAD_ORDER_CORE.length || !/^[1-5]+$/.test(core)) {
    throw new PayloadError('Die Antworten im Link sind unvollständig oder beschädigt.');
  }

  const answers: Record<string, number> = {};
  PAYLOAD_ORDER_CORE.forEach((id, i) => {
    answers[id] = Number(core[i]);
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

  return { answers, hasWellbeing };
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
  return parts.slice(0, 2).join('.');
}

/** Pull a payload out of a full URL or accept a bare payload / fragment. */
export function extractPayload(input: string): string | null {
  const trimmed = input.trim();
  if (!trimmed) return null;
  const hash = trimmed.indexOf('#');
  const candidate = hash >= 0 ? trimmed.slice(hash + 1) : trimmed;
  return candidate.startsWith(`${PAYLOAD_VERSION}.`) ? candidate : null;
}
