<div align="center">

# acme-package

Fork-ready monorepo template for published TypeScript libraries. tsdown ESM builds, Vitest, oxlint/oxfmt, fallow, Changesets, Fumadocs, and a Vite demo, prewired.

</div>

## Quickstart

Prerequisites: Node ≥24, pnpm 11 (pinned via `packageManager`), and [portless](https://www.npmjs.com/package/portless) running as the local HTTPS proxy (the docs dev URL depends on it).

```bash
pnpm install
pnpm dev          # docs at https://acme-package.docs.localhost · demo at http://localhost:5173
pnpm test         # vitest across packages
pnpm build        # builds all workspaces (packages + docs)
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

The rename surface is small. Full walkthrough: docs → "Using this template".

1. `@acme` scope → your npm scope (`packages/*/package.json` + imports in `apps/`, including the docs `.mdx` content)
2. Repo identity: root `name`, `repository.url` in BOTH publishable packages (npm provenance validates it against the publishing repo, so a renamed fork's first release fails if skipped), `GITHUB_URL` + `SITE_ORIGIN` in `apps/docs/lib/site.ts`, the nav wordmark in `apps/docs/lib/layout.shared.tsx`, and `metadata.title` + `metadata.description` in `apps/docs/app/layout.tsx`
3. Portless name in the `apps/docs` dev script
4. LICENSE holder

## Releasing

Changesets: `pnpm changeset`, merge the auto-opened "Version Packages" PR, and `release.yml` publishes to npm with provenance (set `NPM_TOKEN`).

## Scripts

| Command                                                                | What                                                  |
| ---------------------------------------------------------------------- | ----------------------------------------------------- |
| `pnpm dev`                                                             | run all dev servers (turbo)                           |
| `pnpm build` / `pnpm test` / `pnpm test:coverage`                      | build / test across workspaces                        |
| `pnpm lint` / `pnpm format` / `pnpm format:check` / `pnpm typecheck`   | oxlint / oxfmt / tsc                                  |
| `pnpm fallow:dead` / `fallow:dupes` / `fallow:health` / `fallow:audit` | dead code / duplicates / health score / audit vs main |
| `pnpm changeset` / `version-packages` / `release`                      | Changesets flow                                       |

## Stack

pnpm 11.1.3 (pinned) · Node ≥24 · Turborepo · tsdown (ESM-only) · Vitest 4 · oxlint + oxfmt · fallow · husky + lint-staged · Changesets · Next 16 + Fumadocs · Vite 8
