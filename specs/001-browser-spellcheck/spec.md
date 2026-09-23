# Feature Specification: Browser Spellchecking

**Feature Branch**: `001-browser-spellcheck`

**Created**: 2026-09-23

**Status**: Draft

**Input**: User description: "Der TipTap Editor soll die Rechtschreibprüfung vom Browser aktivieren. Die Inhalte können in Strapi mehrsprachig gepflegt werden, daher soll die Sprache des Artikels für die Rechtschreibprüfung übernommen werden. Die Rechtschreibprüfung soll per Konfiguration aktiviert werden können."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Browser-Rechtschreibprüfung aktivieren (Priority: P1)

Als Redakteur möchte ich die Rechtschreibprüfung des Browsers im TipTap Editor verwenden können, damit ich Tippfehler direkt beim Erfassen und Bearbeiten von Inhalten erkenne.

**Why this priority**: Die Aktivierung der gewünschten Kernfunktion liefert den unmittelbaren Nutzen für Redakteure.

**Independent Test**: Die Funktion kann mit einem Editor getestet werden, der mit aktivierter Rechtschreibprüfung geöffnet wird: Ein absichtlich falsch geschriebenes Wort wird vom Browser als fehlerhaft markiert.

**Acceptance Scenarios**:

1. **Given** die Rechtschreibprüfung ist für den Editor aktiviert und der Browser unterstützt sie, **When** ein Redakteur Text mit einem absichtlich falsch geschriebenen Wort eingibt, **Then** stellt der Browser das Wort entsprechend seiner eigenen Rechtschreibprüfung als fehlerhaft dar.
2. **Given** die Rechtschreibprüfung ist für den Editor deaktiviert, **When** ein Redakteur Text eingibt, **Then** fordert der Editor keine Browser-Rechtschreibprüfung an.

---

### User Story 2 - Prüfung an der Artikelsprache ausrichten (Priority: P1)

Als Redakteur möchte ich, dass die Rechtschreibprüfung die Sprache der aktuell bearbeiteten Artikelversion verwendet, damit mehrsprachige Inhalte mit dem passenden Wörterbuch geprüft werden.

**Why this priority**: Eine falsche Prüfsprache erzeugt irreführende Markierungen und macht die Funktion bei mehrsprachigen Inhalten unzuverlässig.

**Independent Test**: Derselbe Editor kann nacheinander mit Artikelversionen in zwei unterstützten Sprachen geöffnet werden. Die für die Prüfung verwendete Sprache entspricht jeweils der Sprache der aktiven Version.

**Acceptance Scenarios**:

1. **Given** die Rechtschreibprüfung ist aktiviert und die aktive Artikelversion hat eine unterstützte Sprache, **When** der Editor geöffnet oder die aktive Sprachversion gewechselt wird, **Then** wird diese Sprache für die Browser-Rechtschreibprüfung des Editors verwendet.
2. **Given** die aktive Artikelversion hat keine verwertbare Sprache, **When** der Editor geöffnet wird, **Then** verwendet der Editor die normale Browser- bzw. Umgebungssprache als Fallback und bleibt bedienbar.

---

### User Story 3 - Funktion über Konfiguration steuern (Priority: P2)

Als Administrator möchte ich die Rechtschreibprüfung über die bestehende Editor-Konfiguration aktivieren oder deaktivieren können, damit ich sie abhängig von den Anforderungen meiner Strapi-Installation steuern kann.

**Why this priority**: Installationen benötigen eine kontrollierbare Einführung und müssen die Funktion bei Bedarf deaktivieren können.

**Independent Test**: Die Editor-Konfiguration kann mit aktiviertem und deaktiviertem Wert geladen werden. In beiden Fällen zeigt der Editor das jeweils konfigurierte Verhalten.

**Acceptance Scenarios**:

1. **Given** die Konfiguration enthält eine gültige Aktivierung der Rechtschreibprüfung, **When** ein Redakteur den Editor öffnet, **Then** ist die Browser-Rechtschreibprüfung aktiv und folgt der Artikelsprache.
2. **Given** die Konfiguration enthält eine gültige Deaktivierung der Rechtschreibprüfung oder keinen Wert, **When** ein Redakteur den Editor öffnet, **Then** bleibt die Browser-Rechtschreibprüfung deaktiviert.
3. **Given** die Konfiguration enthält einen ungültigen Wert, **When** die Editor-Konfiguration geladen wird, **Then** wird der ungültige Wert nicht als Aktivierung interpretiert und der Editor bleibt funktionsfähig.

### Edge Cases

