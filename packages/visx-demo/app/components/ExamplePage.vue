<template>
  <UContainer class="py-8 md:py-16">
    <div class="mb-6">
      <ULink
        :to="backTo ?? '/charts'"
        class="text-sm text-muted inline-flex items-center gap-1 mb-3 hover:text-highlighted transition-colors"
      >
        <UIcon name="i-lucide-chevron-left"></UIcon>
        {{ backLabel ?? 'Gallery' }}
      </ULink>
      <h1
        class="text-[clamp(2rem,5vw,3.25rem)] font-bold tracking-tight leading-none text-highlighted"
      >
        {{ title }}
      </h1>
      <p
        v-if="description"
        class="mt-2 text-toned text-lg"
      >
        {{ description }}
      </p>
    </div>

    <div class="rounded-[--ui-radius] overflow-hidden w-full min-h-[400px]">
      <slot />
    </div>

    <div
      v-if="packages?.length"
      class="mt-12"
    >
      <h2 class="text-base font-semibold text-highlighted mb-4">Packages used</h2>
      <div class="flex flex-wrap gap-2">
        <UBadge
          v-for="pkg in packages"
          :key="pkg"
          color="neutral"
          variant="subtle"
          size="sm"
          as="a"
          :href="`https://github.com/airbnb/visx/tree/master/packages/${pkg.replace('@visx-vue/', 'visx-')}`"
          target="_blank"
          rel="noopener noreferrer"
          class="font-mono"
        >
          {{ pkg }}
        </UBadge>
      </div>
    </div>
  </UContainer>
</template>

<script setup lang="ts">
defineProps<{
  title: string
  description?: string
  packages?: string[]
  backTo?: string
  backLabel?: string
}>()
</script>
