import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";

import { GITHUB_URL } from "./site";

// Layout options shared between the docs layout and any home layout. The nav
// title is a plain text wordmark forks rename — no image asset needed.
const baseOptions = (): BaseLayoutProps => ({
  githubUrl: GITHUB_URL,
  nav: {
    title: <span className="font-semibold tracking-tight">acme-package</span>,
    transparentMode: "top",
  },
});

export { baseOptions };