- Der Browser unterstützt keine Rechtschreibprüfung oder der Benutzer hat sie im Browser deaktiviert; der Editor bleibt ohne Fehlermeldung nutzbar.
- Die Sprache der Artikelversion ist nicht vorhanden, leer oder nicht in einem für den Browser verwertbaren Sprachformat; die Prüfung fällt auf die Browser- bzw. Umgebungssprache zurück.
- Die Artikelsprache ändert sich während einer geöffneten Bearbeitung; die Prüfspracheneinstellung wird auf die neue aktive Sprache angepasst.
- Der Inhalt enthält mehrere Sprachen innerhalb eines Artikels; für Version 1 gilt die Sprache der aktiven Artikelversion für den gesamten Editorinhalt.
- Die Konfiguration wird für mehrere Editorinstanzen unterschiedlich gesetzt; jede Instanz folgt ihrer eigenen gültigen Konfiguration.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Der Editor MUST eine konfigurierbare Option zur Aktivierung der Browser-Rechtschreibprüfung bereitstellen.
- **FR-002**: Die Rechtschreibprüfung MUST standardmäßig deaktiviert sein, wenn die Option fehlt, damit bestehende Installationen ihr bisheriges Verhalten beibehalten.
- **FR-003**: Wenn die Option aktiviert ist, MUST der Editor die Browser-Rechtschreibprüfung für editierbaren Text anfordern.
- **FR-004**: Die Funktion MUST die Sprache der aktuell bearbeiteten Artikelversion als Sprache für die Rechtschreibprüfung übernehmen.
- **FR-005**: Der Editor MUST die verwendete Prüfsprache aktualisieren, wenn die aktive Artikelversion oder deren Sprache während der Bearbeitung wechselt.
- **FR-006**: Wenn keine verwertbare Artikelsprache verfügbar ist, MUST der Editor auf die Browser- bzw. Umgebungssprache zurückfallen.
- **FR-007**: Die Funktion MUST ohne Fehlermeldung weiter nutzbar bleiben, wenn der Browser keine Rechtschreibprüfung unterstützt oder sie deaktiviert ist.
- **FR-008**: Ungültige Konfigurationswerte MUST sicher behandelt werden und dürfen die Rechtschreibprüfung nicht aktivieren.
- **FR-009**: Die Funktion MUST bestehende TipTap/ProseMirror-Inhalte unverändert lassen; die Rechtschreibprüfung darf keine zusätzlichen Inhaltsdaten speichern.
- **FR-010**: Die öffentliche Konfigurationsoption und ihr Standardverhalten MUST in der Plugin-Dokumentation beschrieben werden.

### Key Entities *(include if feature involves data)*

- **Editor-Konfiguration**: Die installation- oder instanzbezogene Einstellung, die festlegt, ob die Browser-Rechtschreibprüfung angefordert wird.
- **Artikelversion**: Die aktuell bearbeitete lokalisierte Version eines Strapi-Inhalts mit einer Sprache, die für die Rechtschreibprüfung verwendet wird.
- **Prüfsprache**: Die aus der aktiven Artikelversion abgeleitete Sprache; bei fehlender oder nicht verwertbarer Sprache die Browser- bzw. Umgebungssprache.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Bei aktivierter Konfiguration wird die Browser-Rechtschreibprüfung in 100 % der unterstützten Testfälle angefordert; bei deaktivierter oder fehlender Konfiguration in 0 % der Testfälle.
- **SC-002**: Bei mindestens 95 % der Testfälle mit gültiger Artikelsprache entspricht die verwendete Prüfsprache der Sprache der aktiven Artikelversion.
- **SC-003**: Redakteure können einen Inhalt mit aktivierter Rechtschreibprüfung ohne zusätzlichen Konfigurationsschritt im Editor öffnen und bearbeiten.
- **SC-004**: In Browsern ohne verfügbare Rechtschreibprüfung bleiben 100 % der getesteten Bearbeitungs-, Speicher- und Lokalisierungsabläufe ohne Funktionsfehler.
- **SC-005**: Bestehende Inhalte weisen nach Bearbeitung mit aktivierter oder deaktivierter Rechtschreibprüfung keine zusätzlichen oder veränderten gespeicherten Inhaltsdaten auf.

## Assumptions

- Die Browser-Rechtschreibprüfung wird ausschließlich durch den Browser bereitgestellt; das Plugin liefert kein eigenes Wörterbuch und keine eigene Fehlerbewertung.
- Die Sprache der aktiven Strapi-Artikelversion ist für den Editor zugänglich und wird in einem standardisierten Sprachformat oder in ein solches konvertierbar bereitgestellt.
- Die Funktion gilt in Version 1 für den gesamten Editorinhalt anhand einer einzigen aktiven Artikelsprachversion; gemischtsprachige Textsegmente werden nicht separat konfiguriert.
- Die Option wird als Boolean behandelt; fehlende, falsche oder nicht unterstützte Werte führen zum deaktivierten Verhalten.
- Die Unterstützung und die individuellen Einstellungen des jeweiligen Browsers bleiben außerhalb des Einflussbereichs des Plugins.
- Änderungen an bestehenden gespeicherten TipTap/ProseMirror-Dokumenten sind nicht erforderlich.
