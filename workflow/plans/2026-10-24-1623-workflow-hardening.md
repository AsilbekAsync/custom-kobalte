# Workflow hardening: collisions, heartbeats, resources, plan tooling

- Status: done
- Owner: ses_e9270725fffeprbt6cYbkmhyKs
- Created: 2026-10-24 16:23
- Updated: 2026-10-24 16:33
- Locks: none
- Locks released: yes (this plan's lock released last)

## Goal

Harden the shared agent workflow so concurrent sessions can coordinate safely:

- collision-free lock names
- heartbeat/stale handling and pruning
- wait/run helpers
- resource locks for dev server, builds, and dependency installs
- plan creation and status tooling

## Scope

- `workflow/lock`: add `touch`, `prune`, `--wait`, `run`, resource names,
  age/stale reporting, and hash-suffixed lock directories.
- `workflow/plan`: create plans from the template.
- `workflow/status`: summarize plans and active locks.
- Update `workflow/README.md`, `workflow/plans/_template.md`, `AGENTS.md`, and
  `.gitignore` as needed.
- Do not touch app code, package manifests, or files locked by other sessions.

## Steps

- [x] Acquire locks for workflow files, AGENTS.md, and .gitignore.
- [x] Rewrite `workflow/lock` with backward-compatible legacy lock naming.
- [x] Add `workflow/plan` and `workflow/status`.
- [x] Update docs, template, and ignore rules.
- [x] Exercise acquire/conflict/wait/run/touch/prune/legacy-release paths.
- [x] Release locks and record the outcome.

## Verification

- [x] `bash -n workflow/lock workflow/plan workflow/status`
- [x] `workflow/lock --help`
- [x] Collision test: `tmp/collision/a/b.ts` and `tmp/collision/a__b.ts`
      produced distinct hash-suffixed lock directories.
- [x] Legacy release test with old-style lock directories, including
      same-owner touch/release and foreign-owner `--force`.
- [x] `--wait` failure test and delayed-release success test.
- [x] `run` success/failure tests and `@build`/`@deps` resource tests.
- [x] `workflow/plan new` and `workflow/status` tests. The generated test plan
      was removed afterward.
- [x] `workflow/lock list` shows age and stale information.
- [ ] `npx tsc --noEmit` (not run: docs/scripts only)
- [ ] `npx vitest run` (not run: docs/scripts only)
- [ ] `npm run build` (not run: docs/scripts only)

## Outcome

- Changed files: `AGENTS.md`, `workflow/README.md`, `workflow/lock`,
  `workflow/plan` (new), `workflow/status` (new),
  `workflow/plans/_template.md`, and this plan. `.gitignore` was locked but did
  not require a change.
- Commands run: syntax checks for all three scripts; lock acquire/status/touch/
  release; collision, legacy-name, heartbeat, wait, run, resource, and prune
  tests; `workflow/plan new`; `workflow/status`; final lock list.
- Results / follow-ups: new locks use
  `p__<basename>__<path-hash>.lock`, while old `p__<path>.lock` directories
  remain readable, touchable, and releasable by path. Lock commands are
  advisory only; no editor hook or plugin enforcement exists yet. `.gitignore`
  contains a trailing `tmp/` rule that also ignores `tmp/README.md`; it was left
  untouched because another session may have added it intentionally. Drop that
  rule if the README should be tracked.
