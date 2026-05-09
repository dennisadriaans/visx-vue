<template>
  <ExamplePage
    back-to="/charts"
    back-label="Charts"
    title="Treemap"
    :packages="['@visx-vue/hierarchy', '@visx-vue/group', '@visx-vue/scale', '@visx-vue/mock-data']"
  >
    <div class="mb-4 flex flex-wrap gap-2 items-center">
      <UButton
        v-for="v in ['treemap', 'pack']"
        :key="v"
        :variant="variant === v ? 'solid' : 'ghost'"
        color="primary"
        size="sm"
        @click="variant = v as 'treemap' | 'pack'"
        >{{ v === "treemap" ? "Treemap" : "Pack" }}</UButton
      >
      <USelect v-if="variant === 'treemap'" v-model="tileMethod" :items="tileKeys" size="sm" />
    </div>

    <!-- Treemap -->
    <template v-if="variant === 'treemap'">
      <div ref="parentRef" class="w-full min-h-[400px] bg-elevated/40 rounded-xl">
        <svg v-if="width > 0" :width="width" :height="height">
          <rect :width="width" :height="height" fill="transparent" :rx="12" />
          <Treemap
            :top="margin.top"
            :root="treemapRoot"
            :size="[xMax, yMax]"
            :tile="tileMethods[tileMethod]"
            :round="true"
          >
            <template #default="{ data: tmData }">
              <Group>
                <template
                  v-for="(node, i) in [...tmData.descendants()].reverse()"
                  :key="`node-${i}`"
                >
                  <Group :top="node.y0 + margin.top" :left="node.x0 + margin.left">
                    <rect
                      v-if="node.depth === 1"
                      :width="node.x1 - node.x0"
                      :height="node.y1 - node.y0"
                      stroke="#00000033"
                      stroke-width="4"
                      fill="transparent"
                    />
                    <rect
                      v-else-if="node.depth > 1"
                      :width="node.x1 - node.x0"
                      :height="node.y1 - node.y0"
                      stroke="#00000033"
                      stroke-width="1"
                      :fill="treemapColor(node.value ?? 0)"
                    />
                  </Group>
                </template>
              </Group>
            </template>
          </Treemap>
        </svg>
      </div>
    </template>

    <!-- Pack -->
    <template v-else>
      <div ref="parentRef2" class="w-full min-h-[400px] bg-elevated/40 rounded-xl">
        <svg v-if="width2 > 0" :width="width2" :height="height2">
          <rect :width="width2" :height="height2" fill="transparent" :rx="12" />
          <Pack :root="packRoot" :size="[width2 * 2, height2 * 2]">
            <template #default="{ pack }">
              <Group :top="-height2 - packMargin.bottom" :left="-width2 / 2">
                <circle
                  v-for="(circle, i) in pack.descendants().slice(2)"
                  :key="`circle-${i}`"
                  :r="circle.r"
                  :cx="circle.x"
                  :cy="circle.y"
                  :fill="packColor(circle.data.radius)"
                />
              </Group>
            </template>
          </Pack>
        </svg>
      </div>
    </template>
  </ExamplePage>
</template>

<script setup lang="ts">
import { Group } from "@visx-vue/group";
import {
  Treemap,
  Pack,
  hierarchy,
  stratify,
  treemapSquarify,
  treemapBinary,
  treemapDice,
  treemapResquarify,
  treemapSlice,
  treemapSliceDice,
} from "@visx-vue/hierarchy";
import { scaleLinear, scaleQuantize } from "@visx-vue/scale";
import { shakespeare, exoplanets as rawPlanets } from "@visx-vue/mock-data";
import type { Shakespeare, Exoplanets as Datum } from "@visx-vue/mock-data";
import { useParentSize } from "@visx-vue/responsive";

useHead({ title: "Treemap — visx-vue" });

const variant = ref<"treemap" | "pack">("treemap");

// ── Treemap ──────────────────────────────────────────────────────────────────
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
type TileKey = keyof typeof tileMethods;
const tileKeys = Object.keys(tileMethods) as TileKey[];
const tileMethod = ref<TileKey>("treemapSquarify");

const treemapColor = scaleLinear<string>({
  domain: [0, Math.max(...(shakespeare as Shakespeare[]).map((d) => d.size ?? 0))],
  range: ["#0a2a1a", "#00DC82"],
});

const shakespeareData = stratify<Shakespeare>()
  .id((d) => d.id)
  .parentId((d) => d.parent)(shakespeare as Shakespeare[])
  .sum((d) => d.size ?? 0);

const treemapRoot = computed(() =>
  hierarchy(shakespeareData).sort((a, b) => (b.value ?? 0) - (a.value ?? 0)),
);

// ── Pack ──────────────────────────────────────────────────────────────────────
const { parentRef: parentRef2, width: width2 } = useParentSize({ debounceTime: 0 });
const height2 = computed(() => Math.round(width2.value * 0.6) || 400);
const packMargin = { top: 10, left: 30, right: 40, bottom: 80 };

const filteredPlanets = (rawPlanets as Datum[]).filter(
  (d) => d.distance !== 0 && d.distance != null,
);
const packData = { children: filteredPlanets, name: "root", radius: 0, distance: 0 };

const allRadii = (rawPlanets as Datum[]).map((d) => d.radius);
const packColor = scaleQuantize<string>({
  domain: [Math.min(...allRadii), Math.max(...allRadii)],
  range: ["#0a2a1a", "#006b3f", "#009a49", "#00DC82", "#33e394", "#7cf5c0"],
});

const packRoot = hierarchy<Datum>(packData as any)
  .sum((d) => (d as any).radius * (d as any).radius)
  .sort(
    (a, b) =>
      (a?.data ? 1 : -1) - (b?.data ? 1 : -1) ||
      (a.children ? 1 : -1) - (b.children ? 1 : -1) ||
      (a.data.distance == null ? -1 : 1) - (b.data.distance == null ? -1 : 1) ||
      a.data.distance! - b.data.distance!,
  );
</script>
