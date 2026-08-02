// Engine unit tests — fixtures 1–5 from Dev-Spec §5 are mandatory, plus
// property checks, archetype rules, validity logic and wellbeing guardrail.

import { describe, expect, it } from 'vitest';
import {
  assignBand,
  attachmentStyleFromScores,
  computeMatch,
  computeScaleScores,
  computeWellbeing,
  cosine,
  evaluateValidity,
  phi,
  resolveArchetype,
  reverseCode,
  toPercentile,
} from './scoring';
import type { ItemDef, Loading } from './types';
import { ITEMS, LOADINGS, PHQ9_ITEM_IDS, GAD7_ITEM_IDS, CORE_ITEMS } from '@/lib/seed/items';
import { ARCHETYPES } from '@/lib/seed/archetypes';
import { SCALES } from '@/lib/seed/scales';

const item = (id: string, over: Partial<ItemDef> = {}): ItemDef => ({
  id,
  position: 1,
  textDe: id,
  block: 1,
  isAttentionCheck: false,
  isSocialDesirability: false,
  module: 'core',
  responseFormat: 'likert5',
  reverse: false,
  ...over,
});

describe('fixture 1 — simple scale normalization', () => {
  it('two items w=1.0/+1, answers 4 and 5 -> 87.5, band stark', () => {
    const items = [item('a'), item('b')];
    const loadings: Loading[] = [
      { itemId: 'a', scaleId: 'x', weight: 1, direction: 1 },
      { itemId: 'b', scaleId: 'x', weight: 1, direction: 1 },
    ];
    const [s] = computeScaleScores({ a: 4, b: 5 }, items, loadings);
    expect(s.raw).toBe(9);
    expect(s.score100).toBe(87.5);
    expect(assignBand(s.score100)).toBe('stark');
  });
});

describe('fixture 2 — reverse item', () => {
  it('reverse=true, answer 2 -> value 4 -> 75, band deutlich', () => {
    const items = [item('a', { reverse: true })];
    const loadings: Loading[] = [{ itemId: 'a', scaleId: 'x', weight: 1, direction: 1 }];
    const [s] = computeScaleScores({ a: 2 }, items, loadings);
    expect(s.raw).toBe(4);
    expect(s.score100).toBe(75);
    expect(assignBand(s.score100)).toBe('deutlich');
  });

  it('direction -1 is equivalent to reverse coding', () => {
    const items = [item('a')];
    const loadings: Loading[] = [{ itemId: 'a', scaleId: 'x', weight: 1, direction: -1 }];
    const [s] = computeScaleScores({ a: 2 }, items, loadings);
    expect(s.score100).toBe(75);
  });
});

describe('fixture 3 — cross-loading with secondary weight', () => {
  it('A(w=1.0, ans 5) + B(w=0.5, ans 3) -> 83.33, band stark', () => {
    const items = [item('a'), item('b')];
    const loadings: Loading[] = [
      { itemId: 'a', scaleId: 'x', weight: 1, direction: 1 },
      { itemId: 'b', scaleId: 'x', weight: 0.5, direction: 1 },
    ];
    const [s] = computeScaleScores({ a: 5, b: 3 }, items, loadings);
    expect(s.raw).toBe(6.5);
    expect(s.score100).toBeCloseTo(83.33, 1);
    expect(assignBand(s.score100)).toBe('stark');
  });
});

describe('fixture 4 — percentile via BFI-2 N norms', () => {
  it('userMean 3.5 vs M=2.72/SD=0.67 -> ~87.8 (±1)', () => {
    const p = toPercentile(3.5, 2.72, 0.67);
    expect(p).toBeGreaterThan(86.8);
    expect(p).toBeLessThan(88.8);
  });
});

describe('fixture 5 — match components', () => {
  it('sicher × ängstlich -> attach 75; love cosine ≈ 97.78', () => {
    const a = {
      scores: { big5_O: 50, big5_C: 50, big5_A: 50, big5_N: 50 },
      attachmentStyle: 'sicher' as const,
      loveVector: [5, 4, 3, 2, 1, 0],
    };
    const b = {
      scores: { big5_O: 50, big5_C: 50, big5_A: 50, big5_N: 50 },
      attachmentStyle: 'aengstlich' as const,
      loveVector: [4, 4, 2, 2, 1, 1],
    };
    const m = computeMatch(a, b);
    expect(m.attachScore).toBe(75);
    expect(m.loveOverlap).toBeCloseTo(97.78, 1);
    // weights sum to 1.0 -> total inside [0,100]
    expect(m.total).toBeGreaterThan(0);
    expect(m.total).toBeLessThanOrEqual(100);
  });

  it('cosine of identical vectors is 1', () => {
    expect(cosine([1, 2, 3], [1, 2, 3])).toBeCloseTo(1, 10);
  });
});

