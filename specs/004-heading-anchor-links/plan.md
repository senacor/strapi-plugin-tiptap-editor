# Implementation Plan: Sprungmarken für Überschriften und Links

**Branch**: `main` (kein Feature-Branch angelegt) | **Date**: 2026-10-01 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `specs/004-heading-anchor-links/spec.md`

## Summary

Die bestehende Heading-Erweiterung erhält eine optionale `id` als Node-Attribut. Ein kleines gemeinsames Regelwerk prüft und normalisiert IDs innerhalb eines Editor-Dokuments. Bei `heading.jumpLinks: true` erlaubt die Überschriftenbedienung Vergabe, Änderung und Entfernung; bei zusätzlich aktivierter Link-Funktion zeigt der Link-Dialog die aktuellen gültigen Sprungmarken an und setzt bei Auswahl `#<id>`. Ohne die Option bleiben vorhandene IDs im Inhalt und manuelle Fragmentlinks nutzbar. README und Renderer-Beispiel dokumentieren, wie die ID außerhalb des Admin-Editors am HTML-Heading erscheint.

## Technical Context

**Language/Version**: TypeScript 5.9.3, React 18.3.1.

**Primary Dependencies**: Strapi 5.39.0, Tiptap 3.20.1, ProseMirror über `@tiptap/pm`, Strapi Design System 2.2.0.

**Storage**: Bestehendes Strapi-Textfeld mit serialisiertem Tiptap/ProseMirror-JSON; zusätzliches optionales `attrs.id` am Heading-Node. Keine Datenbankmigration.

**Testing**: Vitest 4.1.11; `npm test`, `npm run test:ts:front`, `npm run test:ts:back`.

**Target Platform**: Strapi-v5-Admin und Frontends, die gespeichertes Tiptap-JSON ausgeben.

**Project Type**: Strapi-Plugin mit `admin/`, `server/` und `shared/`.

**Performance Goals**: Bei aktivierten Sprungmarken Vorschläge für 20 Überschriften beim Öffnen des Dialogs ohne wahrnehmbare Verzögerung; Dokumentscan proportional zur Anzahl der Nodes, keine wiederholte Vollsuche pro Tastendruck im Link-Dialog.

**Constraints**: Bestehende Headings, SEO-Tag-Attribut und Links bewahren; IDs nur pro Editor-Dokument vergleichen; sichere Ausgabe als Attribut, keine neue Serverroute; doppelte IDs nach Paste und externem Laden bereinigen. `heading.jumpLinks` aktiviert die Sprungmarken-Bedienung als Opt-in.

**Scale/Scope**: Ein Editor-Feld; Headings h1–h6; vorhandener Link-Dialog; Inhalte mit und ohne konfigurierte Heading- und Link-Funktion.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **I. Strapi Plugin Contract First — Pass**: Keine bestehenden Konfigurationsschlüssel, Feldtypen, Routen oder Exporte ändern. Die optionale Heading-Konfiguration `jumpLinks` und das optionale Heading-Attribut erweitern Preset und Inhaltsformat; README beschreibt beides.
- **II. Editor Content Compatibility — Pass**: Bestehendes JSON ohne `id` bleibt lesbar. Die vorhandene Heading-Node wird erweitert; ihre Ebene, SEO-Tag und Kinder bleiben erhalten. Renderer müssen die erweiterte Heading-Definition verwenden, um `id` in HTML auszugeben.
- **III. Verified Behavior — Pass**: Geplant sind gezielte Tests für JSON/HTML-Roundtrip, Eindeutigkeit, Paste, externes Laden, Toolbar und Link-Dialog. Vor Review: `npm test` und beide TypeScript-Checks.
- **IV. Secure, Validated Configuration — Pass**: Kein neuer Konfigurationswert. ID-Eingaben werden normalisiert und validiert; keine HTML-Fragmente oder unsicheren Linkschemata werden erzeugt.
- **V. Focused, Configurable Extensions — Pass**: Funktion nutzt die vorhandenen `heading`- und `link`-Preset-Schalter sowie die boolesche Heading-Option `jumpLinks`; keine neue Laufzeitabhängigkeit.

