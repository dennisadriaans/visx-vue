<template>
  <ExamplePage
    back-to="/charts"
    back-label="Charts"
    title="Area Chart"
    :packages="[
      '@visx-vue/shape',
      '@visx-vue/gradient',
      '@visx-vue/grid',
      '@visx-vue/axis',
      '@visx-vue/scale',
      '@visx-vue/tooltip',
      '@visx-vue/mock-data',
      '@visx-vue/curve',
      '@visx-vue/event',
    ]"
  >
    <!-- Toggle -->
    <div class="controls">
      <button :class="{ active: variant === 'single' }" @click="variant = 'single'">Single Area</button>
      <button :class="{ active: variant === 'stacked' }" @click="variant = 'stacked'">Stacked Area</button>
    </div>

    <!-- Single Area Chart -->
    <template v-if="variant === 'single'">
      <div ref="parentRef" class="chart-outer bg-elevated/40 rounded-xl" @mouseleave="hideTooltip">
        <svg v-if="width > 0" :width="width" :height="height" @mousemove="handleMouseMove">
          <defs>
            <LinearGradient id="area-fill" from="#00DC82" to="#00DC82" :from-opacity="0.4" :to-opacity="0.05" x1="0" y1="0" x2="0" y2="1" />
          </defs>
          <rect :width="width" :height="height" fill="transparent" :rx="12" />
          <Group :left="margin.left" :top="margin.top">
            <GridRows
              :scale="priceScale"
              :width="xMax"
              stroke="#ffffff"
              :stroke-opacity="0.06"
              :num-ticks="5"
              pointer-events="none"
            />
            <AreaClosed
              :data="stock"
              :x="(d) => dateScale(getDate(d)) ?? 0"
              :y="(d) => priceScale(getClose(d)) ?? 0"
              :y-scale="priceScale"
              :curve="curveMonotoneX"
              fill="url(#area-fill)"
              stroke="#00DC82"
              :stroke-width="2"
            />
            <AxisBottom
              :top="yMax"
              :scale="dateScale"
              :num-ticks="5"
              :tick-format="(d) => formatDate(d as Date)"
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
            <!-- crosshair -->
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
                stroke="#0f0f1a"
                :stroke-width="2"
                pointer-events="none"
              />
            </template>
          </Group>
        </svg>
        <template v-if="tooltipData">
          <TooltipWithBounds
            :top="(priceScale(getClose(tooltipData)) ?? 0) + margin.top - 36"
            :left="tooltipLeft + 12"
            :style="ttStyle"
          >
            <div class="tt-label">{{ formatDate(getDate(tooltipData)) }}</div>
            <div class="tt-value">${{ getClose(tooltipData).toFixed(2) }}</div>
          </TooltipWithBounds>
        </template>
      </div>
    </template>

    <!-- Stacked Area Chart -->
    <template v-else>
      <div ref="parentRef2" class="chart-outer bg-elevated/40 rounded-xl">
        <svg v-if="width2 > 0" :width="width2" :height="height2">
          <rect :width="width2" :height="height2" fill="transparent" :rx="12" />
          <Group :left="marginS.left" :top="marginS.top">
            <GridRows
              :scale="yScaleS"
              :width="xMaxS"
              stroke="#ffffff"
              :stroke-opacity="0.05"
              :num-ticks="4"
              pointer-events="none"
            />
            <AreaStack
              :keys="browserKeys"
              :data="browserData"
              :x="(d) => xScaleS(getDateS(d.data)) ?? 0"
              :y0="(d) => yScaleS(d[0] / 100) ?? 0"
              :y1="(d) => yScaleS(d[1] / 100) ?? 0"
            >
              <template #default="{ stacks, path }">
                <path
                  v-for="stack in stacks"
                  :key="stack.key"
                  :d="path(stack) || ''"
                  :fill="stackColors[stack.key] || '#6366f1'"
                  :fill-opacity="0.75"
                  stroke="none"
                />
              </template>
            </AreaStack>
            <AxisBottom
              :top="yMaxS"
              :scale="xScaleS"
              :num-ticks="5"
              :tick-format="(d) => formatDateS(d as Date)"
              stroke="#ffffff22"
              tick-stroke="#ffffff22"
              :tick-label-props="xTickProps"
            />
            <AxisLeft
              :scale="yScaleS"
              :num-ticks="4"
              :tick-format="(d) => `${(Number(d) * 100).toFixed(0)}%`"
              stroke="#ffffff22"
              tick-stroke="#ffffff22"
              :tick-label-props="yTickProps"
            />
          </Group>
        </svg>
        <!-- legend -->
        <div class="legend">
          <span v-for="k in browserKeys" :key="k" class="legend-item">
            <span class="legend-dot" :style="{ background: stackColors[k] }" />
            {{ k }}
          </span>
        </div>
      </div>
    </template>
  </ExamplePage>
</template>

