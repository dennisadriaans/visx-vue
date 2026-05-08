import { defineConfig } from "vite-plus";
import vueJsx from "@vitejs/plugin-vue-jsx";
import { resolve } from "node:path";

export default defineConfig({
  plugins: [vueJsx()],
  resolve: {
    alias: {
      "@visx-vue/group": resolve(__dirname, "../visx-vue-group/src/index.ts"),
    },
  },
  test: {
    environment: "jsdom",
    include: ["test/**/*.test.{ts,tsx}"],
  },
});
