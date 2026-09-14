# Changelog

## 0.3.0 — 2026-09-13

Additive local application component release; not published.

- Add 22 typed Svelte 5 components through the optional Svelte entry and scoped application CSS.
- Add twelve live recipes built from the public components, copyable Svelte source, and a baseline browser.
- Include all 147 unchanged QA reference images, dimensions, hashes, and scenario mappings.
- Preserve Website components, canonical foundation tokens, and existing application examples.
- Document incremental adoption around existing app APIs and state; no app rewiring or production-service integration.
- Scope the application heading maximum to 48px; keep the foundation maximum at 60px.
- Ship a local browser bundle and reproducible source compilation script.

## 0.2.0 — 2026-09-13

Additive local website component release; not published.

- Add optional `website.css` and `website.js` exports without changing the aggregate entry.
- Add twelve website patterns with source mappings, markup and working local interactions.
- Separate Website and Application reference sections; retain application examples and the legacy components anchor.
- Preserve canonical tokens and existing component styles; scope the redesign’s Inter body treatment and light theme to `.press-web`.
- Include four full-frame product images from the linked redesign and record working-tree provenance.
- Add initialization and cleanup APIs for dynamically mounted website components.

## 0.1.0 — 2026-09-13

Initial local portable package, not a published release.

- Preserve the existing working-tree Press tokens, token names, component selectors, theme behavior, and original artwork.
- Add explicit package exports, distribution file list, local font declarations, and an aggregate CSS entry.
- Generate JSON from canonical CSS with the existing generator.
- Bundle Inter and Newsreader alongside the original Fraunces, with upstream OFL notices.
- Make maintenance asset scripts read canonical raw palette tokens; remove automatic font downloads and sibling repository instructions; make macOS iconutil optional.
- Add a standalone interactive reference and installation, integration, governance, release, migration, and provenance documentation.

Baseline: commit `6e184f445b98084358774e147843c49d10c07a12` plus the working-tree changes recorded in `docs/BASELINE.json`. This version does not imply those upstream edits have been committed or approved.
