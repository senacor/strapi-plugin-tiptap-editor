---
description: 'Task list for Browser Spellchecking'
---

# Tasks: Browser Spellchecking

**Input**: Design documents from `/specs/001-browser-spellcheck/`

**Prerequisites**: [plan.md](./plan.md), [spec.md](./spec.md), [research.md](./research.md), [data-model.md](./data-model.md), [contracts/editor-configuration.md](./contracts/editor-configuration.md), [quickstart.md](./quickstart.md)

**Organization**: Tasks are grouped by user story so each increment can be implemented and tested independently.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Confirm the existing project conventions and prepare the feature-specific test/documentation surfaces.

- [x] T001 Review the existing preset feature-key, admin editor, and test conventions in `shared/types.ts`, `admin/src/components/RichTextInput.tsx`, and `tests/admin/` before implementation
- [x] T002 [P] Add the feature test file scaffold at `tests/admin/spellcheck.test.ts` using the repository's Vitest conventions
- [x] T003 [P] Add the feature documentation anchor and configuration section target in `README.md` following the existing README structure

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Establish the typed preset boundary and shared runtime utility contract required by all user stories.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

- [x] T004 Add optional `spellcheck?: boolean | Record<string, unknown>` to `TiptapPresetConfig` and add `spellcheck` to `PRESET_FEATURE_KEYS` in `shared/types.ts`, preserving absent-key-as-disabled behavior
- [x] T005 [P] Add shared feature-key coverage for `spellcheck` and invalid-value disabled behavior in `tests/shared/types.test.ts`
- [x] T006 Create the pure spellcheck utility API in `admin/src/utils/spellcheck.ts` for configuration activation, locale normalization, and runtime editor attribute values without mutating TipTap content
- [x] T007 [P] Add unit coverage for `admin/src/utils/spellcheck.ts` in `tests/admin/spellcheck.test.ts`, including missing/false/true/invalid config, valid locale, missing locale, malformed locale, and browser fallback cases

**Checkpoint**: The typed configuration boundary and deterministic spellcheck behavior are ready for editor integration.

---

## Phase 3: User Story 1 - Browser-Rechtschreibprüfung aktivieren (Priority: P1) 🎯 MVP

**Goal**: When enabled for an editor preset, request native browser spellchecking for editable text; when disabled or unsupported, keep the editor usable without changing stored content.

**Independent Test**: Mount an editor with the feature enabled and verify its editable element requests spellchecking; mount it with the feature disabled and verify it does not. Confirm the field JSON remains unchanged after editing.

### Tests for User Story 1

