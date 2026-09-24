# Feature Specification: Immediate Language Prefill Refresh

**Feature Branch**: `002-language-prefill-refresh`

**Created**: 2026-09-24

**Status**: Draft

**Input**: User description: "In Strapi kann ein Artikel mit dem Inhalt aus einer anderen Sprache vorbefüllt werden. Nach dem Vorbefüllen wird der im Editor dargestellte Inhalt erst nach dem Speichern aktualisiert. Der Inhalt soll direkt aktualisiert werden."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Vorbefüllten Inhalt sofort sehen (Priority: P1)

Als Redakteur möchte ich einen Artikel mit dem Inhalt einer anderen Sprache vorbefüllen, damit ich den übernommenen Inhalt unmittelbar prüfen und weiterbearbeiten kann.

**Why this priority**: Die sofortige Sichtbarkeit ist der Kern des Vorbefüllens. Ohne sie kann der Redakteur den übernommenen Inhalt nicht zuverlässig prüfen, bevor er weitere Änderungen vornimmt.

**Independent Test**: Einen mehrsprachigen Artikel öffnen, das Vorbefüllen aus einer anderen Sprache auslösen und prüfen, dass der übernommene Inhalt ohne Speichern im Editor sichtbar ist.

**Acceptance Scenarios**:

1. **Given** ein Artikel mit verfügbarer Ausgangssprache und ein leerer oder bestehender Inhalt in der Zielsprache, **When** der Redakteur den Inhalt aus der Ausgangssprache vorbefüllt, **Then** zeigt der Editor unmittelbar den übernommenen Inhalt der Ausgangssprache an.
2. **Given** der Inhalt wurde vorbefüllt, **When** der Redakteur den übernommenen Inhalt vor dem Speichern prüft, **Then** kann er ihn bearbeiten und die Änderungen wie gewohnt speichern.
3. **Given** der Inhalt wurde vorbefüllt, **When** der Redakteur die Seite ohne Speichern verlässt, **Then** wird kein nicht gespeicherter Inhalt als dauerhaft gespeichert behandelt.

### User Story 2 - Leeren oder fehlerhaften Vorbefüllvorgang nachvollziehbar behandeln (Priority: P2)

Als Redakteur möchte ich bei einem nicht möglichen Vorbefüllen einen konsistenten Editorzustand behalten, damit ich nicht versehentlich falschen oder unvollständigen Inhalt bearbeite.

**Why this priority**: Fehler- und Randfälle dürfen den vorhandenen Inhalt nicht unbemerkt ersetzen und sind für die sichere Nutzung des Vorbefüllens erforderlich.

**Independent Test**: Einen Vorbefüllvorgang mit fehlendem oder ungültigem Ausgangsinhalt auslösen und prüfen, dass der Editor keinen inkonsistenten Inhalt anzeigt.

**Acceptance Scenarios**:

1. **Given** kein übernehmbarer Inhalt ist verfügbar, **When** der Redakteur das Vorbefüllen auslöst, **Then** bleibt der aktuelle Editorinhalt unverändert und der Redakteur erhält eine verständliche Rückmeldung.
2. **Given** der Vorbefüllvorgang kann nicht abgeschlossen werden, **When** der Fehler auftritt, **Then** bleibt der Editor in einem bearbeitbaren Zustand und bereits gespeicherte Inhalte werden nicht überschrieben.

### Edge Cases

