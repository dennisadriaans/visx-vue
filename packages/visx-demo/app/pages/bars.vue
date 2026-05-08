<template>
  <ExamplePage
    title="Bars"
    :packages="[
      '@visx-vue/shape',
      '@visx-vue/gradient',
      '@visx-vue/scale',
      '@visx-vue/mock-data',
      '@visx-vue/group',
    ]"
  >
    <div ref="parentRef" class="chart-container">
      <svg v-if="width > 0" :width="width" :height="height">
        <GradientTealBlue id="teal" />
        <rect :width="width" :height="height" fill="url(#teal)" :rx="14" />
        <Group :top="verticalMargin / 2">
          <Bar
            v-for="d in data"
            :key="`bar-${getLetter(d)}`"
            :x="xScale(getLetter(d))"
            :y="yMax - barHeight(d)"
            :width="xScale.bandwidth()"
            :height="barHeight(d)"
            fill="rgba(23, 233, 217, .5)"
            style="cursor: pointer"
            @click="() => alert(`clicked: ${JSON.stringify(Object.values(d))}`)"
          />
        </Group>
      </svg>
    </div>
  </ExamplePage>
</template>

<script setup lang="ts">
import { computed, onMounted } from "vue";
import { Bar } from "@visx-vue/shape";
import { Group } from "@visx-vue/group";
import { GradientTealBlue } from "@visx-vue/gradient";
import { letterFrequency } from "@visx-vue/mock-data";
import type { LetterFrequency } from "@visx-vue/mock-data";
import { scaleBand, scaleLinear } from "@visx-vue/scale";
import { useParentSize } from "@visx-vue/responsive";

useHead({ title: "Bars — visx-vue" });

const { parentRef, width } = useParentSize({ debounceTime: 0 });
const height = computed(() => Math.round(width.value * 0.6) || 400);

onMounted(() => {
  console.log("Bars page mounted, width:", width.value);
});

const verticalMargin = 120;
const data = letterFrequency.slice(5) as LetterFrequency[];

const getLetter = (d: LetterFrequency) => d.letter;
const getLetterFrequency = (d: LetterFrequency) => Number(d.frequency) * 100;

const xMax = computed(() => width.value);
const yMax = computed(() => height.value - verticalMargin);

const xScale = computed(() =>
  scaleBand<string>({
    range: [0, xMax.value],
    round: true,
    domain: data.map(getLetter),
    padding: 0.4,
  }),
);

const yScale = computed(() =>
  scaleLinear<number>({
    range: [yMax.value, 0],
    round: true,
    domain: [0, Math.max(...data.map(getLetterFrequency))],
  }),
);

function barHeight(d: LetterFrequency) {
  return yMax.value - (yScale.value(getLetterFrequency(d)) ?? 0);
}
</script>

<style scoped>
.chart-container {
  width: 100%;
  min-height: 400px;
}
</style>
