import { useStore } from "@acme/react";

import { countStore } from "./store";

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
