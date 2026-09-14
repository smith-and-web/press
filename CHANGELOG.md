# Changelog

## 0.7.1

Fix a screenshot crop at stacked widths, found in a UX review of the
kindling-splash development build.

`.feature-figure img` caps height at 440px with `object-fit: cover` so a figure
balances the prose beside it. Below 768px the sequence stacks to one column and
the figure goes full width, so the cap no longer balances anything — it just
removes the bottom of the image. Measured on the consumer at 768px it cut 127px
off three of four product screenshots, roughly a quarter of each, taking the
editor controls with it. Not visible at 390px (column too narrow to reach the
cap) or at 1024px and above (two columns), which is why a desktop-only check
misses it.

The cap is now released inside the existing `max-width: 768px` block. The
mounted-print mat, hairline ring and lift are unchanged, and the cropping
default at two-column widths is unchanged.

## 0.7.0

Four gaps in the website layer, found by building a real consumer against it —
the Open Design homepage integration, which vendors this package and composes a
full page from `pw-*`. Each gap showed up as an override the consumer should
never have had to write.

- **`@supports not (container-type: inline-size)` fallback for the nav.** The
  collapse lived only in `@container press-website (max-width: 820px)`, so a
  browser without container query support kept the nav permanently expanded with
  no way to reach the menu. The same three rules now repeat against the viewport.
  This is a correctness fix, not a refinement.
- **`.pw-frame`** — centres content at `--page-frame` within `--pw-gutter`. The
  website layer had no frame primitive at all; `.editorial` lives in
  `components.css`, which this layer deliberately does not require.
- **`.pw-band`** — a full-bleed surface between hairlines. `.pw-trust` carried
  its own border and background, so it could not sit in a band without
  doubling them; inside `.pw-band` it now drops both.
- **`.pw-header`** — a sticky masthead. `.pw-nav` is a standalone specimen with
  its own gutter and bottom rule, which fight a full-bleed sticky header. Inside
  `.pw-header` those are removed.

Additive only; no existing selector changes behaviour, so consumers on 0.6.0
need take no action. The mounted-print figure treatment from 0.5.0 is retained
deliberately — a consumer overriding it to full-frame is a page-local choice,
not a signal to change the default.

## 0.6.0

Additive composition layer, promoted from the Open Design homepage prototype
that the website layer was originally extracted from. The prototype carried
four compositional ideas the canonical layer never had; they existed only as
`pw-*` classes, so the site — which consumes `components.css`, not the opt-in
website layer — could not reach them without a competing cascade.

- `.section-lead--aligned` — the running label holds its own column beside the
  heading and stand-first, so a run of sections shares one vertical reading
  edge. Mirrors `pw-section-head` in the canonical vocabulary. `.section-lead`
  alone is unchanged and remains the stacked form.
- `.trust-band` / `.trust-band-items` — a full-bleed row of short statements on
  raised surface between two hairlines. A band, not a card.
- `.spotlight-action` — a trailing link pushed to its item's bottom edge with
  `margin-top: auto`, so a row of actions aligns across columns whose
  paragraphs differ in length. `.spotlight-item` gains `display: flex` to carry
  it; its padding, hairline and type are unchanged.
- `DESIGN_GUIDE.md` gains four named devices: **running section label**,
  **aligned section head**, **trust band**, **shared action edge**.

The prototype set its section labels in terracotta. That is recorded in the
guide as explicitly *not* adopted: a label on every section would blow the
two-accents-per-viewport rule, so the running label stays muted Inter.

No existing selector changes behaviour, so this is a minor. Consumers on 0.5.0
need take no action; the new classes are opt-in.

## 0.5.0

**Breaking (website layer):** `.pw-feature-grid` no longer lays features out as
a two-column tile matrix.

`DESIGN_GUIDE.md` states a hard rule — *"Sequence, not grid"*: feature content
reads as a sequence, not a matrix of identical tiles, because card grids of
equal tiles produce ragged heights and dead space beside a text-only entry. The
0.2.0 website layer shipped `.pw-feature-grid` as exactly that matrix, so the
package contradicted the guide it distributes. A consumer could not apply the
website layer and follow the guide at the same time.

- `.pw-feature-grid` is now a sequence container: it only resets the folio
  counter. `.pw-feature` is a full-width row, hairline-divided from the next,
  carrying a `decimal-leading-zero` print folio. This mirrors `.feature-seq` in
  `components.css`; the two are intended to stay identical in behaviour.
- Added `.pw-feature--reverse` to alternate figure-left/prose-right, which the
  grid form had no need for.
- `.pw-feature img` now carries the **mounted print** treatment the guide names
  (10px raised-surface mat, hairline ring, `--shadow-md`) instead of a plain
  hairline border. This is one of the three places the guide licenses shadow.
- `.pw-image-frame` is unchanged but is now documented as opt-in full-frame
  media, not the default product-figure treatment. Its `contain` letterboxing
  is for catalog specimens and diagrams.
- Dropped the `subgrid` row-spanning and its `@supports` fallback, which only
  existed to align tracks across tiles.

**Consumer action.** If you used `.pw-feature-grid` for a tile matrix, that
layout is gone by design; adopt the sequence or build a local grid that does not
claim to be Press. Add `.pw-feature--reverse` to every second row to alternate.
Product figures are now cropped `cover` at `max-height: 440px`, so check that
your source aspect ratios clear the slot rather than losing their lower edge.

`.pw-release-grid` is **not** affected: `.pw-release-item` is already a
hairline-topped row, which is what `.spotlight-list` does. No token, JSON key,
application component, or non-website selector changes.

## 0.4.1

- Diagnose Open Design’s synthetic Product seed and 120-file browser upload cap.
- Add generated Press palette/font metadata and OPEN_DESIGN_INPUT.md for explicit Markdown input. Preserve the authored design guide and canonical token values.
- Separate existing-package installation from source extraction in setup instructions and document recovery limits.
- Add a metadata-only generation command; existing component APIs and browser bundles are unchanged.

## 0.4.0

- Add root DESIGN.md, native Open Design manifest, generated token/font entries, component fixture and inventory, usage guide and seven focused HTML previews.
- Add four portable skills with an index and explicit Open Design handoff instructions.
- Add a composed Svelte application kit using existing navigation, metadata controls and the page-style Tiptap editor; edits remain local in memory.
- Add repeatable Open Design generation and preserve all existing component APIs, examples, baseline assets, license terms and npm publishing protection.


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
