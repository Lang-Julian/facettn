# Kognitiver Pretest — Protokoll

Der billigste Qualitätsgewinn, den dieses Instrument noch haben kann. Fünf bis zehn
Personen, je 45 Minuten, keine Statistik, keine Datenbank — und trotzdem findet er
zuverlässig Items, die etwas anderes messen als gedacht.

Das Verfahren ist Standard in der Fragebogenentwicklung (Think-Aloud nach Willis).
Es prüft nicht, *ob* eine Skala misst, sondern ob die Fragen so verstanden werden,
wie sie gemeint sind. Das ist die Voraussetzung für alles Weitere.

---

## Warum das nichts mit Datenerhebung zu tun hat

Es werden keine Antworten gespeichert und keine Profile berechnet. Erhoben werden
**Aussagen über Fragen**, nicht Aussagen über Personen — Notizen der Testleitung auf
Papier, die anschließend in Item-Änderungen münden. Das berührt das
Datenschutzversprechen des Produkts nicht.

## Auswahl der Teilnehmenden

Fünf bis zehn Personen reichen; darüber hinaus findet man kaum noch Neues. Wichtig
ist Streuung statt Menge:

- mindestens zwei Personen ohne akademischen Hintergrund
- mindestens zwei Personen über 55
- mindestens eine Person, die sich selbst als neurodivergent beschreibt
- gemischt nach Geschlecht

Der letzte Punkt ist kein Formalismus: Ein Teil der Items betrifft Masking und
soziale Anstrengung, und genau dort sind Verständnisunterschiede zu erwarten.

## Ablauf je Sitzung

**1. Rahmen setzen (5 Min).**
> „Ich teste nicht dich, sondern die Fragen. Wenn eine Frage unklar ist, ist das ein
> Fehler im Fragebogen, nicht bei dir. Sag alles, was dir durch den Kopf geht —
> auch Zweifel, Rückfragen und Genervtsein."

**2. Lautes Denken (30 Min).**
Die Person bearbeitet den Test und spricht dabei. Nicht den ganzen Test — zwei bis
drei Blöcke reichen, im Wechsel über die Teilnehmenden, sodass am Ende jeder Block
mehrfach abgedeckt ist.

Nicht helfen. Nicht erklären. Bei Stille nur: *„Was denkst du gerade?"*

**3. Nachfragen bei auffälligen Items (10 Min).**
- „Was hast du bei dieser Frage vor dir gesehen?"
- „Mit welchen eigenen Situationen hast du das beantwortet?"
- „Was wäre ein Beispiel für ‚trifft eher zu' hier?"
- „Wie sicher warst du bei deiner Antwort?"

## Worauf zu achten ist

| Beobachtung | Bedeutung |
|---|---|
| Pause über 5 Sekunden | Item ist unklar oder verlangt zu viel Abwägung |
| Rückfrage an die Testleitung | Formulierung ist mehrdeutig |
| „Kommt drauf an" | Item vermischt zwei Situationen — häufigste Ursache schlechter Trennschärfe |
| Beispiel passt nicht zum Konstrukt | Item misst etwas anderes als gedacht |
| Erkennbares Zögern bei sensiblen Items | Ehrlichkeit gefährdet — Formulierung entschärfen |
| „Das hatten wir doch schon" | Zwei Items sind redundant |
| Sichtbare Ermüdung ab Minute X | Position für einen Motivator oder Blockwechsel |

Besonders im Blick behalten:

- **Zwangswahl (Block 5).** Ist die Entscheidung nachvollziehbar oder frustrierend?
  Wird verstanden, dass beides zutreffen darf?
- **Anspruchsabhängigkeit.** Wird „anspruchsvoller" als *schwieriger* gelesen — oder
  fälschlich als *interessanter*? Genau diese Verwechslung würde die Skala
  entwerten.
- **Umgekehrt gepolte Items.** Werden sie als Umkehrung erkannt oder überlesen?
- **Perfektionismus.** Wird zwischen eigenem und erwartetem Anspruch unterschieden,
  oder verschwimmt beides?

## Auswertung

Pro Item die Anzahl der Auffälligkeiten notieren. Regeln:

- **Zwei oder mehr Personen stolpern über dasselbe Item** → umformulieren.
- **„Kommt drauf an" bei mehreren Personen** → Item in zwei aufteilen oder die
  Situation im Itemtext festlegen.
- **Beispiele passen systematisch nicht zum Konstrukt** → Item ersetzen, nicht
  reparieren.

Jede Änderung mit Begründung committen. Bei Änderungen an Itembestand oder
Reihenfolge muss `PAYLOAD_VERSION` erhöht werden (siehe CONTRIBUTING).

## Danach

Der Pretest ersetzt keine Validierung. Er stellt sicher, dass eine spätere
Validierung nicht an Items scheitert, die schlicht missverstanden wurden — der
häufigste Grund, warum Pilotstudien enttäuschende Kennwerte liefern.
