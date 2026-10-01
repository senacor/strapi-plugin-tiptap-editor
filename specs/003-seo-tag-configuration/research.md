# Research: SEO Tag Configuration

## Decision 1: Place the option under the existing heading preset

- **Decision**: Configure visibility as `heading.seoTag`, for example `heading: { levels: [1, 2, 3], seoTag: true }`.
- **Rationale**: SEO tag selection is a sub-capability of heading controls. The existing preset already supports a `heading` options object and is assigned per field, so a nested option keeps related behavior together and avoids a new top-level extension key.
- **Alternatives considered**: A top-level `seoTag` preset key would separate the selector from heading configuration and allow it to be enabled when heading controls are off. A bare `heading: true` default would preserve the current always-visible selector and contradict the requested opt-in behavior.

## Decision 2: Missing and false values hide the selector

- **Decision**: Only the explicit boolean `heading.seoTag: true` displays the selector. Omitted, false, and invalid values do not display it; invalid shapes are handled by configuration validation.
- **Rationale**: This matches the repository's preset convention that omitted features are disabled, and it makes the requested opt-in behavior predictable.
- **Alternatives considered**: Defaulting to visible would preserve existing runtime behavior but would not require configuration to activate the element.

## Decision 3: Keep SEO tag content and schema independent from selector visibility

- **Decision**: Change only toolbar visibility. Keep the heading attribute, HTML rendering, default tag assignment, and existing saved JSON unchanged.
- **Rationale**: The selector controls an editing affordance; hiding it should not discard or rewrite user-authored data. This follows the editor content compatibility principle.
- **Alternatives considered**: Removing the attribute when disabled would mutate content and break the requirement to preserve existing tags.

## Repository findings

- The heading selector is currently rendered next to the heading style selector in `admin/src/components/RichTextInput.tsx`.
- Heading feature options are currently typed in `shared/types.ts` and passed through `getFeatureOptions` in the admin.
- Preset top-level keys are validated in `server/src/config/index.ts`; nested heading options currently have no field-level validation.
- README currently describes the SEO tag selector as always available for heading presets, so both that text and configuration examples need updating.
- No external interface, persisted entity, or server endpoint needs to change.
