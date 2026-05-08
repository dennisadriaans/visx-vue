<script setup lang="ts">
/**
 * Ring Chart demo — concentric rings with center content.
 */
const data = [
  { label: "Completed", value: 75, color: "#22c55e" },
  { label: "In Progress", value: 60, color: "#3b82f6" },
  { label: "Planned", value: 40, color: "#f59e0b" },
];
</script>

<template>
  <div class="max-w-4xl mx-auto p-8 space-y-12">
    <h1 class="text-2xl font-bold">Ring Chart</h1>

    <section>
      <h2 class="text-lg font-semibold mb-4">Progress Rings</h2>
      <pre
        class="bg-gray-100 dark:bg-gray-900 rounded p-4 text-xs overflow-auto mb-4"
      ><code>&lt;RingChart :data="data" :size="200" :ring-width="12" :ring-gap="6"&gt;
  &lt;Ring v-for="(d, i) in data" :index="i" :color="d.color" /&gt;
  &lt;RingCenter&gt;
    &lt;div class="text-center"&gt;
      &lt;div class="text-xl font-bold"&gt;75%&lt;/div&gt;
      &lt;div class="text-xs text-gray-500"&gt;Overall&lt;/div&gt;
    &lt;/div&gt;
  &lt;/RingCenter&gt;
&lt;/RingChart&gt;</code></pre>
    </section>

    <section>
      <h2 class="text-lg font-semibold mb-4">Sample Data</h2>
      <pre class="bg-gray-100 dark:bg-gray-900 rounded p-4 text-xs overflow-auto max-h-60">{{
        JSON.stringify(data, null, 2)
      }}</pre>
    </section>
  </div>
</template>
