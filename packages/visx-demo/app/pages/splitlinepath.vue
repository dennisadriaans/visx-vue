<script setup lang="ts">
import { computed } from "vue";
import { LinePath, SplitLinePath } from "@visx-vue/shape";
import { LinearGradient } from "@visx-vue/gradient";
import { curveCardinal } from "@visx-vue/curve";
import { useParentSize } from "@visx-vue/responsive";

type Point = { x: number; y: number };

const { parentRef, width, height: rawHeight } = useParentSize();
const height = computed(() => rawHeight.value || 400);

const background = "#045275";
const backgroundLight = "#089099";
const foreground = "#b7e6a5";
const PADDING = 30;
const numberOfWaves = 10;
const pointsPerWave = 100;

function generateSinPoints(w: number, h: number, waves: number, ppw: number): Point[] {
  const waveLength = w / waves;
  const distBetween = waveLength / ppw;
  const points: Point[] = [];
  for (let wi = 0; wi < waves; wi++) {
    const waveDistFromStart = wi * waveLength;
    for (let pi = 0; pi <= ppw; pi++) {
      const waveXFraction = pi / ppw;
      const globalX = waveDistFromStart + pi * distBetween;
      const globalXFraction = (w - globalX) / w;
      const waveHeight = Math.min(globalXFraction, 1 - globalXFraction) * h;
      points.push({ x: globalX, y: waveHeight * Math.sin(waveXFraction * (2 * Math.PI)) });
    }
  }
  return points;
}

function generateSegments(w: number, h: number, waves: number, ppw: number): Point[][] {
  const pts = generateSinPoints(w, h, waves, ppw);
  const segments: Point[][] = Array.from({ length: waves }, () => []);
  const segSize = w / waves;
  pts.forEach((d) => {
    segments[Math.min(Math.floor(d.x / segSize), segments.length - 1)].push(d);
  });
  return segments;
}

const getX = (d: Point) => d.x;
const getY = (d: Point) => d.y;

const segmentStyles = [
  { stroke: foreground, strokeWidth: 3 },
  { stroke: "#fff", strokeWidth: 2, strokeDasharray: "9,5" },
  { stroke: background, strokeWidth: 2 },
];

const segW = computed(() => width.value / 2 - PADDING * 2);
const segH = computed(() => height.value / 2 - PADDING * 2);

const segments = computed(() =>
  generateSegments(segW.value, segH.value, numberOfWaves, pointsPerWave),
);
const allPoints = computed(() => segments.value.flat());
</script>

<template>
  <ExamplePage
    title="Split Line Path"
    description="Demonstrates SplitLinePath rendering a single line as multiple styled segments."
    :packages="['@visx-vue/shape', '@visx-vue/gradient', '@visx-vue/curve']"
  >
    <div ref="parentRef" class="w-full" style="height: 500px">
      <svg v-if="width > 10" :width="width" :height="height">
        <LinearGradient
          id="splitlinepath-gradient"
          :from="background"
          :to="backgroundLight"
          :from-opacity="0.8"
          :to-opacity="0.8"
        />
        <rect
          x="0"
          y="0"
          :width="width"
          :height="height"
          fill="url(#splitlinepath-gradient)"
          rx="14"
        />

        <!-- Background ghost line -->
        <g :transform="`translate(${PADDING}, ${height / 4})`">
          <LinePath
            :data="allPoints"
            :x="getX"
            :y="getY"
            stroke-width="8"
            stroke="#fff"
            stroke-opacity="0.15"
            :curve="curveCardinal"
          />
          <SplitLinePath
            :sample-rate="2"
            :segments="segments"
            segmentation="x"
            :x="getX"
            :y="getY"
            :curve="curveCardinal"
            :styles="segmentStyles"
          >
            <template #default="{ segment, styles, index }">
              <g v-if="index === numberOfWaves - 1 || index === 2">
                <circle
                  v-for="(pt, pi) in segment"
                  v-if="pi % 8 === 0"
                  :key="pi"
                  :cx="pt.x"
                  :cy="pt.y"
                  :r="10 * (pi / segment.length)"
                  :stroke="styles?.stroke"
                  fill="transparent"
                  stroke-width="1"
                />
              </g>
              <LinePath v-else :data="segment" :x="getX" :y="getY" v-bind="styles" />
            </template>
          </SplitLinePath>
          <text dy="0.3em" font-size="10" font-weight="bold" text-anchor="middle" fill="#fff">
            Start
          </text>
        </g>
      </svg>
    </div>
  </ExamplePage>
</template>
