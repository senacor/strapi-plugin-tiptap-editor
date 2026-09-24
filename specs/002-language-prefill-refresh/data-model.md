# Runtime Data Model: Immediate Language Prefill Refresh

This feature introduces no new persisted entity or server schema. It synchronizes existing form state with the runtime editor document.

## Entities

### Strapi field value

- **Represents**: The current value of the localized rich-text field in the Strapi admin form.
- **Shape**: Either serialized TipTap JSON, parsed JSON content, an empty value, or an invalid value supplied by the form state.
- **Owner**: Strapi admin form state.
- **Persistence**: Persisted only when the editor form is explicitly saved.

### Editor document

- **Represents**: The currently rendered and editable TipTap/ProseMirror document.
- **Shape**: Valid JSON content accepted by the configured editor schema.
- **Owner**: The mounted editor instance.
- **Persistence**: Runtime-only until the existing field save flow persists it.

### Synchronization event

- **Represents**: A change in the field value that did not originate from the editor's own typing transaction, such as a localization prefill.
- **Inputs**: Previous field value, new field value, current editor document.
- **Result**: Replace the editor document only when the new value is valid and semantically different; do not emit a second editor update.

## State transitions

| Current state | Trigger | Result |
|---|---|---|
| Editor initialized from field value | Initial render | Editor shows the parsed initial document using existing behavior. |
| Editor showing document A | External field value changes to valid document B | Editor immediately shows B; no additional update event or automatic save is emitted. |
| Editor showing document A | External field value represents A | Editor remains unchanged; selection and content are preserved. |
| Editor showing document A | External field value is empty but valid empty document | Editor shows the empty document; stale content from another locale is not retained. |
| Editor showing document A | External field value is malformed/unusable | Editor remains on A and reports the parse failure through the existing diagnostic channel. |
| Editor showing document A | User edits document | Existing `onUpdate` path updates the Strapi field and normal save behavior remains unchanged. |

## Validation rules

- A value is applied externally only if it can be parsed into valid content accepted by the editor schema.
- Empty content must resolve to the editor's valid empty-document representation when the external update explicitly supplies empty content.
- External synchronization must not call the user-edit update path.
- No synchronization is performed when the current editor document already matches the external value.
