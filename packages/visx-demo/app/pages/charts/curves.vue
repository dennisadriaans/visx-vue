<template>
  <ExamplePage
    back-to="/charts"
    back-label="Charts"
    title="Curves"
    :packages="[
      '@visx-vue/shape',
      '@visx-vue/curve',
      '@visx-vue/axis',
      '@visx-vue/grid',
      '@visx-vue/group',
      '@visx-vue/scale',
      '@visx-vue/mock-data',
    ]"
  >
    <div class="controls">
      <label class="flex items-center gap-1">
        Curve type
        <select v-model="curveType">
          <option v-for="c in curveTypes" :key="c" :value="c">{{ c }}</option>
        </select>
      </label>
      <label class="flex items-center gap-1">
        Show points
        <input type="checkbox" v-model="showPoints" />
      </label>
    </div>
    <div ref="parentRef" class="chart-outer bg-elevated/40 rounded-xl">
      <svg v-if="width > 0" :width="width" :height="height">
        <rect :width="width" :height="height" fill="transparent" :rx="12" />
        <Group :top="margin.top" :left="margin.left">
          <GridRows
            :scale="yScale"
            :width="xMax"
            stroke="#ffffff"
            :stroke-opacity="0.08"
            :pointer-events="'none'"
          />
          <GridColumns
            :scale="xScale"
            :height="yMax"
            stroke="#ffffff"
            :stroke-opacity="0.05"
            :pointer-events="'none'"
          />
          <AxisBottom
            :top="yMax"
            :scale="xScale"
            :num-ticks="5"
            :tick-format="(d) => formatDate(d as Date)"
            stroke="#ffffff22"
            tick-stroke="#ffffff22"
            :tick-label-props="{ fill: '#ffffff55', fontSize: 11, textAnchor: 'middle' }"
          />
          <AxisLeft
            :scale="yScale"
            :num-ticks="5"
            stroke="#ffffff22"
            tick-stroke="#ffffff22"
            :tick-label-props="{
              fill: '#ffffff55',
              fontSize: 11,
              textAnchor: 'end',
              dx: '-0.25em',
              dy: '0.33em',
            }"
          />
          <LinePath
            :curve="allCurves[curveType]"
            :data="lineData"
            :x="(d) => xScale(getX(d)) ?? 0"
            :y="(d) => yScale(getY(d)) ?? 0"
            stroke="#00DC82"
            :stroke-width="2.5"
            fill="none"
            shape-rendering="geometricPrecision"
          />
          <template v-if="showPoints">
            <circle
              v-for="(d, i) in lineData"
              :key="`pt-${i}`"
              :cx="xScale(getX(d)) ?? 0"
              :cy="yScale(getY(d)) ?? 0"
              r="4"
              fill="#00DC82"
              :fill-opacity="0.8"
            />
          </template>
        </Group>
      </svg>
    </div>
  </ExamplePage>
</template>

<script setup lang="ts">
import * as allCurves from "@visx-vue/curve";
import { Group } from "@visx-vue/group";
import { LinePath } from "@visx-vue/shape";
import { scaleTime, scaleLinear } from "@visx-vue/scale";
import { AxisBottom, AxisLeft } from "@visx-vue/axis";
import { GridRows, GridColumns } from "@visx-vue/grid";
import { genDateValue } from "@visx-vue/mock-data";
import type { DateValue } from "@visx-vue/mock-data";
import { extent, max } from "@visx-vue/vendor/d3-array";
import { timeFormat } from "@visx-vue/vendor/d3-time-format";
import { useParentSize } from "@visx-vue/responsive";

useHead({ title: "Curves — visx-vue" });

const { parentRef, width } = useParentSize({ debounceTime: 0 });
const height = computed(() => Math.round(width.value * 0.5) || 400);

type CurveType = keyof typeof allCurves;
const curveTypes = Object.keys(allCurves) as CurveType[];
const curveType = ref<CurveType>("curveNatural");
const showPoints = ref(true);

const margin = { top: 20, left: 50, right: 20, bottom: 40 };

const lineData = genDateValue(40).sort(
  (a: DateValue, b: DateValue) => a.date.getTime() - b.date.getTime(),
);

const getX = (d: DateValue) => d.date;
const getY = (d: DateValue) => d.value;

const formatDate = timeFormat("%b %d");

const xMax = computed(() => width.value - margin.left - margin.right);
const yMax = computed(() => height.value - margin.top - margin.bottom);

const xScale = computed(() =>
  scaleTime<number>({
    domain: extent(lineData, getX) as [Date, Date],
    range: [0, xMax.value],
  }),
);
const yScale = computed(() =>
  scaleLinear<number>({
    domain: [0, (max(lineData, getY) as number) * 1.1],
    range: [yMax.value, 0],
    nice: true,
  }),
);
</script>

<style scoped>
.chart-outer {
  width: 100%;
  min-height: 400px;
}
.controls {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.5rem 0 1rem;
  font-size: 13px;
  flex-wrap: wrap;
  color: #ffffff88;
}
.controls label {
  display: flex;
  align-items: center;
  gap: 0.4rem;
}
.controls select {
  border: 1px solid #ffffff22;
  border-radius: 4px;
  padding: 2px 6px;
  background: #0a0a14;
  color: #ffffff88;
  font-size: 12px;
}
</style>
