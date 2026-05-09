<template>
  <ExamplePage
    back-to="/charts"
    back-label="Charts"
    title="Line Chart"
    :packages="[
      '@visx-vue/shape',
      '@visx-vue/group',
      '@visx-vue/axis',
      '@visx-vue/grid',
      '@visx-vue/scale',
      '@visx-vue/gradient',
      '@visx-vue/tooltip',
      '@visx-vue/mock-data',
      '@visx-vue/curve',
      '@visx-vue/event',
    ]"
  >
    <div class="mb-4 flex gap-2">
      <UButton
        :variant="variant === 'single' ? 'solid' : 'ghost'"
        color="primary"
        size="sm"
        @click="variant = 'single'"
        >Single Line</UButton
      >
      <UButton
        :variant="variant === 'multi' ? 'solid' : 'ghost'"
        color="primary"
        size="sm"
        @click="variant = 'multi'"
        >Multi-line</UButton
      >
    </div>

    <!-- Single line -->
    <template v-if="variant === 'single'">
      <div ref="parentRef" class="chart-outer bg-elevated/40 rounded-xl" @mouseleave="hideTooltip">
        <svg v-if="width > 0" :width="width" :height="height" @mousemove="handleMouseMove">
          <rect :width="width" :height="height" fill="transparent" :rx="12" />
          <Group :left="margin.left" :top="margin.top">
            <GridRows
              :scale="priceScale"
              :width="xMax"
              stroke="#ffffff"
              :stroke-opacity="0.05"
              :num-ticks="5"
              pointer-events="none"
            />
            <LinePath
              :data="stock"
              :x="(d) => dateScale(getDate(d)) ?? 0"
              :y="(d) => priceScale(getClose(d)) ?? 0"
              :curve="curveMonotoneX"
              stroke="#00DC82"
              :stroke-width="2"
              fill="none"
            />
            <!-- glow duplicate -->
            <LinePath
              :data="stock"
              :x="(d) => dateScale(getDate(d)) ?? 0"
              :y="(d) => priceScale(getClose(d)) ?? 0"
              :curve="curveMonotoneX"
              stroke="#00DC82"
              :stroke-width="6"
              :stroke-opacity="0.15"
              fill="none"
              pointer-events="none"
            />
            <AxisBottom
              :top="yMax"
              :scale="dateScale"
              :num-ticks="5"
              :tick-format="(d) => fmtDate(d as Date)"
              stroke="#ffffff22"
              tick-stroke="#ffffff22"
              :tick-label-props="xTickProps"
            />
            <AxisLeft
              :scale="priceScale"
              :num-ticks="5"
              :tick-format="(d) => `$${Number(d).toFixed(0)}`"
              stroke="#ffffff22"
              tick-stroke="#ffffff22"
              :tick-label-props="yTickProps"
            />
            <template v-if="tooltipData">
              <Line
                :from="{ x: tooltipLeft - margin.left, y: 0 }"
                :to="{ x: tooltipLeft - margin.left, y: yMax }"
                stroke="#00DC82"
                :stroke-width="1"
                stroke-dasharray="4,3"
                pointer-events="none"
              />
              <circle
                :cx="tooltipLeft - margin.left"
                :cy="priceScale(getClose(tooltipData))"
                r="5"
                fill="#00DC82"
                stroke="#0a2a1a"
                :stroke-width="2"
                pointer-events="none"
              />
            </template>
          </Group>
        </svg>
        <TooltipWithBounds
          v-if="tooltipData"
          :top="(priceScale(getClose(tooltipData)) ?? 0) + margin.top - 38"
          :left="tooltipLeft + 12"
          :style="ttStyle"
        >
          <div class="tt-label">{{ fmtDate(getDate(tooltipData)) }}</div>
          <div class="tt-value">${{ getClose(tooltipData).toFixed(2) }}</div>
        </TooltipWithBounds>
      </div>
    </template>

    <!-- Multi-line -->
    <template v-else>
      <div ref="parentRef2" class="chart-outer bg-elevated/40 rounded-xl">
        <svg v-if="width2 > 0" :width="width2" :height="height2">
          <rect :width="width2" :height="height2" fill="transparent" :rx="12" />
          <Group :left="marginM.left" :top="marginM.top">
            <GridRows
              :scale="yScaleM"
              :width="xMaxM"
              stroke="#ffffff"
              :stroke-opacity="0.05"
              :num-ticks="5"
              pointer-events="none"
            />
            <template v-for="city in cities" :key="city">
              <LinePath
                :data="cityData"
                :x="(d) => xScaleM(parseDateM(d.date) as Date) ?? 0"
                :y="(d) => yScaleM(Number(d[city])) ?? 0"
                :curve="curveMonotoneX"
                :stroke="cityColors[city]"
                :stroke-width="2"
                fill="none"
              />
            </template>
            <AxisBottom
              :top="yMaxM"
              :scale="xScaleM"
              :num-ticks="5"
              :tick-format="(d) => fmtDateM(d as Date)"
              stroke="#ffffff22"
              tick-stroke="#ffffff22"
              :tick-label-props="xTickProps"
            />
            <AxisLeft
              :scale="yScaleM"
              :num-ticks="5"
              :tick-format="(d) => `${Number(d).toFixed(0)}°`"
              stroke="#ffffff22"
              tick-stroke="#ffffff22"
              :tick-label-props="yTickProps"
            />
          </Group>
        </svg>
        <div class="flex flex-wrap gap-4 mt-3 pl-[55px]">
          <span
            v-for="city in cities"
            :key="city"
            class="flex items-center gap-2 text-xs text-default"
          >
            <span
              class="inline-block w-5 h-0.5 rounded"
              :style="{ background: cityColors[city] }"
            />
            {{ city }}
          </span>
        </div>
      </div>
    </template>
  </ExamplePage>
