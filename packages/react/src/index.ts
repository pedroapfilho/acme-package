import type { Store } from "@acme/core";
import { useSyncExternalStore } from "react";

/** Subscribe a component to an @acme/core store (SSR-safe). */
const useStore = <T>(store: Store<T>): T =>
  useSyncExternalStore(store.subscribe, store.get, store.get);

export { useStore };
