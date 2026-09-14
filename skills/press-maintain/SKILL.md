---
name: press-maintain
description: Maintain Press tokens, component APIs, documentation and generated Open Design package files without creating competing sources of truth
user-invocable: true
---

# Maintain Press

## When to use

Use when changing a shared token, public component, design rule or package artifact. Do not use for installing skills or changing Open Design’s runtime configuration.

## References

Read `DESIGN.md`, `docs/GOVERNANCE.md`, `package.json` and `docs/OPEN_DESIGN.md` from the Press root (`../../` in this checkout). Resolve the package location explicitly when this skill is pasted independently. Treat `docs/BASELINE_DESIGN_GUIDE.md` as historical evidence.

## How to use

1. Bound the affected token/API and its consumers. Preserve unrelated website, application and editor behavior. State breaking changes explicitly.
2. Edit only authoritative source: canonical CSS for tokens, component source for behavior, `DESIGN.md` for design rules, and generation templates for derived files.
3. For token changes run `npm run tokens:generate`. For website or catalog changes use their existing generation scripts. Run `npm run open-design:build` for the root import copies, focused previews and application kit. Do not hand-edit generated mirrors or bundles.
4. Update complete examples and API guidance alongside public changes. Keep the root import manifest paths and package files list aligned, including local fonts and license notices.
5. Follow the active host’s verification policy. Do not claim a preview, test or import succeeded unless it actually did. Generation and successful import are different facts.
6. Record an appropriate version and changelog entry. Preserve `private: true` and `UNLICENSED` unless the user explicitly changes publishing or licensing policy. Commit/publish only within the user’s authorized repository scope.

Do not edit frozen `.od-skills` copies, install this proposal, overwrite a consumer’s stores, or create a second hand-maintained palette. Keep root `index.html` as the reference entry and retain all existing component examples and baseline assets.
