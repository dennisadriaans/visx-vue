<script setup lang="ts">
import { computed, ref } from "vue";
import { Sankey, sankeyCenter, sankeyRight, sankeyLeft, sankeyJustify } from "@visx-vue/sankey";
import { Group } from "@visx-vue/group";
import { BarRounded, LinkHorizontal } from "@visx-vue/shape";
import { useTooltip, TooltipWithBounds } from "@visx-vue/tooltip";
import { useParentSize } from "@visx-vue/responsive";

const { parentRef, width, height: rawHeight } = useParentSize();
const height = computed(() => rawHeight.value || 400);

const background = "transparent";
const color = "#00DC82";
const margin = { top: 10, left: 10, right: 10, bottom: 10 };

const nodeAlignments = { sankeyCenter, sankeyJustify, sankeyLeft, sankeyRight };
type AlignmentKey = keyof typeof nodeAlignments;

const nodeAlignment = ref<AlignmentKey>("sankeyCenter");
const nodePadding = ref(10);
const nodeWidth = ref(10);

const xMax = computed(() => width.value - margin.left - margin.right);
const yMax = computed(() => height.value - margin.top - margin.bottom);

const { tooltipData, tooltipLeft, tooltipTop, tooltipOpen, showTooltip, hideTooltip } =
  useTooltip<string>();

const { data: energyData } = await useAsyncData("sankey-energy", () =>
  $fetch<{ nodes: { name: string }[]; links: { source: number; target: number; value: number }[] }>(
    "/data/energy.json",
  ),
);
</script>

<template>
  <ExamplePage
    title="Sankey"
    description="A Sankey flow diagram showing energy flows with interactive tooltips and alignment controls."
    :packages="['@visx-vue/sankey', '@visx-vue/shape', '@visx-vue/tooltip']"
  >
    <template #controls>
      <div class="flex flex-wrap gap-4 items-center">
        <span class="text-xs text-default font-medium">node alignment:</span>
        <USelect
          v-model="nodeAlignment"
          :items="Object.keys(nodeAlignments)"
          size="sm"
          @click.stop
        />
        <span class="text-xs text-default font-medium">node padding:</span>
        <UInput v-model.number="nodePadding" type="number" size="sm" class="w-20" />
        <span class="text-xs text-default font-medium">node width:</span>
        <UInput v-model.number="nodeWidth" type="number" size="sm" class="w-20" />
      </div>
    </template>
    <div ref="parentRef" class="w-full bg-elevated/40 rounded-xl" style="height: 500px">
      <div
        v-if="width > 10 && energyData"
        class="relative rounded-xl"
        :style="{
          background,
          padding: `${margin.top}px ${margin.right}px ${margin.bottom}px ${margin.left}px`,
        }"
      >
        <svg :width="xMax" :height="yMax">
          <Sankey
            :root="energyData"
            :node-width="nodeWidth"
            :size="[xMax, yMax]"
            :node-padding="nodePadding"
            :node-align="nodeAlignments[nodeAlignment]"
          >
            <template #default="{ graph, createPath }">
              <Group>
                <LinkHorizontal
                  v-for="(link, i) in graph.links"
                  :key="`link-${i}`"
                  class="visx-sankey-link"
                  :data="link"
                  :path="createPath"
                  fill="transparent"
                  :stroke="color"
                  :stroke-width="link.width"
                  stroke-opacity="0.5"
                  @pointermove="
                    (event: PointerEvent) => {
                      const src = link.source as { name?: string };
                      const tgt = link.target as { name?: string };
                      showTooltip({
                        tooltipData: `${src.name} > ${tgt.name} = ${link.value}`,
                        tooltipTop: event.offsetY + 10,
                        tooltipLeft: event.offsetX + 10,
                      });
                    }
                  "
                  @mouseout="hideTooltip"
                />
              </Group>
              <Group>
                <BarRounded
                  v-for="(node, i) in graph.nodes"
                  :key="`node-${i}`"
                  class="visx-sankey-node"
                  :width="(node.x1 ?? 0) - (node.x0 ?? 0)"
                  :height="(node.y1 ?? 0) - (node.y0 ?? 0)"
                  :x="node.x0 ?? 0"
                  :y="node.y0 ?? 0"
                  :radius="3"
                  :all="true"
                  :fill="color"
                  @pointermove="
                    (event: PointerEvent) =>
                      showTooltip({
                        tooltipData: node.name,
                        tooltipTop: event.offsetY + 10,
                        tooltipLeft: event.offsetX + 10,
                      })
                  "
                  @mouseout="hideTooltip"
                />
              </Group>
            </template>
          </Sankey>
        </svg>
        <TooltipWithBounds
          v-if="tooltipOpen"
          :key="Math.random()"
          :top="tooltipTop"
          :left="tooltipLeft"
        >
          {{ tooltipData }}
        </TooltipWithBounds>
      </div>
    </div>
  </ExamplePage>
</template>

<style scoped>
.visx-sankey-link:hover {
  stroke-opacity: 0.7;
}
.visx-sankey-node:hover {
  filter: brightness(1.3);
}
</style>
