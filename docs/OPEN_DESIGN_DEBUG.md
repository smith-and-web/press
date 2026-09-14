# Open Design local extraction diagnosis

Investigated 2026-09-14 against the installed desktop build and its saved extraction inputs. This report records source tracing and the existing failed run. It is not a new browser test, parser test, import run or runtime repair.

## Finding

The creation workflow generated a generic DESIGN.md seed and sent it to the Markdown brand extractor instead of reading the DESIGN.md in the selected repository. The extractor then finalized that generic seed as a ready design system. A separate file-count cap truncated the browser-selected repository snapshot.

The user's Press clone was at commit `2741d3ca80ce069fede52ff91cb130b0b7a40a41` (0.4.0). The copied root DESIGN.md and manifest.json matched the clone byte for byte. Their identities were Press and `press`; the source package did not rename itself Product.

## Evidence from the failed run

Paths below are relative to Open Design’s release-stable data directory; no credentials or full private source logs are included.

| Evidence | Observation |
| --- | --- |
| `projects/brand-product-85c604/context/input-DESIGN.md` | Synthetic input declares `name: "Product"`, white background, blue accent, and Inter display/body. Description and overview contain a list of filenames. |
| `projects/brand-product-85c604/context/local-code/press/DESIGN.md` | The actual 8,429-byte Press brief was copied intact. It was context, not the selected extraction input. |
| `projects/brand-product-85c604/context/local-code/press/manifest.json` | The actual 2,011-byte native manifest was copied intact with `id: press`, `name: Press`, and verbatim import mode. |
| `projects/brand-product-85c604/context/source-context.md` | Canonical title is Product Design System; company context is empty; no local folder path or GitHub source was linked. Files were browser-selected snapshots. |
| Copied local-code snapshot | Exactly 120 files, including 86 PNG baselines. Root token copies exist, but `design-system/`, `assets/`, `skills/` and `ui_kits/` are absent. |
| `brands/product-85c604/meta.json` | `sourceUrl: designmd://product`, `status: ready`, `designSystemId: user:product`, `blocked: false`. |
| Activated system supplied to this conversation | Product, generic palette, Inter-only type and filename lists presented as brand voice. The same defaults also appear in saved Press/Product guidance. |

## Code path

The installed frontend is under `Resources/open-design-web-standalone/apps/web/.next/static/chunks/0.mdu2afq81fn.js`. These are minified function names and byte offsets in this specific bundle, not stable upstream source symbols.

1. Near byte offset 5,524,127, the creation handler chooses a synthetic Markdown seed when no website source or explicitly pasted DESIGN.md is present. The seed hard-codes the generic palette, Inter, 8px radius and default components.
2. `esg`/`esh` derive the title from company text, repository URLs or website URLs. With those absent they fall back to Product / Product Design System. They do not derive the title from a browser-selected folder’s manifest or DESIGN.md.
3. `es9` builds a source description containing `Local code:` followed by filenames. That text becomes the seed’s overview and description when company/notes are absent.
4. The handler calls `W.run(..., {designMd: o, ...})` with that seed. Staging the local files does not replace it with the repository’s actual brief.
5. `esX` filters/deduplicates browser-selected code files and applies `.slice(0,120)`. It does not prioritize the actual design-system source above the baseline images in this observed selection.

The daemon source is `Resources/app/prebundled/daemon/chunks/server-CQLNCSGE.mjs`:

- `brandFromDesignMd` near line 119058 parses the supplied Markdown. It cannot discover that a different DESIGN.md was copied elsewhere.
- `runProgrammaticExtraction` near line 142210 takes the nonempty `opts.designMd` branch, calls `brandFromDesignMd`, and passes the result to `finalizeBrandCore`. That explains the ready generic result without requiring a failure in Press’s source files.
- The default constants near line 119048 and the synthetic seed match the observed generic palette. In this run the seed explicitly supplies the defaults, so this is not merely a missing-color fallback inside the daemon parser.
- `/api/design-systems/install` near line 240158 is a separate existing-package installation path. It accepts a GitHub repository or local directory and delegates to `installFromTarget`. It does not run this brand-creation seed flow.

## Additional Press compatibility gap

Press 0.4.0 describes its fonts in prose and a table. `collectFonts` near line 119228 expects explicit typography metadata or narrowly recognized family declarations; it does not understand every Markdown table. A direct paste of the old full brief could therefore still lose typography. The color collector also flattens multiple theme colors into one candidate set, and the brand schema does not preserve the complete component implementation.

Press 0.4.1 adds generated frontmatter to DESIGN.md plus a focused `OPEN_DESIGN_INPUT.md`. The latter contains explicit light color roles and font families and avoids mixing dark hex values into the simplified extractor. It represents the translucent border as its solid appearance on paper. Canonical CSS retains the original rgba border, both themes and full font stacks. This fixes package-side clarity; it does not fix the creation handler or restore a truncated upload.

## Recommended Open Design fix

- Detect a supplied native manifest and root DESIGN.md before synthesizing a seed. Offer/use existing-package installation for a native package.
- If extraction is intended, read the actual selected DESIGN.md contents and canonical token source. Identify source authority explicitly.
- Do not label a generic seed as measured or extracted brand truth. Keep source-only jobs pending until source inspection occurs; do not register invented brand defaults as ready.
- Prioritize manifests, DESIGN.md, package metadata, token CSS, font declarations and component exports during bounded intake. Summarize or defer large baseline directories. Surface truncation prominently with the omitted source families.
- Ensure source evidence affects the extraction input, not only a later enrichment prompt. Avoid promoting filename lists into voice and messaging pillars.
- Reconcile provenance and saved brand guidance after a corrected extraction, rather than leaving old generic defaults attached to Press.

## Regression cases for maintainers

These are proposed cases, not tests run in this session:

- Folder-only selection with a Press manifest and DESIGN.md: identity and core tokens come from those files, not Product defaults.
- A repository with more than 120 files and many PNGs: required source files survive intake, and omitted assets are explicitly reported.
- Native-package installation: complete source, local assets and existing token names remain available.
- Explicit pasted input: display is Fraunces and body is Newsreader; report the separate UI font limitation instead of silently replacing it.
- Source-only material with no recognized brief: remain pending for inspection rather than claiming a ready measured system.
- A failed generic extraction followed by correction: active identity and saved guidance no longer supply the old generic palette.

## Recovery and boundaries

Follow [OPEN_DESIGN.md](OPEN_DESIGN.md). Prefer complete-package installation when available; use the focused paste input only as a constrained extraction fallback. Do not rename Product to Press and assume its contents are repaired.

The installed app, active Product record and saved runtime guidance were not modified. They are outside the session’s writable project. The package correction and this report are the deliverables; a successful native installation and correction of the active record remain to be performed in Open Design.
