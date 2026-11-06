import { DocsLayout } from "fumadocs-ui/layouts/docs";
import type { ReactNode } from "react";

import { REPOSITORY_URL, SITE_WORDMARK } from "@/lib/site";
import { source } from "@/lib/source";

const Layout = ({ children }: { children: ReactNode }) => (
  <DocsLayout
    githubUrl={REPOSITORY_URL}
    nav={{
      title: (
        <span className="inline-flex items-center gap-2 font-mono font-semibold tracking-tight">
          <span aria-hidden="true" className="bg-primary size-2.5" />
          {SITE_WORDMARK}
        </span>
      ),
      transparentMode: "top",
    }}
    tree={source.pageTree}
  >
    {children}
  </DocsLayout>
);

export default Layout;
