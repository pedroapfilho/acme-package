import { cacheLife } from "next/cache";

import { renderAllPagesMarkdown } from "@/lib/page-markdown";
import { source } from "@/lib/source";

const getLlmsFull = async () => {
  "use cache";
  cacheLife("max");
  return renderAllPagesMarkdown(source);
};

const GET = async () =>
  new Response(await getLlmsFull(), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });

export { GET };
