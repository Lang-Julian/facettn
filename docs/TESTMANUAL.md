# Facettn — Testmanual

Version 3 (Payload-Format `v3`) · Stand: August 2026

Dieses Dokument beschreibt Konstruktion, Auswertung und Grenzen des Instruments. Es
ist bewusst so geschrieben, dass eine Fachperson es prüfen kann, ohne den Quellcode
zu lesen — und so, dass die Schwächen genauso auffindbar sind wie die Stärken.

---

## 1. Zweckbestimmung

Facettn ist ein **Selbsterkundungsinstrument für Erwachsene** zur Beschreibung von
Persönlichkeitsausprägungen. Es ist ausdrücklich **kein** Diagnose- oder
Screeningverfahren und ist nicht dafür gebaut, klinische Entscheidungen zu stützen.

Diese Festlegung ist nicht kosmetisch. Nach MDR Regel 11 wird die Zweckbestimmung
eines Produkts auch aus seinen Werbe- und Begleitmaterialien abgeleitet. Eine
Formulierung wie „erkennt ADHS", „Screening auf Autismus" oder „klinisch validiert"
würde das Instrument in den Medizinprodukte-Rahmen ziehen. Der gesamte Textbestand
ist entsprechend gehalten: Es ist durchgehend von **Zügen, Tendenzen und
Ausprägungen** die Rede, nie von Verdacht, Befund oder Diagnose.

**Zielgruppe:** deutschsprachige Erwachsene ohne Vorkenntnisse.
**Nicht geeignet für:** Personalauswahl, Eignungsdiagnostik, Begutachtung,
Therapieplanung, Kinder und Jugendliche.

---

## 2. Aufbau

| | |
|---|---|
| Items Hauptteil | 176 Likert (5-stufig) + 15 Zwangswahlpaare |
| Validitätsitems | 3 Aufmerksamkeitskontrollen, 3 Items zur sozialen Erwünschtheit |
| Optionales Modul | 16 Items (PHQ-9, GAD-7), 4-stufig |
| Bearbeitungsdauer | ca. 19 Minuten (Hauptteil), +2 Minuten optional |
| Ausgewertete Skalen | 52, davon 23 Facetten unterhalb von Domänen |

### 2.1 Blockstruktur

Die Reihenfolge ist inhaltlich gruppiert und innerhalb der Blöcke durchmischt, sodass
nie mehr als drei Items derselben Skala aufeinanderfolgen (per Test abgesichert).

| Block | Inhalt |
|---|---|
| 01 | Grundton — Extraversion, Verträglichkeit |
| 02 | Antrieb & Struktur — Gewissenhaftigkeit, emotionale Sensibilität, Offenheit, Perfektionismus |
| 03 | Fokus & Wahrnehmung — ADHS-Züge, autistische Züge, Anspruchsabhängigkeit |
| 04 | Innenleben & Durchsetzung — Masking, Empathie, Dark Traits |
| 05 | Nähe & Liebe — Bindung, Love Styles (Zwangswahl) |
| 06 | Feinfühligkeit — Hochsensibilität, Zurückweisung, Gefühlswahrnehmung |
| 07 | Wohlbefinden (optional, separat auswählbar) |

### 2.2 Skalenübersicht

**Big Five** (je Domäne 3 Facetten, je Facette 4 Items)
Extraversion (Geselligkeit, Durchsetzung, Tatendrang) · Verträglichkeit (Mitgefühl,
Rücksicht, Vertrauen) · Gewissenhaftigkeit (Ordnung, Beharrlichkeit,
Verlässlichkeit) · Emotionale Sensibilität (Sorgenneigung, Niedergeschlagenheit,
emotionale Schwankung) · Offenheit (intellektuelle Neugier, ästhetisches Empfinden,
Vorstellungskraft)

**Neurodivergenz-nahe Konstrukte**
ADHS-Züge (Unaufmerksamkeit, innere Unruhe/Impulsivität) · Autistische Züge (Mühe mit
Zwischentönen, Detailfokus, Routinebedarf, sensorische Empfindlichkeit,
Tiefeninteressen, wörtliches Verstehen) · Masking · Anspruchsabhängigkeit der
Aufmerksamkeit

