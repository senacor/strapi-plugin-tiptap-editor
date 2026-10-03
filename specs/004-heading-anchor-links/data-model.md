# Data Model: Sprungmarken für Überschriften und Links

## Editor-Content

- **Storage**: Bestehendes serialisiertes Tiptap/ProseMirror-JSON im Strapi-Feld.
- **Boundary**: Ein Editor-Content ist der einzige Geltungsbereich für ID-Eindeutigkeit und Linkvorschläge.
- **Invariant**: Nicht leere Heading-IDs sind innerhalb dieses Dokuments eindeutig.
- **Compatibility**: Dokumente ohne Heading-IDs benötigen keine Migration. Andere Felder und Dokumente dürfen dieselbe ID verwenden.
- **Preset-Option**: `heading.jumpLinks?: boolean` ist standardmäßig deaktiviert. Es steuert die Bedienung, nicht das gespeicherte JSON. Deaktivieren entfernt vorhandene IDs nicht; nicht boolesche Werte sind ungültig.

## Heading

- **Node type**: `heading`.
- **Existing attributes**: `level` (1 bis 6), optionales `tag` für SEO.
- **New attribute**: `id?: string | null`. `null` bzw. fehlend bedeutet keine Sprungmarke. Eine gesetzte ID wird unverändert als HTML-`id` an der gerenderten Überschrift ausgegeben.
- **Children**: Vorhandener Inline-Inhalt bleibt unverändert.

### Validation

1. Eingabe an den Rändern trimmen.
2. Leere Eingabe entfernt `id`.
3. Gesetzte ID darf kein Leerzeichen enthalten und nicht mit `#` beginnen.
4. Gesetzte ID darf in keinem anderen Heading-Node desselben Dokuments exakt vorkommen.
5. Vergleich ist schreibungsabhängig: `Kapitel` und `kapitel` sind verschieden.

### State transitions

| Ausgangszustand | Aktion | Ergebnis |
| --- | --- | --- |
| Ohne ID | Gültige eindeutige ID eingeben | ID gespeichert |
| Mit ID | Andere gültige eindeutige ID eingeben | ID ersetzt |
| Mit ID | Eingabe leeren | ID entfernt |
| Beliebig | Ungültige oder doppelte ID eingeben | Zustand unverändert, Fehlermeldung |
| Eingefügte Kopie mit kollidierender ID | Paste/Kopieren | Text und übrige Attribute erhalten, ID der Kopie entfernt |
| Extern geladene doppelte IDs | Inhalt öffnen | Erste ID erhalten, spätere gleiche IDs entfernt, Hinweis angezeigt |

## Sprungmarken-Vorschlag

- **Abgeleitete Daten**, kein eigener Speicher.
- **Verfügbarkeit**: Nur bei aktivierter Heading-Funktion mit `jumpLinks: true` und aktivierter Link-Funktion.
- **Felder**: `id`, sichtbarer Überschriftentext, Dokumentposition.
- **Quelle**: Gültige, eindeutige Headings im aktuellen Editor-Content.
- **Sortierung**: Dokumentreihenfolge.
- **Lebensdauer**: Wird beim Öffnen des Link-Dialogs neu ermittelt.

## Link

- **Bestehendes Objekt**: Link-Mark auf Text mit `href`.
- **Sprungmarken-Ziel**: `href = "#"` + ausgewählte Heading-ID.
- **Übrige Ziele**: Bisherige manuelle Eingabe bleibt erhalten.
- **Referenzverhalten**: Umbenennen oder Entfernen einer Heading-ID verändert gespeicherte Links nicht automatisch.
