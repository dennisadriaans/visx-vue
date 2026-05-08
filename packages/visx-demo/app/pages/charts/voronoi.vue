<template>
  <ExamplePage
    title="Voronoi"
    :packages="[
      '@visx-vue/voronoi',
      '@visx-vue/clip-path',
      '@visx-vue/gradient',
      '@visx-vue/group',
      '@visx-vue/mock-data',
    ]"
  >
    <div ref="parentRef" class="chart-container bg-elevated/40 rounded-xl">
      <svg
        v-if="width > 0"
        ref="svgRef"
        :width="width"
        :height="height"
        @mousemove="handleMouseMove"
        @mouseleave="handleMouseLeave"
      >
        <GradientOrangeRed id="voronoi_orange_red" />
        <GradientPinkRed id="voronoi_pink_red" />
        <RectClipPath id="voronoi_clip" :width="innerWidth" :height="innerHeight" :rx="14" />
        <Group :top="margin.top" :left="margin.left" clip-path="url(#voronoi_clip)">
          <VoronoiPolygon
            v-for="polygon in polygons"
            :key="`polygon-${polygon.data.id}`"
            :polygon="polygon"
            :fill="
              hoveredId === polygon.data.id
                ? 'url(#voronoi_pink_red)'
                : neighborIds.has(polygon.data.id)
                  ? 'url(#voronoi_orange_red)'
                  : '#00DC8244'
            "
            stroke="#00DC8244"
            :stroke-width="1"
            :fill-opacity="
              hoveredId === polygon.data.id ? 0.6 : neighborIds.has(polygon.data.id) ? 0.4 : 0.2
            "
          />
          <circle
            v-for="d in data"
            :key="`dot-${d.id}`"
            :cx="d.x * innerWidth"
            :cy="d.y * innerHeight"
            r="2"
            fill="#00DC82"
          />
        </Group>
      </svg>
    </div>
  </ExamplePage>
</template>

<script setup lang="ts">
import { Group } from "@visx-vue/group";
import { GradientOrangeRed, GradientPinkRed } from "@visx-vue/gradient";
import { RectClipPath } from "@visx-vue/clip-path";
import { voronoi, VoronoiPolygon } from "@visx-vue/voronoi";
import { localPoint } from "@visx-vue/event";
import { getSeededRandom } from "@visx-vue/mock-data";
import { useParentSize } from "@visx-vue/responsive";

useHead({ title: "Voronoi — visx-vue" });

const { parentRef, width } = useParentSize({ debounceTime: 0 });
const height = computed(() => Math.round(width.value * 0.75) || 450);
const svgRef = ref<SVGSVGElement | null>(null);

const margin = { top: 0, left: 0, right: 0, bottom: 76 };
const neighborRadius = 75;

const seededRandom = getSeededRandom(0.88);
type Datum = { x: number; y: number; id: string };
const data: Datum[] = Array.from({ length: 150 }, () => ({
  x: seededRandom(),
  y: seededRandom(),
  id: Math.random().toString(36).slice(2),
}));

const innerWidth = computed(() => width.value - margin.left - margin.right);
const innerHeight = computed(() => height.value - margin.top - margin.bottom);

const voronoiLayout = computed(() =>
  voronoi<Datum>({
    x: (d) => d.x * innerWidth.value,
    y: (d) => d.y * innerHeight.value,
    width: innerWidth.value,
    height: innerHeight.value,
  })(data),
);

const polygons = computed(() => voronoiLayout.value.polygons());

const hoveredId = ref<string | null>(null);
const neighborIds = ref<Set<string>>(new Set());

function handleMouseMove(event: MouseEvent) {
  if (!svgRef.value) return;
  const point = localPoint(svgRef.value, event);
  if (!point) return;

  const closest = voronoiLayout.value.find(
    point.x - margin.left,
    point.y - margin.top,
    neighborRadius,
  );
  if (closest && closest.data.id !== hoveredId.value) {
    const neighbors = new Set<string>();
    const cell = voronoiLayout.value.cells[closest.index];
    if (!cell) return;
    cell.halfedges.forEach((index: number) => {
      const edge = voronoiLayout.value.edges[index];
      const { left, right } = edge;
      if (left && left !== closest) neighbors.add(left.data.id);
      else if (right && right !== closest) neighbors.add(right.data.id);
    });
    neighborIds.value = neighbors;
    hoveredId.value = closest.data.id;
  }
}

function handleMouseLeave() {
  hoveredId.value = null;
  neighborIds.value = new Set();
}
</script>

<style scoped>
.chart-container {
  width: 100%;
  min-height: 400px;
}
</style>
