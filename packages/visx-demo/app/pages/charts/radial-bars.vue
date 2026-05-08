<script setup lang="ts">import { computed, ref } from "vue";
import { Arc } from "@visx-vue/shape";
import { Group } from "@visx-vue/group";
import { GradientLightgreenGreen } from "@visx-vue/gradient";
import { scaleBand, scaleRadial } from "@visx-vue/scale";
import { Text as VisxText } from "@visx-vue/text";
import { letterFrequency } from "@visx-vue/mock-data";
import { useParentSize } from "@visx-vue/responsive";

const { parentRef, width, height: rawHeight } = useParentSize();
const height = computed(() => rawHeight.value || 400);

const data = [...letterFrequency];
const getLetter = (d: (typeof data)[0]) => d.letter;
const getLetterFrequency = (d: (typeof data)[0]) => Number(d.frequency) * 100;

const barColor = "#00DC82";
const margin = { top: 20, bottom: 20, left: 20, right: 20 };

const toRadians = (x: number) => (x * Math.PI) / 180;
const toDegrees = (x: number) => (x * 180) / Math.PI;

const rotation = ref(0);
const sortAlphabetically = ref(true);

const xMax = computed(() => width.value - margin.left - margin.right);
const yMax = computed(() => height.value - margin.top - margin.bottom);
const radiusMax = computed(() => Math.min(xMax.value, yMax.value) / 2);
const innerRadius = computed(() => radiusMax.value / 3);

const sortedData = computed(() =>
  [...data].sort((a, b) =>
    sortAlphabetically.value ? a.letter.localeCompare(b.letter) : b.frequency - a.frequency,
  ),
);

const xDomain = computed(() => sortedData.value.map(getLetter));

const xScale = computed(() =>
  scaleBand<string>({
    range: [0 + rotation.value, 2 * Math.PI + rotation.value],
    domain: xDomain.value,
    padding: 0.2,
  }),
);

const yScale = computed(() =>
  scaleRadial<number>({
    range: [innerRadius.value, radiusMax.value],
    domain: [0, Math.max(...data.map(getLetterFrequency))],
  }),
);

const bars = computed(() =>
  sortedData.value.map((d) => {
    const letter = getLetter(d);
    const startAngle = xScale.value(letter) ?? 0;
    const midAngle = startAngle + xScale.value.bandwidth() / 2;
    const outerRadius = yScale.value(getLetterFrequency(d)) ?? 0;
    const textRadius = outerRadius + 4;
    return {
      letter,
      startAngle,
      endAngle: startAngle + xScale.value.bandwidth(),
      outerRadius,
      textX: textRadius * Math.cos(midAngle - Math.PI / 2),
      textY: textRadius * Math.sin(midAngle - Math.PI / 2),
      angle: toDegrees(midAngle),
    };
  }),
);
</script>

<template>
  <ExamplePage
    title="Radial Bars"
    description="A radial bar chart with rotation control and alphabetical/frequency sorting."
    :packages="['@visx-vue/shape', '@visx-vue/scale', '@visx-vue/gradient', '@visx-vue/text']"
  >
    <template #controls>
      <label class="flex items-center gap-2 text-sm">
        <strong>Rotate</strong>
        <input
          type="range"
          min="0"
          max="360"
          :value="toDegrees(rotation)"
          @input="(e) => (rotation = toRadians(Number((e.target as HTMLInputElement).value)))"
          class="w-32"
        />
        {{ toDegrees(rotation).toFixed(0) }}°
      </label>
      <div class="flex items-center gap-4 text-sm mt-2">
        <strong>Sort bars</strong>
        <label class="flex items-center gap-1">
          <input type="radio" :checked="sortAlphabetically" @change="sortAlphabetically = true" />
          Alphabetically
        </label>
        <label class="flex items-center gap-1">
          <input type="radio" :checked="!sortAlphabetically" @change="sortAlphabetically = false" />
          By frequency
        </label>
      </div>
    </template>
    <div ref="parentRef" class="w-full bg-elevated/40 rounded-xl" style="height: 500px">
      <svg v-if="width > 10" :width="width" :height="height">
        <rect :width="width" :height="height" fill="transparent" rx="14" />
        <Group :top="yMax / 2 + margin.top" :left="xMax / 2 + margin.left">
          <template v-for="bar in bars" :key="`bar-${bar.letter}`">
            <Arc
              :corner-radius="4"
              :start-angle="bar.startAngle"
              :end-angle="bar.endAngle"
              :outer-radius="bar.outerRadius"
              :inner-radius="innerRadius"
              :fill="barColor"
            />
            <VisxText
              :x="bar.textX"
              :y="bar.textY"
              dominant-baseline="end"
              text-anchor="middle"
              font-size="16"
              font-weight="bold"
              :fill="barColor"
              :angle="bar.angle"
            >
              {{ bar.letter }}
            </VisxText>
          </template>
        </Group>
      </svg>
    </div>
  </ExamplePage>
</template>
