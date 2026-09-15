# Press in Open Design

## Maintained synchronization

Press is the sole editing authority. Use this existing-system workflow for an already connected personal Open Design project. It updates the complete package, registered brief, linked brand record and Press memory while retaining prior artifacts and creating a local backup.

1. Rebuild with `npm run open-design:build` and run `npm run system:check`.
2. Discover the current daemon URL and exact project/system IDs with the Open Design MCP. If its transport is unavailable, inspect the running local service and confirm the existing project through its API. Do not assume a fixed port or create another Press system.
3. Run `npm run open-design:sync -- --url <local-daemon-url> --project <existing-project-id> --system <existing-user-system-id>`.
4. Repeat with `--check` to verify all packaged files, installed manifest identity, registered brief, typography memory and current entry.

This workflow requires the installed local directory layout and personal ownership to match the daemon's records. It refuses team workspaces. It stores backups in ignored `.od-backups/` before writing; the folder contains prior project/system/brand files, API metadata and memory. The installed manifest adapts only its identity and source metadata to the existing system; all other package files are byte-identical. Earlier `system/` compatibility previews and review artifacts remain historical; `index.html` is the current reference. No regeneration from a seed palette is needed.

The script discovers paths from the current project, uses supported daemon APIs for permission checks, registered design-system updates, project metadata and memory, and copies package files locally. It preserves the existing system ID so bound projects keep using it. To restore, use the saved package directories and API payloads in the backup; do not delete the system or create a replacement ID.

## Choose installation or extraction (new installations)

Press is already a complete design-system package. **Installing that package** and **creating a new system by extracting source files** are different Open Design paths. The 0.4.0 instructions did not make this distinction clearly enough.

The investigated creation flow can synthesize a generic Product brief when a folder is selected without an explicit DESIGN.md input. Its browser upload also stops at 120 files; large baseline directories can crowd out components and fonts. Selecting the entire Press folder in that flow is not a reliable way to install this package. See [the diagnosis](OPEN_DESIGN_DEBUG.md) for evidence and implementation details.

### Complete-package installation

Use the existing-package installation capability when it is exposed by your Open Design build. Supply `https://github.com/smith-and-web/press` or the absolute path of a complete local `press` checkout. Keep the folder name `press`: the native manifest id and imported folder name must agree. Local installation uses the full directory; a browser-selected file snapshot is a different input.

The installed daemon has a dedicated `POST /api/design-systems/install` route accepting `{ "source": "github", "url": "https://github.com/smith-and-web/press" }` or `{ "source": "local", "path": "/absolute/path/to/press" }`. These are implementation references for an integration maintainer, not commands to run against an invented server address. The route requires local-origin and current workspace authority. No stable UI button label or successful installation is claimed here; if the UI only offers creation/extraction, do not assume it invokes this route.

The package’s `od-design-system-project/v1` manifest uses `importMode: verbatim`. A package-aware consumer can retain the existing entries and token names. This field cannot change the behavior of a creation path that never reads the manifest.

### Constrained extraction fallback

1. Open the repository’s [OPEN_DESIGN_INPUT.md](../OPEN_DESIGN_INPUT.md) and paste its **entire contents** into the extraction workflow’s DESIGN.md input. Enter Press as the product name if that field is used. Merely selecting the file as one item in a folder upload is insufficient.
2. Supply the real checkout path as linked source context when that capability is available, so the agent can read the whole repository. Avoid relying on the capped browser snapshot to transfer the component library. A GitHub URL can be supplied as repository context, but that alone does not prove the existing package was installed.
3. Treat the output as a brand summary requiring reconciliation with the canonical package. The input includes explicit light colors and display/body fonts, but the simplified brand extractor can omit the separate UI font, local assets, full theme rules and component implementations. Use the native package for those capabilities.
4. Select the corrected Press system only after its identity and actual values agree with the supplied source. The expected display/body fonts are Fraunces/Newsreader; Inter is the UI font. The expected light background is paper, not generic white, and the accent is terracotta, not blue.

This fallback avoids the known empty-brief defaults. It is not a tested guarantee of complete extraction fidelity.

