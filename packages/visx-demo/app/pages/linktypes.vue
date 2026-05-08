<template>
  <ExamplePage
    title="Link Types"
    :packages="['@visx-vue/hierarchy', '@visx-vue/shape', '@visx-vue/gradient', '@visx-vue/group']"
  >
    <div ref="parentRef" class="chart-container">
      <div v-if="width > 0">
        <div class="controls">
          <label
            >layout:
            <select v-model="layout">
              <option v-for="l in ['cartesian', 'polar']" :key="l" :value="l">{{ l }}</option>
            </select></label
          >
          <label v-if="layout !== 'polar'"
            >orientation:
            <select v-model="orientation">
              <option v-for="o in ['horizontal', 'vertical']" :key="o" :value="o">{{ o }}</option>
            </select></label
          >
          <label
            >link:
            <select v-model="linkType">
              <option v-for="t in ['diagonal', 'step', 'curve', 'line']" :key="t" :value="t">
                {{ t }}
              </option>
            </select></label
          >
        </div>
        <svg :width="width" :height="height">
          <LinearGradient id="links-gradient" from="#fd9b93" to="#fe6e9e" />
          <rect :width="width" :height="height" :rx="14" fill="#272b4d" />
          <Group :top="margin.top" :left="margin.left">
            <Tree
              :root="treeRoot"
              :size="[sizeWidth, sizeHeight]"
              :separation="(a, b) => (a.parent === b.parent ? 1 : 0.5) / a.depth"
            >
              <template #default="{ tree }">
                <Group :top="originY" :left="originX">
                  <component
                    :is="linkComponent"
                    v-for="(link, i) in tree.links()"
                    :key="`link-${i}`"
                    :data="link"
                    stroke="rgba(254,110,158,0.6)"
                    stroke-width="1"
                    fill="none"
                  />
                  <template v-for="(node, i) in tree.descendants()" :key="`node-${i}`">
                    <Group :top="nodeTop(node)" :left="nodeLeft(node)">
                      <circle v-if="node.depth === 0" r="12" fill="url('#links-gradient')" />
                      <rect
                        v-else
                        :width="40"
                        :height="20"
                        y="-10"
                        x="-20"
                        fill="#272b4d"
                        :stroke="node.data.children ? '#03c0dc' : '#26deb0'"
                        stroke-width="1"
                        :stroke-dasharray="node.data.children ? '0' : '2,2'"
                        :stroke-opacity="node.data.children ? 1 : 0.6"
                        :rx="node.data.children ? 0 : 10"
                      />
                      <text
                        dy=".33em"
                        font-size="9"
                        font-family="Arial"
                        text-anchor="middle"
                        pointer-events="none"
                        :fill="node.depth === 0 ? '#71248e' : node.children ? 'white' : '#26deb0'"
                      >
                        {{ node.data.name }}
                      </text>
                    </Group>
                  </template>
                </Group>
              </template>
            </Tree>
          </Group>
        </svg>
      </div>
    </div>
  </ExamplePage>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { Group } from "@visx-vue/group";
import { Tree, hierarchy } from "@visx-vue/hierarchy";
import { LinearGradient } from "@visx-vue/gradient";
import {
  LinkHorizontal,
  LinkVertical,
  LinkRadial,
  LinkHorizontalStep,
  LinkVerticalStep,
  LinkRadialStep,
  LinkHorizontalCurve,
  LinkVerticalCurve,
  LinkRadialCurve,
  LinkHorizontalLine,
  LinkVerticalLine,
  LinkRadialLine,
} from "@visx-vue/shape";
import { useParentSize } from "@visx-vue/responsive";

useHead({ title: "Link Types — visx-vue" });

const { parentRef, width } = useParentSize({ debounceTime: 0 });
const height = computed(() => Math.round(width.value * 0.6) || 400);
const margin = { top: 30, left: 30, right: 30, bottom: 70 };

const layout = ref("cartesian");
const orientation = ref("horizontal");
const linkType = ref("diagonal");

interface TreeNode {
  name: string;
  isExpanded?: boolean;
  children?: TreeNode[];
}

const data: TreeNode = {
  name: "T",
  children: [
    {
      name: "A",
      children: [
        { name: "A1" },
        { name: "A2" },
        { name: "A3" },
        {
          name: "C",
          children: [
            { name: "C1" },
            { name: "D", children: [{ name: "D1" }, { name: "D2" }, { name: "D3" }] },
          ],
        },
      ],
    },
    { name: "Z" },
    { name: "B", children: [{ name: "B1" }, { name: "B2" }, { name: "B3" }] },
  ],
};

const treeRoot = hierarchy(data);

const innerWidth = computed(() => width.value - margin.left - margin.right);
const innerHeight = computed(() => height.value - margin.top - margin.bottom);

const originX = computed(() => (layout.value === "polar" ? innerWidth.value / 2 : 0));
const originY = computed(() => (layout.value === "polar" ? innerHeight.value / 2 : 0));

const sizeWidth = computed(() => {
  if (layout.value === "polar") return 2 * Math.PI;
  return orientation.value === "vertical" ? innerWidth.value : innerHeight.value;
});
const sizeHeight = computed(() => {
  if (layout.value === "polar") return Math.min(innerWidth.value, innerHeight.value) / 2;
  return orientation.value === "vertical" ? innerHeight.value : innerWidth.value;
});

const linkComponent = computed(() => {
  if (layout.value === "polar") {
    if (linkType.value === "step") return LinkRadialStep;
    if (linkType.value === "curve") return LinkRadialCurve;
    if (linkType.value === "line") return LinkRadialLine;
    return LinkRadial;
  }
  if (orientation.value === "vertical") {
    if (linkType.value === "step") return LinkVerticalStep;
    if (linkType.value === "curve") return LinkVerticalCurve;
    if (linkType.value === "line") return LinkVerticalLine;
    return LinkVertical;
  }
  if (linkType.value === "step") return LinkHorizontalStep;
  if (linkType.value === "curve") return LinkHorizontalCurve;
  if (linkType.value === "line") return LinkHorizontalLine;
  return LinkHorizontal;
});

function nodeTop(node: any) {
  if (layout.value === "polar") {
    const [, y] = polarCoords(node.x, node.y);
    return y;
  }
  return orientation.value === "vertical" ? node.y : node.x;
}
function nodeLeft(node: any) {
  if (layout.value === "polar") {
    const [x] = polarCoords(node.x, node.y);
    return x;
  }
  return orientation.value === "vertical" ? node.x : node.y;
}
function polarCoords(x: number, y: number): [number, number] {
  return [y * Math.sin(x), -y * Math.cos(x)];
}
</script>

<style scoped>
.chart-container {
  width: 100%;
  min-height: 400px;
}
.controls {
  margin-bottom: 8px;
  display: flex;
  gap: 16px;
  font-size: 14px;
  flex-wrap: wrap;
}
.controls label {
  display: flex;
  gap: 4px;
  align-items: center;
}
</style>
