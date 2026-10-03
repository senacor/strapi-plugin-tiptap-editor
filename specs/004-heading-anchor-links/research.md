# Research: Sprungmarken für Überschriften und Links

## Decision 1: ID am vorhandenen Heading-Node

- **Decision**: Optionales `id`-Attribut an `BaseHeadingWithSEOTag` ergänzen und als HTML-`id` ausgeben bzw. einlesen.
- **Rationale**: Der Editor deaktiviert StarterKit-Headings und verwendet bereits diese Heading-Erweiterung. So bleiben `level`, `tag` und Text im selben Node. Tiptap Headings geben registrierte HTML-Attribute über ihre bestehende Ausgabe weiter.
- **Alternatives considered**: Eigener Anchor-Node oder unsichtbares Inline-Element würde ein zweites Ziel erzeugen und Kopieren sowie Rendering erschweren.

## Decision 2: Gemeinsame ID-Regeln

- **Decision**: Für manuelle Eingaben Rand-Leerzeichen entfernen, Leerzeichen und führendes `#` ablehnen und IDs innerhalb des Editor-Dokuments exakt vergleichen. Leere Eingabe entfernt die ID.
- **Rationale**: Die gespeicherte ID muss unmittelbar zu `#<id>` passen. Eine gemeinsame Regel verhindert Abweichungen zwischen Toolbar, Vorschlägen und Paste-Bereinigung.
- **Alternatives considered**: Automatisch aus Überschriften generierte Slugs ändern sich bei Textkorrekturen und wurden nicht angefragt. Stille automatische Umbenennung kollidierender IDs macht Linkziele schwer vorhersehbar.

## Decision 3: Kollisionen aus Paste und Bestandsinhalten

- **Decision**: Bei Kollisionen die erste ID in Dokumentreihenfolge behalten und spätere IDs entfernen; Überschriftentext und übrige Attribute bleiben bestehen. Bei extern geladenen Konflikten den bereinigten Inhalt mit dem Feldwert synchronisieren und eine sichtbare Meldung anzeigen.
- **Rationale**: `useTiptapEditor` schreibt auf Editor-Updates direkt JSON in das Strapi-Feld und synchronisiert externe Werte mit `setContent(..., { emitUpdate: false })`. Eine reine Toolbar-Prüfung würde Paste und externe Werte nicht erfassen. Eine deterministische Bereinigung stellt vor dem nächsten Speichern Eindeutigkeit her.
- **Alternatives considered**: Eine ausschließlich lokale Fehlermeldung könnte das Speichern des unveränderten, bereits ungültigen Feldwerts nicht zuverlässig verhindern. Alle IDs zu entfernen wäre unnötiger Datenverlust.

## Decision 4: Vorschläge aus dem aktuellen Dokument

- **Decision**: Bei `heading.jumpLinks: true` und aktivierter Link-Funktion IDs und sichtbare Überschriftentexte unmittelbar beim Öffnen des Link-Dialogs aus dem aktuellen Editor-Dokument lesen. Nur gültige, eindeutige IDs anbieten.
- **Rationale**: Das macht Vorschläge aktuell und begrenzt sie automatisch auf genau ein Editor-Feld. Der vorhandene Link-Dialog unterstützt bereits manuelle Ziele sowie Bearbeiten und Entfernen.
- **Alternatives considered**: Eine globale Liste würde andere Felder vermischen. Eine zwischengespeicherte Liste könnte nach Änderungen veralten.

## Decision 5: HTML-Ausgabe außerhalb des Admin-Editors

- **Decision**: README und Inhaltsvertrag zeigen, dass Frontends beim Rendering des gespeicherten JSON eine Heading-Erweiterung mit `id`-Attribut registrieren müssen.
- **Rationale**: Das Plugin speichert Tiptap-JSON als Text. Die Standard-Heading-Erweiterung kennt ein zusätzliches benutzerdefiniertes Attribut nicht automatisch; ohne entsprechende Renderer-Konfiguration wäre zwar `#<id>` gespeichert, aber kein HTML-Ziel vorhanden.
- **Alternatives considered**: Ein zusätzlicher Server-Renderer würde den bestehenden Plugin-Vertrag und Umfang unnötig vergrößern.

## Decision 6: Dialoge und Lokalisierung

- **Decision**: Ein eigenes Sprungmarken-Symbol in der Überschriften-Werkzeugleiste öffnet einen Dialog zum Setzen, Ändern und Entfernen der ID. Validierungsfehler erscheinen am Eingabefeld. Die Sprungmarken-Auswahl im Link-Dialog nutzt die verfügbare Feldbreite. Beschriftungen, Hinweise und Fehlermeldungen liegen in Englisch und Deutsch vor.
- **Rationale**: Der separate Dialog hält die Überschriften-Werkzeugleiste kompakt. Die Feldbreite macht die Auswahl von Überschriftentext und ID leichter lesbar. Strapis bestehende Übersetzungsregistrierung lädt die passende Sprachdatei.
- **Alternatives considered**: Eine dauerhafte ID-Eingabe in der Werkzeugleiste beansprucht dort Platz; eine schmale Vorschlagsauswahl erschwert das Lesen längerer Überschriften.

## Decision 7: Preset-Option für Sprungmarken

- **Decision**: Die boolesche Heading-Option `jumpLinks` aktiviert Sprungmarken-Symbol und Dialog nur bei `true` und aktivierter Heading-Funktion. Link-Vorschläge setzen zusätzlich eine aktivierte Link-Funktion voraus. Fehlende oder auf `false` gesetzte Optionen verbergen die Bedienung; nicht boolesche Werte weist die Konfigurationsvalidierung zurück. Vorhandene IDs und manuelle Fragmentlinks bleiben nutzbar.
- **Rationale**: Presets steuern bereits die Heading-Funktion und optionale SEO-Tag-Auswahl. Ein standardmäßig deaktivierter Schalter erlaubt eine bewusste Freigabe der Sprungmarken-Bedienung je Preset.
- **Alternatives considered**: Ein globaler Schalter könnte die Funktion nicht je Preset steuern; das Entfernen vorhandener IDs beim Deaktivieren würde Inhalt verändern.

## Repository findings

- `admin/src/utils/buildExtensions.ts` deaktiviert StarterKit-Headings und registriert `BaseHeadingWithSEOTag` nur bei aktivierter Heading-Funktion.
- `admin/src/extensions/Heading.tsx` verwaltet bereits die optional sichtbare SEO-Tag-Auswahl.
- `admin/src/extensions/Link.tsx` und `admin/src/components/LinkDialog.tsx` kapseln Linkanlage und URL-Eingabe.
- `admin/src/utils/tiptapUtils.tsx` speichert JSON über `useField` und lädt externe Feldwerte ohne Editor-Update.
- `README.md` enthält ein Frontend-Beispiel zur Ausgabe gespeicherten JSONs.
