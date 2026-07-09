import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";

import { GITHUB_URL } from "./site";

const baseOptions = (): BaseLayoutProps => ({
  githubUrl: GITHUB_URL,
  nav: {
    title: <span className="font-semibold tracking-tight">acme-package</span>,
    transparentMode: "top",
  },
});

export { baseOptions };
