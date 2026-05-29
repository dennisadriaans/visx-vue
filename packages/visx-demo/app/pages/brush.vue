<template>
  <ExamplePage
    title="Brush"
    :packages="[
      '@visx-vue/brush',
      '@visx-vue/shape',
      '@visx-vue/gradient',
      '@visx-vue/pattern',
      '@visx-vue/group',
      '@visx-vue/scale',
      '@visx-vue/mock-data',
      '@visx-vue/axis'
    ]"
  >
    <div
      ref="parentRef"
      class="chart-container"
    >
      <svg
        v-if="width > 0"
        :width="width"
        :height="height"
      >
        <LinearGradient
          id="brush-gradient"
          from="#584153"
          to="#af8baf"
          :rotate="45"
        />
        <rect
          x="0"
          y="0"
          :width="width"
          :height="height"
          fill="url(#brush-gradient)"
          :rx="14"
        />

        <!-- Main chart -->
        <Group
          :left="margin.left"
          :top="margin.top"
        >
          <LinearGradient
            id="area-grad"
            from="#af8baf"
            to="#af8baf"
            to-opacity="0.1"
          />
          <GridRows
            :scale="stockScale"
            :width="xMax"
            stroke="#e0e0e0"
            stroke-opacity="0.2"
          />
          <AreaClosed
            :data="filteredStock"
            :x="(d) => dateScale(getDate(d)) ?? 0"
            :y="(d) => stockScale(getClose(d)) ?? 0"
            :y-scale="stockScale"
            fill="url(#area-grad)"
            stroke="#af8baf"
            stroke-width="2"
          />
          <AxisBottom
            :scale="dateScale"
            :top="yMax"
            :num-ticks="5"
            stroke="#e0e0e0"
            tick-stroke="#e0e0e0"
            :tick-label-props="{ fill: '#e0e0e0', fontSize: 11, textAnchor: 'middle' }"
          />
          <AxisLeft
            :scale="stockScale"
            :num-ticks="5"
            stroke="#e0e0e0"
            tick-stroke="#e0e0e0"
            :tick-label-props="{
              fill: '#e0e0e0',
              fontSize: 11,
              textAnchor: 'end',
              dx: '-0.25em',
              dy: '0.33em'
            }"
          />
        </Group>

        <!-- Brush/overview chart -->
        <Group
          :left="brushMargin.left"
          :top="topChartHeight + topChartBottomMargin + margin.top"
        >
          <AreaClosed
            :data="stock"
            :x="(d) => brushDateScale(getDate(d)) ?? 0"
            :y="(d) => brushStockScale(getClose(d)) ?? 0"
            :y-scale="brushStockScale"
            fill="#af8baf"
            fill-opacity="0.4"
            stroke="#af8baf"
            stroke-width="1"
          />
          <PatternLines
            id="brush-pattern"
            :height="8"
            :width="8"
            stroke="#f6acc8"
            stroke-width="1"
            :orientation="['diagonal']"
          />
          <Brush
            :x-scale="brushDateScale"
            :y-scale="brushStockScale"
            :width="xBrushMax"
            :height="yBrushMax"
            :margin="brushMargin"
            :handle-size="8"
            :resize-trigger-areas="['left', 'right']"
            brush-direction="horizontal"
            :initial-brush-position="initialBrushPosition"
            :on-change="onBrushChange"
            :selected-box-style="{ fill: 'url(#brush-pattern)', stroke: 'white' }"
            :disable-dragging-selection="false"
          />
        </Group>
      </svg>
    </div>
  </ExamplePage>
</template>

<script setup lang="ts">
import { Group } from '@visx-vue/group'
import { AreaClosed } from '@visx-vue/shape'
import { LinearGradient } from '@visx-vue/gradient'
import { PatternLines } from '@visx-vue/pattern'
import { GridRows } from '@visx-vue/grid'
import { AxisBottom, AxisLeft } from '@visx-vue/axis'
import { Brush } from '@visx-vue/brush'
import type { Bounds } from '@visx-vue/brush'
import { scaleTime, scaleLinear } from '@visx-vue/scale'
import { appleStock } from '@visx-vue/mock-data'
import type { AppleStock } from '@visx-vue/mock-data'
import { max, extent } from '@visx-vue/vendor/d3-array'
import { useParentSize } from '@visx-vue/responsive'

useHead({ title: 'Brush — visx-vue' })

const { parentRef, width } = useParentSize({ debounceTime: 0 })
const height = computed(() => Math.round(width.value * 0.6) || 400)

const stock = (appleStock as AppleStock[]).slice(1000)
const getDate = (d: AppleStock) => new Date(d.date)
const getClose = (d: AppleStock) => d.close

const margin = { top: 20, left: 50, bottom: 20, right: 20 }
const brushMargin = { top: 10, bottom: 15, left: 50, right: 20 }
const chartSeparation = 30

const filteredStock = ref(stock)

const innerHeight = computed(() => height.value - margin.top - margin.bottom)
const topChartBottomMargin = chartSeparation + 10
const topChartHeight = computed(() => 0.8 * innerHeight.value - topChartBottomMargin)
const bottomChartHeight = computed(() => innerHeight.value - topChartHeight.value - chartSeparation)

const xMax = computed(() => Math.max(width.value - margin.left - margin.right, 0))
const yMax = computed(() => Math.max(topChartHeight.value, 0))
const xBrushMax = computed(() => Math.max(width.value - brushMargin.left - brushMargin.right, 0))
const yBrushMax = computed(() =>
  Math.max(bottomChartHeight.value - brushMargin.top - brushMargin.bottom, 0)
)

const dateScale = computed(() =>
  scaleTime<number>({
    range: [0, xMax.value],
    domain: extent(filteredStock.value, getDate) as [Date, Date]
  })
)
const stockScale = computed(() =>
  scaleLinear<number>({
    range: [yMax.value, 0],
    domain: [0, max(filteredStock.value, getClose) || 0],
    nice: true
  })
)
const brushDateScale = computed(() =>
  scaleTime<number>({
    range: [0, xBrushMax.value],
    domain: extent(stock, getDate) as [Date, Date]
  })
)
const brushStockScale = computed(() =>
  scaleLinear<number>({
    range: [yBrushMax.value, 0],
    domain: [0, max(stock, getClose) || 0],
    nice: true
  })
)

const initialBrushPosition = computed(() => ({
  start: { x: brushDateScale.value(getDate(stock[50])) },
  end: { x: brushDateScale.value(getDate(stock[100])) }
}))

function onBrushChange(domain: Bounds | null) {
  if (!domain) return
  const { x0, x1, y0, y1 } = domain
  filteredStock.value = stock.filter((s) => {
    const x = getDate(s).getTime()
    const y = getClose(s)
    return x > x0 && x < x1 && y > y0 && y < y1
  })
}
</script>

<style scoped>
.chart-container {
  width: 100%;
  min-height: 400px;
}
</style>