### Recover an existing Product result

Keep the failed result available as evidence, but stop applying it to new Press work. Renaming it will not repair its tokens. Correct or replace the active selection using Open Design’s available system-management controls, then reconcile the generated Product/Press memory entries that still contain generic values. Repository changes do not automatically rewrite these records. That earlier extraction investigation did not modify runtime memory. The maintained synchronization workflow above explicitly refreshes Press memory.

## What Open Design receives

| File | Responsibility |
| --- | --- |
| `manifest.json` | Native package identity, source entries, fonts and preview references |
| `DESIGN.md` | Current design direction with generated compatibility metadata |
| `OPEN_DESIGN_INPUT.md` | Focused generated brief for the constrained paste-input fallback |
| `tokens.css` | Generated copy of canonical tokens |
| `colors_and_type.css` | Generated canonical tokens plus correctly rebased local font faces |
| `components.html` | Compact HTML fixture and working examples |
| `components.manifest.json` | Version 1 inventory derived from that fixture |
| `USAGE.md` | Consumer imports and scope choices |
| `preview/` | Eight focused, editable HTML specimens |
| `ui_kits/app/` | Svelte navigation, metadata controls and actual WYSIWYG editor |
| `SKILL.md`, `skills/`, `SKILLS.md` | Portable agent guidance, handed over separately |

`index.html` remains the single root reference entry. `components.html` is a supporting fixture, not a replacement catalog. Existing website specimens, all core application examples and baseline references remain available.

## Add skills

Open **Integration → Skills** and paste the selected markdown from `SKILLS.md`. Start with the root `press` skill and add a focused workflow when useful. These files have not been installed into your runtime and the design-system import does not establish skill installation. Keep the selected Press package or linked checkout accessible so an agent can resolve the referenced files. If a pasted skill cannot find the package, provide its actual location instead of inventing a runtime path.

## Source context and design conflicts

This package continues the existing kindling source, screenshots and Press catalog. It intentionally uses paper/terracotta, Fraunces, Newsreader and Inter. An older saved white/blue Inter-only description is not the authority for this version. Selecting the package does not update saved memory automatically; reconcile stale project guidance explicitly if Open Design still supplies it.

Use `docs/PROVENANCE.md`, `docs/WEBSITE_COMPONENTS.md` and `docs/APPLICATION_COMPONENTS.md` for source mappings. Fonts and brand assets remain local and retain their notices. `docs/BASELINE_DESIGN_GUIDE.md` records history. Do not treat user-authored manuscript examples as third-party published content.

## Rebuild the handoff

With Node 20+ and package dev dependencies installed:

```sh
npm run tokens:generate
npm run reference:application
npm run open-design:build
```

Only rebuild the application catalog when its inputs changed. Website catalog regeneration uses `npm run reference:website`. For only the compatibility metadata, run `npm run open-design:metadata`; this has no Svelte dependency and does not rebuild browser bundles. It regenerates the metadata tail of DESIGN.md and OPEN_DESIGN_INPUT.md directly from canonical CSS and public component exports, preserving the authored DESIGN.md body. Do not hand-edit these generated fields.

The full Open Design build also generates that metadata and uses canonical CSS, local fonts, fixture templates in `scripts/`, Svelte examples and kit source. It generates the root CSS copies, inventory, native manifest, eight previews and kit bundle. It does not rewrite the main reference or run a browser, tests or import audit. For an existing compatible toolchain, pass `--toolchain /absolute/path/to/project` after `--` in the npm command.

## Adoption boundaries

The prebuilt HTML works with local files; npm is needed for source compilation, not viewing. Svelte 5 is the core peer and Tiptap is isolated to the optional editor entry. The kit holds edits in memory and loses them on reload. It is a composition example, not a replacement for kindling’s backend, stores, editor-session plumbing or file workflows. Read the editor adapters before integrating saving, shortcut settings or cursor tracking.

The public repository remains `UNLICENSED` and npm publication remains disabled. An importable package is not an open-source or brand-use license. Open Design UI wording and future manifest requirements may change; use the native importer’s error if a future version rejects the package rather than claiming compatibility was tested.
