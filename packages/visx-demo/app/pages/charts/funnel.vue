<script setup lang="ts">
/**
 * Funnel Chart demo — conversion funnel visualization.
 */
const data = [
  { label: "Visitors", value: 10000, color: "#6366f1" },
  { label: "Sign Ups", value: 6500, color: "#8b5cf6" },
  { label: "Activated", value: 4200, color: "#a78bfa" },
  { label: "Subscribed", value: 2100, color: "#c4b5fd" },
  { label: "Retained", value: 1400, color: "#ddd6fe" },
];
</script>

<template>
  <div class="max-w-4xl mx-auto p-8 space-y-12">
    <h1 class="text-2xl font-bold">Funnel Chart</h1>

    <section>
      <h2 class="text-lg font-semibold mb-4">Conversion Funnel</h2>
      <pre
        class="bg-gray-100 dark:bg-gray-900 rounded p-4 text-xs overflow-auto mb-4"
      ><code>&lt;FunnelChart :data="data" /&gt;</code></pre>
    </section>

    <section>
      <h2 class="text-lg font-semibold mb-4">Sample Data</h2>
      <pre class="bg-gray-100 dark:bg-gray-900 rounded p-4 text-xs overflow-auto max-h-60">{{
        JSON.stringify(data, null, 2)
      }}</pre>
    </section>
  </div>
</template>
