// The item pool — single source of truth for both the questionnaire and the
// loading matrix. Items and their loadings live together on purpose: this is an
// open-source instrument, so the scoring must be as readable as the questions.
//
// LICENSING: every core item below is an original German formulation written for
// this project. They are informed by published *constructs* (IPIP/BFI-2 facet
// structure, DSM-5 attention/hyperactivity domains, camouflaging research, the
// triarchic psychopathy model, ECR attachment dimensions, sensory-processing
// sensitivity) but reproduce no wording from any copyrighted scale. That keeps the
// whole repository MIT-clean. The only verbatim instruments are PHQ-9 and GAD-7,
// which their rights holder released for free reproduction — see ATTRIBUTIONS.
//
// A facet item automatically also loads its parent domain at full weight, so the
// domain score is computed from all of its items rather than from facet averages.

import type { ItemDef, Loading } from '@/lib/engine/types';
import { SCALE_BY_ID } from './scales';

/** [scaleId, weight, direction] — direction -1 means the item counts inverted. */
type Load = [scaleId: string, weight: number, direction: 1 | -1];

interface Spec {
  id: string;
  text: string;
  /** Primary scale, always weight 1.0. Prefix with '-' to load it inverted. */
  primary: string;
  /** Additional cross-loadings. */
  also?: Load[];
  attentionCheck?: number;
  socialDesirability?: boolean;
  /** Forced-choice pair: [scaleIdA, labelA, scaleIdB, labelB]. */
  choice?: [string, string, string, string];
}

// ---------------------------------------------------------------------------
// Block 1 — Dein Grundton: Extraversion & Verträglichkeit
// ---------------------------------------------------------------------------
const BLOCK_1: Spec[] = [
  { id: 'e1', text: 'Ich gehe von mir aus auf fremde Menschen zu.', primary: 'e_gesellig' },
  { id: 'e2', text: 'In größeren Runden bleibe ich lieber am Rand.', primary: '-e_gesellig' },
  { id: 'e3', text: 'Wenn eine Gruppe keine Richtung hat, gebe ich sie vor.', primary: 'e_durchsetzung' },
  { id: 'e4', text: 'Meine Meinung sage ich auch dann, wenn sie unbequem ist.', primary: 'e_durchsetzung' },
  { id: 'e5', text: 'Mir fehlt selten der Schwung, etwas anzugehen.', primary: 'e_energie' },
  { id: 'e6', text: 'Ich brauche lange, um in Gang zu kommen.', primary: '-e_energie' },
  { id: 'a1', text: 'Es geht mir nahe, wenn es jemandem schlecht geht.', primary: 'a_mitgefuehl', also: [['emp_aff', 0.4, 1]] },
  { id: 'a2', text: 'Die Sorgen anderer lassen mich ziemlich kalt.', primary: '-a_mitgefuehl', also: [['emp_aff', 0.4, -1]] },
  { id: 'a3', text: 'Auch im Streit bleibe ich fair im Ton.', primary: 'a_respekt' },
  { id: 'a4', text: 'Ich sage Leuten ungefiltert, was ich von ihnen halte.', primary: '-a_respekt' },
  { id: 'a5', text: 'Ich gehe erst einmal davon aus, dass Menschen es ehrlich meinen.', primary: 'a_vertrauen' },
  { id: 'a6', text: 'Bei neuen Bekanntschaften rechne ich damit, ausgenutzt zu werden.', primary: '-a_vertrauen' },
  { id: 'e7', text: 'Meine Freizeit verbringe ich am liebsten mit anderen.', primary: 'e_gesellig' },
  { id: 'e8', text: 'Ein Abend allein lädt mich mehr auf als eine Party.', primary: '-e_gesellig' },
  { id: 'e9', text: 'In Diskussionen überlasse ich anderen lieber das Feld.', primary: '-e_durchsetzung' },
  { id: 'e10', text: 'Ich übernehme selbstverständlich die Rolle, in der entschieden wird.', primary: 'e_durchsetzung' },
  { id: 'e11', text: 'Ich bin fast immer in Bewegung.', primary: 'e_energie' },
  { id: 'e12', text: 'Mein Tempo ist eher gemächlich.', primary: '-e_energie' },
  { id: 'a7', text: 'Wenn jemand Hilfe braucht, biete ich sie von selbst an.', primary: 'a_mitgefuehl' },
  { id: 'a8', text: 'Die Probleme anderer sind in erster Linie deren Sache.', primary: '-a_mitgefuehl' },
  { id: 'a9', text: 'Ich achte darauf, niemanden bloßzustellen.', primary: 'a_respekt' },
  { id: 'a10', text: 'Wenn mich jemand nervt, merkt derjenige das sofort.', primary: '-a_respekt' },
  { id: 'a11', text: 'Ich leihe Dinge aus, ohne lange nachzudenken.', primary: 'a_vertrauen' },
  { id: 'a12', text: 'Ich prüfe lieber nach, bevor ich jemandem glaube.', primary: '-a_vertrauen' },
];

