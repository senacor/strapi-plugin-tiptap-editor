# Quickstart: Immediate Language Prefill Refresh

## Prerequisites

- Node dependencies installed with the repository's configured package manager.
- The repository checked out with the feature spec and implementation changes.
- A Strapi admin article type with localization enabled and the Tiptap rich-text field configured.

## Focused automated validation

Run the hook/content synchronization tests:

```sh
npx vitest run tests/admin/tiptapUtils.test.ts
```

Expected results:

- A changed valid external field value replaces the visible editor document.
- The replacement does not call the editor's update callback.
- Equal content is not replaced again.
- Empty valid content clears stale editor content.
- Malformed external content leaves the previous document unchanged.
- User updates continue to call the existing field change handler.

## Required project validation

```sh
npm test
npm run test:ts:front
npm run test:ts:back
```

All commands must pass. The backend type check is included because it is a project quality gate, although this feature changes only admin code.

## Manual acceptance scenario

1. Open a localized article with a populated source language and an empty or different target language.
2. Trigger Strapi's action to prefill the target language from the source language.
3. Confirm that the target editor shows the source content immediately, without saving or reloading the page.
4. Edit the newly visible content and save the article through the normal save action.
5. Repeat with an empty or unavailable source and confirm that the prior valid editor state is not replaced by stale or malformed content.
6. Confirm that opening and editing an article without prefill still behaves as before.
