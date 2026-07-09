import type { Store } from "@acme/core";
import { useSyncExternalStore } from "react";

const useStore = <T>(store: Store<T>): T =>
  useSyncExternalStore(store.subscribe, store.get, store.get);

export { useStore };
