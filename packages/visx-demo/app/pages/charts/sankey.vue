<script setup lang="ts">
/**
 * Sankey Chart demo — flow diagram.
 */
const data = {
  nodes: [
    { id: "source-a", label: "Source A" },
    { id: "source-b", label: "Source B" },
    { id: "source-c", label: "Source C" },
    { id: "process-1", label: "Process 1" },
    { id: "process-2", label: "Process 2" },
    { id: "output-x", label: "Output X" },
    { id: "output-y", label: "Output Y" },
  ],
  links: [
    { source: "source-a", target: "process-1", value: 30 },
    { source: "source-a", target: "process-2", value: 20 },
    { source: "source-b", target: "process-1", value: 40 },
    { source: "source-c", target: "process-2", value: 35 },
    { source: "process-1", target: "output-x", value: 50 },
    { source: "process-1", target: "output-y", value: 20 },
    { source: "process-2", target: "output-x", value: 25 },
    { source: "process-2", target: "output-y", value: 30 },
  ],
};
</script>

<template>
  <div class="max-w-4xl mx-auto p-8 space-y-12">
    <h1 class="text-2xl font-bold">Sankey Chart</h1>

    <section>
      <h2 class="text-lg font-semibold mb-4">Flow Diagram</h2>
      <pre
        class="bg-gray-100 dark:bg-gray-900 rounded p-4 text-xs overflow-auto mb-4"
      ><code>&lt;SankeyChart :data="data"&gt;
  &lt;SankeyNode /&gt;
  &lt;SankeyLink /&gt;
  &lt;SankeyTooltip /&gt;
&lt;/SankeyChart&gt;</code></pre>
    </section>

    <section>
      <h2 class="text-lg font-semibold mb-4">Sample Data</h2>
      <pre class="bg-gray-100 dark:bg-gray-900 rounded p-4 text-xs overflow-auto max-h-60">{{
        JSON.stringify(data, null, 2)
      }}</pre>
    </section>
  </div>
</template>
