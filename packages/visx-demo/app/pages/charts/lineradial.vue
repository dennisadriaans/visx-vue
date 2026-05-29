<template>
  <ExamplePage
    title="Line Radial"
    :packages="[
      '@visx-vue/shape',
      '@visx-vue/grid',
      '@visx-vue/axis',
      '@visx-vue/gradient',
      '@visx-vue/group',
      '@visx-vue/scale',
      '@visx-vue/mock-data',
      '@visx-vue/curve'
    ]"
  >
    <div
      ref="parentRef"
      class="chart-container bg-elevated/40 rounded-xl"
    >
      <svg
        v-if="width > 0"
        :width="width"
        :height="height"
        @click="animate = !animate"
      >
        <LinearGradient
          from="#00DC82"
          to="#33e394"
          id="line-gradient"
        />
        <rect
          :width="width"
          :height="height"
          fill="transparent"
          :rx="14"
        />
        <Group
          :top="height / 2"
          :left="width / 2"
        >
          <GridAngle
            :scale="xScale"
            :outer-radius="outerRadius"
            stroke="#00DC82"
            stroke-width="1"
            :stroke-opacity="0.3"
            stroke-dasharray="5,2"
            :num-ticks="20"
          />
          <GridRadial
            :scale="yScale"
            :num-ticks="5"
            stroke="#00DC82"
            stroke-width="1"
            fill="#00DC82"
            :fill-opacity="0.1"
            :stroke-opacity="0.2"
          />
          <AxisLeft
            :top="-outerRadius"
            :scale="reverseYScale"
            :num-ticks="5"
            tick-stroke="none"
            hide-axis-line
            :tick-label-props="{
              fontSize: 8,
              fill: '#00DC82',
              textAnchor: 'middle',
              dx: '1em',
              dy: '-0.5em'
            }"
          />
          <LineRadial
            :data="stockData"
            :angle="(d) => xScale(getDate(d)) ?? 0"
            :radius="(d) => yScale(getClose(d)) ?? 0"
            :curve="curveBasisOpen"
          >
            <template #default="{ path }">
              <path
                :d="path(stockData) || ''"
                stroke-width="2"
                stroke-opacity="0.8"
                stroke-linecap="round"
                fill="none"
                stroke="url(#line-gradient)"
              />
            </template>
          </LineRadial>
        </Group>
      </svg>
      <p class="text-xs text-default mt-1">Click to pause/resume</p>
    </div>
  </ExamplePage>
</template>

<script setup lang="ts">
import { Group } from '@visx-vue/group'
import { LineRadial } from '@visx-vue/shape'
import { scaleTime, scaleLog } from '@visx-vue/scale'
import { curveBasisOpen } from '@visx-vue/curve'
import { appleStock } from '@visx-vue/mock-data'
import type { AppleStock } from '@visx-vue/mock-data'
import { LinearGradient } from '@visx-vue/gradient'
import { AxisLeft } from '@visx-vue/axis'
import { GridRadial, GridAngle } from '@visx-vue/grid'
import { useParentSize } from '@visx-vue/responsive'

useHead({ title: 'Line Radial — visx-vue' })

const { parentRef, width } = useParentSize({ debounceTime: 0 })
const height = computed(() => Math.round(width.value * 0.6) || 400)

const animate = ref(true)
const stockData = appleStock as AppleStock[]
const padding = 20

const getDate = (d: AppleStock) => new Date(d.date).valueOf()
const getClose = (d: AppleStock) => d.close

const xScale = scaleTime<number>({
  range: [0, Math.PI * 2],
  domain: [Math.min(...stockData.map(getDate)), Math.max(...stockData.map(getDate))]
})

const outerRadius = computed(() => height.value / 2 - padding)

const yScale = computed(() =>
  scaleLog<number>({
    domain: [Math.min(...stockData.map(getClose)), Math.max(...stockData.map(getClose))],
    range: [0, outerRadius.value]
  })
)

const reverseYScale = computed(() => {
  const s = yScale.value.copy()
  s.range([outerRadius.value, 0])
  return s
})
</script>

<style scoped>
.chart-container {
  width: 100%;
  min-height: 400px;
  cursor: pointer;
}
</style>
