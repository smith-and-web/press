# Changelog

## 0.10.0

**One implementation per control role.** `.pw-button` and `.ka-button` were two
button systems wearing the same palette: different fill (`--color-accent` vs
`--color-accent-text`), different label size, different hover (a colour swap vs
an inset ring), different disabled colours, different secondary treatment. A
visitor crossing from the website into the application met both.

The website layer now styles **only** the prominent marketing call to action.
Operational controls on a website — a feedback dialog's submit, a form field, a
copy or share action, a toggle — are the same role a writer meets in the
application, and use `application.css`. The CTA is a documented larger size of
that same family and nothing else: 16px label and 12/24px padding against the
operational control's 15px and 8/16px. Fill, 4px radius, Inter label, inset-ring
hover, `--color-disabled-*` and the 44px target are now shared.

**This changes the website CTA's fill** from `#B5532E` to `#9E3D1B` (4.69:1 to
6.30:1 against `--color-on-accent`), removes the hover colour swap, and changes
`.pw-button--secondary` from an outlined control to `.ka-button--secondary`'s
sunken fill. `.pw-button--ghost` is added for a transparent action. Website
focus rings move to a 3px offset to match the application. Review any header,
hero or closing action that assumed the old treatment.

**`.pw-writing--app`** gives a website writing sample the application's
manuscript: `--color-prose-*` paper and ink, `--text-body` (17px) at
`--leading-relaxed`, held to `--measure`. The default `.pw-writing` remains an
editorial specimen at `--text-body-lg`. Use the variant whenever a sample claims
to show the writing workspace.

**`.ka-manuscript-prose` now matches NovelEditor.** It read at
`--text-body-lg`/1.75 over 65ch while the editor it depicts used
`--text-body`/`--leading-relaxed` over `--measure`. The reference was wrong, not
the product. Application consumers should expect slightly smaller, narrower
manuscript prose in the read-only surface.

**Web font delivery is now Press's job.** `npm run fonts:build` losslessly
encodes the canonical variable TTFs to WOFF2 in `assets/fonts/web/`, writes
`design-system/fonts-web.css` declaring the same five faces, and records source
and published digests in `assets/fonts/web/MANIFEST.json`. No subsetting: every
axis, weight, italic and glyph survives. Consumers that were vendoring WOFF2
from a third-party package were declaring the same family names with narrower
axes and no Inter italic; they should adopt `fonts-web.css` and retire that
step. `npm run fonts:check` and `npm run system:check` verify freshness.

**The foundation's buttons join the same family.** `components.css` carried a
third button system in `.download-btn` and `.navbar-cta` — terracotta fill, 8px
radius, a hover colour swap, a glow focus ring, a `nowrap` label. Both now use
the accent-text fill, 4px radius, inset-ring hover, `--color-disabled-*` and
44px target the other two share; `.download-btn.secondary` and
`.navbar-cta--secondary` become the shared sunken secondary. **Consumers on the
foundation get a visibly different download button on upgrade.** Prefer
`.pw-button` in new work.

`.page-hero` and `.content-section` share one frame, `--page-frame-editorial`
(960px, new token). They were 960px and 900px, so a page's hero and its sections
sat 30px apart on every editorial page. `.content-section.alt`'s re-centred content column is derived from that token
rather than the hard-coded `852px` it carried, which is what kept the sunken
bands 30px right of the paper sections when the frame moved.
**`.content-section` is 60px wider on upgrade;** prose inside it is already held to `--measure`, so this affects
tables, lists and figures rather than reading width.

`.pw-section-head` places its children explicitly: the running label in the
narrow track, everything else in the wide one. Written without a label it used
to put the `<h2>` in the 1fr track, where a short title wrapped to three lines
while the standfirst beside it kept the full 2fr. The label is optional
furniture; the alignment is the device.

`.ka-segment` resets border, background and font, so the class works on a
`<button>` as well as the label it was written for. A consumer using two
`aria-pressed` buttons instead of a radio group got the UA's own button chrome
showing through the track.

