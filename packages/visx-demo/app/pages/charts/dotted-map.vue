<script setup lang="ts">
/**
 * Dotted Map demo — world map with dot grid and pins.
 */
</script>

<template>
  <div class="max-w-4xl mx-auto p-8 space-y-12">
    <h1 class="text-2xl font-bold">Dotted Map</h1>

    <section>
      <h2 class="text-lg font-semibold mb-4">World Map with Pins</h2>
      <p class="text-sm text-gray-500 mb-2">
        The DottedMap component uses a dot-grid rendering approach. Currently a stub in
        @visx-vue/charts — full implementation pending.
      </p>
      <pre
        class="bg-gray-100 dark:bg-gray-900 rounded p-4 text-xs overflow-auto mb-4"
      ><code>&lt;DottedMapCompat
  :pins="[
    { lat: 40.7128, lng: -74.0060, svgOptions: { color: '#ef4444' } },
    { lat: 51.5074, lng: -0.1278, svgOptions: { color: '#3b82f6' } },
    { lat: 35.6762, lng: 139.6503, svgOptions: { color: '#22c55e' } },
  ]"
  region-name="world"
  color="#e5e7eb"
  show-controls
/&gt;</code></pre>
    </section>
  </div>
</template>
