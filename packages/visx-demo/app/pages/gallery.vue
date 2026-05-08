<template>
  <UContainer class="py-24">
    <div class="mb-20 max-w-3xl">
      <h1 class="mb-6 text-5xl font-semibold tracking-tight text-highlighted sm:text-6xl">
        Gallery
      </h1>
      <p class="text-xl leading-relaxed text-muted">
        Examples will appear here as packages are ported. Each tile links to a demo page with full
        source code.
      </p>
    </div>

    <div class="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
      <GalleryTile
        v-for="tile in galleryTiles"
        :key="tile.title"
        :title="tile.title"
        :description="tile.description"
        :to="tile.to"
        :elements="tile.elements"
      />
    </div>
  </UContainer>
</template>

<script setup lang="ts">
const { galleryTiles } = useGalleryTiles();
useHead({ title: "Gallery — visx-vue" });
</script>
