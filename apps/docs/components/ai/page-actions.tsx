"use client";
import { Check, ChevronDown, Copy, ExternalLinkIcon, TextIcon } from "lucide-react";
import { useEffect, useRef, useState, useTransition } from "react";

import { SITE_NAME } from "../../lib/site";
import { Button } from "../ui/button";
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

const markdownCache = new Map<string, Promise<string>>();

// Evicts itself on rejection so a failed fetch is never served to a later reader.
// The returned promise stays unawaited at the call site: ClipboardItem accepts a
// promise, and clipboard.write() must be reached synchronously within the click
// task or Safari rejects it as lacking a user gesture.
const loadMarkdown = (url: string): Promise<string> => {
  const cached = markdownCache.get(url);
  if (cached) {
    return cached;
  }

  const pending = (async () => {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`fetching ${url} failed with ${response.status}`);
      }
      return await response.text();
    } catch (error) {
      markdownCache.delete(url);
      throw error;
    }
  })();

  // Outside a secure context `navigator.clipboard` is undefined, so the caller
  // throws before it ever consumes this promise. Settling it here keeps that from
  // surfacing as an unhandled rejection; the caller still sees its own error.
  void (async () => {
    try {
      await pending;
    } catch {
      // Deliberately swallowed: eviction and reporting are the caller's job.
    }
  })();

  markdownCache.set(url, pending);
  return pending;
};

type CopyStatus = "copied" | "failed" | "idle";

type PageActionsProps = {
  markdownUrl: string;
  pageUrl: string;
  sourceUrl: string;
};

const CopyMarkdownButton = ({ markdownUrl }: Pick<PageActionsProps, "markdownUrl">) => {
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState<CopyStatus>("idle");
  const timeoutRef = useRef<number | undefined>(undefined);

  useEffect(
    () => () => {
      window.clearTimeout(timeoutRef.current);
    },
    [],
  );

  const showStatus = (next: Exclude<CopyStatus, "idle">): void => {
    setStatus(next);
    window.clearTimeout(timeoutRef.current);
    timeoutRef.current = window.setTimeout(() => {
      setStatus("idle");
    }, 1500);
  };

  const handleClick = (): void => {
    startTransition(async () => {
      const markdown = loadMarkdown(markdownUrl);
      try {
        await navigator.clipboard.write([
          new ClipboardItem({
            "text/plain": markdown,
          }),
        ]);
        showStatus("copied");
      } catch (error) {
        showStatus("failed");
        console.warn(`[${SITE_NAME}] copying ${markdownUrl} failed`, error);
      }
    });
  };

  return (
    <Button disabled={isPending} onClick={handleClick} size="sm" variant="secondary">
      {status === "copied" ? (
        <Check className="text-docs-muted-foreground" />
      ) : (
        <Copy className="text-docs-muted-foreground" />
      )}
      <span aria-live="polite">
        {status === "failed" ? "Copy failed. Try again" : "Copy Markdown"}
      </span>
    </Button>
  );
};

const OpenPopover = ({ markdownUrl, pageUrl, sourceUrl }: PageActionsProps) => {
  const prompt = `Read ${pageUrl}, I want to ask questions about it.`;
  const links = [
    { href: sourceUrl, icon: <GitHubIcon />, title: "Open in GitHub" },
    { href: markdownUrl, icon: <TextIcon />, title: "View as Markdown" },
    ...AI_PROVIDERS.map(({ buildHref, icon, title }) => ({ href: buildHref(prompt), icon, title })),
  ];

  return (
    <Popover>
      <PopoverTrigger render={<Button size="sm" variant="secondary" />}>
        Open
        <ChevronDown className="text-docs-muted-foreground size-3.5" />
      </PopoverTrigger>
      <PopoverContent className="flex flex-col">
        {links.map((link) => (
          <a
            className="hover:text-docs-accent-foreground hover:bg-docs-accent inline-flex items-center gap-2 rounded-lg p-2 text-sm [&_svg]:size-4"
            href={link.href}
            key={link.href}
            rel="noreferrer noopener"
            target="_blank"
          >
            {link.icon}
            {link.title}
            <ExternalLinkIcon className="text-docs-muted-foreground ms-auto size-3.5" />
          </a>
        ))}
      </PopoverContent>
    </Popover>
  );
};

const PageActions = (links: PageActionsProps) => (
  <>
    <CopyMarkdownButton markdownUrl={links.markdownUrl} />
    <OpenPopover {...links} />
  </>
);

export { PageActions };
