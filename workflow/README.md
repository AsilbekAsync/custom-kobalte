# Agent workflow

All agents working in this checkout share one working tree. Use this directory
to make work visible and to stop concurrent edits from colliding.

## Layout

- `plans/` — one plan per task. `workflow/plan new <slug> "title"` creates
  `YYYY-MM-DD-HHMM-<slug>.md` from `plans/_template.md`.
- `locks/` — transient lock directories managed by `workflow/lock`. Git-ignored;
  do not edit by hand.
- `../tmp/` — scratch files, downloads, logs, and generated fixtures. Never use
  the system `/tmp` for repo work. Prefer a per-session subdirectory such as
  `tmp/<session-id>/`, and clean it up when finished.

`workflow/status` prints every plan with its status/owner/update time, then the
active locks with their age and stale marker.

## Plan protocol

1. Before the first edit, create a plan:
   `workflow/plan new <slug> "short title"`. Fill in the goal, scope, and steps.
2. Set `Status: in-progress` while working. Use `blocked` if waiting on another
   agent, and record what you are waiting for.
3. Update the plan as work proceeds, including changed files and verification
   evidence.
4. Before finishing, set `Status: done` and `Locks released: yes`, and note any
   follow-ups or handoff details.
5. Keep the plan in the repo; do not delete it after the task.

## Lock protocol

Locks are advisory per-path directories, not filesystem-enforced locks. Every
agent must acquire a lock before writing a shared path and release it after.

```sh
workflow/lock acquire src/App.tsx "add layout outlet"
workflow/lock acquire package.json "add dependency" --wait 120
workflow/lock touch package.json
workflow/lock status package.json
workflow/lock list
workflow/lock run @build "typecheck" -- npx tsc --noEmit
workflow/lock prune --apply
workflow/lock release package.json
```

- Paths are repo-relative or absolute inside the repo. The script treats
  ancestor and descendant paths as conflicts, so locking `src/` blocks a lock
  on `src/App.tsx` too. Lock the narrowest path that covers your edit.
- If acquisition fails, do not edit that path: wait with `--wait <seconds>`,
  choose a non-overlapping path, or coordinate with the owner shown by
  `status`/`list`.
- Use resource locks for shared operations that are not a single file:
  `@dev-server`, `@build`, `@deps`, or another `@name`. Acquire them before
  starting a dev server, running a build, or installing dependencies.
- `run` acquires the lock, runs one command, and releases the lock on success
  or failure:
  `workflow/lock run @deps "install" -- npm install`.
- Long tasks should call `workflow/lock touch <path>` periodically. A lock is
  stale after 60 minutes by default; override with
  `WORKFLOW_LOCK_STALE_MINUTES`. `list` and `status` show age and staleness.
- `workflow/lock prune` is a dry run; `workflow/lock prune --apply` removes
  stale locks. Use `--force` on `release` only when you have confirmed the lock
  is stale.
- Releases are identity-checked against `AGENT_NAME` or
  `OPENCODE_SESSION_ID`. `workflow/lock whoami` shows the current identity.
- To avoid deadlocks, acquire multiple paths in lexicographic order and release
  them in reverse order.
- Read-only work needs no lock. Never edit a path covered by another agent's
  lock; legacy lock directories from the previous naming scheme remain
  readable and releasable by path.
- Locks are advisory only: they protect against cooperating agents, not against
  arbitrary processes or manual edits.

## Temporary files

Put every temporary artifact under `tmp/` and clean up when done. `tmp/` is
git-ignored except for its README, so it will not pollute the repository.
