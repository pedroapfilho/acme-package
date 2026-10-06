import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const LINKS = {
  markdownUrl: "/core.md",
  pageUrl: "https://docs.acme-package.dev/core",
  sourceUrl:
    "https://github.com/pedroapfilho/acme-package/blob/main/apps/docs/content/docs/core.mdx",
};

const PROMPT = `Read ${LINKS.pageUrl}, I want to ask questions about it.`;

class ClipboardItemStub {
  text: Promise<string>;

  constructor(data: { "text/plain": Promise<string> }) {
    this.text = data["text/plain"];
  }
}

const stubClipboard = () => {
  const copied: Array<string> = [];
  vi.stubGlobal("ClipboardItem", ClipboardItemStub);
  Object.defineProperty(navigator, "clipboard", {
    configurable: true,
    value: {
      write: async (items: Array<ClipboardItemStub>) => {
        for (const item of items) {
          copied.push(await item.text);
        }
      },
    },
  });
  return copied;
};

const renderPageActions = async () => {
  const { PageActions } = await import("./page-actions");
  render(<PageActions {...LINKS} />);
};

describe("PageActions", () => {
  beforeEach(() => {
    vi.resetModules();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
    Reflect.deleteProperty(navigator, "clipboard");
  });

  it("copies the fetched page markdown to the clipboard", async () => {
    const fetchMarkdown = vi
      .fn<() => Promise<Response>>()
      .mockResolvedValueOnce(new Response("# Core"));
    vi.stubGlobal("fetch", fetchMarkdown);
    const copied = stubClipboard();
    await renderPageActions();

    fireEvent.click(screen.getByRole("button", { name: "Copy Markdown" }));

    await waitFor(() => {
      expect(copied).toEqual(["# Core"]);
    });
    expect(fetchMarkdown).toHaveBeenCalledWith(LINKS.markdownUrl);
  });

  it("reports a failed copy and refetches on retry", async () => {
    const fetchMarkdown = vi
      .fn<() => Promise<Response>>()
      .mockResolvedValueOnce(new Response("", { status: 500 }))
      .mockResolvedValueOnce(new Response("# Core"));
    vi.stubGlobal("fetch", fetchMarkdown);
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const copied = stubClipboard();
    await renderPageActions();
    const button = screen.getByRole("button", { name: "Copy Markdown" });

    fireEvent.click(button);

    await screen.findByText("Copy failed. Try again");
    expect(warn).toHaveBeenCalledOnce();
    await waitFor(() => {
      expect(button).toHaveProperty("disabled", false);
    });

    fireEvent.click(button);

    await waitFor(() => {
      expect(copied).toEqual(["# Core"]);
    });
    expect(fetchMarkdown).toHaveBeenCalledTimes(2);
  });

  it("links the source, the markdown and each AI provider with the absolute page URL", async () => {
    await renderPageActions();

    fireEvent.click(screen.getByRole("button", { name: "Open" }));

    expect(await screen.findByRole("link", { name: /Open in GitHub/ })).toHaveProperty(
      "href",
      LINKS.sourceUrl,
    );
    expect(screen.getByRole("link", { name: /View as Markdown/ }).getAttribute("href")).toBe(
      LINKS.markdownUrl,
    );
    for (const [title, param] of [
      ["Open in Scira AI", "q"],
      ["Open in ChatGPT", "q"],
      ["Open in Claude", "q"],
      ["Open in Cursor", "text"],
    ] as const) {
      const href = screen.getByRole("link", { name: new RegExp(title) }).getAttribute("href") ?? "";
      expect(href).toContain(encodeURIComponent(LINKS.pageUrl));
      expect(new URL(href).searchParams.get(param)).toBe(PROMPT);
    }
  });
});
