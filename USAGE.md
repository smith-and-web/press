# Using Press

## Choose an entry

Open `index.html` for the full reference, `components.html` for compact specimens, or `ui_kits/app/index.html` for the composed writing kit. The checked-in browser bundles and local fonts work without npm installation. Keep the package folder together.

For Open Design setup read `docs/OPEN_DESIGN.md`. For an agent, start with `DESIGN.md` and `SKILL.md` and then read the component API relevant to the task.

## Plain HTML

```html
<link rel="stylesheet" href="vendor/press/colors_and_type.css">
<link rel="stylesheet" href="vendor/press/design-system/application.css">
```

`colors_and_type.css` contains generated canonical variables and local font declarations, without a global reset. The existing `design-system/index.css` entry adds foundation element styles; choose it deliberately. Use relative paths from your page and keep `assets/fonts/` beside the package’s root CSS.

## Svelte 5

After installing a local archive as described in README:

```svelte
<script lang="ts">
  import '@kindling/design-system/fonts.css';
  import '@kindling/design-system/tokens.css';
  import '@kindling/design-system/application.css';
  import { Button } from '@kindling/design-system/svelte';
  let count = $state(0);
</script>
<div class="press-app">
  <Button onclick={() => count += 1}>Add a note</Button>
  <p>{count} local notes</p>
</div>
```

Core components use the optional Svelte peer. Import NovelEditor from `@kindling/design-system/svelte/editor` only when needed; install the Tiptap peer dependencies listed in package.json. The full kit source is in `ui_kits/app/components/`. Saving and application services are yours to connect, using the callbacks documented in `docs/APPLICATION_COMPONENTS.md`.

## Website

Load local fonts, tokens, `design-system/website.css` and, for interactive patterns, `design-system/website.js`. Use `.press-web` and the complete markup in `reference/website-snippets.json`. Follow `docs/WEBSITE_COMPONENTS.md` for behaviors and cleanup. The website treatment is opt-in and light themed.

## Themes and maintenance

Set `data-theme="dark"` on a containing element for dark application chrome. Prose remains light paper. Edit `design-system/tokens.css`, then regenerate derived files; root CSS mirrors are generated. Commands and source ownership are in `docs/GOVERNANCE.md`. Repository visibility does not change the license or npm publication policy.