`.pw-button svg` is sized (18px, no flex). An inline glyph with only a viewBox
has no intrinsic size inside a flex container and collapsed to nothing; the
foundation's `.download-btn svg` had always sized it and this layer had not.

Button labels wrap with `overflow-wrap: break-word`, not `anywhere`. Both wrap
a label that cannot fit, but `anywhere` is also a break opportunity when the
browser computes min-content width, so a button in a content-sized grid track
collapsed and split its label mid-word. 0.9.0 introduced this; it is fixed for
`.pw-button`, `.download-btn` and `.ka-button` together.

`.signup-form`'s email field and subscribe button — a fourth copy of the same
two roles — now read the shared field and action treatment. Prefer `.ka-field`
and `.download-btn` in the markup for new work.

`.pw-image-frame`'s contained image treatment moves from `.pw-feature
.pw-image-frame img` to `.pw-image-frame img`, and the class carries its own
`--pw-reference-ratio` default. Scoped to a feature row it did nothing anywhere
else, so a full-frame specimen in a hero or a docs figure got the mat and the
ratio with an unconstrained image inside them.

Two further website-layer gaps found by a consumer building real pages: `.pw-feature`
prose had no vertical rhythm, so a row's label, heading, problem and answer ran
together as one block; and `.pw-footer-links` never reset the UA underline it
adds only on hover. The `web-features` catalog snippet gave each row five direct
children of a two-column grid; each row now has the two the CSS assumes, a prose
wrapper and the figure.

`system:check` now asserts the website CTA and application control agree on
fill, radius and hover, and that both manuscript roles carry the editor's
reading size.

## 0.9.0

Brand correction: always spell `kindling` in lowercase. Recut the outlined wordmark and stacked lockups, regenerate their raster/social exports, and update copy, metadata, examples and Open Design guidance. The book/flame geometry and font axes stay unchanged.

Press is now the definitive kindling system. Consolidates legacy identity and maintenance guidance, resolves typography and surface rules, adds an identity preview and asset-integrity record, and refreshes generated Open Design entries. All 45 production assets are retained; the lowercase wordmark derivatives are intentionally regenerated. Canonical palette values are preserved.

Website and application target aliases now use `--control-target`. Buttons wrap long labels and retain contrast on hover. Full-frame website images clear the inherited height cap and shadow; reversed feature rows return to natural order at narrow widths. These affect long-label, hover and narrow layouts; review those states when adopting. The narrow-screen stacking and gutter rules now match desktop selector specificity, fixing a writing-demo overflow. No public tokens or selectors are removed.

`npm run system:check` detects stale token copies, broken manifest targets, stale preview versions and unintended changes to the original artwork. See `docs/CONSOLIDATION.md`.

## 0.8.0

Two rules the system asserted but never encoded, both raised by a UX review of
the kindling-splash development build.

- **`--control-target` (44px)** and **hard rule 13**. The 44px contract existed
  only as `--pw-touch` inside the opt-in website layer, so a consumer using the
  foundation had no canonical target-size rule to follow — and did not meet it.
  `.navbar-link` (~40px) and `.navbar-cta` (~38.4px) now reach it via
  `min-block-size` and `inline-flex`, which keeps label type at its own size
  instead of padding it out of scale. **This grows the navbar's control heights
  by a few pixels; check any layout that assumed the old bounds.**
- **`.navbar-cta--secondary`** and **hard rule 14**. One primary-styled control
  per viewport. A persistent header download rendered solid terracotta beside
  an in-content download competes with the decision it should support; the
  header copy now steps down to outlined while the invitation keeps the fill.
  Additive — `.navbar-cta` alone is unchanged.

`.navbar-logo img` is matched alongside `.navbar-logo svg` so a consumer can
use a supplied brand asset at its intrinsic ratio rather than inlining and
cropping one.

Consumers who accepted the old sub-44px navbar get taller controls on upgrade.
Nothing is renamed or removed.

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
