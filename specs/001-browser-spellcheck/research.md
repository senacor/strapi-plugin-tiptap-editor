# Research: Browser Spellchecking

## Decision 1: Use the existing preset configuration model

- **Decision**: Add `spellcheck` as an optional preset feature value, accepting the same boolean/object shape used by the existing feature configuration. Only an explicit enabled boolean activates the behavior; absent, `false`, and invalid values remain disabled.
- **Rationale**: Presets are the established public configuration boundary for editor behavior. This keeps the option scoped per field/preset, preserves backward compatibility, and reuses existing validation and feature-value semantics.
- **Alternatives considered**: A plugin-global option would not allow different fields to have different editorial requirements. A Content-Type Builder-only field option would duplicate the existing preset model and require a separate configuration path.

## Decision 2: Use native browser spellchecking on the editable editor element

- **Decision**: Set the editable element's runtime `spellcheck` state and `lang` attribute; do not add a Tiptap node, mark, extension, or serialized attribute.
- **Rationale**: Browser spellchecking is a user-agent behavior exposed by the editable DOM surface. Runtime attributes satisfy the user-visible requirement while preserving TipTap/ProseMirror JSON compatibility and avoiding new dependencies.
- **Alternatives considered**: A custom Tiptap extension would add schema/runtime complexity without providing a dictionary or checking engine. A third-party spellchecking package would add a dependency and duplicate browser functionality.

## Decision 3: Read the active locale from Strapi's document context

- **Decision**: Obtain the current document locale from the Strapi v5 admin document context exposed through the existing Strapi admin surface, and pass it into the editor behavior. Treat the document locale as the source of truth, not the admin UI translation locale.
- **Rationale**: The document locale changes with the localized article version and is distinct from the administrator's interface language. Strapi's content-manager edit view already tracks the active document locale and remounts field inputs by locale.
- **Alternatives considered**: Reading `react-intl`'s locale would reflect the admin UI language rather than the article language. Parsing the URL directly would couple the plugin to Content Manager routing and would be less reliable for embedded/component contexts.

## Decision 4: Normalize locale values conservatively

- **Decision**: Accept a non-empty locale string, normalize separators where needed, and use it as a browser language tag only when it is a valid language-tag-like value. If absent or invalid, omit the explicit `lang` value so the browser chooses its normal environment default.
- **Rationale**: Strapi locales commonly use values such as `en`, `en-GB`, or `de-DE`; browser language matching is case/separator tolerant when represented as a language tag. Omitting an invalid value is safer than applying an invalid attribute or guessing a different dictionary.
- **Alternatives considered**: Maintaining a hard-coded locale allowlist would reject valid browser-supported locales and require ongoing maintenance. Mapping every locale to a curated dictionary would exceed the feature scope.

## Decision 5: Validate through focused pure tests and editor integration tests

- **Decision**: Test normalization and activation independently, then test that the mounted editor receives the expected `spellcheck` and `lang` runtime behavior and responds to locale/config changes without changing serialized content.
- **Rationale**: Pure tests cover edge cases deterministically; integration tests cover the user-visible contract and React/Tiptap lifecycle behavior.
- **Alternatives considered**: Browser E2E tests alone would be slower and unreliable because native spellcheck underlines are controlled by the browser and OS. Snapshot-only tests would not prove runtime attribute updates.
