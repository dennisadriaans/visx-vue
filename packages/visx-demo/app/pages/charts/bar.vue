<script setup lang="ts">
/**
 * Bar Chart demo — vertical, horizontal, stacked, and grouped variants.
 */
import { ref } from "vue";

const data = ref([
  { name: "Jan", sales: 4200, returns: 800, online: 2800 },
  { name: "Feb", sales: 3800, returns: 600, online: 3200 },
  { name: "Mar", sales: 5100, returns: 900, online: 3600 },
  { name: "Apr", sales: 4600, returns: 700, online: 4100 },
  { name: "May", sales: 5800, returns: 500, online: 4500 },
  { name: "Jun", sales: 6200, returns: 400, online: 5200 },
]);

const categories = {
  sales: { name: "Sales", color: "#6366f1" },
  returns: { name: "Returns", color: "#f43f5e" },
  online: { name: "Online", color: "#06b6d4" },
};
</script>

<template>
  <div class="max-w-4xl mx-auto p-8 space-y-12">
    <h1 class="text-2xl font-bold">Bar Chart</h1>

    <section>
      <h2 class="text-lg font-semibold mb-4">Grouped Vertical Bars</h2>
      <pre
        class="bg-gray-100 dark:bg-gray-900 rounded p-4 text-xs overflow-auto mb-4"
      ><code>&lt;BarChart :data="data" x-data-key="name"&gt;
  &lt;Bar data-key="sales" fill="#6366f1" /&gt;
  &lt;Bar data-key="returns" fill="#f43f5e" /&gt;
  &lt;Bar data-key="online" fill="#06b6d4" /&gt;
  &lt;ChartGrid /&gt;
  &lt;ChartTooltip /&gt;
  &lt;ChartLegend /&gt;
&lt;/BarChart&gt;</code></pre>
    </section>

    <section>
      <h2 class="text-lg font-semibold mb-4">Stacked Bars</h2>
      <pre
        class="bg-gray-100 dark:bg-gray-900 rounded p-4 text-xs overflow-auto mb-4"
      ><code>&lt;BarChart :data="data" x-data-key="name" stacked&gt;
  &lt;Bar data-key="sales" fill="#6366f1" /&gt;
  &lt;Bar data-key="online" fill="#06b6d4" /&gt;
  &lt;ChartGrid /&gt;
  &lt;ChartTooltip /&gt;
&lt;/BarChart&gt;</code></pre>
    </section>

    <section>
      <h2 class="text-lg font-semibold mb-4">Horizontal Orientation</h2>
      <pre
        class="bg-gray-100 dark:bg-gray-900 rounded p-4 text-xs overflow-auto mb-4"
      ><code>&lt;BarChart :data="data" x-data-key="name" orientation="horizontal"&gt;
  &lt;Bar data-key="sales" fill="#6366f1" /&gt;
  &lt;ChartGrid horizontal :vertical="false" /&gt;
&lt;/BarChart&gt;</code></pre>
    </section>

    <section>
      <h2 class="text-lg font-semibold mb-4">Compat API</h2>
      <pre
        class="bg-gray-100 dark:bg-gray-900 rounded p-4 text-xs overflow-auto mb-4"
      ><code>&lt;BarChartCompat
  :data="data"
  :height="300"
  :categories="categories"
  :y-axis="['sales', 'returns', 'online']"
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
