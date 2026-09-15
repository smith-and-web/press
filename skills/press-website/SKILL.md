---
name: press-website
description: Compose or modify Press website sections using the existing editorial patterns and opt-in website APIs
user-invocable: true
---

# Press website surfaces

## When to use

Use for kindling marketing pages, release notes, download sections and sign-up flows. For application UI use press-svelte instead.

## References

From the Press root, read `DESIGN.md`, `docs/WEBSITE_COMPONENTS.md` and the selected item in `reference/website-snippets.json`. In this checkout they are at `../../DESIGN.md`, `../../docs/WEBSITE_COMPONENTS.md` and `../../reference/website-snippets.json`. If pasted elsewhere, locate the Press package before resolving them.

## How to use

- Select the existing pattern: navigation, hero, writing demo, trust strip, section heading, aligned features, releases, downloads, signup, disclosure, closing action or footer.
- Load fonts and tokens followed by `website.css`; wrap the surface in `.press-web`. Load `website.js` when using its behaviors and follow its initialization/cleanup API.
- Preserve the scoped light palette, Fraunces headings, Inter website copy and Newsreader writing samples. Do not change canonical prose tokens to match website copy.
- Reuse the actual snippet and adapt destinations and copy to the user’s brief. Connect downloads to actual supplied files; do not invent binaries or signup endpoints. Local demonstrations must say what they do.
- Keep editorial columns, full-frame reference images, original logo proportions and local assets. Follow intrinsic image dimensions and meaningful alt text.
- Include narrow layouts, visible focus, complete form feedback and native disclosure behavior. Use the host’s current verification rules.

Use `preview/components-website.html` for a focused specimen and `index.html#website-components` for all patterns. Do not widen a local change into a redesign.
