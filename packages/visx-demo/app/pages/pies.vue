<template>
  <ExamplePage
    title="Pies"
    :packages="[
      '@visx-vue/shape',
      '@visx-vue/group',
      '@visx-vue/gradient',
      '@visx-vue/scale',
      '@visx-vue/mock-data',
    ]"
  >
    <div ref="parentRef" class="chart-container">
      <svg v-if="width > 0" :width="width" :height="height">
        <GradientPinkBlue id="visx-pie-gradient" />
        <rect :rx="14" :width="width" :height="height" fill="url('#visx-pie-gradient')" />
        <Group :top="centerY + margin.top" :left="centerX + margin.left">
          <Pie
            :data="selectedBrowser ? browsers.filter((b) => b.label === selectedBrowser) : browsers"
            :pie-value="(d) => d.usage"
            :outer-radius="radius"
            :inner-radius="radius - donutThickness"
            :corner-radius="3"
            :pad-angle="0.005"
          >
            <template #default="{ arcs, path }">
              <path
                v-for="arc in arcs"
                :key="arc.data.label"
                :d="path(arc) || ''"
                :fill="getBrowserColor(arc.data.label)"
                @click="toggleBrowser(arc.data.label)"
                style="cursor: pointer"
              />
            </template>
          </Pie>
          <Pie
            :data="selectedLetter ? letters.filter((l) => l.letter === selectedLetter) : letters"
            :pie-value="(d) => d.frequency"
            :pie-sort-values="() => -1"
            :outer-radius="radius - donutThickness * 1.3"
          >
            <template #default="{ arcs, path }">
              <path
                v-for="arc in arcs"
                :key="arc.data.letter"
                :d="path(arc) || ''"
                :fill="getLetterColor(arc.data.letter)"
                @click="toggleLetter(arc.data.letter)"
                style="cursor: pointer"
              />
            </template>
          </Pie>
        </Group>
        <text
          text-anchor="end"
          :x="width - 16"
          :y="height - 16"
          fill="white"
          font-size="11"
          font-weight="300"
          pointer-events="none"
        >
          Click segments to update
        </text>
      </svg>
    </div>
  </ExamplePage>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { Group } from "@visx-vue/group";
import { Pie } from "@visx-vue/shape";
import { scaleOrdinal } from "@visx-vue/scale";
import { GradientPinkBlue } from "@visx-vue/gradient";
import { letterFrequency, browserUsage } from "@visx-vue/mock-data";
import type { LetterFrequency, BrowserUsage as Browsers } from "@visx-vue/mock-data";
import { useParentSize } from "@visx-vue/responsive";

useHead({ title: "Pies — visx-vue" });

const { parentRef, width } = useParentSize({ debounceTime: 0 });
const height = computed(() => Math.round(width.value * 0.6) || 400);

const margin = { top: 20, right: 20, bottom: 20, left: 20 };

interface BrowserUsage {
  label: keyof Browsers;
  usage: number;
}

const letters = letterFrequency.slice(0, 4) as LetterFrequency[];
const browserNames = Object.keys((browserUsage as Browsers[])[0]).filter(
  (k) => k !== "date",
) as (keyof Browsers)[];
const browsers: BrowserUsage[] = browserNames.map((name) => ({
  label: name,
  usage: Number((browserUsage as Browsers[])[0][name]),
}));

const getBrowserColor = scaleOrdinal<string, string>({
  domain: browserNames as string[],
  range: [
    "rgba(255,255,255,0.7)",
    "rgba(255,255,255,0.6)",
    "rgba(255,255,255,0.5)",
    "rgba(255,255,255,0.4)",
    "rgba(255,255,255,0.3)",
    "rgba(255,255,255,0.2)",
    "rgba(255,255,255,0.1)",
  ],
});
const getLetterColor = scaleOrdinal<string, string>({
  domain: letters.map((l) => l.letter),
  range: ["rgba(93,30,91,1)", "rgba(93,30,91,0.8)", "rgba(93,30,91,0.6)", "rgba(93,30,91,0.4)"],
});

const selectedBrowser = ref<string | null>(null);
const selectedLetter = ref<string | null>(null);

const innerWidth = computed(() => width.value - margin.left - margin.right);
const innerHeight = computed(() => height.value - margin.top - margin.bottom);
const radius = computed(() => Math.min(innerWidth.value, innerHeight.value) / 2);
const centerX = computed(() => innerWidth.value / 2);
const centerY = computed(() => innerHeight.value / 2);
const donutThickness = 50;

function toggleBrowser(label: string) {
  selectedBrowser.value = selectedBrowser.value === label ? null : label;
}
function toggleLetter(letter: string) {
  selectedLetter.value = selectedLetter.value === letter ? null : letter;
}
</script>

<style scoped>
.chart-container {
  width: 100%;
  min-height: 400px;
}
</style>
