import { createStore } from "@acme/core";

// Module-level singleton: editing app.tsx hot-reloads the component without
// resetting the count; editing this file recreates the store (count resets).
const countStore = createStore(0);

export { countStore };
