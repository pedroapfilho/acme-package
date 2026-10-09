import { cacheLife } from "next/cache";

import { renderMarkdownIndex } from "@/lib/page-markdown";
import { source } from "@/lib/source";

const getLlmsIndex = async () => {
  "use cache";
  cacheLife("max");
  return renderMarkdownIndex(source);
};

const GET = async () =>
  new Response(await getLlmsIndex(), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });

export { GET };
