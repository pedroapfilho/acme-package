import "@/app/global.css";

import { RootProvider } from "fumadocs-ui/provider/next";
import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";

import { SITE_ORIGIN } from "@/lib/layout.shared";

export const metadata: Metadata = {
  description:
    "Documentation for acme-package: the template for library monorepos — fork it, rename one scope, and publish.",
  metadataBase: new URL(SITE_ORIGIN),
  title: {
    default: "acme-package — library monorepo template",
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
      {/* Scroll-driven reading progress bar — hidden under prefers-reduced-motion via CSS */}
      <div
        aria-hidden="true"
        className="reading-progress-bar fixed top-0 left-0 z-50 h-0.5 w-full bg-(--primary) [animation-range:0%_100%]"
      />
      <RootProvider search={{ options: { type: "static" } }}>{children}</RootProvider>
    </body>
  </html>
);

export default RootLayout;
