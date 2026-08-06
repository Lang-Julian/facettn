// Result-page content, one entry per reported dimension.
//
// Structure per section: the domain bar, then the facet bars underneath (the facets
// are where the actual insight lives — a mid-range domain score routinely hides two
// facets pulling in opposite directions), then explanation, strengths first, an
// explicit "what this does NOT mean", myths vs. facts, practical tips and resources.

export interface MythFact {
  myth: string;
  fact: string;
}

export interface DimensionContent {
  key: string;
  title: string;
  /** Short line under the section title. */
  standfirst: string;
  /** Domain scale rendered as the headline bar; omit for standalone groups. */
  domainId?: string;
  /** Scales rendered as detail bars (facets, or the members of a group). */
  scaleIds: string[];
  explanation: string;
  strengths?: string[];
  means?: string;
  meansNot?: string;
  myths?: MythFact[];
  tips?: string[];
  resources?: string;
  /** Shown when the domain score is low, to keep low scores meaningful too. */
  lowNote?: string;
}

export const DIMENSIONS: DimensionContent[] = [
  {
    key: 'big5_E',
    title: 'Extraversion',
    standfirst: 'Woher du deine Energie beziehst — und wie viel Raum du im Außen einnimmst.',
    domainId: 'big5_E',
    scaleIds: ['e_gesellig', 'e_durchsetzung', 'e_energie'],
    explanation:
      'Extraversion bündelt drei Dinge, die oft verwechselt werden: wie sehr dich Gesellschaft auflädt (Geselligkeit), wie selbstverständlich du das Wort ergreifst (Durchsetzung) und dein allgemeines Grundtempo (Tatendrang). Man kann durchsetzungsstark und trotzdem ungesellig sein — oder umgekehrt. Genau darum lohnt der Blick auf die drei Facetten statt auf die Gesamtnote.',
    strengths: ['Präsenz', 'Kontaktfreude', 'Antrieb'],
    means: 'Wie und wo dein Akku sich füllt.',
    meansNot: 'Dass du soziale Fähigkeiten hast oder nicht — das ist eine völlig andere Frage.',
    lowNote:
      'Ein niedriger Wert heißt Introversion, nicht Schüchternheit. Introvertierte laden im Alleinsein auf; das ist eine Präferenz, kein Defizit und kein Zeichen von Angst.',
    tips: [
      'Plane Erholung nach dem tatsächlichen Bedarf, nicht nach dem, was höflich wirkt.',
      'Wenn Geselligkeit und Durchsetzung auseinanderfallen: nutze schriftliche Kanäle, um Einfluss ohne Bühne zu nehmen.',
    ],
  },
  {
    key: 'big5_A',
    title: 'Verträglichkeit',
    standfirst: 'Wie du dich zwischen Rücksicht und eigenen Interessen positionierst.',
    domainId: 'big5_A',
    scaleIds: ['a_mitgefuehl', 'a_respekt', 'a_vertrauen'],
    explanation:
      'Verträglichkeit beschreibt die Grundhaltung anderen Menschen gegenüber: Mitgefühl (wie sehr dich ihr Wohl beschäftigt), Rücksicht (wie schonend du auftrittst) und Vertrauen (ob du erst mal das Gute annimmst). Hohe Werte machen Zusammenarbeit leicht — sehr hohe Werte machen Abgrenzung schwer. In Verhandlungen und Gehaltsgesprächen ist ein mittlerer Wert oft der praktischste.',
    strengths: ['Kooperationsfähigkeit', 'Fairness', 'Vertrauensvorschuss'],
    means: 'Deine Voreinstellung im Umgang mit anderen.',
    meansNot: 'Dass du dich nicht durchsetzen kannst — Durchsetzung wohnt in der Extraversion.',
    lowNote:
      'Ein niedriger Wert bedeutet Direktheit und die Fähigkeit, unbequem zu sein. Das ist in Führung, Qualitätssicherung und Verhandlung ein Vorteil — solange der Ton nicht zur Gewohnheit wird.',
    tips: [
      'Hohe Werte: übe einen Satz, mit dem du ablehnst, ohne dich zu erklären.',
      'Niedrige Werte: prüfe vor scharfen Rückmeldungen, ob die Schärfe der Sache dient oder nur dir.',
    ],
  },
  {
    key: 'big5_C',
    title: 'Gewissenhaftigkeit',
    standfirst: 'Struktur, Dranbleiben und Verlässlichkeit — drei Dinge, die selten gleich stark sind.',
    domainId: 'big5_C',
    scaleIds: ['c_ordnung', 'c_fleiss', 'c_verantwortung'],
    explanation:
      'Gewissenhaftigkeit ist der beste Einzelprädiktor für beruflichen Erfolg und Gesundheitsverhalten in der Persönlichkeitsforschung — aber als Gesamtnote ziemlich grob. Ordnung (äußere Struktur), Beharrlichkeit (Dranbleiben) und Verlässlichkeit (Zusagen halten) laufen bei vielen Menschen deutlich auseinander. Ein chaotischer Schreibtisch sagt wenig darüber, ob jemand Fristen hält.',
    strengths: ['Verlässlichkeit', 'Ausdauer', 'Übersicht'],
    means: 'Wie du mit Verpflichtungen und Struktur umgehst.',
    meansNot: 'Wie klug oder wie fleißig du bist — Motivation hängt stark vom Thema ab.',
    lowNote:
      'Niedrige Werte gehen häufig mit Flexibilität und Spontaneität einher. Der Preis ist Reibung mit Terminen und Systemen; der Gewinn ist Beweglichkeit, wenn Pläne platzen. Wichtig zur Einordnung: Diese Fragen messen ausschließlich konventionelle, nach außen gerichtete Struktur — feste Plätze, Fristen, Zusagen an andere. Wer nach selbst gesetzten Regeln arbeitet und darin sehr konsequent ist, landet hier trotzdem niedrig. Der Wert sagt also etwas über die Passung zu fremden Systemen, nicht über deine innere Ordnung.',
    tips: [
      'Externe Struktur schlägt Willenskraft: ein einziger Ort für alle Zusagen.',
      'Große Aufgaben in Schritte zerlegen, die in einer Sitzung fertig werden.',
    ],
  },
  {
    key: 'big5_N',
    title: 'Emotionale Sensibilität',
    standfirst: 'Wie stark und wie schnell dein Gefühlssystem auf Belastung reagiert.',
    domainId: 'big5_N',
    scaleIds: ['n_angst', 'n_nieder', 'n_labil'],
    explanation:
      'Diese Dimension heißt in der Forschung Neurotizismus — ein Wort, das mehr Schaden anrichtet, als es erklärt. Gemeint ist die Reaktivität des emotionalen Systems: Sorgenneigung (wie schnell Bedrohung erkannt wird), Niedergeschlagenheit (wie tief Tiefs gehen) und Schwankung (wie stark es innerhalb eines Tages ausschlägt). Hohe Werte bedeuten intensiveres Erleben in beide Richtungen und ein früh anspringendes Warnsystem.',
    strengths: ['Frühwarnsystem für Risiken', 'Tiefe im Erleben', 'Ernsthaftigkeit'],
    means: 'Wie empfindlich dein Stresssystem eingestellt ist.',
    meansNot: 'Dass du psychisch krank bist oder schwach — es ist eine Reaktivität, kein Zustand.',
    lowNote:
      'Niedrige Werte bedeuten Gelassenheit und schnelle Erholung nach Rückschlägen. Der blinde Fleck: Warnsignale werden manchmal später bemerkt als bei anderen.',
    myths: [
      {
        myth: 'Hohe Werte heißen, man ist depressiv.',
        fact: 'Es ist eine Persönlichkeitsdimension, kein Krankheitsmaß. Sie beschreibt Reaktivität — nicht, wie es dir gerade geht.',
      },
    ],
    tips: [
      'Schlaf und Bewegung wirken auf diese Dimension messbar stärker als Vorsätze.',
      'Sorgen aufschreiben statt durchdenken — das begrenzt die Schleife.',
    ],
  },
  {
    key: 'big5_O',
    title: 'Offenheit',
    standfirst: 'Deine Beziehung zu Ideen, Kunst und dem, was noch nicht feststeht.',
    domainId: 'big5_O',
    scaleIds: ['o_neugier', 'o_aesthetik', 'o_fantasie'],
    explanation:
      'Offenheit ist die Dimension mit dem stärksten Bezug zu Kreativität. Sie zerfällt in intellektuelle Neugier (Lust an Warum-Fragen), ästhetisches Empfinden (wie sehr Kunst und Schönheit dich erreichen) und Vorstellungskraft (wie lebhaft dein inneres Kino ist). Diese drei sind erstaunlich unabhängig: Man kann leidenschaftlich analytisch und völlig unmusisch sein.',
    strengths: ['Ideenreichtum', 'Perspektivwechsel', 'Lernfreude'],
    means: 'Wie du auf Neues und Mehrdeutiges zugehst.',
    meansNot: 'Intelligenz. Offenheit ist Interesse, nicht Leistungsfähigkeit.',
    lowNote:
      'Niedrige Werte bedeuten Bodenhaftung und Präferenz für Bewährtes — in Umgebungen, die Verlässlichkeit über Experiment stellen, ist das ein klarer Vorteil.',
    tips: ['Neugier braucht Zeitfenster ohne Zweck — sonst frisst der Alltag sie auf.'],
  },
  {
    key: 'adhs',
    title: 'ADHS-Züge',
    standfirst: 'Aufmerksamkeit als Frage von Faszination, nicht von Willen.',
    domainId: 'adhs',
    scaleIds: ['adhs_unauf', 'adhs_hyper'],
    explanation:
      'Zwei Kerne, die getrennt betrachtet gehören: Unaufmerksamkeit (Fokus halten, Details abschließen, Dinge wiederfinden) und innere Unruhe mit Impulsivität (Bewegungsdrang, Ungeduld, Handeln vor Denken). Viele Menschen haben deutlich mehr vom einen als vom anderen — die stille, unaufmerksame Ausprägung wird im Alltag am häufigsten übersehen, weil sie niemanden stört. Aufmerksamkeit ist hier keine Frage von Anstrengung, sondern von Interesse: Bei fesselnden Dingen ist Hyperfokus möglich, bei langweiligen versagt die Steuerung.',
    strengths: ['Ideenreichtum', 'Hyperfokus', 'Energie in Krisen', 'Querdenken', 'Spontaneität'],
    means: 'Dass deine Aufmerksamkeitssteuerung anders arbeitet als der Durchschnitt.',
    meansNot: 'Dass du faul bist, eine Diagnose hast oder dich nur mehr anstrengen müsstest.',
    myths: [
      {
        myth: 'ADHS ist nur Kinderkram.',
        fact: 'Die Züge bleiben häufig bis ins Erwachsenenalter bestehen — im Mittel bei rund 43 % der Betroffenen (Owens et al. 2015 nennen eine Spanne von 35–65 %).',
      },
      {
        myth: 'Wer sich stundenlang fokussieren kann, hat kein ADHS.',
        fact: 'Hyperfokus ist ein typisches Merkmal, kein Gegenbeweis. Das Problem ist die Steuerbarkeit der Aufmerksamkeit, nicht ihre Menge.',
      },
      {
        myth: 'Das ist einfach fehlende Disziplin.',
        fact: 'Es geht um Selbstregulation, nicht um Wollen. Deshalb helfen externe Strukturen zuverlässiger als Vorsätze.',
      },
    ],
    tips: [
      'Externe Struktur schaffen: Timer, sichtbare Listen, „Body-Doubling“ (mit jemandem gemeinsam arbeiten).',
      'Große Aufgaben in Mini-Schritte zerlegen und den ersten so klein machen, dass er lächerlich wirkt.',
      'Bewegung vor Konzentrationsphasen einbauen — der Effekt ist bei ADHS-Zügen besonders deutlich.',
    ],
    resources:
      'ADHS Deutschland e. V. (adhs-deutschland.de) — Beratung und Selbsthilfegruppen, mit eigener Sektion für die AuDHD-Konstellation.',
  },
  {
    key: 'autism',
    title: 'Autistische Züge',
    standfirst: 'Eine andere Verdrahtung von sozialer Wahrnehmung, Reizverarbeitung und Tiefe.',
    domainId: 'autism',
    scaleIds: ['au_sozial', 'au_detail', 'au_routine', 'au_sensorik', 'au_interesse', 'au_woertlich'],
    explanation:
      'Autistische Züge sind kein einzelner Schalter, sondern ein Profil aus sechs recht unabhängigen Bereichen. Jemand kann stark sensorisch empfindlich sein und trotzdem sozial mühelos unterwegs — oder umgekehrt. Deshalb steht hier jede Facette einzeln: Erst das Muster über alle sechs ergibt ein Bild, und genau dieses Muster geht in Kurztests verloren, die nur eine Gesamtzahl ausgeben.',
    strengths: ['Detailtiefe', 'Ehrlichkeit', 'Loyalität', 'Fachexpertise', 'Mustererkennung', 'Ausdauer bei Herzensthemen'],
    means: 'Eine andere soziale und sensorische Verarbeitung.',
    meansNot: 'Empathielosigkeit, geringere Intelligenz oder fehlendes Interesse an Menschen.',
    myths: [
      {
        myth: 'Autistische Menschen haben keine Empathie.',
        fact: 'Häufig ist die affektive Empathie intakt oder sogar erhöht; herausfordernd ist die kognitive Perspektivübernahme (systematischer Review, Frontiers in Psychiatry 2024).',
      },
      {
        myth: 'Das sieht man doch.',
        fact: 'Viele maskieren ihre Züge über Jahre — besonders Frauen. Genau deshalb wird die Masking-Skala hier getrennt ausgewiesen.',
      },
      {
        myth: 'Autismus ist eine Krankheit, die man behandelt.',
        fact: 'Es ist eine neurologische Variante. Behandelt werden allenfalls Begleiterscheinungen wie Erschöpfung oder Angst.',
      },
    ],
    tips: [
      'Reizschutz vorbereiten statt improvisieren: Kopfhörer, Rückzugsort, Ausstiegsplan für Veranstaltungen.',
      'Direkt nachfragen ist erlaubt und effizient — die meisten Menschen empfinden es als Interesse.',
      'Routinen bewusst als Ressource behandeln, nicht als etwas, das man sich abgewöhnen sollte.',
    ],
    resources:
      'Bundesverband autismus Deutschland e. V. (autismus.de) — Dachverband mit rund 55 Regionalverbänden und Kartensuche für Anlaufstellen.',
  },
  {
    key: 'masking',
    title: 'Masking',
    standfirst: 'Der unsichtbare Aufwand, „normal“ zu wirken.',
    scaleIds: ['masking'],
    explanation:
      'Masking (auch Camouflaging) beschreibt die bewusste Arbeit, sozial unauffällig zu erscheinen: Blickkontakt erzwingen, Gesprächseinstiege vorbereiten, Mimik kopieren, Erschöpfung verbergen. Nach außen funktioniert es oft hervorragend — und genau das ist das Problem, weil der Aufwand unsichtbar bleibt. Die Forschung verbindet hohes Masking mit Erschöpfung und Angst; in einer Studie mit 305 autistischen Erwachsenen sagte es generalisierte und soziale Angst stärker voraus als Depression (Hull et al., Molecular Autism 2021).',
    strengths: ['Soziale Beobachtungsgabe', 'Anpassungsfähigkeit', 'Situationsgespür'],
    means: 'Dass du viel Energie in soziale Passung investierst.',
    meansNot: 'Dass du unecht bist. Masking ist eine Schutzstrategie, keine Charaktereigenschaft.',
    tips: [
      'Einen Menschen oder Ort identifizieren, an dem nichts gespielt werden muss — das entlastet mehr als jede Technik.',
      'Nach sozialen Terminen Erholung fest einplanen, bevor sie gebraucht wird.',
    ],
  },
  {
    key: 'empathy',
    title: 'Empathie: Kopf und Bauch',
    standfirst: 'Zwei Systeme, die unabhängig voneinander stark oder schwach sein können.',
    scaleIds: ['emp_cog', 'emp_aff'],
    explanation:
      'Kognitive Empathie ist Verstehen: erschließen, was jemand denkt, meint oder gleich tun wird. Affektive Empathie ist Mitschwingen: das Gefühl des anderen selbst spüren. Die beiden sind messbar unabhängig, und ihr Verhältnis sagt mehr aus als jede Einzelzahl. Bei autistischen Zügen ist typischerweise die affektive Seite intakt und die kognitive fordernd, bei ausgeprägten Dark Traits genau umgekehrt (Frontiers in Psychiatry 2024). Zwei völlig verschiedene Profile, die im Alltag ständig verwechselt werden.',
    strengths: ['Perspektivübernahme', 'Mitgefühl', 'Soziales Feingefühl'],
    means: 'Wie du soziale Information verarbeitest — verstehend, mitfühlend oder beides.',
    meansNot: 'Wie gut ein Mensch du bist. Beide Formen lassen sich gut oder schlecht einsetzen.',
    tips: [
      'Starke kognitive Empathie: nutze sie zum Deeskalieren, nicht nur zum Überzeugen.',
      'Starke affektive Empathie: plane emotionale Erholung ein, sonst übernimmst du dauerhaft fremde Zustände.',
    ],
  },
  {
    key: 'dark',
    title: 'Durchsetzung & Furchtlosigkeit',
    standfirst: 'Die Eigenschaften, die andere Tests „dunkel“ nennen — hier ohne Drama.',
    scaleIds: ['dark_bold', 'dark_mean', 'dark_disinh', 'dark_grand'],
    explanation:
      'Diese vier Merkmale sind in der Bevölkerung normal verteilt und in gesunder Dosis nützlich: Furchtlosigkeit (Ruhe unter Druck), kühle Durchsetzung (eigene Ziele auch gegen Widerstand), Impulsivität samt Regelferne und Grandiosität (das Gefühl, herauszuragen). Interessant ist ihr Verhältnis: Furchtlosigkeit allein ist eine Führungsressource. Erst zusammen mit hoher Kaltherzigkeit und niedriger affektiver Empathie wird daraus ein Muster, das anderen schadet.',
    strengths: ['Mut', 'Stressresistenz', 'Klare Entscheidungen unter Druck', 'Verhandlungsstärke'],
    means: 'Dass du durchsetzungsfähig und emotional robust bist.',
    meansNot: 'Dass du ein „Soziopath“ bist oder eine Störung hast. Dieser Test diagnostiziert nichts.',
    lowNote:
      'Niedrige Werte bedeuten Verträglichkeit, Vorsicht und Rücksicht. Der blinde Fleck liegt dann eher darin, eigene Interessen zu spät anzumelden.',
    myths: [
      {
        myth: 'Dark Traits = kriminell.',
        fact: 'Vor allem Furchtlosigkeit findet sich überdurchschnittlich häufig in Führungsrollen und in der ganz normalen Allgemeinbevölkerung.',
      },
      {
        myth: 'Solche Menschen haben gar keine Empathie.',
        fact: 'Die kognitive Empathie ist meist intakt — reduziert ist typischerweise die affektive.',
      },
      {
        myth: 'Das ist unveränderlich.',
        fact: 'Verhalten und Impulskontrolle sind trainierbar, auch wenn die Grundtendenz stabil bleibt.',
      },
    ],
    tips: [
      'Vor großen Entscheidungen kurz die Perspektive der Betroffenen durchspielen — schriftlich, nicht im Kopf.',
      'Bei Impulsen die Zehn-Sekunden-Regel: erst zählen, dann handeln.',
      'Durchsetzungskraft gezielt für gemeinsame Ziele einsetzen; sie wirkt dort am stärksten.',
    ],
    resources:
      'Bei Leidensdruck: psychotherapeutische Beratung. Niedrigschwellig und rund um die Uhr: TelefonSeelsorge 116 123.',
  },
  {
    key: 'attachment',
    title: 'Bindungsstil',
    standfirst: 'Wie du Nähe erlebst — und was passiert, wenn sie unsicher wird.',
    scaleIds: ['att_secure', 'att_anx', 'att_avoid'],
    explanation:
      'Bindung wird über zwei unabhängige Achsen gemessen: Angst (Sorge vor Verlust und Zurückweisung) und Vermeidung (Reflex, bei Nähe Abstand zu schaffen). Aus ihrer Kombination ergibt sich der Stil. Niedrig auf beiden heißt sicher. Hoch auf beiden ist die anstrengendste Variante, weil sich Wunsch und Schutzreflex gegenseitig blockieren. Wichtig: Bindungsstile entstehen aus Erfahrungen und verändern sich mit neuen — sie sind kein Urteil über dich.',
    strengths: ['Bindungsmuster erkennen', 'Bedürfnisse benennen', 'Beziehungen bewusst gestalten'],
    means: 'Welches Muster in engen Beziehungen bei Stress anspringt.',
    meansNot: 'Ob du beziehungsfähig bist. Alle Stile führen funktionierende Beziehungen.',
    tips: [
      'Hohe Bindungsangst: Deutungen aktiv auf Belege prüfen, bevor du reagierst.',
      'Hohe Vermeidung: kleine Dosen Verletzlichkeit ausprobieren — die Wirkung überrascht die meisten.',
      'Ein Rückzug mit Rückkehrzusage („ich brauche eine Stunde, dann bin ich wieder da“) entschärft fast jedes Muster.',
    ],
  },
  {
    key: 'love',
    title: 'Love Styles',
    standfirst: 'Sechs Arten, Zuneigung zu geben und zu empfangen — per Zwangswahl gemessen.',
    scaleIds: ['love_klartext', 'love_momente', 'love_anpacken', 'love_naehe', 'love_wachstum', 'love_zeichen'],
    explanation:
      'Ein eigenes Sechs-Faktoren-Modell: Klartext (Worte), Momente (gemeinsame Zeit), Anpacken (Taten), Nähe (Berührung), Wachstum (gemeinsame Entwicklung) und Zeichen (kleine Gesten). Diese Dimension wird nicht über Zustimmung gemessen, sondern über Zwangswahl: Jede Sprache trat gegen jede andere genau einmal an, der Wert ist die Trefferquote aus fünf Duellen. Der Grund ist methodisch — bei „liebevolle Worte bedeuten mir viel“ stimmen fast alle zu, was ein flaches Profil ohne Aussage ergibt. Erst der erzwungene Verzicht zeigt eine echte Rangfolge. Der praktische Nutzen liegt im Abgleich: Die meisten Menschen geben in ihrer eigenen Lieblingssprache — und wundern sich, dass es nicht ankommt.',
    means: 'Welche Form von Zuneigung dich am zuverlässigsten erreicht.',
    meansNot: 'Eine feste Kategorie. Die Rangfolge verschiebt sich mit Lebensphasen und Beziehungen.',
    tips: [
      'Sag deinen Nächsten deine Top-Zwei. Gedankenlesen funktioniert nachweislich nicht.',
      'Beobachte, in welcher Sprache andere geben — meist ist es die, die sie selbst brauchen.',
    ],
  },
  {
    key: 'sensitivity',
    title: 'Sensibilität & Selbstwahrnehmung',
    standfirst: 'Wie viel bei dir ankommt — und wie gut du es benennen kannst.',
    scaleIds: ['hsp', 'rejection_sens', 'alexithymia'],
    explanation:
      'Drei verwandte, aber verschiedene Dinge. Hochsensibilität beschreibt eine intensivere Verarbeitung von Reizen und Stimmungen. Zurückweisungs-Sensibilität ist die Empfindlichkeit gegenüber (auch nur vermuteter) Ablehnung. Die dritte Skala erfasst, wie schwer es fällt, eigene Emotionen zu erkennen und zu benennen — ein hoher Wert heißt hier: es fällt schwer. Zusammen erklären sie viel darüber, wie sich dein Alltag von innen anfühlt.',
    strengths: ['Feine Wahrnehmung', 'Frühwarnsystem für Stimmungen', 'Tiefes Erleben'],
    means: 'Wie durchlässig und wie fein dein Wahrnehmungssystem eingestellt ist.',
    meansNot: 'Dass du zu empfindlich bist. Es ist eine Verarbeitungstiefe, keine Schwäche.',
    tips: [
      'Hohe Sensibilität: Reizpausen sind Wartung. Vorher einplanen wirkt besser als hinterher reparieren.',
      'Hohe Zurückweisungs-Sensibilität: erst nachfragen, dann interpretieren.',
      'Wenn dir das Benennen schwerfällt: abends drei Wörter notieren — Situation, Körpergefühl, Vermutung.',
    ],
  },
];

