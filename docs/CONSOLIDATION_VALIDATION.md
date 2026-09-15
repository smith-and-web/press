# Consolidation validation — Press 0.9.0

## Source

- `npm run system:check`: generated JSON, browser token inventory, both root CSS mirrors, eight preview versions and manifest target files agree.
- All 45 production assets match their recorded SHA-256 values. The approved lowercase correction regenerates wordmark/lockup derivatives and metadata; original digests remain recorded. The source book/flame geometry and Fraunces font are unchanged.
- `node scripts/build-open-design.mjs --toolchain ../kindling`: completed using the available sibling toolchain; no Svelte compilation warnings.
- `npm run reference:website`: regenerated all twelve website patterns.
- `git diff --check`: passed.

## Browser

Inspected the original Press and legacy style guides and the new identity reference. Used local Chrome through Playwright for the main catalog, identity, controls and editor previews at 1440px, 768px and 375px (12 page/viewport combinations).

All twelve checks passed with local fonts loaded, decoded images, no horizontal page overflow and no JavaScript errors. The dark catalog keeps website surfaces on light paper. Long application button labels wrap; application hover retains foreground/background colors in both themes.

An initial phone-width check exposed responsive selectors that could not override the desktop writing-demo columns; those selectors were fixed and the full set passed again. An initially unloaded baseline image was confirmed as lazy-loaded and decoded successfully, not missing.

This is browser reference validation. It does not claim a full audit of every inherited component or a desktop application release test.

## Open Design

The existing Press project and registered system are refreshed in place through the documented synchronization workflow. Package files are compared byte-for-byte, with installed manifest identity and source metadata adapted to Open Design's existing system. Registered DESIGN.md, saved typography guidance and the default index.html entry are checked through the daemon API. Existing artifacts and prior state are retained in the local synchronization backup.

Run `npm run open-design:sync -- --url <discovered-local-url> --project <existing-project-id> --system <existing-user-system-id> --check` to repeat the installed-state verification. A disconnected or subsequently edited runtime must be verified again; this record does not imply automatic ongoing synchronization.

Consumer repositories have not been migrated or released. Their next step is replacing legacy sync inputs with a pinned Press package following MIGRATION.md.
