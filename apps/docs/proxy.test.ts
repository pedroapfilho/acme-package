import { unstable_doesMiddlewareMatch } from "next/experimental/testing/server";
import { describe, expect, it } from "vitest";

import { markdownRoutePath, pageMarkdownUrl } from "@/lib/markdown-url";

import { config } from "./proxy";

const matches = (pathname: string) =>
  unstable_doesMiddlewareMatch({ config, url: `https://docs.example${pathname}` });

describe("proxy matcher", () => {
  it("negotiates every page url, including slugs that start with api", () => {
    for (const pageUrl of ["/", "/core", "/guides/setup", "/api", "/api-reference"]) {
      expect(matches(pageUrl)).toBe(true);
    }
  });

  it("skips the search api, Next assets and the markdown routes", () => {
    for (const pathname of [
      "/api/search",
      "/_next/static/chunk.js",
      "/llms.txt",
      pageMarkdownUrl("/core"),
      markdownRoutePath("/core"),
    ]) {
      expect(matches(pathname)).toBe(false);
    }
  });
});