export const DIMENSION_BY_KEY = new Map(DIMENSIONS.map((d) => [d.key, d]));

export const OVERLAPS = [
  {
    title: 'Warum ADHS- und autistische Züge sich ähneln können',
    text:
      'Beide treten häufig zusammen auf — die Community nennt das „AuDHD“. Zwillings- und Familienstudien zeigen eine erhebliche genetische Überschneidung; im schwedischen Zwillingsregister erfüllten 51 % der Kinder mit Autismus auch ADHS-Kriterien, die genetische Korrelation lag bei rg = 0,87 (Lichtenstein/Ronald, Am J Psychiatry 2010). Deshalb laden in diesem Test einige Fragen bewusst auf beide Skalen. Ein hoher Wert in beiden ist kein Widerspruch, sondern ein bekanntes Muster. Unterscheiden lassen sich die beiden am ehesten über das Warum: Ein sozialer Fehltritt aus Detailfokus ist etwas anderes als einer aus Aufmerksamkeitsdrift, und Sensorik läuft oft gegenläufig — Reizschutz beim einen, Reizsuche beim anderen.',
  },
  {
    title: 'Empathie ist nicht gleich Empathie',
    text:
      'Kognitive Empathie (verstehen, was jemand denkt) und affektive Empathie (mitfühlen, was jemand fühlt) sind zwei getrennte Systeme. Bei autistischen Zügen ist die affektive Seite oft intakt oder erhöht, während die kognitive Perspektivübernahme fordernd bleibt. Bei ausgeprägten Dark Traits ist es umgekehrt: gutes Gedankenlesen, wenig Mitschwingen (systematischer Review, Frontiers in Psychiatry 2024). Dazu kommt das Double-Empathy-Problem (Milton 2012): Missverständnisse zwischen autistischen und nicht-autistischen Menschen gehen in beide Richtungen — es ist kein einseitiges Defizit, sondern eine Übersetzungslücke.',
  },
  {
    title: 'Warum Facetten mehr sagen als Gesamtwerte',
    text:
      'Ein mittlerer Gewissenhaftigkeitswert kann bedeuten, dass alles im Mittelfeld liegt — oder dass maximale Verlässlichkeit auf völliges Ordnungschaos trifft. Beides ergibt dieselbe Zahl und beschreibt völlig verschiedene Menschen. Genau deshalb steht in dieser Auswertung unter jeder Dimension die Facettenebene: Dort wird sichtbar, was der Durchschnitt verschluckt. Tests, die nur fünf oder zehn Zahlen ausgeben, verlieren diese Information zwangsläufig.',
  },
];

/** The ten axes of the overview radar (dark = mean of the four dark facets). */
export const RADAR_SCALES: { id: string; label: string; short: string }[] = [
  { id: 'big5_E', label: 'Extraversion', short: 'Extraversion' },
  { id: 'big5_A', label: 'Verträglichkeit', short: 'Verträglichk.' },
  { id: 'big5_C', label: 'Gewissenhaftigkeit', short: 'Gewissenhaft.' },
  { id: 'big5_N', label: 'Emotionale Sensibilität', short: 'Emot. Sensib.' },
  { id: 'big5_O', label: 'Offenheit', short: 'Offenheit' },
  { id: 'adhs', label: 'ADHS-Züge', short: 'ADHS' },
  { id: 'autism', label: 'Autistische Züge', short: 'Autismus' },
  { id: 'dark', label: 'Durchsetzung', short: 'Durchsetzung' },
  { id: 'hsp', label: 'Hochsensibilität', short: 'Sensibilität' },
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
