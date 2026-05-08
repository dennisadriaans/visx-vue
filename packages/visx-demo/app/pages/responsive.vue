<script setup lang="ts">
import { computed, ref } from "vue";
import { Group } from "@visx-vue/group";
import { LinePath } from "@visx-vue/shape";
import { genDateValue } from "@visx-vue/mock-data";
import { scaleTime, scaleLinear } from "@visx-vue/scale";
import { extent, max } from "@visx-vue/vendor/d3-array";
import { ParentSize } from "@visx-vue/responsive";

type DateValue = { date: Date; value: number };

const lineCount = 12;
const series = Array.from({ length: lineCount }, (_, i) => genDateValue(25, i / 47));
const allData = series.flat();

const getX = (d: DateValue) => d.date;
const getY = (d: DateValue) => d.value;

const xScaleBase = scaleTime<number>({
  domain: extent(allData, getX) as [Date, Date],
});
const yScaleBase = scaleLinear<number>({
  domain: [0, max(allData, getY) as number],
});

const showSidebar = ref(true);

function LinesChart(width: number, height: number) {
  const lineHeight = height / lineCount;
  xScaleBase.range([0, width]);
  yScaleBase.range([lineHeight, 0]);
  return { lineHeight };
}
</script>

<template>
  <ExamplePage
    title="Responsive"
    description="Demonstrates ParentSize for responsive charts that adapt to container dimensions."
    :packages="['@visx-vue/responsive', '@visx-vue/shape', '@visx-vue/scale']"
  >
    <div class="flex border border-gray-200 rounded overflow-hidden" style="height: 500px">
      <div v-if="showSidebar" class="flex-none w-40 border-r border-gray-200 p-4">
        <ul class="space-y-2 text-sm">
          <li>🤖</li>
          <li>Home</li>
          <li>Profile</li>
          <li>Favorites</li>
          <li>Settings</li>
        </ul>
      </div>
      <div class="flex flex-col flex-1 overflow-hidden p-4 gap-2">
        <div>
          <button
            class="px-3 py-1 text-sm border border-gray-300 rounded"
            @click="showSidebar = !showSidebar"
          >
            toggle nav
          </button>
        </div>
        <div class="flex-1 overflow-hidden bg-[#222] rounded">
          <ParentSize>
            <template #default="{ width: visWidth, height: visHeight }">
              <svg :width="visWidth" :height="visHeight">
                <template v-if="visWidth > 8">
                  <Group
                    v-for="(lineData, i) in series"
                    :key="`lines-${i}`"
                    :top="i * (visHeight / lineCount)"
                  >
                    <LinePath
                      :data="lineData"
                      :x="
                        (d: DateValue) => {
                          xScaleBase.range([0, visWidth]);
                          return xScaleBase(getX(d)) ?? 0;
                        }
                      "
                      :y="
                        (d: DateValue) => {
                          yScaleBase.range([visHeight / lineCount, 0]);
                          return yScaleBase(getY(d)) ?? 0;
                        }
                      "
                      stroke="#ffffff"
                      stroke-width="1.5"
                      shape-rendering="geometricPrecision"
                    />
                  </Group>
                </template>
              </svg>
            </template>
          </ParentSize>
        </div>
      </div>
    </div>
  </ExamplePage>
</template>
