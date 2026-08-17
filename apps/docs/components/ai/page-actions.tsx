"use client";
import { usePathname } from "fumadocs-core/framework";
import { Check, ChevronDown, Copy, ExternalLinkIcon, TextIcon } from "lucide-react";
import {
  type ComponentProps,
  type ReactNode,
  useEffect,
  useMemo,
  useRef,
  useState,
  useTransition,
} from "react";

import { cn } from "../../lib/cn";
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

type PageLink = {
  href: string;
  icon: ReactNode;
  title: string;
};

const MarkdownCopyButton = ({
  markdownUrl,
  ...props
}: ComponentProps<"button"> & { markdownUrl: string }) => {
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
        console.warn(`[acme-package docs] copying ${markdownUrl} failed`, error);
      }
    });
  };

  return (
    <button
      {...props}
      className={cn(
        buttonVariants({
          className: "gap-2 [&_svg]:size-3.5 [&_svg]:text-fd-muted-foreground",
          color: "secondary",
          size: "sm",
        }),
        props.className,
      )}
      disabled={isPending || props.disabled}
      onClick={handleClick}
      type="button"
    >
      {status === "copied" ? <Check /> : <Copy />}
      <span aria-live="polite">
        {status === "failed" ? "Copy failed. Try again" : (props.children ?? "Copy Markdown")}
      </span>
    </button>
  );
};

const ViewOptionsPopover = ({
  githubUrl,
  markdownUrl,
  ...props
}: ComponentProps<"button"> & { githubUrl: string; markdownUrl: string }) => {
  const pathname = usePathname();
  const items = useMemo<Array<PageLink>>(() => {
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
        {...props}
        className={cn(
          buttonVariants({ className: "gap-2", color: "secondary", size: "sm" }),
          props.className,
        )}
      >
        {props.children ?? "Open"}
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
