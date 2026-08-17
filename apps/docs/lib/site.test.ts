import { describe, expect, it } from "vitest";

import { docsMarkdownUrl, docsSourceUrl } from "./site";

describe("docsMarkdownUrl", () => {
  // Guards the rewrite contract in next.config.ts: "/.md" matches neither rule.
  it("spells the index page as /index.md", () => {
    expect(docsMarkdownUrl("/")).toBe("/index.md");
  });

  it("appends .md to a nested page url", () => {
    expect(docsMarkdownUrl("/core")).toBe("/core.md");
  });
});

describe("docsSourceUrl", () => {
  it("points at the page's source file on GitHub", () => {
    expect(docsSourceUrl("core.mdx")).toBe(
      "https://github.com/pedroapfilho/acme-package/blob/main/apps/docs/content/docs/core.mdx",
    );
  });
});
