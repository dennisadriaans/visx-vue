<template>
  <NuxtLink
    :to="to"
    class="group relative flex h-[320px] flex-col overflow-hidden rounded-2xl border border-default bg-surface transition-all hover:-translate-y-1 hover:shadow-xl"
  >
    <div class="flex-1 overflow-hidden">
      <svg viewBox="0 0 400 300" class="h-full w-full object-cover">
        <defs>
          <linearGradient :id="`tile-grad-${title}`" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" :stop-color="color1" />
            <stop offset="100%" :stop-color="color2" />
          </linearGradient>
        </defs>
        <rect width="400" height="300" :fill="`url(#tile-grad-${title})`" />
        <template v-for="(el, i) in elements" :key="i">
          <circle
            v-if="el.type === 'circle'"
            :cx="el.cx"
            :cy="el.cy"
            :r="el.r"
            :fill="el.fill"
            :opacity="el.opacity"
          />
          <rect
            v-else-if="el.type === 'rect'"
            :x="el.x"
            :y="el.y"
            :width="el.width"
            :height="el.height"
            :fill="el.fill"
            :opacity="el.opacity"
            :rx="el.rx"
          />
        </template>
      </svg>
    </div>

    <div
      class="absolute inset-x-0 bottom-0 flex flex-col items-center justify-center bg-black/60 p-4 text-center backdrop-blur-sm transition-colors group-hover:bg-black/70"
    >
      <div v-if="title" class="text-sm font-bold text-white">
        {{ title }}
      </div>
      <div v-if="description" class="mt-0.5 text-[11px] font-medium text-white/70">
        {{ description }}
      </div>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
import type { SvgElement } from "~/composables/useGalleryTiles";

const props = defineProps<{
  title?: string;
  description?: string;
  to: string;
  color1: string;
  color2: string;
  elements: SvgElement[];
}>();
</script>
