<script setup lang="ts">
/**
 * Dual Chart demo — bars + lines on dual Y-axes.
 */
const data = [
  { month: "Jan", revenue: 4200, expenses: 3100, margin: 26 },
  { month: "Feb", revenue: 3800, expenses: 2900, margin: 24 },
  { month: "Mar", revenue: 5100, expenses: 3400, margin: 33 },
  { month: "Apr", revenue: 4600, expenses: 3200, margin: 30 },
  { month: "May", revenue: 5800, expenses: 3600, margin: 38 },
  { month: "Jun", revenue: 6200, expenses: 3900, margin: 37 },
];

const barCategories = {
  revenue: { color: "#6366f1", label: "Revenue" },
  expenses: { color: "#f43f5e", label: "Expenses" },
};

const lineCategories = {
  margin: { color: "#22c55e", label: "Margin %" },
};
</script>

<template>
  <div class="max-w-4xl mx-auto p-8 space-y-12">
    <h1 class="text-2xl font-bold">Dual Chart</h1>

    <section>
      <h2 class="text-lg font-semibold mb-4">Bars + Lines on Dual Y-Axes</h2>
      <pre
        class="bg-gray-100 dark:bg-gray-900 rounded p-4 text-xs overflow-auto mb-4"
      ><code>&lt;DualChart
  :data="data"
  :bar-categories="barCategories"
  :line-categories="lineCategories"
  :bar-y-axis="['revenue', 'expenses']"
  :line-y-axis="['margin']"
  x-key="month"
  :y-grid-line="true"
/&gt;</code></pre>
    </section>

    <section>
      <h2 class="text-lg font-semibold mb-4">Sample Data</h2>
      <pre class="bg-gray-100 dark:bg-gray-900 rounded p-4 text-xs overflow-auto max-h-60">{{
        JSON.stringify(data, null, 2)
      }}</pre>
    </section>
  </div>
</template>
