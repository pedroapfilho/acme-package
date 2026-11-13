import type { Item, Node, Root } from "fumadocs-core/page-tree";
import type { LoaderConfig, LoaderOutput } from "fumadocs-core/source";
import { llms } from "fumadocs-core/source/llms";

import { pageMarkdownUrl } from "./markdown-url";
import { siteUrl } from "./site";

type MarkdownPage = {
  data: {
    getText: (type: "processed") => Promise<string>;
    title: string;
  };
  url: string;
};

const renderPageMarkdown = async (page: MarkdownPage) => `# ${page.data.title} (${page.url})

${await page.data.getText("processed")}`;

const renderAllPagesMarkdown = <C extends LoaderConfig & { page: MarkdownPage }>(
  source: LoaderOutput<C>,
) => llms(source, { renderPage: renderPageMarkdown }).full();

const linkMarkdownItem = (item: Item): Item => ({
  ...item,
  url: siteUrl(pageMarkdownUrl(item.url)),
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

export { renderAllPagesMarkdown, renderMarkdownIndex, renderPageMarkdown };
