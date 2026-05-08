<template>
  <ExamplePage
    title="Chord"
    :packages="[
      '@visx-vue/chord',
      '@visx-vue/shape',
      '@visx-vue/gradient',
      '@visx-vue/group',
      '@visx-vue/scale',
    ]"
  >
    <div ref="parentRef" class="chart-container bg-elevated/40 rounded-xl">
      <svg v-if="width > 0" :width="width" :height="svgHeight">
        <LinearGradient id="gpinkorange" from="#00DC82" to="#00f59a" :vertical="false" />
        <LinearGradient id="gpurplered" from="#00b368" to="#007a47" :vertical="false" />
        <LinearGradient id="gpurplegreen" from="#33e394" to="#00DC82" :vertical="false" />
        <LinearGradient id="gbluelime" from="#007a47" to="#00b368" :vertical="false" />
        <rect :width="width" :height="svgHeight" fill="transparent" :rx="14" />
        <Group :top="svgHeight / 2" :left="width / 2">
          <Chord :matrix="dataMatrix" :pad-angle="0.05" :sort-subgroups="descending">
            <template #default="{ chords }">
              <g>
                <Arc
                  v-for="(group, i) in chords.groups"
                  :key="`arc-${i}`"
                  :data="group"
                  :inner-radius="innerRadius"
                  :outer-radius="outerRadius"
                  :fill="colorScale(i)"
                  style="cursor: pointer"
                  @click="() => alert(JSON.stringify(group))"
                />
                <Ribbon
                  v-for="(chord, i) in chords"
                  :key="`ribbon-${i}`"
                  :chord="chord"
                  :radius="innerRadius"
                  :fill="colorScale(chord.target.index)"
                  :fill-opacity="0.75"
                  style="cursor: pointer"
                  @click="() => alert(JSON.stringify(chord))"
                />
              </g>
            </template>
          </Chord>
        </Group>
      </svg>
      <p class="credit">
        Based on Mike Bostock's
        <a href="https://bl.ocks.org/mbostock/4062006" target="_blank" rel="noopener"
          >Chord Diagram</a
        >
      </p>
    </div>
  </ExamplePage>
</template>

<script setup lang="ts">import { computed } from "vue";
import { Arc } from "@visx-vue/shape";
import { Group } from "@visx-vue/group";
import { Chord, Ribbon } from "@visx-vue/chord";
import { scaleOrdinal } from "@visx-vue/scale";
import { LinearGradient } from "@visx-vue/gradient";
import { useParentSize } from "@visx-vue/responsive";

useHead({ title: "Chord — visx-vue" });

const { parentRef, width } = useParentSize({ debounceTime: 0 });
const svgHeight = computed(() => Math.max((Math.round(width.value * 0.6) || 400) - 77, 100));

const centerSize = 20;

const outerRadius = computed(
  () => Math.min(width.value, svgHeight.value) * 0.5 - (centerSize + 10),
);
const innerRadius = computed(() => outerRadius.value - centerSize);

const dataMatrix = [
  [11975, 5871, 8916, 2868],
  [1951, 10048, 2060, 6171],
  [8010, 16145, 8090, 8045],
  [1013, 990, 940, 6907],
];

function descending(a: number, b: number) {
  return b < a ? -1 : b > a ? 1 : b >= a ? 0 : NaN;
}

const colorScale = scaleOrdinal<number, string>({
  domain: [0, 1, 2, 3],
  range: ["url(#gpinkorange)", "url(#gpurplered)", "url(#gpurplegreen)", "url(#gbluelime)"],
});
</script>

<style scoped>
.chart-container {
  width: 100%;
  min-height: 400px;
}
.credit {
  font-size: 12px;
  color: var(--color-text-secondary);
  margin-top: 0.5rem;
  text-align: center;
}
.credit a {
  color: var(--color-accent);
}
</style>
