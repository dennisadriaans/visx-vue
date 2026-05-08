<script setup lang="ts">
import { ref } from "vue";

const activeTab = ref("design-systems");

const tabs = [
  { id: "charts", label: "Chart primitives", icon: "i-heroicons-chart-bar" },
  { id: "templates", label: "Layouts & specialized", icon: "i-heroicons-squares-2x2" },
  { id: "blocks", label: "Interactions", icon: "i-heroicons-cube" },
  { id: "dashboards", label: "SVG utilities", icon: "i-heroicons-window" },
  { id: "launch", label: "Data utilities", icon: "i-heroicons-rocket-launch" },
];
</script>

<template>
  <div class="relative overflow-hidden">
    <UPageHero
      :ui="{
        root: 'flex flex-col items-center justify-center',
        container: 'border-x border-default px-0 lg:px-0 lg:pt-24 lg:pb-8',
        headline: 'mb-8',
        title:
          'mb-6 text-5xl font-semibold tracking-tight sm:text-7xl lg:text-[5rem] lg:leading-tighter text-highlighted',
        description: 'mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-muted text-center',
        links: 'flex items-center justify-center gap-4',
      }"
    >
      <template #headline>
        <NuxtLink target="_blank" to="https://github.com/airbnb/visx">
          <UBadge
            class="px-4 py-1.5 text-sm backdrop-blur-sm"
            variant="soft"
            color="neutral"
            rounded
          >
            <span class="mr-2">inspired by airbnb/visx</span>
            <UIcon name="i-heroicons-arrow-right" class="h-4 w-4" />
          </UBadge>
        </NuxtLink>
      </template>

      <template #title> visx-vue </template>

      <template #description>
        visx-vue a collection of expressive, low-level visualization primitives for Vue     
      </template>

      <template #links>
        <UButton
          label="Browse Gallery"
          to="/gallery"
          color="neutral"
          variant="solid"
          size="xl"
          class="px-8 py-3.5 font-medium"
        />
        <UButton
          label="View on GitHub"
          to="https://github.com/airbnb/visx"
          target="_blank"
          color="neutral"
          variant="ghost"
          size="xl"
          class="px-8 py-3.5 font-medium border border-default"
        />
      </template>
      <div class="relative overflow-hidden">
        <div class="p-6">
          <img src="/hero-image.png" alt="" />
        </div>
      </div>
    </UPageHero>

    <!-- Segmented Navigation Box -->
    <div class="max-w-7xl mx-auto border border-default">
      <div class="grid grid-cols-2 md:grid-cols-5 divide-x divide-default max-w-350 mx-auto">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          class="relative flex items-center justify-center gap-2 py-6 text-sm font-medium transition-colors"
          :class="[
            activeTab === tab.id ? '' : 'text-muted hover:text-default hover:bg-muted',
            tab.id === 'launch' ? 'hidden md:flex' : '',
          ]"
          @click="activeTab = tab.id"
        >
          <UIcon :name="tab.icon" class="h-5 w-5" />
          {{ tab.label }}

          <!-- Active Indicator Line -->
          <div
            v-if="activeTab === tab.id"
            class="absolute bottom-0 left-0 h-px w-full bg-primary transition-all duration-300"
          />
        </button>
      </div>
    </div>
  </div>
</template>