- Wenn die Ausgangssprache denselben Inhalt wie die Zielsprache enthält, wird der Inhalt trotzdem unmittelbar und ohne zusätzliche Speichermeldung angezeigt.
- Wenn der bestehende Zielinhalt bereits ungespeicherte Änderungen enthält, muss der Vorbefüllvorgang diese nicht stillschweigend verwerfen; der Redakteur erhält eine geeignete Warnung oder Bestätigung, bevor der Inhalt ersetzt wird.
- Wenn der Ausgangsinhalt leer ist, darf der Editor nicht den zuletzt angezeigten Inhalt aus einer anderen Sprache weiter anzeigen.
- Wenn der Vorbefüllvorgang abgebrochen wird oder fehlschlägt, bleibt der zuletzt gültige Editorzustand erhalten.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Das System MUST den Editor unmittelbar mit dem Inhalt der ausgewählten Ausgangssprache aktualisieren, sobald das Vorbefüllen erfolgreich abgeschlossen ist.
- **FR-002**: Der aktualisierte Inhalt MUST ohne vorheriges Speichern sichtbar, auswählbar und bearbeitbar sein.
- **FR-003**: Das Vorbefüllen MUST den bestehenden Inhalt der Zielsprache nur nach der bestehenden Vorbefüll-Interaktion ersetzen; es MUST keine zusätzliche oder automatische Speicherung auslösen.
- **FR-004**: Änderungen, die der Redakteur nach dem Vorbefüllen vornimmt, MUST gemeinsam mit dem übernommenen Inhalt über den bestehenden Speichervorgang gespeichert werden können.
- **FR-005**: Bei fehlendem, leerem oder nicht verarbeitbarem Ausgangsinhalt MUST der bisherige Editorinhalt erhalten bleiben und der Redakteur eine verständliche Rückmeldung erhalten.
- **FR-006**: Bei einem Vorbefüllfehler MUST der Editor bearbeitbar bleiben und bereits gespeicherter Inhalt unverändert bleiben.
- **FR-007**: Das Verhalten MUST für alle vom bestehenden Vorbefüllvorgang unterstützten Sprachkombinationen einheitlich gelten.
- **FR-008**: Die bestehende Darstellung und Bearbeitung bereits geladener Inhalte MUST unverändert funktionieren, wenn kein Vorbefüllen ausgelöst wird.
- **FR-009**: Die Änderung MUST durch automatisierte Tests für den erfolgreichen Vorbefüllvorgang sowie für mindestens einen Fehler- oder Leerinhaltsfall abgesichert werden.

### Key Entities

- **Artikel**: Mehrsprachiger redaktioneller Inhalt mit einer oder mehreren Sprachversionen.
- **Ausgangssprache**: Sprachversion, aus der Inhalt für eine andere Sprachversion übernommen wird.
- **Zielsprache**: Sprachversion, deren Editorinhalt durch das Vorbefüllen aktualisiert werden soll.
- **Editorzustand**: Der aktuell angezeigte und bearbeitbare Inhalt einschließlich noch nicht gespeicherter Änderungen.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: In 100 % der erfolgreichen Vorbefüllvorgänge ist der übernommene Inhalt spätestens innerhalb von 1 Sekunde nach Abschluss der Aktion im Editor sichtbar.
- **SC-002**: Redakteure können den übernommenen Inhalt vor dem Speichern bearbeiten und speichern, ohne die Seite neu zu laden; dies gelingt in mindestens 95 % der getesteten Vorbefüllvorgänge.
- **SC-003**: In 100 % der Fälle mit fehlendem oder fehlerhaftem Ausgangsinhalt bleibt der zuletzt gültige Editorinhalt unverändert und der Redakteur erhält eine Rückmeldung.
- **SC-004**: Bestehende Artikelbearbeitung ohne Vorbefüllen zeigt in einer Regressionstestsuite keine Verschlechterung gegenüber dem bisherigen Verhalten.

## Assumptions

- Der bestehende Strapi-Mechanismus zum Vorbefüllen von Sprachversionen bleibt unverändert; diese Spezifikation betrifft die Aktualisierung der sichtbaren Editoransicht.
- Die normale explizite Speicherung des Artikels bleibt der einzige Weg, den übernommenen Inhalt dauerhaft zu speichern.
- Die bestehenden Berechtigungen und verfügbaren Sprachversionen gelten unverändert.
- Eine Warnung vor dem Überschreiben ungespeicherter Zieländerungen nutzt das bereits im Redaktionsbereich etablierte Verhalten.
- Die Definition von „innerhalb von 1 Sekunde“ beginnt mit dem erfolgreichen Abschluss des Vorbefüllvorgangs, nicht mit dem Beginn einer eventuell notwendigen Inhaltsübertragung.
