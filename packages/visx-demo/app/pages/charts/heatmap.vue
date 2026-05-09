<template>
  <ExamplePage
    back-to="/charts"
    back-label="Charts"
    title="Heatmap Chart"
    :packages="[
      '@visx-vue/heatmap',
      '@visx-vue/group',
      '@visx-vue/axis',
      '@visx-vue/scale',
      '@visx-vue/tooltip',
      '@visx-vue/mock-data',
      '@visx-vue/event',
    ]"
  >
    <div class="controls">
      <button :class="{ active: variant === 'rect' }" @click="variant = 'rect'">
        Rect Heatmap
      </button>
      <button :class="{ active: variant === 'circle' }" @click="variant = 'circle'">
        Circle Heatmap
      </button>
    </div>

    <div ref="parentRef" class="chart-outer bg-elevated/40 rounded-xl" @mouseleave="hideTooltip">
      <svg v-if="width > 0" :width="width" :height="height">
        <rect :width="width" :height="height" fill="transparent" :rx="12" />
        <Group :left="margin.left" :top="margin.top">
          <!-- Rect variant -->
          <template v-if="variant === 'rect'">
            <HeatmapRect
              :data="binData"
              :x-scale="(d) => xScale(d) ?? 0"
              :y-scale="(d) => yScale(d) ?? 0"
              :color-scale="rectColorScale"
              :opacity-scale="opacityScale"
              :bin-width="binWidth"
              :bin-height="binWidth"
              :gap="3"
            >
              <template #default="{ cells }">
                <rect
                  v-for="bin in cells.flat()"
                  :key="`rect-${bin.row}-${bin.column}`"
                  :x="bin.x"
                  :y="bin.y"
                  :width="bin.width"
                  :height="bin.height"
                  :rx="3"
                  :fill="bin.color"
                  :fill-opacity="bin.opacity"
                  style="cursor: pointer"
                  @mousemove="(e) => handleCellHover(e, bin)"
                  @mouseleave="hideTooltip"
                />
              </template>
            </HeatmapRect>
          </template>

          <!-- Circle variant -->
          <template v-else>
            <HeatmapCircle
              :data="binData"
              :x-scale="(d) => xScale(d) ?? 0"
              :y-scale="(d) => yScale(d) ?? 0"
              :color-scale="circleColorScale"
              :opacity-scale="opacityScale"
              :radius="binWidth / 2 - 2"
              :gap="3"
            >
              <template #default="{ cells }">
                <circle
                  v-for="bin in cells.flat()"
                  :key="`circle-${bin.row}-${bin.column}`"
                  :cx="bin.cx"
                  :cy="bin.cy"
                  :r="bin.r"
                  :fill="bin.color"
                  :fill-opacity="bin.opacity"
                  style="cursor: pointer"
                  @mousemove="(e) => handleCellHover(e, bin)"
                  @mouseleave="hideTooltip"
                />
              </template>
            </HeatmapCircle>
          </template>

          <AxisBottom
            :top="yMax"
            :scale="xAxisScale"
            :num-ticks="8"
            stroke="#ffffff22"
            tick-stroke="#ffffff22"
            :tick-label-props="xTickProps"
          />
          <AxisLeft
            :scale="yAxisScale"
            :num-ticks="5"
            stroke="#ffffff22"
            tick-stroke="#ffffff22"
            :tick-label-props="yTickProps"
          />
        </Group>
      </svg>

      <Tooltip
        v-if="tooltipOpen && tooltipData"
        :left="(tooltipLeft ?? 0) + 12"
        :top="(tooltipTop ?? 0) - 28"
        :style="ttStyle"
      >
        <div class="tt-label">col {{ tooltipData.column }}, row {{ tooltipData.row }}</div>
        <div class="tt-value">{{ tooltipData.count?.toFixed(2) ?? "—" }}</div>
      </Tooltip>
    </div>

    <!-- color scale legend -->
    <div class="color-legend">
      <span class="legend-label">Low</span>
      <div class="gradient-bar" :style="gradientStyle" />
      <span class="legend-label">High</span>
    </div>
  </ExamplePage>
