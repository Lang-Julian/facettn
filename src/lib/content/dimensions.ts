// Result-page deep-dive content (Blueprint Deliverable 5). ADHS/Autismus/Dark texts
// verbatim from the blueprint; the remaining dimensions follow the same structure
// (strengths first, "bedeutet / bedeutet nicht", never diagnosis language).

export interface MythFact {
  myth: string;
  fact: string;
}

export interface DimensionContent {
  /** Section key — either a scale id or a virtual group key. */
  key: string;
  title: string;
  /** Scale ids whose bars are rendered inside this section. */
  scaleIds: string[];
  explanation: string;
  strengths: string[];
  means?: string;
  meansNot?: string;
  myths?: MythFact[];
  tips?: string[];
  resources?: string;
}

export const DIMENSIONS: DimensionContent[] = [
  {
    key: 'big5',
    title: 'Deine Persönlichkeits-Basis (Big Five)',
    scaleIds: ['big5_E', 'big5_A', 'big5_C', 'big5_N', 'big5_O'],
    explanation:
      'Die Big Five sind das am besten erforschte Persönlichkeitsmodell der Psychologie. Sie beschreiben fünf ' +
      'breite Dimensionen, auf denen sich alle Menschen bewegen — es gibt keine „guten“ oder „schlechten“ Werte, ' +
      'nur unterschiedliche Profile mit je eigenen Stärken. Deine Werte werden mit einer deutschen ' +
      'Referenzstichprobe verglichen.',
    strengths: [],
    tips: [
      'Hohe Werte sind Ressourcen, niedrige Werte sind Präferenzen — beides lässt sich gestalten.',
      'Vergleiche dich mit deinem gestrigen Ich, nicht mit anderen.',
    ],
  },
  {
    key: 'adhs',
    title: 'ADHS-Züge',
    scaleIds: ['adhs'],
    explanation:
      'Deine Antworten zeigen, wie stark ADHS-typische Züge bei dir ausgeprägt sind. Deutlich ausgeprägt heißt: ' +
      'Dein Gehirn arbeitet oft schnell, sprunghaft und interessengesteuert. Aufmerksamkeit ist bei dir keine ' +
      'reine Frage von Willen, sondern von Faszination — bei spannenden Dingen kannst du im Hyperfokus versinken, ' +
      'bei langweiligen fällt Dranbleiben schwer. Innere Unruhe und Impulsivität gehören für viele dazu. Das ist ' +
      'keine Charakterschwäche, sondern eine andere Art der Reizverarbeitung. Wichtig: Dieser Test ist kein ' +
      'Diagnoseinstrument. Er zeigt Tendenzen, keine Krankheit.',
    strengths: ['Ideenreichtum', 'Spontaneität', 'Hyperfokus', 'Energie in Krisen', 'Querdenken'],
    means: 'Deine Reizverarbeitung tickt anders.',
    meansNot: 'Dass du „gestört“ oder faul bist oder eine Diagnose hast.',
    myths: [
      {
        myth: 'ADHS ist nur Kinderkram.',
        fact: 'ADHS persistiert häufig bis ins Erwachsenenalter — im Mittel bei rund 43 % der Betroffenen (systematischer Review; Owens et al. 2015 nennen 35–65 %).',
      },
      { myth: 'Wer sich fokussieren kann, hat kein ADHS.', fact: 'Hyperfokus ist ein typisches ADHS-Merkmal.' },
      { myth: 'ADHS heißt einfach faul.', fact: 'Es geht um Schwierigkeiten der Selbstregulation, nicht um fehlenden Willen.' },
    ],
    tips: [
      'Externe Struktur schaffen: Timer, Listen, „Body-Doubling“.',
      'Große Aufgaben in Mini-Schritte zerlegen.',
      'Bewegung als Fokus-Booster einbauen.',
    ],
    resources:
      'ADHS Deutschland e.V. (adhs-deutschland.de) — Beratung, Informationen und Veranstaltungen für Betroffene und Angehörige, mit eigener Autismus-Sektion für die AuDHD-Doppelkonstellation.',
  },
  {
    key: 'autism',
    title: 'Autismus-Züge & Masking',
    scaleIds: ['autism', 'masking'],
    explanation:
      'Deine Antworten zeigen, wie stark autistische Züge bei dir ausgeprägt sind. Deutlich ausgeprägt kann ' +
      'bedeuten: Du nimmst Details und Reize intensiver wahr, liebst Tiefe und Routinen und findest soziale ' +
      '„Zwischentöne“ manchmal anstrengend zu entschlüsseln. Viele autistische Menschen fühlen sehr stark mit ' +
      '(affektive Empathie), tun sich aber schwerer damit, blitzschnell zu erraten, was im Kopf des Gegenübers ' +
      'vorgeht (kognitive Empathie). Das ist kein Mangel an Herz, sondern eine andere Verdrahtung der sozialen ' +
      'Wahrnehmung. Dieser Test stellt keine Diagnose — er lädt zur Selbstreflexion ein.',
    strengths: ['Detailtiefe', 'Ehrlichkeit', 'Loyalität', 'Fachexpertise', 'Mustererkennung'],
    means: 'Eine andere soziale und sensorische Verarbeitung.',
    meansNot: 'Empathielosigkeit oder geringere Intelligenz.',
    myths: [
      {
        myth: 'Autist:innen haben keine Empathie.',
        fact: 'Häufig ist die affektive Empathie intakt oder sogar erhöht; herausfordernd ist die kognitive Perspektivübernahme (Frontiers in Psychiatry 2024).',
      },
      { myth: 'Autismus sieht man jedem an.', fact: 'Viele maskieren ihre Züge — besonders Frauen (Camouflaging).' },
      { myth: 'Autismus ist eine Krankheit, die man heilt.', fact: 'Es ist eine neurologische Variante, kein Defekt.' },
    ],
    tips: [
      'Reizüberflutung vorbeugen (Kopfhörer, Rückzugsorte).',
      'Klar kommunizieren — Nachfragen ist ausdrücklich erlaubt.',
      'Routinen bewusst als Ressource nutzen.',
    ],
    resources:
      'Bundesverband autismus Deutschland e.V. (autismus.de) — Dachverband mit rund 55 Regionalverbänden, Kartensuche für Anlaufstellen in deiner Nähe.',
  },
  {
    key: 'dark',
    title: 'Durchsetzung & Furchtlosigkeit („Dark Traits“)',
    scaleIds: ['dark_bold', 'dark_mean', 'dark_disinh', 'dark_grand'],
    explanation:
      'Deine Antworten zeigen, wie stark „dunklere“ Persönlichkeitszüge bei dir ausgeprägt sind — gemeint sind ' +
      'Merkmale wie Durchsetzungsstärke, Furchtlosigkeit, strategisches Denken und ein kühlerer Zugang zu ' +
      'Emotionen. Das macht dich nicht zu einem „schlechten Menschen“. Solche Züge sind in der Bevölkerung ' +
      'normal verteilt und können in der richtigen Dosis Vorteile bringen: Mut, Klarheit, Verhandlungsstärke. ' +
      'Kritisch wird es erst, wenn Kaltherzigkeit oder Impulsivität anderen schaden. Selbsterkenntnis ist der ' +
      'erste Schritt, diese Energie konstruktiv zu lenken. Dieser Test ist kein klinisches Instrument und ' +
      'diagnostiziert nichts.',
    strengths: ['Mut', 'Stressresistenz', 'Führungsstärke', 'Rationale Entscheidungen unter Druck'],
    means: 'Du bist durchsetzungsfähig und emotional robust.',
    meansNot: 'Dass du ein „Soziopath“ bist oder eine Störung hast.',
    myths: [
      {
        myth: 'Dark Traits = Verbrecher.',
        fact: 'Viele Merkmale (v. a. Furchtlosigkeit) finden sich bei Führungskräften und in gesunder Ausprägung in der Allgemeinbevölkerung.',
      },
      {
        myth: 'Psychopath:innen haben gar keine Empathie.',
        fact: 'Die kognitive Empathie ist oft intakt, reduziert ist die affektive (Frontiers in Psychiatry 2024).',
      },
      { myth: 'Solche Züge kann man nicht ändern.', fact: 'Verhalten und Impulskontrolle sind trainierbar.' },
    ],
    tips: [
      'Vor wichtigen Entscheidungen kurz die Perspektive der Betroffenen durchspielen.',
      'Bei Impulsen die „10-Sekunden-Regel“ nutzen.',
      'Durchsetzungskraft gezielt für Teamziele einsetzen.',
    ],
    resources:
      'Bei Leidensdruck psychotherapeutische Beratung; niedrigschwellig TelefonSeelsorge 116 123 (kostenlos, anonym, 24/7).',
  },
  {
    key: 'empathy',
    title: 'Empathie: Kopf & Herz',
    scaleIds: ['emp_cog', 'emp_aff'],
    explanation:
      'Empathie hat zwei Seiten: kognitive Empathie (verstehen, was jemand denkt) und affektive Empathie ' +
      '(mitfühlen, was jemand fühlt). Die beiden können unabhängig voneinander stark oder schwach ausgeprägt ' +
      'sein — dein Profil zeigt beide getrennt.',
    strengths: ['Perspektivübernahme', 'Mitgefühl', 'Soziales Feingefühl'],
    tips: [
      'Starke kognitive Empathie: nutze sie, um Konflikte zu entschärfen — nicht nur, um zu überzeugen.',
      'Starke affektive Empathie: plane bewusst emotionale Erholung ein.',
    ],
  },
  {
    key: 'attachment',
    title: 'Dein Bindungsstil',
    scaleIds: ['att_secure', 'att_anx', 'att_avoid'],
    explanation:
      'Bindungsstile beschreiben, wie du Nähe und Verlässlichkeit in engen Beziehungen erlebst. Sie entstehen ' +
      'aus Erfahrungen — und können sich mit neuen, korrigierenden Erfahrungen weiterentwickeln. Kein Stil ist ' +
      'ein Urteil; jeder hat eine innere Logik.',
    strengths: ['Bindungsmuster erkennen', 'Bedürfnisse benennen', 'Beziehungen bewusst gestalten'],
    tips: [
      'Hohe Bindungsangst: prüfe Gedanken wie „ich werde verlassen“ aktiv auf Belege.',
      'Hohe Vermeidung: kleine Dosen Verletzlichkeit ausprobieren — sie wirken.',
    ],
  },
  {
    key: 'love',
    title: 'Deine Love Styles',
    scaleIds: ['love_klartext', 'love_momente', 'love_anpacken', 'love_naehe', 'love_wachstum', 'love_zeichen'],
    explanation:
      'Sechs Arten, Zuneigung zu zeigen und zu empfangen: Klartext (Worte), Momente (gemeinsame Zeit), ' +
      'Anpacken (Taten), Nähe (Berührung), Wachstum (gemeinsame Entwicklung) und Zeichen (kleine Gesten). ' +
      'Dein Ranking zeigt, welche Sprache bei dir am stärksten ankommt — nützlich zu wissen, und noch ' +
      'nützlicher zu teilen.',
    strengths: [],
    tips: [
      'Sag deinen Liebsten, welche Sprache bei dir ankommt — Gedankenlesen funktioniert nicht.',
      'Achte darauf, in welcher Sprache andere geben: oft ist es ihre eigene Lieblingssprache.',
    ],
  },
  {
    key: 'sensitivity',
    title: 'Sensibilität & Selbstwahrnehmung',
    scaleIds: ['hsp', 'rejection_sens', 'alexithymia'],
    explanation:
      'Hochsensibilität beschreibt eine intensivere Reizverarbeitung, Zurückweisungs-Sensibilität die ' +
      'Empfindlichkeit für (vermutete) Ablehnung, und emotionale Selbstwahrnehmung, wie leicht du deine ' +
      'eigenen Gefühle erkennst und benennst. Zusammen erklären sie viel darüber, wie sich dein Alltag ' +
      'von innen anfühlt.',
    strengths: ['Feine Wahrnehmung', 'Frühwarnsystem für Stimmungen', 'Tiefes Erleben'],
    tips: [
      'Hohe Sensibilität: Reizpausen sind Wartung, kein Luxus.',
      'Hohe Zurückweisungs-Sensibilität: erst nachfragen, dann interpretieren.',
      'Gefühle schwer benennbar: ein tägliches 3-Wort-Gefühlsprotokoll trainiert die Wahrnehmung messbar.',
    ],
  },
];

