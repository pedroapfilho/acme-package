import { describe, expect, it, vi } from "vitest";

import { createStore } from ".";

describe("createStore", () => {
  it("returns the initial state", () => {
    const store = createStore({ count: 0 });
    expect(store.get()).toEqual({ count: 0 });
  });

  it("set replaces the state and notifies subscribers", () => {
    const store = createStore(0);
    const listener = vi.fn<() => void>();
    store.subscribe(listener);

    store.set(1);

    expect(store.get()).toBe(1);
    expect(listener).toHaveBeenCalledTimes(1);
  });

  it("set accepts a functional updater receiving the previous state", () => {
    const store = createStore(10);

    store.set((previous) => previous + 5);

    expect(store.get()).toBe(15);
  });

  it("unsubscribe stops notifications", () => {
    const store = createStore(0);
    const listener = vi.fn<() => void>();
    const unsubscribe = store.subscribe(listener);

    unsubscribe();
    store.set(1);

    expect(listener).not.toHaveBeenCalled();
  });

  it("skips notification when the next state is Object.is-equal", () => {
    const store = createStore(1);
    const listener = vi.fn<() => void>();
    store.subscribe(listener);

    store.set(1);

    expect(listener).not.toHaveBeenCalled();
  });

  it("a listener that unsubscribes itself does not block other listeners", () => {
    const store = createStore(0);
    const second = vi.fn<() => void>();
    const unsubscribeFirst = store.subscribe(() => {
      unsubscribeFirst();
    });
    store.subscribe(second);

    store.set(1);

    expect(second).toHaveBeenCalledTimes(1);
  });
});
