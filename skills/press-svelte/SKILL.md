---
name: press-svelte
description: Adopt Press Svelte 5 components or its Tiptap page editor while preserving kindling’s existing stores, APIs and writing workflows
user-invocable: true
---

# Press Svelte adoption

## When to use

Use for application controls, dialogs, navigation, tags, search or manuscript editing. This is an incremental integration workflow, not a replacement app architecture.

## References

Locate the Press root; read `DESIGN.md`, `docs/APPLICATION_COMPONENTS.md`, the relevant `.svelte` source and its complete example in `reference/application/examples/`. These are under `../../` from this skill. Read `ui_kits/app/README.md` for the composed starting kit. Do not assume package-relative links remain filesystem-relative after pasting the skill elsewhere.

## How to use

1. Inspect the consuming component’s props, stores and service calls. Match an existing public export from `design-system/svelte/index.ts` and preserve those boundaries.
2. Load fonts, tokens and application CSS. Use Svelte 5 props and snippets. Keep values controlled where the app owns state and map callbacks explicitly.
3. Keep API calls, saving, file operations, desktop services and cursor tracking in the app. Document adapters; do not claim plug-and-play compatibility.
4. For rich prose use the existing app editor or the separate `svelte/editor` NovelEditor. Preserve HTML and active editor state, formatting, alignment, blockquotes, indentation and undo/redo. Never substitute Field’s multiline mode.
5. Use `onUpdate` for HTML changes, `onAttach` with cleanup for app integrations, and `shortcuts` for the existing shortcut adapter. Read the actual editor API before wiring these. The parent owns save status; do not label in-memory changes as saved.
6. Keep editors mounted across presentation changes when history must survive. Define scene replacement and remote-update behavior deliberately, without resetting content on each keystroke.
7. Provide keyboard paths, loading/error/empty/disabled states as required by the flow. Use existing components rather than hand-drawn controls.

The kit contains illustrative scenes and no backend. New imports must preserve the separate editor entry so core controls do not gain an unwanted Tiptap dependency. Follow the host’s current build and verification instructions.
