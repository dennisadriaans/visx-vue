<template>
  <ExamplePage
    title="Axis"
    :packages="[
      '@visx-vue/axis',
      '@visx-vue/spring',
      '@visx-vue/grid',
      '@visx-vue/shape',
      '@visx-vue/gradient',
      '@visx-vue/scale',
    ]"
  >
    <div ref="parentRef" class="chart-container">
      <div v-if="width > 0" class="controls">
        <label>
          <input type="checkbox" :checked="useAnimated" @change="useAnimated = !useAnimated" />
          use animated components
        </label>
        <label>
          Data: &nbsp;
          <button @click="dataToggle = !dataToggle">toggle</button>
        </label>
        <label>
          Trajectory: &nbsp;
          <select v-model="animationTrajectory">
            <option value="outside">outside</option>
            <option value="center">center</option>
            <option value="min">min</option>
            <option value="max">max</option>
          </select>
        </label>
      </div>
      <svg v-if="width > 0" :width="width" :height="height">
        <LinearGradient id="visx-axis-gradient" from="#da7cff" to="#da7cff" :to-opacity="0.5" />
        <rect
          x="0"
          y="0"
          :width="width"
          :height="height"
          fill="url(#visx-axis-gradient)"
          :rx="14"
        />
        <g :transform="`translate(${margin.left},${margin.top})`">
          <template v-for="(axis, i) in axes" :key="`scale-${i}`">
            <g :transform="`translate(0, ${i * (scaleHeight + scalePadding)})`">
              <component
                :is="GridRowsComponent"
                :scale="yScale"
                stroke="#6e0fca"
                :width="innerWidth"
                :num-ticks="dataToggle ? 1 : 3"
                :animation-trajectory="animationTrajectory"
              />
              <component
                :is="GridColumnsComponent"
                :scale="axis.scale"
                stroke="#6e0fca"
                :height="scaleHeight"
                :num-ticks="dataToggle ? 5 : 2"
                :animation-trajectory="animationTrajectory"
              />
              <AreaClosed
                :data="
                  axis.values.map(
                    (x) =>
                      [axis.scale(x) ?? 0, yScale(seededRandom() * 80) ?? 0] as [number, number],
                  )
                "
                :x="(d) => d[0]"
                :y="(d) => d[1]"
                :y-scale="yScale"
                fill="#340098"
                :fill-opacity="0.4"
                stroke="#fff"
                :stroke-opacity="0.8"
                :stroke-width="1"
              />
              <component
                :is="AxisComponent"
                :orientation="Orientation.bottom"
                :top="scaleHeight"
                :scale="axis.scale"
                stroke="#fff"
                tick-stroke="#fff"
                :animation-trajectory="animationTrajectory"
                :tick-label-props="tickLabelProps"
                :tick-format="axis.tickFormat"
                :label="axis.label"
                :label-props="{
                  fill: '#340098',
                  fontSize: 18,
                  dx: '-0.5em',
                  style: { fontWeight: 600 },
                }"
              />
            </g>
          </template>
        </g>
      </svg>
    </div>
  </ExamplePage>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { AreaClosed } from "@visx-vue/shape";
import { curveMonotoneX } from "@visx-vue/curve";
import { scaleUtc, scaleLinear, scaleLog, scaleBand, coerceNumber } from "@visx-vue/scale";
import { Axis, Orientation } from "@visx-vue/axis";
import { GridRows, GridColumns } from "@visx-vue/grid";
import { AnimatedAxis, AnimatedGridRows, AnimatedGridColumns } from "@visx-vue/spring";
import { getSeededRandom } from "@visx-vue/mock-data";
import { LinearGradient } from "@visx-vue/gradient";
import { timeFormat } from "@visx-vue/vendor/d3-time-format";
import { useParentSize } from "@visx-vue/responsive";

useHead({ title: "Axis — visx-vue" });

const { parentRef, width } = useParentSize({ debounceTime: 0 });
const height = computed(() => Math.round(width.value * 1.1) || 600);

const margin = { top: 40, right: 150, bottom: 20, left: 50 };
const scalePadding = 40;

const innerWidth = computed(() => width.value - margin.left - margin.right);
const innerHeight = computed(() => height.value - margin.top - margin.bottom);
const scaleHeight = computed(() => innerHeight.value / 4 - scalePadding);

const useAnimated = ref(true);
const dataToggle = ref(true);
const animationTrajectory = ref<"outside" | "center" | "min" | "max">("center");

const seededRandom = getSeededRandom(0.5);

const AxisComponent = computed(() => (useAnimated.value ? AnimatedAxis : Axis));
const GridRowsComponent = computed(() => (useAnimated.value ? AnimatedGridRows : GridRows));
const GridColumnsComponent = computed(() =>
  useAnimated.value ? AnimatedGridColumns : GridColumns,
);

const tickLabelProps = {
  fill: "#fff",
  fontSize: 12,
  fontFamily: "sans-serif",
  textAnchor: "middle" as const,
};

const getMinMax = (vals: number[]) => [Math.min(...vals), Math.max(...vals)];

const yScale = computed(() => scaleLinear({ domain: [100, 0], range: [scaleHeight.value, 0] }));

const axes = computed(() => {
  const linearValues = dataToggle.value ? [0, 2, 4, 6, 8, 10] : [6, 8, 10, 12];
  const bandValues = dataToggle.value ? ["a", "b", "c", "d"] : ["d", "c", "b", "a"];
  const timeValues = dataToggle.value
    ? [new Date("2020-01-01"), new Date("2020-02-01")]
    : [new Date("2020-02-01"), new Date("2020-03-01")];
  const logValues = dataToggle.value ? [1, 10, 100, 1000, 10000] : [0.0001, 0.001, 0.1, 1, 10, 100];

  return [
    {
      scale: scaleLinear({ domain: getMinMax(linearValues), range: [0, innerWidth.value] }),
      values: linearValues,
      tickFormat: (v: number, index: number, ticks: { value: number; index: number }[]) =>
        index === 0 ? "first" : index === ticks[ticks.length - 1].index ? "last" : `${v}`,
      label: "linear",
    },
    {
      scale: scaleBand({
        domain: bandValues,
        range: [0, innerWidth.value],
        paddingOuter: 0,
        paddingInner: 1,
      }),
      values: bandValues,
      tickFormat: (v: string) => v,
      label: "categories",
    },
    {
      scale: scaleUtc({
        domain: getMinMax(timeValues.map((d) => d.valueOf())),
        range: [0, innerWidth.value],
      }),
      values: timeValues,
      tickFormat: (v: Date, i: number) =>
        i === 3 ? "🎉" : width.value > 400 || i % 2 === 0 ? timeFormat("%b %d")(v) : "",
      label: "time",
    },
    {
      scale: scaleLog({
        domain: [Math.min(...logValues), Math.max(...logValues)],
        range: [0, innerWidth.value],
      }),
      values: logValues,
      tickFormat: (v: number) => {
        const s = `${v}`;
        return s.match(/^[.01?[\]]*$/) ? s : "";
      },
      label: "log",
    },
  ];
});
</script>

<style scoped>
.chart-container {
  width: 100%;
  min-height: 500px;
}
.controls {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  padding: 0.5rem 0;
  font-size: 13px;
}
.controls label {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}
button {
  padding: 0.2rem 0.5rem;
  border: 1px solid var(--color-border);
  border-radius: 4px;
  cursor: pointer;
  background: var(--color-bg);
}
</style>
