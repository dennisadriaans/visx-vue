<template>
  <ExamplePage
    title="Calendar Heatmap"
    :packages="['@visx-vue/shape', '@visx-vue/group', '@visx-vue/scale', '@visx-vue/tooltip']"
  >
    <div ref="parentRef" class="chart-container bg-white rounded-lg p-6 shadow-sm border border-gray-100">
      <div class="mb-6 flex items-center justify-between">
        <h2 class="text-lg font-semibold text-gray-800">Yearly Contributions</h2>
        <div class="flex items-center gap-2 text-xs text-gray-500">
          <span>Less</span>
          <div v-for="color in colorRange" :key="color" :style="{ backgroundColor: color }" class="w-3 h-3 rounded-sm" />
          <span>More</span>
        </div>
      </div>

      <svg v-if="width > 0" :width="width" :height="height">
        <Group :left="margin.left" :top="margin.top">
          <!-- Day Labels -->
          <text
            v-for="(day, i) in ['Mon', 'Wed', 'Fri']"
            :key="day"
            :x="-10"
            :y="((i * 2 + 1) * (cellSize + cellPadding)) + cellSize / 2"
            text-anchor="end"
            alignment-baseline="middle"
            class="text-[10px] fill-gray-400"
          >
            {{ day }}
          </text>

          <!-- Month Labels -->
          <text
            v-for="month in monthLabels"
            :key="month.name"
            :x="month.x"
            :y="-10"
            class="text-[10px] fill-gray-400 font-medium"
          >
            {{ month.name }}
          </text>

          <!-- Contribution Rects -->
          <Bar
            v-for="d in data"
            :key="d.date.toISOString()"
            :width="cellSize"
            :height="cellSize"
            :x="d.week * (cellSize + cellPadding)"
            :y="d.day * (cellSize + cellPadding)"
            :fill="colorScale(d.count)"
            :rx="2"
            class="cursor-pointer transition-opacity hover:opacity-80"
            @mousemove="(e) => handleMouseMove(e, d)"
            @mouseleave="hideTooltip"
          />
        </Group>
      </svg>

      <TooltipWithBounds
        v-if="tooltipOpen && tooltipData"
        :key="Math.random()"
        :top="tooltipTop"
        :left="tooltipLeft"
        class="tooltip-container"
      >
        <div class="text-xs font-medium">
          {{ tooltipData.count }} contributions
        </div>
        <div class="text-[10px] text-gray-500">
          {{ formatDate(tooltipData.date) }}
        </div>
      </TooltipWithBounds>
    </div>
  </ExamplePage>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { Group } from "@visx-vue/group";
import { Bar } from "@visx-vue/shape";
import { scaleThreshold } from "@visx-vue/scale";
import { useTooltip, TooltipWithBounds } from "@visx-vue/tooltip";
import { localPoint } from "@visx-vue/event";
import { useParentSize } from "@visx-vue/responsive";
import { timeFormat } from "@visx-vue/vendor/d3-time-format";

useHead({ title: "Calendar Heatmap — visx-vue" });

const { parentRef, width } = useParentSize({ debounceTime: 0 });
const margin = { top: 40, left: 40, right: 20, bottom: 20 };
const cellSize = 14;
const cellPadding = 4;
const height = computed(() => 7 * (cellSize + cellPadding) + margin.top + margin.bottom);

// GitHub-style contribution colors
const colorRange = ["#ebedf0", "#9be9a8", "#40c463", "#30a14e", "#216e39"];
const colorScale = scaleThreshold<number, string>({
  domain: [1, 10, 20, 30],
  range: colorRange,
});

interface Datum {
  date: Date;
  count: number;
  week: number;
  day: number;
}

// Generate data for the last 365 days
const data = computed(() => {
  const result: Datum[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const start = new Date(today);
  start.setDate(start.getDate() - 364);
  // Adjust to start on the beginning of the week (Sunday = 0)
  start.setDate(start.getDate() - start.getDay());

  let current = new Date(start);
  while (current <= today) {
    const diffDays = Math.floor((current.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    const week = Math.floor(diffDays / 7);
    const day = current.getDay();

    result.push({
      date: new Date(current),
      count: Math.floor(Math.random() * 50), // Random contributions
      week,
      day,
    });
    current.setDate(current.getDate() + 1);
  }
  return result;
});

// Month labels based on the data
const monthLabels = computed(() => {
  const labels: { name: string; x: number }[] = [];
  let lastMonth = -1;

  data.value.forEach((d) => {
    const month = d.date.getMonth();
    if (month !== lastMonth) {
      labels.push({
        name: timeFormat("%b")(d.date),
        x: d.week * (cellSize + cellPadding),
      });
      lastMonth = month;
    }
  });

  return labels;
});

const formatDate = timeFormat("%B %d, %Y");

const {
  tooltipOpen,
  tooltipLeft,
  tooltipTop,
  tooltipData,
  showTooltip,
  hideTooltip,
} = useTooltip<Datum>();

function handleMouseMove(event: MouseEvent | TouchEvent, datum: Datum) {
  const coords = localPoint(event);
  if (!coords) return;

  showTooltip({
    tooltipData: datum,
    tooltipTop: coords.y,
    tooltipLeft: coords.x,
  });
}
</script>

<style scoped>
.chart-container {
  width: 100%;
  overflow-x: auto;
}

.tooltip-container {
  background: white;
  color: #1f2937;
  padding: 8px 12px;
  border-radius: 6px;
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  border: 1px solid #f3f4f6;
  pointer-events: none;
}
</style>
