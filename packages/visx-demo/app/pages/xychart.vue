<script setup lang="ts">
import { computed, ref } from "vue";
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
    title="XYChart"
    description="A full-featured chart system with axes, grid, multiple series types, and tooltips."
    :packages="['@visx-vue/xychart', '@visx-vue/mock-data', '@visx-vue/curve']"
  >
    <template #controls>
      <div class="flex flex-wrap gap-4 text-sm">
        <div class="flex items-center gap-1">
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
        <div class="flex items-center gap-1">
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
          dark theme
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
    </template>
    <div ref="parentRef" class="w-full" style="height: 450px">
      <XYChart
        v-if="width > 10"
        :theme="theme"
        :x-scale="{ type: 'band', paddingInner: 0.3 }"
        :y-scale="{ type: 'linear' }"
        :width="width"
        :height="height"
      >
        <Grid v-if="showGrid" :rows="true" :columns="false" :num-ticks="4" />

        <!-- Area series -->
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

        <!-- Area stack -->
        <template v-else-if="seriesType === 'areastack'">
          <AreaStack :curve="curveMap[curveType]" :render-line="true">
            <AreaSeries
              data-key="Austin"
              :data="data"
              :x-accessor="getDate"
              :y-accessor="getAustin"
              :fill-opacity="0.4"
            />
            <AreaSeries
              data-key="New York"
              :data="data"
              :x-accessor="getDate"
              :y-accessor="getNy"
              :fill-opacity="0.4"
            />
            <AreaSeries
              data-key="San Francisco"
              :data="data"
              :x-accessor="getDate"
              :y-accessor="getSf"
              :fill-opacity="0.4"
            />
          </AreaStack>
        </template>

        <!-- Line series -->
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

        <!-- Bar series -->
        <template v-else-if="seriesType === 'bar'">
          <BarSeries data-key="New York" :data="data" :x-accessor="getDate" :y-accessor="getNy" />
        </template>

        <!-- Bar group -->
        <template v-else-if="seriesType === 'bargroup'">
          <BarGroup>
            <BarSeries
              data-key="Austin"
              :data="data"
              :x-accessor="getDate"
              :y-accessor="getAustin"
            />
            <BarSeries data-key="New York" :data="data" :x-accessor="getDate" :y-accessor="getNy" />
            <BarSeries
              data-key="San Francisco"
              :data="data"
              :x-accessor="getDate"
              :y-accessor="getSf"
            />
          </BarGroup>
        </template>

        <!-- Bar stack -->
        <template v-else-if="seriesType === 'barstack'">
          <BarStack>
            <BarSeries
              data-key="Austin"
              :data="data"
              :x-accessor="getDate"
              :y-accessor="getAustin"
            />
            <BarSeries data-key="New York" :data="data" :x-accessor="getDate" :y-accessor="getNy" />
            <BarSeries
              data-key="San Francisco"
              :data="data"
              :x-accessor="getDate"
              :y-accessor="getSf"
            />
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
