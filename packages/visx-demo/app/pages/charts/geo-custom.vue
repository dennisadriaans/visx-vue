<script setup lang="ts">import { computed, ref } from "vue";
import { CustomProjection, Graticule } from "@visx-vue/geo";
import { useZoom } from "@visx-vue/zoom";
import { scaleQuantize } from "@visx-vue/scale";
import {
  geoConicConformal,
  geoTransverseMercator,
  geoNaturalEarth1,
  geoConicEquidistant,
  geoOrthographic,
  geoStereographic,
} from "@visx-vue/vendor/d3-geo";
import { useParentSize } from "@visx-vue/responsive";

const { parentRef, width, height: rawHeight } = useParentSize();
const height = computed(() => rawHeight.value || 400);

const background = "transparent";
const purple = "#00DC8233";

const PROJECTIONS = {
  geoConicConformal,
  geoTransverseMercator,
  geoNaturalEarth1,
  geoConicEquidistant,
  geoOrthographic,
  geoStereographic,
} as const;

type ProjectionKey = keyof typeof PROJECTIONS;

const projection = ref<ProjectionKey>("geoConicConformal");

const initialScale = computed(() => (width.value / 630) * 100);

const zoom = useZoom({
  scaleXMin: 100,
  scaleXMax: 1000,
  scaleYMin: 100,
  scaleYMax: 1000,
  initialTransformMatrix: computed(() => ({
    scaleX: initialScale.value,
    scaleY: initialScale.value,
    translateX: width.value / 2,
    translateY: height.value / 2,
    skewX: 0,
    skewY: 0,
  })),
});

const { data: worldData } = await useAsyncData("geo-custom-world", async () => {
  const [topojson, topo] = await Promise.all([
    import("topojson-client"),
    $fetch<{ objects: { units: { type: string } }; type: string }>("/data/world-topo.json"),
  ]);
  return (
    topojson.feature(
      topo as never,
      (topo as never as { objects: { units: object } }).objects.units,
    ) as {
      features: {
        id: string;
        geometry: { coordinates: [number, number][][]; type: string };
        properties: { name: string };
      }[];
    }
  ).features;
});

const colorScale = computed(() => {
  if (!worldData.value?.length) return null;
  const lengths = worldData.value.map((f) => f.geometry.coordinates.length);
  return scaleQuantize({
    domain: [Math.min(...lengths), Math.max(...lengths)],
    range: [
      "#00DC82",
      "#00b368",
      "#33e394",
      "#007a47",
      "#00f59a",
      "#009a5c",
      "#006b3f",
      "#4db890",
      "#00DC82cc",
      "#00b368cc",
      "#33e394cc",
      "#007a47cc",
    ],
  });
});
</script>

<template>
  <ExamplePage
    title="Geo Custom"
    description="Custom map projection with pan/zoom support. Choose from 6 different projections."
    :packages="['@visx-vue/geo', '@visx-vue/zoom', '@visx-vue/scale']"
  >
    <template #controls>
      <div class="flex items-center gap-2 text-sm">
        <label class="flex items-center gap-1">
          projection:
          <select v-model="projection" class="border border-gray-300 rounded px-1">
            <option v-for="key in Object.keys(PROJECTIONS)" :key="key" :value="key">
              {{ key }}
            </option>
          </select>
        </label>
        <button
          class="px-2 py-0.5 border border-gray-300 rounded text-sm"
          @click="() => zoom.scale({ scaleX: 1.2, scaleY: 1.2 })"
        >
          +
        </button>
        <button
          class="px-2 py-0.5 border border-gray-300 rounded text-sm"
          @click="() => zoom.scale({ scaleX: 0.8, scaleY: 0.8 })"
        >
          -
        </button>
        <button class="px-2 py-0.5 border border-gray-300 rounded text-sm" @click="zoom.reset">
          Reset
        </button>
      </div>
    </template>
    <div ref="parentRef" class="w-full bg-elevated/40 rounded-xl" style="height: 500px">
      <div v-if="width > 10 && worldData && colorScale" class="relative">
        <svg
          :ref="
            (el) => {
              zoom.containerRef = el as SVGSVGElement;
            }
          "
          :width="width"
          :height="height"
          :class="zoom.isDragging ? 'cursor-grabbing' : 'cursor-grab'"
          style="touch-action: none"
        >
          <rect x="0" y="0" :width="width" :height="height" fill="transparent" rx="14" />
          <CustomProjection
            :projection="PROJECTIONS[projection]"
            :data="worldData"
            :scale="zoom.transformMatrix.scaleX"
            :translate="[zoom.transformMatrix.translateX, zoom.transformMatrix.translateY]"
          >
            <template #default="{ path, features }">
              <g>
                <Graticule :graticule="(g) => path(g) || ''" :stroke="purple" />
                <path
                  v-for="({ feature, path: featurePath }, i) in features"
                  :key="`map-feature-${i}`"
                  :d="featurePath || ''"
                  :fill="colorScale(feature.geometry.coordinates.length)"
                  :stroke="background"
                  stroke-width="0.5"
                />
              </g>
            </template>
          </CustomProjection>
          <!-- Intercept all mouse events for pan -->
          <rect
            x="0"
            y="0"
            :width="width"
            :height="height"
            rx="14"
            fill="transparent"
            @touchstart="zoom.dragStart"
            @touchmove="zoom.dragMove"
            @touchend="zoom.dragEnd"
            @mousedown="zoom.dragStart"
            @mousemove="zoom.dragMove"
            @mouseup="zoom.dragEnd"
            @mouseleave="
              () => {
                if (zoom.isDragging) zoom.dragEnd();
              }
            "
          />
        </svg>
      </div>
    </div>
  </ExamplePage>
</template>