**Weitere**
Dark Traits (Furchtlosigkeit, kühle Durchsetzung, Impulsivität/Regelferne,
Grandiosität) · Empathie (kognitiv, affektiv) · Bindung (Angst, Vermeidung,
Sicherheit) · Love Styles (6, per Zwangswahl) · Perfektionismus (eigener Anspruch,
erwarteter Anspruch) · Sensibilität (Hochsensibilität, Zurückweisungs-Sensibilität,
Gefühlswahrnehmung)

---

## 3. Itemkonstruktion

### 3.1 Herkunft

**Alle Items des Hauptteils sind eigenständige deutsche Neuformulierungen.** Sie
orientieren sich an publizierten *Konstrukten*, übernehmen aber keinen Wortlaut aus
geschützten Skalen. Das ist sowohl eine lizenzrechtliche Entscheidung (das Repository
steht unter MIT) als auch eine inhaltliche: Übersetzungen fremder Instrumente hätten
deren Normen geerbt, ohne deren Validierung zu erben.

Herangezogene Konstrukte: Facettenstruktur des Fünf-Faktoren-Modells (IPIP, BFI-2),
Aufmerksamkeits- und Hyperaktivitätsdomänen des DSM-5, Camouflaging-Forschung,
triarchisches Psychopathie-Modell, ECR-Bindungsdimensionen,
Sensory-Processing-Sensitivity, mehrdimensionaler Perfektionismus.

Wörtlich übernommen sind ausschließlich **PHQ-9 und GAD-7** (deutsche Fassung; Löwe,
Spitzer, Zipfel & Herzog), die der Rechteinhaber zur freien Vervielfältigung
freigegeben hat.

### 3.2 Konstruktionsregeln

Diese Regeln sind durch automatisierte Tests abgesichert und brechen den Build, wenn
sie verletzt werden:

1. **Mindestens vier Items je berichteter Skala.** Kürzere Skalen erlauben keine
   sinnvolle Punktschätzung.
2. **Mindestens ein gegenläufig gepoltes Item je Skala** (außer bei Zwangswahl, die
   keine Polarität kennt). Ohne Gegenpol lässt sich das Merkmal nicht von einer
   allgemeinen Zustimmungstendenz trennen.
3. **Höchstens drei aufeinanderfolgende Items derselben Skala.**
4. Jedes inhaltliche Item hat mindestens eine Skalenladung.

### 3.3 Zwangswahl bei den Love Styles

Präferenzen werden nicht über Zustimmung gemessen. Bei „liebevolle Worte bedeuten mir
viel" stimmen nahezu alle zu, was zu flachen Profilen ohne Aussagekraft führt (in der
Vorgängerversion typischerweise 75/75/75/…). Stattdessen tritt jede der sechs
Sprachen im **vollständigen Rundenturnier** gegen jede andere genau einmal an; der
Skalenwert ist die Trefferquote aus fünf Duellen (0, 20, 40, 60, 80 oder 100).

Das erzwingt eine Rangfolge, hat aber eine bekannte Eigenschaft ipsativer Messung:
Die Werte sind **relativ zueinander**, nicht absolut. Jemand, dem alle sechs Sprachen
gleich viel bedeuten, bekommt dennoch eine Rangfolge. Das ist im Ergebnistext
benannt.

---

## 4. Auswertung

### 4.1 Rohwerte

Umgekehrte Polung wird über die Ladungsrichtung ausgedrückt (`direction: -1`),
rechnerisch äquivalent zu `r' = 6 − r`.

```
raw(Skala)  = Σ  effektiver Itemwert × Gewicht
min(Skala)  = Σ  1 × |Gewicht|
max(Skala)  = Σ  5 × |Gewicht|
score100    = 100 × (raw − min) / (max − min)
```

Nicht beantwortete Items werden aus Zähler *und* Nenner entfernt, sodass eine
teilweise beantwortete Skala korrekt normiert.

### 4.2 Mehrfachladungen

