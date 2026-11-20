# Issue tracker: GitHub

Issues, specs and tickets for this continuation project live in **GitHub Issues of `maximusw124/ai-for-developers-project-387`**. Use the `gh` CLI for all operations.

On a fresh runner there is no configured remote. Pass the repo explicitly, or verify the remote first:

```bash
gh repo view --repo maximusw124/ai-for-developers-project-387
gh issue list --repo maximusw124/ai-for-developers-project-387 --state open
```

Never file issues into `maximusw124/ai-for-developers-project-386`: that first project is only the source of the skills and the original spec. The current tracker is always repo **387**.

## Conventions

- **Create an issue**: `gh issue create --repo maximusw124/ai-for-developers-project-387 --title "..." --body "..."`. Use a heredoc for multi-line bodies.
- **Read an issue**: `gh issue view <number> --repo maximusw124/ai-for-developers-project-387 --json number,title,body,labels,comments`.
- **List issues**: `gh issue list --repo maximusw124/ai-for-developers-project-387 --state open --json number,title,body,labels,comments --jq '[.[] | {number, title, body, labels: [.labels[].name], comments: [.comments[].body]}]'` with appropriate `--label` and `--state` filters.
- **Make an issue a sub-issue of a parent**: `gh issue create --parent <parent> ...`, or `gh issue edit <parent> --add-sub-issue <child>` afterwards (`gh` 2.94+). Older `gh`: `gh api --method POST repos/maximusw124/ai-for-developers-project-387/issues/<parent>/sub_issues -F sub_issue_id=<child-db-id>`. Without sub-issues, put `Part of #<parent>` at the top of the child body.
- **Blocking**: GitHub's native issue dependencies are canonical. Add an edge with `gh issue edit <child> --repo maximusw124/ai-for-developers-project-387 --add-blocked-by <blocker>` (`gh` 2.94+). Older `gh`: `gh api --method POST repos/maximusw124/ai-for-developers-project-387/issues/<child>/dependencies/blocked_by -F issue_id=<blocker-db-id>`, where the id is the blocker's numeric database id, not `#number`. Where dependencies aren't available, fall back to a `Blocked by: #<n>` line at the top of the child body. A ticket is unblocked when every blocker is closed.
- **Count open blockers**: `gh api repos/maximusw124/ai-for-developers-project-387/issues/<n> --jq .issue_dependencies_summary.blocked_by` (0 means startable).
- **Comment on an issue**: `gh issue comment <number> --repo maximusw124/ai-for-developers-project-387 --body "..."`.
- **Apply / remove labels**: `gh issue edit <number> --repo maximusw124/ai-for-developers-project-387 --add-label "..."` / `--remove-label "..."`.
- **Close**: post the explanation with `gh issue comment ...`, then `gh issue close <number> --repo maximusw124/ai-for-developers-project-387`.

In a local checkout `gh` infers the repo from `git remote -v`, which points at `maximusw124/ai-for-developers-project-387`. In CI always use `--repo` explicitly.

## Pull requests as a triage surface

**PRs as a request surface: no.** _(Set to `yes` if external PRs should enter the triage queue.)_

GitHub shares one number space across issues and PRs, so a bare `#42` may be either: resolve with `gh pr view 42 --repo maximusw124/ai-for-developers-project-387` and fall back to `gh issue view 42`.

## When a skill says "publish to the issue tracker"

Create a GitHub issue in `maximusw124/ai-for-developers-project-387`.

## When a skill says "fetch the relevant ticket"

Read it as in **Read an issue** above.

## Wayfinding operations

Used by `/wayfinder`. The **map** is a single issue with **child** issues as tickets.

- **Map**: a single issue labelled `wayfinder:map`, holding the Notes / Decisions-so-far / Fog body.
- **Child ticket**: an issue linked to the map as a GitHub sub-issue. Labels: `wayfinder:<type>` (`research`/`prototype`/`grilling`/`task`). Once claimed, the ticket is assigned to the driving dev.
- **Blocking**: see **Blocking** under Conventions.
- **Frontier query**: list the map's open children, drop any with an open blocker or an assignee; first in map order wins.
- **Claim**: `gh issue edit <n> --repo maximusw124/ai-for-developers-project-387 --add-assignee @me`.
- **Resolve**: `gh issue comment <n> --body "<answer>"`, then `gh issue close <n>`, then append a context pointer to the map's Decisions-so-far.
