<script setup lang="ts">import { computed, ref } from "vue";
import { Group } from "@visx-vue/group";
import { GradientPurpleTeal } from "@visx-vue/gradient";
import { RectClipPath } from "@visx-vue/clip-path";
import { delaunay, Polygon } from "@visx-vue/delaunay";
import { getSeededRandom } from "@visx-vue/mock-data";
import { useParentSize } from "@visx-vue/responsive";

const { parentRef, width, height: rawHeight } = useParentSize();
const height = computed(() => rawHeight.value || 400);

const margin = { top: 16, left: 16, right: 16, bottom: 92 };
const innerWidth = computed(() => width.value - margin.left - margin.right);
const innerHeight = computed(() => height.value - margin.top - margin.bottom);

const seededRandom = getSeededRandom(0.88);

const data = Array.from({ length: 150 }, () => ({
  x: seededRandom(),
  y: seededRandom(),
  id: Math.random().toString(36).slice(2),
}));

const delaunayDiagram = computed(() =>
  delaunay({
    data,
    x: (d) => d.x * innerWidth.value,
    y: (d) => d.y * innerHeight.value,
  }),
);

const triangles = computed(() => Array.from(delaunayDiagram.value.trianglePolygons()));

const svgRef = ref<SVGSVGElement | null>(null);
const hoveredId = ref<string | null>(null);

function handleMouseMove(event: MouseEvent) {
  if (!svgRef.value) return;
  const rect = svgRef.value.getBoundingClientRect();
  const px = event.clientX - rect.left - margin.left;
  const py = event.clientY - rect.top - margin.top;
  const closest = delaunayDiagram.value.find(px, py);
  hoveredId.value = data[closest]?.id ?? null;
}
</script>

<template>
  <ExamplePage
    title="Delaunay Triangulation"
    description="Hover over the diagram to highlight the nearest triangulation point using Delaunay triangulation."
    :packages="['@visx-vue/delaunay', '@visx-vue/clip-path', '@visx-vue/gradient']"
  >
    <div ref="parentRef" class="w-full bg-elevated/40 rounded-xl" style="height: 500px">
      <div v-if="width > 10" class="rounded-xl overflow-hidden">
        <svg
          :ref="
            (el) => {
              svgRef = el as SVGSVGElement;
            }
          "
          :width="width"
          :height="height"
          @mousemove="handleMouseMove"
          @mouseleave="hoveredId = null"
        >
          <GradientPurpleTeal id="delaunay_purple_teal" />
          <RectClipPath id="delaunay_clip" :width="innerWidth" :height="innerHeight" rx="14" />
          <Group :top="margin.top" :left="margin.left" clip-path="url(#delaunay_clip)">
            <Polygon
              v-for="(triangle, i) in triangles"
              :key="`triangle-${i}`"
              :polygon="triangle"
              fill="url(#delaunay_purple_teal)"
              stroke="#00DC8244"
              stroke-width="1"
            />
            <circle
              v-for="{ x, y, id } in data"
              :key="`circle-${id}`"
              r="2"
              :cx="x * innerWidth"
              :cy="y * innerHeight"
              :fill="id === hoveredId ? '#33e394' : '#00DC82'"
              fill-opacity="0.8"
            />
          </Group>
        </svg>
      </div>
    </div>
  </ExamplePage>
</template>