// ---------------------------------------------------------------------------
// Block 2 — Antrieb & Struktur: Gewissenhaftigkeit, emotionale Sensibilität, Offenheit
// ---------------------------------------------------------------------------
const BLOCK_2: Spec[] = [
  { id: 'c1', text: 'Meine Sachen haben feste Plätze.', primary: 'c_ordnung' },
  { id: 'c2', text: 'In meinem Alltag herrscht ziemliches Chaos.', primary: '-c_ordnung', also: [['adhs_unauf', 0.4, 1]] },
  { id: 'c3', text: 'Angefangene Dinge bringe ich zu Ende.', primary: 'c_fleiss' },
  { id: 'c4', text: 'Wenn etwas zäh wird, verliere ich die Lust.', primary: '-c_fleiss', also: [['adhs_unauf', 0.35, 1]] },
  { id: 'c5', text: 'Auf meine Zusagen kann man sich verlassen.', primary: 'c_verantwortung' },
  { id: 'c6', text: 'Termine und Fristen gehen bei mir manchmal unter.', primary: '-c_verantwortung', also: [['adhs_unauf', 0.5, 1]] },
  { id: 'n1', text: 'Ich mache mir über vieles im Voraus Sorgen.', primary: 'n_angst' },
  { id: 'n2', text: 'Auch in angespannten Lagen bleibe ich gelassen.', primary: '-n_angst', also: [['dark_bold', 0.3, 1]] },
  { id: 'n3', text: 'Es gibt Phasen, in denen mich alles herunterzieht.', primary: 'n_nieder' },
  { id: 'n4', text: 'Rückschläge stecke ich schnell weg.', primary: '-n_nieder' },
  { id: 'n5', text: 'Meine Stimmung kann innerhalb weniger Stunden kippen.', primary: 'n_labil' },
  { id: 'n6', text: 'Emotional bin ich ziemlich ausgeglichen.', primary: '-n_labil' },
  { id: 'o1', text: 'Ich will verstehen, wie Dinge im Kern funktionieren.', primary: 'o_neugier' },
  { id: 'o2', text: 'Abstrakte Gedankenspiele langweilen mich.', primary: '-o_neugier' },
  { id: 'o3', text: 'Musik, Bilder oder Landschaften können mich tief berühren.', primary: 'o_aesthetik', also: [['hsp', 0.3, 1]] },
  { id: 'o4', text: 'Für Kunst habe ich wenig übrig.', primary: '-o_aesthetik' },
  { id: 'o5', text: 'In meinem Kopf laufen oft ganze Szenen ab.', primary: 'o_fantasie' },
  { id: 'o6', text: 'Ich träume mich gern in andere Welten.', primary: 'o_fantasie' },
  { id: 'c7', text: 'Bevor ich anfange, räume ich erst auf.', primary: 'c_ordnung' },
  { id: 'c8', text: 'Ich finde Dinge nur, weil ich weiß, in welchem Haufen sie liegen.', primary: '-c_ordnung' },
  { id: 'c9', text: 'Ich arbeite auch dann weiter, wenn niemand kontrolliert.', primary: 'c_fleiss' },
  { id: 'c10', text: 'Neue Ideen reizen mich mehr als das Fertigstellen alter.', primary: '-c_fleiss' },
  { id: 'c11', text: 'Wenn ich etwas zusage, plane ich es sofort ein.', primary: 'c_verantwortung' },
  { id: 'c12', text: 'Ich sage Dinge zu und merke später, dass ich sie nicht schaffe.', primary: '-c_verantwortung' },
  { id: 'n7', text: 'Vor wichtigen Terminen bin ich unruhig.', primary: 'n_angst' },
  { id: 'n8', text: 'Ungewissheit hält mich selten wach.', primary: '-n_angst' },
  { id: 'n9', text: 'Manchmal fühlt sich alles sinnlos an.', primary: 'n_nieder' },
  { id: 'n10', text: 'Ich bin grundsätzlich guter Dinge.', primary: '-n_nieder' },
  { id: 'n11', text: 'Kleinigkeiten können meine Laune komplett drehen.', primary: 'n_labil' },
  { id: 'n12', text: 'Meine Grundstimmung bleibt über den Tag hinweg stabil.', primary: '-n_labil' },
  { id: 'o7', text: 'Ich lese oder höre regelmäßig etwas, nur um es zu verstehen.', primary: 'o_neugier' },
  { id: 'o8', text: 'Mir reicht, dass etwas funktioniert — das Warum interessiert mich wenig.', primary: '-o_neugier' },
  { id: 'o9', text: 'Ein gut gestalteter Raum verändert, wie ich mich fühle.', primary: 'o_aesthetik' },
  { id: 'o10', text: 'Ob etwas schön ist, spielt für mich kaum eine Rolle.', primary: '-o_aesthetik' },
  { id: 'o11', text: 'Ich male mir Situationen im Voraus lebhaft aus.', primary: 'o_fantasie' },
  { id: 'o12', text: 'Ich denke selten in Bildern.', primary: '-o_fantasie' },
  { id: 'ps1', text: 'Ich setze mir Maßstäbe, die sonst niemand von mir verlangt.', primary: 'perf_self' },
  { id: 'ps2', text: 'Etwas nur gut zu machen reicht mir nicht.', primary: 'perf_self', also: [['c_fleiss', 0.3, 1]] },
  { id: 'ps3', text: 'Ich bin schnell zufrieden mit dem, was ich abliefere.', primary: '-perf_self' },
  { id: 'ps4', text: 'Eigene Fehler gehen mir noch lange nach.', primary: 'perf_self', also: [['n_nieder', 0.3, 1]] },
  { id: 'pf1', text: 'Ich habe das Gefühl, dass andere Fehlerlosigkeit von mir erwarten.', primary: 'perf_social' },
  { id: 'pf2', text: 'Wenn mir etwas misslingt, verliere ich in den Augen anderer an Wert.', primary: 'perf_social', also: [['rejection_sens', 0.4, 1]] },
  { id: 'pf3', text: 'Ich glaube nicht, dass jemand Perfektion von mir erwartet.', primary: '-perf_social' },
  { id: 'pf4', text: 'Der Druck, dem ich mich ausgesetzt fühle, kommt vor allem von außen.', primary: 'perf_social', also: [['n_angst', 0.3, 1]] },
];

