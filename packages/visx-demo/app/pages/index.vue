<template>
  <HeroApplicationHero />
</template>

<script setup lang="ts">
useHead({ title: "visx-vue — Visualization Primitives for Vue" });

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

interface PreviewTile {
  label: string;
  to: string;
  color1: string;
  color2: string;
  elements: SvgElement[];
}

const previewTiles: PreviewTile[] = [
  {
    label: "Dots",
    to: "/dots",
    color1: "#1a1a2e",
    color2: "#16213e",
    elements: Array.from({ length: 40 }, () => ({
      type: "circle" as const,
      cx: Math.random() * 400,
      cy: Math.random() * 300,
      r: Math.random() * 12 + 3,
      fill: `hsl(${Math.random() * 60 + 160}, 70%, 60%)`,
      opacity: Math.random() * 0.5 + 0.4,
    })),
  },
  {
    label: "Bars",
    to: "/bars",
    color1: "#0f3460",
    color2: "#533483",
    elements: Array.from({ length: 10 }, (_, i) => ({
      type: "rect" as const,
      x: i * 40 + 5,
      y: 300 - Math.random() * 250 - 20,
      width: 32,
      height: Math.random() * 250 + 20,
      fill: `hsl(${i * 20 + 200}, 70%, 65%)`,
      opacity: 0.85,
      rx: 4,
    })),
  },
  {
    label: "Radial",
    to: "/radial-bars",
    color1: "#e94560",
    color2: "#533483",
    elements: Array.from({ length: 20 }, (_, i) => ({
      type: "circle" as const,
      cx: 200,
      cy: 150,
      r: (20 - i) * 7,
      fill: "none",
      opacity: 0.3 + i * 0.03,
    })),
  },
  {
    label: "Areas",
    to: "/areas",
    color1: "#2d6a4f",
    color2: "#1b4332",
    elements: Array.from({ length: 8 }, (_, i) => ({
      type: "rect" as const,
      x: 0,
      y: 40 + i * 30,
      width: 400,
      height: 20,
      fill: `hsl(${150 + i * 10}, 50%, ${45 + i * 5}%)`,
      opacity: 0.5,
      rx: 0,
    })),
  },
];
</script>

<style scoped>
.home {
  align-self: center;
  background: var(--color-bg);
  min-height: 80vh;
  margin: 0 auto;
  padding-bottom: 1rem;
}

.hero-container {
  max-width: 105rem;
  height: 50vh;
  min-height: 320px;
  background: var(--color-accent);
  position: relative;
  border-radius: var(--radius);
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
}

.hero-bg {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(circle at 30% 50%, rgba(255, 255, 255, 0.12) 0%, transparent 60%),
    radial-gradient(circle at 70% 40%, rgba(0, 0, 0, 0.08) 0%, transparent 50%);
}

.hero-content {
  position: relative;
  z-index: 1;
  text-align: center;
  color: #ffffff;
}

.hero-title {
  font-size: clamp(3rem, 8vw, 7rem);
  font-weight: 900;
  letter-spacing: -0.04em;
  line-height: 1;
  margin: 0;
}

.accent {
  opacity: 0.7;
}

.hero-subtitle {
  font-size: clamp(1rem, 2vw, 1.5rem);
  font-weight: 300;
  margin-top: 0.75rem;
  opacity: 0.85;
}

/* Content Grid */
.content-grid {
  max-width: 105rem;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: flex-start;
  gap: 2rem;
  margin-top: 2rem;
}

.content {
  max-width: 680px;
  padding: 0 1rem;
}

.content h3 {
  font-size: clamp(1.5rem, 3vw, 2.25rem);
  font-weight: 300;
  line-height: 1.15;
  color: var(--color-text-secondary);
  margin-bottom: 1.25rem;
}

.content h3 strong {
  font-size: clamp(1.75rem, 3.5vw, 2.5rem);
  color: var(--color-text);
  font-weight: 600;
}

.content p {
  font-size: 1.05rem;
  line-height: 1.6;
  margin-bottom: 1rem;
  color: var(--color-text-secondary);
}

.content ol {
  padding-left: 1.25rem;
  margin-bottom: 1rem;
}

.content li {
  list-style: decimal;
  margin-bottom: 0.75rem;
  line-height: 1.5;
  color: var(--color-text-secondary);
}

.content li strong {
  color: var(--color-text);
  font-weight: 600;
}

/* Links/Preview Section */
.links {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 1rem;
}

.buttons {
  grid-column: span 2;
}

.btn {
  display: block;
  width: 100%;
  font-size: 1.1rem;
  padding: 0.9rem 0;
  border-radius: var(--radius);
  font-weight: 500;
  text-align: center;
  transition: all 0.2s ease;
  cursor: pointer;
  border: none;
}

.btn-primary {
  background: var(--color-border);
  color: var(--color-text);
}

.btn-primary:hover {
  background: #ddd;
}

.btn-secondary {
  background: var(--color-border);
  color: var(--color-text);
}

.btn-secondary:hover {
  background: #ddd;
}

.preview-tile {
  border-radius: var(--radius);
  overflow: hidden;
  height: 320px;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.preview-tile:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
}

.preview-tile:first-of-type {
  grid-column: span 2;
  height: 380px;
}

.preview-link {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.preview-svg {
  flex: 1;
  overflow: hidden;
  display: flex;
}

.preview-label {
  padding: 0.6rem 1rem;
  font-weight: 600;
  font-size: 0.85rem;
  background: rgba(0, 0, 0, 0.6);
  color: #fff;
}

@media (max-width: 800px) {
  .content-grid {
    grid-template-columns: 1fr;
  }

  .buttons {
    grid-column: span 1;
  }

  .preview-tile:first-of-type {
    grid-column: span 1;
  }

  .links {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 600px) {
  .hero-container {
    height: 35vh;
    min-height: 240px;
  }

  .content h3 {
    width: 100%;
  }

  .preview-tile {
    height: 45vw;
  }
}
</style>
