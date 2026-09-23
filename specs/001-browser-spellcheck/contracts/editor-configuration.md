# Editor Configuration Contract: Browser Spellchecking

## Public preset shape

The existing preset configuration gains one optional feature key:

```ts
type TiptapPresetConfig = {
  // existing feature keys...
  spellcheck?: boolean | Record<string, unknown>;
};
```

Example:

```ts
export default () => ({
  'tiptap-editor': {
    config: {
      presets: {
        article: {
          bold: true,
          spellcheck: true,
        },
      },
    },
  },
});
```

## Behavior contract

| Configuration | Active article locale | Expected behavior |
| --- | --- | --- |
| `spellcheck: true` | Valid locale | Request native browser spellchecking and apply the locale as the editor language. |
| `spellcheck: true` | Missing/invalid locale | Request native browser spellchecking and let the browser choose its normal language. |
| `spellcheck: false` or omitted | Any | Do not request spellchecking and do not force an article language. |
| Invalid value | Any | Treat as disabled; editor remains usable. |

The behavior is runtime-only. The field value remains the same TipTap/ProseMirror JSON shape regardless of the setting.

## Compatibility

- Existing presets without `spellcheck` retain their current behavior.
- The option is per preset and therefore applies to every field instance selecting that preset.
- Browser support and user browser settings remain authoritative; the plugin does not guarantee visible underlines.
