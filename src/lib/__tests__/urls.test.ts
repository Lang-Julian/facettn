import { describe, expect, it } from 'vitest';
import { sitePath } from '../urls';

// Regression guard. The live site shipped share links without the base path, so
// every copied link 404'd. Locally the base path is empty, which is exactly why
// the defect was invisible — these tests pin the shape rather than the value.

describe('sitePath', () => {
  it('ends in a slash, because trailingSlash: true means /pfad/ is the real file', () => {
    expect(sitePath('/ergebnis')).toMatch(/\/ergebnis\/$/);
    expect(sitePath('/vergleich')).toMatch(/\/vergleich\/$/);
  });

  it('does not double the slash when one is already there', () => {
    expect(sitePath('/ergebnis/')).toBe(sitePath('/ergebnis'));
    expect(sitePath('/ergebnis')).not.toContain('//');
  });

  it('tolerates a missing leading slash', () => {
    expect(sitePath('ergebnis')).toBe(sitePath('/ergebnis'));
  });

  it('carries the configured base path', () => {
    const base = process.env.NEXT_PUBLIC_BASE_PATH ?? '';
    expect(sitePath('/ergebnis')).toBe(`${base}/ergebnis/`);
  });
});
