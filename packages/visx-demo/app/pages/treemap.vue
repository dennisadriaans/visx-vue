<template>
  <ExamplePage
    title="Treemap"
    :packages="['@visx-vue/hierarchy', '@visx-vue/group', '@visx-vue/scale']"
  >
    <div ref="parentRef" class="chart-container">
      <div v-if="width > 0">
        <div class="controls">
          <label>tile method: </label>
          <select v-model="tileMethod">
            <option v-for="tile in tileKeys" :key="tile" :value="tile">{{ tile }}</option>
          </select>
        </div>
        <svg :width="width" :height="height">
          <rect :width="width" :height="height" :rx="14" fill="#114b5f" />
          <Treemap
            :top="margin.top"
            :root="treemapRoot"
            :size="[xMax, yMax]"
            :tile="tileMethods[tileMethod]"
            :round="true"
          >
            <template #default="{ treemap }">
              <Group>
                <template
                  v-for="(node, i) in [...treemap.descendants()].reverse()"
                  :key="`node-${i}`"
                >
                  <Group :top="node.y0 + margin.top" :left="node.x0 + margin.left">
                    <rect
                      v-if="node.depth === 1"
                      :width="node.x1 - node.x0"
                      :height="node.y1 - node.y0"
                      stroke="#114b5f"
                      stroke-width="4"
                      fill="transparent"
                    />
                    <rect
                      v-else-if="node.depth > 2"
                      :width="node.x1 - node.x0"
                      :height="node.y1 - node.y0"
                      stroke="#114b5f"
                      :fill="colorScale(node.value || 0)"
                    />
                  </Group>
                </template>
              </Group>
            </template>
          </Treemap>
        </svg>
      </div>
    </div>
  </ExamplePage>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { Group } from "@visx-vue/group";
import {
  Treemap,
  hierarchy,
  stratify,
  treemapSquarify,
  treemapBinary,
  treemapDice,
  treemapResquarify,
  treemapSlice,
  treemapSliceDice,
} from "@visx-vue/hierarchy";
import { scaleLinear } from "@visx-vue/scale";
import { shakespeare } from "@visx-vue/mock-data";
import type { Shakespeare } from "@visx-vue/mock-data";
import { useParentSize } from "@visx-vue/responsive";

useHead({ title: "Treemap — visx-vue" });

const { parentRef, width } = useParentSize({ debounceTime: 0 });
const height = computed(() => Math.round(width.value * 0.6) || 400);

const margin = { top: 10, left: 10, right: 10, bottom: 10 };
const xMax = computed(() => width.value - margin.left - margin.right);
const yMax = computed(() => height.value - margin.top - margin.bottom);

const tileMethods = {
  treemapSquarify,
  treemapBinary,
  treemapDice,
  treemapResquarify,
  treemapSlice,
  treemapSliceDice,
};
const tileKeys = Object.keys(tileMethods);
const tileMethod = ref("treemapSquarify");

const colorScale = scaleLinear<string>({
  domain: [0, Math.max(...(shakespeare as Shakespeare[]).map((d) => d.size ?? 0))],
  range: ["#4281a4", "#f3e9d2"],
});

const data = stratify<Shakespeare>()
  .id((d) => d.id)
  .parentId((d) => d.parent)(shakespeare as Shakespeare[])
  .sum((d) => d.size ?? 0);

const treemapRoot = computed(() => hierarchy(data).sort((a, b) => (b.value || 0) - (a.value || 0)));
</script>

<style scoped>
.chart-container {
  width: 100%;
  min-height: 400px;
}
.controls {
  margin-bottom: 8px;
  font-size: 14px;
}
select {
  margin-left: 4px;
}
</style>