// ---------------------------------------------------------------------------
// Block 3 — Fokus & Wahrnehmung: ADHS- und autistische Züge
// ---------------------------------------------------------------------------
const BLOCK_3: Spec[] = [
  { id: 'ad1', text: 'Bei längeren Texten oder Gesprächen driftet mein Kopf ab.', primary: 'adhs_unauf' },
  { id: 'ad2', text: 'Die letzten zehn Prozent einer Aufgabe bleiben oft liegen.', primary: 'adhs_unauf', also: [['c_fleiss', 0.4, -1]] },
  { id: 'ad3', text: 'Ich verlege Dinge, die ich eben noch in der Hand hatte.', primary: 'adhs_unauf' },
  { id: 'ad4', text: 'Aufgaben, die viel Konzentration verlangen, schiebe ich vor mir her.', primary: 'adhs_unauf' },
  { id: 'ad5', text: 'Ich vergesse Rückmeldungen, die ich fest zugesagt hatte.', primary: 'adhs_unauf' },
  { id: 'ad6', text: 'In einer Umgebung mit Geräuschen kann ich kaum arbeiten.', primary: 'adhs_unauf', also: [['hsp', 0.4, 1], ['au_sensorik', 0.3, 1]] },
  { id: 'ad7', text: 'Langes Stillsitzen fällt mir körperlich schwer.', primary: 'adhs_hyper' },
  { id: 'ad8', text: 'Ich rede los, bevor mein Gegenüber ausgesprochen hat.', primary: 'adhs_hyper', also: [['dark_disinh', 0.35, 1]] },
  { id: 'ad9', text: 'Warten macht mich innerlich kribbelig.', primary: 'adhs_hyper' },
  { id: 'ad10', text: 'Ich entscheide aus dem Bauch und bereue es manchmal.', primary: 'adhs_hyper', also: [['dark_disinh', 0.5, 1]] },
  { id: 'ad11', text: 'Auch wenn ich äußerlich ruhig wirke, ist es in mir unruhig.', primary: 'adhs_hyper' },
  { id: 'ad12', text: 'Ich fange Neues an, bevor das Alte fertig ist.', primary: 'adhs_hyper', also: [['c_fleiss', 0.3, -1]] },
  { id: 'au1', text: 'Ironie und Andeutungen bemerke ich oft erst später.', primary: 'au_sozial', also: [['emp_cog', 0.4, -1]] },
  { id: 'au2', text: 'Ungeschriebene Regeln in Gruppen erschließen sich mir schwer.', primary: 'au_sozial', also: [['emp_cog', 0.3, -1]] },
  { id: 'au3', text: 'Small Talk ohne Inhalt strengt mich an.', primary: 'au_sozial', also: [['e_gesellig', 0.4, -1]] },
  { id: 'au4', text: 'Mir fallen Kleinigkeiten auf, die andere übersehen.', primary: 'au_detail' },
  { id: 'au5', text: 'Unstimmigkeiten in Zahlen oder Texten springen mir ins Auge.', primary: 'au_detail', also: [['c_ordnung', 0.3, 1]] },
  { id: 'au6', text: 'Feste Abläufe geben mir Sicherheit.', primary: 'au_routine', also: [['c_ordnung', 0.3, 1]] },
  { id: 'au7', text: 'Kurzfristige Planänderungen bringen mich aus dem Takt.', primary: 'au_routine', also: [['n_angst', 0.3, 1]] },
  { id: 'au8', text: 'Ich habe Wege und Reihenfolgen, von denen ich ungern abweiche.', primary: 'au_routine' },
  { id: 'au9', text: 'Bestimmte Geräusche kann ich einfach nicht ausblenden.', primary: 'au_sensorik', also: [['hsp', 0.5, 1]] },
  { id: 'au10', text: 'Grelles Licht strengt mich stark an.', primary: 'au_sensorik', also: [['hsp', 0.4, 1]] },
  { id: 'au11', text: 'Manche Stoffe oder Etiketten auf der Haut sind für mich kaum auszuhalten.', primary: 'au_sensorik', also: [['hsp', 0.4, 1]] },
  { id: 'au12', text: 'In Themen, die mich packen, versinke ich stundenlang.', primary: 'au_interesse', also: [['o_neugier', 0.3, 1]] },
  { id: 'au13', text: 'Über meine Lieblingsthemen weiß ich ungewöhnlich viel.', primary: 'au_interesse' },
  { id: 'au14', text: 'Ich nehme Aussagen zunächst wörtlich.', primary: 'au_woertlich' },
  { id: 'au15', text: 'Ich wünschte, Menschen würden einfach direkt sagen, was sie meinen.', primary: 'au_woertlich' },
  { id: 'au16', text: 'Nach längerem Kontakt mit Menschen bin ich völlig leer.', primary: 'autism', also: [['e_gesellig', 0.6, -1], ['hsp', 0.5, 1]] },
  { id: 'ad13', text: 'Ich arbeite konzentriert, auch wenn eine Aufgabe langweilig ist.', primary: '-adhs_unauf' },
  { id: 'ad14', text: 'Ich kann problemlos lange still sitzen und zuhören.', primary: '-adhs_hyper' },
  { id: 'au17', text: 'In Gruppen weiß ich intuitiv, was gerade angemessen ist.', primary: '-au_sozial' },
  { id: 'au18', text: 'Feinheiten entgehen mir häufig.', primary: '-au_detail' },
  { id: 'au19', text: 'Ich bemerke sofort, wenn jemand etwas verändert hat.', primary: 'au_detail' },
  { id: 'au20', text: 'Spontane Planänderungen machen mir nichts aus.', primary: '-au_routine' },
  { id: 'au21', text: 'Lärm und Gewusel stören mich kaum.', primary: '-au_sensorik' },
  { id: 'au22', text: 'Ich beschäftige mich mit vielem, aber nichts davon besonders tief.', primary: '-au_interesse' },
  { id: 'au23', text: 'Ich kann über meine Themen sehr lange sprechen.', primary: 'au_interesse' },
  { id: 'au24', text: 'Zwischen den Zeilen zu lesen fällt mir leicht.', primary: '-au_woertlich' },
  { id: 'au25', text: 'Redewendungen muss ich mir innerlich übersetzen.', primary: 'au_woertlich' },
  { id: 'ax1', text: 'Wenn eine Aufgabe anspruchsvoller wird, fällt mir das Konzentrieren leichter.', primary: 'attn_challenge' },
  { id: 'ax2', text: 'Bei zu leichten Aufgaben schweife ich ab, bei schwierigen nicht.', primary: 'attn_challenge' },
  { id: 'ax3', text: 'Auch anspruchsvolle Aufgaben halte ich schlecht durch, wenn sie mich nicht packen.', primary: '-attn_challenge' },
  { id: 'ax4', text: 'Ob etwas schwer oder leicht ist, ändert an meiner Konzentration wenig.', primary: '-attn_challenge' },
];

