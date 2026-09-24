# Research: Immediate Language Prefill Refresh

## Decision 1: Synchronize external field changes in the shared editor hook

**Decision**: Observe changes to the Strapi field value after editor creation and apply valid changed content to the existing TipTap editor.

**Rationale**: `useTiptapEditor` is the common path used by `RichTextInput`. The current `useEditor` configuration consumes `field.value` only as initial content, which explains why a Strapi localization prefill is not rendered immediately. Fixing the shared hook covers all editor presets without changing the Strapi field contract.

**Alternatives considered**:

- Remount the whole editor when the value changes: rejected because it would reset selection/editor state and risk losing the normal editing experience.
- Add synchronization only in `RichTextInput`: rejected because the state ownership and initial parsing already live in the shared hook, and other consumers could remain inconsistent.
- Change server or localization behavior: rejected because the field value is already updated; the defect is the admin editor's stale runtime document.

## Decision 2: Suppress update events for external synchronization

**Decision**: Use TipTap's content replacement with update emission disabled when applying a changed external field value.

**Rationale**: The field has already been changed by the external Strapi action. Emitting `onUpdate` again would create redundant state updates and could make a prefill appear as a user edit or trigger an unintended save path.

**Alternatives considered**:

- Call the normal update path: rejected because it conflates external form-state updates with user edits.
- Mutate the editor document directly: rejected because it bypasses TipTap's supported command and schema handling.

## Decision 3: Ignore invalid external updates without replacing the current document

**Decision**: Parse external string values and only call content replacement for valid editor JSON; preserve the current document if parsing fails or the value is unusable.

**Rationale**: The feature requires the last valid editor state to survive empty, malformed, aborted, or failed prefill data. The initial-load fallback is useful for diagnosing malformed persisted content, but using it for an external update would unexpectedly overwrite valid content.

**Alternatives considered**:

- Reuse the initial malformed-content diagnostic fallback: rejected because it replaces valid visible content during a failed external update.
- Clear the editor on invalid input: rejected because it violates the preservation requirement and risks data loss.

## Decision 4: Compare content before replacing

**Decision**: Avoid calling `setContent` when the external field value represents the document already shown by the editor.

**Rationale**: Strapi and React can rerender without a semantic content change. A comparison prevents selection churn, unnecessary transactions, and update-loop risk while preserving normal typing behavior.

**Alternatives considered**:

- Replace content on every render: rejected due to cursor/selection disruption and needless work.
- Depend only on reference identity: rejected because field values may be serialized strings or newly allocated JSON objects representing the same document.
