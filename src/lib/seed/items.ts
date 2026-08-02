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
  { id: 'lk1', text: 'Ehrliche, liebevolle Worte bedeuten mir am meisten.', primary: 'love_klartext' },
  { id: 'lk2', text: 'Ein aufrichtiges Kompliment trägt mich durch den Tag.', primary: 'love_klartext' },
  { id: 'lm1', text: 'Ungeteilte gemeinsame Zeit ist für mich der Kern von Nähe.', primary: 'love_momente' },
  { id: 'lm2', text: 'Lieber ein langer Abend zu zweit als ein großes Geschenk.', primary: 'love_momente', also: [['love_zeichen', 0.3, -1]] },
  { id: 'la1', text: 'Ich zeige Zuneigung, indem ich anderen praktisch den Rücken freihalte.', primary: 'love_anpacken', also: [['a_mitgefuehl', 0.25, 1]] },
  { id: 'la2', text: 'Wenn mir jemand ungefragt Arbeit abnimmt, fühle ich mich geliebt.', primary: 'love_anpacken' },
  { id: 'ln1', text: 'Körperliche Nähe ist für mich eine wichtige Sprache.', primary: 'love_naehe' },
  { id: 'ln2', text: 'Eine Umarmung sagt mir mehr als viele Sätze.', primary: 'love_naehe' },
  { id: 'lw1', text: 'Ich blühe auf, wenn wir uns gemeinsam weiterentwickeln.', primary: 'love_wachstum', also: [['o_neugier', 0.25, 1]] },
  { id: 'lw2', text: 'Beziehungen, in denen niemand mehr dazulernt, langweilen mich.', primary: 'love_wachstum' },
  { id: 'lz1', text: 'Durchdachte kleine Geschenke berühren mich.', primary: 'love_zeichen' },
  { id: 'lz2', text: 'Dass jemand sich ein Detail von mir gemerkt hat, bedeutet mir viel.', primary: 'love_zeichen' },
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
  { block: 5, specs: interleave(BLOCK_5), insert: { 14: 'sd3' } },
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
      responseFormat: 'likert5',
      reverse: false, // reversal is expressed as loading direction -1
      expectedValue: spec.attentionCheck,
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
