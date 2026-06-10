import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";

const GITHUB_URL = "https://github.com/pedroapfilho/acme-package";

// Layout options shared between the docs layout and any home layout. The nav
// title is a plain text wordmark — no image asset needed, and forks only have
// to change one string.
export const baseOptions = (): BaseLayoutProps => ({
  githubUrl: GITHUB_URL,
  nav: {
    title: <span className="font-semibold tracking-tight">acme-package</span>,
    transparentMode: "top",
  },
});
