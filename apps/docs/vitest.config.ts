import nodeConfig from "@repo/config-vitest/node";
import { defineConfig, mergeConfig } from "vitest/config";

// The docs app has no src/, which is what the shared preset targets.
const docsConfig = mergeConfig(
  nodeConfig,
  defineConfig({
    test: {
      include: ["lib/**/*.test.ts"],
    },
  }),
);

export default docsConfig;
