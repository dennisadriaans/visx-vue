<script setup lang="ts">
import { h } from "vue";
import {
  XYChart,
  Axis,
  Grid,
  AreaSeries,
  AreaStack,
  BarSeries,
  BarGroup,
  BarStack,
  LineSeries,
  Tooltip,
  lightTheme,
  darkTheme,
} from "@visx-vue/xychart";
import type { RenderTooltipParams } from "@visx-vue/xychart";
import { cityTemperature } from "@visx-vue/mock-data";
import { curveLinear, curveCardinal, curveStep } from "@visx-vue/curve";
import { useParentSize } from "@visx-vue/responsive";

useHead({ title: "XYChart — visx-vue" });

const { parentRef, width, height: rawHeight } = useParentSize();
const height = computed(() => rawHeight.value || 400);

type CityTemperature = (typeof cityTemperature)[0];

const data = cityTemperature.slice(225, 275);

const getDate = (d: CityTemperature) => d.date;
const getSf = (d: CityTemperature) => Number(d["San Francisco"]);
const getNy = (d: CityTemperature) => Number(d["New York"]);
const getAustin = (d: CityTemperature) => Number(d.Austin);

const useDark = ref(false);
const theme = computed(() => (useDark.value ? darkTheme : lightTheme));

type SeriesType = "area" | "areastack" | "line" | "bar" | "bargroup" | "barstack";
const seriesType = ref<SeriesType>("areastack");

const curveType = ref<"linear" | "cardinal" | "step">("linear");
const curveMap = { linear: curveLinear, cardinal: curveCardinal, step: curveStep };

const showGrid = ref(true);
const showTooltip = ref(true);

function renderTooltip({ tooltipData, colorScale }: RenderTooltipParams<CityTemperature>) {
  const nearest = tooltipData?.nearestDatum;
  if (!nearest) return null;
  return h(
    "div",
    {
      style:
        "fontSize:13px;padding:4px 8px;background:#fff;border-radius:4px;boxShadow:0 2px 8px rgba(0,0,0,.15)",
    },
    [
      h("div", { style: "fontWeight:600;marginBottom:4px" }, nearest.datum.date),
      ...Object.entries(tooltipData?.datumByKey ?? {}).map(([key, entry]) =>
        h(
          "div",
          { key, style: `color:${colorScale?.(key) ?? "#222"}` },
          `${key}: ${entry.datum[key as keyof CityTemperature]}`,
        ),
      ),
    ],
  );
}
</script>

<template>
  <ExamplePage
    back-to="/charts"
    back-label="Charts"
    title="XYChart"
    description="A full-featured chart system with axes, grid, multiple series types, and tooltips."
    :packages="['@visx-vue/xychart', '@visx-vue/mock-data', '@visx-vue/curve']"
  >
    <div class="flex flex-wrap items-center gap-4 mb-4">
      <div class="flex items-center gap-2">
        <span class="text-xs text-default font-medium">series:</span>
        <USelect
          v-model="seriesType"
          :items="['area', 'areastack', 'line', 'bar', 'bargroup', 'barstack']"
          size="sm"
        />
      </div>
      <div class="flex items-center gap-2">
        <span class="text-xs text-default font-medium">curve:</span>
        <USelect v-model="curveType" :items="['linear', 'cardinal', 'step']" size="sm" />
      </div>
      <UCheckbox v-model="useDark" label="dark" />
      <UCheckbox v-model="showGrid" label="grid" />
      <UCheckbox v-model="showTooltip" label="tooltip" />
    </div>
    <div ref="parentRef" class="w-full bg-elevated/40 rounded-xl" style="height: 450px">
      <XYChart
        v-if="width > 10"
        :theme="theme"
        :x-scale="{ type: 'band', paddingInner: 0.3 }"
        :y-scale="{ type: 'linear' }"
        :width="width"
        :height="height"
      >
        <Grid v-if="showGrid" :rows="true" :columns="false" :num-ticks="4" />

        <template v-if="seriesType === 'area'">
          <AreaSeries
            data-key="Austin"
            :data="data"
            :x-accessor="getDate"
            :y-accessor="getAustin"
            :fill-opacity="0.4"
            :curve="curveMap[curveType]"
          />
          <AreaSeries
            data-key="New York"
            :data="data"
            :x-accessor="getDate"
            :y-accessor="getNy"
            :fill-opacity="0.4"
            :curve="curveMap[curveType]"
          />
          <AreaSeries
            data-key="San Francisco"
            :data="data"
            :x-accessor="getDate"
            :y-accessor="getSf"
            :fill-opacity="0.4"
            :curve="curveMap[curveType]"
          />
        </template>

        <template v-else-if="seriesType === 'areastack'">
          <AreaStack
            :curve="curveMap[curveType]"
            :render-line="true"
            :series="[
              { dataKey: 'Austin', data, xAccessor: getDate, yAccessor: getAustin },
              { dataKey: 'New York', data, xAccessor: getDate, yAccessor: getNy },
              { dataKey: 'San Francisco', data, xAccessor: getDate, yAccessor: getSf },
            ]"
          />
        </template>

        <template v-else-if="seriesType === 'line'">
          <LineSeries
            data-key="Austin"
            :data="data"
            :x-accessor="getDate"
            :y-accessor="getAustin"
            :curve="curveMap[curveType]"
          />
          <LineSeries
            data-key="New York"
            :data="data"
            :x-accessor="getDate"
            :y-accessor="getNy"
            :curve="curveMap[curveType]"
          />
          <LineSeries
            data-key="San Francisco"
            :data="data"
            :x-accessor="getDate"
            :y-accessor="getSf"
            :curve="curveMap[curveType]"
          />
        </template>

        <template v-else-if="seriesType === 'bar'">
          <BarSeries data-key="New York" :data="data" :x-accessor="getDate" :y-accessor="getNy" />
        </template>

        <template v-else-if="seriesType === 'bargroup'">
          <BarGroup
            :series="[
              { dataKey: 'Austin', data, xAccessor: getDate, yAccessor: getAustin },
              { dataKey: 'New York', data, xAccessor: getDate, yAccessor: getNy },
              { dataKey: 'San Francisco', data, xAccessor: getDate, yAccessor: getSf },
            ]"
          />
        </template>

        <template v-else-if="seriesType === 'barstack'">
          <BarStack
            :series="[
              { dataKey: 'Austin', data, xAccessor: getDate, yAccessor: getAustin },
              { dataKey: 'New York', data, xAccessor: getDate, yAccessor: getNy },
              { dataKey: 'San Francisco', data, xAccessor: getDate, yAccessor: getSf },
            ]"
          />
        </template>

        <Axis orientation="bottom" :num-ticks="4" />
        <Axis orientation="right" :num-ticks="4" />

        <Tooltip
          v-if="showTooltip"
          :render-tooltip="renderTooltip"
          :show-vertical-crosshair="true"
          :snap-tooltip-to-datum-x="true"
          :snap-tooltip-to-datum-y="true"
          :shared-tooltip="true"
        />
      </XYChart>
    </div>
  </ExamplePage>
</template>
