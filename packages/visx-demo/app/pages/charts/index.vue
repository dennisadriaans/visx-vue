<template>
  <UContainer class="py-24">
    <div class="mb-20 max-w-3xl">
      <h1 class="mb-6 text-5xl font-semibold tracking-tight text-highlighted sm:text-6xl">
        Charts
      </h1>
      <p class="text-xl leading-relaxed text-muted">
        Production-ready chart examples built with visx-vue primitives.
      </p>
    </div>

    <div class="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
      <GalleryTile
        v-for="tile in chartTiles"
        :key="tile.title"
        :title="tile.title"
        :description="tile.description"
        :to="tile.to"
        :elements="tile.elements"
      />
    </div>

    <div class="mt-24 mb-8 max-w-3xl">
      <h2 class="mb-4 text-3xl font-semibold tracking-tight text-highlighted sm:text-4xl">
        Specialized Demos
      </h2>
      <p class="text-lg leading-relaxed text-muted">
        Focused examples for radial, hierarchical, geo, network, and distribution-style charts.
      </p>
    </div>

    <div class="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
      <NuxtLink
        v-for="chart in additionalCharts"
        :key="chart.to"
        :to="chart.to"
        class="rounded-xl border border-default bg-muted/30 p-5 transition-colors hover:border-highlighted hover:bg-muted/50"
      >
        <h3 class="text-lg font-semibold text-highlighted">
          {{ chart.title }}
        </h3>
        <p class="mt-2 text-sm leading-relaxed text-muted">
          {{ chart.description }}
        </p>
      </NuxtLink>
    </div>
  </UContainer>
</template>

<script setup lang="ts">
const { galleryTiles } = useGalleryTiles()

const chartTiles = computed(() =>
  galleryTiles.map((t) => (t.to === '/charts/treemap' ? { ...t, to: '/charts/treemap' } : t))
)

const additionalCharts = [
  {
    title: 'Calendar Heatmap',
    to: '/charts/calendar-heatmap',
    description: 'Date-based heatmap cells across a calendar grid.'
  },
  {
    title: 'Chord',
    to: '/charts/chord',
    description: 'Circular relationship ribbons between connected groups.'
  },
  {
    title: 'Delaunay Triangulation',
    to: '/charts/delaunay-triangulation',
    description: 'Point meshes and nearest-neighbor triangulation overlays.'
  },
  {
    title: 'Delaunay Voronoi',
    to: '/charts/delaunay-voronoi',
    description: 'Dual Voronoi cells and Delaunay structures for point sets.'
  },
  {
    title: 'Dendrograms',
    to: '/charts/dendrograms',
    description: 'Clustered hierarchical trees with branch depth emphasis.'
  },
  {
    title: 'Geo Albers USA',
    to: '/charts/geo-albers-usa',
    description: 'US map rendering with the Albers USA projection.'
  },
  {
    title: 'Geo Custom',
    to: '/charts/geo-custom',
    description: 'Custom map projection and zoomable geographic rendering.'
  },
  {
    title: 'Geo Mercator',
    to: '/charts/geo-mercator',
    description: 'Mercator projection for choropleth-style world maps.'
  },
  {
    title: 'Line Radial',
    to: '/charts/lineradial',
    description: 'Radial line chart around a circular coordinate system.'
  },
  {
    title: 'Link Types',
    to: '/charts/linktypes',
    description: 'Tree link variants for hierarchical diagrams.'
  },
  {
    title: 'Network',
    to: '/charts/network',
    description: 'Node-link diagrams for graph and relationship data.'
  },
  {
    title: 'Radial Bars',
    to: '/charts/radial-bars',
    description: 'Bar chart values arranged around a polar axis.'
  },
  {
    title: 'Split Line Path',
    to: '/charts/splitlinepath',
    description: 'Segmented line paths with style changes per section.'
  },
  {
    title: 'Stats Plot',
    to: '/charts/statsplot',
    description: 'Box plots and violin plots for statistical distributions.'
  },
  {
    title: 'Streamgraph',
    to: '/charts/streamgraph',
    description: 'Stacked flowing areas for temporal composition changes.'
  },
  {
    title: 'Threshold',
    to: '/charts/threshold',
    description: 'Threshold regions and area fills above or below a cut line.'
  },
  {
    title: 'Trees',
    to: '/charts/trees',
    description: 'Tree layouts for rooted hierarchical structures.'
  },
  {
    title: 'Voronoi',
    to: '/charts/voronoi',
    description: 'Voronoi partitions for interaction over scattered points.'
  },
  {
    title: 'Wordcloud',
    to: '/charts/wordcloud',
    description: 'Weighted word placement driven by frequency and angle.'
  }
] as const

useHead({ title: 'Charts — visx-vue' })
</script>
