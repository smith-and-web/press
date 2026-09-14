# Asset provenance

## Baseline

Source: the user-supplied Kindling `brand-assets` working tree.
Branch: `design-system/audit-followups`.
HEAD: `6e184f445b98084358774e147843c49d10c07a12`.

`BASELINE.json` records the observed dirty status, source-relative paths, copied destinations, and SHA-256 values of source inputs at copy time. Those hashes identify inputs, not a later output verification. Modified inputs were `DESIGN_GUIDE.md`, `components.css`, `tokens.css`, and `tokens.json`. The generator and design-system workflow were untracked. `BASELINE_WORKFLOW.yml` records that workflow as historical reference; it is not an active workflow in this package.

The working tree, including these changes, was used intentionally. No source Git status was cleaned, stashed, committed, pushed, or changed.

## Original artwork

- `assets/source/kindling-source.svg`: original flat mark source supplied by the user.
- `assets/svg/`: existing mark, outlined wordmark, stacked lockup, mono and reversed variants.
- `assets/png/`, `assets/favicon/`, `assets/app-icons/`, `assets/social/`: existing generated files, copied without regeneration.
- Wordmark recipe in the source: Fraunces axes `opsz 144`, `wght 540`, `SOFT 16`, `WONK 0`.

No new mark geometry, substitute brand image, AI image, or new logo license was created. The source documentation describes mechanical generation but does not provide a project-wide artwork or code license. Rights and trademark permission remain unspecified; see `../LICENSE.md`.

## Fonts

The original `Fraunces[SOFT,WONK,opsz,wght].ttf` was copied unchanged. The source build script identifies its upstream as https://github.com/undercasetype/Fraunces, but supplies no pinned upstream commit. Its input SHA-256 is in `BASELINE.json`. Its embedded name table identifies copyright 2020, Phaedra Charles and Flavia Zimbardi, and SIL OFL 1.1. The embedded notice is retained separately.

Inter upright/italic and Newsreader upright/italic were acquired from the Google Fonts repository, pinned to the commit in `FONT_SOURCES.json`. Fraunces, Inter, and Newsreader OFL.txt files were acquired from that same pinned repository snapshot. `FONT_SOURCES.json` records exact source URLs, retrieval date and SHA-256 digests for all fetched inputs.

The current upstream Fraunces OFL notice carries copyright 2018 while the existing binary says 2020. Both are preserved; no assertion is made that the current upstream notice was the exact file originally accompanying that binary. The font's embedded license declaration is available evidence. No missing brand permission is inferred from the fonts' licenses.

The package uses the original full TTFs, not generated subsets or conversions. Inter and Newsreader support upright and italic; Fraunces is upright only. Canonical fallback stacks remain present.

## Adaptations

`components.css` and `tokens.css` are preserved. JSON is regenerated from CSS with the existing generator. New package and font entries supply relative paths. The current guide changes governance references but preserves visual rules; the baseline guide remains historical evidence.

Maintenance script adaptations: raw palette lookup from canonical tokens, no automatic font download, no sibling-repository instruction, optional macOS iconutil, and explicit Pillow dependency. No optional asset builds were run. Python tool versions were not pinned in the source and have not been represented as reproducible here.

All reference interactions are local examples. The chapter form does not send data to a service, and no consumer application or remote registry was integrated by this delivery.

The token generator is additionally extended to emit `reference/tokens.js` from the same CSS result, keeping the offline reference inventory in step with JSON. The check command covers both generated mirrors.

## Website expansion — 0.2.0

`WEBSITE_SOURCES.json` records the website's observed HEAD and dirty status, source hashes for consulted website components and the linked redesign HTML, and the four images copied into `assets/website/`. Images were copied without transformation and their PNG intrinsic dimensions were read before source layout was written.

These are existing screenshots of Kindling from the user-linked redesign. No replacement product images were generated. No new artwork or screenshot license was inferred. Existing rights caveats remain in effect. The website footer's MIT label refers to the app and was not treated as a license for the separate brand package.

The website examples reuse selected prose from the supplied redesign as sample content, not live application data. Versioned product claims, download sizes, and audience counts are omitted. The source diagram and font roles are mapped in WEBSITE_COMPONENTS.md. Both linked projects remain untouched.
