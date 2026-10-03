# Quickstart: Sprungmarken validieren

## Voraussetzungen

- Strapi-v5-Testinstallation mit diesem Plugin.
- Ein Rich-Text-Feld mit einem Preset, das `heading: { jumpLinks: true }` und `link: true` aktiviert.
- Für den Frontend-Test ein Renderer, der das gespeicherte JSON mit der im [Inhaltsvertrag](contracts/editor-content-and-links.md) beschriebenen Heading-ID ausgibt.

## Automatisierte Prüfungen

Nach der Implementierung im Repository ausführen:

```sh
npm test
npm run test:ts:front
npm run test:ts:back
npm run build
```

Erwartung: Tests, beide TypeScript-Prüfungen und der Build sind erfolgreich. Die bestehenden Tests decken den JSON/HTML-Roundtrip, ID-Validierung, Eindeutigkeit, Paste-Kollision, extern geladene Duplikate sowie Linkvorschläge und Linkbearbeitung ab. Die Konfigurationszustände aus den Schritten 11 bis 13 sind manuell zu prüfen.

## Redaktionelle Prüfung

1. Zwei Überschriften anlegen und ihnen über das Sprungmarken-Symbol und dessen Dialog `einleitung` und `details` als IDs geben. Speichern und erneut öffnen. **Erwartung:** Beide IDs sind an den richtigen Überschriften erhalten.
2. Einer dritten Überschrift `details` zuweisen. **Erwartung:** Verständlicher Fehler direkt am Eingabefeld; die zweite Vergabe wird nicht übernommen.
3. Eine Überschrift mit ID im selben Inhalt kopieren. **Erwartung:** Kopie und Text bleiben erhalten, die kopierte ID wird entfernt.
4. Text markieren und den Link-Dialog öffnen. **Erwartung:** Beide Sprungmarken mit Text und ID in Dokumentreihenfolge; das Auswahlfeld füllt die Breite des Dialogfelds und die Liste ist mindestens ebenso breit. Auswahl von `details` erzeugt `#details`.
5. Den Link bearbeiten, eine andere Sprungmarke wählen und danach eine gewöhnliche URL eingeben. **Erwartung:** Beides funktioniert; bestehende Funktionen zum Entfernen des Links bleiben verfügbar.
6. ID `details` umbenennen oder entfernen und Dialog erneut öffnen. **Erwartung:** Vorschläge entsprechen dem aktuellen Inhalt; bereits gespeicherte Links werden nicht automatisch umgeschrieben.
7. Ein älteres Dokument ohne IDs öffnen und speichern. **Erwartung:** Keine automatisch erzeugten IDs; Überschriften und Links bleiben erhalten.
8. Ein vorbereitetes Dokument mit zwei gleichen IDs laden. **Erwartung:** Erste ID bleibt, spätere gleiche ID wird entfernt, Überschriftentext bleibt und ein Hinweis erscheint.
9. Das gespeicherte Dokument im Frontend ausgeben und den Link `#details` öffnen. **Erwartung:** Der Browser springt zur Heading mit `id="details"`.
10. Strapi-Admin auf Deutsch und Englisch öffnen. **Erwartung:** Beschriftungen, Hinweise und Fehlermeldungen für Sprungmarken und Links erscheinen in der jeweiligen Sprache.
11. Im Preset `jumpLinks` weglassen oder auf `false` setzen und denselben Inhalt erneut öffnen. **Erwartung:** Sprungmarken-Symbol und Vorschlagsauswahl fehlen; bestehende Heading-IDs und manuell eingegebene `#id`-Links bleiben erhalten.
12. `heading: true` und anschließend `heading: false` prüfen. **Erwartung:** In beiden Fällen gibt es keine Sprungmarken-Bedienung; bei `heading: true` bleibt die normale Überschriftenauswahl verfügbar.
13. In der Plugin-Konfiguration `heading: { jumpLinks: "yes" }` setzen. **Erwartung:** Die Konfigurationsvalidierung lehnt den nicht booleschen Wert mit einer Meldung zu `heading.jumpLinks` ab.

## Nachweise

- **Manuelle Prüfung:** Am 2026-10-03 vom Nutzer als erfolgreich gemeldet; ein detailliertes Prüfprotokoll liegt nicht im Repository.
- [Spezifikation](spec.md)
- [Datenmodell](data-model.md)
- [Inhalts- und Linkvertrag](contracts/editor-content-and-links.md)
