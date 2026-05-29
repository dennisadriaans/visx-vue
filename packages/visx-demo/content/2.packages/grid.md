---
title: grid
description: visx-vue-grid provides chart grid components.
---

# @visx-vue/grid

The `@visx-vue/grid` package provides components for rendering grid lines on your charts.

## Installation

```bash
pnpm add @visx-vue/grid
```

## Components

### Linear Grids

- **Grid**: A composite component for both rows and columns.
- **GridRows**: Renders horizontal grid lines.
- **GridColumns**: Renders vertical grid lines.

### Polar Grids

- **GridAngle**: Renders angular grid lines for radial charts.
- **GridRadial**: Renders radial grid lines for radial charts.
- **GridPolar**: A composite component for polar grids.

## Usage Example

```vue
<script setup lang="ts">
import { GridRows, GridColumns } from '@visx-vue/grid'
import { scaleLinear } from '@visx-vue/scale'

const width = 500
const height = 400

const xScale = scaleLinear({ domain: [0, 10], range: [0, width] })
const yScale = scaleLinear({ domain: [0, 100], range: [height, 0] })
</script>

<template>
  <svg
    :width="width"
    :height="height"
  >
    <GridRows
      :scale="yScale"
      :width="width"
      stroke="#e0e0e0"
    />
    <GridColumns
      :scale="xScale"
      :height="height"
      stroke="#e0e0e0"
    />
  </svg>
</template>
```
