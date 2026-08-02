// Match computation and its human-readable breakdown.
//
// Weighting follows the meta-analytic findings the plan cites: low combined
// neuroticism and high agreeableness predict relationship satisfaction (Malouff
// et al. 2010, 19 samples / N = 3848; Heller et al. 2004), similarity matters most
// on openness and conscientiousness, and attachment pairing carries real weight
// (secure×secure most stable, anxious×avoidant the classic pursuer-distancer trap).
// Effects in this literature are small — the UI says so plainly.

import { computeMatch } from '@/lib/engine/scoring';
import type { Profile } from '@/lib/profile';
import { SCALE_LABELS } from '@/lib/seed/scales';
import { radarValues, RADAR_SCALES } from '@/lib/content/dimensions';

const LOVE_ORDER = [
  'love_klartext',
  'love_momente',
  'love_anpacken',
  'love_naehe',
  'love_wachstum',
  'love_zeichen',
];

const STRENGTH_SCALES = [
  'big5_E', 'big5_A', 'big5_C', 'big5_O', 'emp_cog', 'emp_aff',
  'att_secure', 'adhs', 'autism', 'hsp', 'dark_bold',
];

const FRICTION_TIPS: Record<string, string> = {
  big5_C: 'Klärt früh, was „erledigt“ für euch beide bedeutet — der Begriff meint bei euch messbar Verschiedenes.',
  big5_E: 'Plant Sozial- und Ruhezeiten getrennt statt als Kompromiss. Ein halber Abend für beide macht niemanden glücklich.',
  big5_N: 'Vereinbart ein Signalwort für „ich brauche kurz Ruhe“ — das verhindert, dass Stress als Zurückweisung ankommt.',
  big5_O: 'Wechselt euch beim Planen ab: einmal Abenteuer, einmal Bewährtes. So gewinnt keiner dauerhaft.',
  big5_A: 'Benennt Konflikte früh. Die konfliktscheue Seite sammelt sonst, die direkte merkt es zu spät.',
  adhs: 'Ein gemeinsamer sichtbarer Kalender entlastet mehr als jede Absprache — er ersetzt Erinnern durch Nachschauen.',
  autism: 'Behandelt Rückzug und Reizschutz als Selbstfürsorge, nicht als Ablehnung. Das ist der häufigste Fehlschluss hier.',
  hsp: 'Die reizempfindlichere Person bestimmt die Lautstärke des Abends — das ist keine Rücksicht, sondern Physik.',
  att_secure: 'Die sicherere Seite kann Verlässlichkeit vorleben, ohne die andere zu therapieren.',
};

export interface MatchInsights {
  total: number;
  breakdown: { label: string; value: number; note: string }[];
  sharedStrengths: string[];
  frictions: { point: string; tip: string }[];
  overlay: { axis: string; a: number; b: number }[];
}

export function buildMatchInsights(a: Profile, b: Profile): MatchInsights {
  const components = computeMatch(
    {
      scores: a.scores,
      attachmentStyle: a.attachmentStyle,
      loveVector: LOVE_ORDER.map((k) => a.scores[k] ?? 0),
    },
    {
      scores: b.scores,
      attachmentStyle: b.attachmentStyle,
      loveVector: LOVE_ORDER.map((k) => b.scores[k] ?? 0),
    },
  );

  const sharedStrengths = STRENGTH_SCALES.map((id) => ({
    id,
    min: Math.min(a.scores[id] ?? 0, b.scores[id] ?? 0),
  }))
    .filter((s) => s.min > 60)
    .sort((x, y) => y.min - x.min)
    .slice(0, 3)
    .map((s) => SCALE_LABELS[s.id] ?? s.id);

  const frictions: { point: string; tip: string }[] = [];
  const anxAvoid =
    (a.attachmentStyle === 'aengstlich' && b.attachmentStyle === 'vermeidend') ||
    (a.attachmentStyle === 'vermeidend' && b.attachmentStyle === 'aengstlich');
  if (anxAvoid) {
    frictions.push({
      point: 'Bindung: Nähe-Suche trifft auf Rückzug.',
      tip: 'Das ist der klassische Verfolger-Distanzierer-Zyklus. Er entschärft sich fast immer durch eine Rückkehrzusage: Wer Abstand braucht, sagt dazu, wann er wiederkommt.',
    });
  }

  const divergences = Object.keys(FRICTION_TIPS)
    .map((id) => ({ id, diff: Math.abs((a.scores[id] ?? 50) - (b.scores[id] ?? 50)) }))
    .sort((x, y) => y.diff - x.diff);
  for (const d of divergences) {
    if (frictions.length >= 3) break;
    if (d.diff < 28) break;
    frictions.push({
      point: `${SCALE_LABELS[d.id] ?? d.id}: eure Werte liegen ${Math.round(d.diff)} Punkte auseinander.`,
      tip: FRICTION_TIPS[d.id],
    });
  }

  const valsA = radarValues(a.scores);
  const valsB = radarValues(b.scores);

  return {
    total: Math.round(components.total),
    breakdown: [
      {
        label: 'Ähnlichkeit in Werten und Arbeitsweise',
        value: Math.round(components.similarity),
        note: 'Offenheit, Gewissenhaftigkeit und Verträglichkeit im Abgleich. Ähnlichkeit sagt hier mehr voraus als Gegensatz.',
      },
      {
        label: 'Gemeinsame Gelassenheit',
        value: Math.round(components.neuroBase),
        note: 'Je niedriger die kombinierte Stressreaktivität, desto stabiler laufen Konflikte ab — der größte Einzeleffekt der Forschung.',
      },
      {
        label: 'Gemeinsame Verträglichkeit',
        value: Math.round(components.agreeBase),
        note: 'Zwei verträgliche Menschen streiten anders, nicht seltener.',
      },
      {
        label: 'Bindungs-Passung',
        value: components.attachScore,
        note: 'Sicher × sicher ist am stabilsten, ängstlich × vermeidend am anstrengendsten.',
      },
      {
        label: 'Love-Style-Überschneidung',
        value: Math.round(components.loveOverlap),
        note: 'Wie ähnlich ihr Zuneigung ausdrückt und empfangt. Niedrige Werte heißen nicht Unvereinbarkeit, sondern Übersetzungsbedarf.',
      },
    ],
    sharedStrengths,
    frictions,
    overlay: RADAR_SCALES.map((s, i) => ({ axis: s.short, a: valsA[i], b: valsB[i] })),
  };
}
