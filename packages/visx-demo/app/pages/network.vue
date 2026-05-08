<template>
  <ExamplePage title="Network" :packages="['@visx-vue/network', '@visx-vue/group']">
    <div ref="parentRef" class="chart-container">
      <svg v-if="width > 0" :width="width" :height="height">
        <rect :width="width" :height="height" :rx="14" fill="#272b4d" />
        <Graph :graph="graph" :top="20" :left="100">
          <template #node="{ node }">
            <DefaultNode :fill="node.color || '#21D4FD'" />
          </template>
          <template #link="{ link }">
            <line
              :x1="link.source.x"
              :y1="link.source.y"
              :x2="link.target.x"
              :y2="link.target.y"
              :stroke-width="2"
              stroke="#999"
              :stroke-opacity="0.6"
              :stroke-dasharray="link.dashed ? '8,4' : undefined"
            />
          </template>
        </Graph>
      </svg>
    </div>
  </ExamplePage>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { Graph, DefaultNode } from "@visx-vue/network";
import { useParentSize } from "@visx-vue/responsive";

useHead({ title: "Network — visx-vue" });

const { parentRef, width } = useParentSize({ debounceTime: 0 });
const height = computed(() => Math.round(width.value * 0.5) || 300);

interface CustomNode {
  x: number;
  y: number;
  color?: string;
}
interface CustomLink {
  source: CustomNode;
  target: CustomNode;
  dashed?: boolean;
}

const nodes: CustomNode[] = [
  { x: 50, y: 20 },
  { x: 200, y: 250 },
  { x: 300, y: 40, color: "#26deb0" },
];

const links: CustomLink[] = [
  { source: nodes[0], target: nodes[1] },
  { source: nodes[1], target: nodes[2] },
  { source: nodes[2], target: nodes[0], dashed: true },
];

const graph = { nodes, links };
</script>

<style scoped>
.chart-container {
  width: 100%;
  min-height: 300px;
}
</style>
