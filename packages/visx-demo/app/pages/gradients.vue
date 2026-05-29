<template>
  <ExamplePage
    title="Gradients"
    :packages="['@visx-vue/gradient', '@visx-vue/shape']"
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
        <template
          v-for="(gradient, index) in gradients"
          :key="`grad-${index}`"
        >
          <component
            :is="gradient.component"
            v-bind="gradient.props"
          />
          <Bar
            :fill="`url(#grad-demo-${index})`"
            :x="(index % numColumns) * columnWidth"
            :y="Math.floor(index / numColumns) * rowHeight"
            :width="columnWidth"
            :height="rowHeight"
            stroke="#ffffff"
            :stroke-width="8"
            :rx="14"
          />
        </template>
      </svg>
    </div>
  </ExamplePage>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Bar } from '@visx-vue/shape'
import {
  GradientDarkgreenGreen,
  GradientLightgreenGreen,
  GradientOrangeRed,
  GradientPinkBlue,
  GradientPinkRed,
  GradientPurpleOrange,
  GradientPurpleRed,
  GradientTealBlue,
  RadialGradient,
  LinearGradient
} from '@visx-vue/gradient'
import { useParentSize } from '@visx-vue/responsive'

useHead({ title: 'Gradients — visx-vue' })

const { parentRef, width } = useParentSize({ debounceTime: 0 })
const height = computed(() => Math.round(width.value * 0.6) || 400)

const numColumns = computed(() => (width.value > 600 ? 5 : 2))
const numRows = computed(() => Math.ceil(10 / numColumns.value))
const columnWidth = computed(() => Math.max(width.value / numColumns.value, 0))
const rowHeight = computed(() => Math.max(height.value / numRows.value, 0))

const gradients = computed(() => [
  { component: GradientPinkRed, props: { id: 'grad-demo-0' } },
  {
    component: RadialGradient,
    props: { id: 'grad-demo-1', from: '#55bdd5', to: '#4f3681', r: '80%' }
  },
  { component: GradientOrangeRed, props: { id: 'grad-demo-2' } },
  { component: GradientPinkBlue, props: { id: 'grad-demo-3' } },
  {
    component: LinearGradient,
    props: { id: 'grad-demo-4', from: '#351CAB', to: '#621A61', rotate: '-45' }
  },
  { component: GradientLightgreenGreen, props: { id: 'grad-demo-5' } },
  { component: GradientPurpleOrange, props: { id: 'grad-demo-6' } },
  { component: GradientTealBlue, props: { id: 'grad-demo-7' } },
  { component: GradientPurpleRed, props: { id: 'grad-demo-8' } },
  { component: GradientDarkgreenGreen, props: { id: 'grad-demo-9' } }
])
</script>

<style scoped>
.chart-container {
  width: 100%;
  min-height: 400px;
}
</style>
