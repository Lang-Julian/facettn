# Expertenreview — Auftrag und Prüfraster

Was eine Fachperson prüfen soll, damit das Review etwas wert ist. Ohne konkrete
Fragen kommt aus einem Gutachten meist „insgesamt plausibel" zurück, und das hilft
niemandem.

**Aufwand:** etwa 3–4 Stunden. **Geeignet:** Psychologin oder Psychologe mit
diagnostischem Schwerpunkt; für die neurodivergenz-nahen Skalen zusätzlich jemand
mit einschlägiger Praxiserfahrung.

---

## Was mitzugeben ist

1. [`docs/TESTMANUAL.md`](TESTMANUAL.md) — Konstruktion, Auswertung, Grenzen
2. [`src/lib/seed/items.ts`](../src/lib/seed/items.ts) — alle Items samt Ladungen an
   einer Stelle, lesbar auch ohne Programmierkenntnisse
3. [`src/lib/content/patterns.ts`](../src/lib/content/patterns.ts) — die
   Interpretationsregeln
4. Ein durchgespieltes Beispielergebnis

Ausdrücklich **nicht** mitzugeben: die Bitte um eine Gesamtbewertung. Die Fragen
unten sind der Auftrag.

---

## 1. Inhaltsvalidität je Skala

Für jede der 52 Skalen:

- Bilden die Items das Konstrukt **vollständig** ab, oder fehlt ein zentraler Aspekt?
- Enthält eine Skala Items, die **etwas anderes** messen?
- Sind die Items **homogen genug** für eine gemeinsame Skala?
- Reicht die Breite, oder sind zwei Items nur Umformulierungen desselben Gedankens?

Besonders zu prüfen, weil neu konstruiert und ohne Vorbild:

- **Anspruchsabhängigkeit der Aufmerksamkeit** — trennt sie tatsächlich Schwierigkeit
  von Interesse? Ist die Moderator-Logik haltbar?
- **Masking** — deckt sie Compensation und Assimilation ab oder nur Masking im engen
  Sinn?
- **Perfektionismus** — ist die Trennung zwischen eigenem und erwartetem Anspruch in
  den Items wirklich sauber?

## 2. Itemformulierung

- Doppelte Verneinungen, Suggestivformulierungen, doppelte Sachverhalte in einem Satz
- Items, die zwei Situationen vermischen („kommt drauf an")
- Verständlichkeit ohne Fachwissen
- **Sensible Items:** Sind Dark-Traits- und Wohlbefindens-Items so formuliert, dass
  ehrliche Antworten wahrscheinlich bleiben?

## 3. Auswertungslogik

- Sind die **Mehrfachladungen** theoretisch begründbar? Welche würden Sie streichen,
  welche ergänzen? (Die Gewichte sind gesetzt, nicht gemessen — genau hier ist
  Fachurteil das einzige verfügbare Korrektiv.)
- Ist das **Facetten-zu-Domänen-Rollup** angemessen?
- Sind die **Ausprägungsbänder** (0–30 / 31–60 / 61–80 / 81–100) sinnvoll geschnitten?
- Ist die **Anzeigegenauigkeit nach Itemzahl** konservativ genug?

## 4. Interpretationsregeln

Für jede der 14 Musterregeln:

- Ist die **Auslösebedingung** angemessen streng?
- Ist die **empirische Behauptung** im Text durch die zitierte Quelle gedeckt?
- Pathologisiert der Text, oder beschreibt er?
- Fehlt eine **Alternativerklärung**, die genauso gut passt?

Die Regel `challenge_dependent_attention` bitte besonders kritisch lesen: Sie
berührt das Thema Hochbegabung und ist so gebaut, dass sie einen Mechanismus
beschreibt und kein Etikett vergibt. Trägt diese Konstruktion?

## 5. Ethik und Sicherheit

- Ist die **Krisen-Sicherung** (PHQ-9 Item 9 > 0 oder Summe ≥ 15) angemessen
  ausgelöst und formuliert?
- Kann ein Ergebnis jemanden **beschädigen**? Welche Kombination wäre am
  riskantesten?
- Sind die Dark-Traits-Texte verantwortbar formuliert?
- Ist die Abgrenzung zur Diagnostik an jeder relevanten Stelle deutlich genug?

## 6. Rückmeldeformat

Erbeten wird eine Liste, nicht ein Fließtext-Gutachten:

| Ort | Problem | Schwere | Vorschlag |
|---|---|---|---|
| Item `au3` | vermischt Anstrengung und Abneigung | mittel | aufteilen |

Schweregrade: **kritisch** (muss vor Veröffentlichung geändert werden) ·
**mittel** (sollte geändert werden) · **gering** (Anmerkung).

Zusätzlich zwei Fragen zum Schluss:

1. Welche drei Skalen halten Sie für die schwächsten — und warum?
2. Gibt es etwas an diesem Instrument, das Sie für **schädlich** halten?

Die zweite Frage ist die wichtigere. Eine ehrliche Antwort darauf ist mehr wert als
das gesamte übrige Review.
