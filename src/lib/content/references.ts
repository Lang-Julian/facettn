// Reference list for the report.
//
// Every empirical claim in the result text should be traceable to one of these.
// Citing sources is not decoration here: it is the difference between an
// interpretation a reader can check and one they have to take on faith.

export interface Reference {
  id: string;
  authors: string;
  year: string;
  title: string;
  source: string;
  doi?: string;
  /** What this source is used for in the report. */
  usedFor: string;
}

export const REFERENCES: Reference[] = [
  {
    id: 'danner2019',
    authors: 'Danner, D., Rammstedt, B., Bluemke, M., et al.',
    year: '2019',
    title: 'Das Big Five Inventar 2: Validierung eines Persönlichkeitsinventars zur Erfassung von 5 Persönlichkeitsdomänen und 15 Facetten',
    source: 'Diagnostica, 65(3), 121–132',
    doi: '10.1026/0012-1924/a000218',
    usedFor: 'Facettenstruktur der fünf Domänen und deutsche Referenzwerte für die Perzentile (N = 770).',
  },
  {
    id: 'lichtenstein2010',
    authors: 'Lichtenstein, P., Carlström, E., Råstam, M., Gillberg, C., & Anckarsäter, H.',
    year: '2010',
    title: 'The genetics of autism spectrum disorders and related neuropsychiatric disorders in childhood',
    source: 'American Journal of Psychiatry, 167(11), 1357–1363',
    doi: '10.1176/appi.ajp.2010.10020223',
    usedFor: 'Überschneidung von autistischen und ADHS-Zügen (51 % Doppelkriterien, rg = 0,87) — Grundlage der AuDHD-Auswertung.',
  },
  {
    id: 'hull2021',
    authors: 'Hull, L., Levy, L., Lai, M.-C., et al.',
    year: '2021',
    title: 'Is social camouflaging associated with anxiety and depression in autistic adults?',
    source: 'Molecular Autism, 12(1), 13',
    doi: '10.1186/s13229-021-00421-1',
    usedFor: 'Zusammenhang von Masking mit Angst und Erschöpfung (N = 305).',
  },
  {
    id: 'frontiers2024',
    authors: 'Systematischer Review',
    year: '2024',
    title: 'Empathy in autism and psychopathy: a systematic review of the dissociation between cognitive and affective empathy',
    source: 'Frontiers in Psychiatry',
    doi: '10.3389/fpsyt.2024.1375170',
    usedFor: 'Gegenläufige Muster von kognitiver und affektiver Empathie — Grundlage der Empathie-Auswertung.',
  },
  {
    id: 'patrick2009',
    authors: 'Patrick, C. J., Fowles, D. C., & Krueger, R. F.',
    year: '2009',
    title: 'Triarchic conceptualization of psychopathy: Developmental origins of disinhibition, boldness, and meanness',
    source: 'Development and Psychopathology, 21(3), 913–938',
    doi: '10.1017/S0954579409000492',
    usedFor: 'Dreiteilung der Dark-Traits-Skalen in Furchtlosigkeit, Kaltherzigkeit und Impulsivität.',
  },
  {
    id: 'malouff2010',
    authors: 'Malouff, J. M., Thorsteinsson, E. B., Schutte, N. S., Bhullar, N., & Rooke, S. E.',
    year: '2010',
    title: 'The five-factor model of personality and relationship satisfaction of intimate partners: A meta-analysis',
    source: 'Journal of Research in Personality, 44(1), 124–127',
    doi: '10.1016/j.jrp.2009.09.004',
    usedFor: 'Gewichtung der Vergleichs-Formel (19 Stichproben, N = 3.848).',
  },
  {
    id: 'heller2004',
    authors: 'Heller, D., Watson, D., & Iles, R.',
    year: '2004',
    title: 'The role of person versus situation in life satisfaction: A critical examination',
    source: 'Psychological Bulletin, 130(4), 574–600',
    doi: '10.1037/0033-2909.130.4.574',
    usedFor: 'Effektstärken von Neurotizismus und Verträglichkeit für Beziehungszufriedenheit.',
  },
  {
    id: 'mikulincer2007',
    authors: 'Mikulincer, M., & Shaver, P. R.',
    year: '2007',
    title: 'Attachment in adulthood: Structure, dynamics, and change',
    source: 'Guilford Press',
    usedFor: 'Bindungs-Kompatibilitätsmatrix und der Verfolger-Distanzierer-Zyklus.',
  },
  {
    id: 'milton2012',
    authors: 'Milton, D. E. M.',
    year: '2012',
    title: 'On the ontological status of autism: the „double empathy problem“',
    source: 'Disability & Society, 27(6), 883–887',
    doi: '10.1080/09687599.2012.710008',
    usedFor: 'Wechselseitigkeit sozialer Missverständnisse statt einseitigem Defizit.',
  },
  {
    id: 'owens2015',
    authors: 'Owens, E. B., Cardoos, S. L., & Hinshaw, S. P.',
    year: '2015',
    title: 'Developmental progression and gender differences among individuals with ADHD',
    source: 'In: Barkley, R. A. (Hrsg.), Attention-Deficit Hyperactivity Disorder (4. Aufl.)',
    usedFor: 'Persistenz von ADHS-Zügen ins Erwachsenenalter (35–65 %).',
  },
  {
    id: 'goldberg1999',
    authors: 'Goldberg, L. R.',
    year: '1999',
    title: 'A broad-bandwidth, public-domain, personality inventory measuring the lower-level facets of several five-factor models',
    source: 'Personality Psychology in Europe, 7, 7–28 (International Personality Item Pool)',
    usedFor: 'Public-Domain-Konstrukte der Facettenebene, an denen sich die eigenen Items orientieren.',
  },
  {
    id: 'fraley2000',
    authors: 'Fraley, R. C., Waller, N. G., & Brennan, K. A.',
    year: '2000',
    title: 'An item response theory analysis of self-report measures of adult attachment',
    source: 'Journal of Personality and Social Psychology, 78(2), 350–365',
    doi: '10.1037/0022-3514.78.2.350',
    usedFor: 'Zwei-Achsen-Struktur der Bindungsmessung (Angst und Vermeidung).',
  },
  {
    id: 'kocalevent2013',
    authors: 'Kocalevent, R.-D., Hinz, A., & Brähler, E.',
    year: '2013',
    title: 'Standardization of the depression screener PHQ-9 in the general population',
    source: 'General Hospital Psychiatry, 35(5), 551–555',
    doi: '10.1016/j.genhosppsych.2013.04.006',
    usedFor: 'Deutsche Bevölkerungswerte für das optionale Wohlbefindens-Modul.',
  },
  {
    id: 'loewe2008',
    authors: 'Löwe, B., Decker, O., Müller, S., et al.',
    year: '2008',
    title: 'Validation and standardization of the Generalized Anxiety Disorder Screener (GAD-7) in the general population',
    source: 'Medical Care, 46(3), 266–274',
    doi: '10.1097/MLR.0b013e318160d093',
    usedFor: 'Deutsche Bevölkerungswerte für das optionale Wohlbefindens-Modul.',
  },
];
