---
title: scale
description: visx-vue-scale provides scale creation utilities.
---

# @visx-vue/scale

The `@visx-vue/scale` package provides a set of powerfull utilities for creating and updating D3 scales.

## Installation

```bash
pnpm add @visx-vue/scale
```

## Scale Functions

The package provides factory functions for creating various types of scales:

- **scaleLinear**: For continuous quantitative data.
- **scaleLog**: For quantitative data with an exponential relationship.
- **scalePower**: For quantitative data with a power relationship.
- **scaleSymlog**: For quantitative data with a symmetric log scale.
- **scaleTime**: For time-series data.
- **scaleUtc**: For time-series data in UTC.
- **scaleBand**: For discrete categorical data (bars, etc.).
- **scalePoint**: For discrete points.
- **scaleOrdinal**: For mapping domain to a specific range.
- **scaleQuantize**: For mapping continuous domain to discrete range.
- **scaleQuantile**: For mapping continuous domain to discrete range based on quantiles.
- **scaleThreshold**: For mapping domain to range based on thresholds.

## Usage Example

```vue
<script setup lang="ts">
import { scaleLinear, scaleBand } from '@visx-vue/scale'

const width = 500
const height = 300

const xScale = scaleBand({
  domain: ['a', 'b', 'c'],
  range: [0, width],
  padding: 0.2
})

const yScale = scaleLinear({
  domain: [0, 100],
  range: [height, 0],
  nice: true
})
</script>

<template>
  <div>
    <p>Scale Linear (0 -> 100): {{ yScale(50) }}px</p>
    <p>Scale Band ('b'): {{ xScale('b') }}px</p>
  </div>
</template>
```
