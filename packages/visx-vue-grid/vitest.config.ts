import { defineConfig } from 'vite-plus'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { resolve } from 'node:path'

export default defineConfig({
  plugins: [vueJsx()],
  resolve: {
    alias: [
      {
        find: '@visx-vue/vendor/d3-shape',
        replacement: resolve(__dirname, '../visx-vue-vendor/src/d3-shape.ts')
      },
      {
        find: '@visx-vue/vendor/d3-path',
        replacement: resolve(__dirname, '../visx-vue-vendor/src/d3-path.ts')
      },
      {
        find: '@visx-vue/vendor/d3-scale',
        replacement: resolve(__dirname, '../visx-vue-vendor/src/d3-scale.ts')
      },
      {
        find: '@visx-vue/vendor/d3-interpolate',
        replacement: resolve(__dirname, '../visx-vue-vendor/src/d3-interpolate.ts')
      },
      {
        find: '@visx-vue/vendor/d3-time',
        replacement: resolve(__dirname, '../visx-vue-vendor/src/d3-time.ts')
      },
      {
        find: '@visx-vue/vendor',
        replacement: resolve(__dirname, '../visx-vue-vendor/src/index.ts')
      },
      {
        find: '@visx-vue/group',
        replacement: resolve(__dirname, '../visx-vue-group/src/index.ts')
      },
      {
        find: '@visx-vue/scale',
        replacement: resolve(__dirname, '../visx-vue-scale/src/index.ts')
      },
      {
        find: '@visx-vue/curve',
        replacement: resolve(__dirname, '../visx-vue-curve/src/index.ts')
      },
      {
        find: '@visx-vue/point',
        replacement: resolve(__dirname, '../visx-vue-point/src/index.ts')
      },
      {
        find: '@visx-vue/shape',
        replacement: resolve(__dirname, '../visx-vue-shape/src/index.ts')
      }
    ]
  },
  test: {
    environment: 'jsdom'
  }
})