// ---------------------------------------------------------------------------
// Block 4 — Innenleben & Durchsetzung: Masking, Empathie, Dark Traits
// ---------------------------------------------------------------------------
const BLOCK_4: Spec[] = [
  { id: 'mk1', text: 'In Gesellschaft spiele ich eine Rolle, statt ich selbst zu sein.', primary: 'masking', also: [['n_angst', 0.25, 1]] },
  { id: 'mk2', text: 'Ich beobachte andere genau, um mir abzuschauen, wie man sich verhält.', primary: 'masking', also: [['autism', 0.35, 1]] },
  { id: 'mk3', text: 'Ich zwinge mich zu Blickkontakt, obwohl er mir unangenehm ist.', primary: 'masking', also: [['autism', 0.4, 1]] },
  { id: 'mk4', text: 'Ich lege mir Sätze für Gespräche im Voraus zurecht.', primary: 'masking', also: [['n_angst', 0.3, 1]] },
  { id: 'mk5', text: 'Nach sozialen Situationen bin ich erschöpft vom Zusammenreißen.', primary: 'masking', also: [['autism', 0.35, 1]] },
  { id: 'mk6', text: 'Die wenigsten Menschen kennen die Version von mir, die ich allein bin.', primary: 'masking' },
  { id: 'ec1', text: 'Ich erkenne schnell, was jemand wirklich meint.', primary: 'emp_cog' },
  { id: 'ec2', text: 'Ich kann mir gut vorstellen, wie eine Situation für andere aussieht.', primary: 'emp_cog' },
  { id: 'ec3', text: 'Mir ist meist klar, wie meine Worte bei anderen ankommen.', primary: 'emp_cog' },
  { id: 'ec4', text: 'Die Beweggründe anderer zu durchschauen fällt mir leicht.', primary: 'emp_cog' },
  { id: 'ea1', text: 'Wenn jemand weint, steigt es in mir auch hoch.', primary: 'emp_aff' },
  { id: 'ea2', text: 'Die Stimmung im Raum überträgt sich sofort auf mich.', primary: 'emp_aff', also: [['hsp', 0.5, 1]] },
  { id: 'ea3', text: 'Bei traurigen Geschichten bin ich kaum zu halten.', primary: 'emp_aff' },
  { id: 'ea4', text: 'Fremdes Leid kann mir den ganzen Tag verderben.', primary: 'emp_aff', also: [['hsp', 0.35, 1]] },
  { id: 'db1', text: 'Situationen, die andere nervös machen, lassen mich kalt.', primary: 'dark_bold', also: [['n_angst', 0.35, -1]] },
  { id: 'db2', text: 'Risiko reizt mich mehr, als es mir Angst macht.', primary: 'dark_bold' },
  { id: 'db3', text: 'Vor fremden Gruppen zu sprechen macht mir nichts aus.', primary: 'dark_bold', also: [['e_durchsetzung', 0.4, 1]] },
  { id: 'dm1', text: 'Ich setze meine Interessen durch, auch wenn andere dabei zu kurz kommen.', primary: 'dark_mean', also: [['a_mitgefuehl', 0.4, -1]] },
  { id: 'dm2', text: 'Das Leid anderer berührt mich weniger als die meisten Menschen.', primary: 'dark_mean', also: [['emp_aff', 0.7, -1]] },
  { id: 'dm3', text: 'Ich weiß, wie ich Menschen dorthin bringe, wo ich sie haben will.', primary: 'dark_mean', also: [['emp_cog', 0.3, 1]] },
  { id: 'dd1', text: 'Regeln sehe ich eher als Vorschlag.', primary: 'dark_disinh', also: [['c_verantwortung', 0.3, -1]] },
  { id: 'dd2', text: 'Ich handle im Moment, ohne an die Folgen zu denken.', primary: 'dark_disinh', also: [['adhs_hyper', 0.6, 1]] },
  { id: 'dd3', text: 'Wenn ich etwas jetzt will, blende ich die Konsequenzen aus.', primary: 'dark_disinh' },
  { id: 'dg1', text: 'Ich halte mich für fähiger als die meisten in meinem Umfeld.', primary: 'dark_grand', also: [['a_respekt', 0.3, -1]] },
  { id: 'dg2', text: 'Besondere Menschen sollten auch besonders behandelt werden.', primary: 'dark_grand' },
  { id: 'dg3', text: 'Es stört mich, wenn meine Leistung nicht gesehen wird.', primary: 'dark_grand' },
  { id: 'mk7', text: 'Ich bin überall ziemlich genau derselbe Mensch.', primary: '-masking' },
  { id: 'ec5', text: 'Ich liege oft daneben, wenn ich einschätze, was jemand denkt.', primary: '-emp_cog' },
  { id: 'ea5', text: 'Die Gefühle anderer lassen mich meist unberührt.', primary: '-emp_aff' },
  { id: 'db4', text: 'Vor riskanten Situationen weiche ich lieber zurück.', primary: '-dark_bold' },
  { id: 'dm4', text: 'Ich verzichte lieber selbst, als jemanden zu übervorteilen.', primary: '-dark_mean' },
  { id: 'dd4', text: 'Ich denke Entscheidungen gründlich durch, bevor ich handle.', primary: '-dark_disinh' },
  { id: 'dg4', text: 'Ich sehe mich als einen von vielen.', primary: '-dark_grand' },
];