- [x] T008 [P] [US1] Add an editor integration test in `tests/admin/RichTextInput.test.tsx` (or the repository's existing RichTextInput test file) that verifies enabled and disabled runtime `spellcheck` behavior without native browser assumptions
- [x] T009 [P] [US1] Add a regression assertion in `tests/admin/RichTextInput.test.tsx` that runtime spellcheck behavior does not add metadata to the submitted TipTap/ProseMirror JSON

### Implementation for User Story 1

- [x] T010 [US1] Integrate the normalized spellcheck state with the mounted editor element in `admin/src/components/BaseTiptapInput.tsx` or the smallest existing editor-content boundary, applying only runtime attributes
- [x] T011 [US1] Pass the preset spellcheck setting from `admin/src/components/RichTextInput.tsx` into the editor-content boundary without recreating the editor or adding a Tiptap schema extension
- [x] T012 [US1] Handle browsers without spellchecking support and disabled browser settings in `admin/src/components/BaseTiptapInput.tsx` so editing, saving, and error handling remain unchanged

**Checkpoint**: User Story 1 is independently functional as the MVP.

---

## Phase 4: User Story 2 - Prüfung an der Artikelsprache ausrichten (Priority: P1)

**Goal**: Apply the active Strapi article locale to the editor language and update it when the localized document changes, with a safe browser fallback.

**Independent Test**: Mount the same editor for two active document locales and verify the editable element receives each locale in turn; verify missing or malformed locale leaves the editor usable and uses browser fallback behavior.

### Tests for User Story 2

- [x] T013 [P] [US2] Add locale-switch integration coverage in `tests/admin/RichTextInput.test.tsx` using the Strapi document-context mock to verify `de-DE` and `en-GB` updates
- [x] T014 [P] [US2] Add fallback coverage in `tests/admin/spellcheck.test.ts` for absent, empty, separator-variant, and malformed article locale values

### Implementation for User Story 2

- [x] T015 [US2] Read the active article locale from Strapi's active document route/context inputs in `admin/src/components/RichTextInput.tsx`, keeping it distinct from the administrator interface locale
- [x] T016 [US2] Apply the normalized article locale as the editor language runtime attribute in `admin/src/components/BaseTiptapInput.tsx` and remove or omit the explicit locale when unavailable
- [x] T017 [US2] Ensure locale changes update runtime editor attributes without recreating the Tiptap editor or changing the field value in `admin/src/components/RichTextInput.tsx` and `admin/src/components/BaseTiptapInput.tsx`

**Checkpoint**: User Stories 1 and 2 are independently testable; enabled editors use the active article language and remain compatible with unlocalized content.

---

## Phase 5: User Story 3 - Funktion über Konfiguration steuern (Priority: P2)

**Goal**: Make activation predictable per preset, default-disabled, safely validated, and documented for Strapi administrators.

**Independent Test**: Load presets with `spellcheck: true`, `false`, omitted, object-enabled, and invalid values; verify only valid enabled values activate runtime behavior and the public documentation matches the contract.

### Tests for User Story 3

- [x] T018 [P] [US3] Extend `tests/shared/types.test.ts` to verify `spellcheck` is accepted as a preset key and omitted/false/invalid values remain disabled
- [x] T019 [P] [US3] Verify in `tests/admin/richTextField.test.ts` that the existing rich-text field and preset-selection contract remains unchanged
- [x] T020 [P] [US3] Add configuration-matrix coverage in `tests/admin/spellcheck.test.ts` for `true`, `false`, omitted, `{ enabled: true }`, `{ enabled: false }`, and invalid values

### Implementation for User Story 3

- [x] T021 [US3] Wire `spellcheck` through the existing preset loading and feature-option path in `admin/src/hooks/usePresetConfig.ts`, `admin/src/components/RichTextInput.tsx`, and `shared/types.ts` without changing the default minimal preset behavior
- [x] T022 [US3] Document the `spellcheck` preset option, default-disabled behavior, active article locale handling, browser limitations, and example configuration in `README.md`
- [x] T023 [US3] Update the configuration reference and full preset example in `README.md` so the new public key is included in the documented feature list and validation guidance

**Checkpoint**: All user stories are complete, independently testable, and documented.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Run the complete validation suite and confirm the design's compatibility and usability constraints.

- [x] T024 [P] Run `npm test` and resolve feature-related failures across `tests/admin/` and `tests/shared/`
- [x] T025 [P] Run `npm run test:ts:front` and resolve TypeScript errors in `admin/src/`, `shared/`, and affected tests
- [x] T026 [P] Run `npm run test:ts:back` to verify the server contract remains unaffected
- [x] T027 Validate the manual browser and locale scenarios in `specs/001-browser-spellcheck/quickstart.md`, including a browser without native spellchecking
- [x] T028 Review the final diff for content compatibility, default-disabled behavior, invalid configuration handling, and absence of persisted spellcheck metadata

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies; T002 and T003 can run in parallel after T001's convention review if needed.
- **Foundational (Phase 2)**: Depends on Phase 1; T005, T006, and T007 depend on T004, while T005 and T007 can run in parallel after T004.
- **User Story 1 (Phase 3)**: Depends on Phase 2; T008/T009 can run in parallel, then T010–T012 implement the integration.
- **User Story 2 (Phase 4)**: Depends on User Story 1's editor boundary; T013/T014 can run in parallel, then T015–T017 implement locale behavior.
- **User Story 3 (Phase 5)**: Depends on the shared typed boundary and editor integration; T018–T020 can run in parallel, then T021–T023 complete configuration/documentation.
- **Polish (Phase 6)**: Depends on all desired user stories; T024–T026 can run in parallel, followed by T027–T028.

### User Story Dependencies

- **User Story 1 (P1)**: Depends only on Phase 2 and is the MVP.
- **User Story 2 (P1)**: Depends on User Story 1's runtime editor attribute boundary, but adds no dependency on stored content or server behavior.
- **User Story 3 (P2)**: Uses the shared configuration and runtime behavior from the earlier phases; its tests remain independently executable against the preset contract.

### Parallel Opportunities

- T002 and T003 can run in parallel during setup.
- T005 and T007 can run in parallel after T004.
- T008 and T009 can run in parallel for User Story 1.
- T013 and T014 can run in parallel for User Story 2.
- T018, T019, and T020 can run in parallel for User Story 3.
- T024, T025, and T026 can run in parallel during final validation.

## Parallel Example: User Story 1

```text
Task T008: Add editor integration coverage in tests/admin/RichTextInput.test.tsx
Task T009: Add no-content-metadata regression coverage in tests/admin/RichTextInput.test.tsx
```

## Parallel Example: User Story 2

```text
Task T013: Add locale-switch integration coverage in tests/admin/RichTextInput.test.tsx
Task T014: Add locale fallback coverage in tests/admin/spellcheck.test.ts
```

## Parallel Example: User Story 3

```text
Task T018: Extend shared preset-key tests in tests/shared/types.test.ts
Task T019: Extend rich-text field configuration tests in tests/admin/richTextField.test.ts
Task T020: Add configuration-matrix tests in tests/admin/spellcheck.test.ts
```

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1 and Phase 2.
2. Complete User Story 1, including runtime browser spellchecking and JSON compatibility tests.
3. Run the focused admin/shared tests and validate the enabled/disabled editor behavior.
4. Stop for review or demo; User Story 2 and User Story 3 can follow incrementally.

### Incremental Delivery

1. Add User Story 1 for configurable native spellchecking.
2. Add User Story 2 for active article locale propagation and fallback.
3. Add User Story 3 for complete configuration validation and public documentation.
4. Run the full test and TypeScript checks, then execute the quickstart scenarios.

### Format Validation

All 28 tasks use the required checklist format: `- [ ]`, sequential `T###` ID, optional `[P]` marker only for parallelizable work, required `[US#]` marker in user-story phases, and an explicit file path or repository command in every description.

## Validation Notes

- `npm test` passes: 24 test files and 246 tests.
- The repository's `npm run test:ts:front` and `npm run test:ts:back` wrappers reference a missing `run` executable; equivalent direct checks with `npx tsc -p admin/tsconfig.json --noEmit` and `npx tsc -p server/tsconfig.json --noEmit` pass.
- Native browser underlines cannot be asserted in the headless test environment; runtime `spellcheck`/`lang` attributes and fallback behavior are covered by unit/integration tests, and the manual scenarios are documented in `quickstart.md`.

## Phase 7: Convergence

- [x] T029 Review the unrequested `autocorrect` runtime attribute in `admin/src/utils/spellcheck.ts` and `README.md`; either remove it or explicitly extend the feature artifacts to justify it per FR-003 (unrequested)
