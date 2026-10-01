# Runtime Data Model: SEO Tag Configuration

This feature adds no persisted entity or server schema. The new value is runtime preset configuration, and heading content remains the existing TipTap/ProseMirror JSON.

## Entities

### Editor preset

- **Represents**: The set of editor capabilities assigned to one or more Strapi rich-text fields.
- **Relevant shape**: `heading` may be `true` or an options object containing `levels` and the optional `seoTag` boolean.
- **Owner**: Plugin configuration supplied by the Strapi application.
- **Persistence**: Configuration only; no field content is stored here.

### Heading content

- **Represents**: A heading node in the rich-text field.
- **Relevant attributes**: Existing visual `level` and semantic HTML `tag`.
- **Owner**: The editor document and the field's existing save flow.
- **Persistence**: Existing TipTap/ProseMirror JSON; this feature must not change its shape or values.

### SEO tag selector

- **Represents**: A toolbar control for changing a heading node's semantic tag.
- **Visibility rule**: Visible only when heading is enabled and `heading.seoTag` is exactly `true`.
- **State**: Reads and updates the selected heading's existing `tag` attribute. Hiding the control does not clear that attribute.

## Validation rules

- `heading.seoTag` accepts a boolean.
- Omitted and `false` values hide the selector.
- Invalid values are rejected by server configuration validation and must not enable the selector.
- Existing heading level and tag attributes remain valid and are preserved whether the selector is visible or hidden.