describe('properties', () => {
  it('score100 is always within 0..100 over the full seed matrix', () => {
    for (const fill of [1, 3, 5]) {
      const resp: Record<string, number> = {};
      for (const i of CORE_ITEMS) resp[i.id] = fill;
      const scores = computeScaleScores(resp, ITEMS, LOADINGS);
      for (const s of scores) {
        expect(s.score100).toBeGreaterThanOrEqual(0);
        expect(s.score100).toBeLessThanOrEqual(100);
      }
    }
  });

  it('reverse coding is self-inverse', () => {
    for (const v of [1, 2, 3, 4, 5]) expect(reverseCode(reverseCode(v))).toBe(v);
  });

  it('phi is a CDF: monotone, phi(0)=0.5', () => {
    expect(phi(0)).toBeCloseTo(0.5, 6);
    expect(phi(-2)).toBeLessThan(phi(-1));
    expect(phi(1)).toBeLessThan(phi(2));
    expect(phi(3)).toBeGreaterThan(0.998);
  });

  it('band boundaries', () => {
    expect(assignBand(0)).toBe('gering');
    expect(assignBand(30)).toBe('gering');
    expect(assignBand(31)).toBe('moderat');
    expect(assignBand(60)).toBe('moderat');
    expect(assignBand(61)).toBe('deutlich');
    expect(assignBand(80)).toBe('deutlich');
    expect(assignBand(81)).toBe('stark');
    expect(assignBand(100)).toBe('stark');
  });
});

describe('archetype resolution', () => {
  const base = Object.fromEntries(
    ['big5_E', 'big5_A', 'big5_C', 'big5_N', 'big5_O', 'adhs', 'autism', 'masking',
     'dark_mean', 'dark_bold', 'dark_disinh', 'dark_grand', 'emp_cog', 'emp_aff',
     'att_anx', 'att_avoid', 'att_secure', 'hsp', 'rejection_sens', 'alexithymia',
     'love_klartext', 'love_momente', 'love_anpacken', 'love_naehe', 'love_wachstum', 'love_zeichen',
    ].map((id) => [id, 50]),
  );

  it('AuDHD special rule -> pattern_weaver', () => {
    const r = resolveArchetype({ ...base, adhs: 80, autism: 72, big5_O: 90 }, ARCHETYPES);
    expect(r.id).toBe('pattern_weaver');
  });

  it('no scale > 65 -> all_rounder', () => {
    const r = resolveArchetype(base, ARCHETYPES);
    expect(r.id).toBe('all_rounder');
  });

  it('masking + autism + N -> chameleon', () => {
    const r = resolveArchetype({ ...base, masking: 92, autism: 78, big5_N: 70 }, ARCHETYPES);
    expect(r.id).toBe('chameleon');
  });

  it('secure + agreeable + conscientious -> anchor', () => {
    const r = resolveArchetype({ ...base, att_secure: 88, big5_A: 80, big5_C: 75 }, ARCHETYPES);
    expect(r.id).toBe('anchor');
  });

  it('inverted dims count (bold strategist needs LOW N)', () => {
    const r = resolveArchetype({ ...base, dark_bold: 85, big5_C: 80, big5_N: 10 }, ARCHETYPES);
    expect(r.id).toBe('bold_strategist');
  });
});

describe('attachment style', () => {
  it('both low -> sicher', () => {
    expect(attachmentStyleFromScores({ att_anx: 20, att_avoid: 30 })).toBe('sicher');
  });
  it('anxiety dominates -> aengstlich', () => {
    expect(attachmentStyleFromScores({ att_anx: 80, att_avoid: 40 })).toBe('aengstlich');
  });
  it('avoidance dominates -> vermeidend', () => {
    expect(attachmentStyleFromScores({ att_anx: 30, att_avoid: 75 })).toBe('vermeidend');
  });
});

describe('validity', () => {
  const acItem = item('att01', { isAttentionCheck: true, expectedValue: 2 });

  it('failed attention check flags', () => {
    const f = evaluateValidity({
      responses: { att01: 5 },
      items: [acItem],
      responseTimesMs: [1500, 1600, 1700],
    });
    expect(f.attentionFail).toBe(true);
  });

  it('median RT < 800ms flags fast responding', () => {
    const f = evaluateValidity({
      responses: { att01: 2 },
      items: [acItem],
      responseTimesMs: [500, 600, 700],
    });
    expect(f.fastResponding).toBe(true);
    expect(f.attentionFail).toBe(false);
  });

  it('straightlining > 0.6 flags', () => {
    const items = Array.from({ length: 10 }, (_, i) => item(`q${i}`));
    const responses = Object.fromEntries(items.map((i) => [i.id, 3]));
    const f = evaluateValidity({ responses, items, responseTimesMs: [1500] });
    expect(f.straightlining).toBe(true);
  });

  it('sd > 80 flags', () => {
    const f = evaluateValidity({ responses: {}, items: [], responseTimesMs: [1500], sdScore100: 90 });
    expect(f.sdHigh).toBe(true);
  });
});

