import { createStore } from "@acme/core";
import { fireEvent, render, screen } from "@testing-library/react";
import { act } from "react";
import { hydrateRoot } from "react-dom/client";
import { renderToString } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

import { useStore } from ".";

const counterStore = () => createStore(0);

type CounterProps = {
  store: ReturnType<typeof counterStore>;
};

const Counter = ({ store }: CounterProps) => {
  const count = useStore(store);
  return (
    <button onClick={() => store.set((previous) => previous + 1)} type="button">
      count: {count}
    </button>
  );
};

describe("useStore", () => {
  it("renders the current store value", () => {
    render(<Counter store={counterStore()} />);
    expect(screen.getByRole("button")).toHaveTextContent("count: 0");
  });

  it("re-renders when the store updates", () => {
    render(<Counter store={counterStore()} />);

    fireEvent.click(screen.getByRole("button"));

    expect(screen.getByRole("button")).toHaveTextContent("count: 1");
  });

  it("renders the store's current state on the server (getServerSnapshot)", () => {
    const store = counterStore();
    store.set(7);

    const html = renderToString(<Counter store={store} />);

    // React separates the static "count: " text from the dynamic value with a
    // comment marker on the server, so assert the rendered value, not the joined
    // string: getServerSnapshot must surface the store's current 7, not the
    // default 0.
    expect(html).toContain("count: <!-- -->7");
    expect(html).not.toContain("count: <!-- -->0");
  });

  it("hydrates without a mismatch (server snapshot matches client)", () => {
    const store = counterStore();
    store.set(7);
    const container = document.createElement("div");
    container.innerHTML = renderToString(<Counter store={store} />);
    const onRecoverableError = vi.fn();

    act(() => {
      hydrateRoot(container, <Counter store={store} />, { onRecoverableError });
    });

    expect(onRecoverableError).not.toHaveBeenCalled();
  });
});
