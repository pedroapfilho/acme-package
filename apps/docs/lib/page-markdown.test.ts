import { loader, type MetaData, type PageData, type StaticSource } from "fumadocs-core/source";
import {
  getRewrittenUrl,
  unstable_getResponseFromNextConfig,
} from "next/experimental/testing/server";
import { describe, expect, it } from "vitest";

import {
  markdownRewrites,
  markdownRoutePath,
  pageMarkdownUrl,
  renderAllPagesMarkdown,
  renderMarkdownIndex,
  renderPageMarkdown,
} from "./page-markdown";
import { SITE_ORIGIN } from "./site";

type VirtualDocs = StaticSource<{
  metaData: MetaData;
  pageData: PageData & { getText: () => Promise<string>; title: string };
}>;

const virtualPage = (path: string, title: string, getText: () => Promise<string>) => ({
  data: { getText, title },
  path,
  type: "page" as const,
});

const docsSource = (...files: VirtualDocs["files"]) =>
  loader<VirtualDocs>({ baseUrl: "/", source: { files } });

const source = docsSource(
  virtualPage("index.mdx", "Introduction", () => Promise.resolve("Welcome.")),
  virtualPage("core.mdx", "Core", () => Promise.resolve("Core text.")),
  virtualPage("guides/setup.mdx", "Setup", () => Promise.resolve("Setup text.")),
);

const pageAtMarkdownRoute = (pathname: string) => {
  const [route, ...slugs] = pathname.split("/").filter(Boolean);
  return route === "llms.mdx" ? source.getPage(slugs) : undefined;
};

const rewrittenPathname = async (pathname: string) => {
  const response = await unstable_getResponseFromNextConfig({
    nextConfig: { rewrites: () => Promise.resolve(markdownRewrites) },
    url: new URL(pathname, SITE_ORIGIN).href,
  });
  const rewritten = getRewrittenUrl(response);
  return rewritten === null ? null : new URL(rewritten).pathname;
};

describe("pageMarkdownUrl", () => {
  it("spells the index page as /index.md", () => {
    expect(pageMarkdownUrl("/")).toBe("/index.md");
  });

  it("appends .md to a nested page url", () => {
    expect(pageMarkdownUrl("/guides/setup")).toBe("/guides/setup.md");
  });

  it("rewrites every page's markdown url to that page's markdown route", async () => {
    for (const page of source.getPages()) {
      const pathname = await rewrittenPathname(pageMarkdownUrl(page.url));
      expect(pathname).toBe(markdownRoutePath(page.url));
      expect(pageAtMarkdownRoute(pathname ?? "")).toBe(page);
    }
  });
});

describe("markdownRoutePath", () => {
  it("maps the index page to the bare markdown route", () => {
    expect(markdownRoutePath("/")).toBe("/llms.mdx");
  });

  it("maps every negotiated page url to that page's markdown route", () => {
    for (const page of source.getPages()) {
      expect(pageAtMarkdownRoute(markdownRoutePath(page.url))).toBe(page);
    }
  });
});

describe("renderPageMarkdown", () => {
  it("titles the processed text with the page's title and url", async () => {
    const core = source.getPage(["core"]);
    expect(core).toBeDefined();
    expect(await renderPageMarkdown(core!)).toBe("# Core (/core)\n\nCore text.");
  });
});

describe("renderAllPagesMarkdown", () => {
  it("renders every page in order", async () => {
    expect(await renderAllPagesMarkdown(source)).toBe(
      [
        "# Introduction (/)\n\nWelcome.",
        "# Core (/core)\n\nCore text.",
        "# Setup (/guides/setup)\n\nSetup text.",
      ].join("\n\n"),
    );
  });

  it("rejects when one page fails to render", async () => {
    const broken = docsSource(
      virtualPage("index.mdx", "Introduction", () => Promise.resolve("Welcome.")),
      virtualPage("core.mdx", "Core", () => Promise.reject(new Error("unprocessable"))),
    );
    await expect(renderAllPagesMarkdown(broken)).rejects.toThrow("unprocessable");
  });
});

describe("renderMarkdownIndex", () => {
  it("links each page to its absolute markdown url", async () => {
    expect(await renderMarkdownIndex(source)).toBe(
      [
        "# Docs",
        "",
        `- [Introduction](${SITE_ORIGIN}/index.md)`,
        `- [Core](${SITE_ORIGIN}/core.md)`,
        "- Guides",
        `  - [Setup](${SITE_ORIGIN}/guides/setup.md)`,
      ].join("\n"),
    );
  });
});
