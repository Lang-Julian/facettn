// Scale definitions (Blueprint Deliverable 1/2). `sd` is a validity scale, not shown in results.

export interface ScaleDef {
  id: string;
  nameDe: string;
  dimensionGroup:
    | 'big5'
    | 'neuro'
    | 'dark'
    | 'empathy'
    | 'attachment'
    | 'love'
    | 'sensitivity'
    | 'validity'
    | 'wellbeing';
  normSource?: string;
}

export const SCALES: ScaleDef[] = [
  { id: 'big5_E', nameDe: 'Extraversion', dimensionGroup: 'big5', normSource: 'BFI2_Danner2019' },
  { id: 'big5_A', nameDe: 'Verträglichkeit', dimensionGroup: 'big5', normSource: 'BFI2_Danner2019' },
  { id: 'big5_C', nameDe: 'Gewissenhaftigkeit', dimensionGroup: 'big5', normSource: 'BFI2_Danner2019' },
  { id: 'big5_N', nameDe: 'Emotionale Sensibilität', dimensionGroup: 'big5', normSource: 'BFI2_Danner2019' },
  { id: 'big5_O', nameDe: 'Offenheit', dimensionGroup: 'big5', normSource: 'BFI2_Danner2019' },

  { id: 'adhs', nameDe: 'ADHS-Züge', dimensionGroup: 'neuro' },
  { id: 'autism', nameDe: 'Autismus-Züge', dimensionGroup: 'neuro' },
  { id: 'masking', nameDe: 'Masking', dimensionGroup: 'neuro' },

  { id: 'dark_mean', nameDe: 'Kühle Durchsetzung', dimensionGroup: 'dark' },
  { id: 'dark_bold', nameDe: 'Furchtlosigkeit', dimensionGroup: 'dark' },
  { id: 'dark_disinh', nameDe: 'Spontanität & Regelbruch', dimensionGroup: 'dark' },
  { id: 'dark_grand', nameDe: 'Selbstbewusstsein & Anspruch', dimensionGroup: 'dark' },

  { id: 'emp_cog', nameDe: 'Kognitive Empathie', dimensionGroup: 'empathy' },
  { id: 'emp_aff', nameDe: 'Affektive Empathie', dimensionGroup: 'empathy' },

  { id: 'att_anx', nameDe: 'Bindungsangst', dimensionGroup: 'attachment' },
  { id: 'att_avoid', nameDe: 'Bindungsvermeidung', dimensionGroup: 'attachment' },
  { id: 'att_secure', nameDe: 'Bindungssicherheit', dimensionGroup: 'attachment' },

  { id: 'love_klartext', nameDe: 'Klartext', dimensionGroup: 'love' },
  { id: 'love_momente', nameDe: 'Momente', dimensionGroup: 'love' },
  { id: 'love_anpacken', nameDe: 'Anpacken', dimensionGroup: 'love' },
  { id: 'love_naehe', nameDe: 'Nähe', dimensionGroup: 'love' },
  { id: 'love_wachstum', nameDe: 'Wachstum', dimensionGroup: 'love' },
  { id: 'love_zeichen', nameDe: 'Zeichen', dimensionGroup: 'love' },

  { id: 'hsp', nameDe: 'Hochsensibilität', dimensionGroup: 'sensitivity' },
  { id: 'rejection_sens', nameDe: 'Zurückweisungs-Sensibilität', dimensionGroup: 'sensitivity' },
  { id: 'alexithymia', nameDe: 'Emotionale Selbstwahrnehmung', dimensionGroup: 'sensitivity' },

  { id: 'sd', nameDe: 'Soziale Erwünschtheit', dimensionGroup: 'validity' },

  { id: 'phq9', nameDe: 'Stimmung (PHQ-9)', dimensionGroup: 'wellbeing', normSource: 'Kocalevent2013' },
  { id: 'gad7', nameDe: 'Anspannung (GAD-7)', dimensionGroup: 'wellbeing', normSource: 'Loewe2008' },
];

export const SCALE_LABELS: Record<string, string> = Object.fromEntries(
  SCALES.map((s) => [s.id, s.nameDe]),
);
