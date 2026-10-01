# Tasks: SEO Tag Configuration

**Input**: Design documents from `specs/003-seo-tag-configuration/`

**Prerequisites**: `plan.md`, `spec.md`, `research.md`, `data-model.md`, `contracts/editor-configuration.md`, `quickstart.md`

**Tests**: Included because functional requirement FR-009 explicitly requires automated coverage.

**Organization**: Tasks are grouped by user story. User Story 1 delivers the opt-in behavior; User Story 2 protects existing heading content.

## Phase 1: Setup

**Purpose**: No project initialization is required; this feature uses the existing admin, shared configuration, server validation, and Vitest setup.

## Phase 2: Foundational

**Purpose**: No independent foundational changes are required. All work is scoped to the user stories below.

---

## Phase 3: User Story 1 - SEO-Tag nur bei Aktivierung anzeigen (Priority: P1) 🎯 MVP

**Goal**: Let each editor preset explicitly enable the SEO tag selector; hide it when omitted, false, or invalid.

**Independent Test**: Open fields assigned presets with `heading: true` and `heading: { seoTag: true }`; the heading style selector appears in both, while the SEO tag selector appears only for the latter. Confirm invalid `seoTag` values are rejected by configuration validation.

### Tests for User Story 1

- [X] T001 [P] [US1] Add RichTextInput coverage for hidden selector with omitted/false `heading.seoTag` and visible selector with `heading.seoTag: true` in `tests/admin/RichTextInput.test.ts`.
- [X] T002 [P] [US1] Add server configuration validation coverage accepting boolean `heading.seoTag` and rejecting non-boolean values in `tests/server/config.test.ts`.

### Implementation for User Story 1

- [X] T003 [US1] Add optional boolean `seoTag` to `HeadingConfig` in `shared/types.ts`.
- [X] T004 [US1] Validate that configured `heading.seoTag` values are booleans in `server/src/config/index.ts`.
- [X] T005 [US1] Render the heading style selector independently and render the SEO tag selector only when `config.heading.seoTag === true` in `admin/src/components/RichTextInput.tsx`.
- [X] T006 [US1] Update the available heading extension description and examples to document `heading.seoTag` opt-in and hidden-by-default behavior in `README.md`.

**Checkpoint**: Presets with explicit `heading.seoTag: true` show the selector; all other values keep it hidden while heading style controls follow the existing `heading` setting.

---

## Phase 4: User Story 2 - Bestehende Inhalte ohne SEO-Tag-Steuerelement weiterverwenden (Priority: P2)

**Goal**: Preserve heading content and semantic tags when the selector is hidden.

**Independent Test**: Load a heading carrying a non-default semantic tag under a preset without `seoTag: true`, make a normal content edit, and save; verify the heading text and semantic tag remain unchanged.

### Tests for User Story 2

- [X] T007 [P] [US2] Add a regression test proving a heading's existing semantic tag remains in serialized editor content when the SEO tag selector is hidden in `tests/admin/buildExtensions.test.ts`.

### Implementation for User Story 2

- [X] T008 [US2] Ensure selector visibility does not alter heading extension attributes, default tag assignment, or serialization; adjust `admin/src/extensions/Heading.tsx` only if the regression test exposes a change in behavior.

**Checkpoint**: Existing heading JSON and semantic tags survive normal editing and saving when the selector is hidden.

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: Complete compatibility and release documentation.

- [X] T009 Update the migration guidance and compatibility note for existing presets that relied on the always-visible selector in `README.md` and `changelog.md`.
- [X] T010 Run the focused admin and server tests plus the project test and type-check commands documented in `specs/003-seo-tag-configuration/quickstart.md`.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No setup tasks; the repository already has the required tooling.
- **Foundational (Phase 2)**: No separate work; no prerequisites block story work.
- **User Story 1 (Phase 3)**: Can begin immediately. Configuration typing and validation precede the UI consuming the option; tests should be written first.
- **User Story 2 (Phase 4)**: Depends on User Story 1's selector visibility behavior; verifies compatibility with saved heading content.
- **Polish (Phase 5)**: Depends on both stories so release notes reflect the final behavior; validation runs after implementation.

### User Story Dependencies

- **User Story 1 (P1)**: No dependency on other stories; it is the MVP.
- **User Story 2 (P2)**: Depends on User Story 1 because it tests stored content with the new selector hidden.

### Within Each User Story

- Write tests first and confirm they fail for the intended missing behavior.
- For User Story 1, complete config types and validation before wiring the admin UI to the option.
- For User Story 2, first verify current content handling; modify heading behavior only if the test finds a regression.
- Complete story acceptance checks before moving to the next phase.

### Parallel Opportunities

- T001 and T002 can run in parallel because they modify separate test files.
- T003 and T004 can run in parallel after T001 and T002 are in place because they modify separate source files.
- T006 can run in parallel with the core User Story 1 implementation after the option semantics are settled.
- T007 can run alongside T009 after User Story 1 is complete, since they touch separate files.

---

## Parallel Example: User Story 1

```text
Task: T001 RichTextInput visibility coverage in tests/admin/RichTextInput.test.tsx
Task: T002 nested option validation coverage in tests/server/config.test.ts
```

After tests are in place:

```text
Task: T003 HeadingConfig typing in shared/types.ts
Task: T004 Nested option validation in server/src/config/index.ts
Task: T006 Configuration docs in README.md
```

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Add and run the visibility and configuration validation tests.
2. Add the typed option and validation, then wire the toolbar visibility.
3. Update the README with the opt-in configuration.
4. Validate User Story 1 independently; `heading.seoTag: true` must show the selector while omitted/false values hide it.

### Incremental Delivery

1. Complete User Story 1 and validate opt-in behavior.
2. Complete User Story 2 and verify saved semantic tags remain intact.
3. Update compatibility notes and run the documented project checks.

## Notes

- Every task uses the required checkbox, sequential ID, optional parallel marker, story label where applicable, and exact file path.
- No database migration or content transformation is required.
- Release versioning must follow the project's compatibility policy because the default toolbar behavior changes.
- All 25 test files (255 tests) and both direct admin/server TypeScript checks pass after reinstalling dependencies with the Tiptap core version aligned to the declared project version.
