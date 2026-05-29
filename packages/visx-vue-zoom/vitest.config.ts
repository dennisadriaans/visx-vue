import { defineConfig } from 'vite-plus'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { resolve } from 'node:path'

export default defineConfig({
  plugins: [vueJsx()],
  resolve: {
    alias: [
      {
        find: '@visx-vue/event',
        replacement: resolve(__dirname, '../visx-vue-event/src/index.ts')
      }
    ]
  },
  test: {
    environment: 'jsdom',
    include: ['test/**/*.test.{ts,tsx}']
  }
})
