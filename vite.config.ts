import { defineConfig } from "vite-plus";

export default defineConfig({
  test: {
    globals: true,
    environment: "jsdom",
    projects: ["packages/*"],
    include: [
      "packages/**/*.test.ts",
      "packages/**/*.test.tsx",
      "test/**/*.test.ts",
      "test/**/*.test.tsx",
    ],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
    },
  },
});
