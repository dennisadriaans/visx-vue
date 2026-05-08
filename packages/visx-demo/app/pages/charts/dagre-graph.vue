<script setup lang="ts">
/**
 * Dagre Graph demo — directed acyclic graph with zoom.
 */
const data = {
  nodes: [
    { id: "start", label: "Start" },
    { id: "fetch-data", label: "Fetch Data" },
    { id: "validate", label: "Validate" },
    { id: "transform", label: "Transform" },
    { id: "cache", label: "Cache" },
    { id: "store", label: "Store" },
    { id: "notify", label: "Notify" },
    { id: "end", label: "End" },
  ],
  links: [
    { source: "start", target: "fetch-data" },
    { source: "fetch-data", target: "validate" },
    { source: "validate", target: "transform" },
    { source: "transform", target: "cache" },
    { source: "transform", target: "store" },
    { source: "cache", target: "notify" },
    { source: "store", target: "notify" },
    { source: "notify", target: "end" },
  ],
};
</script>

<template>
  <div class="max-w-4xl mx-auto p-8 space-y-12">
    <h1 class="text-2xl font-bold">Dagre Graph</h1>

    <section>
      <h2 class="text-lg font-semibold mb-4">Directed Graph with Zoom</h2>
      <pre
        class="bg-gray-100 dark:bg-gray-900 rounded p-4 text-xs overflow-auto mb-4"
      ><code>&lt;DagreGraph
  :data="data"
  node-shape="circle"
  node-fill="#3b82f6"
  link-arrow="end"
  :link-curvature="0.2"
  zoom-enabled
/&gt;</code></pre>
    </section>

    <section>
      <h2 class="text-lg font-semibold mb-4">Different Node Shapes</h2>
      <pre
        class="bg-gray-100 dark:bg-gray-900 rounded p-4 text-xs overflow-auto mb-4"
      ><code>&lt;!-- Square nodes --&gt;
&lt;DagreGraph :data="data" node-shape="square" /&gt;

&lt;!-- Diamond nodes --&gt;
&lt;DagreGraph :data="data" node-shape="diamond" /&gt;

&lt;!-- Left-to-right layout --&gt;
&lt;DagreGraph :data="data" :dagre-layout-settings="{ rankdir: 'LR' }" /&gt;</code></pre>
    </section>

    <section>
      <h2 class="text-lg font-semibold mb-4">Sample Data</h2>
      <pre class="bg-gray-100 dark:bg-gray-900 rounded p-4 text-xs overflow-auto max-h-60">{{
        JSON.stringify(data, null, 2)
      }}</pre>
    </section>
  </div>
</template>
