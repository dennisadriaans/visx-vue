<template>
  <ExamplePage
    title="Bar Group"
    :packages="[
      '@visx-vue/shape',
      '@visx-vue/axis',
      '@visx-vue/group',
      '@visx-vue/scale',
      '@visx-vue/mock-data',
    ]"
  >
    <div ref="parentRef" class="chart-container">
      <svg v-if="width > 0" :width="width" :height="height">
        <rect x="0" y="0" :width="width" :height="height" fill="#612efb" :rx="14" />
        <Group :top="margin.top" :left="margin.left">
          <BarGroup
            :data="data"
            :keys="keys"
            :height="yMax"
            :x0="getDate"
            :x0-scale="dateScale"
            :x1-scale="cityScale"
            :y-scale="tempScale"
            :color="colorScale"
          >
            <template #default="{ barGroups }">
              <Group
                v-for="barGroup in barGroups"
                :key="`bar-group-${barGroup.index}-${barGroup.x0}`"
                :left="barGroup.x0"
              >
                <rect
                  v-for="bar in barGroup.bars"
                  :key="`bar-group-bar-${barGroup.index}-${bar.index}-${bar.value}-${bar.key}`"
                  :x="bar.x"
                  :y="bar.y"
                  :width="bar.width"
                  :height="bar.height"
                  :fill="bar.color"
                  :rx="4"
                  style="cursor: pointer"
                  @click="() => alert(JSON.stringify({ key: bar.key, value: bar.value }))"
                />
              </Group>
            </template>
          </BarGroup>
        </Group>
        <AxisBottom
          :top="yMax + margin.top"
          :tick-format="formatDate"
          :scale="dateScale"
          stroke="#e5fd3d"
          tick-stroke="#e5fd3d"
          :hide-axis-line="true"
          :tick-label-props="{ fill: '#e5fd3d', fontSize: 11, textAnchor: 'middle' }"
        />
      </svg>
    </div>
  </ExamplePage>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { Group } from "@visx-vue/group";
import { BarGroup } from "@visx-vue/shape";
import { AxisBottom } from "@visx-vue/axis";
import { cityTemperature } from "@visx-vue/mock-data";
import type { CityTemperature } from "@visx-vue/mock-data";
import { scaleBand, scaleLinear, scaleOrdinal } from "@visx-vue/scale";
import { timeParse, timeFormat } from "@visx-vue/vendor/d3-time-format";
import { useParentSize } from "@visx-vue/responsive";

useHead({ title: "Bar Group — visx-vue" });

const { parentRef, width } = useParentSize({ debounceTime: 0 });
const height = computed(() => Math.round(width.value * 0.6) || 400);

const margin = { top: 40, right: 0, bottom: 40, left: 0 };
type CityName = "New York" | "San Francisco" | "Austin";

const data = cityTemperature.slice(0, 8) as CityTemperature[];
const keys = Object.keys(data[0]).filter((d) => d !== "date") as CityName[];

const parseDate = timeParse("%Y-%m-%d");
const format = timeFormat("%b %d");
const formatDate = (date: string) => format(parseDate(date) as Date);
const getDate = (d: CityTemperature) => d.date;

const xMax = computed(() => width.value - margin.left - margin.right);
const yMax = computed(() => height.value - margin.top - margin.bottom);

const dateScale = computed(() => {
  const s = scaleBand<string>({ domain: data.map(getDate), padding: 0.2 });
  s.rangeRound([0, xMax.value]);
  return s;
});
const cityScale = computed(() => {
  const s = scaleBand<string>({ domain: keys, padding: 0.1 });
  s.rangeRound([0, dateScale.value.bandwidth()]);
  return s;
});
const tempScale = computed(() => {
  const s = scaleLinear<number>({
    domain: [0, Math.max(...data.map((d) => Math.max(...keys.map((k) => Number(d[k])))))],
  });
  s.range([yMax.value, 0]);
  return s;
});
const colorScale = scaleOrdinal<string, string>({
  domain: keys,
  range: ["#aeeef8", "#e5fd3d", "#9caff6"],
});
</script>

<style scoped>
.chart-container {
  width: 100%;
  min-height: 400px;
}
</style>
