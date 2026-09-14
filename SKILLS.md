# Press skills

These are portable instructions, not installed runtime plugins. Start with **press**; add a focused skill for the task at hand rather than loading every file.

| Skill | Use it for | Source |
| --- | --- | --- |
| press | Applying the system and choosing a pattern | [SKILL.md](SKILL.md) |
| press-website | Editorial site sections and their working behaviors | [SKILL.md](skills/press-website/SKILL.md) |
| press-svelte | Incremental Svelte 5 adoption and page-style prose | [SKILL.md](skills/press-svelte/SKILL.md) |
| press-maintain | Token, component and package maintenance | [SKILL.md](skills/press-maintain/SKILL.md) |

In Open Design, paste a chosen file through **Integration → Skills**. Keep Press available as the selected design system or linked source so the skill’s references can be resolved. These files do not modify `.od-skills`, Codex settings, or another app’s skill library. Importing the design system does not prove any skill was installed.

All relative references in the root skill start at the package root. Focused skill files use `../../` to reach that root. When pasted independently, use the named package-relative destinations, not the skill’s new runtime storage path. The skills defer to explicit user requirements and the active host workflow; they do not request additional approval for ordinary authorized edits.
