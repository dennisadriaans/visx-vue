<template>
  <ExamplePage
    title="Areas"
    :packages="[
      '@visx-vue/shape',
      '@visx-vue/gradient',
      '@visx-vue/grid',
      '@visx-vue/scale',
      '@visx-vue/tooltip',
      '@visx-vue/mock-data',
    ]"
  >
    <div ref="parentRef" class="chart-outer" @mouseleave="handleMouseLeave">
      <svg
        v-if="width > 0"
        :width="width"
        :height="height"
        @mousemove="handleMouseMove"
        @touchstart.prevent="handleMouseMove"
        @touchmove.prevent="handleMouseMove"
      >
        <defs>
          <LinearGradient id="area-bg-grad" from="#3b6978" to="#204051" />
          <LinearGradient id="area-grad" from="#edffea" to="#edffea" :to-opacity="0.1" />
        </defs>
        <rect x="0" y="0" :width="width" :height="height" fill="url(#area-bg-grad)" :rx="14" />
        <GridRows
          :left="margin.left"
          :scale="stockValueScale"
          :width="innerWidth"
          stroke-dasharray="1,3"
          stroke="#edffea"
          :stroke-opacity="0"
          pointer-events="none"
        />
        <GridColumns
          :top="margin.top"
          :scale="dateScale"
          :height="innerHeight"
          stroke-dasharray="1,3"
          stroke="#edffea"
          :stroke-opacity="0.2"
          pointer-events="none"
        />
        <AreaClosed
          :data="stock"
          :x="(d) => dateScale(getDate(d)) ?? 0"
          :y="(d) => stockValueScale(getStockValue(d)) ?? 0"
          :y-scale="stockValueScale"
          :stroke-width="1"
          stroke="url(#area-grad)"
          fill="url(#area-grad)"
          :curve="curveMonotoneX"
        />
        <!-- transparent event capture rect -->
        <rect
          :x="margin.left"
          :y="margin.top"
          :width="innerWidth"
          :height="innerHeight"
          fill="transparent"
        />
        <template v-if="tooltipData">
          <Line
            :from="{ x: tooltipLeft, y: margin.top }"
            :to="{ x: tooltipLeft, y: innerHeight + margin.top }"
            stroke="#75daad"
            :stroke-width="2"
            pointer-events="none"
            stroke-dasharray="5,2"
          />
          <circle
            :cx="tooltipLeft"
            :cy="(tooltipTop ?? 0) + 1"
            r="4"
            fill="black"
            :fill-opacity="0.1"
            stroke="black"
            :stroke-opacity="0.1"
            :stroke-width="2"
            pointer-events="none"
          />
          <circle
            :cx="tooltipLeft"
            :cy="tooltipTop"
            r="4"
            fill="#75daad"
            stroke="white"
            :stroke-width="2"
            pointer-events="none"
          />
        </template>
      </svg>
      <template v-if="tooltipData">
        <TooltipWithBounds
          :top="(tooltipTop ?? 0) - 12"
          :left="(tooltipLeft ?? 0) + 12"
          :style="tooltipStyles"
        >
          ${{ getStockValue(tooltipData) }}
        </TooltipWithBounds>
        <Tooltip
          :top="innerHeight + margin.top - 14"
          :left="tooltipLeft ?? 0"
          :style="{
            ...defaultStyles,
            minWidth: '72px',
            textAlign: 'center',
            transform: 'translateX(-50%)',
          }"
        >
          {{ formatDate(getDate(tooltipData)) }}
        </Tooltip>
      </template>
    </div>
  </ExamplePage>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { AreaClosed, Line } from "@visx-vue/shape";
import { GridRows, GridColumns } from "@visx-vue/grid";
import { scaleTime, scaleLinear } from "@visx-vue/scale";
import { useTooltip, Tooltip, TooltipWithBounds, defaultStyles } from "@visx-vue/tooltip";
import { localPoint } from "@visx-vue/event";
import { LinearGradient } from "@visx-vue/gradient";
import { appleStock } from "@visx-vue/mock-data";
import type { AppleStock } from "@visx-vue/mock-data";
import { curveMonotoneX } from "@visx-vue/curve";
import { max, extent, bisector } from "@visx-vue/vendor/d3-array";
import { timeFormat } from "@visx-vue/vendor/d3-time-format";
import { useParentSize } from "@visx-vue/responsive";

useHead({ title: "Areas — visx-vue" });

const { parentRef, width } = useParentSize({ debounceTime: 0 });
const height = computed(() => Math.round(width.value * 0.6) || 400);

const margin = { top: 0, right: 0, bottom: 0, left: 0 };

const stock = appleStock.slice(800) as AppleStock[];
const formatDate = timeFormat("%b %d, '%y");
const getDate = (d: AppleStock) => new Date(d.date);
const getStockValue = (d: AppleStock) => d.close;
const bisectDate = bisector<AppleStock, Date>((d) => new Date(d.date)).left;

const innerWidth = computed(() => width.value - margin.left - margin.right);
const innerHeight = computed(() => height.value - margin.top - margin.bottom);

const dateScale = computed(() =>
  scaleTime({
    range: [margin.left, innerWidth.value + margin.left],
    domain: extent(stock, getDate) as [Date, Date],
  }),
);
const stockValueScale = computed(() =>
  scaleLinear({
    range: [innerHeight.value + margin.top, margin.top],
    domain: [0, (max(stock, getStockValue) || 0) + innerHeight.value / 3],
    nice: true,
  }),
);

const tooltipStyles = {
  ...defaultStyles,
  background: "#3b6978",
  border: "1px solid white",
  color: "white",
};

const { showTooltip, hideTooltip, tooltipData, tooltipTop, tooltipLeft } = useTooltip<AppleStock>();

function handleMouseMove(event: MouseEvent | TouchEvent) {
  const svgEl = (event.currentTarget as HTMLElement).querySelector("svg");
  if (!svgEl) return;
  const point = localPoint(svgEl as SVGElement, event);
  if (!point) return;
  const x0 = dateScale.value.invert(point.x);
  const index = bisectDate(stock, x0, 1);
  const d0 = stock[index - 1];
  const d1 = stock[index];
  let d = d0;
  if (d1 && getDate(d1)) {
    d = x0.valueOf() - getDate(d0).valueOf() > getDate(d1).valueOf() - x0.valueOf() ? d1 : d0;
  }
  showTooltip({
    tooltipData: d,
    tooltipLeft: point.x,
    tooltipTop: stockValueScale.value(getStockValue(d)),
  });
}

function handleMouseLeave() {
  hideTooltip();
}
</script>

<style scoped>
.chart-outer {
  width: 100%;
  min-height: 400px;
  position: relative;
  cursor: crosshair;
}
</style>
