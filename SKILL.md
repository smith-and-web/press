---
name: press
description: Use the Press design system to create or update kindling interfaces, select existing patterns, and preserve its editorial visual language
user-invocable: true
---

# Build with Press

## When to use

Use for a website, application surface or component explicitly using Press or kindling. Do not apply it to unrelated brands or to generic repository operations.

## What is inside

`DESIGN.md` defines the visual language. `design-system/tokens.css` is the token source. `components.html` is the compact fixture; `index.html` has the complete working catalog. `preview/` isolates visual families; `ui_kits/app/` is a composed Svelte starting point. `SKILLS.md` lists focused workflows.

## Source context

Press is the sole editing authority; the sibling `brand-assets` is retired. Open Design copies are downstream. Resolve paths from the Press package root. If this skill is pasted into an integration without its files, locate the selected Press design-system folder or linked repository first. Never invent an installation path or assume these references were loaded automatically. Start with `DESIGN.md`, then read only the component API or example needed by the task.

## How to use

1. Identify the surface: foundation, opt-in website, application controls, or rich editor. Preserve the user’s existing layout and behavior when editing.
2. Read `DESIGN.md` and the relevant source example. Choose a public component before building a duplicate.
3. Load local fonts and canonical tokens; add the appropriate CSS entry. Avoid the global reset when incrementally styling an existing app.
4. Build with semantic variables, measured reading columns, actual component props and callbacks. Keep app services in the consuming app.
5. Make state transitions and keyboard behavior real. Preserve rich HTML and editor history. State any local-only behavior honestly.
6. Follow the host’s active workflow for builds and verification. Do not install this skill, publish, or change runtime settings as a side effect of UI work.

## Brand spelling

Always write `kindling` in lowercase, even in headings and at sentence starts. Use the current lowercase outlined wordmark and lockups. Do not apply uppercase styling to the name.

## Design-system highlights

Fraunces display, Newsreader prose, Inter controls; warm paper, dark ink and restrained terracotta. Dark chrome retains a light manuscript. A prose editor is a page with WYSIWYG capabilities, never a textarea. Follow `USAGE.md` for imports and `docs/OPEN_DESIGN.md` for package handoff.
