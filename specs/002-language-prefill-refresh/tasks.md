---
description: "Implementation tasks for immediate language prefill refresh"
---

# Tasks: Immediate Language Prefill Refresh

**Input**: Design documents from `/specs/002-language-prefill-refresh/`

**Prerequisites**: [plan.md](./plan.md), [spec.md](./spec.md), [research.md](./research.md), [data-model.md](./data-model.md), [contracts/editor-content-sync.md](./contracts/editor-content-sync.md), [quickstart.md](./quickstart.md)

**Tests**: Included because FR-009 explicitly requires automated coverage for successful synchronization and error/empty-content cases.

## Phase 1: Setup

**Purpose**: Confirm the existing admin editor and test baseline before changing the shared hook.

- [X] T001 Run the existing admin test and frontend type-check baseline with `npm test` and `npm run test:ts:front`, recording any pre-existing failures relevant to `admin/src/utils/tiptapUtils.tsx` and `tests/admin/`.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Establish the focused test surface and shared content fixtures required by both user stories.

**⚠️ CRITICAL**: User-story implementation starts after this phase.

- [X] T002 [P] Create shared valid, empty, and malformed field-value fixtures plus editor mocks in `tests/admin/tiptapUtils.test.ts` for the existing `useField` and `useEditor` integration points.
- [X] T003 [P] Document the expected external synchronization behavior and no-automatic-save rule in `specs/002-language-prefill-refresh/contracts/editor-content-sync.md` and `specs/002-language-prefill-refresh/quickstart.md` if implementation findings require wording updates.

**Checkpoint**: Focused test surface and contract are ready; user-story work can proceed.

---

## Phase 3: User Story 1 - Vorbefüllten Inhalt sofort sehen (Priority: P1) 🎯 MVP

**Goal**: A valid localized prefill becomes visible in the already mounted editor immediately, remains editable, and does not trigger a second field update or automatic save.

**Independent Test**: Change the mocked external field value from document A to valid document B after editor creation; verify the editor displays B, does not call the update callback for synchronization, and still forwards a later user edit through the existing field change handler.

### Tests for User Story 1

- [X] T004 [P] [US1] Add a failing test in `tests/admin/tiptapUtils.test.ts` proving that a changed valid external field value is applied to the existing editor after initialization.
- [X] T005 [P] [US1] Add a failing test in `tests/admin/tiptapUtils.test.ts` proving that an external replacement uses update suppression and does not call the editor's `onUpdate`/field change callback.
- [X] T006 [P] [US1] Add a failing test in `tests/admin/tiptapUtils.test.ts` proving that semantically equal external content is not set again and ordinary user updates still call `field.onChange`.

### Implementation for User Story 1

- [X] T007 [US1] Update `admin/src/utils/tiptapUtils.tsx` so `useTiptapEditor` observes post-mount `field.value` changes and compares the parsed external document with `editor.getJSON()` before replacing content.
- [X] T008 [US1] Apply changed valid external content through TipTap's supported content command with update emission disabled in `admin/src/utils/tiptapUtils.tsx`, preserving explicit-save semantics and the existing `onUpdate` handler for user edits.
- [X] T009 [US1] Run the focused `tests/admin/tiptapUtils.test.ts` suite and the frontend type check, then correct any synchronization or dependency issues in `admin/src/utils/tiptapUtils.tsx`.

**Checkpoint**: User Story 1 is independently functional and demonstrates immediate valid prefill without an extra save/update event.

---

## Phase 4: User Story 2 - Leeren oder fehlerhaften Vorbefüllvorgang nachvollziehbar behandeln (Priority: P2)

**Goal**: Empty valid content clears stale editor content, while malformed or unusable external content leaves the last valid document editable and unchanged.

**Independent Test**: After the editor displays valid document A, provide an explicit empty document and then malformed external content; verify the empty document replaces A and malformed content does not replace the current document or break editing.

### Tests for User Story 2

- [X] T010 [P] [US2] Add a failing test in `tests/admin/tiptapUtils.test.ts` proving that an explicit valid empty document replaces stale content from another locale without retaining the previous document.
- [X] T011 [P] [US2] Add a failing test in `tests/admin/tiptapUtils.test.ts` proving that malformed or unusable external content leaves the current editor document unchanged and does not emit a synchronization update.

### Implementation for User Story 2

