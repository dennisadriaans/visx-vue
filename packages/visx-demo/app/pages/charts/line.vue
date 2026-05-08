<script setup lang="ts">
/**
 * Line Chart demo — composable API with multiple lines.
 */
import { ref } from "vue";

const data = ref(generateData());

function generateData() {
  const now = Date.now();
  return Array.from({ length: 60 }, (_, i) => ({
    date: new Date(now - (59 - i) * 86400000).toISOString().slice(0, 10),
    users: Math.round(100 + Math.sin(i / 5) * 50 + Math.random() * 20),
    sessions: Math.round(200 + Math.cos(i / 7) * 80 + Math.random() * 30),
    pageviews: Math.round(500 + Math.sin(i / 3) * 150 + Math.random() * 50),
  }));
}

const categories = {
  users: { name: "Users", color: "#3b82f6" },
  sessions: { name: "Sessions", color: "#f59e0b" },
  pageviews: { name: "Page Views", color: "#10b981" },
};
</script>

<template>
  <div class="max-w-4xl mx-auto p-8 space-y-12">
    <h1 class="text-2xl font-bold">Line Chart</h1>

    <section>
      <h2 class="text-lg font-semibold mb-4">Multi-Series Lines</h2>
      <pre
        class="bg-gray-100 dark:bg-gray-900 rounded p-4 text-xs overflow-auto mb-4"
      ><code>&lt;LineChart :data="data" x-data-key="date"&gt;
  &lt;Line data-key="users" stroke="#3b82f6" /&gt;
  &lt;Line data-key="sessions" stroke="#f59e0b" /&gt;
  &lt;Line data-key="pageviews" stroke="#10b981" /&gt;
  &lt;ChartGrid /&gt;
  &lt;ChartXAxis /&gt;
  &lt;ChartYAxis /&gt;
  &lt;ChartTooltip show-crosshair show-dots /&gt;
  &lt;ChartLegend /&gt;
&lt;/LineChart&gt;</code></pre>
    </section>

    <section>
      <h2 class="text-lg font-semibold mb-4">Sample Data</h2>
      <pre class="bg-gray-100 dark:bg-gray-900 rounded p-4 text-xs overflow-auto max-h-60">{{
        JSON.stringify(data.slice(0, 5), null, 2)
      }}</pre>
    </section>
  </div>
</template>
