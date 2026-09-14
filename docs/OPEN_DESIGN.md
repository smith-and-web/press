# Press in Open Design

## Import the design system

Use Open Design’s design-system import with `https://github.com/smith-and-web/press`, then select **Press** for the project. Alternatively import the absolute path of a local `press` checkout. Keep the folder name `press`: the native manifest id and imported folder name must agree. A local import needs the whole package, not a single DESIGN.md copied without its dependencies.

The repository provides the native `od-design-system-project/v1` manifest with `importMode: verbatim`. This preserves Press’s existing variable names and visual language. It does not request normalization into a generic palette. The package shape and GitHub/local entry requirements were derived from the installed Open Design importer source; no runtime installation or successful import is claimed by this delivery.

## What Open Design receives

| File | Responsibility |
| --- | --- |
| `manifest.json` | Native package identity, source entries, fonts and preview references |
| `DESIGN.md` | Current design direction and component constraints |
| `tokens.css` | Generated copy of canonical tokens |
| `colors_and_type.css` | Generated canonical tokens plus correctly rebased local font faces |
| `components.html` | Compact HTML fixture and working examples |
| `components.manifest.json` | Version 1 inventory derived from that fixture |
| `USAGE.md` | Consumer imports and scope choices |
| `preview/` | Seven focused, editable HTML specimens |
| `ui_kits/app/` | Svelte navigation, metadata controls and actual WYSIWYG editor |
| `SKILL.md`, `skills/`, `SKILLS.md` | Portable agent guidance, handed over separately |

`index.html` remains the single root reference entry. `components.html` is a supporting fixture, not a replacement catalog. Existing website specimens, all core application examples and baseline references remain available.

## Add skills

Open **Integration → Skills** and paste the selected markdown from `SKILLS.md`. Start with the root `press` skill and add a focused workflow when useful. These files have not been installed into your runtime and the design-system import does not establish skill installation. Keep the selected Press package or linked checkout accessible so an agent can resolve the referenced files. If a pasted skill cannot find the package, provide its actual location instead of inventing a runtime path.

## Source context and design conflicts

This package continues the existing Kindling source, screenshots and Press catalog. It intentionally uses paper/terracotta, Fraunces, Newsreader and Inter. An older saved white/blue Inter-only description is not the authority for this version. Selecting the package does not update saved memory automatically; reconcile stale project guidance explicitly if Open Design still supplies it.

Use `docs/PROVENANCE.md`, `docs/WEBSITE_COMPONENTS.md` and `docs/APPLICATION_COMPONENTS.md` for source mappings. Fonts and brand assets remain local and retain their notices. `docs/BASELINE_DESIGN_GUIDE.md` records history. Do not treat user-authored manuscript examples as third-party published content.

## Rebuild the handoff

With Node 20+ and package dev dependencies installed:

```sh
npm run tokens:generate
npm run reference:application
npm run open-design:build
```

Only rebuild the application catalog when its inputs changed. Website catalog regeneration uses `npm run reference:website`. The Open Design build uses canonical CSS, local fonts, fixture templates in `scripts/`, Svelte examples and kit source. It generates the root CSS copies, inventory, native manifest, seven previews and kit bundle. It does not rewrite the main reference or run a browser, tests or import audit. For an existing compatible toolchain, pass `--toolchain /absolute/path/to/project` after `--` in the npm command.

## Adoption boundaries

The prebuilt HTML works with local files; npm is needed for source compilation, not viewing. Svelte 5 is the core peer and Tiptap is isolated to the optional editor entry. The kit holds edits in memory and loses them on reload. It is a composition example, not a replacement for Kindling’s backend, stores, editor-session plumbing or file workflows. Read the editor adapters before integrating saving, shortcut settings or cursor tracking.

The public repository remains `UNLICENSED` and npm publication remains disabled. An importable package is not an open-source or brand-use license. Open Design UI wording and future manifest requirements may change; use the native importer’s error if a future version rejects the package rather than claiming compatibility was tested.