describe('wellbeing guardrail', () => {
  const answers = (phq: number[], gad: number[]) => {
    const r: Record<string, number> = {};
    PHQ9_ITEM_IDS.forEach((id, i) => (r[id] = phq[i]));
    GAD7_ITEM_IDS.forEach((id, i) => (r[id] = gad[i]));
    return r;
  };

  it('PHQ-9 item 9 > 0 triggers crisis even with low sum', () => {
    const w = computeWellbeing(answers([0, 0, 0, 0, 0, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 0]), PHQ9_ITEM_IDS, GAD7_ITEM_IDS);
    expect(w?.crisis).toBe(true);
    expect(w?.phq9Sum).toBe(1);
  });

  it('PHQ-9 sum >= 15 triggers crisis without item 9', () => {
    const w = computeWellbeing(answers([2, 2, 2, 2, 2, 2, 2, 1, 0], [0, 0, 0, 0, 0, 0, 0]), PHQ9_ITEM_IDS, GAD7_ITEM_IDS);
    expect(w?.phq9Sum).toBe(15);
    expect(w?.crisis).toBe(true);
  });

  it('low scores -> no crisis', () => {
    const w = computeWellbeing(answers([1, 1, 0, 1, 0, 0, 1, 0, 0], [1, 1, 0, 0, 1, 0, 0]), PHQ9_ITEM_IDS, GAD7_ITEM_IDS);
    expect(w?.crisis).toBe(false);
  });

  it('module skipped -> null', () => {
    expect(computeWellbeing({}, PHQ9_ITEM_IDS, GAD7_ITEM_IDS)).toBeNull();
  });
});

describe('seed integrity', () => {
  it('all loadings reference existing items', () => {
    const ids = new Set(ITEMS.map((i) => i.id));
    for (const l of LOADINGS) expect(ids.has(l.itemId)).toBe(true);
  });

  it('has a deep item pool: 3 attention checks, 3 SD items, 16 wellbeing items', () => {
    const core = ITEMS.filter((i) => i.module === 'core');
    const substantive = core.filter((i) => !i.isAttentionCheck && !i.isSocialDesirability);
    // Depth is the product promise — guard against silently shrinking the pool.
    expect(substantive.length).toBeGreaterThanOrEqual(110);
    expect(core.filter((i) => i.isAttentionCheck)).toHaveLength(3);
    expect(core.filter((i) => i.isSocialDesirability)).toHaveLength(3);
    expect(ITEMS.filter((i) => i.module === 'wellbeing')).toHaveLength(16);
  });

  it('every facet scale is measured by at least two items', () => {
    const perScale = new Map<string, number>();
    for (const l of LOADINGS) {
      if (l.weight === 1) perScale.set(l.scaleId, (perScale.get(l.scaleId) ?? 0) + 1);
    }
    for (const s of SCALES) {
      if (s.dimensionGroup === 'wellbeing') continue;
      expect(perScale.get(s.id) ?? 0, `scale ${s.id} needs >= 2 primary items`).toBeGreaterThanOrEqual(2);
    }
  });

  it('never runs more than three items of one scale back to back', () => {
    const primaryOf = new Map<string, string>();
    for (const l of LOADINGS) {
      if (l.weight === 1 && !primaryOf.has(l.itemId)) primaryOf.set(l.itemId, l.scaleId);
    }
    const core = ITEMS.filter((i) => i.module === 'core');
    let run = 1;
    for (let i = 1; i < core.length; i++) {
      const prev = primaryOf.get(core[i - 1].id);
      const cur = primaryOf.get(core[i].id);
      run = prev && cur && prev === cur ? run + 1 : 1;
      expect(run, `too many consecutive ${cur} items around position ${core[i].position}`).toBeLessThanOrEqual(3);
    }
  });

  it('every substantive core item has at least one loading', () => {
    const loaded = new Set(LOADINGS.map((l) => l.itemId));
    for (const i of ITEMS) {
      if (i.module === 'core' && !i.isAttentionCheck) {
        expect(loaded.has(i.id), `item ${i.id} has no loading`).toBe(true);
      }
    }
  });

  it('positions are sequential and unique', () => {
    const positions = ITEMS.map((i) => i.position);
    expect(new Set(positions).size).toBe(ITEMS.length);
    expect(Math.min(...positions)).toBe(1);
    expect(Math.max(...positions)).toBe(ITEMS.length);
  });
});
