<script setup lang="ts">
/**
 * Radar Chart demo — multi-metric comparison.
 */
const data = [
  { axis: "Speed", series1: 85, series2: 70, series3: 60 },
  { axis: "Reliability", series1: 90, series2: 80, series3: 75 },
  { axis: "Cost", series1: 60, series2: 85, series3: 90 },
  { axis: "Scalability", series1: 75, series2: 65, series3: 80 },
  { axis: "Security", series1: 95, series2: 75, series3: 70 },
  { axis: "Support", series1: 70, series2: 90, series3: 65 },
];
</script>

<template>
  <div class="max-w-4xl mx-auto p-8 space-y-12">
    <h1 class="text-2xl font-bold">Radar Chart</h1>

    <section>
      <h2 class="text-lg font-semibold mb-4">Multi-Series Radar</h2>
      <pre
        class="bg-gray-100 dark:bg-gray-900 rounded p-4 text-xs overflow-auto mb-4"
      ><code>&lt;RadarChart :data="data" label-key="axis"&gt;
  &lt;RadarGrid :levels="5" /&gt;
  &lt;RadarArea data-key="series1" fill="#8b5cf6" :fill-opacity="0.2" /&gt;
  &lt;RadarArea data-key="series2" fill="#3b82f6" :fill-opacity="0.2" /&gt;
  &lt;RadarArea data-key="series3" fill="#22c55e" :fill-opacity="0.2" /&gt;
  &lt;RadarLabels /&gt;
  &lt;RadarAxis /&gt;
&lt;/RadarChart&gt;</code></pre>
    </section>

    <section>
      <h2 class="text-lg font-semibold mb-4">Sample Data</h2>
      <pre class="bg-gray-100 dark:bg-gray-900 rounded p-4 text-xs overflow-auto max-h-60">{{
        JSON.stringify(data, null, 2)
      }}</pre>
    </section>
  </div>
</template>
