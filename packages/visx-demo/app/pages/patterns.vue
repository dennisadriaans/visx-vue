<template>
  <ExamplePage
    title="Patterns"
    :packages="['@visx-vue/pattern', '@visx-vue/shape', '@visx-vue/group']"
  >
    <div ref="parentRef" class="chart-container">
      <svg v-if="width > 0" :width="width" :height="height">
        <rect x="0" y="0" :width="width" :height="height" fill="#f5f2e3" :rx="14" />
        <Group :top="margin.top" :left="margin.left">
          <template v-for="(pattern, index) in patterns" :key="`pat-${index}`">
            <component :is="pattern.component" v-bind="pattern.props" />
            <Bar
              :fill="`url(#pat-demo-${index})`"
              :x="(index % 3) * columnWidth"
              :y="Math.floor(index / 3) * rowHeight"
              :width="columnWidth"
              :height="rowHeight"
              :rx="14"
            />
          </template>
        </Group>
      </svg>
    </div>
  </ExamplePage>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { Bar } from "@visx-vue/shape";
import { Group } from "@visx-vue/group";
import {
  PatternLines,
  PatternCircles,
  PatternWaves,
  Pattern as CustomPattern,
} from "@visx-vue/pattern";
import { useParentSize } from "@visx-vue/responsive";

useHead({ title: "Patterns — visx-vue" });

const { parentRef, width } = useParentSize({ debounceTime: 0 });
const height = computed(() => Math.round(width.value * 0.75) || 440);

const margin = { top: 0, left: 0, right: 0, bottom: 80 };

const columnWidth = computed(() => Math.max((width.value - margin.left - margin.right) / 3, 0));
const rowHeight = computed(() => Math.max((height.value - margin.bottom - margin.top) / 3, 0));

const patterns = computed(() => [
  {
    component: PatternLines,
    props: { id: "pat-demo-0", height: 6, width: 6, stroke: "black", strokeWidth: 1 },
  },
  {
    component: PatternCircles,
    props: { id: "pat-demo-1", height: 10, width: 10, fill: "black", complement: false },
  },
  {
    component: PatternLines,
    props: {
      id: "pat-demo-2",
      height: 6,
      width: 6,
      stroke: "black",
      strokeWidth: 1,
      orientation: ["horizontal"],
    },
  },
  {
    component: PatternLines,
    props: {
      id: "pat-demo-3",
      height: 6,
      width: 6,
      stroke: "black",
      strokeWidth: 1,
      orientation: ["diagonal"],
    },
  },
  {
    component: PatternLines,
    props: {
      id: "pat-demo-4",
      height: 6,
      width: 6,
      stroke: "black",
      strokeWidth: 1,
      orientation: ["diagonalRightToLeft"],
    },
  },
  {
    component: PatternLines,
    props: {
      id: "pat-demo-5",
      height: 6,
      width: 6,
      stroke: "black",
      strokeWidth: 1,
      orientation: ["vertical", "horizontal"],
    },
  },
  {
    component: PatternCircles,
    props: { id: "pat-demo-6", height: 10, width: 10, fill: "black", complement: true },
  },
  {
    component: PatternWaves,
    props: {
      id: "pat-demo-7",
      height: 6,
      width: 6,
      fill: "transparent",
      stroke: "black",
      strokeWidth: 1,
    },
  },
  {
    component: PatternLines,
    props: {
      id: "pat-demo-8",
      height: 4,
      width: 4,
      stroke: "#333",
      strokeWidth: 2,
      orientation: ["diagonal"],
    },
  },
]);
</script>

<style scoped>
.chart-container {
  width: 100%;
  min-height: 400px;
}
</style>
