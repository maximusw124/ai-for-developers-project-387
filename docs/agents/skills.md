# Skills

The engineering skills from the first project (`maximusw124/ai-for-developers-project-386`) are vendored into this repository under `.agents/skills/`. They are committed, so no install step is needed on a fresh GitHub Actions runner: `actions/checkout` makes them available immediately.

## Discovery

- OpenCode discovers project skills from `.agents/skills/` automatically (project compatibility source).
- `opencode.json` also registers `./.agents/skills` explicitly as a skill source, so the same skills are available even if discovery rules change.
- Each skill is a directory containing `SKILL.md`; the directory name is the skill ID (for example `triage`, `to-tickets`, `code-review`, `tdd`, `implement`, `research`, `wayfinder`).
- Additional files next to `SKILL.md` (references, scripts, templates) are read only when the skill instructs the agent to read them.

## Usage rules

- Before using a skill, load it with the `skill` tool by its exact ID and follow its `SKILL.md`.
- Skills that assume a tracker read `docs/agents/issue-tracker.md`; the tracker is repo `maximusw124/ai-for-developers-project-387`, not the first project.
- Skills that reason about domain language read `docs/agents/domain.md` and `GLOSSARY.md`.
- Do not modify vendored skills as part of a feature change; update them deliberately as a separate `chore` change.

`skills-lock.json` records the upstream source and hash of each vendored skill.
