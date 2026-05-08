<template>
  <ExamplePage
    back-to="/charts"
    back-label="Charts"
    title="Pies"
    :packages="[
      '@visx-vue/shape',
      '@visx-vue/group',
      '@visx-vue/gradient',
      '@visx-vue/scale',
      '@visx-vue/mock-data',
    ]"
  >
    <div ref="parentRef" class="chart-outer bg-elevated/40 rounded-xl">
      <svg v-if="width > 0" :width="width" :height="height">
        <rect :rx="12" :width="width" :height="height" fill="transparent" />
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
                style="cursor: pointer"
                @click="toggleBrowser(arc.data.label)"
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
                style="cursor: pointer"
                @click="toggleLetter(arc.data.letter)"
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
    "#00DC82",
    "#00b368",
    "#33e394",
    "#007a47",
    "#00f59a",
    "#009a5c",
    "#006b3f",
  ],
});
const getLetterColor = scaleOrdinal<string, string>({
  domain: letters.map((l) => l.letter),
  range: ["#00DC82cc", "#00DC8299", "#00DC8266", "#00DC8233"],
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
.chart-outer {
  width: 100%;
  min-height: 400px;
}
</style>
