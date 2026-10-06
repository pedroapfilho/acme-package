import { describe, expect, it } from "vitest";

import { docsSourceUrl, siteUrl } from "./site";

describe("docsSourceUrl", () => {
  it("points at the page's source file on GitHub", () => {
    expect(docsSourceUrl("core.mdx")).toBe(
      "https://github.com/pedroapfilho/acme-package/blob/main/apps/docs/content/docs/core.mdx",
    );
  });
});

describe("siteUrl", () => {
  it("resolves a page url against the site origin", () => {
    expect(siteUrl("/core")).toBe("https://docs.acme-package.dev/core");
  });
});
