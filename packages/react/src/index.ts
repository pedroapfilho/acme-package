import type { Store } from "@acme/core";
import { useSyncExternalStore } from "react";

type UseStoreOptions<T> = {
  getServerSnapshot?: () => T;
};

const useStore = <T>(store: Store<T>, options?: UseStoreOptions<T>): T =>
  useSyncExternalStore(store.subscribe, store.get, options?.getServerSnapshot ?? store.get);

export { useStore };
export type { UseStoreOptions };
