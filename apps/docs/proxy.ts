import { isMarkdownPreferred } from "fumadocs-core/negotiation";
import { type NextRequest, NextResponse } from "next/server";

import { markdownRoutePath } from "@/lib/page-markdown";

const proxy = (request: NextRequest) =>
  isMarkdownPreferred(request)
    ? NextResponse.rewrite(new URL(markdownRoutePath(request.nextUrl.pathname), request.nextUrl), {
        // Next's app-page runtime overwrites Vary on HTML responses, so only the markdown variant can carry it.
        headers: { Vary: "Accept" },
      })
    : NextResponse.next();

export const config = {
  // A plain string literal so Next can statically extract the matcher.
  // The `.*\.` alternative excludes every dotted path, which already covers the
  // llms.txt / llms-full.txt / llms.mdx routes and the *.md rewrites in next.config.ts.
  matcher: ["/((?!api|_next|.*\\.).*)"],
};

export default proxy;
