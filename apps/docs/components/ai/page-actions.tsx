"use client";
import { usePathname } from "fumadocs-core/framework";
import { useCopyButton } from "fumadocs-ui/utils/use-copy-button";
import { Check, ChevronDown, Copy, ExternalLinkIcon, TextIcon } from "lucide-react";
import { useMemo, useState, useTransition } from "react";

import { SITE_ORIGIN } from "../../lib/site";
import { buttonVariants } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

import { AnthropicIcon, CursorIcon, GitHubIcon, OpenAiIcon, SciraIcon } from "./provider-icons";

const AI_PROVIDERS = [
  {
    buildHref: (q: string) => `https://scira.ai/?${new URLSearchParams({ q })}`,
    icon: <SciraIcon />,
    title: "Open in Scira AI",
  },
  {
    buildHref: (q: string) => `https://chatgpt.com/?${new URLSearchParams({ hints: "search", q })}`,
    icon: <OpenAiIcon />,
    title: "Open in ChatGPT",
  },
  {
    buildHref: (q: string) => `https://claude.ai/new?${new URLSearchParams({ q })}`,
    icon: <AnthropicIcon />,
    title: "Open in Claude",
  },
  {
    buildHref: (q: string) => `https://cursor.com/link/prompt?${new URLSearchParams({ text: q })}`,
    icon: <CursorIcon />,
    title: "Open in Cursor",
  },
];

const MarkdownCopyButton = ({ markdownUrl }: { markdownUrl: string }) => {
  const [isPending, startTransition] = useTransition();
  const [hasCopyError, setHasCopyError] = useState(false);
  const [checked, onClick] = useCopyButton(() => {
    startTransition(async () => {
      try {
        const promise = (async () => {
          const res = await fetch(markdownUrl);
          if (!res.ok) {
            throw new Error(`Failed to fetch ${markdownUrl}: ${res.status}`);
          }
          return res.text();
        })();
        // ClipboardItem accepts the unsettled promise so the write stays inside the user gesture (Safari)
        await navigator.clipboard.write([
          new ClipboardItem({
            "text/plain": promise,
          }),
        ]);
        setHasCopyError(false);
      } catch {
        setHasCopyError(true);
      }
    });
  });

  // useCopyButton flips checked in a microtask, before the transition settles;
  // only show the check once the copy actually finished and succeeded
  const showSuccessCheck = checked && !isPending && !hasCopyError;

  return (
    <button
      className={buttonVariants({
        className: "gap-2 [&_svg]:size-3.5 [&_svg]:text-fd-muted-foreground",
        color: "secondary",
        size: "sm",
      })}
      disabled={isPending}
      onClick={onClick}
      type="button"
    >
      {showSuccessCheck ? <Check /> : <Copy />}
      <span aria-live="polite">{hasCopyError ? "Copy failed. Try again" : "Copy Markdown"}</span>
    </button>
  );
};

type ViewOptionsPopoverProps = {
  githubUrl: string;
  markdownUrl: string;
};

const ViewOptionsPopover = ({ githubUrl, markdownUrl }: ViewOptionsPopoverProps) => {
  const pathname = usePathname();
  const items = useMemo(() => {
    // built from the canonical origin so server and client render identical hrefs (no hydration mismatch)
    const pageUrl = new URL(pathname, SITE_ORIGIN);
    const q = `Read ${pageUrl}, I want to ask questions about it.`;

    return [
      { href: githubUrl, icon: <GitHubIcon />, title: "Open in GitHub" },
      { href: markdownUrl, icon: <TextIcon />, title: "View as Markdown" },
      ...AI_PROVIDERS.map(({ buildHref, icon, title }) => ({ href: buildHref(q), icon, title })),
    ];
  }, [githubUrl, markdownUrl, pathname]);

  return (
    <Popover>
      <PopoverTrigger
        className={buttonVariants({ className: "gap-2", color: "secondary", size: "sm" })}
      >
        Open
        <ChevronDown className="text-fd-muted-foreground size-3.5" />
      </PopoverTrigger>
      <PopoverContent className="flex flex-col">
        {items.map((item) => (
          <a
            className="hover:text-fd-accent-foreground hover:bg-fd-accent inline-flex items-center gap-2 rounded-lg p-2 text-sm [&_svg]:size-4"
            href={item.href}
            key={item.href}
            rel="noreferrer noopener"
            target="_blank"
          >
            {item.icon}
            {item.title}
            <ExternalLinkIcon className="text-fd-muted-foreground ms-auto size-3.5" />
          </a>
        ))}
      </PopoverContent>
    </Popover>
  );
};

export { MarkdownCopyButton, ViewOptionsPopover };
