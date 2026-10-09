import reactConfig from "@repo/config-vitest/react";
import { defineConfig, mergeConfig } from "vitest/config";

// The docs app has no src/, which is what the shared preset targets.
const docsConfig = mergeConfig(
  reactConfig,
  defineConfig({
    test: {
      include: ["components/**/*.test.tsx", "lib/**/*.test.ts"],
    },
  }),
);

export default docsConfig;
