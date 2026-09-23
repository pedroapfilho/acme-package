# AGENTS.md

Guidance for AI coding agents working in `acme-package`. `CLAUDE.md` is a symlink to this file.

## What this repo is

The **library-monorepo template**, and the source of truth for the fleet's `library` profile (the analog of acme-monorepo for SaaS). Forks turn it into a real published library; changes here propagate as the standard. The example domain (`createStore`/`useStore`) is intentionally trivial: it exists to exercise the canonical package shape, not to be a product.

## Layout

```
packages/
  config-typescript/   @repo/typescript-config (tsconfig presets: base/react-library/vite/nextjs)
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
- tsdown build: ESM-only, `dts`, `sourcemap`, `target es2022`, `treeshake`, `minify: false` (consumer bundlers pre-bundle unminified ESM; the app minifies once at its own build); `platform: neutral` (core-like) or `browser` (react-like)
- `prepack` runs the build (turbo owns ordering everywhere else, so there is no `prepare` build); `typecheck` is `tsc --noEmit` against `@repo/typescript-config/{base,react-library}.json` and covers test files
- Tests: vitest via `@repo/config-vitest/{node,react}`; coverage thresholds live in the preset

## Publishing

Changesets. `release.yml` (changesets/action) opens the Version Packages PR and publishes with npm provenance, which validates `repository.url` against the publishing repo. `@repo/*` packages stay `private: true` at version `0.0.0`.

## Conventions

- kebab-case filenames; oxlint (`oxlint-config-awesomeness`) + oxfmt; no ESLint/Prettier
- `type` over `interface`, arrow functions, exports at end, WHY-comments only
- Node ≥24, pnpm 11.13.1 (pinned `packageManager`)
- No e2e/Playwright by design (library profile). The demo is a dev playground, not a test harness.

## Notable decisions

- `@acme/*` is the placeholder publish scope; forks rename it once (README → "Use this template", docs → "Using this template"). `@repo/*` configs are never renamed.
- Seven workflows gate PRs on actions @v6: test/lint/format/fallow (the library-profile standard) plus build, typecheck and a react-doctor scan. `release.yml` is the eighth, on pushes to main only. Only the first six opt into `workflow_dispatch` and are re-dispatched onto the version PR by `release.yml`; react-doctor is deliberately excluded, so it must not be a required check.
- This repo is registered in the orchestrator (`~/dev/orchestrator`) as the `library` profile's base; tsconfig (`base.json`) and root devDependency versions are the check baseline for the fleet's library repos. Change them deliberately.
- `apps/docs/turbo.json` disables Turbo caching for the docs build. Next.js file traces (`.nft.json`) record pnpm paths such as `node_modules/.pnpm/node_modules/...` that differ between dependency installs, so a Vercel build that restores cached traces fails packaging with ENOENT. Every Next app that deploys retraces against the current install; package builds stay cached.

## Design-system linting

Run `pnpm lint` after changes and fix every error. `oxlint.config.ts` registers `@shadcn/lint` and enforces all six rules as errors: component contracts, known Tailwind classes, static component class names, semantic colors, theme or scale values, and class-based styling. Use CSS custom properties for runtime geometry and named theme tokens for custom values. All six rules apply to primitives in `apps/docs/components/ui`. Compose `PopoverTrigger` with `render={<Button />}` for button styling. Do not disable design-system rules in directory overrides. Theme discovery stays local to each app.

## Upstream UI components

Keep registry primitive APIs and exports aligned with the configured shadcn Base UI style. Product-specific adapters and compositions live outside the primitive directory. Import variant factories from their component module. Preserve product branding in theme tokens, load `shadcn/tailwind.css`, and run `pnpm check:shadcn` with lint, typechecks, tests and the build. Review upstream changes and documented equivalent normalizations before updating the source lock; never refresh it to hide a custom primitive fork.
