<script setup lang="ts">
/**
 * Area Chart demo — showcases both composable and compat APIs.
 * Requires @visx-vue/charts to be installed.
 */
import { ref } from "vue";

// These imports will work once @visx-vue/charts is added to the demo app dependencies
// import {
//   AreaChart, Area, ChartGrid, ChartXAxis, ChartYAxis, ChartTooltip, ChartLegend,
//   AreaChartCompat,
//   CurveType, LegendPosition,
// } from '@visx-vue/charts'

const data = ref(generateData());

function generateData() {
  const now = Date.now();
  return Array.from({ length: 30 }, (_, i) => ({
    date: new Date(now - (29 - i) * 86400000).toISOString().slice(0, 10),
    revenue: Math.round(3000 + Math.random() * 5000),
    expenses: Math.round(1500 + Math.random() * 3000),
    profit: Math.round(500 + Math.random() * 2000),
  }));
}

const categories = {
  revenue: { name: "Revenue", color: "#8b5cf6" },
  expenses: { name: "Expenses", color: "#ef4444" },
  profit: { name: "Profit", color: "#22c55e" },
};
</script>

<template>
  <div class="max-w-4xl mx-auto p-8 space-y-12">
    <h1 class="text-2xl font-bold">Area Chart</h1>

    <section>
      <h2 class="text-lg font-semibold mb-4">Basic Composable API</h2>
      <p class="text-sm text-gray-500 mb-2">
        Uses &lt;AreaChart&gt; with &lt;Area&gt; children, &lt;ChartGrid&gt;, axes, tooltip, and
        legend.
      </p>
      <pre
        class="bg-gray-100 dark:bg-gray-900 rounded p-4 text-xs overflow-auto mb-4"
      ><code>&lt;AreaChart :data="data" x-data-key="date"&gt;
  &lt;Area data-key="revenue" fill="#8b5cf6" /&gt;
  &lt;Area data-key="expenses" fill="#ef4444" /&gt;
  &lt;ChartGrid /&gt;
  &lt;ChartXAxis /&gt;
  &lt;ChartYAxis /&gt;
  &lt;ChartTooltip show-crosshair /&gt;
  &lt;ChartLegend /&gt;
&lt;/AreaChart&gt;</code></pre>
    </section>

    <section>
      <h2 class="text-lg font-semibold mb-4">Compat API (vue-chrts style)</h2>
      <p class="text-sm text-gray-500 mb-2">
        Single-prop configuration matching the vue-chrts interface.
      </p>
      <pre
        class="bg-gray-100 dark:bg-gray-900 rounded p-4 text-xs overflow-auto mb-4"
      ><code>&lt;AreaChartCompat
  :data="data"
  :height="300"
  :categories="categories"
  :x-grid-line="true"
  :y-grid-line="true"
/&gt;</code></pre>
    </section>

    <section>
      <h2 class="text-lg font-semibold mb-4">Sample Data</h2>
      <pre class="bg-gray-100 dark:bg-gray-900 rounded p-4 text-xs overflow-auto max-h-60">{{
        JSON.stringify(data.slice(0, 5), null, 2)
      }}</pre>
    </section>
  </div>
</template>
