import { createMDX } from "fumadocs-mdx/next";
import type { NextConfig } from "next";

import { markdownRewrites } from "./lib/page-markdown";

const withMDX = createMDX();
const exposeTestingApi = process.env.EXPOSE_TESTING_API === "1";

if (exposeTestingApi) {
  process.emitWarning("The Next.js testing API is enabled. Never deploy this build to production.");
}

const config: NextConfig = {
  cacheComponents: true,
  experimental: {
    exposeTestingApiInProductionBuild: exposeTestingApi,
    instantInsights: {
      validationLevel: "manual-warning",
    },
  },
  headers: () =>
    Promise.resolve([
      {
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
        source: "/:path*",
      },
    ]),
  partialPrefetching: true,
  reactStrictMode: true,
  rewrites: () => Promise.resolve(markdownRewrites),
};

export default withMDX(config);
