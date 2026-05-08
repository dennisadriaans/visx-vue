<template>
  <ExamplePage
    title="Dots"
    :packages="[
      '@visx-vue/shape',
      '@visx-vue/group',
      '@visx-vue/gradient',
      '@visx-vue/scale',
      '@visx-vue/mock-data',
      '@visx-vue/voronoi',
      '@visx-vue/tooltip',
    ]"
  >
    <div ref="parentRef" class="chart-container">
      <div v-if="width > 0">
        <div class="controls">
          <label style="font-size: 12px">
            <input type="checkbox" v-model="showVoronoi" /> Show voronoi point map
          </label>
        </div>
        <div style="position: relative">
          <svg :width="width" :height="height" ref="svgEl">
            <GradientPinkRed id="dots-pink" />
            <rect
              :width="width"
              :height="height"
              :rx="14"
              fill="url(#dots-pink)"
              @mousemove="handleMouseMove"
              @mouseleave="handleMouseLeave"
              @touchmove.prevent="handleMouseMove"
              @touchend="handleMouseLeave"
            />
            <Group pointer-events="none">
              <circle
                v-for="(point, i) in points"
                :key="`point-${point[0]}-${i}`"
                :cx="xScale(point[0])"
                :cy="yScale(point[1])"
                :r="i % 3 === 0 ? 2 : 3"
                :fill="tooltipData === point ? 'white' : '#f6c431'"
              />
              <template v-if="showVoronoi">
                <VoronoiPolygon
                  v-for="(polygon, i) in voronoiLayout.polygons()"
                  :key="`polygon-${i}`"
                  :polygon="polygon"
                  fill="white"
                  stroke="white"
                  stroke-width="1"
                  :stroke-opacity="0.2"
                  :fill-opacity="tooltipData === polygon.data ? 0.5 : 0"
                />
              </template>
            </Group>
          </svg>
          <Tooltip
            v-if="tooltipOpen && tooltipData"
            :left="(tooltipLeft || 0) + 10"
            :top="(tooltipTop || 0) + 10"
          >
            <div><strong>x:</strong> {{ tooltipData[0].toFixed(4) }}</div>
            <div><strong>y:</strong> {{ tooltipData[1].toFixed(4) }}</div>
          </Tooltip>
        </div>
      </div>
    </div>
  </ExamplePage>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { Group } from "@visx-vue/group";
import { Circle } from "@visx-vue/shape";
import { GradientPinkRed } from "@visx-vue/gradient";
import { scaleLinear } from "@visx-vue/scale";
import { genRandomNormalPoints } from "@visx-vue/mock-data";
import type { PointsRange } from "@visx-vue/mock-data";
import { useTooltip, Tooltip } from "@visx-vue/tooltip";
import { voronoi, VoronoiPolygon } from "@visx-vue/voronoi";
import { useParentSize } from "@visx-vue/responsive";

useHead({ title: "Dots — visx-vue" });

const { parentRef, width } = useParentSize({ debounceTime: 0 });
const height = computed(() => Math.round(width.value * 0.6) || 400);

const points: PointsRange[] = genRandomNormalPoints(600, 0.5).filter((_, i) => i < 600);
const showVoronoi = ref(true);
const svgEl = ref<SVGSVGElement | null>(null);

const { tooltipOpen, tooltipData, tooltipLeft, tooltipTop, showTooltip, hideTooltip } =
  useTooltip<PointsRange>();

const xScale = computed(() =>
  scaleLinear<number>({ domain: [1.3, 2.2], range: [0, width.value], clamp: true }),
);
const yScale = computed(() =>
  scaleLinear<number>({ domain: [0.75, 1.6], range: [height.value, 0], clamp: true }),
);

const voronoiLayout = computed(() =>
  voronoi<PointsRange>({
    x: (d) => xScale.value(d[0]) ?? 0,
    y: (d) => yScale.value(d[1]) ?? 0,
    width: width.value,
    height: height.value,
  })(points),
);

let tooltipTimeout: ReturnType<typeof setTimeout> | null = null;

function handleMouseMove(event: MouseEvent | TouchEvent) {
  if (tooltipTimeout) clearTimeout(tooltipTimeout);
  if (!svgEl.value) return;
  const rect = svgEl.value.getBoundingClientRect();
  const clientX = event instanceof MouseEvent ? event.clientX : event.touches[0].clientX;
  const clientY = event instanceof MouseEvent ? event.clientY : event.touches[0].clientY;
  const px = clientX - rect.left;
  const py = clientY - rect.top;
  const closest = voronoiLayout.value.find(px, py, 100);
  if (closest) {
    showTooltip({
      tooltipLeft: xScale.value(closest.data[0]),
      tooltipTop: yScale.value(closest.data[1]),
      tooltipData: closest.data,
    });
  }
}

function handleMouseLeave() {
  tooltipTimeout = setTimeout(() => hideTooltip(), 300);
}
</script>

<style scoped>
.chart-container {
  width: 100%;
  min-height: 400px;
}
.controls {
  margin-bottom: 8px;
}
</style>
