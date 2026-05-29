import type { SvgElement } from '~/composables/useGalleryTiles'

export interface ChartTileData {
  title: string
  description: string
  to: string
  elements: SvgElement[]
}

export const useChartTiles = () => {
  const round = (value: number) => Number(value.toFixed(3))

  const chartTiles: ChartTileData[] = [
    {
      title: 'Area Chart',
      description: 'Single area + stacked browser usage',
      to: '/charts/area',
      elements: [
        ...Array.from({ length: 8 }, (_, i) => ({
          type: 'rect' as const,
          x: i * 50,
          y: round(120 + Math.sin(i * 0.8) * 60),
          width: 52,
          height: round(180 - (120 + Math.sin(i * 0.8) * 60)),
          fill: 'white',
          opacity: 0.15 + i * 0.03,
          rx: 0
        })),
        ...Array.from({ length: 8 }, (_, i) => ({
          type: 'circle' as const,
          cx: i * 50 + 25,
          cy: round(120 + Math.sin(i * 0.8) * 60),
          r: 5,
          fill: 'white',
          opacity: 0.9
        }))
      ]
    },
    {
      title: 'Bar Chart',
      description: 'Vertical & horizontal bar with tooltips',
      to: '/charts/bar',
      elements: [
        ...Array.from({ length: 6 }, (_, i) => ({
          type: 'rect' as const,
          x: i * 55 + 15,
          y: round(280 - (Math.sin(i * 0.9 + 0.5) * 70 + 80)),
          width: 40,
          height: round(Math.sin(i * 0.9 + 0.5) * 70 + 80),
          fill: 'white',
          opacity: 0.2 + (i / 6) * 0.7,
          rx: 4
        })),
        ...Array.from({ length: 4 }, (_, i) => ({
          type: 'rect' as const,
          x: 20,
          y: i * 30 + 20,
          width: 40 + i * 50,
          height: 18,
          fill: 'white',
          opacity: 0.35 + i * 0.12,
          rx: 3
        }))
      ]
    },
    {
      title: 'Bar Group',
      description: 'Grouped bars for multi-series comparison',
      to: '/charts/bargroup',
      elements: Array.from({ length: 9 }, (_, i) => ({
        type: 'rect' as const,
        x: Math.floor(i / 3) * 120 + (i % 3) * 36 + 20,
        y: 280 - ((i % 3) + 1) * 65,
        width: 28,
        height: ((i % 3) + 1) * 65,
        fill: 'white',
        opacity: [0.4, 0.65, 0.9][i % 3],
        rx: 3
      }))
    },
    {
      title: 'Bar Stack',
      description: 'Stacked bars with tooltip and legend',
      to: '/charts/barstack',
      elements: Array.from({ length: 4 }, (_, i) => [
        {
          type: 'rect' as const,
          x: i * 90 + 20,
          y: 195,
          width: 70,
          height: 85,
          fill: 'white',
          opacity: 0.2,
          rx: 4
        },
        {
          type: 'rect' as const,
          x: i * 90 + 20,
          y: 125,
          width: 70,
          height: 70,
          fill: 'white',
          opacity: 0.5,
          rx: 0
        },
        {
          type: 'rect' as const,
          x: i * 90 + 20,
          y: 55,
          width: 70,
          height: 70,
          fill: 'white',
          opacity: 0.85,
          rx: 0
        }
      ]).flat()
    },
    {
      title: 'Line Chart',
      description: 'Single line + multi-city temperature',
      to: '/charts/line',
      elements: [
        ...Array.from({ length: 12 }, (_, i) => ({
          type: 'circle' as const,
          cx: i * 32 + 20,
          cy: round(150 + Math.sin(i * 0.55) * 80),
          r: 5,
          fill: 'white',
          opacity: 0.85
        })),
        ...Array.from({ length: 11 }, (_, i) => {
          const x1 = i * 32 + 20
          const y1 = round(150 + Math.sin(i * 0.55) * 80)
          const x2 = (i + 1) * 32 + 20
          const y2 = round(150 + Math.sin((i + 1) * 0.55) * 80)
          return {
            type: 'rect' as const,
            x: x1,
            y: Math.min(y1, y2),
            width: x2 - x1,
            height: Math.max(2, Math.abs(y2 - y1)),
            fill: 'white',
            opacity: 0.5,
            rx: 1
          }
        })
      ]
    },
    {
      title: 'Curves',
      description: 'LinePath with switchable curve interpolations',
      to: '/charts/curves',
      elements: [
        ...Array.from({ length: 14 }, (_, i) => ({
          type: 'circle' as const,
          cx: i * 28 + 14,
          cy: round(150 + Math.sin(i * 0.5) * 90),
          r: 5,
          fill: 'white',
          opacity: 0.75
        })),
        ...Array.from({ length: 13 }, (_, i) => {
          const x1 = i * 28 + 14
          const y1 = round(150 + Math.sin(i * 0.5) * 90)
          const x2 = (i + 1) * 28 + 14
          const y2 = round(150 + Math.sin((i + 1) * 0.5) * 90)
          return {
            type: 'rect' as const,
            x: x1,
            y: Math.min(y1, y2),
            width: x2 - x1,
            height: Math.max(2, Math.abs(y2 - y1)),
            fill: 'white',
            opacity: 0.4,
            rx: 1
          }
        })
      ]
    },
    {
      title: 'Pies',
      description: 'Donut + inner pie with click-to-filter',
      to: '/charts/pies',
      elements: [
        ...Array.from({ length: 7 }, (_, i) => ({
          type: 'circle' as const,
          cx: round(200 + Math.cos((i / 7) * Math.PI * 2) * 95),
          cy: round(150 + Math.sin((i / 7) * Math.PI * 2) * 95),
          r: 36,
          fill: 'white',
          opacity: 0.15 + (i / 7) * 0.65
        })),
        ...Array.from({ length: 4 }, (_, i) => ({
          type: 'circle' as const,
          cx: round(200 + Math.cos((i / 4) * Math.PI * 2) * 45),
          cy: round(150 + Math.sin((i / 4) * Math.PI * 2) * 45),
          r: 22,
          fill: 'white',
          opacity: 0.5 + i * 0.1
        }))
      ]
    },
    {
      title: 'Heatmap',
      description: 'Rect & circle heatmap with color scale',
      to: '/charts/heatmap',
      elements: Array.from({ length: 30 }, (_, i) => ({
        type: 'rect' as const,
        x: (i % 6) * 65 + 10,
        y: Math.floor(i / 6) * 52 + 20,
        width: 56,
        height: 44,
        fill: 'white',
        opacity: 0.05 + ((i * 11) % 20) * 0.04,
        rx: 5
      }))
    },
    {
      title: 'Treemap',
      description: 'Squarified treemap + circle pack',
      to: '/charts/treemap',
      elements: [
        {
          type: 'rect' as const,
          x: 15,
          y: 15,
          width: 200,
          height: 150,
          fill: 'white',
          opacity: 0.7,
          rx: 6
        },
        {
          type: 'rect' as const,
          x: 225,
          y: 15,
          width: 155,
          height: 90,
          fill: 'white',
          opacity: 0.45,
          rx: 6
        },
        {
          type: 'rect' as const,
          x: 225,
          y: 115,
          width: 155,
          height: 50,
          fill: 'white',
          opacity: 0.25,
          rx: 6
        },
        {
          type: 'rect' as const,
          x: 15,
          y: 175,
          width: 120,
          height: 100,
          fill: 'white',
          opacity: 0.35,
          rx: 6
        },
        {
          type: 'rect' as const,
          x: 145,
          y: 175,
          width: 235,
          height: 100,
          fill: 'white',
          opacity: 0.18,
          rx: 6
        }
      ]
    },
    {
      title: 'Radar',
      description: 'Radial comparison chart with interactive points',
      to: '/charts/radar',
      elements: Array.from({ length: 6 }, (_, index) => ({
        type: 'circle' as const,
        cx: round(200 + Math.cos((index / 6) * Math.PI * 2) * (55 + (index % 2) * 35)),
        cy: round(150 + Math.sin((index / 6) * Math.PI * 2) * (55 + ((index + 1) % 2) * 35)),
        r: 10,
        fill: 'white',
        opacity: 0.2 + index * 0.1
      }))
    },
    {
      title: 'Sankey',
      description: 'Flow diagram with weighted links between stages',
      to: '/charts/sankey',
      elements: [
        {
          type: 'rect' as const,
          x: 20,
          y: 40,
          width: 32,
          height: 90,
          fill: 'white',
          opacity: 0.8,
          rx: 4
        },
        {
          type: 'rect' as const,
          x: 150,
          y: 20,
          width: 32,
          height: 70,
          fill: 'white',
          opacity: 0.65,
          rx: 4
        },
        {
          type: 'rect' as const,
          x: 150,
          y: 140,
          width: 32,
          height: 95,
          fill: 'white',
          opacity: 0.45,
          rx: 4
        },
        {
          type: 'rect' as const,
          x: 290,
          y: 50,
          width: 32,
          height: 80,
          fill: 'white',
          opacity: 0.8,
          rx: 4
        },
        {
          type: 'rect' as const,
          x: 290,
          y: 165,
          width: 32,
          height: 60,
          fill: 'white',
          opacity: 0.55,
          rx: 4
        }
      ]
    },
    {
      title: 'Dots',
      description: 'Scatter plot + bubble chart (planets)',
      to: '/charts/dots',
      elements: Array.from({ length: 35 }, (_, i) => ({
        type: 'circle' as const,
        cx: ((i * 139) % 370) + 15,
        cy: ((i * 157) % 260) + 20,
        r: (i % 8) + 4,
        fill: 'white',
        opacity: 0.1 + (i % 9) * 0.08
      }))
    },
    {
      title: 'XYChart',
      description: 'Full chart system — axes, grid, multi-series, tooltips',
      to: '/charts/xychart',
      elements: [
        ...Array.from({ length: 8 }, (_, i) => ({
          type: 'rect' as const,
          x: i * 46 + 20,
          y: 280 - ((i % 5) + 2) * 42,
          width: 36,
          height: ((i % 5) + 2) * 42,
          fill: 'white',
          opacity: 0.2 + (i / 8) * 0.6,
          rx: 3
        })),
        ...Array.from({ length: 10 }, (_, i) => ({
          type: 'circle' as const,
          cx: i * 38 + 20,
          cy: round(100 + Math.sin(i * 0.6) * 55),
          r: 4,
          fill: 'white',
          opacity: 0.8
        }))
      ]
    }
  ]

  return { chartTiles }
}
