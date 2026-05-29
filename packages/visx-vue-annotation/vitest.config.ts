import { defineConfig } from 'vite-plus'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { resolve } from 'node:path'

export default defineConfig({
  plugins: [vueJsx()],
  resolve: {
    alias: [
      { find: '@visx-vue/drag', replacement: resolve(__dirname, '../visx-vue-drag/src/index.ts') },
      {
        find: '@visx-vue/group',
        replacement: resolve(__dirname, '../visx-vue-group/src/index.ts')
      },
      { find: '@visx-vue/text', replacement: resolve(__dirname, '../visx-vue-text/src/index.ts') },
      {
        find: '@visx-vue/event',
        replacement: resolve(__dirname, '../visx-vue-event/src/index.ts')
      },
      {
        find: '@visx-vue/point',
        replacement: resolve(__dirname, '../visx-vue-point/src/index.ts')
      }
    ]
  },
  test: {
    environment: 'jsdom',
    include: ['test/**/*.test.{ts,tsx}']
  }
})
