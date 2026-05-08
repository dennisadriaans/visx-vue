<script setup lang="ts">
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
</script>

<template>
  <ExamplePage
    back-to="/charts"
    back-label="Charts"
    title="XYChart"
    description="A full-featured chart system with axes, grid, multiple series types, and tooltips."
    :packages="['@visx-vue/xychart', '@visx-vue/mock-data', '@visx-vue/curve']"
  >
    <div class="controls">
      <div class="control-group">
        <strong>series:</strong>
        <label
          v-for="t in ['area', 'areastack', 'line', 'bar', 'bargroup', 'barstack']"
          :key="t"
          class="flex items-center gap-1"
        >
          <input type="radio" :value="t" v-model="seriesType" />
          {{ t }}
        </label>
      </div>
      <div class="control-group">
        <strong>curve:</strong>
        <label
          v-for="c in ['linear', 'cardinal', 'step']"
          :key="c"
          class="flex items-center gap-1"
        >
          <input type="radio" :value="c" v-model="curveType" />
          {{ c }}
        </label>
      </div>
      <label class="flex items-center gap-1">
        <input type="checkbox" v-model="useDark" />
        dark
      </label>
      <label class="flex items-center gap-1">
        <input type="checkbox" v-model="showGrid" />
        grid
      </label>
      <label class="flex items-center gap-1">
        <input type="checkbox" v-model="showTooltip" />
        tooltip
      </label>
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
          <AreaSeries data-key="Austin" :data="data" :x-accessor="getDate" :y-accessor="getAustin" :fill-opacity="0.4" :curve="curveMap[curveType]" />
          <AreaSeries data-key="New York" :data="data" :x-accessor="getDate" :y-accessor="getNy" :fill-opacity="0.4" :curve="curveMap[curveType]" />
          <AreaSeries data-key="San Francisco" :data="data" :x-accessor="getDate" :y-accessor="getSf" :fill-opacity="0.4" :curve="curveMap[curveType]" />
        </template>

        <template v-else-if="seriesType === 'areastack'">
          <AreaStack :curve="curveMap[curveType]" :render-line="true">
            <AreaSeries data-key="Austin" :data="data" :x-accessor="getDate" :y-accessor="getAustin" :fill-opacity="0.4" />
            <AreaSeries data-key="New York" :data="data" :x-accessor="getDate" :y-accessor="getNy" :fill-opacity="0.4" />
            <AreaSeries data-key="San Francisco" :data="data" :x-accessor="getDate" :y-accessor="getSf" :fill-opacity="0.4" />
          </AreaStack>
        </template>

        <template v-else-if="seriesType === 'line'">
          <LineSeries data-key="Austin" :data="data" :x-accessor="getDate" :y-accessor="getAustin" :curve="curveMap[curveType]" />
          <LineSeries data-key="New York" :data="data" :x-accessor="getDate" :y-accessor="getNy" :curve="curveMap[curveType]" />
          <LineSeries data-key="San Francisco" :data="data" :x-accessor="getDate" :y-accessor="getSf" :curve="curveMap[curveType]" />
        </template>

        <template v-else-if="seriesType === 'bar'">
          <BarSeries data-key="New York" :data="data" :x-accessor="getDate" :y-accessor="getNy" />
        </template>

        <template v-else-if="seriesType === 'bargroup'">
          <BarGroup>
            <BarSeries data-key="Austin" :data="data" :x-accessor="getDate" :y-accessor="getAustin" />
            <BarSeries data-key="New York" :data="data" :x-accessor="getDate" :y-accessor="getNy" />
            <BarSeries data-key="San Francisco" :data="data" :x-accessor="getDate" :y-accessor="getSf" />
          </BarGroup>
        </template>

        <template v-else-if="seriesType === 'barstack'">
          <BarStack>
            <BarSeries data-key="Austin" :data="data" :x-accessor="getDate" :y-accessor="getAustin" />
            <BarSeries data-key="New York" :data="data" :x-accessor="getDate" :y-accessor="getNy" />
            <BarSeries data-key="San Francisco" :data="data" :x-accessor="getDate" :y-accessor="getSf" />
          </BarStack>
        </template>

        <Axis orientation="bottom" :num-ticks="4" />
        <Axis orientation="right" :num-ticks="4" />

        <Tooltip
          v-if="showTooltip"
          :show-vertical-crosshair="true"
          :snap-tooltip-to-datum-x="true"
          :snap-tooltip-to-datum-y="true"
          :shared-tooltip="true"
        />
      </XYChart>
    </div>
  </ExamplePage>
</template>

<style scoped>
.controls {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 1rem;
  padding: 0.5rem 0 1rem;
  font-size: 13px;
  color: #ffffff88;
}
.control-group {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.controls label { display: flex; align-items: center; gap: 0.3rem; }
</style>
