import { describe, expect, it } from 'vitest';
import {
  decodePayload,
  encodePayload,
  extractPayload,
  PayloadError,
  PAYLOAD_VERSION,
  stripWellbeing,
} from './payload';
import { PAYLOAD_ORDER_CORE, PAYLOAD_ORDER_WELLBEING } from '@/lib/seed/items';

const coreAnswers = (fn: (i: number) => number = (i) => (i % 5) + 1) =>
  Object.fromEntries(PAYLOAD_ORDER_CORE.map((id, i) => [id, fn(i)]));
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

  it('is one readable digit per answer', () => {
    const payload = encodePayload(coreAnswers(() => 3));
    expect(payload).toBe(`${PAYLOAD_VERSION}.${'3'.repeat(PAYLOAD_ORDER_CORE.length)}`);
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
    const payload = encodePayload(coreAnswers()).replace('v1.', 'v2.');
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
