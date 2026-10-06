import type { Item, Node, Root } from "fumadocs-core/page-tree";
import type { LoaderConfig, LoaderOutput } from "fumadocs-core/source";
import { llms } from "fumadocs-core/source/llms";

import { SITE_ORIGIN } from "./site";

type MarkdownPage = {
  data: {
    getText: (type: "processed") => Promise<string>;
    title: string;
  };
  url: string;
};

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

const renderPageMarkdown = async (page: MarkdownPage) => `# ${page.data.title} (${page.url})

${await page.data.getText("processed")}`;

const renderAllPagesMarkdown = async (source: { getPages: () => Array<MarkdownPage> }) => {
  const pages = await Promise.all(source.getPages().map(renderPageMarkdown));
  return pages.join("\n\n");
};

const linkMarkdownItem = (item: Item): Item => ({
  ...item,
  url: new URL(pageMarkdownUrl(item.url), SITE_ORIGIN).href,
});

const linkMarkdownNode = (node: Node): Node => {
  if (node.type === "page") {
    return linkMarkdownItem(node);
  }
  if (node.type === "folder") {
    return {
      ...node,
      children: node.children.map(linkMarkdownNode),
      index: node.index && linkMarkdownItem(node.index),
    };
  }
  return node;
};

const renderMarkdownIndex = <C extends LoaderConfig>(source: LoaderOutput<C>) => {
  const tree = source.getPageTree();
  const markdownTree: Root = { ...tree, children: tree.children.map(linkMarkdownNode) };
  // llms() links each page node by its url and has no option to change it.
  return llms({ ...source, getPageTree: () => markdownTree }).index();
};

export {
  markdownRewrites,
  markdownRoutePath,
  pageMarkdownUrl,
  renderAllPagesMarkdown,
  renderMarkdownIndex,
  renderPageMarkdown,
};
