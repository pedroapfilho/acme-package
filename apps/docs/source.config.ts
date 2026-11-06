import { defineConfig, defineDocs } from "fumadocs-mdx/config";

import { DOCS_CONTENT_DIR } from "./lib/site";

export const docs = defineDocs({
  dir: DOCS_CONTENT_DIR,
  docs: { postprocess: { includeProcessedMarkdown: true } },
});

export default defineConfig({
  mdxOptions: {
    remarkNpmOptions: {
      persist: { id: "package-manager" },
    },
  },
});
