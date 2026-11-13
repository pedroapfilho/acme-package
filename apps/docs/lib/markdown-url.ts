const MARKDOWN_ROUTE = "/llms.mdx";

// A plain suffix would give the index page the dotfile path "/.md".
const pageMarkdownUrl = (pageUrl: string) => `${pageUrl === "/" ? "/index" : pageUrl}.md`;

const markdownRoutePath = (pageUrl: string) =>
  pageUrl === "/" ? MARKDOWN_ROUTE : `${MARKDOWN_ROUTE}${pageUrl}`;

// "/" comes first because "/:path*.md" would send "/index.md" to a page slugged "index".
const markdownRewrites = ["/", "/:path*"].map((pageUrl) => ({
  destination: markdownRoutePath(pageUrl),
  source: pageMarkdownUrl(pageUrl),
}));

export { markdownRewrites, markdownRoutePath, pageMarkdownUrl };
