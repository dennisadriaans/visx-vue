<script setup lang="ts">
import { computed, ref } from 'vue'
import { Stack } from '@visx-vue/shape'
import { PatternCircles, PatternWaves } from '@visx-vue/pattern'
import { scaleLinear, scaleOrdinal } from '@visx-vue/scale'
import { transpose } from '@visx-vue/vendor/d3-array'
import { getSeededRandom } from '@visx-vue/mock-data'
import { useParentSize } from '@visx-vue/responsive'

const { parentRef, width, height: rawHeight } = useParentSize()
const height = computed(() => rawHeight.value || 400)

const BACKGROUND = 'transparent'
const NUM_LAYERS = 20
const SAMPLES_PER_LAYER = 200
const BUMPS_PER_LAYER = 10

const range = (n: number) => Array.from({ length: n }, (_, i) => i)
const keys = range(NUM_LAYERS)

const seededRandom = getSeededRandom(0.65)

function getPoints(array: number[], pointCount: number) {
  const x = 1 / (0.1 + seededRandom())
  const y = 2 * seededRandom() - 0.5
  const z = 10 / (0.1 + seededRandom())
  for (let i = 0; i < pointCount; i++) {
    const w = (i / pointCount - y) * z
    array[i] += x * Math.exp(-w * w)
  }
}

function generateData(pointCount: number, bumpCount: number): number[] {
  const arr = Array.from({ length: pointCount }, () => 0)
  for (let i = 0; i < bumpCount; i++) getPoints(arr, pointCount)
  return arr
}

const colorScale = scaleOrdinal<number, string>({
  domain: keys,
  range: ['#ffc409', '#f14702', '#262d97', 'white', '#036ecd', '#9ecadd', '#51666e']
})

const patternScale = scaleOrdinal<number, string>({
  domain: keys,
  range: ['mustard', 'cherry', 'navy', 'circles', 'circles', 'circles', 'circles']
})

const xScale = scaleLinear<number>({ domain: [0, SAMPLES_PER_LAYER - 1] })
const yScale = scaleLinear<number>({ domain: [-30, 50] })

const getY0 = (d: number[]) => yScale(d[0]) ?? 0
const getY1 = (d: number[]) => yScale(d[1]) ?? 0

const generation = ref(0)

function regenerate() {
  generation.value++
}

const layers = computed(() => {
  // eslint-disable-next-line no-unused-expressions
  generation.value // trigger reactivity
  xScale.range([0, width.value])
  yScale.range([height.value, 0])
  return transpose<number>(keys.map(() => generateData(SAMPLES_PER_LAYER, BUMPS_PER_LAYER)))
})
</script>

<template>
  <ExamplePage
    title="Streamgraph"
    description="An animated streamgraph built from stacked shapes with pattern fills. Click to regenerate."
    :packages="['@visx-vue/shape', '@visx-vue/pattern', '@visx-vue/scale']"
  >
    <div
      ref="parentRef"
      class="w-full bg-elevated/40 rounded-xl"
      style="height: 500px"
    >
      <svg
        v-if="width > 10"
        :width="width"
        :height="height"
        @click="regenerate"
        style="cursor: pointer"
      >
        <PatternCircles
          id="mustard"
          :height="40"
          :width="40"
          :radius="5"
          fill="#036ecf"
          complement
        />
        <PatternWaves
          id="cherry"
          :height="12"
          :width="12"
          fill="transparent"
          stroke="#232493"
          stroke-width="1"
        />
        <PatternCircles
          id="navy"
          :height="60"
          :width="60"
          :radius="10"
          fill="white"
          complement
        />
        <PatternCircles
          complement
          id="circles"
          :height="60"
          :width="60"
          :radius="10"
          fill="transparent"
        />

        <rect
          x="0"
          y="0"
          :width="width"
          :height="height"
          :fill="BACKGROUND"
          rx="14"
        />
        <Stack
          :data="layers"
          :keys="keys"
          offset="wiggle"
          :color="colorScale"
          :x="(_: number[], i: number) => xScale(i) ?? 0"
          :y0="getY0"
          :y1="getY1"
        >
          <template #default="{ stacks, path }">
            <g
              v-for="stack in stacks"
              :key="`series-${stack.key}`"
            >
              <path
                :d="path(stack) || ''"
                :fill="colorScale(stack.key)"
              />
              <path
                :d="path(stack) || ''"
                :fill="`url(#${patternScale(stack.key)})`"
              />
            </g>
          </template>
        </Stack>
      </svg>
    </div>
  </ExamplePage>
</template>
