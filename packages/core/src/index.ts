type Listener = () => void;

type Updater<T> = T | ((previous: T) => T);

type Store<T> = {
  get: () => T;
  set: (next: Updater<T>) => void;
  subscribe: (listener: Listener) => () => void;
};

// typeof can't narrow `T | ((previous: T) => T)` when T itself is a
// function type: function-valued state must use set(() => fn), the
// same caveat zustand documents.
const isUpdaterFunction = <T>(value: Updater<T>): value is (previous: T) => T =>
  typeof value === "function";

const createStore = <T>(initial: T): Store<T> => {
  let state = initial;
  const listeners = new Set<Listener>();

  return {
    get: () => state,
    set: (updater) => {
      const value = isUpdaterFunction(updater) ? updater(state) : updater;
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
