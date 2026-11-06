---
title: 'apps/docs: next.config.ts cannot load modules that import through the @/ alias'
severity: 'minor'
---

### Expected Behavior

A `lib/` module can import its neighbours through the `@/` alias the rest of the docs app uses.

### Current Behavior

`next build` fails with `Cannot find module` when anything `next.config.ts` imports (today `lib/page-markdown.ts`, which imports `lib/site.ts`) uses `@/`. Next loads the config without the tsconfig `paths`, and `source.config.ts` has the same limit. The docs app works around it by importing siblings relatively and using `@/` only across folders.

### Possible Solution

Keep config-reachable modules on relative sibling imports, or move the `*.md` rewrites out of `next.config.ts` so the config imports nothing from `lib/`.

### Minimal Reproducible Example

Change `import { siteUrl } from "./site";` in `apps/docs/lib/page-markdown.ts` to `import { siteUrl } from "@/lib/site";` and run `pnpm --filter docs build`.

### Context

Hit while giving the docs app one import convention during the untangle refactor.
