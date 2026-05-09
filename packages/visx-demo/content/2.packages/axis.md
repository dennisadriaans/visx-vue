---
title: axis
description: visx-vue-axis provides axis components for charting.
---

# @visx-vue/axis

The `@visx-vue/axis` package provides highly customizable axis components that allow you to easily add axes to your SVG charts.

## Installation

```bash
pnpm add @visx-vue/axis
```

## Components

### Axis

- **Axis**: The core axis component that can be used to build any axis.
- **AxisBottom**: A shortcut for a bottom-oriented axis.
- **AxisTop**: A shortcut for a top-oriented axis.
- **AxisLeft**: A shortcut for a left-oriented axis.
- **AxisRight**: A shortcut for a right-oriented axis.

### Supporting Components

- **Ticks**: Renders axis ticks.
- **AxisRenderer**: Internal renderer for axis elements.

## Usage Example

```vue
<script setup lang="ts">
import { AxisBottom, AxisLeft } from "@visx-vue/axis";
import { scaleLinear } from "@visx-vue/scale";

const xScale = scaleLinear({ domain: [0, 10], range: [0, 400] });
const yScale = scaleLinear({ domain: [0, 100], range: [200, 0] });
</script>

<template>
  <svg width="500" height="300">
    <g transform="translate(50, 20)">
      <AxisLeft :scale="yScale" label="Value" />
      <g transform="translate(0, 200)">
        <AxisBottom :scale="xScale" label="Time" />
      </g>
    </g>
  </svg>
</template>
```