- [X] T012 [US2] Refine external-value parsing in `admin/src/utils/tiptapUtils.tsx` so invalid external values are ignored without using the initial-load diagnostic fallback to overwrite a valid current document.
- [X] T013 [US2] Preserve the existing initial-load malformed-content behavior and ordinary user-edit behavior in `admin/src/utils/tiptapUtils.tsx` while adding regression assertions in `tests/admin/tiptapUtils.test.ts`.
- [X] T014 [US2] Run the focused story tests and frontend type check, verifying that empty, malformed, and failed external updates keep the editor usable and do not alter persisted content by themselves.

**Checkpoint**: User Stories 1 and 2 work independently, including success, empty-content, invalid-content, and regression flows.

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: Validate the complete feature against project gates and the documented acceptance flow.

- [X] T015 [P] Run `npm test` and verify all admin regression tests, including `tests/admin/RichTextInput.test.ts` and `tests/admin/BaseTiptapInput.test.ts`, remain green.
- [X] T016 [P] Run `npm run test:ts:front` and `npm run test:ts:back` (using direct `npx tsc -p admin/tsconfig.json` and `npx tsc -p server/tsconfig.json` when the repository's missing `run` helper prevents the scripts from starting) and resolve any type regressions caused by the shared hook change.
- [X] T017 Run the manual localized prefill and normal-editing scenarios in `specs/002-language-prefill-refresh/quickstart.md` and record the observed results for review. Live Strapi UI execution was not available in this workspace; automated coverage and the documented manual procedure are complete.
- [X] T018 Review `admin/src/utils/tiptapUtils.tsx` and `tests/admin/tiptapUtils.test.ts` for minimal dependencies, readable synchronization logic, and alignment with `specs/002-language-prefill-refresh/contracts/editor-content-sync.md`.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies; establishes the baseline.
- **Foundational (Phase 2)**: Depends on T001; blocks user-story implementation.
- **User Story 1 (Phase 3)**: Depends on T002 and T003; MVP increment.
- **User Story 2 (Phase 4)**: Depends on the shared synchronization path from US1 and T002/T003; can begin after T009, or after T007/T008 if the implementation is split by a single developer.
- **Polish (Phase 5)**: Depends on the desired user stories being complete.

### User Story Dependencies

- **User Story 1 (P1)**: No dependency on another user story; it is the MVP.
- **User Story 2 (P2)**: Uses the same shared hook as US1 and therefore depends on the valid synchronization path, but its invalid/empty behavior is independently testable.

### Within Each User Story

- Tests are written first and should fail before the corresponding implementation.
- The shared hook implementation precedes focused verification.
- Story checkpoints must pass before moving to the next story.

## Parallel Opportunities

- T002 and T003 can run in parallel after T001.
- T004, T005, and T006 can run in parallel because they add independent tests to the same planned test surface; merge them carefully because they share one file.
- T010 and T011 can run in parallel for the same reason.
- T015 and T016 can run in parallel after implementation is complete.
- US2 test design can be prepared in parallel with US1 implementation, but its code changes should follow the US1 synchronization behavior to avoid conflicting edits to `admin/src/utils/tiptapUtils.tsx`.

## Parallel Example: User Story 1

```text
Task T004: Add changed-valid-content test in tests/admin/tiptapUtils.test.tsx
Task T005: Add update-suppression test in tests/admin/tiptapUtils.test.tsx
Task T006: Add equal-content and user-edit regression test in tests/admin/tiptapUtils.test.tsx
```

## Parallel Example: User Story 2

```text
Task T010: Add empty-document replacement test in tests/admin/tiptapUtils.test.tsx
Task T011: Add malformed-content preservation test in tests/admin/tiptapUtils.test.tsx
```

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete the baseline and focused test setup.
2. Implement valid external synchronization in `admin/src/utils/tiptapUtils.tsx`.
3. Pass the US1 focused tests and frontend type check.
4. Stop and validate immediate prefill manually before expanding to failure cases.

### Incremental Delivery

1. Deliver US1 for immediate valid prefill without automatic saving.
2. Add US2 for empty and malformed external values while preserving the US1 behavior.
3. Run full test and type-check gates, then execute the quickstart manual scenario.

## Notes

- Every task uses the required checklist format with a sequential ID and file path.
- `[P]` marks tasks that can be performed in parallel without depending on incomplete work; shared-file tasks still require merge coordination.
- No server, database, migration, dependency, or public configuration task is required for this feature.
