import { defineConfig } from "vite-plus";
import vueJsx from "@vitejs/plugin-vue-jsx";
import { resolve } from "node:path";

export default defineConfig({
  plugins: [vueJsx()],
  resolve: {
    alias: [
      {
        find: "@visx-vue/vendor/d3-shape",
        replacement: resolve(__dirname, "../visx-vue-vendor/src/d3-shape.ts"),
      },
      {
        find: "@visx-vue/vendor",
        replacement: resolve(__dirname, "../visx-vue-vendor/src/index.ts"),
      },
      {
        find: "@visx-vue/group",
        replacement: resolve(__dirname, "../visx-vue-group/src/index.ts"),
      },
    ],
  },
  test: {
    environment: "jsdom",
    include: ["test/**/*.test.{ts,tsx}"],
  },
});
