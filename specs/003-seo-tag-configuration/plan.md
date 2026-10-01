# Implementation Plan: SEO Tag Configuration

**Branch**: `003-seo-tag-configuration` | **Date**: 2026-10-01 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `specs/003-seo-tag-configuration/spec.md`

## Summary

Add a per-preset `heading.seoTag` option that controls whether the SEO tag selector appears. The selector will be hidden unless the option is explicitly `true`; heading style editing and stored heading attributes remain available and unchanged. Document the option and its default in the README, and cover enabled, omitted, invalid, and content-preservation behavior with focused admin and configuration validation tests.

## Technical Context

**Language/Version**: TypeScript 5.9.3; React 18.3.1

**Primary Dependencies**: Strapi 5.39.0, Tiptap 3.20.1, `@strapi/design-system` 2.2.0

**Storage**: No new storage; existing TipTap/ProseMirror JSON remains the content format.

**Testing**: Vitest 4.1.11; project scripts `npm test`, `npm run test:ts:front`, `npm run test:ts:back` (repository package manager is Yarn).

**Target Platform**: Strapi v5 admin plugin.

**Project Type**: Strapi plugin with separate `admin/`, `server/`, and shared configuration types.

**Performance Goals**: No additional runtime work beyond a per-render configuration check; no measurable editor startup regression.

**Constraints**: Preserve heading schema and saved content; follow preset feature conventions; reject or safely disable invalid nested option values; update public configuration docs for the default change.

**Scale/Scope**: One optional boolean nested under the existing `heading` preset option; affects the heading toolbar only.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Strapi Plugin Contract First**: Pass with compatibility note. This intentionally changes the default visibility of a public editor control. The new option and opt-in migration guidance must be documented; release versioning must follow the repository's breaking-change policy.
- **Editor Content Compatibility**: Pass. No heading attributes, schema, serialized content, or rendering behavior are changed.
- **Verified Behavior**: Pass. Focused automated coverage is planned for omitted/false, true, invalid input, and preservation of existing attributes.
- **Secure, Validated Configuration**: Pass. `seoTag` is a boolean option; invalid values must not turn the control on and must be rejected or handled consistently with configuration validation.
- **Focused, Configurable Extensions**: Pass. The control is configured within the existing heading preset and introduces no dependency or unrelated abstraction.

## Project Structure

### Documentation (this feature)

```text
specs/003-seo-tag-configuration/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── editor-configuration.md
└── tasks.md
```

### Source Code (repository root)

```text
admin/src/components/RichTextInput.tsx    # Conditional rendering of the SEO tag selector
admin/src/extensions/Heading.tsx          # Existing selector and heading behavior
shared/types.ts                           # Public preset option type
server/src/config/index.ts                # Nested option validation
tests/admin/                               # Preset and heading behavior coverage
tests/server/                              # Configuration validation coverage, if needed
README.md                                  # Public configuration reference and migration guidance
```

**Structure Decision**: Keep the change in the existing Strapi plugin packages. The shared preset type describes the new nested option, the admin consumes it, and server configuration validation enforces its boolean shape. No new runtime package or persisted entity is needed.

## Complexity Tracking

No constitution violations or additional architectural complexity.
