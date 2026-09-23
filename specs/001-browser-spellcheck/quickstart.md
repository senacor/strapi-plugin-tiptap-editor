# Quickstart Validation: Browser Spellchecking

## Prerequisites

- Node dependencies installed.
- A Strapi v5 host application with this plugin enabled.
- A content type containing the TipTap rich-text custom field.
- The host application has at least two locales enabled, for example `de-DE` and `en-GB`.
- A browser with spellchecking enabled and dictionaries available for the test locales.

## Configure a test preset

Add a preset with `spellcheck: true` and assign it to the rich-text field. Keep a second preset without the key or with `spellcheck: false` for the disabled comparison.

## Manual end-to-end checks

1. Open an article in the first locale with the enabled preset.
2. Enter a deliberately misspelled word. The browser should mark it according to its own spellchecking behavior.
3. Switch the same article to the second locale. Confirm the editor language follows the active article locale and that the editor remains mounted and editable.
4. Open a field using the disabled/omitted preset. Confirm that the plugin does not request browser spellchecking.
5. Remove or use an unavailable locale, or test in a browser without spellchecking. Confirm the editor remains editable and saveable without an error.
6. Save the document and compare the field value before and after. Confirm no spellchecking or language metadata was added to the TipTap/ProseMirror JSON.

## Automated checks

Run from the repository root:

```bash
npm test
npm run test:ts:front
npm run test:ts:back
```

Focused coverage should verify:

- configuration normalization and default-disabled behavior;
- valid, missing, and malformed locale handling;
- runtime `spellcheck`/`lang` behavior when the editor is enabled or disabled;
- locale updates without editor recreation or content mutation;
- compatibility of the public preset configuration and documentation examples.

See [editor-configuration.md](./contracts/editor-configuration.md) for the complete configuration matrix and [data-model.md](./data-model.md) for runtime state boundaries.
