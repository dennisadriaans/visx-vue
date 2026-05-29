<template>
  <ExamplePage
    title="Glyphs"
    :packages="[
      '@visx-vue/glyph',
      '@visx-vue/shape',
      '@visx-vue/group',
      '@visx-vue/scale',
      '@visx-vue/mock-data',
      '@visx-vue/curve'
    ]"
  >
    <div
      ref="parentRef"
      class="chart-container"
    >
      <svg
        v-if="width > 0"
        :width="width"
        :height="height"
      >
        <rect
          x="0"
          y="0"
          :width="width"
          :height="height"
          fill="#00f2ff"
          :rx="14"
        />
        <Group
          :left="margin.left"
          :top="margin.top"
        >
          <LinePath
            :data="data"
            :x="getX"
            :y="getY"
            stroke="#8921e0"
            stroke-width="2"
            stroke-dasharray="2,2"
            :curve="curveBasis"
          />
          <LinePath
            :data="data"
            :x="getX"
            :y="getY"
            stroke="#8921e0"
            stroke-width="2"
            :curve="curveMonotoneX"
          />
          <g
            v-for="(d, i) in data"
            :key="`glyph-${i}`"
          >
            <!-- stroke -->
            <component
              :is="glyphs[i % glyphs.length]"
              :left="getX(d)"
              :top="getY(d)"
              :size="110"
              stroke="#00f2ff"
              :stroke-width="10"
            />
            <!-- fill -->
            <component
              :is="glyphs[i % glyphs.length]"
              :left="getX(d)"
              :top="getY(d)"
              :size="110"
              :fill="i % 2 === 0 ? '#8921e0' : '#ffffff'"
              :stroke="i % 2 === 0 ? '#ffffff' : '#8921e0'"
              :stroke-width="2"
            />
          </g>
        </Group>
      </svg>
    </div>
  </ExamplePage>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Group } from '@visx-vue/group'
import {
  GlyphCircle,
  GlyphCross,
  GlyphDiamond,
  GlyphStar,
  GlyphTriangle,
  GlyphSquare,
  GlyphWye
} from '@visx-vue/glyph'
import { LinePath } from '@visx-vue/shape'
import { genDateValue } from '@visx-vue/mock-data'
import type { DateValue } from '@visx-vue/mock-data'
import { scaleTime, scaleLinear } from '@visx-vue/scale'
import { curveMonotoneX, curveBasis } from '@visx-vue/curve'
import { useParentSize } from '@visx-vue/responsive'

useHead({ title: 'Glyphs — visx-vue' })

const { parentRef, width } = useParentSize({ debounceTime: 0 })
const height = computed(() => Math.round(width.value * 0.6) || 400)

const margin = { top: 10, right: 10, bottom: 10, left: 10 }

const glyphs = [
  GlyphCircle,
  GlyphCross,
  GlyphDiamond,
  GlyphStar,
  GlyphTriangle,
  GlyphSquare,
  GlyphWye
]

const data = genDateValue(glyphs.length * 2, 0.91) as DateValue[]

const dateAcc = (d: DateValue) => d.date.valueOf()
const valueAcc = (d: DateValue) => d.value

const xScaleBase = scaleTime<number>({
  domain: [Math.min(...data.map(dateAcc)), Math.max(...data.map(dateAcc))]
})
const yScaleBase = scaleLinear<number>({
  domain: [0, Math.max(...data.map(valueAcc))]
})

const innerWidth = computed(() => width.value - margin.left - margin.right)
const innerHeight = computed(() => height.value - margin.top - margin.bottom)

const getX = (d: DateValue) => {
  xScaleBase.range([0, innerWidth.value])
  return xScaleBase(dateAcc(d)) ?? 0
}
const getY = (d: DateValue) => {
  yScaleBase.range([innerHeight.value, 0])
  return yScaleBase(valueAcc(d)) ?? 0
}
</script>

<style scoped>
.chart-container {
  width: 100%;
  min-height: 400px;
}
</style>
