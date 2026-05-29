<script setup lang="ts">
import { computed, ref } from 'vue'
import { Group } from '@visx-vue/group'
import { GradientOrangeRed, GradientPinkRed } from '@visx-vue/gradient'
import { RectClipPath } from '@visx-vue/clip-path'
import { voronoi, Polygon } from '@visx-vue/delaunay'
import { getSeededRandom } from '@visx-vue/mock-data'
import { useParentSize } from '@visx-vue/responsive'

const { parentRef, width, height: rawHeight } = useParentSize()
const height = computed(() => rawHeight.value || 400)

const margin = { top: 0, left: 0, right: 0, bottom: 76 }
const innerWidth = computed(() => Math.max(0, width.value - margin.left - margin.right))
const innerHeight = computed(() => Math.max(0, height.value - margin.top - margin.bottom))

const seededRandom = getSeededRandom(0.88)

const data = Array.from({ length: 150 }, () => ({
  x: seededRandom(),
  y: seededRandom(),
  id: Math.random().toString(36).slice(2)
}))

const voronoiDiagram = computed(() =>
  voronoi({
    data,
    x: (d) => d.x * innerWidth.value,
    y: (d) => d.y * innerHeight.value,
    width: innerWidth.value,
    height: innerHeight.value
  })
)

const svgRef = ref<SVGSVGElement | null>(null)
const hoveredId = ref<string | null>(null)
const neighborIds = ref<Set<string>>(new Set())

function handleMouseMove(event: MouseEvent) {
  if (!svgRef.value) return
  const rect = svgRef.value.getBoundingClientRect()
  const px = event.clientX - rect.left
  const py = event.clientY - rect.top
  const closest = voronoiDiagram.value.delaunay.find(px, py)
  if (data[closest]?.id !== hoveredId.value) {
    const neighbors = Array.from(voronoiDiagram.value.neighbors(closest))
    neighborIds.value = new Set(neighbors.map((d) => data[d].id))
    hoveredId.value = data[closest]?.id ?? null
  }
}
</script>

<template>
  <ExamplePage
    title="Delaunay Voronoi"
    description="Hover to highlight Voronoi cells and their neighbors. Uses voronoi() from @visx-vue/delaunay."
    :packages="['@visx-vue/delaunay', '@visx-vue/clip-path', '@visx-vue/gradient']"
  >
    <div
      ref="parentRef"
      class="w-full bg-elevated/40 rounded-xl"
      style="height: 500px"
    >
      <svg
        v-if="width > 10"
        :ref="
          (el) => {
            svgRef = el as SVGSVGElement
          }
        "
        :width="width"
        :height="height"
        @mousemove="handleMouseMove"
        @mouseleave="
          () => {
            hoveredId = null
            neighborIds = new Set()
          }
        "
      >
        <GradientOrangeRed id="voronoi_orange_red" />
        <GradientPinkRed id="voronoi_pink_red" />
        <!-- use gradient ids from existing components but tint with color overrides via opacity -->
        <RectClipPath
          id="voronoi_clip"
          :width="innerWidth"
          :height="innerHeight"
          rx="14"
        />
        <Group
          :top="margin.top"
          :left="margin.left"
          clip-path="url(#voronoi_clip)"
        >
          <Polygon
            v-for="(d, i) in data"
            :key="`polygon-${d.id}`"
            :polygon="voronoiDiagram.cellPolygon(i)"
            :fill="
              hoveredId && (d.id === hoveredId || neighborIds.has(d.id))
                ? 'url(#voronoi_orange_red)'
                : 'url(#voronoi_pink_red)'
            "
            stroke="#00DC8244"
            stroke-width="1"
            :fill-opacity="hoveredId && neighborIds.has(d.id) ? 0.5 : 1"
          />
          <circle
            v-for="{ x, y, id } in data"
            :key="`circle-${id}`"
            r="2"
            :cx="x * innerWidth"
            :cy="y * innerHeight"
            :fill="id === hoveredId ? '#33e394' : '#00DC82'"
            fill-opacity="0.8"
          />
        </Group>
      </svg>
    </div>
  </ExamplePage>
</template>
