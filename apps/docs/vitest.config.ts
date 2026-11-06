import reactConfig from "@repo/config-vitest/react";
import { defineConfig, mergeConfig } from "vitest/config";

// The docs app has no src/, which is what the shared preset targets.
const docsConfig = mergeConfig(
  reactConfig,
  defineConfig({
    resolve: {
      tsconfigPaths: true,
    },
    test: {
      include: ["**/*.test.{ts,tsx}"],
    },
  }),
);

export default docsConfig;