export const OVERLAPS = [
  {
    title: 'Warum ADHS- und Autismus-Züge sich ähneln können',
    text:
      'ADHS und Autismus treten häufig zusammen auf — die Community nennt das „AuDHD“. Zwillings- und ' +
      'Familienstudien zeigen eine erhebliche genetische Überschneidung; im schwedischen Zwillingsregister ' +
      'erfüllten 51 % der Kinder mit Autismus auch ADHS-Kriterien, die genetische Korrelation lag bei rg=0,87 ' +
      '(Lichtenstein/Ronald, Am J Psychiatry 2010). Deshalb laden in diesem Test manche Fragen bewusst auf ' +
      'beide Skalen — ein hoher Wert in beiden ist kein Widerspruch, sondern ein bekanntes Muster.',
  },
  {
    title: 'Empathie ist nicht gleich Empathie',
    text:
      'Empathie hat zwei Seiten: kognitive Empathie (verstehen, was jemand denkt) und affektive Empathie ' +
      '(mitfühlen, was jemand fühlt). Die Forschung zeigt ein spannendes Muster: Bei autistischen Zügen ist ' +
      'die affektive Empathie oft intakt oder sogar erhöht, während die kognitive Perspektivübernahme ' +
      'herausfordernd ist. Bei Dark Traits ist es umgekehrt — gutes „Gedankenlesen“, aber wenig Mitgefühl ' +
      '(systematischer Review, Frontiers in Psychiatry 2024). Zwei völlig verschiedene Profile, die im Alltag ' +
      'leicht verwechselt werden. Wichtig ist auch das Double-Empathy-Problem (Milton 2012): Missverständnisse ' +
      'zwischen autistischen und nicht-autistischen Menschen sind wechselseitig — kein einseitiges „Defizit“.',
  },
];

