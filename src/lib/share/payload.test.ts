import { describe, expect, it } from 'vitest';
import {
  decodePayload,
  encodePayload,
  extractPayload,
  PayloadError,
  PAYLOAD_VERSION,
  stripWellbeing,
} from './payload';
import { ITEMS, PAYLOAD_ORDER_CORE, PAYLOAD_ORDER_WELLBEING } from '@/lib/seed/items';

const FORMAT = new Map(ITEMS.map((i) => [i.id, i.responseFormat]));

// Forced-choice items only accept 1 or 2, so a generator has to respect the format.
const coreAnswers = (fn: (i: number) => number = (i) => (i % 5) + 1) =>
  Object.fromEntries(
    PAYLOAD_ORDER_CORE.map((id, i) => [
      id,
      FORMAT.get(id) === 'choice2' ? (i % 2) + 1 : fn(i),
    ]),
  );
const wellbeingAnswers = (fn: (i: number) => number = (i) => i % 4) =>
  Object.fromEntries(PAYLOAD_ORDER_WELLBEING.map((id, i) => [id, fn(i)]));

describe('payload codec', () => {
  it('round-trips core answers', () => {
    const answers = coreAnswers();
    const decoded = decodePayload(encodePayload(answers));
    expect(decoded.answers).toEqual(answers);
    expect(decoded.hasWellbeing).toBe(false);
  });

  it('round-trips core + wellbeing answers', () => {
    const answers = { ...coreAnswers(), ...wellbeingAnswers() };
    const decoded = decodePayload(encodePayload(answers));
    expect(decoded.answers).toEqual(answers);
    expect(decoded.hasWellbeing).toBe(true);
  });

  it('is one readable digit per answer plus a meta digit', () => {
    const payload = encodePayload(coreAnswers(() => 3));
    const [version, core, meta] = payload.split('.');
    expect(version).toBe(PAYLOAD_VERSION);
    expect(core).toHaveLength(PAYLOAD_ORDER_CORE.length);
    expect(meta).toMatch(/^[0-9]$/);
  });

  it('round-trips the response-time bucket', () => {
    const payload = encodePayload(coreAnswers(), 2600);
    const decoded = decodePayload(payload);
    // Stored as a bucket, so the value returns as that bucket's midpoint.
    expect(decoded.medianResponseMs).toBeGreaterThan(2000);
    expect(decoded.medianResponseMs).toBeLessThan(3100);
  });

  it('omits timing gracefully when it was never measured', () => {
    expect(decodePayload(encodePayload(coreAnswers())).medianResponseMs).toBeNull();
  });

  it('rejects a Likert value on a forced-choice item', () => {
    const answers = coreAnswers();
    const fcId = PAYLOAD_ORDER_CORE.find((id) => FORMAT.get(id) === 'choice2')!;
    expect(() => encodePayload({ ...answers, [fcId]: 5 })).toThrow(PayloadError);
  });

  it('stays short enough for a URL', () => {
    const payload = encodePayload({ ...coreAnswers(), ...wellbeingAnswers() });
    expect(payload.length).toBeLessThan(300);
  });

  it('rejects an incomplete answer set', () => {
    const answers = coreAnswers();
    delete answers[PAYLOAD_ORDER_CORE[3]];
    expect(() => encodePayload(answers)).toThrow(PayloadError);
  });

  it('rejects out-of-range answers', () => {
    expect(() => encodePayload({ ...coreAnswers(), [PAYLOAD_ORDER_CORE[0]]: 9 })).toThrow(PayloadError);
  });

  it('rejects a foreign version rather than misreading it', () => {
    const payload = encodePayload(coreAnswers()).replace('v3.', 'v4.');
    expect(() => decodePayload(payload)).toThrow(/andere[nr]? Version/i);
  });

  it('rejects a truncated payload', () => {
    const payload = encodePayload(coreAnswers()).slice(0, -5);
    expect(() => decodePayload(payload)).toThrow(PayloadError);
  });

  it('rejects non-digit noise', () => {
    const payload = `${PAYLOAD_VERSION}.${'x'.repeat(PAYLOAD_ORDER_CORE.length)}`;
    expect(() => decodePayload(payload)).toThrow(PayloadError);
  });

  it('tolerates a leading hash', () => {
    const payload = encodePayload(coreAnswers());
    expect(decodePayload(`#${payload}`).answers).toEqual(coreAnswers());
  });
});

describe('stripWellbeing', () => {
  it('removes the wellbeing block so shared links cannot carry it', () => {
    const full = encodePayload({ ...coreAnswers(), ...wellbeingAnswers() });
    const shared = stripWellbeing(full);
    expect(decodePayload(full).hasWellbeing).toBe(true);
    expect(decodePayload(shared).hasWellbeing).toBe(false);
  });

  it('leaves a core-only payload untouched', () => {
    const core = encodePayload(coreAnswers());
    expect(stripWellbeing(core)).toBe(core);
  });
});

describe('extractPayload', () => {
  const payload = encodePayload(coreAnswers());

  it('pulls the payload out of a full URL', () => {
    expect(extractPayload(`https://facettn.de/ergebnis#${payload}`)).toBe(payload);
  });

  it('accepts a bare payload', () => {
    expect(extractPayload(payload)).toBe(payload);
  });

  it('rejects a URL without a payload', () => {
    expect(extractPayload('https://facettn.de/ergebnis')).toBeNull();
    expect(extractPayload('')).toBeNull();
  });
});
