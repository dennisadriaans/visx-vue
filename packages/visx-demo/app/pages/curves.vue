<template>
  <ExamplePage
    title="Curves"
    :packages="[
      '@visx-vue/shape',
      '@visx-vue/marker',
      '@visx-vue/curve',
      '@visx-vue/group',
      '@visx-vue/scale',
      '@visx-vue/mock-data',
    ]"
  >
    <div class="controls">
      <label>
        Curve type &nbsp;
        <select v-model="curveType">
          <option v-for="c in curveTypes" :key="c" :value="c">{{ c }}</option>
        </select>
      </label>
      &nbsp;
      <label>
        Show points &nbsp;
        <input type="checkbox" v-model="showPoints" />
      </label>
    </div>
    <div ref="parentRef" class="chart-container">
      <svg v-if="width > 0" :width="width" :height="svgHeight">
        <MarkerX
          id="marker-x"
          stroke="#333"
          :size="22"
          :stroke-width="4"
          marker-units="userSpaceOnUse"
        />
        <MarkerCross
          id="marker-cross"
          stroke="#333"
          :size="22"
          :stroke-width="4"
          :stroke-opacity="0.6"
          marker-units="userSpaceOnUse"
        />
        <MarkerCircle id="marker-circle" fill="#333" :size="2" :ref-x="2" />
        <MarkerArrow id="marker-arrow-odd" stroke="#333" :size="8" :stroke-width="1" />
        <MarkerLine id="marker-line" fill="#333" :size="16" :stroke-width="1" />
        <MarkerArrow id="marker-arrow" fill="#333" :ref-x="2" :size="6" />
        <rect :width="width" :height="svgHeight" fill="#efefef" :rx="14" :ry="14" />
        <template v-for="(lineData, i) in series" :key="`lines-${i}`">
          <Group :top="i * lineHeight" :left="13">
            <circle
              v-if="showPoints"
              v-for="(d, j) in lineData"
              :key="`pt-${i}-${j}`"
              r="3"
              :cx="xScale(getX(d))"
              :cy="yScale(getY(d))"
              stroke="rgba(33,33,33,0.5)"
              fill="transparent"
            />
            <LinePath
              :curve="allCurves[curveType]"
              :data="lineData"
              :x="(d) => xScale(getX(d)) ?? 0"
              :y="(d) => yScale(getY(d)) ?? 0"
              stroke="#333"
              :stroke-width="i % 2 === 0 ? 2 : 1"
              :stroke-opacity="i % 2 === 0 ? 0.6 : 1"
              shape-rendering="geometricPrecision"
              marker-mid="url(#marker-circle)"
              :marker-start="
                i % 2 === 0
                  ? 'url(#marker-cross)'
                  : i === 1
                    ? 'url(#marker-line)'
                    : 'url(#marker-x)'
              "
              :marker-end="i % 2 === 0 ? 'url(#marker-arrow)' : 'url(#marker-arrow-odd)'"
            />
          </Group>
        </template>
      </svg>
    </div>
  </ExamplePage>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import * as allCurves from "@visx-vue/curve";
import { Group } from "@visx-vue/group";
import { LinePath } from "@visx-vue/shape";
import { scaleTime, scaleLinear } from "@visx-vue/scale";
import { MarkerArrow, MarkerCross, MarkerX, MarkerCircle, MarkerLine } from "@visx-vue/marker";
import { genDateValue } from "@visx-vue/mock-data";
import type { DateValue } from "@visx-vue/mock-data";
import { extent, max } from "@visx-vue/vendor/d3-array";
import { useParentSize } from "@visx-vue/responsive";

useHead({ title: "Curves — visx-vue" });

const { parentRef, width } = useParentSize({ debounceTime: 0 });

type CurveType = keyof typeof allCurves;
const curveTypes = Object.keys(allCurves) as CurveType[];
const curveType = ref<CurveType>("curveNatural");
const showPoints = ref(true);

const lineCount = 5;
const series = new Array(lineCount)
  .fill(null)
  .map((_, i) =>
    genDateValue(25, i / 72).sort(
      (a: DateValue, b: DateValue) => a.date.getTime() - b.date.getTime(),
    ),
  );
const allData = series.reduce((rec, d) => rec.concat(d), [] as DateValue[]);

const getX = (d: DateValue) => d.date;
const getY = (d: DateValue) => d.value;

const svgHeight = computed(() => Math.round(width.value * 0.8) || 500);
const lineHeight = computed(() => svgHeight.value / lineCount);

const xScale = computed(() => {
  const s = scaleTime<number>({ domain: extent(allData, getX) as [Date, Date] });
  s.range([0, width.value - 50]);
  return s;
});
const yScale = computed(() => {
  const s = scaleLinear<number>({ domain: [0, max(allData, getY) as number] });
  s.range([lineHeight.value - 2, 0]);
  return s;
});
</script>

<style scoped>
.chart-container {
  width: 100%;
  min-height: 400px;
}
.controls {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.5rem 0;
  font-size: 13px;
  flex-wrap: wrap;
}
select {
  border: 1px solid var(--color-border);
  border-radius: 4px;
  padding: 0.2rem;
}
</style>
