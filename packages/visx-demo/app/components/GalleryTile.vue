<template>
  <NuxtLink :to="to" class="gallery-tile" ref="tileRef" :style="tileStyle">
    <div class="image">
      <svg viewBox="0 0 400 300" width="100%" height="100%" preserveAspectRatio="xMidYMid slice">
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
    <div class="details" v-if="title || description">
      <div class="title" v-if="title">{{ title }}</div>
      <div class="description" v-if="description">{{ description }}</div>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
interface SvgElement {
  type: "circle" | "rect";
  cx?: number;
  cy?: number;
  r?: number;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  fill: string;
  opacity: number;
  rx?: number;
}

const props = withDefaults(
  defineProps<{
    title?: string;
    description?: string;
    to: string;
    color1: string;
    color2: string;
    elements: SvgElement[];
    tileStyle?: Record<string, string>;
  }>(),
  {
    tileStyle: () => ({}),
  },
);
</script>

<style scoped>
.gallery-tile {
  background: var(--color-surface);
  display: flex;
  height: 360px;
  flex-direction: column;
  border-radius: var(--radius);
  overflow: hidden;
  cursor: pointer;
  text-decoration: none;
  color: inherit;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.gallery-tile:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
}

.image {
  flex: 1;
  display: flex;
  overflow: hidden;
}

.details {
  text-align: center;
  padding: 12px 16px;
  background: rgba(0, 0, 0, 0.75);
  color: #ffffff;
}

.title {
  font-weight: 700;
  font-size: 0.9rem;
  line-height: 1.2;
}

.description {
  font-weight: 300;
  font-size: 12px;
  margin-top: 2px;
  opacity: 0.7;
}

@media (max-width: 960px) {
  .gallery-tile {
    height: 300px;
  }
}

@media (max-width: 600px) {
  .gallery-tile {
    height: 260px;
  }
}
</style>
