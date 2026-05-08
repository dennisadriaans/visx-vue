<template>
  <ExamplePage
    back-to="/charts"
    back-label="Charts"
    title="Dots Chart"
    :packages="[
      '@visx-vue/shape',
      '@visx-vue/group',
      '@visx-vue/axis',
      '@visx-vue/grid',
      '@visx-vue/scale',
      '@visx-vue/gradient',
      '@visx-vue/tooltip',
      '@visx-vue/mock-data',
      '@visx-vue/voronoi',
      '@visx-vue/event',
    ]"
  >
    <div class="controls">
      <button :class="{ active: variant === 'scatter' }" @click="variant = 'scatter'">Scatter Plot</button>
      <button :class="{ active: variant === 'bubble' }" @click="variant = 'bubble'">Bubble Chart</button>
    </div>

    <!-- Scatter plot -->
    <template v-if="variant === 'scatter'">
      <div ref="parentRef" class="chart-outer bg-elevated/40 rounded-xl" @mouseleave="hideTooltip">
        <svg v-if="width > 0" :width="width" :height="height" ref="svgEl" @mousemove="handleMouseMove" @mouseleave="hideTooltip">
          <rect :width="width" :height="height" fill="transparent" :rx="12" />
          <Group :left="margin.left" :top="margin.top">
            <GridRows :scale="yScale" :width="xMax" stroke="#ffffff" :stroke-opacity="0.05" :num-ticks="5" pointer-events="none" />
            <GridColumns :scale="xScale" :height="yMax" stroke="#ffffff" :stroke-opacity="0.05" :num-ticks="5" pointer-events="none" />
            <circle
              v-for="(pt, i) in scatterPoints"
              :key="`pt-${i}`"
              :cx="xScale(pt[0])"
              :cy="yScale(pt[1])"
              :r="i % 5 === 0 ? 4 : 3"
              :fill="tooltipData === pt ? '#fff' : '#00DC82'"
              :fill-opacity="tooltipData === pt ? 1 : 0.7"
              pointer-events="none"
            />
            <VoronoiPolygon
              v-for="(polygon, i) in voronoiLayout.polygons()"
              :key="`vor-${i}`"
              :polygon="polygon"
              fill="transparent"
              stroke="transparent"
              :fill-opacity="0"
              style="cursor: crosshair"
              @mousemove="(e) => handleVoronoiHover(e, polygon)"
            />
            <AxisBottom
              :top="yMax"
              :scale="xScale"
              :num-ticks="5"
              stroke="#ffffff22"
              tick-stroke="#ffffff22"
              :tick-label-props="xTickProps"
            />
            <AxisLeft
              :scale="yScale"
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
          :top="(tooltipTop ?? 0) - 36"
          :style="ttStyle"
        >
          <div class="tt-row"><span class="tt-label">x</span><span class="tt-value">{{ tooltipData[0].toFixed(3) }}</span></div>
          <div class="tt-row"><span class="tt-label">y</span><span class="tt-value">{{ tooltipData[1].toFixed(3) }}</span></div>
        </Tooltip>
      </div>
    </template>

    <!-- Bubble chart -->
    <template v-else>
      <div ref="parentRef2" class="chart-outer bg-elevated/40 rounded-xl" @mouseleave="hideTooltip2">
        <svg v-if="width2 > 0" :width="width2" :height="height2">
          <rect :width="width2" :height="height2" fill="transparent" :rx="12" />
          <Group :left="marginB.left" :top="marginB.top">
            <GridRows :scale="yScaleB" :width="xMaxB" stroke="#ffffff" :stroke-opacity="0.05" :num-ticks="5" pointer-events="none" />
            <GridColumns :scale="xScaleB" :height="yMaxB" stroke="#ffffff" :stroke-opacity="0.05" :num-ticks="5" pointer-events="none" />
            <circle
              v-for="(p, i) in planets"
              :key="`planet-${i}`"
              :cx="xScaleB(p.distance)"
              :cy="yScaleB(p.mass)"
              :r="rScale(p.radius)"
              :fill="planetColors[i % planetColors.length]"
              :fill-opacity="0.7"
              stroke="#ffffff11"
              :stroke-width="1"
              style="cursor: pointer"
              @mousemove="(e) => handlePlanetHover(e, p)"
              @mouseleave="hideTooltip2"
            />
            <AxisBottom
              :top="yMaxB"
              :scale="xScaleB"
              :num-ticks="5"
              :tick-format="(d) => `${Number(d).toFixed(0)} AU`"
              stroke="#ffffff22"
              tick-stroke="#ffffff22"
              :tick-label-props="xTickProps"
            />
            <AxisLeft
              :scale="yScaleB"
              :num-ticks="5"
              :tick-format="(d) => `${Number(d).toFixed(0)}M⊕`"
              stroke="#ffffff22"
              tick-stroke="#ffffff22"
              :tick-label-props="yTickProps"
            />
          </Group>
        </svg>
        <Tooltip
          v-if="tooltipOpen2 && tooltipData2"
          :left="(tooltipLeft2 ?? 0) + 12"
          :top="(tooltipTop2 ?? 0) - 36"
          :style="ttStyle"
        >
          <div class="tt-row"><span class="tt-label">name</span><span class="tt-value">{{ tooltipData2.name }}</span></div>
          <div class="tt-row"><span class="tt-label">mass</span><span class="tt-value">{{ tooltipData2.mass.toFixed(1) }}M⊕</span></div>
          <div class="tt-row"><span class="tt-label">dist</span><span class="tt-value">{{ tooltipData2.distance.toFixed(2) }} AU</span></div>
        </Tooltip>
      </div>
    </template>
  </ExamplePage>
