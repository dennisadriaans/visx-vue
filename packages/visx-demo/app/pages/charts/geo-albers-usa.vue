<template>
  <ExamplePage
    title="Geo Albers USA"
    :packages="['@visx-vue/geo']"
  >
    <div
      ref="parentRef"
      class="chart-container bg-elevated/40 rounded-xl"
    >
      <svg
        v-if="width > 0 && states && states.length > 0"
        :width="width"
        :height="height"
        style="border-radius: 14px"
      >
        <AlbersUsa
          :data="states"
          :scale="(width + height) / 1.55"
          :translate="[width / 2, height / 2 - 25]"
        >
          <template #default="{ features }">
            <path
              v-for="({ feature, path }, i) in features"
              :key="`state-${i}`"
              :d="path || ''"
              :fill="stateColors[i % 4]"
              stroke="#ffffff22"
              stroke-width="0.5"
              style="cursor: pointer"
            />
          </template>
        </AlbersUsa>
      </svg>
      <p
        v-else-if="width > 0"
        class="loading"
      >
        Loading USA map…
      </p>
    </div>
  </ExamplePage>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { AlbersUsa } from '@visx-vue/geo'
import { useParentSize } from '@visx-vue/responsive'

useHead({ title: 'Geo Albers USA — visx-vue' })

const { parentRef, width } = useParentSize({ debounceTime: 0 })
const height = computed(() => Math.round(width.value * 0.6) || 400)

const stateColors = ['#00DC82', '#00b368', '#33e394', '#007a47']

interface FeatureShape {
  type: 'Feature'
  id: string
  geometry: { coordinates: [number, number][][]; type: 'Polygon' }
  properties: { name: string }
}

const { data: states } = await useAsyncData<FeatureShape[]>('usa-states', async () => {
  const [topojson, topology] = await Promise.all([
    import('topojson-client'),
    $fetch<any>('/data/usa-topo.json')
  ])
  const fc = topojson.feature(topology, topology.objects.states) as {
    type: string
    features: FeatureShape[]
  }
  return fc.features
})
</script>

<style scoped>
.chart-container {
  width: 100%;
  min-height: 400px;
}
.loading {
  color: #666;
}
</style>
