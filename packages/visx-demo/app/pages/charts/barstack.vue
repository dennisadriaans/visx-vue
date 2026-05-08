<template>
  <ExamplePage
    back-to="/charts"
    back-label="Charts"
    title="Bar Stack"
    :packages="[
      '@visx-vue/shape',
      '@visx-vue/axis',
      '@visx-vue/grid',
      '@visx-vue/tooltip',
      '@visx-vue/legend',
      '@visx-vue/scale',
      '@visx-vue/mock-data',
    ]"
  >
    <div ref="parentRef" class="chart-outer bg-elevated/40 rounded-xl">
      <svg v-if="width > 0" :width="width" :height="height">
        <rect x="0" y="0" :width="width" :height="height" fill="transparent" :rx="12" />
        <Grid
          :top="margin.top"
          :left="margin.left"
          :x-scale="dateScale"
          :y-scale="temperatureScale"
          :width="xMax"
          :height="yMax"
          stroke="black"
          :stroke-opacity="0.1"
          :x-offset="dateScale.bandwidth() / 2"
        />
        <Group :top="margin.top">
          <BarStack
            :data="data"
            :keys="keys"
            :x="getDate"
            :x-scale="dateScale"
            :y-scale="temperatureScale"
            :color="colorScale"
          >
            <template #default="{ barStacks }">
              <template v-for="barStack in barStacks" :key="`stack-${barStack.index}`">
                <rect
                  v-for="bar in barStack.bars"
                  :key="`bar-stack-${barStack.index}-${bar.index}`"
                  :x="bar.x"
                  :y="bar.y"
                  :height="bar.height"
                  :width="bar.width"
                  :fill="bar.color"
                  style="cursor: pointer"
                  @mousemove="(e) => handleBarHover(e, bar)"
                  @mouseleave="hideTooltip"
                />
              </template>
            </template>
          </BarStack>
        </Group>
        <AxisBottom
          :top="yMax + margin.top"
          :scale="dateScale"
          :tick-format="formatDate"
          stroke="#00DC82"
          tick-stroke="#00DC82"
          :tick-label-props="{ fill: '#00DC82', fontSize: 11, textAnchor: 'middle' }"
        />
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
        <div>{{ tooltipData.bar.data.date }}: {{ tooltipData.bar.data[tooltipData.key] }}°F</div>
      </Tooltip>
    </div>
  </ExamplePage>
</template>

<script setup lang="ts">
import { Group } from "@visx-vue/group";
import { BarStack } from "@visx-vue/shape";
import type { SeriesPoint } from "@visx-vue/shape";
import { Grid } from "@visx-vue/grid";
import { AxisBottom } from "@visx-vue/axis";
import { cityTemperature } from "@visx-vue/mock-data";
import type { CityTemperature } from "@visx-vue/mock-data";
import { scaleBand, scaleLinear, scaleOrdinal } from "@visx-vue/scale";
import { timeParse, timeFormat } from "@visx-vue/vendor/d3-time-format";
import { useTooltip, Tooltip, defaultStyles } from "@visx-vue/tooltip";
import { LegendOrdinal } from "@visx-vue/legend";
import { useParentSize } from "@visx-vue/responsive";

useHead({ title: "Bar Stack — visx-vue" });

const { parentRef, width } = useParentSize({ debounceTime: 0 });
const height = computed(() => Math.round(width.value * 0.6) || 400);

const margin = { top: 40, right: 0, bottom: 0, left: 0 };
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

const xMax = computed(() => width.value);
const yMax = computed(() => height.value - margin.top - 100);

const dateScale = computed(() => {
  const s = scaleBand<string>({ domain: data.map(getDate), padding: 0.2 });
  s.rangeRound([0, xMax.value]);
  return s;
});
const temperatureScale = computed(() => {
  const s = scaleLinear<number>({ domain: [0, Math.max(...temperatureTotals)], nice: true });
  s.range([yMax.value, 0]);
  return s;
});
const colorScale = scaleOrdinal<CityName, string>({
  domain: keys,
  range: ["#00DC82", "#00b368", "#33e394"],
});

const tooltipStyles = {
  ...defaultStyles,
  minWidth: 60,
  backgroundColor: "rgba(0,0,0,0.9)",
  color: "white",
};
const { tooltipOpen, tooltipLeft, tooltipTop, tooltipData, hideTooltip, showTooltip } =
  useTooltip<TooltipData>();

function handleBarHover(event: MouseEvent, bar: any) {
  showTooltip({
    tooltipData: bar,
    tooltipLeft: event.clientX - (event.currentTarget as HTMLElement).getBoundingClientRect().left,
    tooltipTop: event.clientY - (event.currentTarget as HTMLElement).getBoundingClientRect().top,
  });
}
</script>

<style scoped>
.chart-outer {
  width: 100%;
  min-height: 400px;
  position: relative;
}
</style>
