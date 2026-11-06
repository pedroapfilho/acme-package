---
"@acme/core": patch
"@acme/react": patch
---

Drop the top-level `types` field. `exports` points TypeScript at the declarations; projects still on `moduleResolution: node` (`node10`) no longer get the package's types.
