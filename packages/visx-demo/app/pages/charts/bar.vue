<template>
  <ExamplePage
    back-to="/charts"
    back-label="Charts"
    title="Bar Chart"
    :packages="[
      '@visx-vue/shape',
      '@visx-vue/group',
      '@visx-vue/axis',
      '@visx-vue/grid',
      '@visx-vue/scale',
      '@visx-vue/gradient',
      '@visx-vue/tooltip',
      '@visx-vue/mock-data',
      '@visx-vue/event'
    ]"
  >
    <div class="controls">
      <button
        :class="{ active: variant === 'vertical' }"
        @click="variant = 'vertical'"
      >
        Vertical
      </button>
      <button
        :class="{ active: variant === 'horizontal' }"
        @click="variant = 'horizontal'"
      >
        Horizontal
      </button>
    </div>

    <!-- Vertical bar chart -->
    <template v-if="variant === 'vertical'">
      <div
        ref="parentRef"
        class="chart-outer bg-elevated/40 rounded-xl"
        @mouseleave="hideTooltip"
      >
        <svg
          v-if="width > 0"
          :width="width"
          :height="height"
        >
          <rect
            :width="width"
            :height="height"
            fill="transparent"
            :rx="12"
          />
          <Group
            :left="margin.left"
            :top="margin.top"
          >
            <GridRows
              :scale="yScale"
              :width="xMax"
              stroke="#ffffff"
              :stroke-opacity="0.06"
              :num-ticks="5"
              pointer-events="none"
            />
            <Bar
              v-for="d in letters"
              :key="d.letter"
              :x="xScale(d.letter) ?? 0"
              :y="yScale(getFreq(d)) ?? 0"
              :width="xScale.bandwidth()"
              :height="yMax - (yScale(getFreq(d)) ?? 0)"
              :fill="tooltipData?.letter === d.letter ? '#33e394' : '#00DC82'"
              :rx="4"
              style="cursor: pointer; transition: fill 0.1s"
              @mousemove="(e) => handleBarHover(e, d)"
              @mouseleave="hideTooltip"
            />
            <AxisBottom
              :top="yMax"
              :scale="xScale"
              stroke="#ffffff22"
              tick-stroke="#ffffff22"
              :tick-label-props="xTickProps"
            />
            <AxisLeft
              :scale="yScale"
              :num-ticks="5"
              :tick-format="(d) => `${Number(d).toFixed(1)}%`"
              stroke="#ffffff22"
              tick-stroke="#ffffff22"
              :tick-label-props="yTickProps"
            />
          </Group>
        </svg>
        <Tooltip
          v-if="tooltipOpen && tooltipData"
          :left="tooltipLeft"
          :top="tooltipTop"
          :style="ttStyle"
        >
          <div class="tt-label">{{ tooltipData.letter }}</div>
          <div class="tt-value">{{ getFreq(tooltipData).toFixed(2) }}%</div>
        </Tooltip>
      </div>
    </template>

    <!-- Horizontal bar chart -->
    <template v-else>
      <div
        ref="parentRef2"
        class="chart-outer bg-elevated/40 rounded-xl"
        @mouseleave="hideTooltip2"
      >
        <svg
          v-if="width2 > 0"
          :width="width2"
          :height="height2"
        >
          <rect
            :width="width2"
            :height="height2"
            fill="transparent"
            :rx="12"
          />
          <Group
            :left="marginH.left"
            :top="marginH.top"
          >
            <GridColumns
              :scale="xScaleH"
              :height="yMaxH"
              stroke="#ffffff"
              :stroke-opacity="0.06"
              :num-ticks="5"
              pointer-events="none"
            />
            <Bar
              v-for="d in lettersH"
              :key="d.letter"
              x="0"
              :y="yScaleH(d.letter) ?? 0"
              :width="xScaleH(getFreqH(d)) ?? 0"
              :height="yScaleH.bandwidth()"
              :fill="tooltipData2?.letter === d.letter ? '#33e394' : '#00DC82'"
              :rx="4"
              style="cursor: pointer; transition: fill 0.1s"
              @mousemove="(e) => handleBarHover2(e, d)"
              @mouseleave="hideTooltip2"
            />
            <AxisBottom
              :top="yMaxH"
              :scale="xScaleH"
              :num-ticks="5"
              :tick-format="(d) => `${Number(d).toFixed(1)}%`"
              stroke="#ffffff22"
              tick-stroke="#ffffff22"
              :tick-label-props="xTickProps"
            />
            <AxisLeft
              :scale="yScaleH"
              stroke="#ffffff22"
              tick-stroke="#ffffff22"
              :tick-label-props="yTickPropsH"
            />
          </Group>
        </svg>
        <Tooltip
          v-if="tooltipOpen2 && tooltipData2"
          :left="tooltipLeft2"
          :top="tooltipTop2"
          :style="ttStyleGreen"
        >
          <div class="tt-label">{{ tooltipData2.letter }}</div>
          <div class="tt-value tt-green">{{ getFreqH(tooltipData2).toFixed(2) }}%</div>
        </Tooltip>
      </div>
    </template>
  </ExamplePage>
</template>

