# Install Tabler icons

- Status: done
- Owner: OpenCode session (DeepSeek V4.1 Flash Free)
- Created: 2026-10-24 16:22
- Updated: 2026-10-24 16:26
- Locks: package.json, package-lock.json, vite.config.ts, src/vite-env.d.ts, src/App.tsx

## Goal

Make Tabler icons available as on-demand Solid components in the Vite app, with
one visible icon as a smoke test.

## Scope

- Add `unplugin-icons` and `@iconify-json/tabler` as dev dependencies.
- Configure the Solid compiler for unplugin-icons in `vite.config.ts`.
- Add the Solid icon component types to `src/vite-env.d.ts`.
- Render one Tabler icon next to the heading in `src/App.tsx`.
- Out of scope: the official `@tabler/icons-solidjs` package, which targets
  Solid 1 and imports the removed `splitProps` API.

## Steps

- [x] Acquire locks for shared files.
- [x] Install `unplugin-icons` and `@iconify-json/tabler` with npm.
- [x] Configure `Icons({ compiler: 'solid' })` in Vite.
- [x] Add `unplugin-icons/types/solid` to the Vite environment types.
- [x] Import `~icons/tabler/home` and render it in `src/App.tsx`.
- [x] Run typecheck, tests, and production build.
- [x] Release locks and record the outcome.

## Verification

- [x] Scoped `npx tsc --noEmit` over `src` (temporary config)
- [x] `npx vitest run src`
- [x] `npm run build`
- [x] Temporary render smoke test for `IconHome`

## Outcome

- Changed files:
  - `package.json`, `package-lock.json`
  - `vite.config.ts`
  - `src/vite-env.d.ts`
  - `src/App.tsx`
  - `workflow/plans/2026-10-24-1622-install-tabler-icons.md`
- Commands run:
  - `npm install --save-dev unplugin-icons @iconify-json/tabler`
  - `npx tsc --noEmit -p tmp/tabler-tsconfig.json` (temporary scoped config)
  - `npx vitest run src`
  - `npx vitest run tmp/tabler-icons.smoke.test.tsx` (temporary smoke test)
  - `npm run build`
  - `npx tsc --noEmit` (root config)
- Results / follow-ups:
  - Installed `unplugin-icons@24.0.0` and `@iconify-json/tabler@1.2.42`.
  - `src` typecheck, source tests, icon smoke test, and production build pass.
  - The production bundle contains the Tabler home SVG path and the demo classes.
  - The bundled `unplugin-icons` Solid declarations target `solid-js`'s old
    `ComponentProps`, so `src/vite-env.d.ts` declares a Solid 2-compatible
    `~icons/*` module using `@solidjs/web` types.
  - Root `npx tsc --noEmit` currently sees the concurrent
    `tmp/kobalte-smoke.test.tsx` and fails because `@kobalte/core` is not
    installed. That file is outside this task; the scoped check passes.
  - Did not install `@tabler/icons-solidjs`; it still targets Solid 1 and uses
    the removed `splitProps` API.
