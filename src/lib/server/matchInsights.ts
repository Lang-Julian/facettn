// Match output design (Blueprint Deliverable 6): total % + 3 shared strengths +
// 2 friction points with tips + overlay radar. Honest framing enforced in the UI.

import { computeMatch } from '@/lib/engine/scoring';
import { attachmentStyleFromScores } from '@/lib/engine/scoring';
import type { AttachmentStyle, MatchResult } from '@/lib/engine/types';
import { SCALE_LABELS } from '@/lib/seed/scales';
import { radarValues, RADAR_SCALES } from '@/lib/content/dimensions';

const LOVE_ORDER = ['love_klartext', 'love_momente', 'love_anpacken', 'love_naehe', 'love_wachstum', 'love_zeichen'];

const STRENGTH_SCALES = [
  'big5_E', 'big5_A', 'big5_C', 'big5_O', 'emp_cog', 'emp_aff', 'att_secure',
  'adhs', 'autism', 'hsp', 'dark_bold',
];

const FRICTION_TIPS: Record<string, string> = {
  big5_C: 'Unterschiedliche Ordnungs-Level: klärt explizit, was „erledigt“ für euch beide heißt.',
  big5_E: 'Verschiedener Energiebedarf: plant Sozial- und Ruhezeiten getrennt statt als Kompromiss.',
  big5_N: 'Unterschiedliche Stressreaktionen: vereinbart ein Signalwort für „ich brauche kurz Ruhe“.',
  big5_O: 'Neues vs. Bewährtes: wechselt euch beim Planen ab — einmal Abenteuer, einmal Routine.',
  big5_A: 'Direktheit vs. Harmonie: benennt Konflikte früh, bevor sie sich aufladen.',
  adhs: 'Verschiedene Taktung: externe Struktur (gemeinsamer Kalender) entlastet beide.',
  autism: 'Unterschiedlicher Reiz- und Routinebedarf: respektiert Rückzug als Selbstfürsorge, nicht als Ablehnung.',
  hsp: 'Unterschiedliche Reizschwellen: die sensiblere Person bestimmt die Lautstärke des Abends.',
};

export interface MatchInsights {
  total: number;
  components: MatchResult;
  sharedStrengths: string[];
  frictions: { point: string; tip: string }[];
  overlay: { axis: string; a: number; b: number }[];
  attachmentA: AttachmentStyle;
  attachmentB: AttachmentStyle;
}

export function buildMatchInsights(
  scoresA: Record<string, number>,
  scoresB: Record<string, number>,
): MatchInsights {
  const styleA = attachmentStyleFromScores(scoresA);
  const styleB = attachmentStyleFromScores(scoresB);

  const components = computeMatch(
    { scores: scoresA, attachmentStyle: styleA, loveVector: LOVE_ORDER.map((k) => scoresA[k] ?? 0) },
    { scores: scoresB, attachmentStyle: styleB, loveVector: LOVE_ORDER.map((k) => scoresB[k] ?? 0) },
  );

  // Shared strengths: scales where BOTH are high, ranked by combined level.
  const sharedStrengths = STRENGTH_SCALES
    .map((id) => ({ id, min: Math.min(scoresA[id] ?? 0, scoresB[id] ?? 0) }))
    .filter((s) => s.min > 60)
    .sort((x, y) => y.min - x.min)
    .slice(0, 3)
    .map((s) => SCALE_LABELS[s.id] ?? s.id);

  // Frictions: largest divergences with a concrete tip; attachment pairing first if tense.
  const frictions: { point: string; tip: string }[] = [];
  if ((styleA === 'aengstlich' && styleB === 'vermeidend') || (styleA === 'vermeidend' && styleB === 'aengstlich')) {
    frictions.push({
      point: 'Bindung: Nähe-Suche trifft Rückzug (klassischer Verfolger-Distanzierer-Zyklus).',
      tip: 'Verabredet ein Muster: Wer Rückzug braucht, sagt wann er/sie zurückkommt — das beruhigt beide Systeme.',
    });
  }
  const divergences = Object.keys(FRICTION_TIPS)
    .map((id) => ({ id, diff: Math.abs((scoresA[id] ?? 50) - (scoresB[id] ?? 50)) }))
    .sort((x, y) => y.diff - x.diff);
  for (const d of divergences) {
    if (frictions.length >= 2) break;
    if (d.diff < 30) break;
    frictions.push({
      point: `${SCALE_LABELS[d.id] ?? d.id}: eure Werte liegen ${Math.round(d.diff)} Punkte auseinander.`,
      tip: FRICTION_TIPS[d.id],
    });
  }

  const valsA = radarValues(scoresA);
  const valsB = radarValues(scoresB);
  const overlay = RADAR_SCALES.map((s, i) => ({ axis: s.short, a: valsA[i], b: valsB[i] }));

  return {
    total: Math.round(components.total),
    components,
    sharedStrengths,
    frictions,
    overlay,
    attachmentA: styleA,
    attachmentB: styleB,
  };
}
