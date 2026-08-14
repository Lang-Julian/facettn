// Cross-dimension pattern detection.
//
// A bar chart tells you *how much* of each trait you have. What actually explains
// someone's everyday life is usually the *combination* — a high score on two scales
// that pull in opposite directions, or a strength that is being paid for somewhere
// else. These rules encode the interactions the research literature describes, and
// they are what makes the evaluation read like an interpretation rather than a
// readout.
//
// Every rule is deliberately conservative: it needs a clear configuration to fire,
// and it is phrased as an observation about tendencies, never as a finding.

import type { AttachmentStyle } from '@/lib/engine/types';

export interface DetectedPattern {
  id: string;
  title: string;
  /** The one-line claim, shown as the pattern's headline. */
  lede: string;
  body: string;
  /** Practical consequence — what to actually do with this. */
  soWhat: string;
  /** Higher first. */
  weight: number;
}

type Scores = Record<string, number>;

const g = (s: Scores, id: string) => s[id] ?? 50;

interface Rule {
  id: string;
  applies: (s: Scores, attachment: AttachmentStyle) => boolean;
  build: (s: Scores) => Omit<DetectedPattern, 'id'>;
}

const RULES: Rule[] = [
  {
    // The one rule that touches the giftedness question — and deliberately stops
    // short of it. It reports a MECHANISM (does difficulty help?) and never awards
    // a label, because a questionnaire cannot measure cognitive ability:
    // self-assessed intelligence correlates with measured IQ at only about r = .30.
    // It also requires intact everyday reliability: broad executive difficulty
    // points away from under-challenge as the explanation.
    id: 'challenge_dependent_attention',
    applies: (s) =>
      g(s, 'adhs_unauf') > 58 &&
      g(s, 'attn_challenge') > 65 &&
      g(s, 'o_neugier') > 60 &&
      g(s, 'c_verantwortung') > 45,
    build: () => ({
      title: 'Deine Konzentration hängt am Anspruch',
      lede: 'Schwierigere Aufgaben halten dich besser bei der Sache als leichte.',
      body:
        'Eine ungewöhnliche Kombination: erhöhte Unaufmerksamkeitswerte, aber Konzentration, die mit steigender Schwierigkeit zunimmt — und daneben eine Verlässlichkeit im Alltag, die intakt ist. Unterforderung erzeugt Verhalten, das von außen wie ein Aufmerksamkeitsproblem aussieht; in der Fachliteratur ist das ein bekanntes Zuordnungsproblem. Entscheidend ist dabei eine Feinheit: Dass Interesse hilft, unterscheidet gar nichts — bei ADHS ist genau das typisch, Hyperfokus gilt als Kennzeichen. Nur dass ausgerechnet Schwierigkeit hilft, zeigt in eine andere Richtung.',
      soWhat:
        'Bevor du an deiner Konzentration arbeitest, prüfe das Anforderungsniveau: Wenn ein Umfeld dich unterfordert, ist mehr Disziplin die falsche Stellschraube. Und die ehrliche Grenze dazu — dieser Test misst keine Intelligenz und kann keine Begabung feststellen. Selbsteinschätzungen treffen gemessene Testwerte nur zu etwa r = 0,30. Das hier ist ein Hinweis auf einen möglichen Auslöser, mehr nicht.',
      weight: 86,
    }),
  },
  {
    // Socially prescribed perfectionism is the dimension meta-analyses link to
    // depression, low self-worth and suicidal ideation — unlike the self-oriented
    // kind, which behaves quite differently. Worth surfacing on its own.
    id: 'external_perfectionism',
    applies: (s) => g(s, 'perf_social') > 62,
    build: (s) => ({
      title: 'Der Druck kommt von außen',
      lede:
        g(s, 'perf_self') > 62
          ? 'Du trägst hohen eigenen und hohen erwarteten Anspruch gleichzeitig.'
          : 'Dein Perfektionismus speist sich vor allem aus vermuteten Erwartungen anderer.',
      body:
        'Diese Unterscheidung ist folgenreicher, als sie klingt. Selbst gesetzter Anspruch hängt in der Forschung mit Leistung und Ausdauer zusammen. Der von außen erwartete dagegen — das Gefühl, dass andere Fehlerlosigkeit verlangen und der eigene Wert daran hängt — ist die Variante, die in Meta-Analysen mit Depressivität, niedrigem Selbstwert und sogar mit Suizidgedanken einhergeht. Nicht die Höhe des Anspruchs belastet, sondern seine Quelle.',
      soWhat:
        'Die wirksamste Prüfung ist banal und unbequem: Schreib auf, wer diese Erwartung konkret ausgesprochen hat. Sehr oft findet sich niemand — dann ist sie eine Annahme über andere und keine Aussage von ihnen.',
      weight: 84,
    }),
  },
  {
    id: 'audhd',
    applies: (s) => g(s, 'adhs') > 62 && g(s, 'autism') > 62,
    build: () => ({
      title: 'Die AuDHD-Konstellation',
      lede: 'Bei dir sind ADHS- und autistische Züge gleichzeitig deutlich ausgeprägt.',
      body:
        'Das wirkt auf den ersten Blick widersprüchlich — Reizsuche neben Reizempfindlichkeit, Abwechslungsdrang neben Routinebedarf. Es ist aber ein gut dokumentiertes Muster: Im schwedischen Zwillingsregister erfüllten 51 % der Kinder mit Autismus zugleich ADHS-Kriterien, die genetische Korrelation lag bei rg = 0,87 (Lichtenstein/Ronald, Am J Psychiatry 2010). Der innere Konflikt ist typisch: Ein Teil von dir will Struktur, der andere hält sie nicht aus.',
      soWhat:
        'Such nicht nach dem einen System, das dich rettet. Zwei Modi zu bauen — einen für Fokusphasen, einen für Reizschutz — funktioniert für diese Konstellation meist besser als ein einziger Alltagsrhythmus.',
      weight: 100,
    }),
  },
  {
    id: 'empathy_gap_autistic',
    applies: (s) => g(s, 'emp_aff') - g(s, 'emp_cog') > 18 && g(s, 'autism') > 55,
    build: (s) => ({
      title: 'Du fühlst mehr, als du liest',
      lede: `Deine affektive Empathie liegt ${Math.round(g(s, 'emp_aff') - g(s, 'emp_cog'))} Punkte über deiner kognitiven.`,
      body:
        'Du nimmst Gefühle stark auf, tust dir aber schwerer damit, blitzschnell zu erschließen, was jemand denkt oder andeutet. Genau dieses Muster beschreibt die Forschung für autistische Züge — und es ist das Gegenteil des Klischees vom „kalten Autisten“. Nicht das Mitfühlen fehlt, sondern das schnelle Entschlüsseln.',
      soWhat:
        'Nachfragen ist bei dir keine Schwäche, sondern das effizienteste Werkzeug: Du kompensierst damit exakt die Lücke, die du hast — und dein Mitgefühl war ohnehin nie das Problem.',
      weight: 90,
    }),
  },
  {
    id: 'empathy_gap_cold',
    applies: (s) => g(s, 'emp_cog') - g(s, 'emp_aff') > 18 && g(s, 'emp_aff') < 45,
    build: (s) => ({
      title: 'Du liest mehr, als du fühlst',
      lede: `Deine kognitive Empathie liegt ${Math.round(g(s, 'emp_cog') - g(s, 'emp_aff'))} Punkte über deiner affektiven.`,
      body:
        'Du verstehst gut, was in anderen vorgeht, wirst davon aber selten mitgerissen. Das ist eine echte Fähigkeit — in Konflikten, Verhandlungen und Krisen ist dieser klare Kopf viel wert. Dieselbe Konstellation beschreibt die Forschung aber auch für ausgeprägte Dark Traits, weil Verstehen ohne Mitschwingen sich auch instrumentell nutzen lässt.',
      soWhat:
        'Die Frage ist nicht, ob du es kannst, sondern wofür du es einsetzt. Wenn du merkst, dass du Menschen häufiger löst als begleitest, ist das der Punkt zum Nachjustieren.',
      weight: 85,
    }),
  },
  {
    id: 'masking_cost',
    applies: (s) => g(s, 'masking') > 65 && (g(s, 'autism') > 55 || g(s, 'rejection_sens') > 60),
    build: () => ({
      title: 'Anpassung mit Preisschild',
      lede: 'Dein Masking-Wert ist hoch — und er kommt nicht allein.',
      body:
        'Masking beschreibt den bewussten Aufwand, sozial unauffällig zu wirken: Blickkontakt erzwingen, Sätze vorbereiten, Reaktionen kopieren. Es funktioniert oft erstaunlich gut nach außen. Innen kostet es: In einer Studie mit 305 autistischen Erwachsenen sagte Camouflaging generalisierte und soziale Angst stärker voraus als Depression (Hull et al., Molecular Autism 2021).',
      soWhat:
        'Der wirksamste Hebel ist selten „weniger maskieren“, sondern mehr Orte, an denen du es nicht musst. Ein einziger Mensch, bei dem die Maske fällt, entlastet mehr als jede Entspannungstechnik.',
      weight: 88,
    }),
  },
  {
    id: 'pursuer_distancer',
    applies: (s) => g(s, 'att_anx') > 60 && g(s, 'att_avoid') > 60,
    build: () => ({
      title: 'Nähe wollen und Nähe fürchten',
      lede: 'Bindungsangst und Bindungsvermeidung sind bei dir beide hoch.',
      body:
        'Das ist die anstrengendste Kombination: Der Wunsch nach Nähe ist stark, der Reflex zum Rückzug aber auch. In Beziehungen entsteht daraus oft ein Wechsel aus Annäherung und Abstand, der für beide Seiten schwer lesbar ist — und der leicht als Widersprüchlichkeit missverstanden wird, obwohl es zwei gleichzeitig aktive Schutzsysteme sind.',
      soWhat:
        'Das Muster laut auszusprechen entschärft es am schnellsten: „Ich brauche gerade Abstand, und ich komme wieder“ nimmt beiden Systemen die Angst — deinem und dem deines Gegenübers.',
      weight: 92,
    }),
  },
  {
    id: 'anxious_rejection',
    applies: (s) => g(s, 'att_anx') > 62 && g(s, 'rejection_sens') > 62,
    build: () => ({
      title: 'Der Alarm springt zu früh an',
      lede: 'Bindungsangst und Zurückweisungs-Sensibilität verstärken sich bei dir gegenseitig.',
      body:
        'Ein knapper Tonfall, eine späte Antwort, ein unbeteiligter Blick — dein System liest darin schnell Ablehnung und schlägt Alarm, bevor Belege vorliegen. Das Unangenehme daran ist die Selbstbestätigung: Die Reaktion auf die vermutete Ablehnung erzeugt manchmal genau die Distanz, vor der sie schützen sollte.',
      soWhat:
        'Ein simpler Test hilft: Bevor du reagierst, notiere die Belege für deine Deutung — und eine zweite Erklärung, die genauso gut passt. Meistens gibt es sie.',
      weight: 80,
    }),
  },
  {
    id: 'sensitive_overload',
    applies: (s) => g(s, 'hsp') > 65 && g(s, 'au_sensorik') > 60,
    build: () => ({
      title: 'Dein Reizfilter arbeitet feiner',
      lede: 'Hochsensibilität und sensorische Empfindlichkeit greifen bei dir ineinander.',
      body:
        'Du bekommst schlicht mehr Rohdaten herein als die meisten: Geräusche, Licht, Texturen, Stimmungen. Das erklärt den Detailblick genauso wie die Erschöpfung nach einem vollen Tag. Was von außen wie Überempfindlichkeit aussieht, ist eine andere Verarbeitungstiefe — dieselbe Eigenschaft, die dich Nuancen bemerken lässt, füllt auch schneller den Speicher.',
      soWhat:
        'Reizpausen sind bei dir Wartung, nicht Luxus. Sie vorher einzuplanen wirkt deutlich besser, als sie hinterher zu brauchen.',
      weight: 75,
    }),
  },
  {
    id: 'bold_low_neuro',
    applies: (s) => g(s, 'dark_bold') > 68 && g(s, 'big5_N') < 38,
    build: () => ({
      title: 'Ruhe, wo andere kippen',
      lede: 'Hohe Furchtlosigkeit trifft bei dir auf niedrige Stressreaktivität.',
      body:
        'Diese Kombination ist selten und im Alltag ein echter Vorteil: Du bleibst handlungsfähig, wenn die Lage unübersichtlich wird, und triffst Entscheidungen, vor denen andere zurückschrecken. In der Forschung ist genau diese Facette — Boldness — die, die man überdurchschnittlich häufig in Führungsrollen findet.',
      soWhat:
        'Der blinde Fleck liegt beim Gegenüber: Was für dich Gelassenheit ist, kann für andere wie Ignorieren ihrer Sorge wirken. Ein Satz, der die Anspannung der anderen anerkennt, kostet dich nichts und ändert viel.',
      weight: 70,
    }),
  },
  {
    id: 'impulse_stack',
    applies: (s) => g(s, 'adhs_hyper') > 62 && g(s, 'dark_disinh') > 62,
    build: () => ({
      title: 'Zwei Quellen für dieselbe Impulsivität',
      lede: 'Deine Impulsivität speist sich aus zwei verschiedenen Richtungen.',
      body:
        'Der eine Anteil ist exekutiv: Der Bremsweg zwischen Impuls und Handlung ist kurz — das ist die ADHS-Seite, und sie ist nicht gewollt. Der andere Anteil ist eine Haltung: Regeln und Konsequenzen bewusst geringer zu gewichten. Beide führen zu ähnlichem Verhalten, brauchen aber völlig verschiedene Gegenmittel.',
      soWhat:
        'Gegen die erste Quelle hilft Technik (Timer, Wartezeiten, Vier-Augen-Prinzip bei großen Entscheidungen), gegen die zweite nur eine Entscheidung. Die Verwechslung ist der Grund, warum reine Selbstdisziplin hier oft scheitert.',
      weight: 78,
    }),
  },
  {
    // Conscientiousness is the domain where item wording and construct part ways:
    // self-report items operationalise it as conformity to *externally given*
    // structure — plans, tidiness, deadlines, rules. Someone who runs on
    // self-authored systems answers those honestly low while being highly effective.
    // The two aspects diverge empirically (DeYoung, Quilty & Peterson, 2007), and
    // industriousness, not orderliness, is the one that tracks performance.
    // Averaging them into a domain score destroys exactly the information that
    // matters, so this rule reports the split instead.
    //
    // Both scales carry only four items (coarse resolution), so the gap has to be
    // wide enough to survive rounding — 20 points, not 10.
    id: 'conscientiousness_aspect_split',
    applies: (s) =>
      g(s, 'c_fleiss') - g(s, 'c_ordnung') >= 20 &&
      g(s, 'c_fleiss') >= 55 &&
      // own_rules covers the same terrain in more detail; do not say it twice.
      !(g(s, 'c_ordnung') < 45 && g(s, 'c_verantwortung') < 45 && g(s, 'dark_disinh') > 58),
    build: (s) => ({
      title: 'Beharrlichkeit ohne Ordnungsliebe',
      lede: 'Du bleibst dran, ohne dass äußere Ordnung dabei eine Rolle spielt — das sind zwei verschiedene Dinge, auch wenn sie meist in einen Topf geworfen werden.',
      body:
        `Gewissenhaftigkeit zerfällt in zwei Anteile, die nur lose zusammenhängen: Beharrlichkeit (dranbleiben, fertig machen) und Ordnung (Struktur, Pläne, feste Abläufe). Bei dir liegen sie rund ${Math.round((g(s, 'c_fleiss') - g(s, 'c_ordnung')) / 5) * 5} Punkte auseinander. Die Fragen zur Ordnung erfassen Übereinstimmung mit fremd gesetzter Struktur — Listen, Termine, aufgeräumte Ablage. Wer nach eigenen Systemen arbeitet, kreuzt dort wahrheitsgemäß niedrig an, ohne deshalb seltener zu Ergebnissen zu kommen. Von den beiden Anteilen ist es die Beharrlichkeit, die in der Forschung mit tatsächlicher Leistung zusammenhängt; Ordnung hängt eher mit Konventionalität zusammen.`,
      soWhat:
        'Praktisch heißt das: Ein Gesamtwert für Gewissenhaftigkeit ist bei dir die unbrauchbarere Zahl — sieh dir die beiden Skalen einzeln an. Und der Hebel ist nicht, dir konventionelle Ordnung anzugewöhnen, sondern deine eigenen Abläufe für andere lesbar zu machen. Die Reibung entsteht selten bei dir, sondern bei denen, die nicht sehen können, worauf dein Ablauf beruht.',
      weight: 74,
    }),
  },
  {
    // The conscientiousness items ask exclusively about *externally referenced*
    // structure: fixed places, deadlines, commitments to other people. Someone with
    // strong self-directed structure who rejects the conventional kind scores low
    // by construction. This rule names that configuration — without pretending the
    // low score is meaningless, because the friction it predicts is real.
    id: 'own_rules',
    applies: (s) =>
      g(s, 'c_ordnung') < 45 &&
      g(s, 'c_verantwortung') < 45 &&
      (g(s, 'au_interesse') > 65 || g(s, 'o_neugier') > 65) &&
      g(s, 'dark_disinh') > 58,
    build: () => ({
      title: 'Eigene Ordnung statt fremder',
      lede: 'Deine Gewissenhaftigkeit ist niedrig — aber deine Ausdauer bei selbstgewählten Themen ist es nicht.',
      body:
        'Das ist eine wichtige Unterscheidung, und die Gesamtnote verschluckt sie: Die Fragen dieser Dimension messen konventionelle Struktur — feste Plätze, Fristen, Zusagen an andere. Wer sich stattdessen an selbst gesetzten Regeln orientiert und tief in eigene Themen eintaucht, bekommt hier zwangsläufig einen niedrigen Wert, obwohl von Struktur- oder Antriebslosigkeit keine Rede sein kann. Deine hohen Werte bei Regelferne und Tiefeninteressen zeigen genau dieses Muster.',
      soWhat:
        'Der ehrliche Haken: Für andere ist der Unterschied unsichtbar. Ob eine Frist reißt, weil dir Struktur fehlt oder weil du eine andere Priorität gesetzt hast, kommt beim Gegenüber identisch an. Der wirksamste Hebel ist deshalb nicht mehr Disziplin, sondern Ansage — kommunizieren, was du wann nicht machst, statt es offen zu lassen.',
      weight: 82,
    }),
  },
  {
    id: 'conscientious_chaos',
    applies: (s) => g(s, 'c_ordnung') < 40 && g(s, 'c_verantwortung') > 62,
    build: () => ({
      title: 'Chaotisch, aber verlässlich',
      lede: 'Deine Ordnung ist niedrig, deine Verlässlichkeit hoch.',
      body:
        'Diese Facetten laufen bei dir auseinander: Der Schreibtisch sieht nach Kontrollverlust aus, aber deine Zusagen halten. Genau deshalb lohnt der Blick auf Facetten statt auf die Gesamtnote Gewissenhaftigkeit — sie würde dich in der Mitte einsortieren und beides unsichtbar machen.',
      soWhat:
        'Kämpfe nicht gegen die Unordnung an, solange sie nichts kostet. Sichere stattdessen das ab, was wirklich zählt: einen einzigen verlässlichen Ort für Zusagen und Fristen.',
      weight: 60,
    }),
  },
  {
    id: 'alexithymia_sensitive',
    applies: (s) => g(s, 'alexithymia') > 62 && (g(s, 'hsp') > 60 || g(s, 'emp_aff') > 60),
    build: () => ({
      title: 'Viel spüren, schwer benennen',
      lede: 'Du nimmst intensiv wahr — und tust dich schwer, es in Worte zu fassen.',
      body:
        'Das ist kein Widerspruch, sondern eine bekannte Kombination: Das Signal kommt laut an, aber die Übersetzung ins Sprachliche stockt. Häufig meldet sich der Körper zuerst — Anspannung, Magen, Müdigkeit — und das Gefühl bekommt erst später einen Namen, manchmal Tage danach.',
      soWhat:
        'Ein Drei-Wort-Protokoll am Abend (Situation, Körper, Vermutung) trainiert genau diese Übersetzung. Es klingt banal und ist eine der wenigen Übungen, deren Wirkung sich zuverlässig einstellt.',
      weight: 72,
    }),
  },
  {
    id: 'introvert_not_anxious',
    applies: (s) => g(s, 'big5_E') < 38 && g(s, 'att_anx') < 45 && g(s, 'n_angst') < 45,
    build: () => ({
      title: 'Introvertiert, nicht ängstlich',
      lede: 'Dein niedriger Extraversionswert kommt ohne Angstanteil.',
      body:
        'Diese Unterscheidung geht im Alltag ständig verloren: Du meidest große Runden nicht, weil sie dir Angst machen, sondern weil sie dir wenig geben. Sozialer Rückzug aus Präferenz sieht von außen aus wie Rückzug aus Furcht — innen ist es etwas völlig anderes und braucht auch keine Behandlung.',
      soWhat:
        'Du darfst absagen, ohne an dir zu arbeiten. Der Ratschlag „geh mehr raus“ zielt auf ein Problem, das du nicht hast.',
      weight: 55,
    }),
  },
  {
    id: 'giver_no_boundaries',
    applies: (s) => g(s, 'a_mitgefuehl') > 65 && g(s, 'emp_aff') > 65 && g(s, 'att_avoid') < 45,
    build: () => ({
      title: 'Durchlässig für andere',
      lede: 'Hohes Mitgefühl, hohe affektive Empathie, wenig Abgrenzungsreflex.',
      body:
        'Menschen kommen mit ihren Sorgen zu dir, und du nimmst sie wirklich auf — nicht höflich, sondern körperlich spürbar. Das macht dich zu einem seltenen Gegenüber. Es bedeutet aber auch, dass fremde Zustände bei dir ankommen, ohne dass ein Filter dazwischen liegt.',
      soWhat:
        'Abgrenzung ist bei dir keine Härte, sondern die Voraussetzung dafür, das Mitgefühl langfristig behalten zu können. Wer alles aufnimmt, brennt zuerst.',
      weight: 68,
    }),
  },
];

export function detectPatterns(scores: Scores, attachment: AttachmentStyle): DetectedPattern[] {
  return RULES.filter((r) => r.applies(scores, attachment))
    .map((r) => ({ id: r.id, ...r.build(scores) }))
    .sort((a, b) => b.weight - a.weight);
}
