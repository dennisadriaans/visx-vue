<script setup lang="ts">
/**
 * Gantt Chart demo — timeline visualization.
 */
const categories = {
  design: { color: "#8b5cf6", label: "Design" },
  development: { color: "#3b82f6", label: "Development" },
  testing: { color: "#22c55e", label: "Testing" },
  deployment: { color: "#f59e0b", label: "Deployment" },
};

const data = [
  { task: "Wireframes", start: 0, duration: 3, type: "design" },
  { task: "UI Mockups", start: 2, duration: 4, type: "design" },
  { task: "API Design", start: 1, duration: 3, type: "development" },
  { task: "Frontend", start: 4, duration: 6, type: "development" },
  { task: "Backend", start: 3, duration: 7, type: "development" },
  { task: "Integration", start: 8, duration: 3, type: "testing" },
  { task: "QA", start: 9, duration: 4, type: "testing" },
  { task: "Staging", start: 12, duration: 2, type: "deployment" },
  { task: "Production", start: 13, duration: 1, type: "deployment" },
];
</script>

<template>
  <div class="max-w-4xl mx-auto p-8 space-y-12">
    <h1 class="text-2xl font-bold">Gantt Chart</h1>

    <section>
      <h2 class="text-lg font-semibold mb-4">Project Timeline</h2>
      <pre
        class="bg-gray-100 dark:bg-gray-900 rounded p-4 text-xs overflow-auto mb-4"
      ><code>&lt;GanttChart
  :data="data"
  :categories="categories"
  :x="d => d.start"
  :length="d => d.duration"
  :type="d => d.type"
  :label="d => d.task"
  :label-width="120"
  :line-width="10"
  :row-height="32"
  x-grid-line
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
