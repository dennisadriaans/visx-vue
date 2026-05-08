<template>
  <ExamplePage
    title="Bar Stack Horizontal"
    :packages="[
      '@visx-vue/shape',
      '@visx-vue/axis',
      '@visx-vue/tooltip',
      '@visx-vue/legend',
      '@visx-vue/scale',
      '@visx-vue/mock-data',
    ]"
  >
    <div ref="parentRef" class="chart-container" style="position: relative">
      <svg v-if="width > 0" :width="width" :height="height">
        <rect x="0" y="0" :width="width" :height="height" fill="#eaedff" :rx="14" />
        <Group :top="margin.top" :left="margin.left">
          <BarStackHorizontal
            :data="data"
            :keys="keys"
            :y="getDate"
            :y-scale="dateScale"
            :x-scale="temperatureScale"
            :color="colorScale"
          >
            <template #default="{ barStacks }">
              <template v-for="barStack in barStacks" :key="`h-stack-${barStack.index}`">
                <rect
                  v-for="bar in barStack.bars"
                  :key="`h-stack-${barStack.index}-${bar.index}`"
                  :x="bar.x"
                  :y="bar.y"
                  :height="bar.height"
                  :width="bar.width"
                  :fill="bar.color"
                  style="cursor: pointer"
                  @mousemove="(e) => handleHover(e, bar)"
                  @mouseleave="hideTooltip"
                />
              </template>
            </template>
          </BarStackHorizontal>
          <AxisLeft
            :scale="dateScale"
            stroke="#a44afe"
            tick-stroke="#a44afe"
            :tick-label-props="{ fill: '#a44afe', fontSize: 11, textAnchor: 'end', dy: '0.33em' }"
            :tick-format="formatDate"
          />
          <AxisBottom
            :top="yMax"
            :scale="temperatureScale"
            stroke="#a44afe"
            tick-stroke="#a44afe"
            :tick-label-props="{ fill: '#a44afe', fontSize: 11, textAnchor: 'middle' }"
          />
        </Group>
      </svg>
      <div
        v-if="width > 0"
        style="position: absolute; top: 8px; width: 100%; display: flex; justify-content: center"
      >
        <LegendOrdinal :scale="colorScale" direction="row" label-margin="0 15px 0 0" />
      </div>
      <Tooltip
        v-if="tooltipOpen && tooltipData"
        :top="(tooltipTop ?? 0) - 12"
        :left="(tooltipLeft ?? 0) + 12"
        :style="tooltipStyles"
      >
        <div>
          <strong>{{ tooltipData.key }}</strong>
        </div>
        <div>{{ tooltipData.bar.data.date }}</div>
      </Tooltip>
    </div>
  </ExamplePage>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { Group } from "@visx-vue/group";
import { BarStackHorizontal } from "@visx-vue/shape";
import type { SeriesPoint } from "@visx-vue/shape";
import { AxisBottom, AxisLeft } from "@visx-vue/axis";
import { cityTemperature } from "@visx-vue/mock-data";
import type { CityTemperature } from "@visx-vue/mock-data";
import { scaleBand, scaleLinear, scaleOrdinal } from "@visx-vue/scale";
import { timeParse, timeFormat } from "@visx-vue/vendor/d3-time-format";
import { useTooltip, Tooltip, defaultStyles } from "@visx-vue/tooltip";
import { LegendOrdinal } from "@visx-vue/legend";
import { useParentSize } from "@visx-vue/responsive";

useHead({ title: "Bar Stack Horizontal — visx-vue" });

const { parentRef, width } = useParentSize({ debounceTime: 0 });
const height = computed(() => Math.round(width.value * 0.7) || 450);

const margin = { top: 40, left: 50, right: 40, bottom: 100 };
type CityName = "New York" | "San Francisco" | "Austin";
type TooltipData = { bar: SeriesPoint<CityTemperature>; key: CityName; color: string };

const data = cityTemperature.slice(0, 12) as CityTemperature[];
const keys = Object.keys(data[0]).filter((d) => d !== "date") as CityName[];
const temperatureTotals = data.reduce((totals, cur) => {
  totals.push(keys.reduce((sum, k) => sum + Number(cur[k]), 0));
  return totals;
}, [] as number[]);

const parseDate = timeParse("%Y-%m-%d");
const format = timeFormat("%b %d");
const formatDate = (date: string) => format(parseDate(date) as Date);
const getDate = (d: CityTemperature) => d.date;

const xMax = computed(() => width.value - margin.left - margin.right);
const yMax = computed(() => height.value - margin.top - margin.bottom);

const temperatureScale = computed(() => {
  const s = scaleLinear<number>({ domain: [0, Math.max(...temperatureTotals)], nice: true });
  s.rangeRound([0, xMax.value]);
  return s;
});
const dateScale = computed(() => {
  const s = scaleBand<string>({ domain: data.map(getDate), padding: 0.2 });
  s.rangeRound([yMax.value, 0]);
  return s;
});
const colorScale = scaleOrdinal<CityName, string>({
  domain: keys,
  range: ["#6c5efb", "#c998ff", "#a44afe"],
});

const tooltipStyles = {
  ...defaultStyles,
  minWidth: 60,
  backgroundColor: "rgba(0,0,0,0.9)",
  color: "white",
};
const { tooltipOpen, tooltipLeft, tooltipTop, tooltipData, hideTooltip, showTooltip } =
  useTooltip<TooltipData>();

function handleHover(event: MouseEvent, bar: any) {
  showTooltip({
    tooltipData: bar,
    tooltipLeft: event.offsetX,
    tooltipTop: event.offsetY,
  });
}
</script>

<style scoped>
.chart-container {
  width: 100%;
  min-height: 400px;
}
</style>
