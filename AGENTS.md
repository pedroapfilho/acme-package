# AGENTS.md

Guidance for AI coding agents working in `acme-package`. `CLAUDE.md` is a symlink to this file.

## What this repo is

The **library-monorepo template**, and the source of truth for the fleet's `library` profile (the analog of acme-monorepo for SaaS). Forks turn it into a real published library; changes here propagate as the standard. The example domain (`createStore`/`useStore`) is intentionally trivial: it exists to exercise the canonical package shape, not to be a product.

## Layout

```
packages/
  config-typescript/   @repo/typescript-config (tsconfig presets: base/library/react-library/vite/nextjs)
  config-vitest/       @repo/config-vitest (vitest presets: node/react + coverage thresholds)
  core/                @acme/core (publishable, platform-neutral example lib)
  react/               @acme/react (publishable React adapter, peer react ^18.3.1 || ^19)
apps/
  docs/                Fumadocs on Next 16: https://acme-package.docs.localhost (portless; URL set via --name flag in apps/docs dev script)
  demo-vite/           Vite playground consuming both packages via workspace:*
```

## Dev workflow

Root scripts run turbo: `dev`, `build`, `test`, `test:coverage`, `lint`, `typecheck`, `clean`, `start`. Root-only: `format`/`format:check` (oxfmt), the `fallow*` suite, `changeset`/`version-packages`/`release`. Pre-commit runs husky → lint-staged (oxlint + oxfmt).

## Publishable package contract

Every publishable package keeps the same shape; copy `packages/core` to add one:

- `exports: { ".": { types, default } }`, `files: ["dist"]`, `sideEffects: false`, `publishConfig.access: public`, MIT
- tsdown build: ESM-only, `dts`, `sourcemap`, `target es2022`, `treeshake`, `minify`; `platform: neutral` (core-like) or `browser` (react-like)
- `prepack`/`prepare` run the build; `typecheck` is `tsc --noEmit` against `@repo/typescript-config/{library,react-library}.json` and covers test files
- Tests: vitest via `@repo/config-vitest/{node,react}`; coverage thresholds live in the preset

## Publishing

Changesets. `release.yml` (changesets/action) opens the Version Packages PR and publishes with npm provenance, which validates `repository.url` against the publishing repo. `@repo/*` packages stay `private: true` at version `0.0.0`.

## Conventions

- kebab-case filenames; oxlint (`oxlint-config-awesomeness`) + oxfmt; no ESLint/Prettier
- `type` over `interface`, arrow functions, exports at end, WHY-comments only
- Node ≥24, pnpm 11.1.3 (pinned `packageManager`)
- No e2e/Playwright by design (library profile). The demo is a dev playground, not a test harness.

## Notable decisions

- `@acme/*` is the placeholder publish scope; forks rename it once (README → "Use this template", docs → "Using this template"). `@repo/*` configs are never renamed.
- CI is test/lint/format/fallow (+ release) on actions @v6, the library-profile standard, plus a react-doctor scan (PRs and pushes to main).
- This repo is registered in the orchestrator (`~/dev/orchestrator`) as `LIBRARY_SOURCE_OF_TRUTH`; tsconfig (`base.json`/`library.json`) and root devDependency versions are verifier baselines for the fleet's library repos. Change them deliberately.