// ---------------------------------------------------------------------------
// Block 5 — Nähe & Liebe: Bindungsstil und Love Styles
// ---------------------------------------------------------------------------
const BLOCK_5: Spec[] = [
  { id: 'bx1', text: 'Ich habe Angst, wichtige Menschen zu verlieren.', primary: 'att_anx' },
  { id: 'bx2', text: 'Ich sorge mich, weniger gemocht zu werden, als ich selbst mag.', primary: 'att_anx', also: [['rejection_sens', 0.5, 1]] },
  { id: 'bx3', text: 'Wenn jemand länger nicht antwortet, denke ich sofort das Schlimmste.', primary: 'att_anx', also: [['rejection_sens', 0.5, 1]] },
  { id: 'bx4', text: 'Ich brauche viel Bestätigung, dass zwischen uns alles in Ordnung ist.', primary: 'att_anx' },
  { id: 'bv1', text: 'Über meine tiefsten Gefühle rede ich nicht gern.', primary: 'att_avoid', also: [['alexithymia', 0.3, 1]] },
  { id: 'bv2', text: 'Ich verlasse mich lieber auf mich selbst als auf andere.', primary: 'att_avoid' },
  { id: 'bv3', text: 'Wenn mir jemand zu nah kommt, brauche ich Abstand.', primary: 'att_avoid' },
  { id: 'bv4', text: 'Hilfe anzunehmen fällt mir schwer.', primary: 'att_avoid' },
  { id: 'bs1', text: 'Es fällt mir leicht, mich emotional einzulassen.', primary: 'att_secure', also: [['att_avoid', 0.5, -1]] },
  { id: 'bs2', text: 'Ich kann mich auf nahe Menschen verlassen, ohne mich zu verlieren.', primary: 'att_secure' },
  { id: 'bs3', text: 'Nähe und Eigenständigkeit gehen für mich gut zusammen.', primary: 'att_secure', also: [['att_anx', 0.35, -1]] },
  { id: 'bx5', text: 'Ich vertraue darauf, dass wichtige Menschen bleiben.', primary: '-att_anx' },
  { id: 'bv5', text: 'Ich lasse andere nah an mich heran.', primary: '-att_avoid' },
  { id: 'bs4', text: 'In engen Beziehungen bin ich selten wirklich entspannt.', primary: '-att_secure' },
];


