type Listener = () => void;

type Updater<T> = T | ((previous: T) => T);

type Store<T> = {
  get: () => T;
  set: (next: Updater<T>) => void;
  subscribe: (listener: Listener) => () => void;
};

/**
 * A minimal external store. Exists to demonstrate the canonical package
 * shape (build, exports, tests, docs) — replace with your real library.
 */
const createStore = <T>(initial: T): Store<T> => {
  let state = initial;
  const listeners = new Set<Listener>();

  return {
    get: () => state,
    set: (next) => {
      // typeof can't narrow `T | ((previous: T) => T)` when T itself is a
      // function type — function-valued state must use set(() => fn), the
      // same caveat zustand documents.
      const value = typeof next === "function" ? (next as (previous: T) => T)(state) : next;
      if (Object.is(value, state)) {
        return;
      }
      state = value;
      for (const listener of listeners) {
        listener();
      }
    },
    subscribe: (listener) => {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
  };
};

export { createStore };
export type { Store, Updater };