<script setup lang="ts">
import { Bar } from '@visx-vue/shape'
import { Group } from '@visx-vue/group'
import { GridRows, GridColumns } from '@visx-vue/grid'
import { AxisBottom, AxisLeft } from '@visx-vue/axis'
import { scaleBand, scaleLinear } from '@visx-vue/scale'
import { useTooltip, Tooltip } from '@visx-vue/tooltip'
import { localPoint } from '@visx-vue/event'
import { letterFrequency } from '@visx-vue/mock-data'
import type { LetterFrequency } from '@visx-vue/mock-data'
import { useParentSize } from '@visx-vue/responsive'
import { max } from '@visx-vue/vendor/d3-array'

useHead({ title: 'Bar Chart — visx-vue' })

const variant = ref<'vertical' | 'horizontal'>('vertical')

// ── Vertical ──────────────────────────────────────────────────
const { parentRef, width } = useParentSize({ debounceTime: 0 })
const height = computed(() => Math.round(width.value * 0.55) || 400)
const margin = { top: 20, right: 20, bottom: 40, left: 55 }

const letters = letterFrequency.slice(0, 12) as LetterFrequency[]
const getFreq = (d: LetterFrequency) => Number(d.frequency) * 100

const xMax = computed(() => width.value - margin.left - margin.right)
const yMax = computed(() => height.value - margin.top - margin.bottom)

const xScale = computed(() =>
  scaleBand<string>({
    range: [0, xMax.value],
    domain: letters.map((d) => d.letter),
    padding: 0.3
  })
)
const yScale = computed(() =>
  scaleLinear<number>({
    range: [yMax.value, 0],
    domain: [0, (max(letters, getFreq) ?? 0) * 1.1],
    nice: true
  })
)

const xTickProps = { fill: '#ffffff55', fontSize: 11, textAnchor: 'middle' as const }
const yTickProps = {
  fill: '#ffffff55',
  fontSize: 11,
  textAnchor: 'end' as const,
  dx: '-0.3em',
  dy: '0.33em'
}

const ttStyle = {
  background: '#1e1e2e',
  border: '1px solid #00DC8233',
  borderRadius: '8px',
  padding: '8px 12px',
  color: '#fff',
  pointerEvents: 'none' as const,
  fontSize: '13px'
}
const ttStyleGreen = { ...ttStyle, border: '1px solid #00DC8233' }

const { showTooltip, hideTooltip, tooltipOpen, tooltipData, tooltipLeft, tooltipTop } =
  useTooltip<LetterFrequency>()

function handleBarHover(e: MouseEvent, d: LetterFrequency) {
  const pt = localPoint(e) ?? { x: 0, y: 0 }
  showTooltip({ tooltipData: d, tooltipLeft: pt.x + 8, tooltipTop: pt.y - 30 })
}

// ── Horizontal ────────────────────────────────────────────────
const { parentRef: parentRef2, width: width2 } = useParentSize({ debounceTime: 0 })
const height2 = computed(() => Math.round(width2.value * 0.55) || 400)
const marginH = { top: 20, right: 30, bottom: 40, left: 40 }

const lettersH = letterFrequency.slice(12, 24) as LetterFrequency[]
const getFreqH = (d: LetterFrequency) => Number(d.frequency) * 100

const xMaxH = computed(() => width2.value - marginH.left - marginH.right)
const yMaxH = computed(() => height2.value - marginH.top - marginH.bottom)

const xScaleH = computed(() =>
  scaleLinear<number>({
    range: [0, xMaxH.value],
    domain: [0, (max(lettersH, getFreqH) ?? 0) * 1.1],
    nice: true
  })
)
const yScaleH = computed(() =>
  scaleBand<string>({
    range: [0, yMaxH.value],
    domain: lettersH.map((d) => d.letter),
    padding: 0.3
  })
)
const yTickPropsH = {
  fill: '#ffffff55',
  fontSize: 11,
  textAnchor: 'end' as const,
  dx: '-0.3em',
  dy: '0.33em'
}

const {
  showTooltip: showTooltip2,
  hideTooltip: hideTooltip2,
  tooltipOpen: tooltipOpen2,
  tooltipData: tooltipData2,
  tooltipLeft: tooltipLeft2,
  tooltipTop: tooltipTop2
} = useTooltip<LetterFrequency>()

function handleBarHover2(e: MouseEvent, d: LetterFrequency) {
  const pt = localPoint(e) ?? { x: 0, y: 0 }
  showTooltip2({ tooltipData: d, tooltipLeft: pt.x + 8, tooltipTop: pt.y - 30 })
}
</script>

<style scoped>
.chart-outer {
  width: 100%;
  min-height: 400px;
  position: relative;
}
.controls {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
}
.controls button {
  padding: 6px 14px;
  border-radius: 6px;
  border: 1px solid #ffffff22;
  background: transparent;
  color: #ffffff88;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.15s;
}
.controls button.active {
  background: #00dc82;
  border-color: #00dc82;
  color: #fff;
}
.tt-label {
  font-size: 11px;
  color: #ffffff88;
  margin-bottom: 2px;
}
.tt-value {
  font-size: 15px;
  font-weight: 600;
  color: #00dc82;
}
.tt-green {
  color: #00dc82;
}
</style>
