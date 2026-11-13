import { render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { useErrorHeading } from "./use-error-heading";

const Boundary = ({ error }: { error: Error }) => (
  <h1 ref={useErrorHeading(error)} tabIndex={-1}>
    Something went wrong
  </h1>
);

describe("useErrorHeading", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("reports the caught error and moves focus to the heading", () => {
    const report = vi.fn<typeof reportError>();
    vi.stubGlobal("reportError", report);
    const error = new Error("render failed");

    render(<Boundary error={error} />);

    expect(report).toHaveBeenCalledExactlyOnceWith(error);
    expect(document.activeElement).toBe(screen.getByRole("heading"));
  });
});
