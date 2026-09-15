# Developer brief: adopt Press in kindling-splash

## Objective

Make `kindling-splash` feel like the website for the same product people use in the kindling application. Adopt the consolidated Press system for branding, typography, surfaces, controls, imagery and interaction states. Apply the same rules to marketing pages, download flows, blog articles, documentation and feedback.

The website is a consumer of Press. Shared design decisions and reusable fixes belong in `press`; routing, content, analytics, downloads and service integrations belong in `kindling-splash`.

The owner has approved **lowercase `kindling` everywhere in current branding**, including sentence starts, headings, metadata, alt text and artwork.

This is an implementation brief based on the inspected working trees. The site has not been migrated or browser-tested as part of writing it.

## 1. Read the maintained sources

Paths in this section are relative to the sibling `press` repository:

1. `DESIGN.md` — current design contract and surface-specific rules.
2. `docs/CONSOLIDATION.md` — authority and resolved legacy conflicts.
3. `assets/README.md` and `preview/brand-assets.html` — lowercase artwork and placement.
4. `design-system/tokens.css` — sole editable token source.
5. `design-system/website.css`, `docs/WEBSITE_COMPONENTS.md` and `reference/website-snippets.json` — website implementations and behavior contracts.
6. `design-system/application.css`, `docs/APPLICATION_COMPONENTS.md` and `design-system/svelte/` — control and manuscript styling.
7. `index.html#application-components` and `ui_kits/app/index.html` — working application references.
8. `docs/OPEN_DESIGN.md` — downstream synchronization if shared Press sources change.

Use current source files when an older versioned guide differs. `brand-assets` is retired. The site's copied guide and `CLAUDE.md` must be updated to point to the current contract.

Compare with the actual application in `../kindling`: `src/app.css`, `src/styles/press/`, `src/lib/components/NovelEditor.svelte`, `PageView.svelte`, `BeatView.svelte`, `ProseToolbar.svelte` and the relevant settings/dialog components. The app's own copied tokens and historical screenshots can lag Press. For example, the inspected About dialog still contains the previous title-case spelling. Record such discrepancies; implement the owner's current lowercase direction on the site.

## 2. Starting state: address these specific gaps

| Location | Observed state | Required action |
| --- | --- | --- |
| `src/styles/PRESS_VERSION` | Records Press 0.8.0, commit `bac49b063855d70a8c6e00b7436576082f2b7219` | Refresh from the consolidated source, including the lowercase correction; record exact content identity |
| `scripts/sync-design-system.sh` | Already copies from `../press`, with a documented subset-vendoring exception | Keep one reproducible ingestion route; extend it to fonts, complete brand outputs and current guidance |
| `src/styles/global.css` | Imports foundation and website CSS, then independently declares fonts | Eliminate duplicate font authority; split shared styles from site adapters |
| Marketing templates | Website CSS is present, but inspected templates have no `.press-web` boundary | Migrate markup and behavior deliberately; an imported stylesheet alone does not adopt its patterns |
| `Navbar.astro` | Custom fixed header, mobile controller, local stacking values and old wordmark dimensions | Adopt Press navigation and current artwork while preserving routes and tracking |
| `WritingDemo.astro` | Locally styled beat/prose/reference composition | Bring its visual roles into alignment with the application and share any reusable refinement through Press |
| `starlight-overrides.css` | Repeated font faces, literal palette values and retired source comments | Import shared fonts/tokens and map Starlight variables to them |
| `astro.config.mjs` | Title-case docs labels and a separate `src/assets/kindling-logo.svg` | Use lowercase labels and approved Press artwork |
| `MarketingLayout.astro`, blog metadata and share copy | Previous brand spelling and independent favicon/OG/preload paths | Refresh every output, including metadata and static public pages |
| Feedback and download components | Real service and event contracts | Preserve their behavior while replacing styling |

Both repositories have existing uncommitted work. Record the starting status and work on a suitable branch without resetting, stashing away or reverting another person's changes. The inspected site HEAD was `4ad4778566c2805994a57a3b16638a3c1d219a15`; its working tree includes substantial launch work beyond that commit. Recheck before implementation.

