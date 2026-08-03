import { getLLMText } from "@/lib/get-llm-text";
import { source } from "@/lib/source";

export const revalidate = false;

export const GET = async () => {
  const results = await Promise.allSettled(source.getPages().map(getLLMText));

  const rendered: Array<string> = [];
  const failures: Array<PromiseRejectedResult> = [];
  for (const result of results) {
    if (result.status === "fulfilled") {
      rendered.push(result.value);
    } else {
      failures.push(result);
    }
  }

  if (failures.length > 0) {
    console.error(
      `llms-full.txt: ${failures.length} of ${results.length} pages failed to render`,
      failures,
    );
  }

  return new Response(rendered.join("\n\n"));
};
