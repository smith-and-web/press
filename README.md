# kindling / Press

Portable design-system source · **0.13.0** · `@kindling/design-system`

**Press is the definitive kindling design system.** The legacy `brand-assets` is retired. Read [the consolidation decisions](docs/CONSOLIDATION.md) and [asset usage](assets/README.md). Open Design is a downstream copy; shared changes start here.

Public source repository: [smith-and-web/press](https://github.com/smith-and-web/press).

Open **index.html** directly in a browser for the standalone reference. It uses local CSS, JavaScript, logos, and fonts; no server, installation, network request, or framework is required. Keep this folder together when moving it.

## Install locally

From this package root, with Node 20 or newer and npm installed:

```sh
npm pack
```

This creates `kindling-design-system-0.13.0.tgz`. Put the archive inside your consumer repository, for example `vendor/`, then run from that repository:

```sh
npm install --save-exact ./vendor/kindling-design-system-0.13.0.tgz
```

The package keeps `private: true` to prevent npm registry publication. Public GitHub hosting does not imply a published npm package or an open-source license. The prebuilt HTML reference needs no installation. Svelte consumers use the optional Svelte peer; the WYSIWYG editor entry additionally uses optional Tiptap peers. Node is required for rebuilding the reference and package tooling.

For a CSS-aware bundler:

```css
@import "@kindling/design-system";
```

For plain HTML, copy this folder into `vendor/kindling-design-system/` inside your site:

```html
<link rel="stylesheet" href="./vendor/kindling-design-system/design-system/index.css">
```

This full entry applies the existing global reset and element styles. Existing applications can instead adopt fonts and tokens first. See [integration guidance](docs/INTEGRATION.md).

## Contents

- `design-system/`: canonical CSS tokens, generated JSON, reusable foundation, website and application CSS, local font declarations, aggregate CSS entry and generator.
- `assets/`: original source SVG, logo variants, PNGs, favicons, app icons, social art, fonts and optional maintenance scripts.
- `index.html` and `reference/`: standalone reference and its presentation assets.
- `docs/`: current Press guide, integration, governance, migration, provenance and baseline records.
- `licenses/`: retrieved font OFL notices and the bundled Fraunces embedded notice.

## Maintain

```sh
npm run tokens:generate
npm run tokens:check
```

Edit `design-system/tokens.css`, never the JSON mirror. Token names and the JSON `light` / `dark` schema are the compatibility API. Component selectors are also public API.

Read [governance and release](docs/GOVERNANCE.md), [migration](docs/MIGRATION.md), [Press rules](DESIGN.md), and [provenance](docs/PROVENANCE.md) before changing shared values.

## Rights and scope

Font license texts are bundled. The source repository did not supply a license grant for kindling artwork or design-system code; `UNLICENSED` does not assign an open-source license. See [LICENSE.md](LICENSE.md). This repository publishes the Press package. The original kindling application and website repositories are separate and unchanged.

The token generator also refreshes `reference/tokens.js`, the browser-readable mirror used by the offline token explorer. It is generated from the same CSS in the same command; the drift command covers both mirrors. Do not hand-edit it.

## Website components (0.2.0)

The reference now separates **Website** and **Application**. The website catalog contains twelve reusable patterns drawn from the linked website code and editorial redesign, with live examples, copyable markup and source notes. The application section preserves the existing control, prose and feedback examples.

Website styles are optional and are not added to the root CSS entry:

```css
@import "@kindling/design-system/fonts.css";
@import "@kindling/design-system/tokens.css";
@import "@kindling/design-system/website.css";
```

```js
import '@kindling/design-system/website.js';
```

Wrap the relevant surface in `.press-web`. This is an explicit **light** website theme with Inter website copy, Fraunces headings and Newsreader manuscript prose. The shared canonical tokens are unchanged. See [website APIs and specimens](docs/WEBSITE_COMPONENTS.md).

## Svelte application components

The optional `@kindling/design-system/svelte` entry provides 22 Svelte 5 components. Import `application.css` after fonts and tokens. The root CSS entry and Website APIs remain unchanged.

Open the Application section in `index.html` for 12 working recipes and all 147 original reference baselines. The distributed browser bundle is already compiled; opening the reference does not require Svelte or Node. Rebuild it with `npm install` and `npm run reference:application`.

See [Application components](docs/APPLICATION_COMPONENTS.md) for props, example source, baseline mappings, and incremental adoption without replacing existing stores, APIs, or editors.

## Prose editor

The optional `@kindling/design-system/svelte/editor` entry exports `NovelEditor` and `ProseToolbar`. It preserves page-like manuscript presentation, rich HTML, formatting, and undo/redo. See [editor APIs and app adapters](docs/APPLICATION_COMPONENTS.md#page-like-wysiwyg-prose).

## Clone and develop

```sh
git clone git@github.com:smith-and-web/press.git
cd press
npm install
npm run reference:application
```

The committed browser bundle is ready to open through `index.html`. Keep generated reference files alongside their editable sources.


## Open Design package

Use existing-package installation when available; the source-extraction wizard is a different workflow and can substitute generic defaults for a folder-only input. [DESIGN.md](DESIGN.md) is the current design brief, [SKILLS.md](SKILLS.md) indexes four portable skills, and [the setup guide](docs/OPEN_DESIGN.md) explains the native manifest, local import and skill handoff. Skills are provided for you to add through Integration → Skills; they are not installed automatically.

The package includes generated `tokens.css` and `colors_and_type.css`, a compact [component fixture](components.html), eight focused pages in `preview/`, and a working [Svelte application kit](ui_kits/app/index.html). The kit retains page-style WYSIWYG prose and keeps edits in memory. The full catalog, source context, baseline images and licensed local fonts remain in the repository.

Use `npm run open-design:build` after changing its source inputs. See [USAGE.md](USAGE.md) for the reuse workflow and entry selection. Keep all local assets with the package; the source CSS remains authoritative. No Open Design runtime installation or import audit is implied by these files.


### Recovering from a generic “Product” extraction

See [the diagnosis](docs/OPEN_DESIGN_DEBUG.md) and [recovery instructions](docs/OPEN_DESIGN.md). For the constrained extraction fallback, paste the complete [OPEN_DESIGN_INPUT.md](OPEN_DESIGN_INPUT.md) into the DESIGN.md input rather than selecting the whole folder without a brief. This is a generated light-theme brand summary, not a transfer of the complete library. Rebuild it and DESIGN.md metadata with `npm run open-design:metadata`. Use the synchronization procedure in `docs/OPEN_DESIGN.md` to refresh the installed system and its guidance after rebuilding.
