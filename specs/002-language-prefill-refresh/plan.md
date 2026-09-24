# Implementation Plan: Immediate Language Prefill Refresh

**Branch**: `002-language-prefill-refresh` | **Date**: 2026-09-24 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/002-language-prefill-refresh/spec.md`

## Summary

When Strapi pre-fills a localized article, the field value changes after the editor has already been created. The editor currently reads the field value only during initialization, so the new content is visible only after a save/reload cycle. The implementation will synchronize later external field-value changes into the existing TipTap editor, compare parsed document values before replacing content, and suppress the editor update event for this synchronization so pre-filling does not trigger an additional save.

## Technical Context

**Language/Version**: TypeScript 5.9, React 18

**Primary Dependencies**: `@tiptap/core` / `@tiptap/react` 3.30/3.20, `@strapi/strapi` 5.39, Vitest 4.1

**Storage**: Strapi admin form state; no new storage or server persistence

**Testing**: Vitest (`npm test`), frontend TypeScript check (`npm run test:ts:front`)

**Target Platform**: Strapi v5 admin panel in supported desktop browsers

**Project Type**: Strapi admin plugin with a React/Tiptap editor

**Performance Goals**: A successful external field update is reflected in the editor within 1 second; synchronization must not cause an update loop or unnecessary document replacement.

**Constraints**: Preserve existing initial content parsing, TipTap JSON compatibility, user editing behavior, and explicit-save semantics. Invalid external content must not replace the current editor document.

**Scale/Scope**: One shared editor hook used by the rich-text input and all configured editor presets; no server, schema, or public configuration changes.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **I. Strapi Plugin Contract First**: PASS — no public field name, configuration key, route, export, or stored-content format changes.
- **II. Editor Content Compatibility**: PASS — content remains TipTap/ProseMirror JSON and is applied through the existing editor schema; invalid content is rejected without replacing the current document.
- **III. Verified Behavior**: PASS — add focused hook tests for external synchronization, no-op behavior, update suppression, and invalid content; run the required frontend check and test suite.
- **IV. Secure, Validated Configuration**: PASS — no new external input surface; external field content is parsed and validated by the existing editor content path.
- **V. Focused, Configurable Extensions**: PASS — the change is isolated to the shared editor synchronization behavior and does not add dependencies or configuration.

No constitution violations require an exception.

## Project Structure

### Documentation (this feature)

```text
specs/002-language-prefill-refresh/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── editor-content-sync.md
└── tasks.md
```

### Source Code (repository root)

```text
admin/src/
├── components/
│   ├── RichTextInput.tsx       # Existing entry point; behavior remains compatible
│   └── BaseTiptapInput.tsx      # Existing presentation layer; unchanged
└── utils/
    └── tiptapUtils.tsx          # External field-to-editor synchronization

tests/admin/
└── tiptapUtils.test.tsx         # Hook/content synchronization coverage
```

**Structure Decision**: Keep the existing single-package admin plugin structure. The shared `useTiptapEditor` hook is the narrowest integration point because both initial loading and the rendered rich-text input use it; no server code or new UI component is required.

## Phase 0: Research

Research confirmed the following before design:

1. `useTiptapEditor` passes `field.value` to `useEditor({ content })` only during editor creation and currently has no effect that observes later field changes.
2. TipTap's `setContent` command accepts JSON content and an `emitUpdate` option. Setting `emitUpdate: false` prevents the synchronization itself from invoking the existing `onUpdate` callback and therefore avoids a redundant field change/save cycle.
3. The existing `parseJSONContent` fallback turns malformed content into a visible diagnostic document. For an external update, replacing the current document with that diagnostic fallback would be destructive, so external synchronization must validate/parse separately and leave the current document unchanged when parsing fails.

## Phase 1: Design

### Data model

The feature does not add persisted entities. It formalizes the runtime relationship between Strapi form state and the editor document in `data-model.md`.

### Interface contract

The editor exposes a user-visible synchronization contract rather than a server API. It is documented in `contracts/editor-content-sync.md`, including update timing, no-save behavior, invalid-content handling, and regression behavior.

### Validation guide

`quickstart.md` documents focused tests and the required project-wide validation commands, with expected outcomes for successful prefill, invalid content, no-op updates, and ordinary editing.

## Phase 1 Constitution Re-check

- **Contract preservation**: PASS — no external API or persisted representation changes.
- **Content compatibility**: PASS — only valid content accepted by the existing editor schema is applied; synchronization uses update suppression.
- **Verification**: PASS — focused tests and required frontend/type validation are defined.
- **Scope and maintainability**: PASS — one existing hook and one focused test file; no new dependency or abstraction beyond a small parsing/synchronization helper if needed.

## Complexity Tracking

No violations or additional complexity require justification.
