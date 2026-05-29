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
        links: 'flex items-center justify-center gap-4'
      }"
    >
      <template #headline>
        <NuxtLink
          target="_blank"
          to="https://github.com/airbnb/visx"
        >
          <UBadge
            class="px-4 py-1.5 text-sm backdrop-blur-sm"
            variant="soft"
            color="neutral"
            rounded
          >
            <span class="mr-2">inspired by airbnb/visx</span>
            <UIcon
              name="i-heroicons-arrow-right"
              class="h-4 w-4"
            />
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
          to="/charts"
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
          <img
            src="/hero-image.png"
            alt=""
          />
        </div>
      </div>
    </UPageHero>
  </div>
</template>
