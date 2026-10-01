# Quickstart: SEO Tag Configuration

## Prerequisites

- Dependencies installed with the repository's configured package manager.
- The editor plugin configured with at least one preset containing `heading: true` or a heading options object.

## Configure an editor preset

To show the SEO tag selector, explicitly enable it in the heading options:

```ts
presets: {
  article: {
    heading: {
      levels: [1, 2, 3, 4, 5, 6],
      seoTag: true,
    },
  },
  simple: {
    heading: true,
  },
}
```

The `article` preset shows the SEO tag selector. The `simple` preset shows heading style controls but hides the SEO tag selector. Presets with heading omitted or disabled show neither heading control.

## Focused validation scenarios

1. Open a field using a preset with `heading: true`; confirm the heading style selector appears and the SEO tag selector is hidden.
2. Open a field using a preset with `heading: { seoTag: true }`; confirm both selectors appear.
3. Open a field using a preset with `heading: { seoTag: false }`; confirm only the heading style selector appears.
4. Load a document containing a heading with a semantic tag while the selector is hidden; edit and save the document; confirm the heading text and stored tag are preserved.
5. Supply an invalid `seoTag` value; confirm configuration validation reports it and the invalid value does not enable the selector.

## Automated and project validation

Add focused automated coverage for selector visibility, the omitted default, invalid configuration, and stored tag preservation. Then run:

```sh
yarn test
yarn test:ts:front
yarn test:ts:back
```

Expected result: all focused checks and project validation commands pass. See [the configuration contract](contracts/editor-configuration.md) for the full preset behavior table.
