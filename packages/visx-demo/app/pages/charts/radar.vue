<script setup lang="ts">
import { computed } from "vue";
import { Group } from "@visx-vue/group";
import { letterFrequency } from "@visx-vue/mock-data";
import { scaleLinear } from "@visx-vue/scale";
import { Line, LineRadial } from "@visx-vue/shape";
import { useParentSize } from "@visx-vue/responsive";
import { useTooltip, Tooltip, defaultStyles } from "@visx-vue/tooltip";

const { parentRef, width, height: rawHeight } = useParentSize();
const height = computed(() => rawHeight.value || 400);

const { tooltipOpen, tooltipLeft, tooltipTop, tooltipData, hideTooltip, showTooltip } =
  useTooltip<(typeof data)[0]>();

function handleMouseMove(event: MouseEvent, datum: (typeof data)[0]) {
  const target = event.currentTarget as SVGElement;
  const rect = target.closest("svg")!.getBoundingClientRect();
  showTooltip({
    tooltipData: datum,
    tooltipTop: event.clientY - rect.top + 10,
    tooltipLeft: event.clientX - rect.left + 10,
  });
}

const orange = "#00DC82";
const pumpkin = "#00b368";
const silver = "#ffffff33";
const background = "transparent";
const degrees = 360;
const levels = 5;
const margin = { top: 40, left: 80, right: 80, bottom: 80 };

const data = letterFrequency.slice(2, 12);
const getY = (d: (typeof data)[0]) => d.frequency;

function genAngles(length: number) {
  return Array.from({ length: length + 1 }, (_, i) => ({
    angle: i * (degrees / length) + (length % 2 === 0 ? 0 : degrees / length / 2),
  }));
}

function genPoints(length: number, radius: number) {
  const step = (Math.PI * 2) / length;
  return Array.from({ length }, (_, i) => ({
    x: radius * Math.sin(i * step),
    y: radius * Math.cos(i * step),
  }));
}

function genPolygonPoints(dataArray: typeof data, scale: (n: number) => number) {
  const step = (Math.PI * 2) / dataArray.length;
  const points: { x: number; y: number }[] = [];
  let pointString = "";
  for (let i = 1; i <= dataArray.length; i++) {
    const xVal = scale(getY(dataArray[i - 1])) * Math.sin(i * step);
    const yVal = scale(getY(dataArray[i - 1])) * Math.cos(i * step);
    points.push({ x: xVal, y: yVal });
    pointString += `${xVal},${yVal} `;
  }
  return { points, pointString };
}

const radius = computed(() => {
  const xMax = width.value - margin.left - margin.right;
  const yMax = height.value - margin.top - margin.bottom;
  return Math.min(xMax, yMax) / 2;
});

const radialScale = computed(() =>
  scaleLinear<number>({ range: [0, Math.PI * 2], domain: [degrees, 0] }),
);

const yScale = computed(() =>
  scaleLinear<number>({ range: [0, radius.value], domain: [0, Math.max(...data.map(getY))] }),
);

const webs = computed(() => genAngles(data.length));
const points = computed(() => genPoints(data.length, radius.value));
const polygonPoints = computed(() => genPolygonPoints(data, (d) => yScale.value(d) ?? 0));
const zeroPoint = { x: 0, y: 0 };
</script>

<template>
  <ExamplePage
    title="Radar"
    description="A radar chart using LineRadial and custom polygon points to visualize letter frequencies."
    :packages="['@visx-vue/shape', '@visx-vue/scale', '@visx-vue/mock-data']"
  >
    <div ref="parentRef" class="w-full bg-elevated/40 rounded-xl" style="height: 500px">
      <div style="position: relative">
        <svg v-if="width > 10" :width="width" :height="height">
          <rect :fill="background" :width="width" :height="height" rx="14" />
          <Group :top="height / 2 - margin.top" :left="width / 2">
            <LineRadial
              v-for="i in levels"
              :key="`web-${i}`"
              :data="webs"
              :angle="(d: { angle: number }) => radialScale(d.angle) ?? 0"
              :radius="(i * radius) / levels"
              fill="none"
              :stroke="silver"
              stroke-width="2"
              stroke-opacity="0.8"
              stroke-linecap="round"
            />
            <Line
              v-for="(pt, i) in points"
              :key="`radar-line-${i}`"
              :from="zeroPoint"
              :to="pt"
              :stroke="silver"
            />
            <polygon
              :points="polygonPoints.pointString"
              :fill="orange"
              fill-opacity="0.3"
              :stroke="orange"
              stroke-width="1"
            />
            <circle
              v-for="(point, i) in polygonPoints.points"
              :key="`radar-point-${i}`"
              :cx="point.x"
              :cy="point.y"
              r="4"
              :fill="tooltipData?.letter === data[i].letter ? 'white' : pumpkin"
              :stroke="tooltipData?.letter === data[i].letter ? pumpkin : 'none'"
              :stroke-width="tooltipData?.letter === data[i].letter ? 2 : 0"
              @mousemove="(e) => handleMouseMove(e, data[i])"
              @mouseleave="hideTooltip"
            />
          </Group>
        </svg>
        <Tooltip
          v-if="tooltipOpen && tooltipData"
          :top="tooltipTop"
          :left="tooltipLeft"
          :style="{ ...defaultStyles, backgroundColor: '#283238', color: 'white' }"
        >
          <strong>{{ tooltipData.letter }}</strong>
          <div>{{ (tooltipData.frequency * 100).toFixed(2) }}%</div>
        </Tooltip>
      </div>
    </div>
  </ExamplePage>
</template>
