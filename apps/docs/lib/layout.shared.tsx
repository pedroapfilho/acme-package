import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";

// Fork-facing constants: forks rename the wordmark below and update these two
// URLs — every GitHub link and absolute page URL in the docs derives from here.
export const GITHUB_URL = "https://github.com/pedroapfilho/acme-package";

export const SITE_ORIGIN = "https://docs.acme-package.dev";

// Layout options shared between the docs layout and any home layout. The nav
// title is a plain text wordmark — no image asset needed.
export const baseOptions = (): BaseLayoutProps => ({
  githubUrl: GITHUB_URL,
  nav: {
    title: <span className="font-semibold tracking-tight">acme-package</span>,
    transparentMode: "top",
  },
});
