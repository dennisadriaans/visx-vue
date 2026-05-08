<script setup lang="ts">
/**
 * High-Level Charts Gallery — index page for @visx-vue/charts demos.
 */
const charts = [
  { name: "Area Chart", path: "/charts/area", description: "Time series with filled areas" },
  { name: "Line Chart", path: "/charts/line", description: "Multi-series line chart" },
  { name: "Bar Chart", path: "/charts/bar", description: "Grouped and stacked bars" },
  { name: "Donut/Pie Chart", path: "/charts/donut", description: "Donut and pie slices" },
  { name: "Bubble Chart", path: "/charts/bubble", description: "Scatter plot with sized bubbles" },
  { name: "Gantt Chart", path: "/charts/gantt", description: "Project timelines" },
  { name: "Dual Chart", path: "/charts/dual", description: "Bars + lines on dual axes" },
  { name: "Sankey Chart", path: "/charts/sankey", description: "Flow/alluvial diagram" },
  { name: "Dagre Graph", path: "/charts/dagre-graph", description: "Directed acyclic graph" },
  { name: "Candlestick", path: "/charts/candlestick", description: "OHLC financial chart" },
  { name: "Radar Chart", path: "/charts/radar", description: "Multi-metric comparison" },
  { name: "Ring Chart", path: "/charts/ring", description: "Concentric progress rings" },
  { name: "Funnel Chart", path: "/charts/funnel", description: "Conversion funnel" },
  { name: "Dotted Map", path: "/charts/dotted-map", description: "World map with dot grid" },
  { name: "TopoJSON Map", path: "/charts/topo-json-map", description: "Choropleth map" },
];
</script>

<template>
  <div class="max-w-4xl mx-auto p-8">
    <h1 class="text-3xl font-bold mb-2">@visx-vue/charts</h1>
    <p class="text-gray-500 mb-8">
      High-level chart components built on visx-vue primitives. Each chart supports both composable
      (child-component) and compat (vue-chrts) APIs.
    </p>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <NuxtLink
        v-for="chart in charts"
        :key="chart.path"
        :to="chart.path"
        class="block rounded-lg border p-4 hover:border-blue-500 hover:shadow-md transition-all"
      >
        <h3 class="font-semibold text-base">{{ chart.name }}</h3>
        <p class="text-sm text-gray-500 mt-1">{{ chart.description }}</p>
      </NuxtLink>
    </div>
  </div>
</template>
