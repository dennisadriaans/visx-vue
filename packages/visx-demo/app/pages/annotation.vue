<template>
  <ExamplePage
    title="Annotation"
    :packages="[
      '@visx-vue/annotation',
      '@visx-vue/shape',
      '@visx-vue/scale',
      '@visx-vue/mock-data'
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
        <rect
          :width="width"
          :height="height"
          fill="#ecf4f3"
          :rx="14"
        />
        <LinePath
          stroke="#006a71"
          stroke-width="2"
          :data="stockData"
          :x="(d) => xScale(getDate(d)) ?? 0"
          :y="(d) => yScale(getClose(d)) ?? 0"
        />
        <Annotation
          :x="annotX"
          :y="annotY"
          :dx="50"
          :dy="-50"
        >
          <Connector
            stroke="#ff7e67"
            type="elbow"
          />
          <Label
            background-fill="white"
            :show-anchor-line="true"
            anchor-line-stroke="#68b0ab"
            font-color="#006a71"
            horizontal-anchor="auto"
            vertical-anchor="auto"
            title="AAPL Stock"
            subtitle="Annotated peak"
            :width="120"
            :background-props="{ stroke: '#68b0ab' }"
          />
          <CircleSubject stroke="#ff7e67" />
        </Annotation>
      </svg>
    </div>
  </ExamplePage>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Annotation, Connector, Label, CircleSubject } from '@visx-vue/annotation'
import { LinePath } from '@visx-vue/shape'
import { scaleTime, scaleLinear } from '@visx-vue/scale'
import { appleStock } from '@visx-vue/mock-data'
import type { AppleStock } from '@visx-vue/mock-data'
import { useParentSize } from '@visx-vue/responsive'

useHead({ title: 'Annotation — visx-vue' })

const { parentRef, width } = useParentSize({ debounceTime: 0 })
const height = computed(() => Math.round(width.value * 0.6) || 400)

const stockData = appleStock.slice(0, 200) as AppleStock[]
const getDate = (d: AppleStock) => new Date(d.date).valueOf()
const getClose = (d: AppleStock) => d.close

const margin = { top: 20, left: 60, right: 40, bottom: 40 }

const xScale = computed(() =>
  scaleTime<number>({
    domain: [Math.min(...stockData.map(getDate)), Math.max(...stockData.map(getDate))],
    range: [margin.left, width.value - margin.right]
  })
)
const yScale = computed(() =>
  scaleLinear<number>({
    domain: [Math.min(...stockData.map(getClose)), Math.max(...stockData.map(getClose))],
    range: [height.value - margin.bottom, margin.top]
  })
)

// find the peak value
const peakIndex = stockData.reduce(
  (best, d, i) => (getClose(d) > getClose(stockData[best]) ? i : best),
  0
)
const peakDatum = stockData[peakIndex]

const annotX = computed(() => xScale.value(getDate(peakDatum)) ?? 0)
const annotY = computed(() => yScale.value(getClose(peakDatum)) ?? 0)
</script>

<style scoped>
.chart-container {
  width: 100%;
  min-height: 400px;
}
</style>