/**
 * Scales shown on the main radar (10 axes; dark = mean of the four dark scales).
 * `label` is the full name; `short` is what the chart draws — long axis labels get
 * clipped at the left/right extremes of a Recharts radar on narrow viewports.
 */
export const RADAR_SCALES: { id: string; label: string; short: string }[] = [
  { id: 'big5_E', label: 'Extraversion', short: 'Extraversion' },
  { id: 'big5_A', label: 'Verträglichkeit', short: 'Verträglichkeit' },
  { id: 'big5_C', label: 'Gewissenhaftigkeit', short: 'Gewissenhaft.' },
  { id: 'big5_N', label: 'Emotionale Sensibilität', short: 'Emot. Sensib.' },
  { id: 'big5_O', label: 'Offenheit', short: 'Offenheit' },
  { id: 'adhs', label: 'ADHS-Züge', short: 'ADHS' },
  { id: 'autism', label: 'Autismus-Züge', short: 'Autismus' },
  { id: 'dark', label: 'Dark Traits', short: 'Dark Traits' },
  { id: 'hsp', label: 'Hochsensibilität', short: 'Hochsensib.' },
  { id: 'att_secure', label: 'Bindungssicherheit', short: 'Bindung' },
];

export function radarValues(scores: Record<string, number>): number[] {
  const dark =
    ((scores['dark_mean'] ?? 0) +
      (scores['dark_bold'] ?? 0) +
      (scores['dark_disinh'] ?? 0) +
      (scores['dark_grand'] ?? 0)) /
    4;
  return RADAR_SCALES.map((s) => Math.round(s.id === 'dark' ? dark : (scores[s.id] ?? 0)));
}