Items laden bewusst auf mehrere Skalen (Gewicht 1,0 primär, 0,25–0,7 sekundär). Das
bildet reale Merkmalsüberlappung ab: Impulsives Handeln kann aus ADHS-typischer
Impulskontrolle stammen oder aus einer Haltung zu Regeln; die umgebenden Items
entscheiden über die Lesart.

**Wichtige Einschränkung:** Die Gewichte sind **theoriegeleitete Startwerte**. Sie
sind nicht faktorenanalytisch bestimmt und nicht empirisch kalibriert. Eine
Kalibrierung setzt eine Stichprobe voraus (siehe Abschnitt 7).

### 4.3 Facetten und Domänen

Ein Facettenitem lädt zusätzlich mit vollem Gewicht auf seine Domäne. Der
Domänenwert entsteht damit aus allen zugehörigen Items, nicht aus dem Mittel der
Facettenwerte — das vermeidet eine Gewichtung, die eine Facette mit weniger Items
implizit überbetont.

### 4.4 Perzentile

Perzentile werden **ausschließlich** dort ausgewiesen, wo publizierte deutsche
Normwerte vorliegen:

| Skalen | Quelle |
|---|---|
| Big-Five-Domänen | Danner et al. (2019), BFI-2 DE, N = 770 |
| PHQ-9 | Kocalevent et al. (2013), gepoolt |
| GAD-7 | Löwe et al. (2008), gepoolt |

Berechnung: `z = (Itemmittel − M) / SD`, Perzentil = `Φ(z) × 100`, wobei Φ über die
Abramowitz-Stegun-Näherung 7.1.26 bestimmt wird (Fehler < 7,5 × 10⁻⁸).

**Für alle übrigen Skalen wird bewusst kein Bevölkerungsvergleich angezeigt.** Die
Items sind Eigenformulierungen; Normen fremder Instrumente gelten für sie nicht. Ein
erfundener Vergleich wäre die häufigste Form von Scheingenauigkeit in Online-Tests.

Zusätzliche Einschränkung: Die Perzentilberechnung setzt Normalverteilung voraus. Bei
schiefen Skalen wie PHQ-9 und GAD-7 ist das eine bekannte Vereinfachung.

### 4.5 Anzeigegenauigkeit

Die dargestellte Auflösung richtet sich nach der Itemzahl, nicht nach der
Rechengenauigkeit:

| Items | Anzeige |
|---|---|
| ≥ 6 | exakter Wert |
| 4–5 | auf Fünferschritte gerundet |
| ≤ 3 | nur Ausprägungsband, keine Zahl |

Jeder Balken weist die angewandte Regel aus. Hintergrund: Ein aus zwei Items
berechneter Wert kann exakt 100 ergeben — das ist ein Artefakt der Skalenlänge und
keine Messung.

### 4.6 Ausprägungsbänder

0–30 gering · 31–60 moderat · 61–80 deutlich · 81–100 stark.
Durchgehend als Ausprägung formuliert, nie als Schwellenwert oder Cutoff.

### 4.7 Validitätsindikatoren

| Indikator | Auslösung |
|---|---|
| Aufmerksamkeit | mindestens eine Kontrollfrage nicht wie angegeben beantwortet |
| Antwortgeschwindigkeit | Median unter 800 ms je Item |
| Antwortmuster | über 60 % identische Antwortstufe |
| Soziale Erwünschtheit | Skalenwert über 80 |

Die Indikatoren führen zu einem Hinweis, nie zum Verwerfen des Ergebnisses.

### 4.8 Musterregeln

Vierzehn Regeln beschreiben Konstellationen über mehrere Skalen hinweg (z. B.
AuDHD-Konstellation, Empathie-Dissoziation, Verfolger-Distanzierer-Muster). Sie sind
bewusst konservativ: Jede benötigt eine klare Konfiguration, jede endet mit einer
Handlungsimplikation, und keine pathologisiert ein Profil.

Zwei Regeln enthalten **Ausschlussbedingungen**, weil eine Alternativerklärung besser
passen kann — etwa die Regel zur Anspruchsabhängigkeit, die intakte
Alltagsverlässlichkeit voraussetzt, weil breite exekutive Schwierigkeiten gegen
Unterforderung als Erklärung sprechen.

