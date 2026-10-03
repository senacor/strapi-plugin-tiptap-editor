# Feature Specification: Sprungmarken für Überschriften und Links

**Feature Branch**: `nicht festgelegt`

**Created**: 2026-10-01

**Status**: Implementiert; manuelle Prüfung im Strapi-Admin am 2026-10-03 erfolgreich gemeldet

**Updated**: 2026-10-03

**Input**: User description: "Für Überschriften (h1 - h6) sollen Sprungmarken definiert werden können. Hierfür soll pro Überschrift eine zusätzliche ID vergeben werden können. Die ID muss innerhalb des Editor-Contents eindeutig sein. Beim Einfügen von Links sollen die vorhandenen Sprungmarken aus dem Editor-Content als Vorschläge angezeigt werden. Die Verlinkung erfolgt mit `#<id>`."

**Ergänzung**: Die Sprungmarken-Bedienung wird je Preset mit `heading.jumpLinks: true` aktiviert. Die Option ist standardmäßig deaktiviert.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Sprungmarke an einer Überschrift festlegen (Priority: P1)

Als Redakteur möchte ich einer Überschrift der Ebenen h1 bis h6 eine optionale ID geben, damit Leser direkt zu dieser Stelle im Inhalt springen können.

**Why this priority**: Eine eindeutige Sprungmarke ist die Voraussetzung für einen funktionierenden internen Link.

**Independent Test**: Einer Überschrift eine gültige ID zuweisen, den Inhalt speichern und erneut öffnen; die ID bleibt erhalten und kennzeichnet die Überschrift im ausgegebenen Inhalt.

**Acceptance Scenarios**:

1. **Given** eine Überschrift ohne ID, **When** der Redakteur `einleitung` als ID eingibt und speichert, **Then** trägt genau diese Überschrift nach erneutem Öffnen die ID `einleitung`.
2. **Given** zwei Überschriften im selben Editor-Content, von denen eine die ID `einleitung` trägt, **When** der Redakteur der zweiten dieselbe ID zuweisen will, **Then** erhält er eine verständliche Fehlermeldung und die doppelte ID wird nicht übernommen.
3. **Given** eine Überschrift mit ID, **When** der Redakteur die ID entfernt, **Then** bleibt die Überschrift erhalten und hat keine Sprungmarke mehr.
4. **Given** der Cursor steht in einer Überschrift, **When** der Redakteur das Sprungmarken-Symbol betätigt, **Then** öffnet sich ein Dialog zum Setzen, Ändern oder Entfernen der ID; ungültige Eingaben werden am Eingabefeld erklärt.
5. **Given** `heading.jumpLinks` ist nicht aktiviert, **When** der Redakteur eine Überschrift bearbeitet, **Then** wird das Sprungmarken-Symbol nicht angezeigt und vorhandene IDs bleiben im Inhalt erhalten.

### User Story 2 - Vorhandene Sprungmarke beim Verlinken auswählen (Priority: P2)

Als Redakteur möchte ich beim Einfügen oder Bearbeiten eines Links die Sprungmarken des aktuellen Editor-Contents als Vorschläge sehen, damit ich die Ziel-ID nicht abtippen muss.

**Why this priority**: Die Auswahl vermeidet Tippfehler und macht vorhandene Ziele auffindbar.

**Independent Test**: Mindestens zwei Überschriften mit IDs anlegen, Text markieren, den Link-Dialog öffnen und eine vorgeschlagene Sprungmarke auswählen; der gespeicherte Link verweist auf `#<id>`.

**Acceptance Scenarios**:

1. **Given** Überschriften mit den IDs `einleitung` und `details`, **When** der Redakteur einen Link einfügt, **Then** werden beide Sprungmarken mit erkennbarer Überschrift und ID vorgeschlagen.
2. **Given** die vorgeschlagene Sprungmarke `details`, **When** der Redakteur sie auswählt und den Link speichert, **Then** lautet das Linkziel `#details`.
3. **Given** ein bestehender Link, **When** der Redakteur ihn bearbeitet, **Then** kann er eine andere vorhandene Sprungmarke auswählen und das Linkziel wird entsprechend aktualisiert.
4. **Given** eine neu angelegte, geänderte oder entfernte Sprungmarke, **When** der Redakteur den Link-Dialog anschließend öffnet, **Then** entsprechen die Vorschläge dem aktuellen Editor-Content.
5. **Given** der Link-Dialog zeigt Sprungmarken-Vorschläge, **When** der Redakteur das Auswahlfeld öffnet, **Then** nimmt dessen Auslöser die verfügbare Breite des Dialogfelds ein und die Liste ist mindestens ebenso breit.
6. **Given** `heading.jumpLinks` ist nicht aktiviert, **When** der Redakteur einen Link einfügt, **Then** werden keine Sprungmarken vorgeschlagen und ein manuelles `#id`-Ziel bleibt möglich.

