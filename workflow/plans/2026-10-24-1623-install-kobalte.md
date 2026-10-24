# Install Kobalte

- Status: done
- Owner: OpenCode session (DeepSeek V4.1 Flash Free)
- Created: 2026-10-24 16:23
- Updated: 2026-10-24 16:28
- Locks: package.json, package-lock.json (released)

## Goal

Add Kobalte to the app as a usable dependency for both source and tests, without
disturbing the Solid 2.0 RC toolchain.

## Scope

- Add `@kobalte/core` at the Solid 2 line (`2.0.0-alpha.4`, exact).
- Add npm `overrides` so Kobalte's stale exact peer pins
  (`solid-js`/`@solidjs/web` `2.0.0-rc.16`) resolve to the app's RC versions.
- Out of scope: building UI with Kobalte, routing changes, styling.
- `@kobalte/core` 0.13.x is Solid 1 only and is intentionally not used.

## Steps

- [x] Confirm compatibility: Kobalte 2.0 alpha targets Solid 2; stable 0.13
      peers on Solid 1.9.
- [x] Wait for the Tabler-icons agent to release `package.json` and
      `package-lock.json`, then acquire both locks.
- [x] Add the dependency and overrides to `package.json`.
- [x] Run `npm install` to update only the npm lock.
- [x] Run a throwaway smoke test from `tmp/` importing `Button` and `Switch`.
- [x] Run typecheck, test suite, and production build.
- [x] Release locks and record the outcome.

## Verification

- [x] `npm ls solid-js @solidjs/web @kobalte/core` exits 0
  - `@kobalte/core@2.0.0-alpha.4 overridden`; Solid packages deduped at
    `2.0.0-rc.18`.
- [x] `npx tsc --noEmit` — exit 0 (run with the smoke test present).
- [x] `npx vitest run` — 1 file, 2 tests passed (`Counter`).
- [x] `npm run build` — client and SSR builds completed.
- [x] Throwaway Kobalte render test passes, then file removed
  - `tmp/kobalte-smoke.test.tsx`: 2/2 passed (Button click, Switch toggle).
- [x] Extra: a scratch Vite 8 build of `<Button>`/`<Switch>` with
  `@solidjs/vite-plugin` `start: true` resolved the `solid` export condition
  and built cleanly (82 modules).

## Outcome

- Changed files:
  - `package.json`
  - `package-lock.json`
  - `workflow/plans/2026-10-24-1623-install-kobalte.md`
- Commands run:
  - `npm install --no-audit --no-fund` (added 30 packages)
  - `npm ls solid-js @solidjs/web @kobalte/core`
  - `npx vitest run tmp/kobalte-smoke.test.tsx`
  - `npx tsc --noEmit`
  - `npx vitest run`
  - `npm run build`
- Results / follow-ups:
  - Kobalte v2 alpha exports flat components, not compound namespaces:
    `import { Button } from '@kobalte/core/button'`,
    `import { Switch, Control, Input, Thumb } from '@kobalte/core/switch'`.
    There is no root `@kobalte/core` export in this release.
  - `Switch.Control` renders a `div`; render `Switch.Input` for the
    `role="switch"` element.
  - The overrides are required because both `@kobalte/core` and
    `@kobalte/utils` pin the exact RC they were built against. Remove them once
    Kobalte widens its peer ranges.
  - Keep `@kobalte/core` pinned exact until a newer alpha/stable explicitly
    supports the installed Solid RC.
