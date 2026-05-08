<script setup lang="ts">
/**
 * TopoJSON Map demo — choropleth with geographic data.
 */
</script>

<template>
  <div class="max-w-4xl mx-auto p-8 space-y-12">
    <h1 class="text-2xl font-bold">TopoJSON Map</h1>

    <section>
      <h2 class="text-lg font-semibold mb-4">Choropleth Map</h2>
      <p class="text-sm text-gray-500 mb-2">
        Uses ChoroplethChart internally with Mercator projection and optional zoom.
      </p>
      <pre
        class="bg-gray-100 dark:bg-gray-900 rounded p-4 text-xs overflow-auto mb-4"
      ><code>&lt;ChoroplethChart
  :topo-json="worldTopo"
  feature-key="countries"
  :color-scale="d => colorScale(dataMap[d.id])"
  zoom-enabled
&gt;
  &lt;ChoroplethGraticule /&gt;
  &lt;ChoroplethFeatureComponent
    v-for="feature in features"
    :feature="feature"
  /&gt;
  &lt;ChoroplethTooltip /&gt;
&lt;/ChoroplethChart&gt;</code></pre>
    </section>

    <section>
      <h2 class="text-lg font-semibold mb-4">Compat API</h2>
      <pre
        class="bg-gray-100 dark:bg-gray-900 rounded p-4 text-xs overflow-auto mb-4"
      ><code>&lt;TopoJSONMapCompat
  :topo-json="worldTopo"
  map-feature-key="countries"
  :data="{ areas: areaData }"
  :area-color="d => colorScale(d.value)"
  :zoom-extent="[0.5, 6]"
  :hide-tooltip="false"
/&gt;</code></pre>
    </section>
  </div>
</template>
