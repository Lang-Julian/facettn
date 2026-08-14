import { describe, expect, it } from 'vitest';
import { reconcileStoredState } from '../quiz/resume';

// The live site was found holding a saved state claiming index 170 with two answers
// stored. Resuming from that would have had someone answer another two dozen
// questions and then fail at the finish line, because encoding needs an answer for
// every item. These tests pin the repair.

const CORE = ['a', 'b', 'c', 'd', 'e'];
const WB = ['w1', 'w2'];
const ans = (...ids: string[]) => Object.fromEntries(ids.map((id) => [id, 3]));

const reconcile = (raw: unknown) => reconcileStoredState(raw, CORE, WB);

describe('reconcileStoredState', () => {
  it('repairs an index that outruns the answers', () => {
    const s = reconcile({ answers: ans('a', 'b'), times: {}, index: 170, wellbeing: 'pending' });
    expect(s?.index).toBe(2);
    expect(Object.keys(s!.answers)).toEqual(['a', 'b']);
  });

  it('keeps a coherent state untouched', () => {
    const s = reconcile({ answers: ans('a', 'b', 'c'), times: {}, index: 3, wellbeing: 'pending' });
    expect(s?.index).toBe(3);
  });

  it('drops answers for items that no longer exist and resumes at the real gap', () => {
    const s = reconcile({ answers: ans('a', 'geloescht', 'c'), times: {}, index: 3, wellbeing: 'pending' });
    expect(s?.index).toBe(1); // 'b' is now the first unanswered item
    expect(s?.answers).not.toHaveProperty('geloescht');
    expect(s?.answers).toHaveProperty('c'); // still usable, not thrown away
  });

  it('resumes into the wellbeing opt-in when the core is done', () => {
    const s = reconcile({ answers: ans(...CORE), times: {}, index: 5, wellbeing: 'pending' });
    expect(s?.phase).toBe('wellbeing-optin');
    expect(s?.index).toBe(5);
  });

  it('includes the wellbeing items once accepted', () => {
    const s = reconcile({ answers: ans(...CORE), times: {}, index: 5, wellbeing: 'accepted' });
    expect(s?.index).toBe(5);
    expect(s?.phase).toBe('questions');
  });

  it('re-asks the last item when everything is answered but never submitted', () => {
    const s = reconcile({ answers: ans(...CORE), times: {}, index: 5, wellbeing: 'skipped' });
    expect(s?.index).toBe(4);
    expect(s?.answers).not.toHaveProperty('e');
  });

  it('preserves a position reached with the back button', () => {
    // Back keeps the answer and only moves the index, so answers may legitimately
    // outnumber the position. Resuming must land where the person actually was.
    const s = reconcile({ answers: ans('a', 'b', 'c'), times: {}, index: 1, wellbeing: 'pending' });
    expect(s?.index).toBe(1);
    expect(Object.keys(s!.answers)).toHaveLength(3);
  });

  it('still repairs a position that runs past the first gap', () => {
    const s = reconcile({ answers: ans('a', 'b'), times: {}, index: 4, wellbeing: 'pending' });
    expect(s?.index).toBe(2);
  });

  it('returns null when there is nothing to resume', () => {
    expect(reconcile({ answers: {}, times: {}, index: 0, wellbeing: 'pending' })).toBeNull();
    expect(reconcile({ answers: ans('b'), times: {}, index: 1, wellbeing: 'pending' })).toBeNull();
  });

  it('survives garbage without throwing', () => {
    for (const junk of [null, undefined, 42, 'text', [], { answers: 'nope' }, { answers: { a: 'x' } }]) {
      expect(() => reconcile(junk)).not.toThrow();
    }
    expect(reconcile({ answers: { a: 99 }, times: {}, index: 1, wellbeing: 'pending' })).toBeNull();
  });

  it('discards timings that have no matching answer', () => {
    const s = reconcile({ answers: ans('a', 'b'), times: { a: 900, c: 900 }, index: 2, wellbeing: 'pending' });
    expect(s?.times).toEqual({ a: 900 });
  });
});
