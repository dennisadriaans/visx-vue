<template>
  <ExamplePage
    title="Legends"
    :packages="['@visx-vue/legend', '@visx-vue/scale', '@visx-vue/glyph']"
  >
    <div class="legends-wrapper">
      <div class="legend-row">
        <div class="legend-box">
          <div class="legend-title">Size</div>
          <LegendSize :scale="sizeScale">
            <template #default="{ labels }">
              <LegendItem
                v-for="label in labels"
                :key="`size-${label.text}`"
                style="cursor: pointer"
                @click="alert(`clicked: ${JSON.stringify(label)}`)"
              >
                <svg
                  :width="sizeScale(label.datum) ?? 0"
                  :height="sizeScale(label.datum) ?? 0"
                  style="margin: 5px 0"
                >
                  <circle
                    :fill="sizeColorScale(label.datum)"
                    :r="(sizeScale(label.datum) ?? 0) / 2"
                    :cx="(sizeScale(label.datum) ?? 0) / 2"
                    :cy="(sizeScale(label.datum) ?? 0) / 2"
                  />
                </svg>
                <LegendLabel align="left" margin="0 4px">{{ label.text }}</LegendLabel>
              </LegendItem>
            </template>
          </LegendSize>
        </div>

        <div class="legend-box">
          <div class="legend-title">Quantile</div>
          <LegendQuantile :scale="quantileScale">
            <template #default="{ labels }">
              <LegendItem
                v-for="(label, i) in labels"
                :key="`quantile-${i}`"
                style="cursor: pointer"
                @click="alert(`clicked: ${JSON.stringify(label)}`)"
              >
                <svg :width="glyphSize" :height="glyphSize" style="margin: 2px 0">
                  <circle
                    :fill="label.value"
                    :r="glyphSize / 2"
                    :cx="glyphSize / 2"
                    :cy="glyphSize / 2"
                  />
                </svg>
                <LegendLabel align="left" margin="0 4px">{{ label.text }}</LegendLabel>
              </LegendItem>
            </template>
          </LegendQuantile>
        </div>

        <div class="legend-box">
          <div class="legend-title">Linear</div>
          <LegendLinear
            :scale="linearScale"
            :label-format="(d, i) => (i % 2 === 0 ? d.toFixed(1) : '')"
          >
            <template #default="{ labels }">
              <LegendItem
                v-for="(label, i) in labels"
                :key="`linear-${i}`"
                style="cursor: pointer"
                @click="alert(`clicked: ${JSON.stringify(label)}`)"
              >
                <svg :width="glyphSize" :height="glyphSize" style="margin: 2px 0">
                  <circle
                    :fill="label.value"
                    :r="glyphSize / 2"
                    :cx="glyphSize / 2"
                    :cy="glyphSize / 2"
                  />
                </svg>
                <LegendLabel align="left" margin="0 4px">{{ label.text }}</LegendLabel>
              </LegendItem>
            </template>
          </LegendLinear>
        </div>

        <div class="legend-box">
          <div class="legend-title">Threshold</div>
          <LegendThreshold :scale="thresholdScale">
            <template #default="{ labels }">
              <LegendItem
                v-for="(label, i) in [...labels].reverse()"
                :key="`threshold-${i}`"
                margin="1px 0"
                style="cursor: pointer"
                @click="alert(`clicked: ${JSON.stringify(label)}`)"
              >
                <svg :width="glyphSize" :height="glyphSize">
                  <rect :fill="label.value" :width="glyphSize" :height="glyphSize" />
                </svg>
                <LegendLabel align="left" margin="2px 0 0 10px">{{ label.text }}</LegendLabel>
              </LegendItem>
            </template>
          </LegendThreshold>
        </div>

        <div class="legend-box">
          <div class="legend-title">Ordinal</div>
          <LegendOrdinal :scale="ordinalColorScale" :label-format="(label) => label.toUpperCase()">
            <template #default="{ labels }">
              <div style="display: flex; flex-direction: row">
                <LegendItem
                  v-for="(label, i) in labels"
                  :key="`ordinal-${i}`"
                  margin="0 5px"
                  style="cursor: pointer"
                  @click="alert(`clicked: ${JSON.stringify(label)}`)"
                >
                  <svg :width="glyphSize" :height="glyphSize">
                    <rect :fill="label.value" :width="glyphSize" :height="glyphSize" />
                  </svg>
                  <LegendLabel align="left" margin="0 0 0 4px">{{ label.text }}</LegendLabel>
                </LegendItem>
              </div>
            </template>
          </LegendOrdinal>
        </div>
      </div>
    </div>
  </ExamplePage>
</template>

<script setup lang="ts">import { scaleLinear, scaleOrdinal, scaleThreshold, scaleQuantile } from "@visx-vue/scale";
import {
  LegendLinear,
  LegendQuantile,
  LegendOrdinal,
  LegendSize,
  LegendThreshold,
  LegendItem,
  LegendLabel,
} from "@visx-vue/legend";

useHead({ title: "Legends — visx-vue" });

const glyphSize = 15;

const sizeScale = scaleLinear<number>({ domain: [0, 10], range: [5, 13] });
const sizeColorScale = scaleLinear<string>({ domain: [0, 10], range: ["#75fcfc", "#3236b8"] });
const quantileScale = scaleQuantile<string>({
  domain: [0, 0.15],
  range: ["#eb4d70", "#f19938", "#6ce18b", "#78f6ef", "#9096f8"],
});
const linearScale = scaleLinear<string>({ domain: [0, 10], range: ["#ed4fbb", "#e9a039"] });
const thresholdScale = scaleThreshold<number, string>({
  domain: [0.01, 0.02, 0.04, 0.06, 0.08],
  range: ["#f2f0f7", "#dadaeb", "#bcbddc", "#9e9ac8", "#756bb1", "#54278f"],
});
const ordinalColorScale = scaleOrdinal<string, string>({
  domain: ["a", "b", "c", "d"],
  range: ["#66d981", "#71f5ef", "#4899f1", "#7d81f6"],
});
</script>

<style scoped>
.legends-wrapper {
  font-family: Arial, sans-serif;
  font-weight: 900;
  background-color: black;
  border-radius: 14px;
  padding: 24px;
}
.legend-row {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: flex-start;
}
.legend-box {
  line-height: 0.9em;
  color: #efefef;
  font-size: 10px;
  padding: 10px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 8px;
}
.legend-title {
  font-size: 12px;
  margin-bottom: 10px;
  font-weight: 100;
}
</style>
