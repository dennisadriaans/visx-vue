<template>
  <ExamplePage
    title="Zoom I"
    :packages="['@visx-vue/zoom', '@visx-vue/clip-path', '@visx-vue/scale', '@visx-vue/mock-data']"
  >
    <div ref="parentRef" class="chart-container">
      <div v-if="width > 0" style="position: relative">
        <svg
          :width="width"
          :height="height"
          :style="{ cursor: zoom.isDragging ? 'grabbing' : 'grab', touchAction: 'none' }"
          :ref="
            (el) => {
              zoom.containerRef = el;
            }
          "
        >
          <RectClipPath id="zoom-clip" :width="width" :height="height" />
          <rect :width="width" :height="height" :rx="14" fill="#0a0a0a" />
          <g :transform="zoom.toString()">
            <circle
              v-for="({ x, y }, i) in phyllotaxis"
              :key="`dot-${i}`"
              :cx="x"
              :cy="y"
              :r="i > 500 ? sizeScale(1000 - i) : sizeScale(i)"
              :fill="rainbowColor(i / 1000)"
            />
          </g>
          <!-- minimap -->
          <g
            v-if="showMiniMap"
            clip-path="url(#zoom-clip)"
            :transform="`scale(0.25) translate(${width * 4 - width - 60}, ${height * 4 - height - 60})`"
          >
            <rect :width="width" :height="height" fill="#1a1a1a" />
            <circle
              v-for="({ x, y }, i) in phyllotaxis"
              :key="`dot-sm-${i}`"
              :cx="x"
              :cy="y"
              :r="i > 500 ? sizeScale(1000 - i) : sizeScale(i)"
              :fill="rainbowColor(i / 1000)"
            />
            <rect
              :width="width"
              :height="height"
              fill="white"
              fill-opacity="0.2"
              stroke="white"
              stroke-width="4"
              :transform="zoom.toStringInvert()"
            />
          </g>
        </svg>
        <div class="controls">
          <button class="btn btn-zoom" @click="zoom.scale({ scaleX: 1.2, scaleY: 1.2 })">+</button>
          <button class="btn btn-zoom btn-bottom" @click="zoom.scale({ scaleX: 0.8, scaleY: 0.8 })">
            -
          </button>
          <button class="btn btn-lg" @click="zoom.center()">Center</button>
          <button class="btn btn-lg" @click="zoom.reset()">Reset</button>
          <button class="btn btn-lg" @click="zoom.clear()">Clear</button>
        </div>
        <div class="mini-map-toggle">
          <button class="btn btn-lg" @click="showMiniMap = !showMiniMap">
            {{ showMiniMap ? "Hide" : "Show" }} Mini Map
          </button>
        </div>
      </div>
    </div>
  </ExamplePage>
</template>

<script setup lang="ts">
import { useZoom } from "@visx-vue/zoom";
import { RectClipPath } from "@visx-vue/clip-path";
import { scaleLinear } from "@visx-vue/scale";
import { genPhyllotaxis } from "@visx-vue/mock-data";
import type { GenPhyllotaxisFunction, PhyllotaxisPoint } from "@visx-vue/mock-data";
import { useParentSize } from "@visx-vue/responsive";

useHead({ title: "Zoom I — visx-vue" });

const { parentRef, width } = useParentSize({ debounceTime: 0 });
const height = computed(() => Math.round(width.value * 0.6) || 400);

const showMiniMap = ref(true);

const colorScale = scaleLinear<number>({ range: [0, 1], domain: [0, 1000] });
const sizeScale = scaleLinear<number>({ domain: [0, 600], range: [0.5, 8] });

function rainbowColor(t: number): string {
  const h = t * 360;
  return `hsl(${h}, 100%, 55%)`;
}

const phyllotaxis = computed<PhyllotaxisPoint[]>(() => {
  const gen: GenPhyllotaxisFunction = genPhyllotaxis({
    radius: 10,
    width: width.value,
    height: height.value,
  });
  return new Array(1000).fill(null).map((_, i) => gen(i));
});

const zoom = useZoom<SVGSVGElement>({
  get width() {
    return width.value;
  },
  get height() {
    return height.value;
  },
  scaleXMin: 0.5,
  scaleXMax: 4,
  scaleYMin: 0.5,
  scaleYMax: 4,
  initialTransformMatrix: {
    scaleX: 1.27,
    scaleY: 1.27,
    translateX: -211.62,
    translateY: 162.59,
    skewX: 0,
    skewY: 0,
  },
});
</script>

<style scoped>
.chart-container {
  width: 100%;
  min-height: 400px;
}
.controls {
  position: absolute;
  top: 15px;
  right: 15px;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}
.mini-map-toggle {
  position: absolute;
  bottom: 25px;
  right: 15px;
}
.btn {
  display: block;
  margin: 0;
  text-align: center;
  border: none;
  background: #2f2f2f;
  color: #888;
  padding: 0 4px;
  border-top: 1px solid #0a0a0a;
  cursor: pointer;
}
.btn-lg {
  font-size: 12px;
  line-height: 1;
  padding: 4px;
}
.btn-zoom {
  width: 26px;
  font-size: 22px;
}
.btn-bottom {
  margin-bottom: 1rem;
}
</style>
