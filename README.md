<h1 align="center">visx-vue</h1>

<p align="center">
  <b>Vue 3 visualization components, powered by visx primitives.</b><br>
  Low-level SVG building blocks. Composable. TypeScript-first. No opinions on styling.
</p>

<p align="center">
  <a href="https://nuxtcharts.com/visx-vue/">
    <img src="https://nuxtcharts.com/visx-vue/hero-image.png" alt="visx-vue" width="100%">
  </a>
</p>

> **Experimental** — may be used in a future version of [nuxt-charts](https://nuxtcharts.com/).

<p align="center">
  <img src="https://img.shields.io/badge/Vue-3.4+-42b883?style=flat-square" alt="Vue 3.4+">
  <img src="https://img.shields.io/badge/TypeScript-5.x-3178c6?style=flat-square" alt="TypeScript">
  <img src="https://img.shields.io/badge/license-MIT-green?style=flat-square" alt="MIT License">
</p>

<p align="center">
  <a href="#install">Install</a> -
  <a href="#packages">Packages</a> -
  <a href="#usage">Usage</a> -
  <a href="#development">Development</a> -
  <a href="#contributing">Contributing</a> -
  <a href="https://nuxtcharts.com/visx-vue/">Examples</a>
</p>

> [!WARNING]
> This project is currently **experimental** and under active development.

---

## Install

Install individual packages as needed:

```bash
pnpm add @visx-vue/shape @visx-vue/scale @visx-vue/axis
```

Each package is standalone. Peer dependency: `vue ^3.4.0`.

## Packages

40 packages organized by visualization concern.

### Primitives

| Package               | Components                                                                                                                                                                                                                |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `@visx-vue/shape`     | `Arc`, `Area`, `AreaClosed`, `AreaStack`, `Bar`, `BarGroup`, `BarGroupHorizontal`, `BarRounded`, `BarStack`, `BarStackHorizontal`, `Circle`, `Line`, `LinePath`, `LineRadial`, `Pie`, `Polygon`, `SplitLinePath`, `Stack` |
| `@visx-vue/group`     | `Group`                                                                                                                                                                                                                   |
| `@visx-vue/text`      | SVG text with word-wrap                                                                                                                                                                                                   |
| `@visx-vue/clip-path` | `ClipPath`                                                                                                                                                                                                                |
| `@visx-vue/marker`    | SVG marker definitions                                                                                                                                                                                                    |
| `@visx-vue/glyph`     | Glyph shapes for scatterplots                                                                                                                                                                                             |

### Axes & Grids

| Package          | Components                                                                |
| ---------------- | ------------------------------------------------------------------------- |
| `@visx-vue/axis` | `Axis`, `AxisBottom`, `AxisTop`, `AxisLeft`, `AxisRight`                  |
| `@visx-vue/grid` | `Grid`, `GridRows`, `GridColumns`, `GridAngle`, `GridPolar`, `GridRadial` |

### Scale

| Package           | Exports                                           |
| ----------------- | ------------------------------------------------- |
| `@visx-vue/scale` | `createScale`, scale operators, D3 scale wrappers |
| `@visx-vue/curve` | D3 curve presets                                  |

### Chart Types

| Package               | Components                                                                                                       |
| --------------------- | ---------------------------------------------------------------------------------------------------------------- |
| `@visx-vue/xychart`   | Full XY chart system with context, hooks, themes                                                                 |
| `@visx-vue/hierarchy` | `Tree`, `Treemap`, `Pack`, `Cluster`, `Partition`                                                                |
| `@visx-vue/network`   | `Graph`, `Nodes`, `Links`                                                                                        |
| `@visx-vue/heatmap`   | `HeatmapRect`, `HeatmapCircle`                                                                                   |
| `@visx-vue/chord`     | Chord diagrams                                                                                                   |
| `@visx-vue/sankey`    | Sankey diagrams                                                                                                  |
| `@visx-vue/geo`       | `Mercator`, `Albers`, `AlbersUsa`, `Orthographic`, `NaturalEarth`, `EqualEarth`, `CustomProjection`, `Graticule` |
| `@visx-vue/wordcloud` | `Wordcloud`                                                                                                      |
| `@visx-vue/delaunay`  | Delaunay triangulation                                                                                           |
| `@visx-vue/voronoi`   | Voronoi diagrams                                                                                                 |
| `@visx-vue/stats`     | Statistical charts                                                                                               |
| `@visx-vue/threshold` | Threshold areas                                                                                                  |

### Interaction

| Package                | Exports                                                                               |
| ---------------------- | ------------------------------------------------------------------------------------- |
| `@visx-vue/tooltip`    | `Tooltip`, `TooltipWithBounds`, `TooltipInPortal`, `useTooltip`, `useTooltipInPortal` |
| `@visx-vue/zoom`       | `Zoom`, `useZoom`                                                                     |
| `@visx-vue/brush`      | `Brush`, `BaseBrush`                                                                  |
| `@visx-vue/drag`       | `Drag`, `useDrag`                                                                     |
| `@visx-vue/event`      | Mouse/touch event utilities                                                           |
| `@visx-vue/bounds`     | Element bounds composable                                                             |
| `@visx-vue/responsive` | Responsive container composable                                                       |

### Decoration

| Package                | Exports                                                        |
| ---------------------- | -------------------------------------------------------------- |
| `@visx-vue/legend`     | `Legend`, `Linear`, `Ordinal`, `Quantile`, `Size`, `Threshold` |
| `@visx-vue/gradient`   | SVG gradient definitions                                       |
| `@visx-vue/pattern`    | SVG pattern definitions                                        |
| `@visx-vue/annotation` | Chart annotations                                              |

### Utilities

| Package               | Exports                         |
| --------------------- | ------------------------------- |
| `@visx-vue/point`     | Point math                      |
| `@visx-vue/spring`    | Spring animation helpers        |
| `@visx-vue/mock-data` | Sample datasets for development |
| `@visx-vue/vendor`    | Vendored D3 internals           |

## Usage

```vue
<script setup lang="ts">
import { BarStack } from '@visx-vue/shape'
import { AxisBottom, AxisLeft } from '@visx-vue/axis'
import { createScale } from '@visx-vue/scale'
import { Grid } from '@visx-vue/grid'
import { useTooltip, TooltipWithBounds } from '@visx-vue/tooltip'

const { tooltipData, tooltipLeft, tooltipTop, showTooltip, hideTooltip } = useTooltip()
</script>

<template>
  <svg
    :width="width"
    :height="height"
  >
    <Grid
      :x-scale="xScale"
      :y-scale="yScale"
      :width="innerWidth"
      :height="innerHeight"
    />
    <BarStack
      :data="data"
      :x-scale="xScale"
      :y-scale="yScale"
      :keys="keys"
      :color="colorScale"
    />
    <AxisBottom
      :scale="xScale"
      :top="innerHeight"
    />
    <AxisLeft :scale="yScale" />
  </svg>
  <TooltipWithBounds
    v-if="tooltipData"
    :top="tooltipTop"
    :left="tooltipLeft"
  >
    {{ tooltipData }}
  </TooltipWithBounds>
</template>
```

## Development

Monorepo using pnpm + Turborepo + Vite+.

```bash
# install
pnpm install

# run demo app
pnpm dev

# build all packages
pnpm build

# test
pnpm test

# type check
pnpm typecheck

# lint + format + type check
pnpm check
```

Demo app lives in `packages/visx-demo` (Experimental).

## Architecture

```
packages/
  visx-vue-shape/       - SVG shape primitives
  visx-vue-axis/        - Axis components
  visx-vue-scale/       - D3 scale wrappers
  visx-vue-xychart/     - Full XY chart system
  visx-vue-tooltip/     - Tooltip + portal
  visx-vue-zoom/        - Pan/zoom
  visx-vue-brush/       - Brush selection
  visx-demo/            - Interactive demo app (Experimental)
  ...
```

All packages: ES module + CJS dual output, full `.d.ts` types.

## Contributing

Contributions welcome. Open an issue or PR.

- Each package is independent — changes are isolated
- Run `vp check && vp test` before submitting
- Follow existing component patterns (Vue 3 `<script setup>` + TSX for renderless logic)

## License

MIT
