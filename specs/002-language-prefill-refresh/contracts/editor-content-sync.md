# Editor Content Synchronization Contract

## Scope

This is a user-visible admin UI contract for the localized rich-text field. It is not a new HTTP or server API.

## Contract

1. When the Strapi field value changes externally after the editor has mounted, a valid changed TipTap document MUST be visible in the editor within 1 second.
2. Applying an external value MUST NOT emit a second editor update or trigger an automatic save. The user can still edit the content and use the existing explicit save action.
3. An external value that is semantically equal to the current document MUST leave the document and selection unchanged.
4. An empty but valid external document MUST replace stale content with the empty document.
5. A malformed or unusable external value MUST leave the current valid editor document unchanged and the editor MUST remain editable.
6. Initial content loading and ordinary user editing MUST retain their existing behavior.

## Compatibility

- Applies to every editor preset using `useTiptapEditor`.
- Preserves the existing TipTap JSON document format.
- Requires no new public configuration, route, server behavior, or persisted field format.