</template>

<script setup lang="ts">
import { LinePath, Line } from "@visx-vue/shape";
import { Group } from "@visx-vue/group";
import { GridRows } from "@visx-vue/grid";
import { AxisBottom, AxisLeft } from "@visx-vue/axis";
import { scaleTime, scaleLinear } from "@visx-vue/scale";
import { LinearGradient } from "@visx-vue/gradient";
import { useTooltip, TooltipWithBounds } from "@visx-vue/tooltip";
import { localPoint } from "@visx-vue/event";
import { appleStock, cityTemperature } from "@visx-vue/mock-data";
import type { AppleStock, CityTemperature } from "@visx-vue/mock-data";
import { curveMonotoneX } from "@visx-vue/curve";
import { max, min, extent, bisector } from "@visx-vue/vendor/d3-array";
import { timeFormat, timeParse } from "@visx-vue/vendor/d3-time-format";
import { useParentSize } from "@visx-vue/responsive";

useHead({ title: "Line Chart — visx-vue" });

const variant = ref<"single" | "multi">("single");

// ── Single line ───────────────────────────────────────────────
const { parentRef, width } = useParentSize({ debounceTime: 0 });
const height = computed(() => Math.round(width.value * 0.55) || 400);
const margin = { top: 20, right: 20, bottom: 40, left: 55 };

const stock = appleStock.slice(800) as AppleStock[];
const fmtDate = timeFormat("%b %d '%y");
const getDate = (d: AppleStock) => new Date(d.date);
const getClose = (d: AppleStock) => d.close;
const bisectDate = bisector<AppleStock, Date>((d) => new Date(d.date)).left;

const xMax = computed(() => width.value - margin.left - margin.right);
const yMax = computed(() => height.value - margin.top - margin.bottom);

const dateScale = computed(() =>
  scaleTime({ range: [0, xMax.value], domain: extent(stock, getDate) as [Date, Date] }),
);
const priceScale = computed(() =>
  scaleLinear({
    range: [yMax.value, 0],
    domain: [(min(stock, getClose) ?? 0) * 0.95, (max(stock, getClose) ?? 0) * 1.05],
    nice: true,
  }),
);

const xTickProps = { fill: "#ffffff55", fontSize: 11, textAnchor: "middle" as const };
const yTickProps = {
  fill: "#ffffff55",
  fontSize: 11,
  textAnchor: "end" as const,
  dx: "-0.3em",
  dy: "0.33em",
};

const ttStyle = {
  background: "#1a1a2e",
  border: "1px solid #00DC8233",
  borderRadius: "8px",
  padding: "8px 12px",
  color: "#fff",
  pointerEvents: "none" as const,
};

const { showTooltip, hideTooltip, tooltipData, tooltipLeft } = useTooltip<AppleStock>();

function handleMouseMove(e: MouseEvent) {
  const svg = e.currentTarget as SVGElement;
  const pt = localPoint(svg, e);
  if (!pt) return;
  const x0 = dateScale.value.invert(pt.x - margin.left);
  const idx = bisectDate(stock, x0, 1);
  const d0 = stock[idx - 1];
  const d1 = stock[idx];
  const d =
    d1 && x0.valueOf() - getDate(d0).valueOf() > getDate(d1).valueOf() - x0.valueOf() ? d1 : d0;
  showTooltip({ tooltipData: d, tooltipLeft: pt.x, tooltipTop: pt.y });
}

// ── Multi-line ────────────────────────────────────────────────
const { parentRef: parentRef2, width: width2 } = useParentSize({ debounceTime: 0 });
const height2 = computed(() => Math.round(width2.value * 0.55) || 400);
const marginM = { top: 20, right: 20, bottom: 40, left: 55 };

const cityData = cityTemperature.slice(0, 60) as CityTemperature[];
type CityKey = "Austin" | "New York" | "San Francisco";
const cities: CityKey[] = ["Austin", "New York", "San Francisco"];
const cityColors: Record<CityKey, string> = {
  Austin: "#00DC82",
  "New York": "#00b368",
  "San Francisco": "#33e394",
};
const parseDateM = timeParse("%Y-%m-%d");
const fmtDateM = timeFormat("%b '%y");

const xMaxM = computed(() => width2.value - marginM.left - marginM.right);
const yMaxM = computed(() => height2.value - marginM.top - marginM.bottom);

const xScaleM = computed(() =>
  scaleTime({
    range: [0, xMaxM.value],
    domain: [
      Math.min(...cityData.map((d) => (parseDateM(d.date) as Date).valueOf())),
      Math.max(...cityData.map((d) => (parseDateM(d.date) as Date).valueOf())),
    ],
  }),
);

const allTemps = computed(() => cityData.flatMap((d) => cities.map((c) => Number(d[c]))));
const yScaleM = computed(() =>
  scaleLinear({
    range: [yMaxM.value, 0],
    domain: [Math.min(...allTemps.value) - 5, Math.max(...allTemps.value) + 5],
    nice: true,
  }),
);
</script>

<style scoped>
.chart-outer {
  width: 100%;
  min-height: 400px;
  position: relative;
  cursor: crosshair;
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
</style>
