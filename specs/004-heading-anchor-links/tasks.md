# Tasks: Sprungmarken für Überschriften und Links

**Input**: `spec.md`, `plan.md`, `research.md`, `data-model.md`, `contracts/editor-content-and-links.md`

**Organization**: Aufgaben folgen den drei User Stories. Automatisierte Abdeckung ist wegen der Projektverfassung vorgesehen.

## Phase 1: Setup

- [X] T001 Verify repository ignore files and existing editor/test structure in `.gitignore`, `.prettierignore`, `.npmignore`, `admin/src/`, and `tests/admin/`.

## Phase 2: Foundational

- [X] T002 Implement shared validation, document scan, and collision cleanup for optional heading `attrs.id` in `admin/src/utils/headingAnchors.ts`: trim edges; empty removes ID; reject whitespace and leading `#`; compare IDs case-sensitively within one editor document; keep the first duplicate.

## Phase 3: User Story 1 — IDs an Überschriften

**Goal**: Redakteure können einer h1–h6-Überschrift eine eindeutige ID geben.

**Independent Test**: ID setzen, speichern und erneut öffnen; doppelte Eingabe wird abgelehnt.

- [X] T003 [US1] Add meaningful heading ID roundtrip and validation coverage in `tests/admin/headingAnchors.test.ts`.
- [X] T004 [US1] Add optional `id` parsing and HTML rendering to the existing heading node in `admin/src/extensions/Heading.tsx`.
- [X] T005 [US1] Add ID input with duplicate and invalid-value feedback to `admin/src/extensions/Heading.tsx`, render it from `admin/src/components/RichTextInput.tsx`, and add labels in `admin/src/translations/en.json`.
- [X] T006 [US1] Normalize pasted and externally loaded duplicate heading IDs while preserving text in `admin/src/utils/headingAnchors.ts` and `admin/src/utils/tiptapUtils.tsx`; show cleanup feedback in `admin/src/components/RichTextInput.tsx`.

## Phase 4: User Story 2 — Vorschläge im Link-Dialog

**Goal**: Vorhandene Sprungmarken als Linkziele auswählen.

**Independent Test**: Zwei IDs anlegen; Auswahl im Dialog setzt `#<id>` und bleibt nach Speichern erhalten.

- [X] T007 [US2] Add meaningful suggestion and fragment-link coverage in `tests/admin/headingAnchors.test.ts` and `tests/admin/LinkDialog.test.ts`.
- [X] T008 [US2] Collect current-document heading suggestions in `admin/src/extensions/Link.tsx`, pass them into `admin/src/components/LinkDialog.tsx`, and add labels in `admin/src/translations/en.json`.
- [X] T009 [US2] Preserve manual URL entry, link editing, and removal behavior in `admin/src/extensions/Link.tsx` and `admin/src/components/LinkDialog.tsx`.

## Phase 5: User Story 3 — Bestandsinhalte

**Goal**: Ältere Inhalte ohne IDs und gewöhnliche Links bleiben nutzbar.

**Independent Test**: Alten Inhalt öffnen und speichern; Heading-Text und Linkziele bleiben erhalten.

- [X] T010 [US3] Cover old JSON without IDs, external duplicate content, and ordinary links in `tests/admin/headingAnchors.test.ts` and `tests/admin/tiptapUtils.test.ts`.
- [X] T011 [US3] Document the optional JSON attribute, frontend heading renderer, and link workflow in `README.md`.

## Phase 6: Polish & Validation

- [X] T012 Run `npm test`, `npm run test:ts:front`, and `npm run test:ts:back`; compare behavior with `specs/004-heading-anchor-links/quickstart.md` and record remaining limits in `specs/004-heading-anchor-links/tasks.md`.

## Phase 7: UI und Übersetzungen

- [X] T013 [US1] Provide a dedicated heading-anchor toolbar icon and `admin/src/components/HeadingAnchorDialog.tsx` with field-level validation feedback.
- [X] T014 [US2] Make the anchor suggestion trigger fill the available width in `admin/src/components/LinkDialog.tsx`; the opened list uses at least the trigger width.
- [X] T015 Add German labels, hints, and errors in `admin/src/translations/de.json` with the same keys and interpolation placeholders as `en.json`.

## Phase 8: Konfigurierbare Sprungmarken

- [X] T016 Add optional boolean `heading.jumpLinks` to `shared/types.ts` and reject non-boolean values in `server/src/config/index.ts`.
- [X] T017 Show the heading anchor button and dialog only when the heading feature is enabled with `jumpLinks: true`; collect link suggestions only when the link feature is enabled too.
- [X] T018 Document the opt-in behavior and an enabled preset in `README.md` and `fixtures/all-features-preset.json`.
- [X] T019 Check the enabled and disabled `heading.jumpLinks` states and invalid configuration in a running Strapi-admin installation using `quickstart.md`.

## Dependencies & Execution Order

- T001 → T002 → T003–T006 → T007–T009 → T010–T011 → T012 → T013–T015 → T016–T018 → T019.
- Within a story, tests precede implementation. User Story 1 is the MVP. User Stories 2 and 3 build on the optional Heading-ID contract.
- Parallel opportunities: README work in T011 can proceed independently of link UI; test additions for distinct modules can be prepared in parallel after T002.

## Validation Notes

- `npm test`: 28 files, 269 tests passed on 2026-10-02 after the anchor dialog UI update.
- `npm run test:ts:front` and `npm run test:ts:back`: passed after replacing the unsupported `run -T` command with `tsc --noEmit` in `package.json`.
- `git diff --check`: passed.
- `npm run build`: admin and server bundles built without declaration errors on 2026-10-02.
- After the width correction, `npm run test:ts:front` and `npm run build` passed again on 2026-10-02. English and German translation keys and placeholders match.
- After adding `heading.jumpLinks`, `npm run build` completed without errors on 2026-10-02.
- The user reported a successful manual test in a running Strapi installation on 2026-10-03. No step-by-step test log was added to the repository.
- JSON and HTML output contract, paste collision handling, external value normalization, and link-dialog selection are covered by the recorded automated test run.
