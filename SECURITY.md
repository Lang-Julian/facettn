# Sicherheit

## Angriffsfläche

Dieses Projekt hat bewusst fast keine. Es gibt keinen Anwendungsserver, keine
Datenbank, keine Authentifizierung, keine Sitzungen, keine API-Endpunkte und keine
Secrets. Alle Seiten sind statisch vorgerendert; die Auswertung läuft ausschließlich im
Browser des Nutzers.

Damit fallen ganze Klassen von Schwachstellen weg: SQL-Injection, fehlerhafte
Zugriffsregeln, Sitzungsübernahme, Datenlecks aus einer Datenbank. Es gibt keinen
Datenbestand, der abfließen könnte.

## Was trotzdem relevant bleibt

- **Cross-Site-Scripting.** Der Ergebnis-Link ist Nutzereingabe. Der Payload-Codec
  akzeptiert ausschließlich Ziffern in fester Länge und lehnt alles andere ab; nichts
  aus dem Fragment wird als HTML interpretiert. Änderungen an
  `src/lib/share/payload.ts` müssen diese strikte Validierung erhalten.
- **Content-Security-Policy.** Konfiguriert in `next.config.mjs`. `unsafe-eval` ist
  ausschließlich im Entwicklungsmodus erlaubt (React Fast Refresh braucht es); in
  Produktion bleibt die Policy strikt. Keine externen Skripte, keine Fonts von einem
  CDN, keine eingebetteten Drittinhalte.
- **Vertraulichkeit des Links.** Wer einen Ergebnis-Link besitzt, sieht das Profil. Das
  ist beabsichtigt und die Kehrseite davon, kein Konto zu verlangen. Ergebnisseiten
  sind auf `noindex` gesetzt, damit sie nicht in Suchmaschinen landen.
- **Wohlbefindens-Modul.** `stripWellbeing()` entfernt diesen Block aus jedem
  Teilen-Link, weil er die Frage nach Suizidgedanken enthält. Jede neue
  Teilen-Funktion muss den bereinigten Payload verwenden.

## Eine Lücke melden

Bitte **kein öffentliches Issue** für sicherheitsrelevante Funde. Nutze die
[Security-Advisory-Funktion von GitHub](https://github.com/Lang-Julian/facettn/security/advisories/new)
für eine private Meldung.

Sinnvolle Angaben: betroffene Datei oder Route, Reproduktionsschritte und die
praktische Auswirkung. Da es keine Nutzerdaten gibt, sind die interessantesten Funde
solche, die die Zero-Storage-Eigenschaft aushebeln — etwa ein Weg, auf dem Antworten
doch an einen Server gelangen.

Rückmeldung erfolgt, sobald es zeitlich möglich ist; dies ist ein Freizeitprojekt ohne
zugesagte Reaktionszeiten.

## Was ausdrücklich kein Sicherheitsproblem ist

- Dass der Payload lesbar und nicht verschlüsselt ist. Das ist eine
  Transparenz-Entscheidung: Es sind die eigenen Antworten der Nutzerin, auf ihrem
  eigenen Gerät, und die Nachprüfbarkeit ist der Punkt.
- Dass ein weitergegebener Link von Empfängern gelesen werden kann.
- Dass ein verlorener Link nicht wiederherstellbar ist.
