---
title: shape
description: visx-vue-shape package provides SVG shape primitives.
---

# @visx-vue/shape

The `@visx-vue/shape` package provides a set of low-level SVG shape primitives that are highly customizable and composable.

## Installation

```bash
pnpm add @visx-vue/shape
```

## Components

The following components are available in `@visx-vue/shape`:

### Area

- **Area**: Renders an SVG path for an area.
- **AreaClosed**: Renders a closed SVG area.
- **AreaStack**: Renders a stacked area chart.

### Bar

- **Bar**: Renders a simple SVG rectangle.
- **BarGroup**: Groups bars for grouped bar charts.
- **BarGroupHorizontal**: Horizontal version of BarGroup.
- **BarRounded**: Renders a bar with rounded corners.
- **BarStack**: Stacks bars for stacked bar charts.
- **BarStackHorizontal**: Horizontal version of BarStack.

### Line

- **Line**: Renders a simple SVG line.
- **LinePath**: Renders an SVG path for a line.
- **LineRadial**: Renders a radial line path.

### Pie & Arc

- **Pie**: Renders an SVG pie chart.
- **Arc**: Renders an SVG arc.

### Other Shapes

- **Circle**: Renders an SVG circle.
- **Polygon**: Renders an SVG polygon.
- **Stack**: Generic stack primitive.
- **SplitLinePath**: Renders a line path that can be split into multiple segments.

## Usage Example

```vue
<script setup lang="ts">
import { Bar } from '@visx-vue/shape'

const width = 500
const height = 100
</script>

<template>
  <svg
    :width="width"
    :height="height"
  >
    <Bar
      :x="0"
      :y="0"
      :width="width"
      :height="height"
      fill="steelblue"
    />
  </svg>
</template>
```
