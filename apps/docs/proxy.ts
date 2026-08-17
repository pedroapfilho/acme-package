import { isMarkdownPreferred, rewritePath } from "fumadocs-core/negotiation";
import { type NextRequest, NextResponse } from "next/server";

const { rewrite } = rewritePath("/{*path}", "/llms.mdx/{*path}");

const proxy = (request: NextRequest) => {
  if (isMarkdownPreferred(request)) {
    const result = rewrite(request.nextUrl.pathname);
    if (result !== false && result !== "") {
      return NextResponse.rewrite(new URL(result, request.nextUrl));
    }
  }

  return NextResponse.next();
};

export const config = {
  // A plain string literal so Next can statically extract the matcher.
  // The `.*\.` alternative excludes every dotted path, which already covers the
  // llms.txt / llms-full.txt / llms.mdx routes and the *.md rewrites in next.config.ts.
  // oxlint-disable-next-line unicorn/prefer-string-raw
  matcher: ["/((?!api|_next|.*\\.).*)"],
};

export default proxy;