## 3. Define what must match the application

Use the following as the visual acceptance contract. Compare equivalent roles side by side at the same browser zoom and device scale.

| Role | Required treatment |
| --- | --- |
| Brand | Approved lowercase outlined wordmark, book/flame and flame assets; original proportions |
| Canvas | `--color-bg`; light paper on the website and docs |
| Surfaces | `--color-surface` for raised paper, `--color-surface-sunken` for recessed groups, semantic borders |
| Primary text | `--color-text`; muted ink is for secondary information |
| Display headings | Fraunces / `--font-display`, canonical heading scale and deliberate hierarchy |
| Controls and navigation | Inter / `--font-ui`, including labels, buttons, menus, tabs and field values |
| Product copy | Inter inside the website variant |
| Reading content | Newsreader / `--font-body` for manuscript excerpts, long-form articles and documentation prose |
| Manuscript sample | Light paper and dark ink through `--color-prose-*`; 17px `--text-body`, 1.7 reading line height, maximum `--measure:36rem` for application-fidelity samples |
| Inputs | 16px minimum text, visible label and boundary; recognizable normal/focus/error/disabled states |
| Interactive targets | At least `--control-target` (44px) in each dimension for standalone controls; inline prose links are exempt |
| Accent | Terracotta for action/selection; `--color-accent-text` for small links; ember only inside the flame |
| Material | Shared paper grain behind content, restrained elevation, hairline separation and existing radius scale |
| Feedback | Visible focus, explicit busy/error/success/disabled states; text or icons accompany color |

The website keeps its editorial frame, larger opening headline and generous section spacing. Website/docs remain light-only; matching the app does not require adding a public dark-mode control. Product samples should resemble the actual writing workspace, including its quiet metadata and paper manuscript.

### Resolve control differences in Press first

Do not assume that two controls match merely because both use Press colors. The current `.pw-button` uses `--color-accent` and `--text-base`; `.ka-button` uses `--color-accent-text` and `--text-ui`. Their secondary treatments also differ.

For this adoption, use the Press application control treatment as the reference for equivalent operational controls: feedback submission, share/copy actions, field controls, toggles and dialogs. Establish reusable shared styling or an explicit application-consistent website variant **in Press**, with documented examples. Then consume it on the site. Keep one implementation of each chosen role.

A prominent marketing CTA can have a larger documented size. Its radius, font family, state treatment and action hierarchy must still belong to the same family. Do not redefine global accent tokens to fix a single button, or stack `.pw-button` and `.ka-button` on one element and rely on whichever selector wins.

Likewise, the website prose specimen currently uses a larger reading-size alias. Use the 17px application prose role inside an app-fidelity writing demo; retain intentional larger editorial reading sizes elsewhere. Put a reusable demo variant in Press if the existing website pattern cannot express this cleanly.

## 4. Establish a reproducible Press dependency

The site already uses committed subset vendoring to avoid including the complete QA/reference archive. Keep that approach for this migration, and document it as the consumer-specific exception to Press's full-package installation guidance. The requirement is a single editing authority and verifiable copies.

Upgrade the sync process so that it:

1. Consumes one identified Press snapshot. The consolidated local package is labeled 0.9.0, but a version label or HEAD alone does not identify uncommitted lowercase changes. Prefer a committed release; for an interim preview, record a manifest of SHA-256 hashes for every consumed file and label it as a working-tree snapshot.
2. Copies the consumed CSS/JavaScript, local font files and applicable notices, current brand SVGs, public favicon family, webmanifest and OG image.
3. Preserves relative font paths. A useful source layout is `src/vendor/press/design-system/` beside `src/vendor/press/assets/fonts/`, with notices alongside. Build-resolved font imports then continue to work. Public-facing assets can be generated into `public/brand/` and the established favicon/OG URLs.
4. Records package version, commit when applicable, content hashes, source-to-destination mappings and intentional exclusions. The existing timestamp file is insufficient to detect modified mirrors.
5. Provides a read-only check that verifies committed files against those recorded hashes and generated mappings. CI must be able to build and check without a sibling checkout.
6. Requires an explicit sync to adopt upstream changes. Do not make normal builds silently fetch or copy a moving source tree.