### 4.9 Krisen-Sicherung

Bei PHQ-9 Item 9 > 0 **oder** PHQ-9-Summe ≥ 15 erscheint ein nicht schließbarer
Hinweis mit Krisenkontakten oberhalb aller Ergebnisse. Diese Bedingung ist
architektonisch abgesichert und darf nicht abgeschwächt werden.

---

## 5. Sonderfall: Anspruchsabhängigkeit der Aufmerksamkeit

Diese Skala verdient eine eigene Erläuterung, weil sie leicht missverstanden wird.

Unterforderung erzeugt Verhalten, das wie ein Aufmerksamkeitsdefizit aussieht.
Schätzungen zufolge erfüllen 25–50 % der hochbegabten Kinder mit ADHS-Diagnose die
Kriterien bei genauer Prüfung nicht.

Die naheliegende Frage — ob Aufmerksamkeit *interessensabhängig* ist — **trennt
nichts**: Hyperfokus ist ein Kennzeichen von ADHS, beide Gruppen antworten
zustimmend. Die Skala fragt deshalb nach **Anspruch statt Interesse**: Verbessert
sich die Konzentration, wenn eine Aufgabe *schwieriger* wird?

Die Skala ist ein **Moderator, kein Merkmal**. Ihr Wert ist nur dann interpretierbar,
wenn überhaupt erhöhte Unaufmerksamkeitswerte vorliegen. Die zugehörige Musterregel
verlangt zusätzlich intakte Alltagsverlässlichkeit.

**Was diese Skala ausdrücklich nicht tut:** Begabung feststellen. Selbsteingeschätzte
und gemessene Intelligenz korrelieren metaanalytisch zu etwa **r = 0,30** (278
Effektstärken, N = 36.833); die Literatur beschreibt Selbsteinschätzung als
Selbstwert- und nicht als Fähigkeitsvariable. Zudem überschätzen Männer sich
systematisch stärker als Frauen, sodass eine Begabungsskala per Selbstauskunft
Männer bevorzugt hochstufen würde. Das Instrument vergibt daher **kein Etikett**,
sondern beschreibt einen möglichen Auslöser.

---

## 6. Gütekriterien: aktueller Stand

Dieser Abschnitt ist der wichtigste des Manuals.

### 6.1 Objektivität

**Gegeben.** Durchführung, Auswertung und Interpretation sind vollständig
standardisiert und deterministisch: identische Antworten erzeugen zwangsläufig
identische Ergebnisse, es gibt keinen Auswerterspielraum. Der Auswertungsalgorithmus
ist offen einsehbar und durch 53 Unit-Tests abgedeckt.

### 6.2 Reliabilität

**Nicht bestimmt.** Es liegen keine Werte für interne Konsistenz (Cronbachs α,
McDonalds ω), Retest-Reliabilität oder Split-Half-Reliabilität vor.

Was stattdessen vorliegt, sind **konstruktionsseitige Voraussetzungen** für
akzeptable Reliabilität: mindestens vier Items je Skala, ausbalancierte Polung,
inhaltlich homogene Itemgruppen. Das ersetzt keine Messung.

### 6.3 Validität

**Nicht bestimmt.** Weder Inhalts-, Konstrukt- noch Kriteriumsvalidität sind
empirisch geprüft. Insbesondere fehlen:

- Konfirmatorische Faktorenanalyse zur Prüfung der Facettenstruktur
- Konvergente Validität gegenüber etablierten Instrumenten
- Diskriminante Validität zwischen verwandten Skalen
- Jegliche Kriteriumsvalidität

Die Konstruktion beruht auf theoretischer Ableitung und inhaltlicher Plausibilität.
Das ist ein Ausgangspunkt, kein Gütenachweis.

### 6.4 Normierung

**Nur teilweise.** Perzentile existieren ausschließlich für die Big-Five-Domänen und
das Wohlbefindens-Modul, und auch dort über *fremde* Normstichproben, deren
Übertragbarkeit auf die hier verwendeten Eigenitems ungeprüft ist.

