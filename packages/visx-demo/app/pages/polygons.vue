<script setup lang="ts">import { computed } from "vue";
import { Group } from "@visx-vue/group";
import { GradientPinkRed } from "@visx-vue/gradient";
import { Polygon } from "@visx-vue/shape";
import { scaleBand } from "@visx-vue/scale";
import { useParentSize } from "@visx-vue/responsive";

const { parentRef, width, height: rawHeight } = useParentSize();
const height = computed(() => rawHeight.value || 400);

const margin = { top: 20, left: 20, right: 20, bottom: 20 };

const polygons = [
  { sides: 3, fill: "rgb(174, 238, 248)", rotate: 90 },
  { sides: 4, fill: "rgb(229, 253, 61)", rotate: 45 },
  { sides: 6, fill: "rgb(229, 130, 255)", rotate: 0 },
  { sides: 8, fill: "url(#polygon-pink)", rotate: 0 },
];
const polygonSize = 25;
const background = "#7f82e3";

const yScale = computed(() =>
  scaleBand<number>({
    domain: polygons.map((_, i) => i),
    range: [0, height.value - margin.top - margin.bottom],
    padding: 0.8,
  }),
);

const centerX = computed(() => (width.value - margin.left - margin.right) / 2);
</script>

<template>
  <ExamplePage
    title="Polygons"
    description="Render regular polygons with different numbers of sides using the Polygon component."
    :packages="['@visx-vue/shape', '@visx-vue/gradient', '@visx-vue/scale']"
  >
    <div ref="parentRef" class="w-full" style="height: 500px">
      <svg v-if="width > 10" :width="width" :height="height">
        <GradientPinkRed id="polygon-pink" />
        <rect :width="width" :height="height" :fill="background" rx="14" />
        <Group :top="margin.top" :left="margin.left">
          <Group
            v-for="(polygon, i) in polygons"
            :key="`polygon-${polygon.sides}`"
            :top="(yScale(i) ?? 0) + polygonSize / 2"
            :left="centerX"
          >
            <Polygon
              :sides="polygon.sides"
              :size="polygonSize"
              :fill="polygon.fill"
              :rotate="polygon.rotate"
            />
          </Group>
        </Group>
      </svg>
    </div>
  </ExamplePage>
</template>