<script setup lang="ts">
import { AreaClosed, AreaStack, Line } from "@visx-vue/shape";
import { GridRows } from "@visx-vue/grid";
import { AxisBottom, AxisLeft } from "@visx-vue/axis";
import { scaleTime, scaleLinear } from "@visx-vue/scale";
import { LinearGradient } from "@visx-vue/gradient";
import { Group } from "@visx-vue/group";
import { useTooltip, TooltipWithBounds } from "@visx-vue/tooltip";
import { localPoint } from "@visx-vue/event";
import { appleStock, browserUsage } from "@visx-vue/mock-data";
import type { AppleStock, BrowserUsage } from "@visx-vue/mock-data";
import { curveMonotoneX } from "@visx-vue/curve";
import { max, extent, bisector } from "@visx-vue/vendor/d3-array";
import { timeFormat, timeParse } from "@visx-vue/vendor/d3-time-format";
import { useParentSize } from "@visx-vue/responsive";

useHead({ title: "Area Chart — visx-vue" });

const variant = ref<"single" | "stacked">("single");

// ── Single area ──────────────────────────────────────────────
const { parentRef, width } = useParentSize({ debounceTime: 0 });
const height = computed(() => Math.round(width.value * 0.55) || 400);

const margin = { top: 20, right: 20, bottom: 40, left: 55 };
const stock = appleStock.slice(800) as AppleStock[];
const formatDate = timeFormat("%b %d '%y");
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
    domain: [0, (max(stock, getClose) ?? 0) * 1.1],
    nice: true,
  }),
);

const xTickProps = { fill: "#ffffff55", fontSize: 11, textAnchor: "middle" as const };
const yTickProps = { fill: "#ffffff55", fontSize: 11, textAnchor: "end" as const, dx: "-0.3em", dy: "0.33em" };

const ttStyle = {
  background: "#1e1e2e",
  border: "1px solid #00DC8233",
  borderRadius: "8px",
  padding: "8px 12px",
  color: "#fff",
  pointerEvents: "none" as const,
};

const { showTooltip, hideTooltip, tooltipData, tooltipLeft } = useTooltip<AppleStock>();

function handleMouseMove(e: MouseEvent) {
  const svg = (e.currentTarget as SVGElement);
  const pt = localPoint(svg, e);
  if (!pt) return;
  const x0 = dateScale.value.invert(pt.x - margin.left);
  const idx = bisectDate(stock, x0, 1);
  const d0 = stock[idx - 1];
  const d1 = stock[idx];
  const d = d1 && x0.valueOf() - getDate(d0).valueOf() > getDate(d1).valueOf() - x0.valueOf() ? d1 : d0;
  showTooltip({ tooltipData: d, tooltipLeft: pt.x, tooltipTop: pt.y });
}

// ── Stacked area ─────────────────────────────────────────────
const { parentRef: parentRef2, width: width2 } = useParentSize({ debounceTime: 0 });
const height2 = computed(() => Math.round(width2.value * 0.55) || 400);

const marginS = { top: 20, right: 20, bottom: 40, left: 55 };
const parseDate = timeParse("%Y %b %d");
const formatDateS = timeFormat("%b '%y");
const browserData = browserUsage as BrowserUsage[];
type BrowserKey = keyof BrowserUsage;
const browserKeys = Object.keys(browserData[0]).filter((k) => k !== "date") as BrowserKey[];
const getDateS = (d: BrowserUsage) => (parseDate(d.date) as Date);

const stackColors: Record<string, string> = {
  "Google Chrome": "#00DC82",
  "Internet Explorer": "#00b368",
  Firefox: "#33e394",
  Safari: "#007a47",
  "Microsoft Edge": "#00f59a",
  Opera: "#009a5c",
  Mozilla: "#006b3f",
  "Other/Unknown": "#4db890",
};

const xMaxS = computed(() => width2.value - marginS.left - marginS.right);
const yMaxS = computed(() => height2.value - marginS.top - marginS.bottom);

const xScaleS = computed(() =>
  scaleTime({
    range: [0, xMaxS.value],
    domain: [
      Math.min(...browserData.map((d) => (parseDate(d.date) as Date).valueOf())),
      Math.max(...browserData.map((d) => (parseDate(d.date) as Date).valueOf())),
    ],
  }),
);
const yScaleS = computed(() => scaleLinear<number>({ range: [yMaxS.value, 0], domain: [0, 1] }));
</script>

<style scoped>
.chart-outer {
  width: 100%;
  min-height: 400px;
  position: relative;
  cursor: crosshair;
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
  background: #00DC82;
  border-color: #00DC82;
  color: #fff;
}
.tt-label { font-size: 11px; color: #ffffff88; margin-bottom: 2px; }
.tt-value { font-size: 15px; font-weight: 600; color: #00DC82; }
.legend {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 12px;
  padding-left: 55px;
}
.legend-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #ffffff77;
}
.legend-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}
</style>
