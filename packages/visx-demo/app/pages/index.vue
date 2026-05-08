<template>
  <div class="pb-16">
    <HeroApplicationHero />

    <UContainer class="py-20">
      <div class="mb-12 text-center">
        <h2 class="mb-4 text-4xl font-extrabold tracking-tight text-highlighted sm:text-5xl">
          Featured Examples
        </h2>
        <p class="mx-auto max-w-2xl text-lg text-muted">
          Explore what's possible with visx-vue. These examples demonstrate the power and
          flexibility of our low-level primitives.
        </p>
      </div>

      <div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <GalleryTile
          v-for="tile in featuredTiles"
          :key="tile.title"
          :title="tile.title"
          :description="tile.description"
          :color1="tile.color1"
          :color2="tile.color2"
          :to="tile.to"
          :elements="tile.elements"
        />
      </div>

      <div class="mt-12 flex justify-center">
        <UButton
          to="/gallery"
          label="View all examples"
          color="neutral"
          variant="outline"
          size="xl"
          icon="i-heroicons-arrow-right"
          trailing
          class="px-8"
        />
      </div>
    </UContainer>
  </div>
</template>

<script setup lang="ts">
const { galleryTiles } = useGalleryTiles();

// Select 6 featured tiles for the home page
const featuredTiles = computed(() => {
  const featuredTitles = ["Bars", "Areas", "Heatmaps", "Pies", "XYChart", "Curves"];
  return galleryTiles.filter((tile) => featuredTitles.includes(tile.title)).slice(0, 6);
});

useHead({
  title: "visx-vue — Visualization Primitives for Vue",
  meta: [
    {
      name: "description",
      content:
        "visx-vue is a collection of expressive, low-level visualization primitives for Vue, ported from airbnb/visx.",
    },
  ],
});
</script>
