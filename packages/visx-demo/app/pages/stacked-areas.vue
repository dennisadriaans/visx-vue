<template>
  <ExamplePage
    title="Stacked Areas"
    :packages="['@visx-vue/shape', '@visx-vue/gradient', '@visx-vue/scale', '@visx-vue/mock-data']"
  >
    <div ref="parentRef" class="chart-container">
      <svg v-if="width > 0" :width="width" :height="height">
        <GradientOrangeRed id="stacked-area-orangered" />
        <rect x="0" y="0" :width="width" :height="height" fill="#f38181" :rx="14" />
        <AreaStack
          :top="margin.top"
          :left="margin.left"
          :keys="keys"
          :data="data"
          :x="(d) => xScale(getDate(d.data)) ?? 0"
          :y0="(d) => yScale(getY0(d)) ?? 0"
          :y1="(d) => yScale(getY1(d)) ?? 0"
        >
          <template #default="{ stacks, path }">
            <path
              v-for="stack in stacks"
              :key="`stack-${stack.key}`"
              :d="path(stack) || ''"
              stroke="transparent"
              fill="url(#stacked-area-orangered)"
              style="cursor: pointer"
              @click="() => alert(stack.key)"
            />
          </template>
        </AreaStack>
      </svg>
    </div>
  </ExamplePage>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { AreaStack } from "@visx-vue/shape";
import type { SeriesPoint } from "@visx-vue/shape";
import { GradientOrangeRed } from "@visx-vue/gradient";
import { browserUsage } from "@visx-vue/mock-data";
import type { BrowserUsage } from "@visx-vue/mock-data";
import { scaleTime, scaleLinear } from "@visx-vue/scale";
import { timeParse } from "@visx-vue/vendor/d3-time-format";
import { useParentSize } from "@visx-vue/responsive";

useHead({ title: "Stacked Areas — visx-vue" });

const { parentRef, width } = useParentSize({ debounceTime: 0 });
const height = computed(() => Math.round(width.value * 0.6) || 400);

const margin = { top: 0, right: 0, bottom: 0, left: 0 };
type BrowserNames = keyof BrowserUsage;

const data = browserUsage as BrowserUsage[];
const keys = Object.keys(data[0]).filter((k) => k !== "date") as BrowserNames[];
const parseDate = timeParse("%Y %b %d");

const getDate = (d: BrowserUsage) => (parseDate(d.date) as Date).valueOf();
const getY0 = (d: SeriesPoint<BrowserUsage>) => d[0] / 100;
const getY1 = (d: SeriesPoint<BrowserUsage>) => d[1] / 100;

const yMax = computed(() => height.value - margin.top - margin.bottom);
const xMax = computed(() => width.value - margin.left - margin.right);

const xScale = computed(() =>
  scaleTime<number>({
    range: [0, xMax.value],
    domain: [Math.min(...data.map(getDate)), Math.max(...data.map(getDate))],
  }),
);
const yScale = computed(() => scaleLinear<number>({ range: [yMax.value, 0] }));
</script>

<style scoped>
.chart-container {
  width: 100%;
  min-height: 400px;
}
</style>