**Post-design check**: Alle fünf Gates bleiben erfüllt. Das Datenmodell ist additiv, die Link-Schnittstelle bleibt kompatibel, und der Ausgabevertrag wird ausdrücklich dokumentiert.

## Project Structure

### Documentation (this feature)

```text
specs/004-heading-anchor-links/
├── spec.md
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── editor-content-and-links.md
└── checklists/
    └── requirements.md
```

### Source Code (repository root)

```text
admin/src/extensions/Heading.tsx       # id-Attribut und Bedienelement
admin/src/extensions/Link.tsx          # Vorschläge aus dem aktuellen Editor-Dokument
admin/src/components/HeadingAnchorDialog.tsx # Dialog für die Sprungmarken-ID
admin/src/components/LinkDialog.tsx    # Auswahl bestehender Sprungmarken
admin/src/components/RichTextInput.tsx # Integration der Bedienelemente
admin/src/utils/buildExtensions.ts    # Heading-Erweiterung im Preset
admin/src/utils/tiptapUtils.tsx        # Synchronisierung externer Inhalte
admin/src/utils/headingAnchors.ts     # Validierung, Scan und Kollisionsbereinigung
admin/src/translations/              # Beschriftung und Fehlermeldungen
shared/types.ts                       # Typ für heading.jumpLinks
server/src/config/index.ts           # Validierung der booleschen Option
tests/admin/                         # Verhalten und Kompatibilität
README.md                            # Redaktion und Frontend-Ausgabe
```

**Structure Decision**: Die Änderung bleibt im bestehenden Admin-Paket und im gespeicherten Inhaltsformat. Der Server benötigt keine neue Schnittstelle. Die Regeln für IDs werden in einer kleinen Utility gebündelt, damit Toolbar, Paste, externer Inhalt und Linkvorschläge dieselbe Definition verwenden.

## Design Sequence

1. **Inhaltsvertrag**: `attrs.id` am vorhandenen Heading-Node ergänzen; HTML-Parsing und HTML-Ausgabe mit und ohne ID prüfen, einschließlich `attrs.tag` für SEO.
2. **ID-Regeln**: Leere Eingabe als Entfernen, Rand-Leerzeichen trimmen, innere Leerzeichen und führendes `#` ablehnen, exakte Eindeutigkeit über das jeweilige Dokument prüfen.
3. **Kollisionen**: Beim Einfügen kopierter Headings nur spätere kollidierende IDs löschen. Bei extern geladenem Bestands-JSON dieselbe deterministische Regel vor der Feld-Synchronisierung anwenden und eine sichtbare Meldung ausgeben; Text und übrige Attribute erhalten.
4. **Redaktionelle Bedienung**: Bei aktiver Überschrift und aktiviertem `heading.jumpLinks` ein eigenes Symbol anzeigen. Der zugehörige Dialog bearbeitet die ID; Validierungsfehler erscheinen am Eingabefeld, ohne ungültige Werte in den Editor zu übernehmen.
5. **Links**: Bei aktiviertem `heading.jumpLinks` und aktivierter Link-Funktion beim Öffnen des bestehenden Link-Dialogs gültige, eindeutige IDs samt Überschriftentext aus dem aktuellen Editor lesen. Das Auswahlfeld füllt die Feldbreite; die Liste ist mindestens so breit wie der Auslöser. Auswahl setzt `#<id>`; URL-Eingabe, Link-Bearbeitung und Entfernen bleiben nutzbar.
6. **Kompatibilität und Dokumentation**: Bestehende Inhalte ohne IDs und vorhandene externe Links prüfen. README erklärt JSON-Attribut und erforderliche Heading-Erweiterung beim Frontend-Rendering.
7. **Lokalisierung**: Beschriftungen, Hinweise und Fehlermeldungen in `en.json` und `de.json` hinterlegen; Strapis `registerTrads` lädt die passende Datei.
8. **Preset-Schalter**: `heading.jumpLinks` als optionale boolesche Option definieren und ungültige Typen ablehnen. Nur `true` bei aktivierter Heading-Funktion zeigt das Sprungmarken-Symbol; Vorschläge setzen zusätzlich die Link-Funktion voraus. Gespeicherte IDs und manuelle Fragmentlinks bleiben bei deaktivierter Option nutzbar.

## Complexity Tracking

Keine Verfassungsausnahme erforderlich.