</template>

<script setup lang="ts">
import { Group } from "@visx-vue/group";
import { HeatmapRect, HeatmapCircle } from "@visx-vue/heatmap";
import { AxisBottom, AxisLeft } from "@visx-vue/axis";
import { scaleLinear, scaleBand } from "@visx-vue/scale";
import { useTooltip, Tooltip } from "@visx-vue/tooltip";
import { localPoint } from "@visx-vue/event";
import { genBins, getSeededRandom } from "@visx-vue/mock-data";
import { useParentSize } from "@visx-vue/responsive";

useHead({ title: "Heatmap Chart — visx-vue" });

const variant = ref<"rect" | "circle">("rect");

const { parentRef, width } = useParentSize({ debounceTime: 0 });
const height = computed(() => Math.round(width.value * 0.55) || 400);
const margin = { top: 20, right: 20, bottom: 40, left: 55 };

const COLS = 14;
const ROWS = 10;
const seededRandom = getSeededRandom(0.41);
const binData = genBins(
  COLS,
  ROWS,
  () => seededRandom() * 10,
  () => seededRandom() * 10,
);

const xMax = computed(() => width.value - margin.left - margin.right);
const yMax = computed(() => height.value - margin.top - margin.bottom);

const binWidth = computed(() => Math.floor(xMax.value / COLS));

const xScale = computed(() => scaleLinear<number>({ range: [0, xMax.value], domain: [0, COLS] }));
const yScale = computed(() => scaleLinear<number>({ range: [yMax.value, 0], domain: [0, ROWS] }));

const xAxisScale = computed(() =>
  scaleLinear<number>({ range: [0, xMax.value], domain: [0, COLS] }),
);
const yAxisScale = computed(() =>
  scaleLinear<number>({ range: [yMax.value, 0], domain: [0, ROWS] }),
);

const maxCount = computed(() =>
  Math.max(...binData.flatMap((col) => col.bins.map((b) => b.count ?? 0))),
);

const rectColorScale = computed(() =>
  scaleLinear<string>({
    range: ["#0a2a1a", "#00DC82"],
    domain: [0, maxCount.value],
  }),
);
const circleColorScale = computed(() =>
  scaleLinear<string>({
    range: ["#0a2a1a", "#33e394"],
    domain: [0, maxCount.value],
  }),
);
const opacityScale = computed(() =>
  scaleLinear<number>({ range: [0.15, 1], domain: [0, maxCount.value] }),
);

const gradientStyle = computed(() => ({
  background:
    variant.value === "rect"
      ? "linear-gradient(to right, #0a2a1a, #00DC82)"
      : "linear-gradient(to right, #0a2a1a, #33e394)",
}));

const xTickProps = { fill: "#ffffff55", fontSize: 10, textAnchor: "middle" as const };
const yTickProps = {
  fill: "#ffffff55",
  fontSize: 10,
  textAnchor: "end" as const,
  dx: "-0.3em",
  dy: "0.33em",
};

const ttStyle = {
  background: "#1e1e2e",
  border: "1px solid #00DC8233",
  borderRadius: "8px",
  padding: "8px 12px",
  color: "#fff",
  pointerEvents: "none" as const,
};

type CellData = { row: number; column: number; count?: number };
const { showTooltip, hideTooltip, tooltipOpen, tooltipData, tooltipLeft, tooltipTop } =
  useTooltip<CellData>();

function handleCellHover(e: MouseEvent, bin: any) {
  const pt = localPoint(e) ?? { x: 0, y: 0 };
  showTooltip({
    tooltipData: { row: bin.row, column: bin.column, count: bin.count },
    tooltipLeft: pt.x + margin.left,
    tooltipTop: pt.y + margin.top,
  });
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
.color-legend {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 12px;
  padding-left: 55px;
}
.legend-label {
  font-size: 11px;
  color: #ffffff55;
}
.gradient-bar {
  width: 120px;
  height: 8px;
  border-radius: 4px;
}
</style>
