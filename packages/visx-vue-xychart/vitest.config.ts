import { defineConfig } from 'vite-plus'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { resolve } from 'node:path'

export default defineConfig({
  plugins: [vueJsx()],
  resolve: {
    alias: [
      {
        find: '@visx-vue/annotation',
        replacement: resolve(__dirname, '../visx-vue-annotation/src/index.ts')
      },
      { find: '@visx-vue/axis', replacement: resolve(__dirname, '../visx-vue-axis/src/index.ts') },
      { find: '@visx-vue/grid', replacement: resolve(__dirname, '../visx-vue-grid/src/index.ts') },
      {
        find: '@visx-vue/responsive',
        replacement: resolve(__dirname, '../visx-vue-responsive/src/index.ts')
      },
      {
        find: '@visx-vue/spring',
        replacement: resolve(__dirname, '../visx-vue-spring/src/index.ts')
      },
      { find: '@visx-vue/text', replacement: resolve(__dirname, '../visx-vue-text/src/index.ts') },
      {
        find: '@visx-vue/voronoi',
        replacement: resolve(__dirname, '../visx-vue-voronoi/src/index.ts')
      }
    ]
  },
  test: {
    environment: 'jsdom',
    include: ['test/**/*.test.{ts,tsx}'],
    setupFiles: ['test/setup.ts']
  }
})
