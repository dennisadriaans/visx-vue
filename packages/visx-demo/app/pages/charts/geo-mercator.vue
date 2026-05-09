<template>
  <ExamplePage title="Geo Mercator" :packages="['@visx-vue/geo', '@visx-vue/scale']">
    <div ref="parentRef" class="chart-container bg-elevated/40 rounded-xl">
      <svg v-if="width > 0 && features && features.length > 0" :width="width" :height="height">
        <rect x="0" y="0" :width="width" :height="height" fill="transparent" :rx="14" />
        <Mercator
          :data="features"
          :scale="(width / 630) * 100"
          :translate="[width / 2, height / 2 + 50]"
        >
          <template #default="{ features: merFeatures }">
            <g>
              <Graticule
                :graticule="(g) => merFeatures[0]?.path?.(g) || ''"
                stroke="rgba(33,33,33,0.05)"
              />
              <path
                v-for="({ feature, path }, i) in merFeatures"
                :key="`map-feature-${i}`"
                :d="path || ''"
                :fill="colorScale(feature.geometry.coordinates.length)"
                stroke="#ffffff22"
                stroke-width="0.5"
                style="cursor: pointer"
                @click="alert(`Clicked: ${feature.properties.name} (${feature.id})`)"
              />
            </g>
          </template>
        </Mercator>
      </svg>
      <p v-else-if="width > 0" class="loading">Loading world map…</p>
    </div>
  </ExamplePage>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { Mercator, Graticule } from "@visx-vue/geo";
import { scaleQuantize } from "@visx-vue/scale";
import { useParentSize } from "@visx-vue/responsive";

useHead({ title: "Geo Mercator — visx-vue" });

const { parentRef, width } = useParentSize({ debounceTime: 0 });
const height = computed(() => Math.round(width.value * 0.6) || 400);

interface FeatureShape {
  type: "Feature";
  id: string;
  geometry: { coordinates: [number, number][][]; type: "Polygon" };
  properties: { name: string };
}

const { data: features } = await useAsyncData<FeatureShape[]>("world-features", async () => {
  const [topojson, topology] = await Promise.all([
    import("topojson-client"),
    $fetch<any>("/data/world-topo.json"),
  ]);
  const fc = topojson.feature(topology, topology.objects.units) as {
    type: string;
    features: FeatureShape[];
  };
  return fc.features;
});

const colorScale = scaleQuantize<string>({
  domain: [1, 12],
  range: ["#00DC82", "#00c574", "#00ae66", "#009758", "#00804a", "#006b3f", "#005733", "#004527"],
});
</script>

<style scoped>
.chart-container {
  width: 100%;
  min-height: 400px;
}
.loading {
  color: #666;
}
</style>
