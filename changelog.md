# Changelog

## v1.4.0 - 2026-10-03

* Add optional, unique anchor IDs to headings (h1–h6), with an editor dialog for setting and removing them.
* Suggest headings with anchor IDs in the link dialog and create fragment links in the form `#<id>`.
* Add `heading.jumpLinks: true` to enable the anchor controls and link suggestions per preset. The option is disabled by default; existing IDs and manually entered fragment links remain available when it is off.
* Add German translations for editor controls, hints, and validation messages.

## v1.3.0 - 2026-10-01

* Hide the heading SEO tag selector by default. Set `seoTag: true` inside the `heading` preset options to show it; existing presets that relied on the selector must opt in again.

## v1.2.8 - 2026-09-24

* Align `react-intl` with Strapi 5.54.0 by using version 6.6.2, which supports React 18.

## v1.2.7 - 2026-09-24

* Refresh the TipTap editor immediately when localized article content is prefilled from another language.

## v1.2.6 - 2026-09-23

* Add configurable browser spellchecking for editor presets, using the active Strapi article locale as the checking language.

## v1.2.5 - 2026-09-23

* Unpin peer dependencies
