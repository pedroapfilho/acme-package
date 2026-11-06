<div align="center">

# acme-package

Fork-ready monorepo template for published TypeScript libraries. tsdown ESM builds, Vitest, oxlint/oxfmt, fallow, Changesets, Fumadocs, and a Vite demo, prewired.

</div>

## Quickstart

Prerequisites: Node ≥24, pnpm 11 (pinned via `packageManager`), and [portless](https://www.npmjs.com/package/portless) running as the local HTTPS proxy (the docs and demo dev URLs depend on it).

```bash
pnpm install
pnpm dev          # docs at https://acme-package.docs.localhost · demo at https://acme-package.demo.localhost
pnpm test         # vitest across workspaces
pnpm build        # builds all workspaces
```

## Packages

| Package                   | Role                                                          |
| ------------------------- | ------------------------------------------------------------- |
| `@acme/core`              | Example framework-agnostic library (tiny typed store)         |
| `@acme/react`             | Example React adapter (`useStore` via `useSyncExternalStore`) |
| `@repo/typescript-config` | Shared tsconfig presets (internal)                            |
| `@repo/config-vitest`     | Shared Vitest presets + coverage thresholds (internal)        |

## Apps

| App              | Role                                                               |
| ---------------- | ------------------------------------------------------------------ |
| `apps/docs`      | Fumadocs site (`https://acme-package.docs.localhost` via portless) |
| `apps/demo-vite` | Vite playground consuming both packages via `workspace:*`          |

## Use this template

Fork it, then follow [Using this template](apps/docs/content/docs/using-this-template.mdx), also on the docs site. It covers the rename surface, publishing through Changesets and npm trusted publishing, and adding a package.

## Scripts

| Command                                                                | What                                                  |
| ---------------------------------------------------------------------- | ----------------------------------------------------- |
| `pnpm dev`                                                             | run all dev servers (turbo)                           |
| `pnpm build` / `pnpm test` / `pnpm test:coverage`                      | build / test across workspaces                        |
| `pnpm lint` / `pnpm format` / `pnpm format:check` / `pnpm typecheck`   | oxlint / oxfmt / tsc                                  |
| `pnpm fallow:dead` / `fallow:dupes` / `fallow:health` / `fallow:audit` | dead code / duplicates / health score / audit vs main |
| `pnpm changeset` / `version-packages` / `release`                      | Changesets flow                                       |

## Stack

pnpm (pinned) · Node ≥24 · Turborepo · tsdown (ESM-only) · Vitest 5 · oxlint + oxfmt · fallow · husky + lint-staged · Changesets · Next 16 + Fumadocs · Vite 8
