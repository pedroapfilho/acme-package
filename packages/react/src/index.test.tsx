import { createStore } from "@acme/core";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

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
});