Copy `DESIGN.md` as the authoritative guide, and preserve the relative structure of any supporting docs you copy. The current sync copies only `docs/DESIGN_GUIDE.md` to the site root; the consolidated guide's links will not resolve correctly in that location without adaptation. Update `CLAUDE.md` accordingly.

### Font consistency

Press owns its font files and face declarations. The site and app currently use separately vendored WOFF2 files with narrower weight declarations; Press includes variable TTFs with broader ranges and Inter italic. Do not leave both families of declarations active under the same font names.

Start from the canonical Press files. If web delivery needs WOFF2, add a deterministic conversion/distribution step in Press, preserve the required axes, weights, italics and glyph coverage, and publish the result for consumers. Remove the site's independent Fontsource-driven sync once it is unused. Compare actual glyph rendering with the app; record any app font-version difference for upstream alignment.

Update preload URLs and types to the files actually used. Confirm there are no stale font preloads, duplicate downloads, synthetic required weights or missing italics. Keep font notices with the deployed distribution as applicable.

## 5. Migrate the shared page shell

### Marketing layout

- Load shared fonts and tokens once, followed by the chosen Press website/control layers and a small site adapter stylesheet.
- Use an outer `.press-web` boundary for marketing content. Put layout components inside it; `.press-web` and `.pw-nav` on the same node do not satisfy the descendant selectors.
- Adopt `.pw-frame`, `.pw-header`, `.pw-nav` and `.pw-band` where their roles apply. Use the 1120px frame and token-based gutters.
- Use the current Press responsive rules. The consolidation fixed selector specificity that previously prevented columns from stacking.
- Retire superseded local navigation/component styles and behavior as each region moves. During incremental adoption, document which legacy foundation styles are still required. Remove the global `components.css` reset from routes that no longer need it.
- Define any remaining minimal page reset explicitly; preserve the Press paper/grain treatment that the old global stylesheet provided. Do not accidentally lose the material while removing the old reset.
- Keep long-form article styles explicit. Apply Newsreader and the reading measure to article prose, with Inter for embedded controls, navigation and table headings.

### Navigation and footer

Adopt the shared in-flow navigation disclosure. Keep links visible without JavaScript, use correct `aria-controls`/`aria-expanded`, support Escape and focus return, and keep every destination reachable at tablet widths. A sticky header must reserve its space and leave anchor targets visible.

The persistent header download is secondary when a primary in-content download is visible. Preserve its download attribution. Keep footer routes, legal links and external destinations intact.

Use the current lowercase wordmark asset. Its intrinsic width is now 6445, with height 1972; the old navbar's 6790 width describes the previous lettering. Prefer reading dimensions from the asset instead of spreading hard-coded copies. A stacked lockup needs at least 140px width; use the shallow wordmark in a shallow header.

## 6. Migrate components while preserving real behavior

| Site component | Implementation direction | Behavior to preserve |
| --- | --- | --- |
| `Navbar.astro` | Press header/nav/brand/disclosure patterns | Routes, active state, keyboard behavior, no-JS links, one CTA event |
| `Footer.astro` | Press footer pattern and current wordmark | Navigation, legal links, event attribution |
| `SmartDownloadButton.svelte` | Shared action styles and states; retain its existing Svelte island | Platform detection, `requestDownload`, desktop/mobile branches, native sharing, cancellation, clipboard failure fallback |
| `WritingDemo.astro` | App-consistent beat, metadata, reference and prose presentation | Native radio semantics, illustrative content, readable no-JS state, one event per changed beat |
| `FeedbackWidget.astro` | Shared dialog, field, choice and button styling | Existing endpoint/payload, honeypot, opening timestamp, lazy Turnstile, errors, Escape/focus handling |
| `/feedback/` | Same form language as the app and floating widget | Validation, service contract and existing anti-abuse behavior |
| `/download/` and `/download/thanks/` | Shared platform/action/disclosure patterns | Release metadata, exact binary targets, one dispatch, refresh/replay protection |
| FAQ/disclosures | Press native disclosure treatment | Semantics, focus, readable collapsed/expanded states |

