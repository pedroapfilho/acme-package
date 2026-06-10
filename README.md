<div align="center">

# acme-package

Fork-ready monorepo template for published TypeScript libraries. tsdown ESM builds, Vitest, oxlint/oxfmt, fallow, Changesets, Fumadocs, and a Vite demo, prewired.

</div>

## Quickstart

```bash
pnpm install
pnpm dev          # docs at https://acme-package.docs.localhost + vite demo
pnpm test         # vitest across packages
pnpm build        # tsdown dist for publishables
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
| `apps/demo-vite` | Vite playground consuming both packages from source                |

## Use this template

The rename surface is small. Full walkthrough: docs → "Using this template".

1. `@acme` scope → your npm scope (`packages/*/package.json` + imports in `apps/`, including the docs `.mdx` content)
2. Repo identity: root `name`, `repository.url` in BOTH publishable packages (npm provenance validates it against the publishing repo, so a renamed fork's first release fails if skipped), the GitHub URL + nav title in `apps/docs/lib/layout.shared.tsx`, `GITHUB_DOCS_BASE` in `apps/docs/app/(docs)/[[...slug]]/page.tsx`, and the metadata in `apps/docs/app/layout.tsx`
3. Portless name in the `apps/docs` dev script
4. LICENSE holder

## Releasing

Changesets: `pnpm changeset`, merge the auto-opened "Version Packages" PR, and `release.yml` publishes to npm with provenance (set `NPM_TOKEN`).

## Scripts

| Command                                               | What                    |
| ----------------------------------------------------- | ----------------------- |
| `pnpm dev` / `build` / `test` / `test:coverage`       | turbo across workspaces |
| `pnpm lint` / `format` / `format:check` / `typecheck` | oxlint / oxfmt / tsc    |
| `pnpm fallow:dead` / `fallow:health`                  | dead-code / repo health |
| `pnpm changeset` / `version-packages` / `release`     | Changesets flow         |

## Stack

pnpm 11 · Node ≥24 · Turborepo · tsdown (ESM-only) · Vitest 4 · oxlint + oxfmt · fallow · husky + lint-staged · Changesets · Next 16 + Fumadocs · Vite 8