// ---------------------------------------------------------------------------
// Block 5b — Love Styles as forced choice.
//
// Preferences are not agreement. On a Likert scale almost everyone endorses
// "kind words mean a lot to me", which produced near-flat profiles (75/75/75/…)
// that discriminated nothing. A full round robin over the six styles forces a
// ranking instead: each style is compared against every other exactly once, so
// the score is simply how often it won out of five.
// ---------------------------------------------------------------------------
const BLOCK_5B: Spec[] = [
  { id: 'fc01', text: 'Was würde dir mehr fehlen?', primary: '', choice: ['love_klartext', 'dass jemand ausspricht, was er an dir schätzt', 'love_momente', 'ungeteilte gemeinsame Zeit'] },
  { id: 'fc02', text: 'Was würde dir mehr fehlen?', primary: '', choice: ['love_anpacken', 'dass dir jemand konkret etwas abnimmt', 'love_klartext', 'dass jemand ausspricht, was er an dir schätzt'] },
  { id: 'fc03', text: 'Was würde dir mehr fehlen?', primary: '', choice: ['love_klartext', 'dass jemand ausspricht, was er an dir schätzt', 'love_naehe', 'körperliche Nähe'] },
  { id: 'fc04', text: 'Was würde dir mehr fehlen?', primary: '', choice: ['love_wachstum', 'gemeinsam an etwas zu wachsen', 'love_klartext', 'dass jemand ausspricht, was er an dir schätzt'] },
  { id: 'fc05', text: 'Was würde dir mehr fehlen?', primary: '', choice: ['love_klartext', 'dass jemand ausspricht, was er an dir schätzt', 'love_zeichen', 'kleine Zeichen, dass jemand an dich gedacht hat'] },
  { id: 'fc06', text: 'Was würde dir mehr fehlen?', primary: '', choice: ['love_anpacken', 'dass dir jemand konkret etwas abnimmt', 'love_momente', 'ungeteilte gemeinsame Zeit'] },
  { id: 'fc07', text: 'Was würde dir mehr fehlen?', primary: '', choice: ['love_momente', 'ungeteilte gemeinsame Zeit', 'love_naehe', 'körperliche Nähe'] },
  { id: 'fc08', text: 'Was würde dir mehr fehlen?', primary: '', choice: ['love_wachstum', 'gemeinsam an etwas zu wachsen', 'love_momente', 'ungeteilte gemeinsame Zeit'] },
  { id: 'fc09', text: 'Was würde dir mehr fehlen?', primary: '', choice: ['love_momente', 'ungeteilte gemeinsame Zeit', 'love_zeichen', 'kleine Zeichen, dass jemand an dich gedacht hat'] },
  { id: 'fc10', text: 'Was würde dir mehr fehlen?', primary: '', choice: ['love_naehe', 'körperliche Nähe', 'love_anpacken', 'dass dir jemand konkret etwas abnimmt'] },
  { id: 'fc11', text: 'Was würde dir mehr fehlen?', primary: '', choice: ['love_anpacken', 'dass dir jemand konkret etwas abnimmt', 'love_wachstum', 'gemeinsam an etwas zu wachsen'] },
  { id: 'fc12', text: 'Was würde dir mehr fehlen?', primary: '', choice: ['love_zeichen', 'kleine Zeichen, dass jemand an dich gedacht hat', 'love_anpacken', 'dass dir jemand konkret etwas abnimmt'] },
  { id: 'fc13', text: 'Was würde dir mehr fehlen?', primary: '', choice: ['love_naehe', 'körperliche Nähe', 'love_wachstum', 'gemeinsam an etwas zu wachsen'] },
  { id: 'fc14', text: 'Was würde dir mehr fehlen?', primary: '', choice: ['love_zeichen', 'kleine Zeichen, dass jemand an dich gedacht hat', 'love_naehe', 'körperliche Nähe'] },
  { id: 'fc15', text: 'Was würde dir mehr fehlen?', primary: '', choice: ['love_wachstum', 'gemeinsam an etwas zu wachsen', 'love_zeichen', 'kleine Zeichen, dass jemand an dich gedacht hat'] },
];

