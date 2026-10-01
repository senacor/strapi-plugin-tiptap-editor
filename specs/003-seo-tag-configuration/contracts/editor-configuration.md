# Editor Configuration Contract: SEO Tag Selector

## Public preset shape

The `heading` preset option gains an optional boolean `seoTag` sub-option:

```ts
type HeadingConfig = {
  levels?: Array<1 | 2 | 3 | 4 | 5 | 6>;
  seoTag?: boolean;
};
```

Example enabling the selector for one preset:

```ts
presets: {
  article: {
    heading: {
      levels: [1, 2, 3, 4, 5, 6],
      seoTag: true,
    },
  },
}
```

`heading: true` continues to enable heading style controls with default heading levels, but does not enable the SEO tag selector.

## Behavior contract

| Heading configuration | Heading style selector | SEO tag selector |
| --- | --- | --- |
| `heading: true` | Visible | Hidden |
| `heading: { levels: [1, 2], seoTag: true }` | Visible with configured levels | Visible |
| `heading: { levels: [1, 2], seoTag: false }` | Visible with configured levels | Hidden |
| `heading: { levels: [1, 2] }` | Visible with configured levels | Hidden |
| `heading: false` or omitted | Hidden | Hidden |
| Invalid `seoTag` value | Per existing configuration error handling | Rejected by configuration validation; never enabled |

The option is per preset. It affects only toolbar visibility; heading content and its stored semantic tag remain unchanged.

## Compatibility

Existing presets that relied on the always-visible selector must add `seoTag: true` under `heading` to retain that control. This default behavior change must be called out in release notes and handled according to the project's versioning policy.
