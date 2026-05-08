<template>
  <ExamplePage
    title="Dendrograms"
    :packages="['@visx-vue/hierarchy', '@visx-vue/shape', '@visx-vue/gradient', '@visx-vue/group']"
  >
    <div ref="parentRef" class="chart-container bg-elevated/40 rounded-xl">
      <svg v-if="width > 0" :width="width" :height="height">
        <LinearGradient id="dendrogram-top" from="#00DC82" to="#00b368" />
        <rect :width="width" :height="height" :rx="14" fill="transparent" />
        <Cluster :root="clusterRoot" :size="[xMax, yMax]">
          <template #default="{ cluster }">
            <Group :top="margin.top" :left="margin.left">
              <LinkVertical
                v-for="(link, i) in cluster.links()"
                :key="`cluster-link-${i}`"
                :data="link"
                stroke="#00DC82"
                stroke-width="1"
                :stroke-opacity="0.2"
                fill="none"
              />
              <template v-for="(node, i) in cluster.descendants()" :key="`cluster-node-${i}`">
                <!-- root node -->
                <Group v-if="node.depth === 0" :top="node.y" :left="node.x">
                  <rect :width="40" :height="20" :y="-10" :x="-20" fill="url(#dendrogram-top)" />
                  <text
                    dy=".33em"
                    font-size="9"
                    font-family="Arial"
                    text-anchor="middle"
                    pointer-events="none"
                    fill="#ffffff"
                  >
                    {{ node.data.name }}
                  </text>
                </Group>
                <!-- non-root -->
                <Group v-else :top="node.y" :left="node.x">
                  <circle
                    r="12"
                    fill="#ffffff"
                    :stroke="node.children ? '#00DC82' : '#33e394'"
                    style="cursor: pointer"
                    @click="() => alert(`clicked: ${node.data.name}`)"
                  />
                  <text
                    dy=".33em"
                    font-size="9"
                    font-family="Arial"
                    text-anchor="middle"
                    pointer-events="none"
                    :fill="node.children ? '#ffffff' : '#33e394'"
                  >
                    {{ node.data.name }}
                  </text>
                </Group>
              </template>
            </Group>
          </template>
        </Cluster>
      </svg>
    </div>
  </ExamplePage>
</template>

<script setup lang="ts">import { computed } from "vue";
import { Group } from "@visx-vue/group";
import { Cluster, hierarchy } from "@visx-vue/hierarchy";
import { LinkVertical } from "@visx-vue/shape";
import { LinearGradient } from "@visx-vue/gradient";
import { useParentSize } from "@visx-vue/responsive";

useHead({ title: "Dendrograms — visx-vue" });

const { parentRef, width } = useParentSize({ debounceTime: 0 });
const height = computed(() => Math.round(width.value * 0.6) || 400);

const margin = { top: 40, left: 0, right: 0, bottom: 40 };

interface NodeShape {
  name: string;
  children?: NodeShape[];
}

const clusterData: NodeShape = {
  name: "$",
  children: [
    {
      name: "A",
      children: [{ name: "A1" }, { name: "A2" }, { name: "C", children: [{ name: "C1" }] }],
    },
    { name: "B", children: [{ name: "B1" }, { name: "B2" }, { name: "B3" }] },
    { name: "X", children: [{ name: "Z" }] },
  ],
};

const clusterRoot = hierarchy(clusterData);

const xMax = computed(() => width.value - margin.left - margin.right);
const yMax = computed(() => height.value - margin.top - margin.bottom);
</script>

<style scoped>
.chart-container {
  width: 100%;
  min-height: 400px;
}
</style>