// ---------------------------------------------------------------------------
// Block 6 — Feinfühligkeit: Hochsensibilität, Zurückweisung, Gefühlswahrnehmung
// ---------------------------------------------------------------------------
const BLOCK_6: Spec[] = [
  { id: 'hs1', text: 'Lärm, Gedränge und Hektik überfordern mich schneller als andere.', primary: 'hsp', also: [['au_sensorik', 0.4, 1]] },
  { id: 'hs2', text: 'Ich nehme feine Stimmungswechsel im Raum sofort wahr.', primary: 'hsp', also: [['emp_aff', 0.4, 1]] },
  { id: 'hs3', text: 'Nach einem vollen Tag brauche ich zwingend Stille.', primary: 'hsp' },
  { id: 'hs4', text: 'Ich erschrecke leicht.', primary: 'hsp', also: [['n_angst', 0.3, 1]] },
  { id: 'rs1', text: 'Kritik trifft mich härter, als ich nach außen zeige.', primary: 'rejection_sens', also: [['n_angst', 0.3, 1]] },
  { id: 'rs2', text: 'Ich rechne oft damit, dass andere mich ablehnen könnten.', primary: 'rejection_sens', also: [['att_anx', 0.4, 1]] },
  { id: 'rs3', text: 'Ein knapper Tonfall beschäftigt mich stundenlang.', primary: 'rejection_sens' },
  { id: 'rs4', text: 'Ich passe mein Verhalten an, um bloß nicht anzuecken.', primary: 'rejection_sens', also: [['masking', 0.5, 1]] },
  { id: 'al1', text: 'Es fällt mir schwer, meine Gefühle in Worte zu fassen.', primary: 'alexithymia' },
  { id: 'al2', text: 'Ich merke oft erst spät, dass mich etwas belastet hat.', primary: 'alexithymia' },
  { id: 'al3', text: 'Wenn mich jemand fragt, wie es mir geht, weiß ich es selbst nicht genau.', primary: 'alexithymia' },
  { id: 'al4', text: 'Körperliche Anspannung bemerke ich eher als das Gefühl dahinter.', primary: 'alexithymia' },
  { id: 'hs5', text: 'Ich bin ziemlich unempfindlich gegenüber Reizen.', primary: '-hsp' },
  { id: 'rs5', text: 'Kritik perlt an mir ab.', primary: '-rejection_sens' },
  { id: 'al5', text: 'Ich kann genau benennen, was ich gerade fühle.', primary: '-alexithymia' },
];

// ---------------------------------------------------------------------------
// Validity items — attention checks and a short social-desirability scale.
// ---------------------------------------------------------------------------
const CHECKS: Record<string, Spec> = {
  ac1: { id: 'ac1', text: 'Bitte wähle hier „trifft eher nicht zu“ aus.', primary: '', attentionCheck: 2 },
  ac2: { id: 'ac2', text: 'Um zu zeigen, dass du aufmerksam liest, wähle „trifft voll zu“.', primary: '', attentionCheck: 5 },
  ac3: { id: 'ac3', text: 'Diese Frage misst nichts — bitte wähle „teils/teils“.', primary: '', attentionCheck: 3 },
  sd1: { id: 'sd1', text: 'Ich habe noch nie in meinem Leben gelogen.', primary: 'sd', socialDesirability: true },
  sd2: { id: 'sd2', text: 'Ich bin immer und ausnahmslos höflich, auch wenn man mich ärgert.', primary: 'sd', socialDesirability: true },
  sd3: { id: 'sd3', text: 'Ich habe nie im Leben etwas genommen, das mir nicht gehört.', primary: 'sd', socialDesirability: true },
};

// ---------------------------------------------------------------------------
// Block 7 — optional wellbeing module.
// PHQ-9 and GAD-7, German version (Löwe, Spitzer, Zipfel & Herzog; translation
// Medizinische Universitätsklinik Heidelberg). The rights holder released these
// for reproduction without permission or charge — the only verbatim instruments
// in this repository. 4-point format (0–3), scored separately from the Likert core.
// ---------------------------------------------------------------------------
const WELLBEING: { id: string; text: string }[] = [
  { id: 'phq1', text: 'Wenig Interesse oder Freude an deinen Tätigkeiten.' },
  { id: 'phq2', text: 'Niedergeschlagenheit, Schwermut oder Hoffnungslosigkeit.' },
  { id: 'phq3', text: 'Schwierigkeiten, ein- oder durchzuschlafen, oder vermehrter Schlaf.' },
  { id: 'phq4', text: 'Müdigkeit oder das Gefühl, keine Energie zu haben.' },
  { id: 'phq5', text: 'Verminderter Appetit oder übermäßiges Bedürfnis zu essen.' },
  { id: 'phq6', text: 'Schlechte Meinung von dir selbst; das Gefühl, versagt oder Angehörige enttäuscht zu haben.' },
  { id: 'phq7', text: 'Schwierigkeiten, dich auf etwas zu konzentrieren, etwa beim Lesen.' },
  { id: 'phq8', text: 'Verlangsamte Bewegungen oder Sprache — oder das Gegenteil: Zappeligkeit und Ruhelosigkeit.' },
  { id: 'phq9', text: 'Gedanken, dass du lieber tot wärst oder dir Leid zufügen möchtest.' },
  { id: 'gad1', text: 'Nervosität, Ängstlichkeit oder Anspannung.' },
  { id: 'gad2', text: 'Unfähigkeit, Sorgen zu stoppen oder zu kontrollieren.' },
  { id: 'gad3', text: 'Übermäßige Sorgen bezüglich verschiedener Angelegenheiten.' },
  { id: 'gad4', text: 'Schwierigkeiten zu entspannen.' },
  { id: 'gad5', text: 'Rastlosigkeit, sodass Stillsitzen schwerfällt.' },
  { id: 'gad6', text: 'Schnelle Verärgerung oder Gereiztheit.' },
  { id: 'gad7', text: 'Gefühl der Angst, als würde etwas Schlimmes passieren.' },
];

// ---------------------------------------------------------------------------
// Assembly: interleave so no more than three items of one scale run back to back,
// drop the attention checks at roughly a third and two thirds, spread the
// social-desirability items through the middle blocks.
// ---------------------------------------------------------------------------

