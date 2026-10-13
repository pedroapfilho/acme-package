import { globSync, readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

import { docsSourceUrl, REPOSITORY_URL, SITE_ORIGIN, siteUrl } from "./site";

const CONTENT_DIR = join(import.meta.dirname, "../content/docs");

const GITHUB_REPOSITORY_URL = /https:\/\/github\.com\/[\w-]+\/[\w.-]*[\w-]/g;

describe("docsSourceUrl", () => {
  it("points at the page's source file on GitHub", () => {
    expect(docsSourceUrl("core.mdx")).toBe(
      `${REPOSITORY_URL}/blob/main/apps/docs/content/docs/core.mdx`,
    );
  });
});

describe("siteUrl", () => {
  it("resolves a page url against the site origin", () => {
    expect(siteUrl("/core")).toBe(`${SITE_ORIGIN}/core`);
  });
});

// Page markdown keeps a JSX expression verbatim, so content spells the
// repository URL literally instead of importing it from site.ts.
describe("REPOSITORY_URL", () => {
  it("is the only GitHub repository the docs content links to", () => {
    const linkedRepositories = globSync("**/*.mdx", { cwd: CONTENT_DIR }).flatMap(
      (file) => readFileSync(join(CONTENT_DIR, file), "utf8").match(GITHUB_REPOSITORY_URL) ?? [],
    );

    expect(linkedRepositories.filter((url) => url !== REPOSITORY_URL)).toEqual([]);
  });
});
