import { llms } from "fumadocs-core/source";
import { cacheLife } from "next/cache";

import { source } from "@/lib/source";

const getLlmsIndex = async () => {
  "use cache";
  cacheLife("max");
  const index = await Promise.resolve(llms(source).index());
  return index;
};

const GET = async () =>
  new Response(await getLlmsIndex(), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });

export { GET };