/** Round-robin over scale groups so adjacent items rarely share a scale. */
function interleave(specs: Spec[]): Spec[] {
  const groups = new Map<string, Spec[]>();
  for (const s of specs) {
    const key = s.primary.replace(/^-/, '');
    const bucket = groups.get(key) ?? [];
    bucket.push(s);
    groups.set(key, bucket);
  }
  const queues = [...groups.values()];
  const out: Spec[] = [];
  let guard = 0;
  while (out.length < specs.length && guard++ < 10_000) {
    for (const q of queues) {
      const next = q.shift();
      if (next) out.push(next);
    }
  }
  return out;
}

const BLOCKS: { block: number; specs: Spec[]; insert?: Record<number, string> }[] = [
  { block: 1, specs: interleave(BLOCK_1) },
  { block: 2, specs: interleave(BLOCK_2), insert: { 9: 'sd1' } },
  { block: 3, specs: interleave(BLOCK_3), insert: { 12: 'ac1' } },
  { block: 4, specs: interleave(BLOCK_4), insert: { 8: 'sd2', 20: 'ac2' } },
  { block: 5, specs: interleave(BLOCK_5), insert: { 7: 'sd3' } },
  { block: 5, specs: BLOCK_5B },
  { block: 6, specs: interleave(BLOCK_6), insert: { 6: 'ac3' } },
];

function build(): { items: ItemDef[]; loadings: Loading[] } {
  const items: ItemDef[] = [];
  const loadings: Loading[] = [];
  let position = 1;

  const emit = (spec: Spec, block: number) => {
    const primaryId = spec.primary.replace(/^-/, '');
    const primaryDir: 1 | -1 = spec.primary.startsWith('-') ? -1 : 1;

    items.push({
      id: spec.id,
      position: position++,
      textDe: spec.text,
      block,
      isAttentionCheck: spec.attentionCheck !== undefined,
      isSocialDesirability: !!spec.socialDesirability,
      module: 'core',
      responseFormat: spec.choice ? 'choice2' : 'likert5',
      reverse: false, // reversal is expressed as loading direction -1
      expectedValue: spec.attentionCheck,
      choice: spec.choice,
    });

    if (!primaryId) return; // attention checks measure nothing
    loadings.push({ itemId: spec.id, scaleId: primaryId, weight: 1, direction: primaryDir });

    // A facet item also feeds its parent domain at full weight.
    const parent = SCALE_BY_ID.get(primaryId)?.parent;
    if (parent) {
      loadings.push({ itemId: spec.id, scaleId: parent, weight: 1, direction: primaryDir });
    }

    for (const [scaleId, weight, direction] of spec.also ?? []) {
      loadings.push({ itemId: spec.id, scaleId, weight, direction });
      const alsoParent = SCALE_BY_ID.get(scaleId)?.parent;
      if (alsoParent) {
        loadings.push({ itemId: spec.id, scaleId: alsoParent, weight, direction });
      }
    }
  };

  for (const { block, specs, insert } of BLOCKS) {
    // An index past the end of the block would drop the item without a trace.
    for (const idx of Object.keys(insert ?? {})) {
      if (Number(idx) >= specs.length) {
        throw new Error(
          `insert index ${idx} exceeds block ${block} (${specs.length} items) — item would be lost`,
        );
      }
    }
    const withChecks: Spec[] = [];
    specs.forEach((s, i) => {
      const injected = insert?.[i];
      if (injected) withChecks.push(CHECKS[injected]);
      withChecks.push(s);
    });
    for (const spec of withChecks) emit(spec, block);
  }

  for (const w of WELLBEING) {
    items.push({
      id: w.id,
      position: position++,
      textDe: w.text,
      block: 7,
      isAttentionCheck: false,
      isSocialDesirability: false,
      module: 'wellbeing',
      responseFormat: 'phq4',
      reverse: false,
    });
  }

  return { items, loadings };
}

const built = build();

export const ITEMS: ItemDef[] = built.items;
export const LOADINGS: Loading[] = built.loadings;

export const CORE_ITEMS = ITEMS.filter((i) => i.module === 'core');
export const WELLBEING_ITEMS = ITEMS.filter((i) => i.module === 'wellbeing');
export const PHQ9_ITEM_IDS = WELLBEING_ITEMS.filter((i) => i.id.startsWith('phq')).map((i) => i.id);
export const GAD7_ITEM_IDS = WELLBEING_ITEMS.filter((i) => i.id.startsWith('gad')).map((i) => i.id);

/** Canonical order used by the URL payload codec — must stay stable per version. */
export const PAYLOAD_ORDER_CORE = CORE_ITEMS.map((i) => i.id);
export const PAYLOAD_ORDER_WELLBEING = WELLBEING_ITEMS.map((i) => i.id);

export const LIKERT_OPTIONS = [
  { value: 1, label: 'trifft gar nicht zu' },
  { value: 2, label: 'trifft eher nicht zu' },
  { value: 3, label: 'teils/teils' },
  { value: 4, label: 'trifft eher zu' },
  { value: 5, label: 'trifft voll zu' },
];

export const PHQ4_OPTIONS = [
  { value: 0, label: 'Überhaupt nicht' },
  { value: 1, label: 'An einzelnen Tagen' },
  { value: 2, label: 'An mehr als der Hälfte der Tage' },
  { value: 3, label: 'Beinahe jeden Tag' },
];