</template>

<script setup lang="ts">
import { Group } from "@visx-vue/group";
import { GridRows, GridColumns } from "@visx-vue/grid";
import { AxisBottom, AxisLeft } from "@visx-vue/axis";
import { scaleLinear, scaleSqrt } from "@visx-vue/scale";
import { useTooltip, Tooltip } from "@visx-vue/tooltip";
import { localPoint } from "@visx-vue/event";
import { genRandomNormalPoints } from "@visx-vue/mock-data";
import type { PointsRange } from "@visx-vue/mock-data";
import { voronoi, VoronoiPolygon } from "@visx-vue/voronoi";
import { useParentSize } from "@visx-vue/responsive";

useHead({ title: "Dots Chart — visx-vue" });

const variant = ref<"scatter" | "bubble">("scatter");

// ── Scatter ───────────────────────────────────────────────────
const { parentRef, width } = useParentSize({ debounceTime: 0 });
const height = computed(() => Math.round(width.value * 0.6) || 400);
const margin = { top: 20, right: 20, bottom: 40, left: 55 };
const svgEl = ref<SVGSVGElement | null>(null);

const scatterPoints: PointsRange[] = genRandomNormalPoints(500, 0.5).filter((_, i) => i < 500);

const xMax = computed(() => width.value - margin.left - margin.right);
const yMax = computed(() => height.value - margin.top - margin.bottom);

const xScale = computed(() =>
  scaleLinear<number>({ domain: [1.0, 2.5], range: [0, xMax.value], clamp: true }),
);
const yScale = computed(() =>
  scaleLinear<number>({ domain: [0.5, 1.8], range: [yMax.value, 0], clamp: true }),
);

const voronoiLayout = computed(() =>
  voronoi<PointsRange>({
    x: (d) => xScale.value(d[0]) + margin.left,
    y: (d) => yScale.value(d[1]) + margin.top,
    width: width.value,
    height: height.value,
  })(scatterPoints),
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
  minWidth: "120px",
};

const { showTooltip, hideTooltip, tooltipOpen, tooltipData, tooltipLeft, tooltipTop } =
  useTooltip<PointsRange>();

function handleMouseMove(e: MouseEvent) {}

function handleVoronoiHover(e: MouseEvent, polygon: any) {
  if (!polygon.data) return;
  const pt = localPoint(e) ?? { x: 0, y: 0 };
  showTooltip({ tooltipData: polygon.data, tooltipLeft: pt.x, tooltipTop: pt.y });
}

// ── Bubble ────────────────────────────────────────────────────
const { parentRef: parentRef2, width: width2 } = useParentSize({ debounceTime: 0 });
const height2 = computed(() => Math.round(width2.value * 0.6) || 400);
const marginB = { top: 20, right: 20, bottom: 40, left: 70 };

type Planet = { name: string; mass: number; radius: number; distance: number };
const planets: Planet[] = [
  { name: "Mercury", mass: 0.055, radius: 2440, distance: 0.39 },
  { name: "Venus", mass: 0.815, radius: 6052, distance: 0.72 },
  { name: "Earth", mass: 1, radius: 6371, distance: 1.0 },
  { name: "Mars", mass: 0.107, radius: 3390, distance: 1.52 },
  { name: "Jupiter", mass: 317.8, radius: 69911, distance: 5.2 },
  { name: "Saturn", mass: 95.2, radius: 58232, distance: 9.58 },
  { name: "Uranus", mass: 14.5, radius: 25362, distance: 19.2 },
  { name: "Neptune", mass: 17.1, radius: 24622, distance: 30.05 },
];

const planetColors = ["#00DC82", "#00b368", "#33e394", "#007a47", "#00f59a", "#009a5c", "#006b3f", "#4db890"];

const xMaxB = computed(() => width2.value - marginB.left - marginB.right);
const yMaxB = computed(() => height2.value - marginB.top - marginB.bottom);

const xScaleB = computed(() =>
  scaleLinear<number>({ domain: [0, 32], range: [0, xMaxB.value], nice: true }),
);
const yScaleB = computed(() =>
  scaleLinear<number>({ domain: [0, 350], range: [yMaxB.value, 0], nice: true }),
);
const rScale = computed(() =>
  scaleSqrt<number>({ domain: [2440, 69911], range: [4, 40] }),
);

const { showTooltip: showTooltip2, hideTooltip: hideTooltip2, tooltipOpen: tooltipOpen2, tooltipData: tooltipData2, tooltipLeft: tooltipLeft2, tooltipTop: tooltipTop2 } =
  useTooltip<Planet>();

function handlePlanetHover(e: MouseEvent, p: Planet) {
  const pt = localPoint(e) ?? { x: 0, y: 0 };
  showTooltip2({ tooltipData: p, tooltipLeft: pt.x, tooltipTop: pt.y });
}
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
.tt-row {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  align-items: center;
}
.tt-label { font-size: 11px; color: #ffffff66; }
.tt-value { font-size: 13px; font-weight: 600; color: #00DC82; }
</style>
