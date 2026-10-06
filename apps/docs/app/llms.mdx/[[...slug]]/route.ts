import { cacheLife } from "next/cache";
import { notFound } from "next/navigation";

import { renderPageMarkdown } from "@/lib/page-markdown";
import { source } from "@/lib/source";

const getPageMarkdown = async (slug?: Array<string>) => {
  "use cache";
  cacheLife("max");
  const page = source.getPage(slug);
  return page ? renderPageMarkdown(page) : null;
};

const GET = async (_req: Request, { params }: { params: Promise<{ slug?: Array<string> }> }) => {
  const { slug } = await params;
  const markdown = await getPageMarkdown(slug);
  if (markdown === null) {
    notFound();
  }

  return new Response(markdown, {
    headers: { "Content-Type": "text/markdown; charset=utf-8" },
  });
};

const generateStaticParams = () => source.generateParams();

export { generateStaticParams, GET };
