<script setup lang="ts" generic="T">
/**
 * VisBarChart — "man in the middle" composite component.
 *
 * Combines @visx-vue/shape, @visx-vue/scale, @visx-vue/axis, @visx-vue/grid,
 * and @visx-vue/tooltip behind a simple, predictable props API — similar to how
 * Unovis or Recharts abstract away the low-level primitives.
 *
 * Usage:
 *   <VisBarChart
 *     :data="items"
 *     :x="(d) => d.month"
 *     :y="(d) => d.value"
 *     :y-format="(v) => `$${v.toLocaleString()}`"
 *     series-label="Monthly Spending"
 *     color="#4ADE80"
 *   />
 */
import { computed, ref } from 'vue'
import { Bar } from '@visx-vue/shape'
import { Group } from '@visx-vue/group'
import { GridRows } from '@visx-vue/grid'
import { AxisBottom, AxisLeft } from '@visx-vue/axis'
import { scaleBand, scaleLinear } from '@visx-vue/scale'
import { useTooltip, TooltipWithBounds, defaultStyles } from '@visx-vue/tooltip'
import { useParentSize } from '@visx-vue/responsive'

// ─── Props ────────────────────────────────────────────────────────────────────

interface Margin {
  top: number
  right: number
  bottom: number
  left: number
}

const props = withDefaults(
  defineProps<{
    /** Dataset array */
    data: T[]
    /** Returns the categorical x-value for a datum */
    x: (d: T) => string
    /** Returns the numeric y-value for a datum */
    y: (d: T) => number
    /** Returns a unique key for the datum (defaults to x value) */
    dataKey?: (d: T) => string | number
    /** Bar fill color */
    color?: string
    /** Y-axis tick / tooltip value formatter */
    yFormat?: (v: number) => string
    /** X-axis tick formatter */
    xFormat?: (v: string) => string
    /** Label shown in tooltip header and legend */
    seriesLabel?: string
    /** Fixed chart height (px). If omitted, defaults to 320. */
    height?: number
    /** Inner chart margins */
    margin?: Margin
    /** Number of Y-axis ticks */
    numTicksY?: number
    /** Padding between bands (0–1) */
    bandPadding?: number
  }>(),
  {
    dataKey: (d: any) => d.month || d.id || d.date || JSON.stringify(d),
    color: 'var(--ui-primary)',
    yFormat: (v: number) => String(v),
    xFormat: (v: string) => v,
    seriesLabel: 'Value',
    height: 320,
    margin: () => ({ top: 16, right: 16, bottom: 40, left: 64 }),
    numTicksY: 5,
    bandPadding: 0.3
  }
)

// ─── Responsive sizing ────────────────────────────────────────────────────────

const { parentRef, width } = useParentSize({ debounceTime: 0 })

const chartHeight = computed(() => props.height)

const xMax = computed(() => Math.max(0, width.value - props.margin.left - props.margin.right))
const yMax = computed(() => Math.max(0, chartHeight.value - props.margin.top - props.margin.bottom))

// ─── Scales ───────────────────────────────────────────────────────────────────

const xScale = computed(() =>
  scaleBand<string>({
    range: [0, xMax.value],
    domain: props.data.map(props.x),
    padding: props.bandPadding,
    round: true
  })
)

const yDomain = computed(() => {
  const max = Math.max(...props.data.map(props.y))
  // round domain max up to a "nice" value so top grid line lands on a tick
  return [0, max]
})

const yScale = computed(() =>
  scaleLinear<number>({
    range: [yMax.value, 0],
    domain: yDomain.value,
    nice: true
  })
)

// ─── Tooltip ─────────────────────────────────────────────────────────────────

interface TooltipDatum {
  x: string
  y: number
}

const { showTooltip, hideTooltip, tooltipOpen, tooltipData, tooltipLeft, tooltipTop } = useTooltip<{
  x: string
  y: number
  key: string | number
}>()

const tooltipStyles = {
  ...defaultStyles,
  background: '#1e1e2e',
  border: '1px solid #2e2e3e',
  color: '#fff',
  borderRadius: '8px',
  padding: '10px 14px',
  minWidth: '140px',
  fontSize: '13px'
}