### User Story 3 - Bestehende Inhalte weiterverwenden (Priority: P3)

Als Redakteur möchte ich bestehende Inhalte ohne Sprungmarken unverändert weiterbearbeiten und weiterhin normale Links eingeben können.

**Why this priority**: Die zusätzliche Funktion darf bisherige Inhalte und Link-Arbeitsabläufe nicht beeinträchtigen.

**Independent Test**: Einen bestehenden Inhalt ohne IDs öffnen, bearbeiten und speichern sowie einen normalen Link eingeben; Überschriften und Linkziel bleiben erhalten.

**Acceptance Scenarios**:

1. **Given** ein bestehender Inhalt mit Überschriften ohne IDs, **When** der Redakteur ihn lädt und speichert, **Then** bleiben die Überschriften und ihr Text erhalten; es werden keine IDs automatisch vergeben.
2. **Given** ein Link-Dialog ohne verfügbare Sprungmarken, **When** der Redakteur ein anderes Linkziel eingibt, **Then** kann er den Link wie bisher speichern.

### Edge Cases

- Eine leere ID bedeutet, dass die Überschrift keine Sprungmarke hat; mehrere Überschriften ohne ID sind zulässig.
- IDs sind innerhalb eines Editor-Contents exakt zu vergleichen; `Kapitel` und `kapitel` gelten als verschiedene IDs.
- Führende oder abschließende Leerzeichen werden vor der Prüfung entfernt. IDs mit Leerzeichen oder einem führenden `#` werden mit einer verständlichen Fehlermeldung abgelehnt.
- Beim Kopieren oder Einfügen einer Überschrift mit bereits vorhandener ID im selben Inhalt darf keine doppelte ID entstehen. Der Überschriftentext bleibt erhalten; die ID der eingefügten Kopie wird entfernt.
- Wenn ein bereits gespeicherter Inhalt doppelte IDs enthält, bleiben alle Überschriften und Texte sichtbar. Die erste ID bleibt erhalten; spätere gleiche IDs werden entfernt und die Bereinigung wird dem Redakteur kenntlich gemacht.
- Sprungmarken aus anderen Editor-Feldern oder anderen Inhalten erscheinen nicht als Vorschläge.
- Nach dem Entfernen oder Umbenennen einer ID ist sie kein Vorschlag mehr. Bereits gesetzte Links werden nicht automatisch umgeschrieben.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Bei aktiviertem `heading.jumpLinks` MUST Redakteure jeder Überschrift der Ebenen h1 bis h6 im aktuellen Editor-Content eine optionale ID zuweisen, ändern und diese wieder entfernen können.
- **FR-002**: Eine gesetzte ID MUST mit der zugehörigen Überschrift gespeichert, beim erneuten Öffnen angezeigt und im ausgegebenen Inhalt als Sprungziel verfügbar sein.
- **FR-003**: Jede nicht leere ID MUST innerhalb eines Editor-Contents eindeutig sein; die Eindeutigkeitsprüfung MUST beim Anlegen und Ändern einer ID greifen.
- **FR-004**: Eine vergebene ID MUST nach Entfernen führender und abschließender Leerzeichen nicht leer sein und darf keine Leerzeichen oder ein führendes `#` enthalten. Ein leeres Eingabefeld entfernt die ID; andere ungültige Eingaben MUST verständlich erklärt und dürfen nicht übernommen werden.
- **FR-005**: Beim Kopieren oder Einfügen einer Überschrift innerhalb desselben Editor-Contents MUST eine kollidierende ID an der eingefügten Kopie entfernt werden, ohne deren Text zu löschen.
- **FR-006**: Beim Öffnen bereits gespeicherter Inhalte mit doppelten IDs MUST die erste ID erhalten bleiben und spätere gleiche IDs entfernt werden. Alle Überschriften und Texte MUST erhalten bleiben und der Redakteur MUST über die Bereinigung informiert werden.
- **FR-007**: Bei aktiviertem `heading.jumpLinks` MUST beim Einfügen und Bearbeiten von Links die im aktuellen Editor-Content vorhandenen, gültigen und eindeutigen Sprungmarken als auswählbare Vorschläge mit Überschriftentext und ID erscheinen.
- **FR-008**: Die Vorschläge MUST beim Öffnen des Link-Dialogs den aktuellen Inhalt widerspiegeln; entfernte oder umbenannte IDs dürfen nicht weiter angeboten werden.
- **FR-009**: Die Auswahl einer Sprungmarke MUST das Linkziel im Format `#<id>` setzen; der Link MUST nach Speichern und erneutem Öffnen auf dieselbe ID verweisen.
- **FR-010**: Die bisherige manuelle Eingabe anderer Linkziele MUST weiterhin möglich sein.
- **FR-011**: Beim Entfernen oder Umbenennen einer Sprungmarke MUST bereits gesetzte Links unverändert bleiben.
- **FR-012**: Vorhandene Überschriften ohne ID MUST ohne automatische ID-Vergabe bearbeitbar und speicherbar bleiben.
- **FR-013**: Bei aktiviertem `heading.jumpLinks` MUST die Sprungmarken-ID über ein eigenes Symbol in der Überschriften-Werkzeugleiste in einem Dialog bearbeitbar sein; Validierungsfehler MUST am Eingabefeld erscheinen.
- **FR-014**: Das Auswahlfeld für Sprungmarken im Link-Dialog MUST die verfügbare Feldbreite nutzen; die aufgeklappte Liste MUST mindestens die Breite des Auslösers haben.
- **FR-015**: Beschriftungen, Hinweise und Fehlermeldungen dieser Funktion MUST für Englisch und Deutsch hinterlegt sein und der Strapi-Spracheinstellung folgen.
- **FR-016**: Presets MUST `heading.jumpLinks` als boolesche Option akzeptieren. Nur der Wert `true` bei aktivierter Heading-Funktion MUST das Sprungmarken-Symbol und, bei aktivierter Link-Funktion, die Vorschläge im Link-Dialog aktivieren. Bei fehlender Option oder `false` MUST beides verborgen bleiben, ohne vorhandene IDs aus dem Inhalt zu entfernen oder manuelle Fragmentlinks zu sperren.
- **FR-017**: Die Konfigurationsvalidierung MUST Werte für `heading.jumpLinks` ablehnen, die keine booleschen Werte sind.

