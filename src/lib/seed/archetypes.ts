// 14 archetypes (Blueprint Deliverable 4). Communication layer over continuous scores —
// never presented as diagnosis. No "famous representatives" (no remote diagnosis of real people).

import type { ArchetypeDef } from '@/lib/engine/types';

export const ARCHETYPES: ArchetypeDef[] = [
  {
    id: 'pattern_weaver',
    nameDe: 'Die Mustererkennerin',
    nameEn: 'The Pattern Weaver',
    priority: 1,
    dims: [{ scaleId: 'adhs' }, { scaleId: 'autism' }, { scaleId: 'big5_O' }],
    descriptionDe:
      'Du verbindest Detailtiefe mit sprunghafter Kreativität. Wo andere entweder das große Bild oder die Feinheiten sehen, webst du beides zusammen — oft auf Wegen, die niemand sonst gegangen wäre.',
    strengths: ['Tiefe Fokussierung', 'Originelle Verknüpfungen', 'Ehrlichkeit'],
    growthAreas: ['Reizüberflutung dosieren', 'Pausen bewusst einplanen'],
  },
  {
    id: 'deep_diver',
    nameDe: 'Die Tiefentaucherin',
    nameEn: 'The Deep Diver',
    priority: 2,
    dims: [{ scaleId: 'autism' }, { scaleId: 'big5_O' }],
    descriptionDe:
      'Du tauchst tief in Themen ein und siehst Muster, die andere übersehen. Oberflächlichkeit langweilt dich — echte Tiefe ist dein Element.',
    strengths: ['Detailtiefe', 'Ausdauer bei Herzensthemen', 'Verlässliche Ehrlichkeit'],
    growthAreas: ['Übergänge und Planänderungen abfedern', 'Erholungsfenster nach Sozialkontakt'],
  },
  {
    id: 'idea_sprinter',
    nameDe: 'Der Ideensprinter',
    nameEn: 'The Idea Sprinter',
    priority: 3,
    dims: [{ scaleId: 'adhs' }, { scaleId: 'big5_O' }, { scaleId: 'big5_E' }],
    descriptionDe:
      'Energiegeladen, kreativ, viele Projekte gleichzeitig. Dein Kopf sprüht — die Kunst ist, die besten Funken auch ins Ziel zu tragen.',
    strengths: ['Ideenreichtum', 'Ansteckende Energie', 'Mut zum Anfangen'],
    growthAreas: ['Projekte zu Ende bringen', 'Externe Struktur als Verbündete nutzen'],
  },
  {
    id: 'deep_feeler',
    nameDe: 'Der Feinfühlige',
    nameEn: 'The Deep Feeler',
    priority: 4,
    dims: [{ scaleId: 'hsp' }, { scaleId: 'emp_aff' }, { scaleId: 'big5_N' }],
    descriptionDe:
      'Du nimmst Stimmungen intensiv wahr und fühlst tief mit. Was andere überhören, trifft bei dir mitten ins Resonanzfeld.',
    strengths: ['Feine Wahrnehmung', 'Echtes Mitgefühl', 'Tiefe Verbindungen'],
    growthAreas: ['Eigene Grenzen schützen', 'Reizpausen fest einplanen'],
  },
  {
    id: 'bold_strategist',
    nameDe: 'Die Strategin',
    nameEn: 'The Bold Strategist',
    priority: 5,
    dims: [{ scaleId: 'dark_bold' }, { scaleId: 'big5_C' }, { scaleId: 'big5_N', invert: true }],
    descriptionDe:
      'Ruhig, risikofreudig, zielorientiert. Druck macht dich nicht kleiner, sondern klarer — du entscheidest, wenn andere zögern.',
    strengths: ['Stressresistenz', 'Klare Entscheidungen', 'Zielstrebigkeit'],
    growthAreas: ['Die Perspektive Betroffener bewusst einholen', 'Geduld mit langsameren Tempi'],
  },
  {
    id: 'maverick',
    nameDe: 'Der Grenzgänger',
    nameEn: 'The Maverick',
    priority: 6,
    dims: [{ scaleId: 'dark_disinh' }, { scaleId: 'dark_bold' }, { scaleId: 'big5_O' }],
    descriptionDe:
      'Spontan, unkonventionell, auf der Suche nach dem nächsten Kick. Regeln sind für dich Startpunkte, keine Endpunkte.',
    strengths: ['Mut', 'Improvisationstalent', 'Unabhängiges Denken'],
    growthAreas: ['10-Sekunden-Regel vor Impulsen', 'Konsequenzen für andere mitdenken'],
  },
  {
    id: 'connector',
    nameDe: 'Die Verbindende',
    nameEn: 'The Connector',
    priority: 7,
    dims: [{ scaleId: 'big5_E' }, { scaleId: 'big5_A' }, { scaleId: 'love_momente' }],
    descriptionDe:
      'Sozial, warmherzig, netzwerkstark. Du bringst Menschen zusammen und merkst schnell, wenn jemand am Rand steht.',
    strengths: ['Warmherzigkeit', 'Netzwerk-Talent', 'Aufmerksamkeit für andere'],
    growthAreas: ['Auch mal Nein sagen', 'Eigene Bedürfnisse nicht hintanstellen'],
  },
  {
    id: 'anchor',
    nameDe: 'Der Fels',
    nameEn: 'The Anchor',
    priority: 8,
    dims: [{ scaleId: 'att_secure' }, { scaleId: 'big5_A' }, { scaleId: 'big5_C' }],
    descriptionDe:
      'Verlässlich, stabil, ein sicherer Hafen. Menschen in deinem Umfeld wissen: Auf dich ist Verlass — in guten wie in stürmischen Zeiten.',
    strengths: ['Verlässlichkeit', 'Emotionale Stabilität', 'Loyalität'],
    growthAreas: ['Eigene Wünsche aktiv äußern', 'Veränderung als Chance sehen'],
  },
  {
    id: 'seeker',
    nameDe: 'Die Suchende',
    nameEn: 'The Seeker',
    priority: 9,
    dims: [{ scaleId: 'att_anx' }, { scaleId: 'rejection_sens' }, { scaleId: 'emp_aff' }],
    descriptionDe:
      'Du sehnst dich nach echter Nähe und spürst feinste Signale von Distanz. Deine Empfindsamkeit ist Radar und Achillesferse zugleich.',
    strengths: ['Tiefe Bindungsfähigkeit', 'Feines Gespür für Beziehungen', 'Hingabe'],
    growthAreas: ['Zurückweisung nicht vorschnell hineinlesen', 'Selbstwert unabhängig von Bestätigung nähren'],
  },
  {
    id: 'lone_wolf',
    nameDe: 'Der Unabhängige',
    nameEn: 'The Lone Wolf',
    priority: 10,
    dims: [{ scaleId: 'att_avoid' }, { scaleId: 'dark_bold' }, { scaleId: 'big5_E', invert: true }],
    descriptionDe:
      'Autark, selbstgenügsam, gern mit gesundem Abstand. Du brauchst niemanden, um ganz zu sein — Nähe lässt du bewusst und dosiert zu.',
    strengths: ['Selbstständigkeit', 'Innere Ruhe', 'Klare Grenzen'],
    growthAreas: ['Verletzlichkeit als Stärke ausprobieren', 'Hilfe annehmen üben'],
  },
  {
    id: 'chameleon',
    nameDe: 'Die Maskenträgerin',
    nameEn: 'The Chameleon',
    priority: 11,
    dims: [{ scaleId: 'masking' }, { scaleId: 'autism' }, { scaleId: 'big5_N' }],
    descriptionDe:
      'Du passt dich meisterhaft an — liest Räume, spiegelst Erwartungen, funktionierst. Der Preis ist Erschöpfung: Die Maske zu tragen kostet Kraft, die andere nicht sehen.',
    strengths: ['Soziale Beobachtungsgabe', 'Anpassungskunst', 'Empathisches Feingefühl'],
    growthAreas: ['Sichere Räume finden, in denen die Maske fallen darf', 'Erholung nach Sozialkontakt ernst nehmen'],
  },
  {
    id: 'analyst',
    nameDe: 'Der Kopfmensch',
    nameEn: 'The Analyst',
    priority: 12,
    dims: [{ scaleId: 'emp_cog' }, { scaleId: 'emp_aff', invert: true }, { scaleId: 'big5_C' }],
    descriptionDe:
      'Du verstehst Menschen analytisch und bleibst sachlich, wo andere in Gefühlen versinken. Dein kühler Kopf ist in Krisen Gold wert.',
    strengths: ['Klarer Blick', 'Rationalität unter Druck', 'Strukturiertes Denken'],
    growthAreas: ['Gefühle anderer explizit anerkennen', 'Eigene Emotionen nicht wegrationalisieren'],
  },
  {
    id: 'doer',
    nameDe: 'Die Macherin',
    nameEn: 'The Doer',
    priority: 13,
    dims: [{ scaleId: 'big5_C' }, { scaleId: 'love_anpacken' }, { scaleId: 'big5_N', invert: true }],
    descriptionDe:
      'Praktisch, zupackend, verlässlich. Du zeigst Zuneigung durch Taten — wer dich hat, hat jemanden, der wirklich anpackt.',
    strengths: ['Umsetzungskraft', 'Verlässlichkeit', 'Pragmatismus'],
    growthAreas: ['Auch Worte für Gefühle finden', 'Nicht alles allein stemmen'],
  },
  {
    id: 'all_rounder',
    nameDe: 'Der Ausbalancierte',
    nameEn: 'The All-Rounder',
    priority: 14,
    dims: [],
    descriptionDe:
      'Vielseitig, flexibel, ohne extreme Ausschläge. Du kannst dich auf viele Situationen und Menschen einstellen — deine Balance ist keine Langeweile, sondern Anpassungsintelligenz.',
    strengths: ['Flexibilität', 'Ausgeglichenheit', 'Breites Verhaltensrepertoire'],
    growthAreas: ['Eigene Kanten bewusst zeigen', 'Position beziehen, auch wenn es unbequem ist'],
  },
];

export const ARCHETYPE_BY_ID = new Map(ARCHETYPES.map((a) => [a.id, a]));
