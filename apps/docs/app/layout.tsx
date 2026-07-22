import "@/app/global.css";

import { RootProvider } from "fumadocs-ui/provider/next";
import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";

import { SITE_ORIGIN } from "@/lib/site";

export const metadata: Metadata = {
  description:
    "Documentation for acme-package: the template for library monorepos. Fork it, rename one scope, and publish.",
  metadataBase: new URL(SITE_ORIGIN),
  title: {
    default: "acme-package · library monorepo template",
    template: "%s · acme-package docs",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { color: "oklch(1 0 0)", media: "(prefers-color-scheme: light)" },
    { color: "oklch(0.145 0 0)", media: "(prefers-color-scheme: dark)" },
  ],
};

const RootLayout = ({ children }: { children: ReactNode }) => (
  <html lang="en" suppressHydrationWarning>
    <body className="flex min-h-screen flex-col">
      <div
        aria-hidden="true"
        className="reading-progress-bar fixed top-0 left-0 z-50 h-0.5 w-full bg-(--primary) [animation-range:0%_100%]"
      />
      {/* Static search keeps the docs deployable without a search backend; the
          non-deprecated path is a custom search dialog this template avoids owning. */}
      {/* oxlint-disable-next-line typescript/no-deprecated */}
      <RootProvider search={{ options: { type: "static" } }}>{children}</RootProvider>
    </body>
  </html>
);

export default RootLayout;
