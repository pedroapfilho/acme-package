import { describe, expect, it } from "vitest";

import { docsSourceUrl } from "./site";

describe("docsSourceUrl", () => {
  it("points at the page's source file on GitHub", () => {
    expect(docsSourceUrl("core.mdx")).toBe(
      "https://github.com/pedroapfilho/acme-package/blob/main/apps/docs/content/docs/core.mdx",
    );
  });
});
