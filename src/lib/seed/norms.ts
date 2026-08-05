// Published German norms as initial percentile estimates (Dev-Spec §11).
// Scales without an entry fall back to score100 as a provisional pseudo-percentile
// until own norm data exists (N>=1000 -> switch, see roadmap).

import type { NormEntry } from '@/lib/engine/types';

export const NORMS: NormEntry[] = [
  // BFI-2 German reference sample (Danner et al. 2019, N=770, item-mean metric 1–5).
  // Gender-split cells live in the paywalled supplement -> DE_total only (documented caveat).
  { scaleId: 'big5_E', population: 'DE_total', normMean: 3.22, normSd: 0.63, source: 'Danner et al. 2019, BFI-2 DE (N=770)' },
  { scaleId: 'big5_A', population: 'DE_total', normMean: 3.76, normSd: 0.51, source: 'Danner et al. 2019, BFI-2 DE (N=770)' },
  { scaleId: 'big5_C', population: 'DE_total', normMean: 3.67, normSd: 0.62, source: 'Danner et al. 2019, BFI-2 DE (N=770)' },
  { scaleId: 'big5_N', population: 'DE_total', normMean: 2.72, normSd: 0.67, source: 'Danner et al. 2019, BFI-2 DE (N=770)' },
  { scaleId: 'big5_O', population: 'DE_total', normMean: 3.38, normSd: 0.64, source: 'Danner et al. 2019, BFI-2 DE (N=770)' },
  // PHQ-9 / GAD-7: pooled approximations of the published gender-split values
  // (no gender field in the product -> pooled, documented). Sum metric.
  { scaleId: 'phq9', population: 'DE_pooled', normMean: 2.9, normSd: 3.5, source: 'Kocalevent et al. 2013 (gepoolt aus w 3,1/m 2,7; SD 3,5)' },
  { scaleId: 'gad7', population: 'DE_pooled', normMean: 2.95, normSd: 3.35, source: 'Löwe et al. 2008 (gepoolt aus w 3,2/3,5; m 2,7/3,2)' },
  // Für ADHS-, Autismus-, Dark-, Bindungs-, Love- und Sensibilitätsskalen liegen
  // bewusst KEINE Normwerte vor: Die Items sind eigene Formulierungen, publizierte
  // Normen fremder Instrumente gelten für sie nicht. Diese Skalen weisen deshalb nur
  // den Rohwert aus. Eigene Perzentile erst nach einer Normierungsstudie ergänzen.
];
