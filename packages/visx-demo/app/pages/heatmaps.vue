<template>
  <ExamplePage
    title="Heatmaps"
    :packages="['@visx-vue/heatmap', '@visx-vue/scale', '@visx-vue/mock-data', '@visx-vue/group']"
  >
    <div ref="parentRef" class="chart-container">
      <svg v-if="width > 0" :width="width" :height="height">
        <rect x="0" y="0" :width="width" :height="height" :rx="14" fill="#28272c" />
        <Group :top="margin.top" :left="margin.left">
          <HeatmapCircle
            :data="binData"
            :x-scale="(d) => xScale(d) ?? 0"
            :y-scale="(d) => yScale(d) ?? 0"
            :color-scale="circleColorScale"
            :opacity-scale="opacityScale"
            :radius="radius"
            :gap="2"
          >
            <template #default="{ bins }">
              <circle
                v-for="bin in bins"
                :key="`heatmap-circle-${bin.row}-${bin.column}`"
                :cx="bin.cx"
                :cy="bin.cy"
                :r="bin.r"
                :fill="bin.color"
                :fill-opacity="bin.opacity"
                style="cursor: pointer"
                @click="() => alert(JSON.stringify(bin))"
              />
            </template>
          </HeatmapCircle>
          <HeatmapRect
            :data="binData"
            :x-scale="(d) => xScale(d) ?? 0"
            :y-scale="(d) => yScale(d) ?? 0"
            :color-scale="rectColorScale"
            :opacity-scale="opacityScale"
            :bin-width="binWidth"
            :bin-height="binWidth"
            :left="xMax + separation"
            :gap="2"
          >
            <template #default="{ bins }">
              <rect
                v-for="bin in bins"
                :key="`heatmap-rect-${bin.row}-${bin.column}`"
                :x="bin.x"
                :y="bin.y"
                :rx="0"
                :width="bin.width"
                :height="bin.height"
                :fill="bin.color"
                :fill-opacity="bin.opacity"
                style="cursor: pointer"
                @click="() => alert(JSON.stringify(bin))"
              />
            </template>
          </HeatmapRect>
        </Group>
      </svg>
    </div>
  </ExamplePage>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { Group } from "@visx-vue/group";
import { HeatmapCircle, HeatmapRect } from "@visx-vue/heatmap";
import { genBins, getSeededRandom } from "@visx-vue/mock-data";
import type { Bin, Bins } from "@visx-vue/mock-data";
import { scaleLinear } from "@visx-vue/scale";
import { useParentSize } from "@visx-vue/responsive";

useHead({ title: "Heatmaps — visx-vue" });

const { parentRef, width } = useParentSize({ debounceTime: 0 });
const height = computed(() => Math.round(width.value * 0.6) || 400);

const seededRandom = getSeededRandom(0.41);
const binData = genBins(
  16,
  16,
  (idx) => 150 * idx,
  (i, number) => 25 * (number - i) * seededRandom(),
);

const margin = { top: 10, left: 20, right: 20, bottom: 110 };
const separation = 20;

function maxFn<D>(data: D[], value: (d: D) => number) {
  return Math.max(...data.map(value));
}

const bins = (d: Bins) => d.bins;
const count = (d: Bin) => d.count;

const colorMax = maxFn(binData, (d) => maxFn(bins(d), count));
const bucketSizeMax = maxFn(binData, (d) => bins(d).length);

const xMax = computed(() => {
  const size =
    width.value > margin.left + margin.right
      ? width.value - margin.left - margin.right - separation
      : width.value;
  return size / 2;
});
const yMax = computed(() => height.value - margin.bottom - margin.top);
const binWidth = computed(() => xMax.value / binData.length);
const radius = computed(() => Math.min(binWidth.value, yMax.value / bucketSizeMax) / 2);

const xScale = computed(() =>
  scaleLinear<number>({ domain: [0, binData.length], range: [0, xMax.value] }),
);
const yScale = computed(() =>
  scaleLinear<number>({ domain: [0, bucketSizeMax], range: [yMax.value, 0] }),
);
const circleColorScale = scaleLinear<string>({
  range: ["#77312f", "#f33d15"],
  domain: [0, colorMax],
});
const rectColorScale = scaleLinear<string>({
  range: ["#122549", "#b4fbde"],
  domain: [0, colorMax],
});
const opacityScale = scaleLinear<number>({ range: [0.1, 1], domain: [0, colorMax] });
</script>

<style scoped>
.chart-container {
  width: 100%;
  min-height: 400px;
}
</style>
