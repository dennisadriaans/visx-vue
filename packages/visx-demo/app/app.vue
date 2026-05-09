<script setup lang="ts">
import type { ContentNavigationItem, PageCollections } from "@nuxt/content";

const { data: navigation } = await useAsyncData("navigation", () =>
  queryCollectionNavigation("docs" as keyof PageCollections),
);

const { data: files } = useLazyAsyncData(
  "search",
  () => queryCollectionSearchSections("docs" as keyof PageCollections),
  { server: false },
);

provide("navigation", navigation);
</script>

<template>
  <UApp>
    <NuxtLoadingIndicator color="var(--ui-primary)" />
    <AppHeader />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    <AppFooter />
    <ClientOnly>
      <LazyUContentSearch :files="files" :navigation="navigation" />
    </ClientOnly>
  </UApp>
</template>
