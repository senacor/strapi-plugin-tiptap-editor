<!--
Sync Impact Report
- Version change: scaffold → 1.0.0
- Modified principles: none; initial governance established
- Added sections: Core Principles, Compatibility & Distribution Constraints,
  Development Workflow & Quality Gates, Governance
- Removed sections: none
- Follow-up TODOs: RATIFICATION_DATE is unknown and requires maintainer confirmation.
-->

# Tiptap Editor Plugin for Strapi Constitution

## Core Principles

### I. Strapi Plugin Contract First
The plugin MUST preserve its public Strapi plugin contract: registered custom fields, configuration
keys, server routes, and package export paths. Any intentional breaking change MUST be documented
in the README and released with an appropriate semantic-version major bump. This keeps existing
Strapi installations upgradeable and their stored content usable.

### II. Editor Content Compatibility
Rich-text content produced by the editor MUST be valid TipTap/ProseMirror JSON and remain
renderable after plugin upgrades. New extensions, attributes, and schema changes MUST define a
safe migration or graceful fallback for existing documents. User-authored content is the primary
asset this plugin safeguards.

### III. Verified Behavior
Every behavior change MUST include automated coverage at the narrowest meaningful level. Changes
to editor interactions, configuration validation, server endpoints, or custom-field contracts
MUST include integration coverage when unit tests cannot prove the user-visible contract. The
required validation commands are `npm test`, `npm run test:ts:front`, and `npm run test:ts:back`
when their affected areas change.

### IV. Secure, Validated Configuration
All configuration and request-derived input MUST be validated before it affects editor behavior,
stored data, or server responses. The admin UI MUST treat content and configuration as untrusted;
extensions MUST avoid introducing executable markup or unsafe URL handling. Validation protects
both Strapi administrators and the content they manage.

### V. Focused, Configurable Extensions
Each editor extension MUST have a clear user-facing purpose and integrate through the established
preset and theme configuration model. New dependencies, abstractions, or extension options MUST
be justified by a supported use case and documented. Prefer small composable changes over
unrelated editor functionality to keep the plugin maintainable.

## Compatibility & Distribution Constraints

The plugin MUST support the Strapi v5 compatibility range declared in `package.json` and its
README. Production artifacts MUST be built from the repository source using the configured Strapi
plugin build process and published only from the `dist` package contents. Runtime dependencies and
peer dependency ranges MUST remain aligned with the supported Strapi and React integration.

## Development Workflow & Quality Gates

Changes MUST be scoped to a user-visible need or a documented maintenance concern. Before review,
contributors MUST run relevant tests and both affected TypeScript checks; failures MUST be resolved
or explicitly recorded with a reason and follow-up issue. Documentation MUST change alongside any
public configuration, supported extension, installation, or compatibility change. Reviewers MUST
verify content compatibility, configuration validation, and test evidence for affected contracts.

## Governance
This constitution supersedes conflicting development conventions. Amendments MUST be made in this
file, include a Sync Impact Report, and receive maintainer approval. Versioning follows semantic
rules: MAJOR for incompatible governance redefinitions or removals, MINOR for added principles or
materially expanded requirements, and PATCH for clarifications that do not change obligations.

Every pull request and release review MUST assess compliance with these principles. Exceptions
MUST state their scope, rationale, risk, owner, and expiry or removal condition in the review
record. The constitution itself MUST be reviewed whenever repository practices or release policy
materially change.

**Version**: 1.0.0 | **Ratified**: TODO(RATIFICATION_DATE): original adoption date unknown; confirm with maintainers. | **Last Amended**: 2026-09-23
