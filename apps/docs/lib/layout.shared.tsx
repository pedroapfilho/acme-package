import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";

import { GitHubIcon } from "../components/ai/provider-icons";

import { REPOSITORY_URL, SITE_WORDMARK } from "./site";

const baseOptions = (): BaseLayoutProps => ({
  links: [
    {
      external: true,
      icon: <GitHubIcon />,
      label: "GitHub",
      text: "GitHub",
      type: "icon",
      url: REPOSITORY_URL,
    },
  ],
  nav: {
    title: (
      <span className="inline-flex items-center gap-2 font-mono font-semibold tracking-tight">
        <span aria-hidden="true" className="bg-primary size-2.5" />
        {SITE_WORDMARK}
      </span>
    ),
    transparentMode: "top",
  },
});

export { baseOptions };
