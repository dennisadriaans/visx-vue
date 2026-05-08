<template>
  <ExamplePage
    title="Drag I"
    :packages="['@visx-vue/drag', '@visx-vue/gradient', '@visx-vue/scale', '@visx-vue/mock-data']"
  >
    <div ref="parentRef" class="chart-container" style="touch-action: none">
      <svg v-if="width > 0" :width="width" :height="height">
        <LinearGradient id="drag-stroke" from="#ff00a5" to="#ffc500" />
        <rect fill="#c4c3cb" :width="width" :height="height" :rx="14" />
        <Drag
          v-for="(d, i) in circles"
          :key="`drag-${d.id}`"
          :width="width"
          :height="height"
          :x="d.x"
          :y="d.y"
          :on-drag-start="() => onDragStart(i)"
        >
          <template #default="{ dragStart, dragEnd, dragMove, isDragging, x, y, dx, dy }">
            <circle
              :cx="x"
              :cy="y"
              :r="isDragging ? d.radius + 4 : d.radius"
              :fill="isDragging ? 'url(#drag-stroke)' : colorScale(d.id)"
              :transform="`translate(${dx}, ${dy})`"
              fill-opacity="0.9"
              :stroke="isDragging ? 'white' : 'transparent'"
              stroke-width="2"
              @pointerdown="dragStart"
              @pointermove="dragMove"
              @pointerup="dragEnd"
            />
          </template>
        </Drag>
      </svg>
    </div>
  </ExamplePage>
</template>

<script setup lang="ts">import { ref, computed, watch } from "vue";
import { LinearGradient } from "@visx-vue/gradient";
import { Drag, raise } from "@visx-vue/drag";
import { scaleOrdinal } from "@visx-vue/scale";
import { getSeededRandom } from "@visx-vue/mock-data";
import { useParentSize } from "@visx-vue/responsive";

useHead({ title: "Drag I — visx-vue" });

const { parentRef, width } = useParentSize({ debounceTime: 0 });
const height = computed(() => Math.round(width.value * 0.6) || 400);

const colors = [
  "#025aac",
  "#02cff9",
  "#02efff",
  "#03aeed",
  "#0384d7",
  "#edfdff",
  "#ab31ff",
  "#5924d7",
  "#d145ff",
  "#1a02b1",
  "#e582ff",
  "#ff00d4",
  "#270eff",
  "#827ce2",
];

interface Circle {
  id: string;
  radius: number;
  x: number;
  y: number;
}

const circles = ref<Circle[]>([]);

function generateCircles(w: number, h: number): Circle[] {
  const radiusRandom = getSeededRandom(0.2);
  const xRandom = getSeededRandom(0.3);
  const yRandom = getSeededRandom(0.4);
  return new Array(w < 360 ? 40 : 185).fill(1).map((_, i) => {
    const radius = 25 - radiusRandom() * 20;
    return {
      id: `${i}`,
      radius,
      x: Math.round(xRandom() * (w - radius * 2) + radius),
      y: Math.round(yRandom() * (h - radius * 2) + radius),
    };
  });
}

watch(
  width,
  (w) => {
    if (w > 10) circles.value = generateCircles(w, height.value);
  },
  { immediate: true },
);

const colorScale = computed(() =>
  scaleOrdinal<string, string>({
    range: colors,
    domain: circles.value.map((d) => d.id),
  }),
);

function onDragStart(i: number) {
  circles.value = raise(circles.value, i);
}
</script>

<style scoped>
.chart-container {
  width: 100%;
  min-height: 400px;
}
</style>
