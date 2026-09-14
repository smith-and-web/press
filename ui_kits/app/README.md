# Press application kit

A small, editable Svelte 5 writing workspace composed from the public Press library. Open `index.html` directly; its local `app.js` bundle needs no server. Select a scene, update its metadata, and edit page-style rich prose. Each scene keeps its own mounted editor and undo history while switching scenes. Content is illustrative and held in memory; reloading discards changes.

## Structure and files

- `index.html`: runnable shell loading `../../colors_and_type.css` and application CSS.
- `components/App.svelte`: scene state, workspace layout, theme and navigation wiring.
- `components/Sidebar.svelte`: scene NavigationTree and manuscript context.
- `components/SceneEditor.svelte`: Select controls, Checkbox and real NovelEditor.
- `components/main.ts`: Svelte mount entry.
- `components/layout.css`: responsive workspace composition.
- `app.js`: generated browser bundle; do not edit directly.

## Components

NavigationTree selects scenes. Select controls scene type and status. Checkbox locks editing. NovelEditor supplies the paper page, toolbar, rich HTML, word count and history. Button switches chrome theme. These are imported from the existing design-system source, not duplicated kit controls.

## Usage

Rebuild from the repository root with `npm run open-design:build`. Copy the Svelte files into your app and change repository-relative imports to `@kindling/design-system/svelte` and `/svelte/editor` after installing the package. Keep the three stylesheet entries: fonts, tokens and application CSS. Only consumers using the optional editor need Tiptap peers.

The parent owns state. Replace the local scene data with your existing store; connect HTML changes and editor attachment hooks through the documented adapters. Preserve each scene’s identity and do not remount editors simply to change presentation. Large manuscripts may need an app-owned editor-session strategy; this three-scene kit does not prescribe one.

## Design notes

Fraunces marks the manuscript hierarchy, Inter labels the controls, and Newsreader carries the prose. Sunken workspace chrome surrounds the light paper editor, including in dark mode. Sidebar content reflows above the manuscript on small screens; actions remain reachable and the page stays in normal flow. There is no fake saved state, remote service, download workflow or desktop API.
