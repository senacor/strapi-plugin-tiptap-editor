# Implementation Plan: Browser Spellchecking

**Branch**: `001-browser-spellcheck` | **Date**: 2026-09-23 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/001-browser-spellcheck/spec.md`

## Summary

Die TipTap-Editorinstanzen erhalten eine optionale `spellcheck`-Preset-Konfiguration. Ist sie aktiviert, wird die native Browser-Rechtschreibprüfung für den editierbaren Editorbereich angefordert. Das `lang`-Attribut wird aus der Sprache des aktuell bearbeiteten Strapi-Dokuments abgeleitet und bei einem Wechsel der Sprachversion aktualisiert. Fehlende, ungültige oder nicht unterstützte Werte führen zu einem sicheren deaktivierten bzw. fallenden Verhalten; der gespeicherte TipTap/ProseMirror-Inhalt bleibt unverändert.

## Technical Context

**Language/Version**: TypeScript 5.9, React 18.3

**Primary Dependencies**: Strapi v5 Admin APIs, Tiptap 3.20, existing preset/configuration utilities, native browser `spellcheck` and `lang` behavior

**Storage**: N/A; runtime-only editor attributes, no persisted document changes

**Testing**: Vitest, existing admin unit tests, TypeScript checks via `npm run test:ts:front` and `npm run test:ts:back`

**Target Platform**: Strapi v5 Admin in browsers with or without native spellchecking support

**Project Type**: Strapi admin plugin / reusable rich-text editor field

**Performance Goals**: Locale or configuration changes must update the editor attribute without recreating the editor or causing visible typing latency.

**Constraints**: No new runtime dependency; default remains disabled; invalid configuration must not enable the feature; content JSON and server contracts remain compatible.

**Scale/Scope**: All instances of the existing rich-text custom field using a preset; one locale for the whole active editor document; browser support remains user-agent dependent.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **I. Strapi Plugin Contract First**: PASS — adds an optional preset key and preserves existing field, route, export, and stored-content contracts.
- **II. Editor Content Compatibility**: PASS — only runtime editor DOM behavior changes; no schema, mark, node, or serialized JSON changes.
- **III. Verified Behavior**: PASS — plan includes focused tests for configuration, locale derivation, DOM attributes, fallback behavior, and documentation/config contract.
- **IV. Secure, Validated Configuration**: PASS — the new option is validated through the existing preset feature-value rules and only a boolean-enabled value can activate behavior.
- **V. Focused, Configurable Extensions**: PASS — browser spellchecking is a narrowly scoped configurable editor capability using existing preset conventions.
- **Compatibility & Distribution Constraints**: PASS — no dependency or peer range changes; implementation remains within the admin package.

**Gate status**: PASS. No violations require justification.

## Project Structure

### Documentation (this feature)

```text
specs/001-browser-spellcheck/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/editor-configuration.md
└── tasks.md             # Created by $speckit-tasks, not this command
```

### Source Code (repository root)

```text
admin/src/components/RichTextInput.tsx   # pass active locale/config into editor behavior
admin/src/utils/buildExtensions.ts       # keep extension construction content-only
admin/src/utils/spellcheck.ts            # validate option and derive/apply runtime attributes
shared/types.ts                           # add typed preset option and feature key
README.md                                 # public configuration and locale behavior
tests/admin/RichTextInput.test.tsx        # editor integration behavior
tests/admin/spellcheck.test.ts            # pure configuration/locale/attribute behavior
tests/shared/types.test.ts                # preset feature typing/validation behavior
```

**Structure Decision**: Use the existing admin/shared/test layout. The feature is an admin-only runtime behavior, so no server code, migration, new editor extension, or persisted entity is needed. A small pure utility isolates configuration normalization and DOM attribute application for deterministic tests.

## Complexity Tracking

No constitutional violations.

## Phase 0 Research Summary

Research decisions are recorded in [research.md](./research.md). The key decisions are:

- model spellchecking as a preset-level boolean feature, with absent/invalid values disabled;
- apply native browser behavior through the editor's editable DOM element rather than a Tiptap content extension;
- derive the active locale from Strapi's document context and normalize it to a browser language tag;
- use the browser/DOM default when the active locale is unavailable or invalid.

## Phase 1 Design Summary

- [data-model.md](./data-model.md) describes the runtime-only configuration and locale state.
- [contracts/editor-configuration.md](./contracts/editor-configuration.md) defines the public preset and editor behavior contract.
- [quickstart.md](./quickstart.md) defines end-to-end validation scenarios and required checks.

## Constitution Check — Post-Design

- **Content compatibility**: PASS — no stored schema or serialized content changes are introduced.
- **Configuration safety**: PASS — the option uses existing typed feature validation and defaults to disabled.
- **Verification**: PASS — design includes pure utility tests, editor integration tests, type checks, and manual browser validation.
- **Documentation**: PASS — the public preset key and behavior are documented in the README as part of implementation tasks.

**Final gate status**: PASS.
