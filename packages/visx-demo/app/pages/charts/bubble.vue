<script setup lang="ts">
/**
 * Bubble Chart demo — scatter plot with sized bubbles.
 */
const data = Array.from({ length: 40 }, (_, i) => ({
  x: Math.round(Math.random() * 100),
  y: Math.round(Math.random() * 100),
  size: Math.round(5 + Math.random() * 50),
  category: ["tech", "health", "finance", "energy"][i % 4],
}));

const categories = {
  tech: { color: "#3b82f6", label: "Technology" },
  health: { color: "#22c55e", label: "Healthcare" },
  finance: { color: "#f59e0b", label: "Finance" },
  energy: { color: "#ef4444", label: "Energy" },
};
</script>

<template>
  <div class="max-w-4xl mx-auto p-8 space-y-12">
    <h1 class="text-2xl font-bold">Bubble Chart</h1>

    <section>
      <h2 class="text-lg font-semibold mb-4">Basic Bubble Chart</h2>
      <pre
        class="bg-gray-100 dark:bg-gray-900 rounded p-4 text-xs overflow-auto mb-4"
      ><code>&lt;BubbleChart
  :data="data"
  :categories="categories"
  category-key="category"
  :x-accessor="d => d.x"
  :y-accessor="d => d.y"
  :size-accessor="d => d.size"
  :size-range="[4, 24]"
  :opacity="0.7"
  x-label="Performance"
  y-label="Growth"
/&gt;</code></pre>
    </section>

    <section>
      <h2 class="text-lg font-semibold mb-4">Sample Data</h2>
      <pre class="bg-gray-100 dark:bg-gray-900 rounded p-4 text-xs overflow-auto max-h-60">{{
        JSON.stringify(data.slice(0, 8), null, 2)
      }}</pre>
    </section>
  </div>
</template>
