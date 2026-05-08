<template>
  <ExamplePage
    title="Threshold"
    :packages="[
      '@visx-vue/threshold',
      '@visx-vue/shape',
      '@visx-vue/axis',
      '@visx-vue/grid',
      '@visx-vue/scale',
      '@visx-vue/mock-data',
    ]"
  >
    <div ref="parentRef" class="chart-container">
      <svg v-if="width > 0" :width="width" :height="height">
        <rect x="0" y="0" :width="width" :height="height" fill="#f3f3f3" :rx="14" />
        <Group :left="margin.left" :top="margin.top">
          <GridRows :scale="temperatureScale" :width="xMax" :height="yMax" stroke="#e0e0e0" />
          <GridColumns :scale="timeScale" :width="xMax" :height="yMax" stroke="#e0e0e0" />
          <line :x1="xMax" :x2="xMax" :y1="0" :y2="yMax" stroke="#e0e0e0" />
          <AxisBottom :top="yMax" :scale="timeScale" :num-ticks="width > 520 ? 10 : 5" />
          <AxisLeft :scale="temperatureScale" />
          <text x="-70" y="15" transform="rotate(-90)" font-size="10">Temperature (°F)</text>
          <Threshold
            id="threshold-demo"
            :data="cityTemperature"
            :x="(d) => timeScale(date(d)) ?? 0"
            :y0="(d) => temperatureScale(ny(d)) ?? 0"
            :y1="(d) => temperatureScale(sf(d)) ?? 0"
            :clip-above-to="0"
            :clip-below-to="yMax"
            :curve="curveBasis"
            :below-area-props="{ fill: 'violet', fillOpacity: 0.4 }"
            :above-area-props="{ fill: 'green', fillOpacity: 0.4 }"
          />
          <LinePath
            :data="cityTemperature"
            :curve="curveBasis"
            :x="(d) => timeScale(date(d)) ?? 0"
            :y="(d) => temperatureScale(sf(d)) ?? 0"
            stroke="#222"
            :stroke-width="1.5"
            :stroke-opacity="0.8"
            stroke-dasharray="1,2"
          />
          <LinePath
            :data="cityTemperature"
            :curve="curveBasis"
            :x="(d) => timeScale(date(d)) ?? 0"
            :y="(d) => temperatureScale(ny(d)) ?? 0"
            stroke="#222"
            :stroke-width="1.5"
          />
        </Group>
      </svg>
    </div>
  </ExamplePage>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { Group } from "@visx-vue/group";
import { curveBasis } from "@visx-vue/curve";
import { LinePath } from "@visx-vue/shape";
import { Threshold } from "@visx-vue/threshold";
import { scaleTime, scaleLinear } from "@visx-vue/scale";
import { AxisLeft, AxisBottom } from "@visx-vue/axis";
import { GridRows, GridColumns } from "@visx-vue/grid";
import { cityTemperature } from "@visx-vue/mock-data";
import type { CityTemperature } from "@visx-vue/mock-data";
import { useParentSize } from "@visx-vue/responsive";

useHead({ title: "Threshold — visx-vue" });

const { parentRef, width } = useParentSize({ debounceTime: 0 });
const height = computed(() => Math.round(width.value * 0.6) || 400);

const margin = { top: 40, right: 30, bottom: 50, left: 40 };

const date = (d: CityTemperature) => new Date(d.date).valueOf();
const ny = (d: CityTemperature) => Number(d["New York"]);
const sf = (d: CityTemperature) => Number(d["San Francisco"]);

const xMax = computed(() => width.value - margin.left - margin.right);
const yMax = computed(() => height.value - margin.top - margin.bottom);

const timeScale = computed(() => {
  const s = scaleTime<number>({
    domain: [Math.min(...cityTemperature.map(date)), Math.max(...cityTemperature.map(date))],
  });
  s.range([0, xMax.value]);
  return s;
});
const temperatureScale = computed(() => {
  const s = scaleLinear<number>({
    domain: [
      Math.min(...cityTemperature.map((d) => Math.min(ny(d), sf(d)))),
      Math.max(...cityTemperature.map((d) => Math.max(ny(d), sf(d)))),
    ],
    nice: true,
  });
  s.range([yMax.value, 0]);
  return s;
});
</script>

<style scoped>
.chart-container {
  width: 100%;
  min-height: 400px;
}
</style>
