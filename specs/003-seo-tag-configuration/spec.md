# Feature Specification: SEO Tag Configuration

**Feature Branch**: `003-seo-tag-configuration`

**Created**: 2026-10-01

**Status**: Draft

**Input**: User description: "Ich möchte, dass das Element SEO-Tag per Konfiguration aktiviert werden muss. Aktuell wird es immer angezeigt."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - SEO-Tag nur bei Aktivierung anzeigen (Priority: P1)

Als Plugin-Administrator möchte ich das SEO-Tag-Element über die vorhandene Editor-Konfiguration gezielt aktivieren, damit Redakteure es nur in dafür vorgesehenen Feldern sehen.

**Why this priority**: Das Element wird derzeit immer angezeigt. Eine ausdrückliche Konfiguration gibt Administratoren die Kontrolle über die Redaktionsoberfläche und verhindert unerwünschte Optionen.

**Independent Test**: Ein Feld mit nicht aktiviertem SEO-Tag öffnen und prüfen, dass das Element fehlt; danach die Option für das Feld aktivieren und prüfen, dass das Element verfügbar ist.

**Acceptance Scenarios**:

1. **Given** ein Editor-Preset ohne ausdrückliche SEO-Tag-Aktivierung, **When** ein Redakteur ein Feld mit diesem Preset öffnet, **Then** wird das SEO-Tag-Element nicht angezeigt.
2. **Given** ein Editor-Preset mit aktivierter SEO-Tag-Option, **When** ein Redakteur ein Feld mit diesem Preset öffnet, **Then** wird das SEO-Tag-Element wie bisher angezeigt und kann verwendet werden.
3. **Given** zwei Felder mit unterschiedlichen Presets, von denen nur eines SEO-Tag aktiviert, **When** ein Redakteur beide Felder öffnet, **Then** erscheint das Element ausschließlich im Feld mit aktivierter Option.

### User Story 2 - Bestehende Inhalte ohne SEO-Tag-Steuerelement weiterverwenden (Priority: P2)

Als Redakteur möchte ich bestehende Überschriften weiterhin bearbeiten und speichern können, auch wenn das SEO-Tag-Element nicht aktiviert ist.

**Why this priority**: Die neue Sichtbarkeitssteuerung darf bestehende Inhalte nicht beeinträchtigen oder von einer sichtbaren Auswahl abhängig machen.

**Independent Test**: Bereits gespeicherte Überschriften in einem Feld ohne aktivierte SEO-Tag-Option laden, bearbeiten und speichern; Inhalt und Darstellung müssen erhalten bleiben.

**Acceptance Scenarios**:

1. **Given** bestehende Überschriften mit gespeichertem SEO-Tag und ein Preset ohne aktivierte SEO-Tag-Option, **When** der Redakteur den Inhalt lädt und speichert, **Then** bleiben Überschrifteninhalt und gespeichertes Tag erhalten.
2. **Given** ein Preset ohne aktivierte SEO-Tag-Option, **When** der Redakteur neue Überschriften erstellt oder vorhandene bearbeitet, **Then** funktioniert die normale Überschriftenbearbeitung weiterhin.

### Edge Cases

- Wenn die Option fehlt oder keinen aktivierten Wert hat, ist das SEO-Tag-Element ausgeblendet.
- Das Aktivieren oder Deaktivieren der Option für ein Feld ändert nicht eigenständig bereits gespeicherte Inhalte.
- Die Option für ein Preset beeinflusst keine anderen Presets oder Felder.
- Wenn ein Preset einen ungültigen Wert für die SEO-Tag-Option enthält, wird dies bei der Konfigurationsvalidierung gemeldet und aktiviert das Element nicht.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Administratoren MUST die Anzeige des SEO-Tag-Elements über die bestehende Editor-Konfiguration für ein Preset steuern können.
- **FR-002**: Das SEO-Tag-Element MUST standardmäßig ausgeblendet sein, wenn die entsprechende Konfigurationsoption fehlt oder nicht aktiviert ist.
- **FR-003**: Das SEO-Tag-Element MUST angezeigt und nutzbar sein, wenn die entsprechende Konfigurationsoption ausdrücklich aktiviert ist.
- **FR-004**: Die Einstellung MUST unabhängig pro Preset wirken, sodass unterschiedliche Felder je nach zugewiesenem Preset unterschiedliche Sichtbarkeit haben können.
- **FR-005**: Das Ausblenden des Elements MUST die normale Überschriftenbearbeitung nicht verhindern.
- **FR-006**: Das Ein- oder Ausblenden des Elements MUST gespeicherte Überschrifteninhalte und ihre SEO-Tags nicht automatisch ändern oder entfernen.
- **FR-007**: Ungültige Werte für die SEO-Tag-Option MUST bei der Konfigurationsvalidierung gemeldet werden und dürfen das Element nicht unbeabsichtigt aktivieren.
- **FR-008**: Die Konfigurationsoption und ihre Standardwirkung MUST in der Plugin-Konfigurationsdokumentation beschrieben werden.
- **FR-009**: Die Aktivierung, die Voreinstellung ohne Aktivierung und der Erhalt bestehender Inhalte MUST durch automatisierte Tests abgedeckt werden.

### Key Entities *(include if feature involves data)*

- **Editor-Preset**: Konfiguration eines Editors, die festlegt, welche Werkzeuge und Bedienelemente für zugewiesene Felder verfügbar sind.
- **SEO-Tag-Element**: Bedienelement, über das Redakteure das semantische Tag einer Überschrift unabhängig von ihrer visuellen Ebene festlegen.
- **Überschrift**: Gespeicherter redaktioneller Inhalt mit Text, visueller Ebene und gegebenenfalls einem semantischen SEO-Tag.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: In 100 % der Felder ohne ausdrücklich aktivierte Option ist das SEO-Tag-Element beim Öffnen des Editors nicht sichtbar.
- **SC-002**: In 100 % der Felder mit ausdrücklich aktivierter Option ist das SEO-Tag-Element verfügbar.
- **SC-003**: In 100 % der geprüften Fälle bleiben vorhandene Überschriftentexte und gespeicherte SEO-Tags nach Laden und Speichern ohne sichtbares SEO-Tag-Element erhalten.
- **SC-004**: Administratoren können die Option einem einzelnen Preset zuweisen, ohne die Sichtbarkeit in anderen Presets zu ändern.

## Assumptions

- Die Konfiguration erfolgt über das bestehende Preset-Modell und gilt pro Editor-Preset.
- Fehlende Konfiguration entspricht deaktiviert; die bisher immer sichtbare Anzeige wird damit nicht als Standardverhalten beibehalten.
- Die Option steuert die Verfügbarkeit des Bedienelements. Sie löscht oder migriert keine vorhandenen SEO-Tag-Werte in gespeicherten Inhalten.
- Wenn die Option deaktiviert ist, gelten für neu erstellte oder bearbeitete Überschriften die vorhandenen Regeln für das Standard-Tag.
