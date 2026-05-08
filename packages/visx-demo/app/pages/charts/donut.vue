<script setup lang="ts">
/**
 * Donut / Pie Chart demo — full donut, half donut, and composable pie.
 */
const pieData = [
  { label: "Desktop", value: 45, color: "#8b5cf6" },
  { label: "Mobile", value: 35, color: "#3b82f6" },
  { label: "Tablet", value: 15, color: "#f59e0b" },
  { label: "Other", value: 5, color: "#6b7280" },
];

const compatData = [45, 35, 15, 5];

const categories = {
  desktop: { name: "Desktop", color: "#8b5cf6" },
  mobile: { name: "Mobile", color: "#3b82f6" },
  tablet: { name: "Tablet", color: "#f59e0b" },
  other: { name: "Other", color: "#6b7280" },
};
</script>

<template>
  <div class="max-w-4xl mx-auto p-8 space-y-12">
    <h1 class="text-2xl font-bold">Donut / Pie Chart</h1>

    <section>
      <h2 class="text-lg font-semibold mb-4">Composable Pie with Center Content</h2>
      <pre
        class="bg-gray-100 dark:bg-gray-900 rounded p-4 text-xs overflow-auto mb-4"
      ><code>&lt;PieChart :data="pieData" :inner-radius="60"&gt;
  &lt;PieSlice v-for="(d, i) in pieData" :index="i" :color="d.color" /&gt;
  &lt;PieCenter&gt;
    &lt;div class="text-center"&gt;
      &lt;div class="text-2xl font-bold"&gt;100%&lt;/div&gt;
      &lt;div class="text-sm text-gray-500"&gt;Total&lt;/div&gt;
    &lt;/div&gt;
  &lt;/PieCenter&gt;
&lt;/PieChart&gt;</code></pre>
    </section>

    <section>
      <h2 class="text-lg font-semibold mb-4">Compat API — Full Donut</h2>
      <pre
        class="bg-gray-100 dark:bg-gray-900 rounded p-4 text-xs overflow-auto mb-4"
      ><code>&lt;DonutChartCompat
  :data="compatData"
  :radius="120"
  :categories="categories"
  :arc-width="30"
/&gt;</code></pre>
    </section>

    <section>
      <h2 class="text-lg font-semibold mb-4">Compat API — Half Donut</h2>
      <pre
        class="bg-gray-100 dark:bg-gray-900 rounded p-4 text-xs overflow-auto mb-4"
      ><code>&lt;DonutChartCompat
  :data="compatData"
  :radius="120"
  :categories="categories"
  :arc-width="30"
  type="half"
/&gt;</code></pre>
    </section>

    <section>
      <h2 class="text-lg font-semibold mb-4">Sample Data</h2>
      <pre class="bg-gray-100 dark:bg-gray-900 rounded p-4 text-xs overflow-auto max-h-60">{{
        JSON.stringify(pieData, null, 2)
      }}</pre>
    </section>
  </div>
</template>
