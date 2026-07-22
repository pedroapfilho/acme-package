import { createStore } from "@acme/core";
import { fireEvent, render, screen } from "@testing-library/react";
import { act } from "react";
import { hydrateRoot } from "react-dom/client";
import { renderToString } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

import { useStore } from ".";

const counterStore = () => createStore(0);

type CounterProps = {
  serverSnapshot?: number;
  store: ReturnType<typeof counterStore>;
};

const Counter = ({ serverSnapshot, store }: CounterProps) => {
  const count = useStore(
    store,
    serverSnapshot === undefined ? undefined : { getServerSnapshot: () => serverSnapshot },
  );
  return (
    <button
      onClick={() => {
        store.set((previous) => previous + 1);
      }}
      type="button"
    >
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

  it("hydrates distinct server and client stores from a serialized snapshot", () => {
    const serverStore = counterStore();
    serverStore.set(7);
    const serverSnapshot = serverStore.get();
    const container = document.createElement("div");
    container.innerHTML = renderToString(
      <Counter serverSnapshot={serverSnapshot} store={serverStore} />,
    );
    const clientStore = counterStore();
    const onRecoverableError = vi.fn<() => void>();
    let root: ReturnType<typeof hydrateRoot> | undefined;

    act(() => {
      root = hydrateRoot(
        container,
        <Counter serverSnapshot={serverSnapshot} store={clientStore} />,
        { onRecoverableError },
      );
    });

    expect(onRecoverableError).not.toHaveBeenCalled();

    act(() => {
      clientStore.set(1);
    });
    expect(container).toHaveTextContent("count: 1");

    act(() => root?.unmount());
  });
});
