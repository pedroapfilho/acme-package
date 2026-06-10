import { createStore } from "@acme/core";
import { useStore } from "@acme/react";

const countStore = createStore(0);

const App = () => {
  const count = useStore(countStore);

  return (
    <main>
      <button onClick={() => countStore.set((previous) => previous + 1)} type="button">
        count is {count}
      </button>
    </main>
  );
};

export { App };