Keep Astro and native HTML for static patterns. Reuse existing Svelte where behavior already needs it. A read-only writing demo does not require mounting an editable Tiptap engine. If an editable demo is explicitly introduced later, use the real Press editor rather than a textarea imitation.

Press's signup and platform-selection examples are demonstrations. They must not replace the production feedback service or real release/download logic. Bind each interactive region to exactly one controller. If migrating the writing demo to `data-pw-*` hooks, remove the superseded controller and update analytics selectors together.

The existing browser global `window.KindlingWebsite` is an API identifier. The lowercase brand decision does not authorize breaking it. The Svelte `Button` component renders a button; navigation and downloads should retain proper anchor semantics where appropriate.

## 7. Bring Starlight into the same system

Treat `src/styles/starlight-overrides.css` as an adapter between Starlight and Press:

```css
/* Load canonical Press fonts and tokens before these mappings. */
:root,
:root[data-theme='light'] {
  --sl-font: var(--font-ui);
  --sl-font-mono: var(--font-mono);
  --sl-color-bg: var(--color-bg);
  --sl-color-bg-nav: var(--color-bg);
  --sl-color-bg-sidebar: var(--color-bg);
  --sl-color-text: var(--color-text);
  --sl-color-text-accent: var(--color-accent-text);
}
```

This is an initial mapping, not a complete Starlight theme. Inventory every remaining `--sl-*` color used for links, search, active navigation, borders, code and admonitions. Choose the corresponding semantic role and check its rendered contrast. Resolve absent shared roles in Press instead of inventing another hard-coded palette in the site.

Use Fraunces for editorial headings, Newsreader for reading paragraphs/lists/quotes, Inter for navigation/search/operated disclosure labels, and the mono role for code. Replace the current blanket Fraunces rule on all `summary` and sidebar group labels with role-based styling. Check inherited styles on nested controls inside prose.

Keep docs light-only and preserve their search, sidebar, mobile navigation, anchors and theme preference handling. Update the configured title to `kindling Docs`, lowercase brand mentions in sidebar labels, and replace the separate docs logo with the approved asset. Do not load the foundation global reset across Starlight merely to gain access to one shared class.

## 8. Refresh branding, media and content outputs

- Update brand text in Astro/Svelte templates, Markdown frontmatter/body copy, document titles, Open Graph site names, JSON-LD publisher/product names, alt text, accessible names and native-share text.
- Refresh `public/brand/`, root favicon files, `site.webmanifest`, `/og-image.png` and the docs logo from Press. Copy generated artwork; do not redraw or typeset a substitute.
- Audit `public/welcome.html` and other standalone public HTML; these can bypass `MarketingLayout.astro` and therefore miss the migration.
- Preserve case-sensitive external URLs, release filenames, identifiers and account handles. For example, existing `Kindling_…dmg`, `.exe` and `.AppImage` filenames must continue to match the actual release assets. Lowercase the displayed product name independently.
- Keep page URLs, canonical links, sitemap behavior, structured-data structure and redirects stable.
- Retain real product screenshots. Use full-frame containment for interfaces, with the shared screenshot frame/mounted treatment; avoid `cover` crops that remove controls. Check desktop as well as mobile, because older desktop height caps can still crop a wide figure.
- Replace outdated product captures through the existing screenshot workflow when needed. Confirm app state and capture prerequisites first: that workflow moves focus and can change display mode. Use prepared app fixtures, not real user manuscripts. Historical QA captures are evidence, not current marketing art; do not retouch them to imply a different captured application.

## 9. Implement in a reviewable sequence

