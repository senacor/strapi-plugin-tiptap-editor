# Data Model: Browser Spellchecking

This feature introduces no persisted entity and no change to TipTap/ProseMirror JSON. The following are runtime values used while an editor is mounted.

## Editor Configuration

- **Representation**: Optional `spellcheck` feature value on `TiptapPresetConfig`.
- **Accepted activation**: `true` or an options object whose `enabled` value is `true` according to the existing feature-value conventions.
- **Disabled values**: Missing key, `false`, non-plain object, or object with an explicit non-true/disabled state.
- **Default**: Disabled.
- **Scope**: The active editor field instance using the selected preset.

## Active Article Locale

- **Representation**: Runtime locale string from the active Strapi document, for example `de`, `de-DE`, or `en-GB`.
- **Required**: No; new/unlocalized documents and contexts without locale support are valid.
- **Validation**: Empty or malformed values are treated as unavailable.
- **Lifecycle**: Re-evaluated when the active localized document changes or the field/editor remounts for a different locale.

## Effective Spellcheck State

- **Enabled**: The normalized configuration is enabled; the editor requests native browser spellchecking.
- **Locale**: The valid active article locale when available; otherwise no explicit locale is forced and the browser environment decides.
- **Persistence**: None. Runtime attributes must not be written into the editor JSON or submitted field value.

## Relationships

`Editor Configuration` selects whether `Effective Spellcheck State` is active. `Active Article Locale` determines the effective language only when spellchecking is active. Neither runtime value changes the stored content entity.
