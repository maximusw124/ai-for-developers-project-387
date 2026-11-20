# Agent configuration

This directory is the per-repo configuration read by the engineering skills installed in `.agents/skills/`. It is committed to the repository so a fresh GitHub Actions runner gets the same setup as a local checkout.

| File | Purpose |
| ---- | ------- |
| [issue-tracker.md](issue-tracker.md) | GitHub Issues for `maximusw124/ai-for-developers-project-387` are the single source of truth for tickets and specs. |
| [skills.md](skills.md) | Where the first project's skills live and how OpenCode discovers them. |
| [triage-labels.md](triage-labels.md) | Mapping of canonical triage roles to label strings. |
| [domain.md](domain.md) | How agents consume `GLOSSARY.md` and `docs/adr/`. |

`opencode.json` registers `.agents/skills` as an explicit skill source and these files as instructions; `AGENTS.md` contains the short agent-facing summary.
