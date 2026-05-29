export interface SvgElement {
  type: 'circle' | 'rect'
  cx?: number
  cy?: number
  r?: number
  x?: number
  y?: number
  width?: number
  height?: number
  fill: string
  opacity: number
  rx?: number
}

export interface GalleryTileData {
  title: string
  description: string
  to: string
  elements: SvgElement[]
}

export const useGalleryTiles = () => {
  const neonColor = '#00DC82' // Nuxt Neon Green

  const galleryTiles: GalleryTileData[] = [
    {
      title: 'Bars',
      description: '@visx-vue/shape',
      to: '/charts/bar',
      elements: Array.from({ length: 8 }, (_, i) => ({
        type: 'rect' as const,
        x: i * 45 + 20,
        y: 280 - (Math.sin(i * 0.8) * 80 + 100),
        width: 32,
        height: Math.sin(i * 0.8) * 80 + 100,
        fill: neonColor,
        opacity: 0.1 + (i / 8) * 0.8,
        rx: 4
      }))
    },
    {
      title: 'Bar Group',
      description: '@visx-vue/shape @visx-vue/scale',
      to: '/charts/bargroup',
      elements: Array.from({ length: 9 }, (_, i) => ({
        type: 'rect' as const,
        x: Math.floor(i / 3) * 120 + (i % 3) * 32 + 20,
        y: 280 - ((i % 3) + 1) * 60,
        width: 24,
        height: ((i % 3) + 1) * 60,
        fill: neonColor,
        opacity: 0.3 + (i % 3) * 0.3,
        rx: 3
      }))
    },
    {
      title: 'Bar Stack',
      description: '@visx-vue/shape @visx-vue/scale',
      to: '/charts/barstack',
      elements: Array.from({ length: 4 }, (_, i) => [
        {
          type: 'rect' as const,
          x: i * 90 + 30,
          y: 200,
          width: 70,
          height: 80,
          fill: neonColor,
          opacity: 0.2,
          rx: 4
        },
        {
          type: 'rect' as const,
          x: i * 90 + 30,
          y: 130,
          width: 70,
          height: 70,
          fill: neonColor,
          opacity: 0.5,
          rx: 0
        },
        {
          type: 'rect' as const,
          x: i * 90 + 30,
          y: 60,
          width: 70,
          height: 70,
          fill: neonColor,
          opacity: 0.9,
          rx: 0
        }
      ]).flat()
    },
    {
      title: 'Areas',
      description: '@visx-vue/shape @visx-vue/curve',
      to: '/charts/area',
      elements: Array.from({ length: 5 }, (_, i) => ({
        type: 'rect' as const,
        x: 0,
        y: 60 + i * 40,
        width: 400,
        height: 30,
        fill: neonColor,
        opacity: 0.1 + i * 0.15,
        rx: 0
      }))
    },
    {
      title: 'Heatmaps',
      description: '@visx-vue/heatmap',
      to: '/charts/heatmap',
      elements: Array.from({ length: 25 }, (_, i) => ({
        type: 'rect' as const,
        x: (i % 5) * 70 + 25,
        y: Math.floor(i / 5) * 55 + 15,
        width: 60,
        height: 45,
        fill: neonColor,
        opacity: 0.1 + ((i * 7) % 10) * 0.1,
        rx: 6
      }))
    },
    {
      title: 'Axis',
      description: '@visx-vue/axis @visx-vue/scale',
      to: '/charts/axis',
      elements: [
        ...Array.from({ length: 6 }, (_, i) => ({
          type: 'rect' as const,
          x: i * 65 + 40,
          y: 260,
          width: 2,
          height: 10,
          fill: neonColor,
          opacity: 0.4,
          rx: 0
        })),
        ...Array.from({ length: 6 }, (_, i) => ({
          type: 'rect' as const,
          x: i * 65 + 40,
          y: 50 + (i % 3) * 50,
          width: 40,
          height: 210 - (50 + (i % 3) * 50),
          fill: neonColor,
          opacity: 0.6,
          rx: 4
        }))
      ]
    },
    {
      title: 'Curves',
      description: '@visx-vue/curve @visx-vue/shape',
      to: '/charts/curves',
      elements: Array.from({ length: 15 }, (_, i) => ({
        type: 'circle' as const,
        cx: i * 26 + 20,
        cy: 150 + Math.sin(i * 0.6) * 80,
        r: 6,
        fill: neonColor,
        opacity: 0.3 + (i / 15) * 0.7
      }))
    },
    {
      title: 'Pies',
      description: '@visx-vue/shape @visx-vue/scale',
      to: '/charts/pies',
      elements: Array.from({ length: 6 }, (_, i) => ({
        type: 'circle' as const,
        cx: 200 + Math.cos((i / 6) * Math.PI * 2) * 90,
        cy: 150 + Math.sin((i / 6) * Math.PI * 2) * 90,
        r: 35,
        fill: neonColor,
        opacity: 0.2 + (i / 6) * 0.7
      }))
    },
    {
      title: 'Treemap',
      description: '@visx-vue/hierarchy',
      to: '/charts/treemap',
      elements: [
        {
          type: 'rect' as const,
          x: 20,
          y: 20,
          width: 220,
          height: 160,
          fill: neonColor,
          opacity: 0.8,
          rx: 6
        },
        {
          type: 'rect' as const,
          x: 250,
          y: 20,
          width: 130,
          height: 100,
          fill: neonColor,
          opacity: 0.5,
          rx: 6
        },
        {
          type: 'rect' as const,
          x: 250,
          y: 130,
          width: 130,
          height: 50,
          fill: neonColor,
          opacity: 0.3,
          rx: 6
        },
        {
          type: 'rect' as const,
          x: 20,
          y: 190,
          width: 150,
          height: 90,
          fill: neonColor,
          opacity: 0.4,
          rx: 6
        },
        {
          type: 'rect' as const,
          x: 180,
          y: 190,
          width: 200,
          height: 90,
          fill: neonColor,
          opacity: 0.2,
          rx: 6
        }
      ]
    },
    {
      title: 'Dots',
      description: '@visx-vue/group @visx-vue/scale',
      to: '/charts/dots',
      elements: Array.from({ length: 40 }, (_, i) => ({
        type: 'circle' as const,
        cx: ((i * 137) % 360) + 20,
        cy: ((i * 153) % 260) + 20,
        r: (i % 6) + 3,
        fill: neonColor,
        opacity: 0.1 + (i % 10) * 0.08
      }))
    },
    {
      title: 'XYChart',
      description: '@visx-vue/xychart',
      to: '/charts/xychart',
      elements: Array.from({ length: 10 }, (_, i) => ({
        type: 'rect' as const,
        x: i * 36 + 25,
        y: 280 - ((i % 5) + 2) * 40,
        width: 28,
        height: ((i % 5) + 2) * 40,
        fill: neonColor,
        opacity: 0.2 + (i / 10) * 0.7,
        rx: 4
      }))
    }
  ]

  return {
    galleryTiles
  }
}