### 6.5 Zusammenfassung

> Facettn ist ein **theoretisch konstruiertes, nicht validiertes** Instrument. Es
> erfüllt Objektivität, erfüllt die konstruktionsseitigen Voraussetzungen für
> Reliabilität, und hat weder Reliabilität noch Validität empirisch nachgewiesen.
> Ergebnisse sind als **strukturierte Selbstbeschreibung** zu lesen, nicht als
> Messwerte im testtheoretischen Sinn.

---

## 7. Was zur Validierung nötig wäre

Vollständigkeitshalber dokumentiert — und mit dem Hinweis, dass es dem
Datenschutzversprechen des Produkts widerspricht und daher als **separates
Forschungsvorhaben mit eigener Einwilligung** durchzuführen wäre, nicht durch
stille Erhebung im laufenden Betrieb.

| Schritt | Stichprobe | Ergebnis |
|---|---|---|
| Kognitiver Pretest | 5–10 | Verständlichkeit, mehrdeutige Items |
| Expertenreview | 2–3 Fachpersonen | Inhaltsvalidität |
| Pilotstudie | N ≥ 300 | α/ω je Skala, Itemkennwerte, Trennschärfen |
| Strukturprüfung | N ≥ 500 | Konfirmatorische Faktorenanalyse |
| Retest | Teilstichprobe, 2–4 Wochen | Stabilität |
| Konvergenzstudie | N ≥ 200 | Korrelationen mit etablierten Verfahren |
| Normierung | N ≥ 1.000, quotiert | eigene Perzentile |

Erst danach wären Aussagen wie „reliabel" oder „validiert" zulässig. **Klinische**
Aussagekraft würde darüber hinaus Sensitivität und Spezifität gegen strukturierte
klinische Interviews erfordern — und damit die Einstufung als Medizinprodukt
auslösen.

---

## 8. Grenzen und bekannte Schwächen

1. **Keine empirische Validierung** (Abschnitt 6).
2. **Ungeprüfte Gewichte** — die Mehrfachladungen sind gesetzt, nicht gemessen.
3. **Selbstauskunft** — anfällig für mangelnde Selbstkenntnis, Stimmungseffekte und
   soziale Erwünschtheit. Die SD-Skala erfasst Letzteres nur grob.
4. **Ipsative Love Styles** — Werte sind relativ, nicht absolut vergleichbar.
5. **Keine Alters- oder Geschlechtsdifferenzierung** — die BFI-2-Perzentile nutzen
   die Gesamtstichprobe, obwohl beide Faktoren nachweislich wirken.
6. **Kulturelle Gebundenheit** — konstruiert für deutschsprachige Erwachsene.
7. **Kein Missbrauchsschutz bei Fremdnutzung** — wer den Test für eine andere Person
   ausfüllt, erhält ein Ergebnis, das nichts aussagt.
8. **Vergleichsfunktion** — die Partnerpassungs-Literatur findet reale, aber kleine
   Effekte. Der Prozentwert ist eine Orientierung, keine Prognose.

---

## 9. Änderungen und Versionierung

Das Payload-Format trägt eine Version. Jede Änderung an Itembestand oder Reihenfolge
erfordert eine Erhöhung, damit ein alter Link nicht stillschweigend gegen einen
neueren Fragebogen ausgewertet wird — alte Links scheitern dann sichtbar statt falsch
zu rechnen.

| Version | Änderung |
|---|---|
| v1 | Erstfassung, 57 inhaltliche Items |
| v2 | 119 Items, Facettenebene, Antwortzeit-Signal |
| v3 | 194 Items, ausbalancierte Polung, Zwangswahl bei Love Styles, Perfektionismus, Anspruchsabhängigkeit |

---

## 10. Quellen

Das vollständige Quellenverzeichnis mit DOIs liegt in
[`src/lib/content/references.ts`](../src/lib/content/references.ts) und wird in jeder
Auswertung mit ausgegeben — samt Angabe, wofür die jeweilige Quelle konkret verwendet
wird.