### Key Entities *(include if feature involves data)*

- **Editor-Content**: Der einzelne bearbeitete Inhalt; bildet den Geltungsbereich für eindeutige IDs und Linkvorschläge.
- **Überschrift**: Inhaltselement der Ebene h1 bis h6 mit Text und optionaler Sprungmarken-ID.
- **Sprungmarke**: Eindeutige, nicht leere ID einer Überschrift; Ziel eines internen Links.
- **Link**: Verknüpfung im Inhalt mit einem Ziel, das bei einer ausgewählten Sprungmarke `#<id>` lautet.

## Success Criteria *(mandatory)*

### Measurable Outcomes

Die Erfolgskriterien für das Setzen von IDs und die Vorschlagsauswahl gelten für Presets mit `heading.jumpLinks: true`.

- **SC-001**: Redakteure können in einem Inhalt mit 20 Überschriften einer Überschrift innerhalb von 30 Sekunden eine eindeutige Sprungmarke zuweisen und wiederfinden.
- **SC-002**: In 100 % der geprüften Eingaben und Kopierfälle wird verhindert, dass zwei Überschriften desselben Inhalts mit derselben nicht leeren ID gespeichert werden.
- **SC-003**: In 100 % der geprüften Fälle erzeugt die Auswahl eines Vorschlags das Linkziel `#<id>` und der Link führt im ausgegebenen Inhalt zur zugehörigen Überschrift.
- **SC-004**: Mindestens 90 % der Redakteure können in einem Inhalt mit 20 Sprungmarken ohne Anleitung innerhalb von 30 Sekunden einen Link zu einer vorhandenen Sprungmarke einfügen.
- **SC-005**: In 100 % der geprüften Bestandsinhalte ohne IDs bleiben Überschriften und bestehende Links nach Öffnen und Speichern erhalten.

## Assumptions

- Sprungmarken werden nur für Überschriften der Ebenen h1 bis h6 vergeben; andere Inhaltselemente sind keine Ziele dieser Funktion.
- IDs werden von Redakteuren bewusst vergeben und nicht aus Überschriftentexten erzeugt.
- Eindeutigkeit und Vorschläge gelten je Editor-Content, auch wenn mehrere Editor-Felder auf derselben Seite angezeigt werden.
- Die Eindeutigkeit berücksichtigt die Schreibweise exakt. Das Format `#<id>` bezieht sich auf die gespeicherte ID ohne zusätzliche Umformung.
- Beim Entfernen oder Umbenennen einer ID bleiben vorhandene Links unverändert, da sie auch bewusst manuell gesetzt worden sein können.
- Die bestehende Link-Eingabe bleibt für externe und andere manuelle Ziele nutzbar.
- `heading.jumpLinks` ist standardmäßig deaktiviert und setzt eine aktivierte Heading-Funktion voraus.
