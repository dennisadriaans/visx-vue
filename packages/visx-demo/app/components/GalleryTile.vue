<template>
  <NuxtLink
    :to="to"
    class="group relative flex h-[320px] flex-col overflow-hidden rounded-xl border border-transparent transition-all duration-300 bg-elevated/20"
  >
    <!-- Background subtle pattern -->
    <div
      class="absolute inset-0 opacity-[0.03] transition-opacity group-hover:opacity-[0.05]"
      style="
        background-image: radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0);
        background-size: 24px 24px;
      "
    />

    <!-- SVG Preview Area -->
    <div class="relative flex-1 overflow-hidden p-6">
      <div
        class="h-full w-full transform transition-transform duration-500 ease-out group-hover:scale-[1.02]"
      >
        <svg
          viewBox="0 0 400 320"
          class="h-full w-full overflow-visible"
          preserveAspectRatio="xMidYMid meet"
          fill="none"
        >
          <!-- 1. BACKGROUND GRID: Rendered first = bottom layer -->
          <g
            stroke="white"
            stroke-opacity="0.30"
            stroke-width="0.75"
            stroke-dasharray="2 4"
          >
            <!-- Horizontal lines -->
            <line
              x1="0"
              y1="80"
              x2="400"
              y2="80"
            />
            <line
              x1="0"
              y1="160"
              x2="400"
              y2="160"
            />
            <line
              x1="0"
              y1="240"
              x2="400"
              y2="240"
            />
            <!-- Vertical lines -->
            <line
              x1="100"
              y1="0"
              x2="100"
              y2="320"
            />
            <line
              x1="200"
              y1="0"
              x2="200"
              y2="320"
            />
            <line
              x1="300"
              y1="0"
              x2="300"
              y2="320"
            />
          </g>

          <!-- 2. DYNAMIC ELEMENTS: Rendered second = top layer -->
          <template
            v-for="(el, i) in elements"
            :key="i"
          >
            <circle
              v-if="el.type === 'circle'"
              :cx="el.cx"
              :cy="el.cy"
              :r="el.r"
              fill="#00DC82"
              class="transition-all duration-500 ease-in-out"
              :style="{ opacity: el.opacity }"
            />
            <rect
              v-else-if="el.type === 'rect'"
              :x="el.x"
              :y="el.y"
              :width="el.width"
              :height="el.height"
              fill="#00DC82"
              :rx="el.rx"
              class="transition-all duration-500 ease-in-out"
              :style="{ opacity: el.opacity }"
            />
          </template>
        </svg>
      </div>
    </div>

    <!-- Content Area -->
    <div class="relative p-5 pt-0">
      <div class="flex items-end justify-between">
        <div>
          <h3 class="text-sm font-semibold tracking-tight text-highlighted">
            {{ title }}
          </h3>
          <p class="mt-0.5 text-xs text-highlighted/80">
            {{ description }}
          </p>
        </div>
        <div
          class="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 opacity-0 transition-all duration-300 group-hover:opacity-100"
        >
          <UIcon
            name="i-heroicons-arrow-up-right"
            class="h-4 w-4 text-white"
          />
        </div>
      </div>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
import type { SvgElement } from '~/composables/useGalleryTiles'

defineProps<{
  title?: string
  description?: string
  to: string
  elements: SvgElement[]
  color?: string
}>()
</script>