1. Record starting state, routes, screenshots and actual app comparison surfaces.
2. Resolve shared control/demo discrepancies in Press and update its examples and contract. Rebuild and validate Press before refreshing the site.
3. Establish the exact vendored snapshot, font source and asset mappings.
4. Migrate the shared shell and a representative vertical slice: homepage, writing demo, one download action and feedback dialog.
5. Compare that slice directly with the app's light appearance. Correct shared differences upstream, then sync again.
6. Apply the same patterns to remaining marketing pages, download flow, articles, docs and standalone public pages.
7. Remove obsolete overrides, duplicate font loading and unused interaction handlers. Update repo instructions, the vendor manifest and tests.
8. Complete the acceptance checks below and hand over the preview and evidence.

Site-specific adapters may handle routing, content arrangement and Starlight integration. They must not redefine the shared palette, font families or control appearance. A missing shared token or reusable pattern returns to Press.

## 10. Acceptance criteria and verification

### Visual and source checks

- [ ] Current displayed branding and all active logo exports use lowercase `kindling`; CSS transformations cannot uppercase the name.
- [ ] Marketing, article and docs routes use the same approved font source and semantic palette.
- [ ] Representative site buttons, inputs, feedback states and manuscript samples match their documented application counterparts. Any deliberate role-specific size difference is documented in Press.
- [ ] No independent palette or font definitions remain in site adapters. Remaining literal layout values have a site-specific reason.
- [ ] The homepage writing sample uses actual prose hierarchy and readable paper treatment; controls remain Inter.
- [ ] Screenshots retain their full content and intrinsic proportions at every tested width.
- [ ] No horizontal page overflow, clipped actions, broken images or missing fonts at 375, 768, 820, 1024 and 1440px. Test at 200% browser zoom as well.
- [ ] Light website/docs surfaces remain correct under both light and dark OS preferences, including first paint.
- [ ] Keyboard focus, hover, invalid, busy and disabled states are distinguishable. Check reduced motion, target dimensions and contrast on actual rendered surfaces.
- [ ] All generated/vendor copies pass content-hash checks in a clean checkout without `../press` or `../brand-assets` present.

### Route and behavior checks

At minimum cover `/`, `/features/`, `/compare/`, `/download/`, `/download/thanks/`, `/feedback/`, `/faq/`, one blog article, `/docs/getting-started/`, a docs page with screenshots/forms, `/welcome/`, the standalone welcome page, a legal page and the 404 page. Review the remaining route inventory for unique templates.

Run the existing site check:

```sh
cd kindling-splash
npm ci
npm run test:launch
```

`test:launch` already builds the site and runs `scripts/check-launch.mjs`. Preserve its coverage of event counts, platform downloads, thanks-page replay protection, mobile sharing, no-JS behavior and feedback handling. When markup changes, update selectors without weakening the assertions. It intercepts external requests; keep test submissions, analytics and binaries isolated from production.

Extend browser coverage for the new visual contract: computed font roles, important semantic colors, narrow layout, lowercase displayed text, focus, assets and representative screenshots. A successful Astro build alone is insufficient evidence of visual adoption.

For changes made in Press, run its token generation, affected reference builds, `open-design:build` and `system:check`. Sync the existing Open Design system using its discovered project/system identifiers, then verify the registered brief and files. Do not create another competing Press system.

### Required handoff

Provide:

1. The exact Press snapshot identity and vendor/content-hash manifest.
2. A summary of shared Press changes and the site's remaining adapters.
3. Before/after screenshots of the representative routes at desktop and phone widths, plus app/site comparisons for a button, field/dialog and manuscript sample.
4. Build and browser-check results, including any remaining exceptions.
5. Confirmation that existing download, analytics, feedback, SEO and no-JS behavior remains intact.
6. Any application-side follow-up discovered, clearly separated from completed website adoption.

Keep the preceding vendor manifest/assets and lockfile available for rollback. A rollback restores that coherent snapshot and its adapters together; it must not restore only an old token file underneath newer components. Prepare the normal review/preview handoff; deployment follows the site's existing release process.

**Definition of done:** a visitor moving from the website to the application recognizes the same kindling identity, type roles, paper surfaces, control language and manuscript treatment—and future shared changes have one maintained source in Press.
