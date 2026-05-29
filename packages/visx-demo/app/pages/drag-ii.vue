<template>
  <ExamplePage
    title="Drag II"
    :packages="['@visx-vue/drag', '@visx-vue/shape', '@visx-vue/gradient', '@visx-vue/curve']"
  >
    <div
      ref="parentRef"
      class="chart-container"
      style="touch-action: none; cursor: crosshair"
    >
      <svg
        v-if="width > 0"
        :width="width"
        :height="height"
      >
        <LinearGradient
          id="drag2-stroke"
          from="#ff614e"
          to="#ffdc64"
        />
        <rect
          fill="#04002b"
          :width="width"
          :height="height"
          :rx="14"
        />
        <LinePath
          v-for="(line, i) in lines"
          :key="`line-${i}`"
          fill="transparent"
          stroke="url(#drag2-stroke)"
          stroke-width="3"
          :data="line"
          :curve="curveBasis"
          :x="(d) => d.x"
          :y="(d) => d.y"
        />
        <g>
          <rect
            v-if="isDragging"
            :width="width"
            :height="height"
            fill="transparent"
            @pointermove="dragMove"
            @pointerup="dragEnd"
          />
          <g v-if="isDragging">
            <rect
              fill="white"
              width="8"
              height="8"
              :x="x + dx - 4"
              :y="y + dy - 4"
              pointer-events="none"
            />
            <circle
              :cx="x"
              :cy="y"
              r="4"
              fill="transparent"
              stroke="white"
              pointer-events="none"
            />
          </g>
          <rect
            fill="transparent"
            :width="width"
            :height="height"
            @pointerdown="dragStart"
            @pointerup="isDragging ? dragEnd($event) : null"
            @pointermove="isDragging ? dragMove($event) : null"
          />
        </g>
      </svg>
      <p class="hint">Draw by clicking and dragging</p>
    </div>
  </ExamplePage>
</template>

<script setup lang="ts">
import { LinePath } from '@visx-vue/shape'
import { useDrag } from '@visx-vue/drag'
import { curveBasis } from '@visx-vue/curve'
import { LinearGradient } from '@visx-vue/gradient'
import { useParentSize } from '@visx-vue/responsive'

useHead({ title: 'Drag II — visx-vue' })

const { parentRef, width } = useParentSize({ debounceTime: 0 })
const height = computed(() => Math.round(width.value * 0.6) || 400)

type Point = { x: number; y: number }
type Line = Point[]

const lines = ref<Line[]>([])

const { x, y, dx, dy, isDragging, dragStart, dragEnd, dragMove } = useDrag({
  resetOnStart: true,
  onDragStart(curr) {
    lines.value = [...lines.value, [{ x: curr.x ?? 0, y: curr.y ?? 0 }]]
  },
  onDragMove(curr) {
    const nextLines = [...lines.value]
    const newPoint = { x: (curr.x ?? 0) + (curr.dx ?? 0), y: (curr.y ?? 0) + (curr.dy ?? 0) }
    const lastIndex = nextLines.length - 1
    nextLines[lastIndex] = [...(nextLines[lastIndex] || []), newPoint]
    lines.value = nextLines
  }
})
</script>

<style scoped>
.chart-container {
  width: 100%;
  min-height: 400px;
}
.hint {
  font-size: 12px;
  color: #666;
  margin-top: 4px;
}
</style>
