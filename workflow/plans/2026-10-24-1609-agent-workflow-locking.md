# Agent workflow: plans, locking, and repo-local tmp

- Status: done
- Owner: ses_e9270725fffeprbt6cYbkmhyKs
- Created: 2026-10-24 16:09
- Updated: 2026-10-24 16:11
- Locks: AGENTS.md, .gitignore, workflow

## Goal

Give concurrent agents a shared workflow: one plan file per task under
`workflow/plans/`, advisory per-path file locks, and a repo-local `tmp/` for
scratch work.

## Scope

- Add `workflow/README.md`, `workflow/plans/_template.md`, and the
  `workflow/lock` helper.
- Add `tmp/README.md` and ignore scratch files/lock state in `.gitignore`.
- Document the convention in `AGENTS.md`.
- No application code or dependency changes.

## Steps

- [x] Create `workflow/` and `tmp/` directory structure.
- [x] Implement `workflow/lock` with acquire/release/status/list and
      ancestor/descendant conflict checks.
- [x] Add plan template and workflow documentation.
- [x] Update `.gitignore` and `AGENTS.md`.
- [x] Exercise lock acquire, conflict, ownership, and release paths.

## Verification

- [x] `workflow/lock --help`
- [x] `workflow/lock acquire` / `status` / `list` / `release`
- [x] Duplicate and overlapping lock attempts fail as expected.
- [x] Foreign-owner release is rejected without `--force`.
- [ ] `npx tsc --noEmit` (not run: documentation/config only)
- [ ] `npx vitest run` (not run: documentation/config only)
- [ ] `npm run build` (not run: documentation/config only)

## Outcome

- Changed files: `AGENTS.md`, `.gitignore`, `workflow/README.md`,
  `workflow/lock`, `workflow/plans/_template.md`, `tmp/README.md`, and this
  plan.
- Commands run: the lock-script checks listed above.
- Results / follow-ups: application checks were skipped because no app code or
  dependencies changed. Future tasks should run the full verification loop from
  `AGENTS.md`.