const svgRef = ref<SVGSVGElement | null>(null)

function handleBarHover(event: MouseEvent, d: T) {
  const svgEl = svgRef.value
  if (!svgEl) return
  const rect = svgEl.getBoundingClientRect()
  showTooltip({
    tooltipData: {
      x: props.x(d),
      y: props.y(d),
      key: props.dataKey!(d)
    },
    tooltipLeft: event.clientX - rect.left,
    tooltipTop: event.clientY - rect.top - 8
  })
}

// ─── Legend ───────────────────────────────────────────────────────────────────

// Legend is rendered as a simple HTML element below the SVG (slot-composable
// pattern — caller can override via the #legend slot).
</script>

<template>
  <div
    ref="parentRef"
    class="relative w-full text-default"
  >
    <!-- SVG canvas -->
    <svg
      v-if="width > 0"
      ref="svgRef"
      :width="width"
      :height="chartHeight"
      style="overflow: visible"
    >
      <!-- Horizontal grid lines -->
      <GridRows
        :top="margin.top"
        :left="margin.left"
        :scale="yScale"
        :width="xMax"
        :num-ticks="numTicksY"
        stroke="currentColor"
        class="text-muted [&_line]:stroke-current"
        :stroke-opacity="0.15"
        stroke-dasharray="4 4"
      />

      <!-- Bars -->
      <Group
        :top="margin.top"
        :left="margin.left"
      >
        <Bar
          v-for="d in data"
          :key="dataKey!(d)"
          :x="xScale(x(d)) ?? 0"
          :y="yScale(y(d)) ?? 0"
          :width="xScale.bandwidth()"
          :height="Math.max(0, yMax - (yScale(y(d)) ?? 0))"
          :fill="color"
          :rx="4"
          class="cursor-pointer transition-opacity duration-100"
          :style="{
            opacity: tooltipOpen && tooltipData?.key !== dataKey!(d) ? 0.6 : 1
          }"
          @mousemove="(e: MouseEvent) => handleBarHover(e, d)"
          @mouseleave="hideTooltip"
        />
      </Group>

      <!-- Y-axis -->
      <AxisLeft
        :top="margin.top"
        :left="margin.left"
        :scale="yScale"
        :num-ticks="numTicksY"
        :tick-format="(v: unknown) => yFormat(v as number)"
        hide-axis-line
        hide-ticks
        :tick-label-props="{
          fill: 'currentColor',
          fontSize: 12,
          textAnchor: 'end',
          dy: '0.33em',
          dx: '-0.25em',
          class: 'text-muted opacity-60'
        }"
      />

      <!-- X-axis -->
      <AxisBottom
        :top="yMax + margin.top"
        :left="margin.left"
        :scale="xScale"
        :tick-format="(v: unknown) => xFormat(v as string)"
        hide-axis-line
        hide-ticks
        :tick-label-props="{
          fill: 'currentColor',
          fontSize: 12,
          textAnchor: 'middle',
          class: 'text-muted opacity-60'
        }"
      />
    </svg>

    <!-- Tooltip -->
    <TooltipWithBounds
      v-if="tooltipOpen && tooltipData"
      :key="Math.random()"
      :top="tooltipTop"
      :left="tooltipLeft"
      :style="tooltipStyles"
    >
      <div class="font-bold text-highlighted mb-1">{{ tooltipData.x }}</div>
      <div class="flex items-center gap-2">
        <span
          class="inline-block w-2 h-2 rounded-full shrink-0"
          :style="{ background: color }"
        />
        <span class="text-muted">{{ seriesLabel }}</span>
        <strong class="ml-auto font-bold text-highlighted">{{ yFormat(tooltipData.y) }}</strong>
      </div>
    </TooltipWithBounds>

    <!-- Legend slot (default: colored dot + series label) -->
    <slot name="legend">
      <div class="flex items-center justify-center gap-2 mt-2 text-sm text-toned">
        <span
          class="inline-block w-2 h-2 rounded-full shrink-0"
          :style="{ background: color }"
        />
        <span>{{ seriesLabel }}</span>
      </div>
    </slot>
  </div>
</template>

<style scoped></style>
