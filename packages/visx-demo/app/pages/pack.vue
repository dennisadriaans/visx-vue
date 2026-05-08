<template>
  <ExamplePage
    title="Pack"
    :packages="['@visx-vue/hierarchy', '@visx-vue/group', '@visx-vue/scale', '@visx-vue/mock-data']"
  >
    <div ref="parentRef" class="chart-container">
      <svg v-if="width > 0" :width="width" :height="height">
        <rect :width="width" :height="height" :rx="14" fill="#ffffff" />
        <Pack :root="packRoot" :size="[width * 2, height * 2]">
          <template #default="{ pack }">
            <Group :top="-height - margin.bottom" :left="-width / 2">
              <circle
                v-for="(circle, i) in pack.descendants().slice(2)"
                :key="`circle-${i}`"
                :r="circle.r"
                :cx="circle.x"
                :cy="circle.y"
                :fill="colorScale(circle.data.radius)"
              />
            </Group>
          </template>
        </Pack>
      </svg>
    </div>
  </ExamplePage>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { Group } from "@visx-vue/group";
import { Pack, hierarchy } from "@visx-vue/hierarchy";
import { scaleQuantize } from "@visx-vue/scale";
import { exoplanets as rawData } from "@visx-vue/mock-data";
import type { Exoplanets as Datum } from "@visx-vue/mock-data";
import { useParentSize } from "@visx-vue/responsive";

useHead({ title: "Pack — visx-vue" });

const { parentRef, width } = useParentSize({ debounceTime: 0 });
const height = computed(() => Math.round(width.value * 0.6) || 400);
const margin = { top: 10, left: 30, right: 40, bottom: 80 };

const filteredPlanets = (rawData as Datum[]).filter((d) => d.distance !== 0 && d.distance != null);
const pack = { children: filteredPlanets, name: "root", radius: 0, distance: 0 };

const allRadii = (rawData as Datum[]).map((d) => d.radius);
const rMin = Math.min(...allRadii);
const rMax = Math.max(...allRadii);

const colorScale = scaleQuantize<string>({
  domain: [rMin, rMax],
  range: ["#ffe108", "#ffc10e", "#fd6d6f", "#855af2", "#11d2f9", "#49f4e7"],
});

const packRoot = hierarchy<Datum>(pack as any)
  .sum((d) => (d as any).radius * (d as any).radius)
  .sort(
    (a, b) =>
      (a?.data ? 1 : -1) - (b?.data ? 1 : -1) ||
      (a.children ? 1 : -1) - (b.children ? 1 : -1) ||
      (a.data.distance == null ? -1 : 1) - (b.data.distance == null ? -1 : 1) ||
      a.data.distance! - b.data.distance!,
  );
</script>

<style scoped>
.chart-container {
  width: 100%;
  min-height: 400px;
}
</style>
